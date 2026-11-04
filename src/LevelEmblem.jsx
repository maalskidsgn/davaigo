// Die Embleme zu den Level-Stufen (LEVEL_STUFEN in gamification.js).
//
// Eine weiche Pastell-Kachel – die Form aus dem Davaigo-Logo –, darin
// eine helle Scheibe mit dem Symbol im dunkleren Ton derselben Farbe.
// Harte Kanten gibt es nicht. Die Funken zeigen den Rang.
// Вечное Солнце bricht bewusst damit: Das Ziel soll man von weitem erkennen.
// Alles SVG, damit es in der Kopfleiste genauso scharf ist wie im Profil.
import { useId } from 'react'
import { levelName, levelStufe } from './gamification.js'
import { tr } from './sprache.js'

const FUNKE = 'M0-5c.8 3.2 1.8 4.2 5 5-3.2.8-4.2 1.8-5 5-.8-3.2-1.8-4.2-5-5 3.2-.8 4.2-1.8 5-5z'
const FUNKEN_ORTE = [[52.5, 11.5], [11.5, 11.5], [52.5, 52.5]]

/** Ein Strahlenkranz als Stern: abwechselnd außen und innen. */
function kranz(zacken, aussen, innen) {
  return Array.from({ length: zacken * 2 }, (_, i) => {
    const winkel = (i * Math.PI) / zacken
    const r = i % 2 ? innen : aussen
    return `${(32 + r * Math.sin(winkel)).toFixed(2)} ${(32 - r * Math.cos(winkel)).toFixed(2)}`
  }).join(' ')
}
const KRANZ_LANG = kranz(16, 32, 20)
const KRANZ_KURZ = kranz(16, 26, 19)

const FLAECHE = {
  blatt: 'M19.5 4C10 4 5 9 5 15c0 1.9.5 3.4 1.4 4.5C8 14.5 11 11.3 15 9c-3 3-5.8 6.3-6.9 11.2 1 .3 2 .5 3 .5 6.5 0 9.4-6 8.4-16.7z',
  buch: 'M3.5 5.5C6.5 4.3 9.5 4.6 11.3 6.5V19.3C9.5 17.5 6.5 17.2 3.5 18.3zM20.5 5.5C17.5 4.3 14.5 4.6 12.7 6.5V19.3C14.5 17.5 17.5 17.2 20.5 18.3z',
  stern: 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z',
  blitz: 'M13.5 2L5 13.5h6L10 22l9-12h-6.3z',
  diamant: 'M7 4h10l4.5 6L12 21.5 2.5 10z',
  krone: 'M2.5 7.5l5 4.5L12 4.5l4.5 7.5 5-4.5L19.3 19H4.7z',
  grosseKrone: 'M2.5 5.5l5 4.5L12 2.5 16.5 10l5-4.5L19.5 15h-15zM5 17h14v3H5z',
  fluegel: 'M10.3 10.5C7.2 9.7 4 7.7 1.5 4.5c-.2 4.7.9 9.6 4 12 1.5 1.1 3.2 1.3 4.8.7zM13.7 10.5c3.1-.8 6.3-2.8 8.8-6 .2 4.7-.9 9.6-4 12-1.5 1.1-3.2 1.3-4.8.7zM12 6.5l1.7 4.5L12 19.5 10.3 11z',
  komet: 'M21.5 2.5L10 9a6.5 6.5 0 1 0 5 5z',
  berg: 'M1.5 20.5L8.8 7.5l3.2 4.7L15.3 5l7.2 15.5z',
}

const LINIE = {
  keim: ['M12 21v-9', 'M12 12.5C12 8.5 9 6 4.5 6c0 4.5 3 6.5 7.5 6.5z', 'M12 15c0-3.5 3-5.5 7.5-5.5 0 4-3 5.5-7.5 5.5z'],
  kompass: ['M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18z'],
  haken: ['M5 12.5l4.5 4.5L19 7'],
  unendlich: ['M7.5 8.3a3.7 3.7 0 0 0 0 7.4c3.6 0 5.4-7.4 9-7.4a3.7 3.7 0 0 1 0 7.4c-3.6 0-5.4-7.4-9-7.4z'],
}

