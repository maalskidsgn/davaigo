/**
 * Das Davaigo-Zeichen, wie das App-Symbol: goldenes Д auf violettem Feld –
 * dem Anfangsbuchstaben von „Давай!“ (Los geht’s!).
 *
 * Als gezeichnete Form statt Schriftzeichen: Das breite Д des Symbols
 * gibt es in keiner Schrift, und so wächst es in jeder Größe sauber mit.
 *
 * @param {string} klasse – zusätzliche CSS-Klasse für die Größe
 */
export default function Logo({ klasse = '' }) {
  return (
    <span className={'logo-badge ' + klasse}>
      <svg viewBox="0 0 44 44" aria-hidden="true" focusable="false">
        <path
          fill="#f9c74f"
          fillRule="evenodd"
          d="M15 8h19.5v20H38v11h-6.5v-5h-19v5H6V28h3.5c3-4.5 5-11 5.5-20zm5.8 6c-.4 5.2-1.7 10-3.7 14h10.9V14z"
        />
      </svg>
    </span>
  )
}
