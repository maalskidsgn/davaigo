// Liest einen Text mit der russischen Stimme des Geräts vor.
// Kostet nichts, funktioniert offline – die Stimme kommt vom
// Betriebssystem.
//
// Warum hier ausgewählt statt dem Browser überlassen? Ein Gerät hat
// oft ein Dutzend russische Stimmen, darunter Apples Scherzstimmen
// (Grandma, Grandpa, Rocko, Bubbles). Ohne Auswahl nimmt der Browser
// irgendeine davon – und der Nutzer lernt Aussprache von einer
// Karikatur. Deshalb suchen wir bewusst die beste und bleiben
// dann dabei.

// Bekannte gute Ansagestimmen, in dieser Reihenfolge bevorzugt.
// Mónica ist die Standard-Spanierin auf Apple-Geräten, Helena und
// Laura sind die Gegenstücke auf Windows und Android.
const GUTE = ['milena', 'katya', 'irina', 'svetlana', 'yuri', 'dariya', 'pavel']

// Apples Scherz- und Effektstimmen. Sie melden sich als vollwertige
// russische Stimmen, klingen aber verstellt.
const SCHERZ = /grandma|grandpa|rocko|flo|eddy|shelley|sandy|reed|bubbles|bells|boing|jester|organ|superstar|trinoids|whisper|wobble|zarvox|albert|bad news|good news/i

let gewaehlt // einmal gesucht, dann gemerkt

function besteStimme() {
  if (gewaehlt !== undefined) return gewaehlt

  const alle = speechSynthesis.getVoices()
  if (!alle.length) return undefined // Liste noch nicht geladen – später erneut

  const russisch = alle.filter(
    (s) => s.lang?.toLowerCase().startsWith('ru') && !SCHERZ.test(s.name)
  )
  if (!russisch.length) return (gewaehlt = null)

  const punkte = (s) => {
    const name = s.name.toLowerCase()
    let p = 0
    const rang = GUTE.findIndex((g) => name.includes(g))
    if (rang >= 0) p += 100 - rang          // eine bekannt gute Stimme
    if (s.lang.toLowerCase().startsWith('ru-ru')) p += 20 // Russland passt zum Kurs
    if (s.localService) p += 5              // lokal = kein Netz nötig
    return p
  }

  return (gewaehlt = [...russisch].sort((a, b) => punkte(b) - punkte(a))[0])
}

// Die Stimmenliste lädt in manchen Browsern erst verzögert nach.
if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.addEventListener?.('voiceschanged', () => {
    gewaehlt = undefined // neu bewerten, jetzt mit vollständiger Liste
  })
}

/** Welche Stimme spricht gerade? Für Anzeige und Diagnose. */
export function gewaehlteStimme() {
  const s = besteStimme()
  return s ? `${s.name} (${s.lang})` : null
}

/**
 * Liest den Text vor und sagt Bescheid, wenn er fertig ist.
 *
 * Das Versprechen ist der Grund für den Umbau: Der Dialog-Ablauf hat
 * vorher nach Textlänge GESCHÄTZT, wie lange das Sprechen dauert
 * (900 ms + 65 ms je Zeichen). Bei einer langsamen Gerätestimme lief
 * die Anzeige dadurch dem Ton davon.
 *
 * @returns {Promise<'ende'|'fehler'>}
 */
export function sprich(text) {
  return new Promise((fertig) => {
    try {
      const u = new SpeechSynthesisUtterance(text)
      const stimme = besteStimme()
      if (stimme) u.voice = stimme
      // Ohne russische Gerätestimme ist 'ru-RU' immer noch die
      // richtige Ansage. Hier stand bis zum 29.09. 'es-ES' – ein
      // Rest aus dem Spanischkurs, der Kyrillisch mit spanischer
      // Aussprache vorlesen ließ.
      u.lang = stimme?.lang ?? 'ru-RU'
      u.rate = 0.85 // etwas langsamer, damit man gut mithört

      let erledigt = false
      const melde = (grund) => {
        if (erledigt) return
        erledigt = true
        clearTimeout(notbremse)
        fertig(grund)
      }

      // Chrome bricht lange Texte manchmal ab, ohne 'end' zu melden.
      // Dann käme der Dialog nie weiter – also eine Notbremse, die
      // großzügig über der erwarteten Sprechdauer liegt.
      const notbremse = setTimeout(() => melde('fehler'), 4000 + text.length * 160)

      u.onend = () => melde('ende')
      u.onerror = () => melde('fehler')

      speechSynthesis.cancel() // falls noch etwas anderes spricht
      speechSynthesis.speak(u)
    } catch {
      fertig('fehler') // kein Ton verfügbar – halb so wild
    }
  })
}
