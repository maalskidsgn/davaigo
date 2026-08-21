import { useState, useEffect } from 'react'
import { paketFuer } from './starterpakete.js'

/**
 * Das Onboarding für Neulinge – drei kurze Fragen zum Durchklicken,
 * wie man es von Duolingo kennt: Warum lernst du? Wie viel kannst du
 * schon? Wie viel Zeit am Tag?
 *
 * Danach wird das STARTPAKET ausgepackt, passend zum gewählten Grund:
 *   – die ersten ~50 Vokabeln
 *   – ein erstes Lern-Video und ein Song (Untertitel geprüft)
 * Die fünf Pakete sind vorbereitet (src/starterpakete.js) und laden
 * sofort – der Ladescreen inszeniert das Packen, damit es sich wie
 * frisch generiert anfühlt. Kein API-Aufruf, kein Warten, kein Risiko.
 */

// Die drei Fragen. "wert" wird gespeichert; beim Tagesziel ist es
// direkt die Tages-XP-Zahl, die die App als Ziel übernimmt.
const SCHRITTE = [
  {
    id: 'grund',
    frage: 'Warum lernst du Russisch?',
    optionen: [
      { wert: 'familie', emoji: '❤️', text: 'Familie & Partner' },
      { wert: 'reisen', emoji: '✈️', text: 'Reisen' },
      { wert: 'kultur', emoji: '🎵', text: 'Musik & Kultur' },
      { wert: 'beruf', emoji: '💼', text: 'Beruf & Karriere' },
      { wert: 'gehirn', emoji: '🧠', text: 'Gehirntraining' },
      { wert: 'lust', emoji: '✨', text: 'Einfach Lust drauf' },
    ],
  },
  {
    id: 'niveau',
    frage: 'Wie viel Russisch kannst du schon?',
    optionen: [
      { wert: 'neu', emoji: '🌱', text: 'Ich fange ganz neu an' },
      { wert: 'woerter', emoji: '🔤', text: 'Ich kenne ein paar Wörter' },
      { wert: 'saetze', emoji: '💬', text: 'Ich kann einfache Gespräche führen' },
      { wert: 'viel', emoji: '🚀', text: 'Ich verstehe schon einiges' },
    ],
  },
  {
    id: 'ziel',
    frage: 'Wie viel Zeit hast du am Tag?',
    optionen: [
      { wert: 10, emoji: '☕', text: '5 Minuten', hinweis: 'Entspannt' },
      { wert: 30, emoji: '🙂', text: '10 Minuten', hinweis: 'Normal' },
      { wert: 50, emoji: '💪', text: '15 Minuten', hinweis: 'Ernsthaft' },
      { wert: 80, emoji: '🔥', text: '30 Minuten', hinweis: 'Intensiv' },
    ],
  },
]

