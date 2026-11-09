import { XP } from './gamification.js'
import GratisHinweis from './GratisHinweis.jsx'
import { API_URL, istApp, kiKopf } from './api.js'
import ZauberBild from './ZauberBild.jsx'
import ThemaBild from './ThemaBild.jsx'
import PremiumWerbung from './PremiumWerbung.jsx'
import { useState, useEffect } from 'react'
import { newEntry } from './srs.js'
import { LISTEN_PRO_TAG, verbleibend, zaehleNutzung, naechsteAuffuellung, kontingentLeer } from './limits.js'
import { usePremium } from './premium.js'
import { IconFunken } from './icons.jsx'
import { tr } from './sprache.js'

// Vokabellisten mit KI erstellen: Thema eingeben (z.B. "Restaurant" oder
// "Fußball"), die KI schlägt 12 passende Vokabeln vor, du wählst aus.
export default function ListGenerator({ vocab, setVocab, addXp }) {
  const [thema, setThema] = useState('')
  const [wortart, setWortart] = useState('alle')
  const [fertigThema, setFertigThema] = useState('') // Thema der fertigen Liste
  const [laden, setLaden] = useState(false)
  const [fehler, setFehler] = useState('')
  const [liste, setListe] = useState(null) // Vorschläge mit Häkchen
  const [erfolg, setErfolg] = useState(false)
  const { premium, laedt: premiumLaedt } = usePremium()
  const [uebrig, setUebrig] = useState(() => verbleibend(premium))
  // Unter fuenf gesammelten Woertern kann die KI nichts erkennen –
  // dann bleibt der KI-Gen-Knopf gesperrt.
  const zuWenige = Object.keys(vocab).length < 5

  // Der Premium-Status kommt erst nach einer kurzen Abfrage an –
  // sobald er da ist, den Rest neu berechnen (Premium = unbegrenzt).
  useEffect(() => {
    // Live: jede Buchung und der Abgleich mit dem Server (holeKontingent)
    const neu = () => setUebrig(verbleibend(premium))
    neu()
    window.addEventListener('kontingent', neu)
    return () => window.removeEventListener('kontingent', neu)
  }, [premium]) // freie Generierungen
  const [begruendung, setBegruendung] = useState('') // warum die KI diese Wörter wählte
  const [infoOffen, setInfoOffen] = useState(false) // Erklärung der Automatik

  /**
   * Holt eine Liste. Ohne Thema übernimmt die KI die Auswahl und
   * richtet sich nach dem, was schon im Trainer liegt.
   */
  async function generieren(e, automatisch = false) {
    // Das Ereignis ist freiwillig: Der runde Pfeil im Feld hat
    // preventDefault() schon selbst erledigt.
    e?.preventDefault()
    const gefragt = thema.trim()
    if ((!automatisch && !gefragt) || uebrig <= 0) return
    setLaden(true)
    setFehler('')
    setErfolg(false)
    setBegruendung('')
    try {
      const res = await fetch(API_URL + '/api/vokabelliste', {
        method: 'POST',
        headers: await kiKopf(),
        // Die schon gesammelten Wörter mitschicken: so kommen keine
        // Dopplungen zurück und die Liste passt zum eigenen Stand.
        body: JSON.stringify({
          thema: automatisch ? '' : gefragt,
          bekannt: Object.keys(vocab),
          wortart,
        }),
      })
      const data = await res.json()
      if (res.status === 402) kontingentLeer()
      if (!res.ok) throw new Error(data.nachricht || data.error)
      setListe(data.vokabeln.map((v) => ({ ...v, checked: true })))
      setBegruendung(data.begruendung || '')
      setFertigThema(data.thema || gefragt)
      zaehleNutzung() // eine Generierung aus dem gemeinsamen Tageskontingent
      setUebrig(verbleibend(premium))
    } catch (err) {
      setFehler(err.message)
    } finally {
      setLaden(false)
    }
  }

  // Ausgewählte Vokabeln in den Trainer übernehmen
  function uebernehmen() {
    // Pauschal 50 XP für eine übernommene Liste (09.11.2026)
    const neuZahl = (liste ?? []).filter((x) => x.checked && !vocab[(x.wort || '').toLowerCase()]).length
    if (neuZahl) addXp?.(XP.LISTE_ERSTELLT, neuZahl === 1 ? tr('Wort hinzugefügt') : tr('{0} Wörter hinzugefügt', neuZahl))
    setVocab((v) => {
      const copy = { ...v }
      for (const s of liste) {
        const key = s.wort.toLowerCase()
        if (!s.checked || copy[key]) continue
        copy[key] = {
          ...newEntry(s.uebersetzung, tr('Liste: {0}', fertigThema)),
          status: 'lernen',
          beispiel: s.beispiel,
        }
      }
      return copy
    })
    setErfolg(true)
    setListe(null)
    setThema('')
  }

  // Kostenloses Kontingent aufgebraucht: Premium-Hinweis statt Formular
  if (uebrig <= 0 && !liste) {
    if (premiumLaedt && !premium) return null // erst Premium-Stand abwarten
    return (
      <div className="list-gen">
        <PremiumWerbung was={tr('Vokabellisten')} />
      </div>
    )
  }

  return (
    <div className="list-gen">
      {/* Gleicher Aufbau wie die anderen Bereiche: Überschrift,
          ein Satz zur Einordnung, dann der Inhalt */}
      <div className="gen-kopf">
        <ZauberBild art="woerter" />
        <div className="gen-text">
          <h2>{tr('KI-Listengenerator')}</h2>
          <p>{tr('Erstelle neue Wortlisten zu jedem Thema.')}</p>
        </div>
        {/* Der Zaehler steht nur da, wenn er etwas zu sagen hat.
            Bei vollem Kontingent ist er nur Zierde – kurz vor dem
            Ende ist er die einzige Vorwarnung. */}
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
          {[tr('Restaurant'), tr('Reisen'), tr('Arbeit'), tr('Einkaufen'), tr('Familie'), tr('Gesundheit')].map((v) => (
            <button
              key={v}
              type="button"
              className={'sg-thema' + (thema === v ? ' ist-aktiv' : '')}
              disabled={laden}
              onClick={() => setThema(thema === v ? '' : v)}
            >
              <ThemaBild name={v} />
              {v}
            </button>
          ))}
        </div>

        <div className="gen-feld sg-eigenes">
          <input
            type="text"
            value={thema}
            onChange={(e) => setThema(e.target.value)}
            placeholder={tr('… oder eigenes Thema, z. B. Arztbesuch')}
            disabled={laden}
          />
        </div>

        {/* Schritt 2: Wortart – gemischt oder gezielt */}
        <p className="sg-schritt"><span>2</span> {tr('Wortart')} <small>{tr('optional')}</small></p>
        <div className="sg-themen sg-vier">
          {[
            ['alle', tr('Gemischt')],
            ['verben', tr('Verben')],
            ['adjektive', tr('Adjektive')],
            ['nomen', tr('Nomen')],
          ].map(([wert, text]) => (
            <button
              key={wert}
              type="button"
              className={'sg-thema' + (wortart === wert ? ' ist-aktiv' : '')}
              onClick={() => setWortart(wert)}
            >
              {text}
            </button>
          ))}
        </div>

        <div className="gen-knoepfe">
          <button type="submit" className="btn gen-los" disabled={laden || !thema.trim()}>
            {laden ? (
              <>{tr('Stellt zusammen')}<span className="studio-punkte" /></>
            ) : (
              tr('Liste erstellen')
            )}
          </button>

          {/* Derselbe Aufruf, nur ohne Thema: Dann sucht die KI
              selbst aus, was zum bisherigen Stand passt. */}
          <button
            type="button"
            className="btn-outline gen-ki"
            onClick={(e) => generieren(e, true)}
            disabled={laden || zuWenige}
            title={zuWenige ? tr('Dafür brauchst du erst 5 gesammelte Wörter') : undefined}
          >
            {tr('Passend zu mir')}
          </button>

          <button
            type="button"
            className="gen-info"
            onClick={() => setInfoOffen(!infoOffen)}
            aria-expanded={infoOffen}
            title={tr('Was ist der Unterschied?')}
          >
            {infoOffen ? '×' : '?'}
          </button>
        </div>

        {infoOffen && (
          <div className="gen-erklaerung">
            <p>
              <b>{tr('Liste erstellen')}</b> {tr('nimmt dein Thema. Du sagst „Restaurant“, und die KI stellt zwölf Wörter dazu zusammen – ohne die, die du schon hast.')}
            </p>
            <p>
              <b>{tr('KI-Gen')}</b> {tr('braucht kein Thema. Die KI sieht sich deine gesammelten Wörter an, erkennt, worum es dir bisher ging, und schlägt vor, was als Nächstes fehlt – etwa passende Verben zu Wörtern, die du schon kennst. Warum sie genau diese Auswahl getroffen hat, schreibt sie über die Liste.')}
            </p>
            <p className="gen-klein">
              {tr('Für KI-Gen brauchst du mindestens 5 gesammelte Wörter. Du hast {0}.', Object.keys(vocab).length)}
            </p>
          </div>
        )}
      </form>


      {erfolg && <p className="gen-success">{tr('Liste ist im Trainer! ✓')}</p>}

      {fehler === 'premium' && !istApp ? (
        <div className="plan-card plan-premium premium-teaser">
          <div className="plan-name">
            {tr('Premium-Funktion')} <span className="plan-badge badge-soon">{tr('Bald verfügbar')}</span>
          </div>
          <p className="row-hint">
            {tr('Themen-Vokabellisten erstellt die KI – diese Funktion wird mit dem Premium-Abo freigeschaltet.')}
          </p>
        </div>
      ) : (
        fehler && <p className="error">{fehler}</p>
      )}

      {liste && (
        <div className="gen-list">
          {begruendung && (
            <div className="gen-begruendung">
              <span className="gen-begruendung-marke">{tr('Warum diese Wörter?')}</span>
              <p>{begruendung}</p>
            </div>
          )}
          <p className="gen-hint">
            {tr('Deine Liste zu „{0}“ – wähle aus, was in den Trainer soll:', fertigThema)}
          </p>
          {liste.map((s, i) => (
            <label key={i} className="gen-item">
              <input
                type="checkbox"
                checked={s.checked}
                onChange={() =>
                  setListe((l) =>
                    l.map((v, j) => (j === i ? { ...v, checked: !v.checked } : v))
                  )
                }
              />
              <span className="gen-word">{s.wort}</span>
              <span className="gen-translation">{s.uebersetzung}</span>
              {s.beispiel && <span className="gen-example">„{s.beispiel}“</span>}
            </label>
          ))}
          <div className="gen-actions">
            <button onClick={uebernehmen}>
              {tr('{0} Vokabeln übernehmen', liste.filter((s) => s.checked).length)}
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
