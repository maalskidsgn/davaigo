import { useEffect, useRef, useState } from 'react'
import {
  ladeBenutzername, ladeRangliste, setzeBenutzername, istNameFrei, nameFehler, ZEITRAEUME,
  bildAdresse, einladungsLink, loeseEinladungEin, ladeProfilWerte,
} from './rangliste.js'
import { levelFromXp } from './gamification.js'
import LevelEmblem from './LevelEmblem.jsx'
import Flamme from './Flamme.jsx'
import ProfilSchau from './ProfilSchau.jsx'
import { tr, gebiet } from './sprache.js'

/**
 * Die Rangliste auf der Startseite: die zehn Lernenden mit den meisten
 * XP. Ohne Benutzernamen steht man nicht drin – dann zeigt die Karte
 * gleich das Feld, um sich einen auszusuchen.
 *
 * Fehlt die Datenbank-Migration (supabase-rangliste.sql), bleibt die
 * Karte unsichtbar statt kaputt.
 */
// Letzter Stand der Rangliste im Browser – damit die Karte sofort
// steht und nicht erst nach 2–3 s Datenbank-Antwort aufploppt.
// Die frische Liste ersetzt den Stand still, sobald sie da ist.
function cacheSchluessel(nutzerId, z, f) {
  return 'rangliste:' + (nutzerId || '-') + ':' + z + ':' + (f ? 'freunde' : 'alle')
}
function ausCache(nutzerId, z, f) {
  try {
    return JSON.parse(localStorage.getItem(cacheSchluessel(nutzerId, z, f))) || {}
  } catch {
    return {}
  }
}

