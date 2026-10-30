// Gemerkte Videos/Songs mit dem Konto abgleichen, damit die Liste auf
// Handy, Tablet und Rechner dieselbe ist. Bis 28.10. lagen sie nur im
// Browser-Speicher des jeweiligen Geräts.
//
// Abgelegt in statistik.ki_nutzung (JSON-Spalte, wie der Kalender) –
// eine eigene Tabelle bräuchte eine Datenbank-Änderung.
//
// Gelöschte Videos merken wir uns mit Zeitpunkt ("Grabsteine"). Sonst
// käme ein auf dem Tablet gelöschtes Video beim nächsten Abgleich vom
// Handy zurück, das es noch in seiner Liste hat.
import { db } from './supabase.js'

export function ladeGeloeschteLokal() {
  try {
    return JSON.parse(localStorage.getItem('videos_geloescht')) || {}
  } catch {
    return {}
  }
}

export function speichereGeloeschteLokal(geloescht) {
  localStorage.setItem('videos_geloescht', JSON.stringify(geloescht))
}

// Zwei Stände vereinen: alle Videos von beiden Seiten, außer sie wurden
// NACH dem Merken irgendwo gelöscht.
export function vereineVideos(a, b) {
  const geloescht = { ...(a.geloescht || {}) }
  for (const [id, zeit] of Object.entries(b.geloescht || {})) {
    if (!geloescht[id] || zeit > geloescht[id]) geloescht[id] = zeit
  }
  const nachId = new Map()
  for (const v of [...(b.videos || []), ...(a.videos || [])]) {
    if (!v?.videoId) continue
    const da = nachId.get(v.videoId)
    if (!da || (v.addedAt ?? 0) >= (da.addedAt ?? 0)) nachId.set(v.videoId, v)
  }
  const videos = [...nachId.values()].filter((v) => !(geloescht[v.videoId] >= (v.addedAt ?? 0)))
  videos.sort((x, y) => (x.addedAt ?? 0) - (y.addedAt ?? 0))
  return { videos, geloescht }
}

async function ladeKiNutzung(nutzerId) {
  const { data, error } = await db
    .from('statistik')
    .select('ki_nutzung')
    .eq('nutzer_id', nutzerId)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data?.ki_nutzung ?? {}
}

// Lokalen Stand mit dem Konto vereinen, zurückschreiben und das
// Ergebnis liefern.
export async function gleicheVideosAb(nutzerId, lokal) {
  const alt = await ladeKiNutzung(nutzerId)
  const vereint = vereineVideos(lokal, {
    videos: alt.gemerkte_videos,
    geloescht: alt.videos_geloescht,
  })
  // Beide Schlüssel einzeln, nicht die ganze Spalte: Dort legen auch
  // sync.js (verlauf) und geraeteSync.js (geraete) etwas ab, und wer
  // alles zurückschreibt, verliert deren Änderungen seit dem Lesen.
  const { error } = await db.rpc('ki_nutzung_setzen', {
    schluessel: 'gemerkte_videos',
    wert: vereint.videos,
  })
  if (error) throw new Error(error.message)
  const { error: f2 } = await db.rpc('ki_nutzung_setzen', {
    schluessel: 'videos_geloescht',
    wert: vereint.geloescht,
  })
  if (f2) throw new Error(f2.message)
  return vereint
}
