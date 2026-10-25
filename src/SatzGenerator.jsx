import { useState } from 'react'
import { API_URL } from './api.js'
import { neuerSatz, satzSchluessel } from './saetze.js'
import { LISTEN_PRO_TAG, verbleibend, zaehleNutzung } from './limits.js'
import { usePremium } from './premium.js'
import { IconFunken } from './icons.jsx'

// Themen wie beim Vokabelgenerator – dieselbe Sprache, dieselbe
// Bedienung. Ein Tipp erzeugt sofort, ohne erst ein Feld zu füllen.
const THEMEN = ['Reisen', 'Arbeit', 'Restaurant', 'Einkaufen', 'Gesundheit', 'Familie']

// Die Formen, die der Server kennt (server/saetze.js) – hier in
// Gruppen, weil siebzehn Chips in einer Reihe niemand überblickt.
//
// Der Aspekt steht bewusst oben. Er ist für Deutschsprachige die
// eigentliche Hürde des Russischen: Ob man читать oder прочитать
// sagt, ändert die Aussage, und im Deutschen gibt es dafür nichts
// Vergleichbares. Die Zeiten dagegen sind schnell erzählt – drei
// Stück, keine Konjunktivformen.
//
// Neben jedem Namen steht ein Beispiel statt einer Erklärung:
// "Instrumental" sagt Anfängern wenig, "кем? чем?" sofort etwas.
const GRUPPEN = [
  {
    titel: 'Aspekt',
    formen: [
      ['aspekt_unvollendet', 'Unvollendet', 'читать'],
      ['aspekt_vollendet', 'Vollendet', 'прочитать'],
      ['aspekt_gemischt', 'Im Vergleich', 'beide gegenüber'],
    ],
  },
  {
    titel: 'Die sechs Fälle',
    formen: [
      ['nominativ', 'Nominativ', 'кто? что?'],
      ['genitiv', 'Genitiv', 'кого? чего?'],
      ['dativ', 'Dativ', 'кому? чему?'],
      ['akkusativ', 'Akkusativ', 'кого? что?'],
      ['instrumental', 'Instrumental', 'кем? чем?'],
      ['praepositiv', 'Präpositiv', 'о ком? где?'],
    ],
  },
  {
    titel: 'Bewegung',
    formen: [
      ['bewegungsverben', 'Bewegungsverben', 'идти / ходить'],
      ['praefixverben', 'Mit Vorsilbe', 'при-, у-, вы-'],
    ],
  },
  {
    titel: 'Zeiten',
    formen: [
      ['praesens', 'Präsens', 'я читаю'],
      ['praeteritum', 'Vergangenheit', 'я читал'],
      ['futur', 'Zukunft', 'я буду читать'],
    ],
  },
  {
    titel: 'Weiteres',
    formen: [
      ['imperativ', 'Imperativ', 'скажи!'],
      ['verneinung', 'Verneinung', 'не, никогда'],
      ['reflexiv', 'Verben auf -ся', 'учиться'],
    ],
  },
]

/** Alle Formen flach – zum Nachschlagen des Namens. */
const ALLE_FORMEN = [['', 'Gemischt', 'alles durcheinander'], ...GRUPPEN.flatMap((g) => g.formen)]

/**
 * Sätze mit KI erzeugen und in den Satz-Trainer übernehmen.
 *
 * Zwei Vorgaben lassen sich frei kombinieren: ein Thema und eine
 * Form. "Reisen" + "Instrumental" ergibt genau die Sätze, mit denen
 * man sagt, womit und mit wem man unterwegs ist.
 */
