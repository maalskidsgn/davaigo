/**
 * Die Videos des Lesekurses.
 *
 * Sie liegen nicht im App-Paket und nicht im öffentlichen Webordner,
 * sondern auf dem Server unter LESEKURS_VIDEOS. Ein <video>-Element
 * kann keinen Anmelde-Kopf schicken. Deshalb fragt die App zuerst
 * nach einer Adresse, und der Server unterschreibt sie für drei
 * Stunden, wenn das Konto Premium hat.
 *
 * Bewusst NICHT istPremium() aus gespraech.js: Dort steht für Davaigo
 * noch die Testphase "alles frei". Sie würde die Kauf-Lektionen für
 * jeden öffnen. Hier zählt immer das echte Abo aus "abos".
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const ANZAHL = 16
const FREI = new Set([1])
const GUELTIG_SEKUNDEN = 3 * 3600
const SPRACHEN = ['de', 'en']

const ablage = () => process.env.LESEKURS_VIDEOS || '/data/lesekurs'

function geheim() {
  const g = process.env.LESEKURS_GEHEIM || process.env.SUPABASE_SERVICE_KEY
  if (!g) throw new Error('Kein Schlüssel für die Video-Adressen hinterlegt.')
  return crypto.createHash('sha256').update('lesekurs|' + g).digest()
}

function unterschrift(sprache, nr, bis) {
  return crypto.createHmac('sha256', geheim()).update(`${sprache}|${nr}|${bis}`).digest('base64url')
}

function dateiVon(sprache, nr) {
  return path.join(ablage(), sprache, `lektion-${String(nr).padStart(2, '0')}.mp4`)
}

/** Der echte Stand aus "abos", auch für App-Käufe: RevenueCat schreibt dorthin. */
async function hatAbo(nutzerId) {
  const antwort = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/abos?select=status,laeuft_ab&nutzer_id=eq.${encodeURIComponent(nutzerId)}`,
    { headers: { apikey: process.env.SUPABASE_SERVICE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}` } }
  )
  if (!antwort.ok) return false
  const abo = (await antwort.json())[0]
  if (!abo || abo.status === 'abgelaufen') return false
  return abo.laeuft_ab === null || new Date(abo.laeuft_ab) > new Date()
}

function pruefeNummer(wert) {
  const nr = Number(wert)
  return Number.isInteger(nr) && nr >= 1 && nr <= ANZAHL ? nr : null
}

/**
 * Antwort für die App: die Adresse oder "gesperrt".
 * Fehlt die englische Fassung noch, kommt die deutsche. So geht nichts
 * kaputt, solange nicht alle Videos auf dem Server liegen.
 */
export async function zugang(nutzer, { nr: roh, sprache: wunsch }) {
  const nr = pruefeNummer(roh)
  if (!nr) return { status: 400, daten: { error: 'Diese Lektion gibt es nicht.' } }

  if (!FREI.has(nr)) {
    if (!nutzer) return { status: 200, daten: { gesperrt: true, anmelden: true } }
    if (!(await hatAbo(nutzer.id))) return { status: 200, daten: { gesperrt: true } }
  }

  const gewuenscht = SPRACHEN.includes(wunsch) ? wunsch : 'de'
  const sprache = fs.existsSync(dateiVon(gewuenscht, nr)) ? gewuenscht : 'de'
  if (!fs.existsSync(dateiVon(sprache, nr))) {
    return { status: 503, daten: { error: 'Das Video ist gerade nicht verfügbar.' } }
  }
  const bis = Math.floor(Date.now() / 1000) + GUELTIG_SEKUNDEN
  return {
    status: 200,
    daten: {
      gesperrt: false,
      sprache,
      pfad: `/api/lesekurs/video/${sprache}/${nr}?bis=${bis}&sig=${unterschrift(sprache, nr, bis)}`,
    },
  }
}

/** Liefert das Video. sendFile beherrscht Range, das braucht vor allem Safari/iOS. */
export function video(req, res) {
  const nr = pruefeNummer(req.params.nr)
  const { sprache } = req.params
  if (!nr || !SPRACHEN.includes(sprache)) return res.sendStatus(404)

  const bis = Number(req.query.bis)
  const sig = String(req.query.sig ?? '')
  const erwartet = Buffer.from(unterschrift(sprache, nr, bis))
  const gegeben = Buffer.from(sig)
  const echt = erwartet.length === gegeben.length && crypto.timingSafeEqual(erwartet, gegeben)
  if (!echt || !(bis > Date.now() / 1000)) return res.sendStatus(403)

  res.sendFile(dateiVon(sprache, nr), {
    headers: { 'Cache-Control': 'private, max-age=3600', 'Content-Type': 'video/mp4' },
  }, (fehler) => {
    if (fehler && !res.headersSent) res.sendStatus(fehler.status || 404)
  })
}
