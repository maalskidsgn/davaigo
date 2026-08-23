import { useEffect, useRef } from 'react'
import { APP_NAME } from './App.jsx'
import Logo from './Logo.jsx'

/**
 * Die Startseite für alle, die noch kein Konto haben – im Stil der
 * großen Lern-Apps: oben der Hero mit Maskottchen, darunter im
 * Wechsel Bild und Text zu den Stärken der App, dann Premium und
 * der große Schluss-Aufruf.
 *
 * Alle Zeichnungen sind eingebaute SVGs in den Davaigo-Farben
 * (Violett & Gold) – keine Bilddateien, dadurch immer scharf.
 */

// ---------------------------------------------------------------
//  Die Zeichnungen
// ---------------------------------------------------------------

/** Das Maskottchen: die Davaigo-Sprechblase mit Gesicht und Funke */
function Maskottchen() {
  return (
    <svg className="lp-maskottchen" viewBox="0 0 320 260" aria-hidden="true">
      {/* kleine Wort-Blasen drumherum */}
      <g className="lp-schwebt lp-tempo-1">
        <rect x="10" y="30" width="64" height="46" rx="14" fill="#f3ecff" />
        <text x="42" y="61" textAnchor="middle" fontSize="26" fontWeight="900" fill="#6d28d9">Д</text>
      </g>
      <g className="lp-schwebt lp-tempo-2">
        <rect x="246" y="14" width="60" height="44" rx="14" fill="#fff3c4" />
        <text x="276" y="44" textAnchor="middle" fontSize="24" fontWeight="900" fill="#b45309">Я</text>
      </g>
      <g className="lp-schwebt lp-tempo-3">
        <rect x="252" y="170" width="58" height="42" rx="14" fill="#f3ecff" />
        <text x="281" y="199" textAnchor="middle" fontSize="22" fontWeight="900" fill="#6d28d9">Ж</text>
      </g>
      {/* Goldmünzen */}
      <circle className="lp-schwebt lp-tempo-2" cx="36" cy="196" r="16" fill="#ffc800" />
      <circle className="lp-schwebt lp-tempo-2" cx="36" cy="196" r="10" fill="#ffde59" />
      <circle className="lp-schwebt lp-tempo-1" cx="288" cy="112" r="11" fill="#ffc800" />

      {/* die große Sprechblase mit Gesicht */}
      <g className="lp-schwebt">
        <path
          d="M96 52h128a30 30 0 0 1 30 30v72a30 30 0 0 1-30 30h-73l-36 30v-30h-19a30 30 0 0 1-30-30V82a30 30 0 0 1 30-30z"
          fill="url(#lpViolett)"
        />
        {/* Augen */}
        <circle cx="138" cy="112" r="13" fill="#fff" />
        <circle cx="182" cy="112" r="13" fill="#fff" />
        <circle cx="141" cy="115" r="6" fill="#241338" />
        <circle cx="185" cy="115" r="6" fill="#241338" />
        {/* Lächeln */}
        <path d="M146 142q14 14 28 0" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" />
        {/* der goldene Funke auf der Stirn */}
        <path
          d="M160 62c1.4 5.6 2.9 7.1 8.5 8.5-5.6 1.4-7.1 2.9-8.5 8.5-1.4-5.6-2.9-7.1-8.5-8.5 5.6-1.4 7.1-2.9 8.5-8.5z"
          fill="url(#lpGold)"
        />
      </g>

      <defs>
        <linearGradient id="lpViolett" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="lpGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd23f" />
          <stop offset="1" stopColor="#ffb300" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/** Handy mit Video und anklickbaren Wörtern */
function BildVideo() {
  return (
    <svg viewBox="0 0 300 240" aria-hidden="true">
      <rect x="70" y="10" width="160" height="220" rx="24" fill="#241338" />
      <rect x="80" y="22" width="140" height="196" rx="16" fill="#fff" />
      {/* Video-Fläche mit Play */}
      <rect x="90" y="34" width="120" height="70" rx="10" fill="#f3ecff" />
      <circle cx="150" cy="69" r="18" fill="#7c3aed" />
      <path d="M144 59l18 10-18 10z" fill="#fff" />
      {/* Textzeilen als anklickbare Wörter */}
      <rect x="90" y="116" width="52" height="16" rx="8" fill="#efe9f8" />
      <rect x="148" y="116" width="40" height="16" rx="8" fill="#ffe9a8" />
      <rect x="194" y="116" width="16" height="16" rx="8" fill="#efe9f8" />
      <rect x="90" y="140" width="34" height="16" rx="8" fill="#d6e8ff" />
      <rect x="130" y="140" width="58" height="16" rx="8" fill="#efe9f8" />
      <rect x="90" y="164" width="46" height="16" rx="8" fill="#efe9f8" />
      <rect x="142" y="164" width="30" height="16" rx="8" fill="#efe9f8" />
      {/* aufpoppende Übersetzung */}
      <g className="lp-schwebt lp-tempo-2">
        <rect x="10" y="120" width="96" height="54" rx="14" fill="#fff" stroke="#ece3f8" strokeWidth="2" />
        <text x="58" y="144" textAnchor="middle" fontSize="16" fontWeight="900" fill="#241338">привет</text>
        <text x="58" y="163" textAnchor="middle" fontSize="12" fontWeight="700" fill="#756a85">hallo</text>
      </g>
    </svg>
  )
}

/** Karteikasten: Kartenstapel mit Uhr */
function BildKarten() {
  return (
    <svg viewBox="0 0 300 240" aria-hidden="true">
      <rect x="66" y="66" width="180" height="120" rx="18" fill="#e9e2f6" transform="rotate(-6 156 126)" />
      <rect x="58" y="56" width="184" height="124" rx="18" fill="#f3ecff" transform="rotate(3 150 118)" />
      <rect x="52" y="48" width="190" height="130" rx="18" fill="#fff" stroke="#ece3f8" strokeWidth="2" />
      <text x="147" y="102" textAnchor="middle" fontSize="26" fontWeight="900" fill="#241338">спасибо</text>
      <text x="147" y="130" textAnchor="middle" fontSize="16" fontWeight="700" fill="#756a85">danke</text>
      {/* Stufen-Punkte des Karteikastens */}
      <g>
        <circle cx="117" cy="156" r="7" fill="#7c3aed" />
        <circle cx="139" cy="156" r="7" fill="#a78bfa" />
        <circle cx="161" cy="156" r="7" fill="#d9cfe6" />
        <circle cx="183" cy="156" r="7" fill="#d9cfe6" />
      </g>
      {/* Wecker: das Gedächtnis der App */}
      <g className="lp-schwebt lp-tempo-1">
        <circle cx="236" cy="60" r="26" fill="#ffc800" />
        <circle cx="236" cy="60" r="19" fill="#fff" />
        <path d="M236 48v12l8 6" stroke="#241338" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  )
}

/** Motivation: Flamme, Level-Ring und Münzen */
function BildMotivation() {
  return (
    <svg viewBox="0 0 300 240" aria-hidden="true">
      {/* Level-Ring */}
      <circle cx="150" cy="120" r="64" fill="none" stroke="#f0e9fb" strokeWidth="16" />
      <path d="M150 56a64 64 0 0 1 60 88" fill="none" stroke="#7c3aed" strokeWidth="16" strokeLinecap="round" />
      {/* Flamme in der Mitte */}
      <path
        d="M150 84c14 18 26 28 26 46a26 26 0 0 1-52 0c0-10 5-17 12-25 2 8 5 12 10 14-2-12 0-24 4-35z"
        fill="url(#lpFeuer)"
      />
      {/* XP-Münzen */}
      <g className="lp-schwebt lp-tempo-2">
        <circle cx="242" cy="76" r="20" fill="#ffc800" />
        <text x="242" y="82" textAnchor="middle" fontSize="13" fontWeight="900" fill="#7a4a00">XP</text>
      </g>
      <g className="lp-schwebt lp-tempo-3">
        <circle cx="58" cy="160" r="15" fill="#ffc800" />
        <circle cx="58" cy="160" r="9" fill="#ffde59" />
      </g>
      <defs>
        <linearGradient id="lpFeuer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb300" />
          <stop offset="1" stopColor="#ff7a00" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/** KI: der Funke stellt eine persönliche Wortliste zusammen */
function BildKi() {
  return (
    <svg viewBox="0 0 300 240" aria-hidden="true">
      {/* der große Funke */}
      <g className="lp-schwebt">
        <path
          d="M88 66c4.5 18 9.5 23 27.5 27.5C97.5 98 92.5 103 88 121c-4.5-18-9.5-23-27.5-27.5C78.5 89 83.5 84 88 66z"
          fill="url(#lpGold2)"
        />
        <circle cx="122" cy="58" r="7" fill="#ffc800" />
      </g>
      {/* die Liste, die er baut */}
      <rect x="140" y="44" width="130" height="152" rx="16" fill="#fff" stroke="#ece3f8" strokeWidth="2" />
      <rect x="154" y="62" width="70" height="12" rx="6" fill="#7c3aed" />
      <rect x="154" y="88" width="100" height="10" rx="5" fill="#efe9f8" />
      <rect x="154" y="108" width="88" height="10" rx="5" fill="#efe9f8" />
      <rect x="154" y="128" width="96" height="10" rx="5" fill="#ffe9a8" />
      <rect x="154" y="148" width="76" height="10" rx="5" fill="#efe9f8" />
      <rect x="154" y="168" width="92" height="10" rx="5" fill="#efe9f8" />
      {/* Häkchen */}
      <g className="lp-schwebt lp-tempo-1">
        <circle cx="140" cy="196" r="20" fill="#2aae5f" />
        <path d="M130 196l7 7 13-14" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
      <defs>
        <linearGradient id="lpGold2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd23f" />
          <stop offset="1" stopColor="#ffb300" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ---------------------------------------------------------------
//  Die Seite
// ---------------------------------------------------------------

// Die vier Stärken – Text links/rechts im Wechsel wie bei Duolingo
const STAERKEN = [
  {
    titel: 'Kostenlos. Unterhaltsam. Effektiv.',
    text: 'Du lernst mit echten YouTube-Videos: Der Text läuft mit, jedes Wort ist antippbar und wandert mit einem Klick in deinen Vokabeltrainer. So fühlt sich Lernen nicht nach Schule an.',
    bild: <BildVideo />,
  },
  {
    titel: 'Merkt sich, was du vergisst',
    text: 'Dein Vokabeltrainer arbeitet wie ein Karteikasten mit Gedächtnis: Was du kannst, kommt seltener dran. Was du fast vergessen hättest, genau im richtigen Moment wieder.',
    bild: <BildKarten />,
  },
  {
    titel: 'Immer motiviert',
    text: 'XP für jede Übung, eine Tagesserie, die du nicht reißen willst, Level mit Namen und Mini-Spiele mit deinen eigenen Wörtern – dranbleiben war noch nie so leicht.',
    bild: <BildMotivation />,
  },
  {
    titel: 'Personalisiertes Lernen',
    text: 'Die KI stellt dir Vokabellisten zu deinen Themen zusammen, schreibt zweisprachige Bücher auf deinem Niveau und schlägt nie Wörter vor, die du längst kennst.',
    bild: <BildKi />,
  },
]

// Die ersten russischen Wörter als Vorgeschmack im Laufband
const WOERTER = [
  ['Привет', 'Hallo'],
  ['Спасибо', 'Danke'],
  ['Давай!', 'Los geht’s!'],
  ['Хорошо', 'Gut'],
  ['Пока', 'Tschüss'],
  ['Да', 'Ja'],
  ['Дружба', 'Freundschaft'],
]

export default function Willkommen({ onStarten, onAnmelden, onRecht }) {
  const seite = useRef(null)

  // Alles mit der Klasse "lp-zeig" gleitet herein, sobald es beim
  // Scrollen in den sichtbaren Bereich kommt.
  useEffect(() => {
    const elemente = seite.current?.querySelectorAll('.lp-zeig') ?? []
    const beobachter = new IntersectionObserver(
      (eintraege) => {
        for (const e of eintraege) {
          if (e.isIntersecting) {
            e.target.classList.add('lp-da')
            beobachter.unobserve(e.target)
          }
        }
      },
      { threshold: 0.25 }
    )
    elemente.forEach((el) => beobachter.observe(el))
    return () => beobachter.disconnect()
  }, [])

  return (
    <div className="lp" ref={seite}>
      {/* ---------- Kopfleiste ---------- */}
      <nav className="lp-nav">
        <span className="lp-marke">
          <Logo klasse="lp-logo" />
          <span className="lp-name">{APP_NAME}</span>
        </span>
        <button className="lp-knopf-leise" onClick={onAnmelden}>
          Anmelden
        </button>
      </nav>

      {/* ---------- Hero ---------- */}
      <header className="lp-hero">
        <div className="lp-hero-bild">
          <Maskottchen />
        </div>
        <div className="lp-hero-text">
          <h1>
            Die unterhaltsamste Art, <span className="lp-akzent">Russisch</span> zu lernen!
          </h1>
          <div className="lp-hero-knoepfe">
            <button className="lp-knopf-gold" onClick={onStarten}>
              Loslegen
            </button>
            <button className="lp-knopf-rahmen" onClick={onAnmelden}>
              Ich habe schon ein Konto
            </button>
          </div>
        </div>
      </header>

      {/* ---------- Wörter-Laufleiste ---------- */}
      <div className="lp-woerter">
        {WOERTER.map(([ru, de]) => (
          <span key={ru} className="lp-wort">
            <b>{ru}</b>
            <i>{de}</i>
          </span>
        ))}
      </div>

      {/* ---------- Die vier Stärken ---------- */}
      {STAERKEN.map((s, i) => (
        <section key={s.titel} className={'lp-staerke lp-zeig' + (i % 2 ? ' lp-getauscht' : '')}>
          <div className="lp-staerke-bild">{s.bild}</div>
          <div className="lp-staerke-text">
            <h2>{s.titel}</h2>
            <p>{s.text}</p>
          </div>
        </section>
      ))}

      {/* ---------- Überall lernen ---------- */}
      <section className="lp-ueberall lp-zeig">
        <span className="lp-kachel lp-k1">Д</span>
        <span className="lp-kachel lp-k2">🔥</span>
        <span className="lp-kachel lp-k3">Я</span>
        <span className="lp-kachel lp-k4">🃏</span>
        <span className="lp-kachel lp-k5">Б</span>
        <span className="lp-kachel lp-k6">🎬</span>
        <h2>Lerne jederzeit und überall</h2>
        <p>
          Im Browser, auf dem Handy oder Tablet – dein Fortschritt reist mit.
        </p>
        <span className="lp-bald">📱 Bald auch im App Store &amp; bei Google Play</span>
      </section>

      {/* ---------- Premium ---------- */}
      <section className="lp-premium lp-zeig">
        <div className="lp-premium-karte">
          <span className="lp-premium-funke" aria-hidden="true">✦</span>
          <p className="lp-premium-ueber">Power up mit</p>
          <h2 className="lp-premium-titel">{APP_NAME} Premium</h2>
          <p className="lp-premium-text">
            Unbegrenzte KI-Vokabellisten und E-Books, Abgleich auf allen
            Geräten und Statistiken zu deinem Fortschritt.
          </p>
          <button className="lp-knopf-hell" onClick={onStarten}>
            Kostenlos ausprobieren
          </button>
        </div>
      </section>

      {/* ---------- Großer Schluss ---------- */}
      <section className="lp-schluss lp-zeig">
        <h2>
          Lerne Russisch<br />mit {APP_NAME}
        </h2>
        <button className="lp-knopf-gold" onClick={onStarten}>
          Давай – los geht’s!
        </button>
      </section>

      {/* ---------- Fußbereich ---------- */}
      <footer className="lp-fuss">
        <div className="lp-fuss-spalten">
          <div>
            <h3>Lernen</h3>
            <button onClick={onStarten}>Lektionen</button>
            <button onClick={onStarten}>Vokabeltrainer</button>
            <button onClick={onStarten}>Videos &amp; Songs</button>
            <button onClick={onStarten}>E-Books</button>
          </div>
          <div>
            <h3>Konto</h3>
            <button onClick={onStarten}>Kostenlos starten</button>
            <button onClick={onAnmelden}>Anmelden</button>
            <button onClick={onStarten}>Premium</button>
          </div>
          <div>
            <h3>{APP_NAME}</h3>
            <span>Russisch lernen mit echten Videos, einem Karteikasten mit Gedächtnis und einer KI, die mitdenkt.</span>
          </div>
          {/* Pflichtangaben. Sie müssen von jeder Seite aus in zwei
              Klicks erreichbar sein – und vor allem OHNE Konto,
              sonst stünden sie hinter der Anmeldung. */}
          <div>
            <h3>Rechtliches</h3>
            <button onClick={() => onRecht('impressum')}>Impressum</button>
            <button onClick={() => onRecht('datenschutz')}>Datenschutz</button>
            <button onClick={() => onRecht('agb')}>AGB &amp; Widerruf</button>
          </div>
        </div>
        <p className="lp-fuss-zeile">
          © {new Date().getFullYear()} {APP_NAME} · Сделано с любовью – mit Liebe gemacht 💜
        </p>
      </footer>
    </div>
  )
}