/** Das Maskottchen in klein: die Sprechblase mit Gesicht und Funke */
function Maskottchen() {
  return (
    <svg className="ob-maskottchen" viewBox="0 0 120 104" aria-hidden="true">
      <path
        d="M22 8h76a18 18 0 0 1 18 18v42a18 18 0 0 1-18 18H55l-22 18V86H22A18 18 0 0 1 4 68V26A18 18 0 0 1 22 8z"
        fill="url(#obViolett)"
      />
      <circle cx="47" cy="44" r="8" fill="#fff" />
      <circle cx="73" cy="44" r="8" fill="#fff" />
      <circle cx="49" cy="46" r="3.6" fill="#241338" />
      <circle cx="75" cy="46" r="3.6" fill="#241338" />
      <path d="M52 62q8 8 16 0" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path
        d="M60 14c0.9 3.6 1.9 4.6 5.5 5.5-3.6 0.9-4.6 1.9-5.5 5.5-0.9-3.6-1.9-4.6-5.5-5.5 3.6-0.9 4.6-1.9 5.5-5.5z"
        fill="url(#obGold)"
      />
      <defs>
        <linearGradient id="obViolett" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="obGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd23f" />
          <stop offset="1" stopColor="#ffb300" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/** Eine Zeile der Lade-Checkliste: Spinner solange offen, dann Häkchen */
function PaketZeile({ emoji, text, status }) {
  return (
    <div className={'ob-paket-zeile' + (status === 'fertig' ? ' ob-paket-fertig' : '')}>
      <span className="ob-paket-emoji">{emoji}</span>
      <span className="ob-paket-text">{text}</span>
      <span className="ob-paket-status">
        {status === 'laedt' && <span className="ob-spinner" aria-label="lädt" />}
        {status === 'fertig' && <span className="ob-haken">✓</span>}
        {status === 'fehler' && <span className="ob-uebersprungen">–</span>}
      </span>
    </div>
  )
}

/**
 * @param {function} onFertig    – bekommt (antworten, paket) mit
 *   paket = { woerter: [...], video: {...}|null, song: {...}|null }
 * @param {function} [onAbbrechen] – Pfeil zurück auf der ersten Frage
 * @param {boolean}  [kontoNoetig] – ändert den Text des Schluss-Knopfs
 */
export default function Onboarding({ onFertig, onAbbrechen, kontoNoetig = false }) {
  const [index, setIndex] = useState(0)
  const [antworten, setAntworten] = useState({})
  const [gewaehlt, setGewaehlt] = useState(null) // leuchtet kurz auf
  const fertig = index >= SCHRITTE.length
  const schritt = SCHRITTE[index]

  function waehle(option) {
    if (gewaehlt !== null) return // schon gewählt, Sprung läuft
    setGewaehlt(option.wert)
    setAntworten((a) => ({ ...a, [schritt.id]: option.wert }))
    setTimeout(() => {
      setGewaehlt(null)
      setIndex((i) => i + 1)
    }, 450)
  }

  function zurueck() {
    if (index === 0) return onAbbrechen?.()
    setIndex((i) => i - 1)
  }

  // ---------- Das Startpaket auspacken ----------
  // Die Pakete sind vorbereitet (src/starterpakete.js) und laden
  // sofort. Die Häkchen erscheinen bewusst nacheinander – so sieht
  // man, WAS gerade ins Paket wandert, statt nur einen Blitz.
  const paketInfo = paketFuer(antworten.grund)
  const [stufe, setStufe] = useState(0) // 0..3 = wie viele Häkchen sichtbar

  useEffect(() => {
    if (!fertig) return
    const zeiten = [1100, 2000, 2900, 3400] // Wörter, Video, Song, fertig
    const timer = zeiten.map((ms, i) => setTimeout(() => setStufe(i + 1), ms))
    return () => timer.forEach(clearTimeout)
  }, [fertig])

  // ---------- Abschluss-Bildschirme ----------
  if (fertig) {
    const zielOption = SCHRITTE[2].optionen.find((o) => o.wert === antworten.ziel)
    const woerter = paketInfo.woerter
    const anzahl = woerter.length

    // 1. Der Ladescreen: das Paket wird gepackt
    if (stufe < 4) {
      return (
        <div className="ob">
          <div className="ob-karte ob-schluss">
            <span className="ob-schwebt"><Maskottchen /></span>
            <h1>
              Дава́й! <span className="ob-akzent">Dein Startpaket wird gepackt.</span>
            </h1>
            <p className="ob-text">
              Persönlich für dich zusammengestellt – Thema <b>{paketInfo.label}</b>.
            </p>
            <div className="ob-paket">
              <PaketZeile emoji="📚" text={`Deine ersten ${anzahl} Vokabeln`} status={stufe >= 1 ? 'fertig' : 'laedt'} />
              <PaketZeile emoji="🎬" text="Dein erstes Video" status={stufe >= 2 ? 'fertig' : 'laedt'} />
              <PaketZeile emoji="🎵" text="Dein erster Song" status={stufe >= 3 ? 'fertig' : 'laedt'} />
            </div>
            <div className="ob-schimmer" aria-hidden="true" />
          </div>
        </div>
      )
    }

    const paket = { woerter, video: paketInfo.video, song: paketInfo.song }

    // 2. Alles da: das Startpaket zeigen
    return (
      <div className="ob">
        <div className="ob-karte ob-schluss ob-start">
          <Maskottchen />
          <h1>
            Готово! <span className="ob-akzent">Dein Startpaket ist da.</span>
          </h1>
          <p className="ob-text">
            Dein Plan: <b>{zielOption?.text} am Tag</b>
            {' '}· <b>{anzahl} Wörter</b> zum Thema {paketInfo.label} warten im Trainer.
          </p>

          {/* Wort-Vorgeschmack */}
          <div className="ob-liste">
            {woerter.slice(0, 5).map((w) => (
              <div key={w.wort} className="ob-liste-zeile">
                <span className="ob-liste-ru">{w.wort}</span>
                <span className="ob-liste-de">{w.uebersetzung}</span>
              </div>
            ))}
            {anzahl > 5 && (
              <div className="ob-liste-zeile ob-liste-mehr">… und {anzahl - 5} weitere</div>
            )}
          </div>

          {/* Video und Song als Karten */}
          <div className="ob-medien">
            {paketInfo.video && (
              <div className="ob-medium">
                <img src={paketInfo.video.thumbnail} alt="" />
                <span className="ob-medium-art">🎬 Dein erstes Video</span>
                <span className="ob-medium-titel">{paketInfo.video.title}</span>
              </div>
            )}
            {paketInfo.song && (
              <div className="ob-medium">
                <img src={paketInfo.song.thumbnail} alt="" />
                <span className="ob-medium-art">🎵 Dein erster Song</span>
                <span className="ob-medium-titel">{paketInfo.song.title}</span>
              </div>
            )}
          </div>

          <button className="ob-knopf-gold" onClick={() => onFertig(antworten, paket)}>
            {kontoNoetig ? 'Konto anlegen & loslegen' : 'In die App – Давай!'}
          </button>
        </div>
      </div>
    )
  }

  // ---------- Frage-Bildschirm ----------
  return (
    <div className="ob">
      <div className="ob-kopf">
        {(index > 0 || onAbbrechen) && (
          <button className="ob-zurueck" onClick={zurueck} aria-label="Zurück">
            ←
          </button>
        )}
        <div className="ob-balken">
          <div
            className="ob-balken-fuellung"
            style={{ width: ((index + 1) / (SCHRITTE.length + 1)) * 100 + '%' }}
          />
        </div>
      </div>

      <div className="ob-frage-zeile">
        <Maskottchen />
        <div className="ob-blase">{schritt.frage}</div>
      </div>

      <div className="ob-optionen" key={schritt.id}>
        {schritt.optionen.map((o) => (
          <button
            key={o.wert}
            className={'ob-option' + (gewaehlt === o.wert ? ' ob-option-aktiv' : '')}
            onClick={() => waehle(o)}
          >
            <span className="ob-option-emoji">{o.emoji}</span>
            <span className="ob-option-text">
              {o.text}
              {o.hinweis && <small>{o.hinweis}</small>}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
