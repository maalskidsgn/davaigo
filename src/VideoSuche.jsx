import { useState, useEffect, useRef } from 'react'
import { API_URL } from './api.js'
import { tr } from './sprache.js'

// Ein paar Themen zum Antippen, damit man nicht vor einem leeren Feld sitzt
// Die Längen zur Auswahl
const LAENGEN = [
  { wert: '', label: tr('Egal') },
  { wert: 'kurz', label: tr('5–10 Min') },
  { wert: 'mittel', label: tr('10–15 Min') },
  { wert: 'lang', label: tr('Über 15 Min') },
]

// Sprachniveaus. Die Beschreibung sagt, was einen erwartet –
// YouTube kennt keine Niveaus, wir steuern über Suchwörter und Länge.
const NIVEAUS = [
  { wert: '', label: tr('Egal'), hilfe: tr('Alles gemischt') },
  { wert: 'A1', label: 'A1', hilfe: tr('Kurze Erklärvideos, einfache Sprache') },
  { wert: 'A2', label: 'A2', hilfe: tr('Einfach erklärt, überschaubare Länge') },
  { wert: 'B1', label: 'B1', hilfe: tr('Normale Erklärvideos') },
  { wert: 'B2', label: 'B2', hilfe: tr('Alltagssprache, längere Beiträge') },
  { wert: 'C1', label: 'C1', hilfe: tr('Podcasts und Interviews') },
  { wert: 'C2', label: 'C2', hilfe: tr('Debatten und Analysen, volles Tempo') },
]

const IDEEN = [
  tr('Gesunde Ernährung'),
  tr('Schlaf verbessern'),
  tr('Stoizismus'),
  tr('Sport für Anfänger'),
  tr('Produktivität'),
  tr('Reisen in Russland'),
]

/**
 * Video-Suche als Overlay.
 *
 * Man gibt ein Thema auf Deutsch ein, der Server übersetzt es ins
 * Russische und sucht damit auf YouTube. Das Suchen selbst kostet
 * nichts – erst das Öffnen eines Treffers holt das Transkript.
 */
