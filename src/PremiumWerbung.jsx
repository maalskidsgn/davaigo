import { useEffect, useState } from 'react'
import { istApp } from './api.js'
import { bezahlungBereit } from './premium.js'
import { LISTEN_PRO_TAG, naechsteAuffuellung } from './limits.js'
import { tr } from './sprache.js'

/**
 * Hinweis, wenn die kostenlosen Generierungen fuer heute aufgebraucht
 * sind – zugleich die Werbung fuer Premium.
 *
 * In der Store-App gibt es keinen Kaufknopf: Ein Verweis auf die
 * Web-Kasse wuerde gegen die Play-Billing-Regeln verstossen.
 *
 * @param {string} was – z. B. "Vokabellisten", "Texte", "Sätze"
 */
export default function PremiumWerbung({ was = tr('Generierungen') }) {
  const [bezahlbar, setBezahlbar] = useState(false)

  useEffect(() => {
    if (istApp) return
    bezahlungBereit().then(setBezahlbar).catch(() => setBezahlbar(false))
  }, [])

  // In der Store-App kein Wort über Premium: Apple und Google werten
  // das als Hinweis, ausserhalb des Stores zu kaufen.
  if (istApp) {
    return (
      <div className="premium-werbung">
        <div className="pw-kopf">
          <span className="pw-symbol" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="8.5" />
              <path d="M12 7.5V12l3 2" />
            </svg>
          </span>
          <div>
            <p className="pw-ueber">{tr('Für diesen Monat geschafft')}</p>
            <h3 className="pw-titel">{tr('Nächsten Monat geht\'s weiter')}</h3>
          </div>
        </div>
        <p className="pw-text">
          {tr('Deine Gratis-Erstellungen für diesen Monat sind aufgebraucht. Neue {0} gibt es {1} – bis dahin kannst du mit dem Gesammelten üben.', was, naechsteAuffuellung())}
        </p>
      </div>
    )
  }

  function zurKasse() {
    window.history.pushState({ kasse: true }, '', '/kasse')
    window.dispatchEvent(new PopStateEvent('popstate', { state: { kasse: true } }))
    window.scrollTo(0, 0)
  }

  return (
    <div className="premium-werbung">
      <div className="pw-kopf">
        <span className="pw-symbol" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
            <path d="M3 8l4.5 3.5L12 5l4.5 6.5L21 8l-2 11H5L3 8z" />
          </svg>
        </span>
        <div>
          <p className="pw-ueber">{tr('Monatslimit erreicht')}</p>
          <h3 className="pw-titel">
            {tr('Mehr lernen mit')} <span className="accent">{tr('Premium')}</span>
          </h3>
        </div>
      </div>

      <p className="pw-text">
        {tr('Deine {0} Gratis-Erstellungen für diesen Monat sind aufgebraucht. Neue {1} gibt es {2} – oder sofort und ohne Grenze mit Premium.', LISTEN_PRO_TAG, was, naechsteAuffuellung())}
      </p>

      <ul className="pw-vorteile">
        <li>{tr('Unbegrenzt Vokabellisten, Wörter und Texte')}</li>
        <li>{tr('Unbegrenzt eigene YouTube-Videos')}</li>
        <li>{tr('Zweisprachige E-Books ohne Limit')}</li>
      </ul>

      {!istApp &&
        (bezahlbar ? (
          <button className="pw-knopf" onClick={zurKasse}>
            {tr('Premium freischalten')}
          </button>
        ) : (
          <p className="pw-bald">{tr('Premium ist bald verfügbar')}</p>
        ))}
    </div>
  )
}
