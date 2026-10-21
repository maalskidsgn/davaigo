// Die Ton-Zentrale der App.
//
// Heute spricht die Browser-Stimme. Später liegen fertige
// ElevenLabs-Aufnahmen im Supabase-Speicher – und zwar unter einem
// Namen, der aus dem TEXT SELBST berechnet wird (einer Prüfsumme).
//
// Warum das klug ist: Ändern wir eine Lektionszeile, ändert sich
// automatisch der Dateiname. Die App findet dann keine (veraltete)
// Aufnahme mehr und fällt auf die Browser-Stimme zurück, bis das
// Vertonungs-Skript die neue Datei erzeugt hat. Es kann also nie
// ein Audio laufen, das nicht zum Text passt.

import { sprich } from './sprich.js'
import { istApp } from './api.js'
import {
  STIMMEN,
  sprechText,
  stimmeImDialog,
  dateiName,
  pruefsummeQuelle,
} from './stimmen.js'

export { STIMMEN, sprechText, stimmeImDialog }

// Wo die fertigen Aufnahmen liegen.
//
// Im Browser im eigenen Ordner – gleiche Herkunft, nichts weiter zu
// bedenken.
//
// In der Store-App dagegen vom Server. Der Grund ist die Paketgröße:
// 4.221 Aufnahmen sind 92 MB, das Paket wäre damit 98 MB statt 4 MB
// groß. Über etwa 100 MB warnt Android beim Herunterladen über
// Mobilfunk, und viele brechen dann ab.
//
// Der Preis dafür: Ohne Netz spricht die Gerätestimme. Der Weg
// dorthin ist in spiele() ohnehin schon gebaut – fehlt eine Datei,
// fällt die App von selbst zurück.
const ABLAGE = istApp ? 'https://davaigo.de/audio' : '/audio'

/** Prüfsumme aus Text + Stimme – ergibt den Dateinamen. */
export async function audioName(text, stimme = STIMMEN.standard) {
  const daten = new TextEncoder().encode(pruefsummeQuelle(text, stimme))
  const hash = await crypto.subtle.digest('SHA-256', daten)
  const hex = [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return dateiName(hex)
}

// Merkt sich pro Sitzung, welche Dateien existieren (oder fehlen),
// damit wir nicht bei jedem Klick erneut nachfragen.
const bekannt = new Map()
let laufend = null // das gerade spielende Audio

/**
 * Spielt einen Text ab: echte Aufnahme, wenn vorhanden – sonst
 * Gerätestimme.
 *
 * Gibt zurück, WAS gespielt wurde und WANN es vorbei ist:
 *
 *   { art: 'datei' | 'browser', fertig: Promise<'ende'|'fehler'|'unterbrochen'> }
 *
 * Das Versprechen gehört zu GENAU dieser Wiedergabe. Vorher musste
 * sich der Aufrufer am Modul-weiten `laufend` bedienen – und das
 * zeigt nach jedem anderen Tonaufruf woandershin. Tippte jemand
 * während eines Dialogs auf ein 🔊, wartete der Dialog auf ein Audio,
 * das inzwischen pausiert war: Die Blasen blieben stehen, während
 * der angetippte Ton lief.
 *
 * @param {string} text
 * @param {object} [opt]
 * @param {string} [opt.stimme]  – eine Kennung aus STIMMEN
 * @param {number} [opt.tempo]   – 1 = normal, 0.75 = langsam
 */
export async function spiele(text, { stimme = STIMMEN.standard, tempo = 1 } = {}) {
  const name = await audioName(text, stimme)
  const url = `${ABLAGE}/${name}`

  // Läuft schon etwas? Stoppen – wie bei der Gerätestimme auch.
  if (laufend) {
    laufend.pause()
    laufend = null
  }

  let vorhanden = bekannt.get(name)
  if (vorhanden === undefined) {
    try {
      const antwort = await fetch(url, { method: 'HEAD' })
      vorhanden = antwort.ok
    } catch {
      vorhanden = false
    }
    bekannt.set(name, vorhanden)
  }

  if (vorhanden) {
    const ton = new Audio(url)
    ton.playbackRate = tempo
    // Browser halten beim Verlangsamen die Tonhöhe – klingt also
    // nach "langsam gesprochen", nicht nach Zeitlupe.
    ton.preservesPitch = true
    laufend = ton

    // Die Horcher hängen VOR play(). Ein sehr kurzer Schnipsel kann
    // sonst zu Ende sein, bevor sie stehen – dann käme das Ende nie
    // an und der Dialog bliebe hängen.
    const fertig = new Promise((aufloesen) => {
      let erledigt = false
      const melde = (grund) => {
        if (erledigt) return
        erledigt = true
        aufloesen(grund)
      }
      ton.addEventListener('ended', () => melde('ende'), { once: true })
      ton.addEventListener('error', () => melde('fehler'), { once: true })
      // 'pause' heißt: jemand anderes hat den Ton übernommen.
      //
      // ABER: Am natürlichen Ende feuert der Browser ERST 'pause' und
      // danach 'ended'. Ohne die Abfrage auf ton.ended gälte jede
      // normal zu Ende gespielte Zeile als Unterbrechung – der Dialog
      // hörte dann nach der ersten Blase auf.
      ton.addEventListener(
        'pause',
        () => { if (!ton.ended) melde('unterbrochen') },
        { once: true }
      )
    })

    try {
      await ton.play()
      return { art: 'datei', fertig }
    } catch {
      // Abspielen blockiert (auf iOS z.B. alles, was nicht direkt aus
      // einem Fingertipp kommt). Wichtig: `laufend` wieder freigeben,
      // sonst wartet der nächste Aufrufer auf ein Audio, das nie
      // losläuft – genau daran hing der Dialog auf dem iPhone fest.
      if (laufend === ton) laufend = null
    }
  }

  return { art: 'browser', fertig: sprich(sprechText(text)) }
}

/**
 * Spielt einen ganzen Dialog als Gespräch ab, Zeile für Zeile mit
 * kurzer Pause. Bricht ab, wenn stop() aufgerufen wird.
 *
 * @param {object} [opt]
 * @param {(index: number) => void} [opt.beiZeile] – wird gerufen,
 *   sobald eine Zeile WIRKLICH erklingt. Damit läuft die Anzeige mit
 *   dem Ton statt nach eigenem Takt.
 */
export function dialogAbspielen(dialog, { beiZeile } = {}) {
  let gestoppt = false

  const lauf = (async () => {
    for (const [index, zeile] of dialog.entries()) {
      if (gestoppt) return

      const wiedergabe = await spiele(zeile.es, {
        stimme: stimmeImDialog(dialog, zeile.sprecher),
      })
      if (gestoppt) return

      // Erst jetzt die Blase zeigen: Vorher stand sie schon da,
      // während die Datei noch gesucht wurde. Über eine Mobilfunk-
      // verbindung sind das je Zeile schnell ein paar Zehntel, um
      // die der Text dem Ton vorauslief.
      beiZeile?.(index)

      const grund = await wiedergabe.fertig
      if (gestoppt) return

      // Hat jemand dazwischen etwas anderes angetippt, gehört ihm
      // der Ton. Dann still aufhören, statt gegen die neue Stimme
      // anzureden.
      if (grund === 'unterbrochen') return

      await new Promise((f) => setTimeout(f, 450)) // Atempause
    }
  })()

  return {
    fertig: lauf,
    stop() {
      gestoppt = true
      if (laufend) laufend.pause()
      try { speechSynthesis.cancel() } catch { /* kein Ton da */ }
    },
  }
}
