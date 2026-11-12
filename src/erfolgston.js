// Ein kurzer, freundlicher Erfolgston – wie bei Babbel, wenn man
// etwas richtig hat.
//
// Warum erzeugt statt Audiodatei: Ein kleines „Pling" als Datei wäre
// ein weiterer Download, der beim ersten Mal verzögert kommt. Der
// Web-Audio-Klang ist sofort da, klingt auf jedem Gerät gleich und
// kostet nichts. Zwei aufsteigende Töne (eine Quinte) – kurz genug,
// um nicht zu nerven, klar genug, um sich gut anzufühlen.
//
// Ein einziger AudioContext für die ganze App. Browser erlauben Klang
// erst nach der ersten Nutzer-Geste; bis dahin bleibt der Context
// „suspended" und der erste Aufruf weckt ihn.

// KOMPLETT AUS – uebernommen aus Habloo, wo Manuel ihn am 24.08.
// abgeschaltet hat ("mach den erfolgssound raus komplett erstmal").
// Davaigo startet mit derselben Entscheidung, damit sich die beiden
// Apps nicht ohne Grund unterschiedlich anhoeren. Der ganze Klang
// bleibt fertig im Code – diese eine Zeile holt ihn zurueck, und
// dann erscheint auch der Schalter in den Einstellungen.
// 12.11.2026: wieder AN, neuer Klang „Harfen-Lauf“ (Manuel testet in Davaigo).
const ERFOLGSTOENE_AKTIV = true

// Abstellbar: Der Schalter liegt in den Einstellungen unter "Ton".
// Standard ist AN – wer ihn nicht mag, macht ihn einmal aus.
const SCHALTER = 'erfolgstoene'

export function erfolgstoeneAn() {
  return ERFOLGSTOENE_AKTIV && localStorage.getItem(SCHALTER) !== 'aus'
}

/** Fuer die Einstellungen: den Schalter nur zeigen, wenn das Feature an ist. */
export function erfolgstoeneVerfuegbar() {
  return ERFOLGSTOENE_AKTIV
}

export function setzeErfolgstoene(an) {
  localStorage.setItem(SCHALTER, an ? 'an' : 'aus')
}

let ctx = null
let hall = null

function context() {
  if (ctx) return ctx
  const AudioC = window.AudioContext || window.webkitAudioContext
  if (!AudioC) return null
  ctx = new AudioC()
  // Kleiner heller Raum (0,7 s) – lässt die Harfe ausklingen, ohne zu hallen
  try {
    const n = Math.floor(ctx.sampleRate * 0.7)
    const ir = ctx.createBuffer(2, n, ctx.sampleRate)
    for (let k = 0; k < 2; k++) {
      const d = ir.getChannelData(k)
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 5)
    }
    hall = ctx.createConvolver()
    hall.buffer = ir
  } catch {
    hall = null
  }
  return ctx
}

// Harfen-Klangfarbe: Teiltöne [Faktor, Lautstärke, Anteil am Ausklang]
const HARFE = [[1, 1, 1], [2, 0.4, 0.6], [3, 0.15, 0.35], [4, 0.06, 0.25]]
// Gezupfter Lauf nach oben: C5 – E5 – G5 – C6 – E6
const LAUF = [523.25, 659.25, 783.99, 1046.5, 1318.51]

/**
 * Spielt den Erfolgston „Harfen-Lauf“ (gewählt 12.11.2026): fünf
 * weich gezupfte Töne nach oben, gedämpft, mit kurzem Raum.
 * Tut nichts, wenn der Browser kein Web-Audio kann oder der Klang
 * (noch) nicht erlaubt ist – ein fehlender Ton darf nie eine Aktion
 * blockieren.
 */
export function erfolgston() {
  try {
    if (!erfolgstoeneAn()) return
    const c = context()
    if (!c) return
    if (c.state === 'suspended') c.resume()

    const t0 = c.currentTime + 0.003
    const bus = c.createGain()
    const samt = c.createBiquadFilter()
    samt.type = 'lowpass'
    samt.frequency.value = 6000
    const begrenzer = c.createDynamicsCompressor()
    begrenzer.threshold.value = -16
    begrenzer.ratio.value = 4
    begrenzer.attack.value = 0.003
    begrenzer.release.value = 0.15
    bus.connect(samt).connect(begrenzer).connect(c.destination)
    if (hall) {
      const hallLaut = c.createGain()
      hallLaut.gain.value = 0.22
      samt.connect(hall).connect(hallLaut).connect(c.destination)
    }

    LAUF.forEach((hz, i) => {
      const a = t0 + i * 0.038
      for (const [faktor, anteil, ausklang] of HARFE) {
        const osc = c.createOscillator()
        const g = c.createGain()
        osc.type = 'sine'
        osc.frequency.value = hz * faktor
        const dauer = Math.max(0.03, 0.5 * ausklang)
        g.gain.setValueAtTime(0.0001, a)
        g.gain.exponentialRampToValueAtTime(0.17 * anteil, a + 0.003)
        g.gain.exponentialRampToValueAtTime(0.0001, a + dauer)
        osc.connect(g).connect(bus)
        osc.start(a)
        osc.stop(a + dauer + 0.05)
      }
    })
  } catch {
    // Kein Ton ist kein Fehler.
  }
}
