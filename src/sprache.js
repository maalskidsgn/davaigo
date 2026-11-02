/**
 * Die Sprache der Oberfläche: Deutsch oder Englisch.
 *
 * Davaigo bringt Leuten Russisch bei – in welcher Sprache erklärt
 * wird, ist eine andere Frage. Gesprochen wird immer Russisch, nur
 * Beschriftungen, Übersetzungen und Erklärungen wechseln.
 *
 * Der deutsche Text bleibt im Code stehen und ist zugleich der
 * Schlüssel:  tr('Weiter')  ergibt auf Deutsch "Weiter", auf Englisch
 * "Continue". Fehlt eine Übersetzung, kommt der deutsche Text – eine
 * halb übersetzte App ist unschön, aber besser als ein leerer Knopf.
 *
 * Die Sprache wird EINMAL beim Start festgelegt; ein Wechsel lädt die
 * App neu (siehe setzeSprache). Anders als in Habloos Zwischenstand,
 * wo jede Komponente auf den Wechsel lauscht. Das hat einen Grund:
 * Viele Texte stehen in Konstanten, die beim Laden des Moduls
 * entstehen, und die 180 Lektionen werden beim Laden als Ganzes
 * getauscht. Ein Sprachwechsel ist selten, ein vergessener Zuhörer
 * dagegen ein Fehler, den man erst in der fertigen App sieht.
 */

import OBERFLAECHE_EN from './texte/oberflaeche-en.js'
import { PAARE, TEXTE } from './texte/inhalte-en.js'
import { durchlaufe } from './texte/durchlaufe.js'

/** Welche Sprachen die Oberfläche kann. */
export const SPRACHEN = [
  ['de', 'Deutsch'],
  ['en', 'English'],
]

const SCHLUESSEL = 'oberflaeche-sprache'
const NACH_WECHSEL = 'sprache-gerade-gewechselt'
const IM_BROWSER = typeof window !== 'undefined'

/**
 * Erst die eigene Wahl, sonst die des Geräts. Wer sein Gerät nicht auf
 * Deutsch stehen hat, bekommt Englisch – das versteht ein Franzose
 * eher als Deutsch, und eine dritte Sprache gibt es nicht.
 */
function ermittle() {
  if (!IM_BROWSER) return 'de' // Prüfskripte beim Bauen laufen auf Deutsch
  try {
    const gewaehlt = localStorage.getItem(SCHLUESSEL)
    if (gewaehlt === 'de' || gewaehlt === 'en') return gewaehlt
  } catch {
    /* privater Modus – dann eben die Gerätesprache */
  }
  return (navigator.language || 'de').toLowerCase().startsWith('de') ? 'de' : 'en'
}

const aktuell = ermittle()

/** Einmalig wahr direkt nach einem Sprachwechsel. */
export function geradeGewechselt() {
  try {
    const war = sessionStorage.getItem(NACH_WECHSEL) === '1'
    sessionStorage.removeItem(NACH_WECHSEL)
    return war
  } catch {
    return false
  }
}

/** Das Kürzel der laufenden Sprache: 'de' oder 'en'. */
export function sprache() {
  return aktuell
}

/** Für Zahlen und Datumsangaben: 'de-DE' oder 'en-GB'. */
export function gebiet() {
  return aktuell === 'en' ? 'en-GB' : 'de-DE'
}

/** Sprache wechseln. Die Wahl gilt ab dem Neuladen, das hier passiert. */
export function setzeSprache(neu) {
  if ((neu !== 'de' && neu !== 'en') || neu === aktuell) return
  try {
    localStorage.setItem(SCHLUESSEL, neu)
    // Wer unter "Mehr" umstellt, soll dort bleiben und nicht auf dem Start landen.
    sessionStorage.setItem(NACH_WECHSEL, '1')
  } catch {
    return // Ohne Speicher käme nach dem Neuladen die alte Sprache zurück
  }
  window.location.reload()
}

/**
 * Ein Oberflächentext. Platzhalter stehen als {0}, {1} im Schlüssel:
 *   tr('Noch {0} Wörter', zahl)
 */
export function tr(deutsch, ...werte) {
  const text = aktuell === 'en' ? (OBERFLAECHE_EN[deutsch] ?? deutsch) : deutsch
  if (werte.length === 0) return text
  return text.replace(/\{(\d+)\}/g, (ganz, nr) => (nr in werte ? String(werte[nr]) : ganz))
}

/**
 * Tauscht in Lerninhalten die deutschen Texte gegen die englischen.
 * Ändert das Objekt selbst und gibt es zurück. Die Module rufen das
 * direkt nach ihrer Definition auf; alles, was daraus entsteht (auch
 * die Übungen), ist danach automatisch englisch – ohne dass eine
 * einzige Anzeige-Stelle davon wissen muss.
 */
export function lokalisiere(inhalt) {
  if (aktuell !== 'en') return inhalt
  durchlaufe(inhalt, {
    paar: (ru, de) => PAARE[ru + '\t' + de] ?? de,
    text: (de) => TEXTE[de] ?? de,
  })
  return inhalt
}

// Jede Anfrage an unseren Server trägt die Sprache mit, damit die KI in
// ihr antwortet. Bewusst als Adress-Parameter und nicht als Kopfzeile:
// Eine eigene Kopfzeile bräuchte die Freigabe des Servers (CORS), und
// ein noch nicht aktualisierter Server würde jede Anfrage abweisen.
// Den Parameter ignoriert er einfach.
if (IM_BROWSER && aktuell === 'en' && window.fetch) {
  const original = window.fetch.bind(window)
  window.fetch = (ziel, optionen) => {
    if (typeof ziel === 'string' && ziel.includes('/api/') && !ziel.includes('sprache=')) {
      ziel += (ziel.includes('?') ? '&' : '?') + 'sprache=en'
    }
    return original(ziel, optionen)
  }
}

if (IM_BROWSER) {
  document.documentElement.lang = aktuell
  if (aktuell === 'en') document.title = 'Davaigo – Learn Russian with real videos'
}
