import Logo from './Logo.jsx'
import { tr } from './sprache.js'

// Als Funktion, damit die Texte in der gerade eingestellten Sprache kommen.
const vorteile = () => [
  tr('Der Lesekurs mit allen 16 Videos'),
  tr('Unbegrenzte KI-Vokabellisten'),
  tr('Unbegrenzte Übungssätze und zweisprachige E-Books'),
]

/**
 * Die Seite direkt nach dem Kauf, im Browser wie in der App: Sie sagt
 * Danke, zeigt, was jetzt freigeschaltet ist, und führt weiter.
 */
export default function PremiumDanke({ verzoegert = false, onWeiter }) {
  return (
    <div className="kassen-seite">
      <div className="danke">
        <Logo />
        <span className="danke-haken" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor"
               strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h1>{tr('Danke! Du bist jetzt Premium.')}</h1>
        <p className="danke-unter">{tr('Das ist ab sofort für dich freigeschaltet:')}</p>
        <ul className="danke-liste">
          {vorteile().map((v) => <li key={v}>{v}</li>)}
        </ul>
        {verzoegert && <p className="danke-hinweis">{tr('Die Freischaltung kann noch einen Moment dauern. Öffne die App sonst kurz neu.')}</p>}
        <button className="kn-kaufen" onClick={onWeiter}>{tr('Weiter lernen')}</button>
      </div>
    </div>
  )
}
