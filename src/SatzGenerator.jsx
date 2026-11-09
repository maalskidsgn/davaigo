import GratisHinweis from './GratisHinweis.jsx'
import { useState, useEffect } from 'react'
import ZauberBild from './ZauberBild.jsx'
import ThemaBild from './ThemaBild.jsx'
import PremiumWerbung from './PremiumWerbung.jsx'
import { API_URL, kiKopf } from './api.js'
import { neuerSatz, satzSchluessel } from './saetze.js'
import { LISTEN_PRO_TAG, verbleibend, zaehleNutzung, kontingentLeer } from './limits.js'
import { usePremium } from './premium.js'
import { IconFunken } from './icons.jsx'
import { tr } from './sprache.js'

// Themen wie beim Vokabelgenerator – dieselbe Sprache, dieselbe
// Bedienung. Ein Tipp erzeugt sofort, ohne erst ein Feld zu füllen.
const THEMEN = [tr('Reisen'), tr('Arbeit'), tr('Restaurant'), tr('Einkaufen'), tr('Gesundheit'), tr('Familie')]

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
    titel: tr('Aspekt'),
    formen: [
      ['aspekt_unvollendet', tr('Unvollendet'), 'читать'],
      ['aspekt_vollendet', tr('Vollendet'), 'прочитать'],
      ['aspekt_gemischt', tr('Im Vergleich'), tr('beide gegenüber')],
    ],
  },
  {
    titel: tr('Die sechs Fälle'),
    formen: [
      ['nominativ', tr('Nominativ'), 'кто? что?'],
      ['genitiv', tr('Genitiv'), 'кого? чего?'],
      ['dativ', tr('Dativ'), 'кому? чему?'],
      ['akkusativ', tr('Akkusativ'), 'кого? что?'],
      ['instrumental', tr('Instrumental'), 'кем? чем?'],
      ['praepositiv', tr('Präpositiv'), 'о ком? где?'],
    ],
  },
  {
    titel: tr('Bewegung'),
    formen: [
      ['bewegungsverben', tr('Bewegungsverben'), 'идти / ходить'],
      ['praefixverben', tr('Mit Vorsilbe'), 'при-, у-, вы-'],
    ],
  },
  {
    titel: tr('Zeiten'),
    formen: [
      ['praesens', tr('Präsens'), 'я читаю'],
      ['praeteritum', tr('Vergangenheit'), 'я читал'],
      ['futur', tr('Zukunft'), 'я буду читать'],
    ],
  },
  {
    titel: tr('Weiteres'),
    formen: [
      ['imperativ', tr('Imperativ'), 'скажи!'],
      ['verneinung', tr('Verneinung'), 'не, никогда'],
      ['reflexiv', tr('Verben auf -ся'), 'учиться'],
    ],
  },
]

/** Alle Formen flach – zum Nachschlagen des Namens. */
const ALLE_FORMEN = [['', tr('Gemischt'), tr('alles durcheinander')], ...GRUPPEN.flatMap((g) => g.formen)]

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
  const { premium, laedt: premiumLaedt } = usePremium()
  const [uebrig, setUebrig] = useState(() => verbleibend(premium))
  // Premium kommt erst nach dem Laden – dann das Kontingent neu setzen
  useEffect(() => {
    // Live: jede Buchung und der Abgleich mit dem Server (holeKontingent)
    const neu = () => setUebrig(verbleibend(premium))
    neu()
    window.addEventListener('kontingent', neu)
    return () => window.removeEventListener('kontingent', neu)
  }, [premium])

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
        headers: await kiKopf(),
        body: JSON.stringify({ thema: gefragt, grammatik, bekannt }),
      })
      const daten = await res.json()
      if (res.status === 402) kontingentLeer()
      if (!res.ok) throw new Error(daten.nachricht || daten.error || tr('Das hat nicht geklappt.'))

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
    if (premiumLaedt && !premium) return null // erst Premium-Stand abwarten
    return (
      <div className="list-gen">
        <PremiumWerbung was={tr('Sätze')} />
      </div>
    )
  }

  return (
    <div className="list-gen satz-gen">
      <div className="gen-kopf">
        <ZauberBild art="saetze" />
        <div className="gen-text">
          <h2>{tr('Sätze erzeugen')}</h2>
          <p>{tr('Wähle ein Thema, eine Grammatik – oder beides.')}</p>
        </div>
        {uebrig <= 2 && (
          <span className="rest-zaehler" title={tr('Gratis-Erstellungen diese Woche')}>
            {uebrig}/{LISTEN_PRO_TAG}
          </span>
        )}
      </div>

      <GratisHinweis art="ki" />

      <form className="wort-form" onSubmit={generieren}>
        {/* Schritt 1: Thema – nur auswählen, erzeugt wird unten */}
        <p className="sg-schritt"><span>1</span> {tr('Thema wählen')}</p>
        <div className="sg-themen">
          {THEMEN.map((t) => (
            <button
              key={t}
              type="button"
              className={'sg-thema' + (thema === t ? ' ist-aktiv' : '')}
              disabled={laden}
              onClick={() => setThema(thema === t ? '' : t)}
            >
              <ThemaBild name={t} />
              {t}
            </button>
          ))}
        </div>

        {/* Schritt 2: Grammatik – erst Bereich, dann Form */}
        <p className="sg-schritt"><span>2</span> {tr('Grammatik')} <small>{tr('optional')}</small></p>
        <div className="sg-reiter" role="tablist">
          <button
            type="button"
            className={offeneGruppe === '' ? 'ist-aktiv' : ''}
            onClick={() => {
              setOffeneGruppe('')
              setGrammatik('')
            }}
          >
            {tr('Gemischt')}
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
          <p className="sg-gemischt">{tr('Alle Formen durcheinander – gut zum Wiederholen.')}</p>
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
            placeholder={tr('Eigenes Thema …')}
            disabled={laden}
          />
          <button
            type="submit"
            className="gen-pfeil"
            disabled={laden || (!thema.trim() && !grammatik)}
            aria-label={tr('Sätze erzeugen')}
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
              <>{tr('Schreibt Sätze')}<span className="studio-punkte" /></>
            ) : grammatik && !thema.trim() ? (
              tr('Sätze zum {0}', ALLE_FORMEN.find(([w]) => w === grammatik)?.[1])
            ) : (
              tr('Sätze erzeugen')
            )}
          </button>
        </div>
      </form>

      {erfolg > 0 && (
        <p className="gen-success">
          {tr('{0} {1} im Trainer! ✓', erfolg, erfolg === 1 ? tr('Satz') : tr('Sätze'))}
        </p>
      )}
      {fehler && <p className="error">{fehler}</p>}

      {/* Die Übersicht: alles ankreuzbar, dann übernehmen */}
      {liste && (
        <div className="gen-list">
          {fertig.hinweis && (
            <div className="gen-begruendung">
              <span className="gen-begruendung-marke">{tr('Worauf du achten kannst')}</span>
              <p>{fertig.hinweis}</p>
            </div>
          )}
          <p className="gen-hint">
            {tr('Sätze zu „{0}“{1} – wähle aus, was in den Trainer soll:', fertig.thema, grammatikName ? ` · ${grammatikName}` : '')}
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
              {tr('{0} Sätze übernehmen', liste.filter((s) => s.checked).length)}
            </button>
            <button className="btn-plain" onClick={() => setListe(null)}>
              {tr('Abbrechen')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
