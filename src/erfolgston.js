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

// ---------------------------------------------------------------------------
// Klickton „Watte sanft“ (gewählt 12.11.2026): weiches Einsinken wie in
// Trittschaum, darunter ein tiefer Boden und am Ende ein leiser Plopp.
// Spielt beim Runterdrücken jedes Knopfs (pointerdown), beim Loslassen
// kommen ein paar weiche Flocken. Hängt am selben Ton-Schalter wie der
// Erfolgston. Ein Knopf mit data-kein-klick (oder darin) bleibt stumm.

function huelle(g, t, spitze, dauer, anstieg) {
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(spitze, t + anstieg)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dauer)
}

function sinusFahrt(c, ziel, t, von, bis, fahrt, laut, dauer, anstieg) {
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(von, t)
  o.frequency.exponentialRampToValueAtTime(bis, t + fahrt)
  huelle(g, t, laut, dauer, anstieg)
  o.connect(g).connect(ziel)
  o.start(t)
  o.stop(t + dauer + 0.02)
}

// Schaum: viele winzige, runde Körnchen, selten ein lauteres
function schaum(c, ziel, t, { laut, dauer, proMs, hp, tp, mitte, korn, raus = false }) {
  const sr = c.sampleRate
  const n = Math.floor(sr * dauer)
  const puffer = c.createBuffer(1, n, sr)
  const d = puffer.getChannelData(0)
  const chance = proMs / (sr / 1000)
  for (let i = 0; i < n; i++) {
    const x = i / n
    const dichte = raus ? 1 - x : x < 0.15 ? x / 0.15 : Math.pow(1 - (x - 0.15) / 0.85, 1.6)
    if (Math.random() < chance * dichte) {
      const laenge = Math.floor((sr * (korn[0] + Math.random() * (korn[1] - korn[0]))) / 1000)
      const staerke = Math.pow(Math.random(), 3.5) * (Math.random() < 0.5 ? -1 : 1)
      for (let k = 0; k < laenge && i + k < n; k++) {
        d[i + k] += staerke * Math.sin((Math.PI * k) / laenge) * (Math.random() * 0.4 + 0.6)
      }
    }
  }
  const quelle = c.createBufferSource()
  quelle.buffer = puffer
  const h = c.createBiquadFilter()
  h.type = 'highpass'
  h.frequency.value = hp
  const l = c.createBiquadFilter()
  l.type = 'lowpass'
  l.frequency.value = tp
  const m = c.createBiquadFilter()
  m.type = 'peaking'
  m.Q.value = 0.7
  m.gain.value = 6
  m.frequency.setValueAtTime(mitte, t)
  m.frequency.exponentialRampToValueAtTime(mitte * 0.6, t + dauer)
  const g = c.createGain()
  g.gain.value = laut
  quelle.connect(h).connect(l).connect(m).connect(g).connect(ziel)
  quelle.start(t)
}

function klickAusgang(c) {
  const bus = c.createGain()
  bus.gain.value = 1.1
  const samt = c.createBiquadFilter()
  samt.type = 'lowpass'
  samt.frequency.value = 2600
  samt.Q.value = 0.5
  const begrenzer = c.createDynamicsCompressor()
  begrenzer.threshold.value = -14
  begrenzer.ratio.value = 8
  begrenzer.attack.value = 0.002
  begrenzer.release.value = 0.06
  bus.connect(samt).connect(begrenzer).connect(c.destination)
  return bus
}

export function klickton(phase = 'runter') {
  try {
    if (!erfolgstoeneAn()) return
    const c = context()
    if (!c) return
    if (c.state === 'suspended') c.resume()
    const t = c.currentTime + 0.003
    const z = klickAusgang(c)
    if (phase === 'runter') {
      sinusFahrt(c, z, t, 150, 95, 0.096, 0.32, 0.12, 0.01)
      schaum(c, z, t, { laut: 1.1, dauer: 0.12, proMs: 9, hp: 600, tp: 2800, mitte: 1600, korn: [0.6, 1.6] })
      sinusFahrt(c, z, t + 0.06, 220, 400, 0.028, 0.25, 0.07, 0.007)
    } else {
      schaum(c, z, t, { laut: 0.25, dauer: 0.045, proMs: 3, hp: 500, tp: 2400, mitte: 1500, korn: [0.8, 2], raus: true })
    }
  } catch {
    // Kein Ton ist kein Fehler.
  }
}

const KNOPF = 'button, .btn, [role="button"], .quiz-option'

/** Einmal beim Start aufrufen: hängt den Klickton an alle Knöpfe der App. */
export function klicktoeneStarten() {
  if (typeof document === 'undefined' || klicktoeneStarten.laeuft) return
  klicktoeneStarten.laeuft = true
  let gedrueckt = false
  document.addEventListener(
    'pointerdown',
    (e) => {
      if (e.button > 0) return
      const el = typeof e.target?.closest === 'function' ? e.target.closest(KNOPF) : null
      if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true' || el.closest('[data-kein-klick]')) return
      gedrueckt = true
      klickton('runter')
    },
    { capture: true, passive: true },
  )
  const los = () => {
    if (!gedrueckt) return
    gedrueckt = false
    klickton('hoch')
  }
  document.addEventListener('pointerup', los, { capture: true, passive: true })
  document.addEventListener('pointercancel', () => { gedrueckt = false }, { capture: true, passive: true })
}
