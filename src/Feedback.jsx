import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { API_URL, istApp } from './api.js'
import { supabaseBereit, db } from './supabase.js'
import { plattform } from './kauf.js'
import { tr, sprache } from './sprache.js'

const ARTEN = ['idee', 'kritik', 'fehler', 'sprechen']

/**
 * Knopf samt Formular: Die Nachricht geht ins Postfach, das Manuel
 * selbst liest. Antworten laufen per Mail, deshalb wird die Adresse
 * des Kontos vorgeschlagen, bleibt aber änderbar.
 */
export default function FeedbackKnopf({ art = 'idee', className = 'btn-small' }) {
  const [offen, setOffen] = useState(false)
  return (
    <>
      <button className={className} onClick={() => setOffen(true)}>{tr('Feedback geben')}</button>
      {offen && createPortal(<Formular start={art} onZu={() => setOffen(false)} />, document.body)}
    </>
  )
}

function Formular({ start, onZu }) {
  const [art, setArt] = useState(start)
  const [text, setText] = useState('')
  const [antwort, setAntwort] = useState('')
  const [falle, setFalle] = useState('')
  const [stand, setStand] = useState('') // '' | 'sendet' | 'fertig'
  const [fehler, setFehler] = useState('')

  useEffect(() => {
    if (!supabaseBereit) return
    db.auth.getSession().then(({ data }) => {
      const adresse = data?.session?.user?.email
      if (adresse) setAntwort((a) => a || adresse)
    })
  }, [])

  async function senden(e) {
    e.preventDefault()
    if (text.trim().length < 5) return setFehler(tr('Schreib bitte ein paar Worte mehr.'))
    setFehler('')
    setStand('sendet')
    try {
      const sitzung = supabaseBereit ? (await db.auth.getSession()).data.session : null
      const r = await fetch(API_URL + '/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sitzung ? { Authorization: 'Bearer ' + sitzung.access_token } : {}),
        },
        body: JSON.stringify({
          art, text, antwort, falle,
          quelle: istApp ? plattform() : 'web',
          sprache: sprache(),
          geraet: navigator.userAgent,
        }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(d.error || tr('Das Senden klappt gerade nicht. Versuch es bitte später nochmal.'))
      setStand('fertig')
    } catch (f) {
      setFehler(f.message)
      setStand('')
    }
  }

  return (
    <div className="fb-grund" onClick={(e) => e.target === e.currentTarget && onZu()}>
      <div className="fb-fenster" role="dialog" aria-modal="true">
        <button className="fb-zu" onClick={onZu} aria-label={tr('Schließen')}>×</button>
        {stand === 'fertig' ? (
          <div className="fb-danke">
            <h2>{tr('Danke dir!')}</h2>
            <p>{tr('Deine Nachricht ist angekommen. Ich lese sie selbst und melde mich, wenn du eine Adresse angegeben hast.')}</p>
            <button className="btn" onClick={onZu}>{tr('Fertig')}</button>
          </div>
        ) : (
          <form onSubmit={senden}>
            <h2>{tr('Dein Feedback')}</h2>
            <p className="fb-unter">{tr('Ich bin Manuel und baue Davaigo. Ich lese jede Nachricht selbst, und Kritik ist ausdrücklich willkommen.')}</p>
            <div className="fb-arten" role="radiogroup">
              {ARTEN.map((a) => (
                <button type="button" key={a} role="radio" aria-checked={art === a}
                  className={'fb-art' + (art === a ? ' ist-aktiv' : '')} onClick={() => setArt(a)}>
                  {tr({ idee: 'Idee', kritik: 'Kritik', fehler: 'Fehler', sprechen: 'Sprach-Trainer' }[a])}
                </button>
              ))}
            </div>
            <label className="fb-feld">
              <span>{tr('Deine Nachricht')}</span>
              <textarea rows={6} maxLength={4000} value={text} onChange={(e) => setText(e.target.value)}
                placeholder={tr('Was gefällt dir, was stört, was fehlt?')} autoFocus />
            </label>
            <label className="fb-feld">
              <span>{tr('Deine E-Mail, falls ich antworten soll (freiwillig)')}</span>
              <input type="email" value={antwort} onChange={(e) => setAntwort(e.target.value)} autoComplete="email" />
            </label>
            <input className="fb-falle" tabIndex={-1} autoComplete="off" aria-hidden="true"
              value={falle} onChange={(e) => setFalle(e.target.value)} />
            {fehler && <p className="fb-fehler">{fehler}</p>}
            <button className="btn fb-senden" disabled={stand === 'sendet'}>
              {stand === 'sendet' ? tr('Wird gesendet …') : tr('Absenden')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