export default function SatzGenerator({ saetze, setSaetze }) {
  const [thema, setThema] = useState('')
  const [offeneGruppe, setOffeneGruppe] = useState('')
  const [grammatik, setGrammatik] = useState('')
  const [liste, setListe] = useState(null)
  const [fertig, setFertig] = useState({ thema: '', grammatik: '', hinweis: '' })
  const [laden, setLaden] = useState(false)
  const [fehler, setFehler] = useState('')
  const [erfolg, setErfolg] = useState(0) // wie viele gerade übernommen wurden
  const { premium } = usePremium()
  const [uebrig, setUebrig] = useState(() => verbleibend())

  const bekannt = Object.values(saetze).map((s) => s.anzeige ?? '')

  async function generieren(e, direktThema = null) {
    e?.preventDefault()
    const gefragt = (direktThema ?? thema).trim()
    // Ohne Thema geht es nur, wenn wenigstens eine Grammatik gewählt
    // ist – sonst wüsste die KI nicht, worüber sie schreiben soll.
    if (!gefragt && !grammatik && bekannt.length < 5) return
    if (uebrig <= 0) return

    setLaden(true)
    setFehler('')
    setErfolg(0)
    try {
      const res = await fetch(API_URL + '/api/saetze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thema: gefragt, grammatik, bekannt }),
      })
      const daten = await res.json()
      if (!res.ok) throw new Error(daten.error || 'Das hat nicht geklappt.')

      setListe(daten.saetze.map((s) => ({ ...s, checked: true })))
      setFertig({
        thema: daten.thema || gefragt,
        grammatik: daten.grammatik || '',
        hinweis: daten.hinweis || '',
      })
      zaehleNutzung()
      setUebrig(verbleibend(premium))
    } catch (f) {
      setFehler(f.message)
    } finally {
      setLaden(false)
    }
  }

  /** Die angehakten Sätze in den Karteikasten legen. */
  function uebernehmen() {
    let gezaehlt = 0
    setSaetze((alt) => {
      const neu = { ...alt }
      for (const s of liste) {
        const key = satzSchluessel(s.satz)
        if (!s.checked || neu[key]) continue
        neu[key] = neuerSatz(s, { thema: fertig.thema, grammatik: fertig.grammatik })
        gezaehlt++
      }
      return neu
    })
    setErfolg(liste.filter((s) => s.checked).length)
    setListe(null)
    setThema('')
  }

  const grammatikName = ALLE_FORMEN.find(([w]) => w === fertig.grammatik)?.[1]

  // Kontingent aufgebraucht
  if (uebrig <= 0 && !liste) {
    return (
      <div className="list-gen">
        <div className="plan-card plan-premium premium-teaser">
          <div className="plan-name">
            Premium <span className="plan-badge badge-soon">Bald verfügbar</span>
          </div>
          <p className="row-hint">
            Deine {LISTEN_PRO_TAG} kostenlosen Generierungen sind für heute
            aufgebraucht – unbegrenzte Sätze kommen mit dem Premium-Abo.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="list-gen satz-gen">
      <div className="gen-kopf">
        <span className="gen-symbol" aria-hidden="true">
          <IconFunken groesse={24} />
        </span>
        <div className="gen-text">
          <h2>Sätze erzeugen</h2>
          <p>Wähle ein Thema, eine Grammatik – oder beides.</p>
        </div>
        {uebrig <= 2 && (
          <span className="rest-zaehler" title="Kostenlose Generierungen heute">
            {uebrig}/{LISTEN_PRO_TAG}
          </span>
        )}
      </div>

      <form className="wort-form" onSubmit={generieren}>
        {/* Schritt 1: Thema – ein Tipp erzeugt sofort */}
        <p className="sg-schritt"><span>1</span> Thema wählen</p>
        <div className="sg-themen">
          {THEMEN.map((t) => (
            <button
              key={t}
              type="button"
              className="sg-thema"
              disabled={laden}
              onClick={(e) => {
                setThema(t)
                generieren(e, t)
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Schritt 2: Grammatik – erst Bereich, dann Form */}
        <p className="sg-schritt"><span>2</span> Grammatik <small>optional</small></p>
        <div className="sg-reiter" role="tablist">
          <button
            type="button"
            className={offeneGruppe === '' ? 'ist-aktiv' : ''}
            onClick={() => {
              setOffeneGruppe('')
              setGrammatik('')
            }}
          >
            Gemischt
          </button>
          {GRUPPEN.map((g) => (
            <button
              key={g.titel}
              type="button"
              className={
                (offeneGruppe === g.titel ? 'ist-aktiv' : '') +
                (g.formen.some(([w]) => w === grammatik) ? ' hat-wahl' : '')
              }
              onClick={() => setOffeneGruppe(g.titel)}
            >
              {g.titel}
            </button>
          ))}
        </div>

        {offeneGruppe === '' ? (
          <p className="sg-gemischt">Alle Formen durcheinander – gut zum Wiederholen.</p>
        ) : (
          <div className="sg-formen">
            {GRUPPEN.find((g) => g.titel === offeneGruppe).formen.map(([wert, name, hilfe]) => (
              <button
                key={wert}
                type="button"
                className={'sg-form' + (grammatik === wert ? ' ist-aktiv' : '')}
                onClick={() => setGrammatik(grammatik === wert ? '' : wert)}
              >
                <b>{name}</b>
                <span>{hilfe}</span>
              </button>
            ))}
          </div>
        )}

        <div className="gen-feld">
          <input
            type="text"
            value={thema}
            onChange={(e) => setThema(e.target.value)}
            placeholder="Eigenes Thema …"
            disabled={laden}
          />
          <button
            type="submit"
            className="gen-pfeil"
            disabled={laden || (!thema.trim() && !grammatik)}
            aria-label="Sätze erzeugen"
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                d="M4 12h15M13 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="gen-knoepfe">
          <button
            type="submit"
            className="btn gen-los"
            disabled={laden || (!thema.trim() && !grammatik)}
          >
            {laden ? (
              <>Schreibt Sätze<span className="studio-punkte" /></>
            ) : grammatik && !thema.trim() ? (
              `Sätze zum ${ALLE_FORMEN.find(([w]) => w === grammatik)?.[1]}`
            ) : (
              'Sätze erzeugen'
            )}
          </button>
        </div>
      </form>

      {erfolg > 0 && (
        <p className="gen-success">
          {erfolg} {erfolg === 1 ? 'Satz' : 'Sätze'} im Trainer! ✓
        </p>
      )}
      {fehler && <p className="error">{fehler}</p>}

      {/* Die Übersicht: alles ankreuzbar, dann übernehmen */}
      {liste && (
        <div className="gen-list">
          {fertig.hinweis && (
            <div className="gen-begruendung">
              <span className="gen-begruendung-marke">Worauf du achten kannst</span>
              <p>{fertig.hinweis}</p>
            </div>
          )}
          <p className="gen-hint">
            Sätze zu „{fertig.thema}“{grammatikName ? ` · ${grammatikName}` : ''} – wähle
            aus, was in den Trainer soll:
          </p>
          {liste.map((s, i) => (
            <label key={i} className="gen-item satz-item">
              <input
                type="checkbox"
                checked={s.checked}
                onChange={() =>
                  setListe((l) => l.map((v, j) => (j === i ? { ...v, checked: !v.checked } : v)))
                }
              />
              <span className="satz-es">{s.satz}</span>
              <span className="satz-de">{s.uebersetzung}</span>
              {s.schluessel && <span className="satz-schluessel">{s.schluessel}</span>}
            </label>
          ))}
          <div className="gen-actions">
            <button onClick={uebernehmen} disabled={!liste.some((s) => s.checked)}>
              {liste.filter((s) => s.checked).length} Sätze übernehmen
            </button>
            <button className="btn-plain" onClick={() => setListe(null)}>
              Abbrechen
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
