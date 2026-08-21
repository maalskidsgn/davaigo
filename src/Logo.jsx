/**
 * Das Davaigo-Zeichen: ein goldenes Feld mit dem kyrillischen Д –
 * dem Anfangsbuchstaben von „Давай!“ (Los geht’s!).
 *
 * Als SVG-Text statt Schriftzeichen, damit es in jeder Größe
 * (Kopfzeile, Anmelde-Dialog, Startseite) sauber mitwächst.
 *
 * @param {string} klasse – zusätzliche CSS-Klasse für die Größe
 */
export default function Logo({ klasse = '' }) {
  return (
    <span className={'logo-badge ' + klasse}>
      <svg viewBox="0 0 44 44" aria-hidden="true" focusable="false">
        <text
          x="22"
          y="33.5"
          textAnchor="middle"
          fontSize="31"
          fontWeight="900"
          fontFamily="inherit"
          fill="currentColor"
        >
          Д
        </text>
      </svg>
    </span>
  )
}