function Symbol({ name, farbe }) {
  if (LINIE[name]) {
    return (
      <g fill="none" stroke={farbe} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {LINIE[name].map((d) => <path key={d} d={d} />)}
        {name === 'kompass' && <path d="M15.8 8.2l-2.3 5.3-5.3 2.3 2.3-5.3z" fill={farbe} stroke="none" />}
      </g>
    )
  }
  return <path d={FLAECHE[name]} fill={farbe} stroke={farbe} strokeWidth="1.2" strokeLinejoin="round" />
}

function SolEterno({ id }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}s`}>
          <stop offset="55%" stopColor="#ffc800" stopOpacity=".65" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff3a8" />
          <stop offset="50%" stopColor="#ffb300" />
          <stop offset="100%" stopColor="#ff9f1c" />
        </linearGradient>
        <radialGradient id={`${id}k`} cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#fffbe0" />
          <stop offset="38%" stopColor="#ffd23c" />
          <stop offset="72%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#6d28d9" />
        </radialGradient>
      </defs>
      <circle className="sol-schein" cx="32" cy="32" r="32" fill={`url(#${id}s)`} />
      <polygon className="sol-kranz-lang" points={KRANZ_LANG} fill={`url(#${id}l)`} />
      <polygon className="sol-kranz-kurz" points={KRANZ_KURZ} fill="#a855f7" opacity=".75" />
      <circle cx="32" cy="32" r="19" fill={`url(#${id}k)`} stroke="#fff6c9" strokeWidth="2" />
      <text className="sol-funke" x="32" y="40" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="23" fontWeight="900" fill="#3b0f7a">Д</text>
      <g className="sol-bahn">
        <path d={FUNKE} fill="#fff" transform="translate(32 3) scale(.75)" />
        <path d={FUNKE} fill="#fff3a8" transform="translate(57 46) scale(.6)" />
        <path d={FUNKE} fill="#fff" transform="translate(7 46) scale(.6)" />
      </g>
    </>
  )
}

/**
 * @param {number} level
 * @param {number} groesse – Kantenlänge in Pixeln
 * @param {string} klasse
 */
export default function LevelEmblem({ level, groesse = 48, klasse = '' }) {
  const stufe = levelStufe(level)
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const { verlauf, farbe, symbol, funken, sol } = stufe

  return (
    <svg
      className={`level-emblem${sol ? ' level-emblem-sol' : ''} ${klasse}`.trim()}
      style={sol ? undefined : { '--emblem-schein': farbe + '55' }}
      viewBox="0 0 64 64"
      width={groesse}
      height={groesse}
      role="img"
      aria-label={`Level ${level} – ${levelName(level)}`}
    >
      <title>{`Level ${level} – ${levelName(level)}`}</title>
      {sol ? (
        <SolEterno id={id} />
      ) : (
        <>
          <defs>
            <linearGradient id={`${id}f`} x1="0" y1="0" x2="1" y2="1">
              {verlauf.map((c, i) => (
                <stop key={c} offset={`${(i * 100) / (verlauf.length - 1)}%`} stopColor={c} />
              ))}
            </linearGradient>
          </defs>
          <rect x="3" y="3" width="58" height="58" rx="16" fill={`url(#${id}f)`} />
          <circle cx="32" cy="32" r="20" fill="#fff" opacity=".62" />
          <g transform="translate(20 20)">
            <Symbol name={symbol} farbe={farbe} />
          </g>
          {FUNKEN_ORTE.slice(0, funken).map(([x, y]) => (
            <path key={x + '-' + y} d={FUNKE} fill="#fff" transform={`translate(${x} ${y}) scale(.7)`} />
          ))}
        </>
      )}
    </svg>
  )
}

/** Emblem mit Titel und Level – so steht es in den Profilen. */
export function LevelPlakette({ level }) {
  const { farbe, sol } = levelStufe(level)
  return (
    <div
      className={'level-plakette' + (sol ? ' level-plakette-sol' : '')}
      style={sol ? undefined : { '--plakette-ton': farbe }}
    >
      <LevelEmblem level={level} groesse={56} />
      <span>
        <b>{levelName(level)}</b>
        <small>{tr('Level {0}', level)}</small>
      </span>
    </div>
  )
}