export function RanglistenKarte({ nutzerId, eigeneXp = 0, eigeneSerie = 0 }) {
  const [name, setName] = useState(() => ausCache(nutzerId, 'gesamt', false).name) // undefined = lädt/nicht verfügbar
  const [liste, setListe] = useState(() => ausCache(nutzerId, 'gesamt', false).liste ?? null)
  const [zeitraum, setZeitraum] = useState('gesamt')
  // Während ein anderer Zeitraum geladen wird, bleibt die alte Liste
  // stehen und blendet nur ab. Sie ganz zu entfernen liess die Karte
  // zusammenklappen – das sprang.
  const [wechselt, setWechselt] = useState(false)
  const [profilWerte, setProfilWerte] = useState({}) // Name -> { xp, serie }, für Emblem und Flamme
  // Wer gerade angeschaut wird – leer heisst: niemand
  const [schau, setSchau] = useState('')
  // Nur Freunde: macht die Liste persönlich – gegen Leute antreten,
  // die man kennt, zieht mehr als gegen 47 Unbekannte.
  const [nurFreunde, setNurFreunde] = useState(false)

  // Wer über eine Einladung kam, hat den Einladenden gleich als Freund
  const [eingeloest, setEingeloest] = useState('')

  async function laden(z = zeitraum, f = nurFreunde) {
    const [n, l] = await Promise.all([ladeBenutzername(nutzerId), ladeRangliste(10, z, f)])
    setName(n)
    setListe(l)
    setWechselt(false)
    if (n !== undefined && l) {
      try {
        localStorage.setItem(cacheSchluessel(nutzerId, z, f), JSON.stringify({ name: n, liste: l }))
      } catch { /* Speicher voll – dann eben ohne Vorrat */ }
    }

    // Eine gemerkte Einladung einlösen, sobald es einen Benutzernamen
    // gibt – vorher kann die Anfrage niemandem zugeordnet werden.
    if (n) {
      const wer = await loeseEinladungEin()
      if (wer) {
        setEingeloest(wer)
        setListe(await ladeRangliste(10, z, f))
      }
    }
  }

  useEffect(() => {
    // Gemerkten Stand für diesen Zeitraum sofort zeigen, dann frisch laden
    const vorrat = ausCache(nutzerId, zeitraum, nurFreunde)
    if (vorrat.liste) {
      setName(vorrat.name)
      setListe(vorrat.liste)
      setWechselt(false)
    }
    laden()
    const neu = () => laden()
    window.addEventListener('benutzername', neu)
    return () => window.removeEventListener('benutzername', neu)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nutzerId, zeitraum, nurFreunde])

  // Serie und Gesamt-XP kommen aus den Profilen; einmal geladen bleiben sie
  useEffect(() => {
    if (!liste) return
    const fehlen = liste.map((z) => z.benutzername).filter((n) => !(n in profilWerte))
    if (!fehlen.length) return
    let aktiv = true
    ladeProfilWerte(fehlen).then((neu) => {
      if (aktiv) setProfilWerte((alt) => ({ ...alt, ...neu }))
    })
    return () => { aktiv = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liste])

  if (name === undefined || liste === null) return null

  // Die eigenen XP liegen lokal frischer vor als in der Datenbank
  // (die zieht 1,5 s verzögert nach) – also den höheren Wert zeigen.
  // Nur bei der Gesamtliste: Die lokalen XP sind frischer als die
  // Datenbank. Bei Monat und Jahr wäre der Gesamtstand schlicht falsch.
  const zeilen = liste.map((z) => {
    const werte = profilWerte[z.benutzername]
    const serie = z.ich ? eigeneSerie : werte?.serie
    if (zeitraum === 'gesamt') {
      const xp = z.ich ? Math.max(z.xp, eigeneXp) : z.xp
      return { ...z, xp, serie, level: levelFromXp(xp) }
    }
    const gesamt = z.ich ? eigeneXp : werte?.xp
    return { ...z, serie, level: gesamt === undefined ? null : levelFromXp(gesamt) }
  })
  // Bei Monat und Jahr nur zeigen, wer in dem Zeitraum wirklich XP
  // hat. Sich selbst mit 0 XP allein in der Liste zu sehen, wirkt
  // wie ein Fehler – dann lieber der Hinweis darunter.
  const echte = zeitraum === 'gesamt' ? zeilen : zeilen.filter((z) => z.xp > 0)
  const top = echte.filter((z) => z.platz <= 10)
  // Die ersten drei stehen auf dem Podest, der Rest in der Liste
  const podest = top.filter((z) => z.platz <= 3)
  const rest = top.filter((z) => z.platz > 3)
  const ichDraussen = echte.find((z) => z.ich && z.platz > 10)
  const meinPlatz = echte.find((z) => z.ich)?.platz

  return (
    <section className="start-karte rangliste">
      {/* Die Überschrift trägt die Zahl, um die es geht: wie viele
          mitmachen. Der Pokal als Emoji sah auf jedem Gerät anders
          aus – jetzt ein gezeichnetes Zeichen in Markenfarbe. */}
      <div className="rang-kopf">
        <span className="rang-zeichen" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M6 4h12v5a6 6 0 0 1-12 0V4z" fill="currentColor" />
            <path d="M6 5H4a2 2 0 0 0 0 4h2M18 5h2a2 2 0 0 1 0 4h-2"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 15v3M9 20h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <h2 className="rang-titel">{tr('Rangliste')}</h2>
        {/* Rechts der eigene Platz – das ist die Zahl, die einen
            wirklich interessiert, wenn man die Karte sieht. */}
        {meinPlatz && <span className="rang-meiner">{tr('Platz {0}', meinPlatz)}</span>}
      </div>

      {/* Alle oder nur Freunde. Gegen Leute antreten, die man kennt,
          zieht mehr als gegen siebenundvierzig Unbekannte. */}
      <div className="rang-kreis" role="tablist" aria-label={tr('Wer zählt')}>
        <button
          role="tab"
          aria-selected={!nurFreunde}
          className={'rang-kr' + (!nurFreunde ? ' ist-aktiv' : '')}
          onClick={() => { if (nurFreunde) { setWechselt(true); setNurFreunde(false) } }}
        >
          {tr('Alle')}
        </button>
        <button
          role="tab"
          aria-selected={nurFreunde}
          className={'rang-kr' + (nurFreunde ? ' ist-aktiv' : '')}
          onClick={() => { if (!nurFreunde) { setWechselt(true); setNurFreunde(true) } }}
        >
          {tr('Nur Freunde')}
        </button>
      </div>

      {/* Drei Zeiträume: Wer lange dabei ist, steht insgesamt vorn –
          wer gerade loslegt, hat im Monat eine faire Chance. */}
      <div className="rang-zeitraum" role="tablist" aria-label={tr('Zeitraum')}>
        {/* Die Pille gleitet zum gewählten Knopf, statt zu springen */}
        <span
          className="rang-zr-pille"
          aria-hidden="true"
          style={{
            // Breite und Weg richten sich nach der Anzahl der Knöpfe –
            // sonst passt die Pille nicht mehr, sobald einer dazukommt.
            width: `calc((100% - 10px) / ${ZEITRAEUME.length})`,
            transform: `translateX(${ZEITRAEUME.findIndex(([w]) => w === zeitraum) * 100}%)`,
          }}
        />
        {ZEITRAEUME.map(([wert, text]) => (
          <button
            key={wert}
            role="tab"
            aria-selected={zeitraum === wert}
            className={'rang-zr' + (zeitraum === wert ? ' ist-aktiv' : '')}
            onClick={() => {
              if (wert === zeitraum) return
              setWechselt(true)
              setZeitraum(wert)
            }}
          >
            {text}
          </button>
        ))}
      </div>

      {top.length === 0 ? (
        <div className="rang-leer">
          {nurFreunde ? (
            <p>
              <b>{tr('Noch keine Freunde.')}</b>
            </p>
          ) : zeitraum === 'gesamt' ? (
            <p>{tr('Noch niemand drin – sei die Nummer 1.')}</p>
          ) : (
            <>
              <p>
                <b>{tr('Die Wertung läuft ab jetzt.')}</b>
              </p>
              <p className="rang-leer-klein">
                {tr('Wer wann gelernt hat, wird erst seit heute festgehalten – vorher gab es nur den Gesamtstand. Die erste XP {0} bringt dich auf Platz 1.', zeitraum === 'monat' ? tr('dieses Monats') : tr('dieses Jahres'))}
              </p>
            </>
          )}
        </div>
      ) : (
        <div className={'rang-inhalt' + (wechselt ? ' ist-wechsel' : '')}>
          {/* Die drei Besten auf dem Podest – Gold in der Mitte und
              höher. Weniger als drei kommen in die Liste darunter,
              ein Podest mit einer Säule wäre albern. */}
          {podest.length === 3 && (
            <div className="rang-podest">
              <Saeule z={podest[1]} stufe="zweiter" onOeffnen={setSchau} />
              <Saeule z={podest[0]} stufe="erster" onOeffnen={setSchau} />
              <Saeule z={podest[2]} stufe="dritter" onOeffnen={setSchau} />
            </div>
          )}

          <ol className="rang-liste">
            {(podest.length === 3 ? rest : top).map((z, i) => (
              <RangZeile key={zeitraum + '-' + z.platz} z={z} nr={i} onOeffnen={setSchau} />
            ))}
            {ichDraussen && (
              <>
                <li className="rang-luecke" aria-hidden="true">···</li>
                <RangZeile z={ichDraussen} nr={rest.length} onOeffnen={setSchau} />
              </>
            )}
          </ol>
        </div>
      )}

      {/* Gegen Freunde antreten geht nur, wenn welche da sind. Der Link
          steht deshalb direkt unter der Freundesliste – da fällt auf,
          dass sie kurz ist. */}
      {eingeloest && (
        <p className="rang-eingeloest">
          {tr('Anfrage an')} <b>{eingeloest}</b> {tr('ist raus – ihr wart euch über einen Einladungslink begegnet.')}
        </p>
      )}

      {nurFreunde && name && <Einladen name={name} />}

      {schau && <ProfilSchau benutzername={schau} onSchliessen={() => setSchau('')} />}

      {name === null && (
        <div className="rang-mitmachen">
          <p>
            <b>{tr('Du fehlst noch!')}</b> {tr('Such dir einen Benutzernamen aus, dann stehst du mit deinen {0} XP in der Liste.', eigeneXp)}
          </p>
          <BenutzernameFeld nutzerId={nutzerId} knopf={tr('Mitmachen')} />
        </div>
      )}
    </section>
  )
}

/**
 * Freunde einladen.
 *
 * Der Link trägt den eigenen Benutzernamen. Wer darüber ein Konto
 * anlegt, schickt einem automatisch eine Freundschaftsanfrage – sonst
 * müssten sich beide hinterher noch gegenseitig suchen, und genau da
 * bricht so eine Einladung ab.
 */
function Einladen({ name }) {
  const [stand, setStand] = useState('') // '' | 'kopiert' | 'fehler'
  const adresse = einladungsLink(name)

  async function teilen() {
    const daten = {
      title: 'Davaigo',
      text: tr('Lern mit mir Russisch bei Davaigo – mal sehen, wer vorn liegt.'),
      url: adresse,
    }
    // Auf dem Handy das Teilen-Blatt des Systems: WhatsApp, Nachrichten,
    // was auch immer da ist. Am Rechner gibt es das meist nicht.
    try {
      if (navigator.share) {
        await navigator.share(daten)
        return
      }
    } catch {
      return // abgebrochen – das ist keine Panne
    }
    try {
      await navigator.clipboard.writeText(adresse)
      setStand('kopiert')
      setTimeout(() => setStand(''), 2200)
    } catch {
      setStand('fehler')
    }
  }

  return (
    <div className="rang-einladen">
      <p className="rang-ein-titel">{tr('Spiel gegen deine Freunde')}</p>
      <p className="rang-ein-text">
        {tr('Schick ihnen den Link. Wer darüber mitmacht, landet direkt in deiner Liste.')}
      </p>

      <button type="button" className="rang-ein-knopf" onClick={teilen}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 16V4M12 4 8 8M12 4l4 4" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" />
        </svg>
        {stand === 'kopiert' ? tr('Link kopiert') : tr('Link teilen')}
      </button>

      {/* Den Link auch zum Anschauen – manche kopieren lieber selbst */}
      <p className="rang-ein-adresse">{adresse.replace('https://', '')}</p>
      {stand === 'fehler' && (
        <p className="rang-ein-fehler">{tr('Kopieren ging nicht – markier den Link oben von Hand.')}</p>
      )}
    </div>
  )
}

/**
 * Das Bild einer Person – oder ihre Initiale, wenn keins da ist.
 *
 * An vier Stellen gebraucht (Podest, Liste, Profilschau, eigener
 * Kopf), deshalb ein eigener Baustein: Sonst sieht es an jeder
 * Stelle ein bisschen anders aus.
 */
export function Bildnis({ name, bild, klasse = '' }) {
  const adresse = bildAdresse(bild)
  if (adresse) {
    return <img className={klasse + ' hat-bild'} src={adresse} alt="" loading="lazy" />
  }
  return <span className={klasse} aria-hidden="true">{name.charAt(0).toUpperCase()}</span>
}

/** Die Serie eines Mitspielers: Flamme und Tage. */
function Serie({ serie, klasse }) {
  if (serie === undefined) return null
  return (
    <span className={klasse} title={tr('{0} Tage in Folge gelernt', serie)}>
      <Flamme an={serie > 0} groesse={14} />
      {serie}
    </span>
  )
}

/**
 * Violette Toon-Insel ohne Kontur: Plateau oben, runde Felsklumpen
 * darunter, ein paar Wolken und Brocken. Je Platz eigene Töne,
 * Platz 1 am kräftigsten (Davaigo-Violett).
 */
const INSEL_TOENE = {
  erster: ['#e6d9ff', '#cbb2fb', '#b08cf6', '#9461ef', '#7c3aed', '#5b21b6'],
  zweiter: ['#ece3ff', '#d8c6fd', '#c2a6f9', '#ab86f4', '#9566ee', '#7444d4'],
  dritter: ['#f3edff', '#e5d9fe', '#d6c3fc', '#c4a8f8', '#b08ef3', '#8f68e0'],
}
function Insel({ stufe }) {
  const [hell, oben, links, mitte, rechts, tief] = INSEL_TOENE[stufe]
  return (
    <svg className="rs-insel-bild" viewBox="-4 -12 108 158" aria-hidden="true" style={{ '--insel-tief': tief }}>
      <path d="M4 30 Q8 54 22 62 Q30 66 34 60 L34 42 Z" fill={mitte} />
      <path d="M22 62 Q22 86 34 96 Q42 102 46 94 L50 48 L34 44 L34 60 Q30 66 22 62 Z" fill={links} />
      <path d="M46 94 Q46 118 52 128 Q58 118 60 98 Q62 84 66 78 L66 46 L50 48 Z" fill={mitte} />
      <path d="M66 46 L66 78 Q74 84 80 76 Q92 62 96 30 Z" fill={rechts} />
      <path d="M66 78 Q62 84 60 98 Q66 104 72 96 Q78 88 80 76 Q74 84 66 78 Z" fill={tief} />
      <path d="M80 76 Q92 62 96 30 Q92 52 84 66 Z" fill={tief} />
      <path d="M2 26 Q50 50 98 26 L96 33 Q50 57 4 33 Z" fill={rechts} />
      <ellipse cx="50" cy="24" rx="48" ry="15" fill={oben} />
      <ellipse cx="46" cy="20" rx="32" ry="8" fill={hell} />
      <path d="M18 19 Q26 13 38 12" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" fill="none" opacity=".85" />
      <ellipse cx="13" cy="24" rx="6" ry="4.4" fill={rechts} />
      <ellipse cx="12" cy="22.6" rx="3.6" ry="2.4" fill={mitte} />
      <ellipse cx="87" cy="25" rx="4.6" ry="3.4" fill={tief} />
      <path d="M28 54 Q30 70 36 80" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity=".55" />
      <g fill="#fff" opacity=".92">
        <ellipse cx="14" cy="70" rx="12" ry="5" />
        <ellipse cx="22" cy="66" rx="8" ry="5" />
        <ellipse cx="84" cy="88" rx="11" ry="4.6" />
        <ellipse cx="78" cy="85" rx="7" ry="4.4" />
      </g>
      <ellipse cx="30" cy="112" rx="4.4" ry="3.4" fill={rechts} />
      <ellipse cx="74" cy="116" rx="3.4" ry="2.6" fill={mitte} />
    </svg>
  )
}

/** Eine Säule des Podests: Bild, Name, XP und der Block mit dem Platz. */
function Saeule({ z, stufe, onOeffnen }) {
  return (
    <button
      type="button"
      className={'rang-saeule rang-' + stufe + (z.ich ? ' ist-ich' : '')}
      onClick={() => onOeffnen?.(z.benutzername)}
      aria-label={tr('Profil von {0} ansehen', z.benutzername)}
    >
      <Bildnis name={z.benutzername} bild={z.bild} klasse="rs-bild" />
      <span className="rs-name">
        {z.benutzername}
        {z.ich && <small>{tr('du')}</small>}
      </span>
      <span className="rs-xp">{z.xp.toLocaleString(gebiet())} XP</span>
      <Serie serie={z.serie} klasse="rs-serie" />
      {/* Schwebende Insel statt Treppenstufe: Emblem steht auf dem
          Plateau, die Platzziffer liegt darauf. */}
      <span className="rs-insel">
        <Insel stufe={stufe} />
        <span className="rs-kopf">
          {z.level && <LevelEmblem level={z.level} groesse={{ erster: 44, zweiter: 38, dritter: 32 }[stufe]} />}
          <b className="rs-platz">{z.platz}</b>
        </span>
      </span>
    </button>
  )
}

/**
 * Eine Zeile der Rangliste.
 *
 * Statt Medaillen-Emojis (die auf jedem Gerät anders aussehen) trägt
 * der Platz eine eigene Farbe: Gold, Silber, Bronze, danach ruhig.
 * Der Balken darunter zeigt den Abstand zur Spitze – so sieht man
 * auf einen Blick, ob es knapp ist oder uneinholbar.
 */
function RangZeile({ z, nr = 0, onOeffnen }) {
  const stufe = z.platz <= 3 ? ' rang-p' + z.platz : ''
  return (
    <li style={{ '--nr': nr }} className="rang-eintrag">
      <button
        type="button"
        className={'rang-zeile' + (z.ich ? ' rang-ich' : '') + stufe}
        onClick={() => onOeffnen?.(z.benutzername)}
        aria-label={tr('Profil von {0} ansehen', z.benutzername)}
      >
      <span className="rang-platz">{z.platz}</span>
      <Bildnis name={z.benutzername} bild={z.bild} klasse="rang-initial" />
      <span className="rang-wer">
      <span className="rang-name">
        {z.benutzername}
        {z.ich && <small>{tr('du')}</small>}
      </span>
        <Serie serie={z.serie} klasse="rang-serie" />
      </span>
        <span className="rang-emblem">
          {z.level && <LevelEmblem level={z.level} groesse={28} />}
        </span>
        <b className="rang-xp">
          {z.xp.toLocaleString(gebiet())}
          <small>XP</small>
        </b>
      </button>
    </li>
  )
}

/**
 * Eingabefeld für den Benutzernamen mit Live-Prüfung, ob er frei ist.
 * Wird auf dem Start, im Begrüßungsschritt und in den Einstellungen
 * benutzt.
 */
export function BenutzernameFeld({ nutzerId, start = '', knopf = tr('Speichern'), onGespeichert }) {
  const [wert, setWert] = useState(start)
  const [frei, setFrei] = useState(null) // null = unbekannt
  const [fehler, setFehler] = useState('')
  const [laeuft, setLaeuft] = useState(false)
  const pruefNr = useRef(0)

  const form = wert.trim() ? nameFehler(wert) : ''
  const unveraendert = start && wert.trim().toLowerCase() === start.toLowerCase()

  // Kurz nach dem Tippen nachfragen, ob der Name noch frei ist
  useEffect(() => {
    setFrei(null)
    if (!wert.trim() || form || unveraendert) return
    const nr = ++pruefNr.current
    const t = setTimeout(async () => {
      const ok = await istNameFrei(wert)
      if (nr === pruefNr.current) setFrei(ok)
    }, 350)
    return () => clearTimeout(t)
  }, [wert, form, unveraendert])

  async function speichern(e) {
    e.preventDefault()
    setFehler('')
    setLaeuft(true)
    try {
      const n = await setzeBenutzername(nutzerId, wert)
      onGespeichert?.(n)
    } catch (f) {
      setFehler(f.message)
    } finally {
      setLaeuft(false)
    }
  }

  let hinweis = ''
  let klasse = ''
  if (form) { hinweis = form; klasse = 'name-schlecht' }
  else if (frei === false) { hinweis = tr('Den Namen gibt es schon.'); klasse = 'name-schlecht' }
  else if (frei === true) { hinweis = tr('✓ Der Name ist frei.'); klasse = 'name-gut' }

  return (
    <form className="name-form" onSubmit={speichern}>
      <div className="name-zeile">
        <span className="name-at" aria-hidden="true">@</span>
        <input
          value={wert}
          onChange={(e) => setWert(e.target.value.replace(/\s/g, ''))}
          placeholder={tr('z. B. mischa_lernt')}
          maxLength={20}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          aria-label={tr('Benutzername')}
        />
        <button
          className="btn name-knopf"
          disabled={laeuft || !wert.trim() || Boolean(form) || frei === false || unveraendert}
        >
          {laeuft ? '…' : knopf}
        </button>
      </div>
      {(fehler || hinweis) && <p className={'name-hinweis ' + (fehler ? 'name-schlecht' : klasse)}>{fehler || hinweis}</p>}
    </form>
  )
}