export default function VideoSuche({ onSchliessen, onVideoWaehlen, startBegriff = '' }) {
  const [begriff, setBegriff] = useState(startBegriff)
  const [laenge, setLaenge] = useState('')
  const [niveau, setNiveau] = useState('')
  const [treffer, setTreffer] = useState(null)
  const [laedt, setLaedt] = useState(false)
  const [fehler, setFehler] = useState('')
  // Warnung des Servers, wenn er den Suchbegriff nicht übersetzen
  // konnte – dann sind die Treffer womöglich deutsch.
  const [warnung, setWarnung] = useState('')
  const feldRef = useRef(null)

  // Kam der Nutzer ueber das Feld in der Mediathek, ist die Frage
  // schon gestellt – dann sofort suchen statt ihn erneut tippen zu
  // lassen. Nur beim ersten Zeichnen, sonst laeuft die Suche in einer
  // Schleife.
  const gestartet = useRef(false)
  useEffect(() => {
    if (startBegriff && !gestartet.current) {
      gestartet.current = true
      suchen(startBegriff)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startBegriff])

  // Beim Öffnen direkt ins Suchfeld springen, Escape schließt
  useEffect(() => {
    feldRef.current?.focus()
    const beiTaste = (e) => e.key === 'Escape' && onSchliessen()
    window.addEventListener('keydown', beiTaste)
    return () => window.removeEventListener('keydown', beiTaste)
  }, [onSchliessen])

  async function suchen(text) {
    const frage = (text ?? begriff).trim()
    if (!frage) return

    setBegriff(frage)
    setLaedt(true)
    setFehler('')
    setWarnung('')
    setTreffer(null)
    try {
      const adresse =
        API_URL +
        '/api/search?q=' + encodeURIComponent(frage) +
        (laenge ? '&laenge=' + laenge : '') +
        (niveau ? '&niveau=' + niveau : '')
      const res = await fetch(adresse)
      const daten = await res.json()
      if (!res.ok) throw new Error(daten.error || tr('Suche fehlgeschlagen'))
      setTreffer((daten.results ?? []).slice(0, 6))
      // Der Server sagt Bescheid, wenn er den Suchbegriff nicht ins
      // Russische übersetzen konnte. Dann stehen dort womöglich
      // deutsche Videos – das gehört dazugesagt, statt sie
      // kommentarlos unter "russische Videos" zu stellen.
      setWarnung(daten.hinweis ?? '')
    } catch (f) {
      setFehler(f.message)
    } finally {
      setLaedt(false)
    }
  }

  function dauerText(sekunden) {
    if (!sekunden) return ''
    const min = Math.floor(sekunden / 60)
    const sek = Math.round(sekunden % 60)
    return `${min}:${String(sek).padStart(2, '0')}`
  }

  return (
    <div className="suche-hintergrund" onClick={onSchliessen}>
      <div className="suche-fenster" onClick={(e) => e.stopPropagation()}>
        <div className="suche-kopf">
          <div>
            <b>{tr('Video finden')}</b>
            <span>{tr('Thema auf Deutsch eingeben – wir suchen russische Videos dazu')}</span>
          </div>
          <button className="suche-schliessen" onClick={onSchliessen} aria-label={tr('Schließen')}>
            ×
          </button>
        </div>

        <form
          className="suche-form"
          onSubmit={(e) => {
            e.preventDefault()
            suchen()
          }}
        >
          <input
            ref={feldRef}
            type="text"
            value={begriff}
            onChange={(e) => setBegriff(e.target.value)}
            placeholder={tr('z.B. gesunde Ernährung, Schlaf …')}
          />
          <button type="submit" className="btn" disabled={laedt || !begriff.trim()}>
            {laedt ? tr('Sucht …') : tr('Suchen')}
          </button>
        </form>

        {/* Länge und Niveau vor der Suche wählen */}
        <div className="suche-filter">
          <div className="filter-gruppe">
            <span className="filter-label">{tr('Länge')}</span>
            <div className="filter-knoepfe">
              {LAENGEN.map((l) => (
                <button
                  key={l.wert}
                  className={'filter-knopf' + (laenge === l.wert ? ' filter-an' : '')}
                  onClick={() => setLaenge(l.wert)}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-gruppe">
            <span className="filter-label">
              {tr('Niveau')}
              {niveau && (
                <em className="filter-hilfe">
                  {NIVEAUS.find((n) => n.wert === niveau)?.hilfe}
                </em>
              )}
            </span>
            <div className="filter-knoepfe">
              {NIVEAUS.map((n) => (
                <button
                  key={n.wert}
                  className={'filter-knopf' + (niveau === n.wert ? ' filter-an' : '')}
                  onClick={() => setNiveau(n.wert)}
                  title={n.hilfe}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vorschläge, solange noch nichts gesucht wurde */}
        {!treffer && !laedt && !fehler && (
          <div className="suche-ideen">
            {IDEEN.map((idee) => (
              <button key={idee} className="chip" onClick={() => suchen(idee)}>
                {idee}
              </button>
            ))}
          </div>
        )}

        {laedt && <p className="suche-hinweis">{tr('Suche russische Videos zu „{0}“ …', begriff)}</p>}
        {fehler && <p className="error">{fehler}</p>}
        {treffer?.length === 0 && (
          <p className="suche-hinweis">
            {tr('Nichts gefunden. Versuch es mit einem anderen Wort.')}
          </p>
        )}

        {treffer?.length > 0 && (
          <>
            {warnung && <p className="suche-warnung">{warnung}</p>}
            <p className="suche-hinweis">
              {tr('{0} Videos gefunden – tippe eins an, um es zu öffnen.', treffer.length)}
            </p>
            <div className="suche-treffer">
              {treffer.map((v) => (
                <button
                  key={v.videoId}
                  className="treffer"
                  onClick={() => {
                    onVideoWaehlen(v.videoId)
                    onSchliessen()
                  }}
                >
                  <img src={v.thumbnail} alt="" />
                  <span className="treffer-text">
                    <span className="treffer-titel">{v.title}</span>
                    <span className="treffer-meta">
                      {v.channel}
                      {v.duration ? ' · ' + dauerText(v.duration) : ''}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
