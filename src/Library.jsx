import GratisHinweis, { zurKasse } from './GratisHinweis.jsx'
import { usePremium } from './premium.js'
import { API_URL, kiKopf, istApp } from './api.js'
import { ladeListen, neueListe } from './videoListen.js'
import { holeBibliothek, supabaseBereit, zaehleSongs } from './supabase.js'
import VideoSuche from './VideoSuche.jsx'
import Songs from './Songs.jsx'
import {
  IconAlle, IconSprache, IconGesundheit, IconSport, IconErnaehrung,
  IconProduktiv, IconStoa, IconPsyche, IconSuche,
  IconLesezeichen, IconPfeil, IconBuch,
} from './icons.jsx'

const KATEGORIE_ICONS = {
  alle: IconAlle,
  sprache: IconSprache,
  gesundheit: IconGesundheit,
  sport: IconSport,
  ernaehrung: IconErnaehrung,
  produktivitaet: IconProduktiv,
  stoizismus: IconStoa,
  psychologie: IconPsyche,
  gefunden: IconSuche,
}

// Mediathek: weniger Kategorien und Videos (Manuel, 09.11.2026).
// Die alten Kategorien in der Datenbank bleiben – hier werden sie zu
// drei Gruppen zusammengefasst und je Gruppe auf MAX_JE_GRUPPE gekürzt.
// "gefunden" (von Nutzern geholte Videos) erscheint nicht mehr.
const MAX_JE_GRUPPE = 4
const GRUPPEN = [
  { wert: 'sprache', de: 'Russisch lernen', en: 'Learn Russian', kat: ['sprache'], icon: 'sprache' },
  { wert: 'koerper', de: 'Gesundheit & Sport', en: 'Health & sport', kat: ['gesundheit', 'sport', 'ernaehrung'], icon: 'gesundheit' },
  { wert: 'kopf', de: 'Kopf & Alltag', en: 'Mind & everyday life', kat: ['psychologie', 'stoizismus', 'produktivitaet'], icon: 'psychologie' },
]
function gruppiere(bibliothek) {
  return GRUPPEN.map((g) => ({ ...g, videos: bibliothek.filter((v) => g.kat.includes(v.kategorie)).slice(0, MAX_JE_GRUPPE) }))
    .filter((g) => g.videos.length)
}
import { ladeVideoFortschritt, standVon } from './App.jsx'
import { useState, useEffect } from 'react'
import Inhalte from './Inhalte.jsx'
import { holeVerzeichnis } from './inhalte.js'
import { Hero, Kopf, SuchFeld } from './MediathekUI.jsx'
import { tr, sprache } from './sprache.js'

// Die Niveau-Stufen der kuratierten Mediathek
// Die Themen der Mediathek – man lernt Russisch nebenbei,
// während man etwas Interessantes schaut.
// Der Bereich soll kurz bleiben: Filter oben, vier Videos darunter,
// Nachschub nur auf Wunsch.
const SCHRITT = 4

// So viele gemerkte Videos stehen ohne "Alle anzeigen" da
const SICHTBAR_GEMERKT = 4

// Die Bereiche der Mediathek.
//
// Hoertexte sind vorerst ausgeblendet – die elf importierten Folgen
// bleiben liegen, der Bereich ist nur nicht mehr erreichbar. Diese
// eine Zeile holt ihn zurueck.
const HOERTEXTE_ZEIGEN = false

// Songs und Ebooks vorerst raus (24.10., wie bei Habloo): Hier geht es
// nur um Videos. Die Bereiche bleiben fertig im Code – die Schalter
// holen sie zurück.
const SONGS_ZEIGEN = false
const EBOOKS_ZEIGEN = false

const BEREICHE = [
  { wert: 'videos', label: tr('Videos') },
  ...(SONGS_ZEIGEN ? [{ wert: 'songs', label: tr('Songs') }] : []),
  ...(HOERTEXTE_ZEIGEN ? [{ wert: 'hoertexte', label: tr('Hörtexte') }] : []),
  ...(EBOOKS_ZEIGEN ? [{ wert: 'ebooks', label: tr('Ebooks') }] : []),
]


// Suchanfragen für "Für dich vorgeschlagen" – jeden Tag eine andere,
// damit regelmäßig frische Videos auftauchen
const EMPFEHLUNGS_SUCHEN = [
  'russian comprehensible input for beginners',
  'easy russian street interviews',
  'slow russian stories for beginners',
  'russian progress podcast',
  'learn russian with subtitles beginner',
  'russian listening practice beginner',
  'easy russian conversation basics',
]

// Gespeicherte Empfehlungen aus dem Browser-Speicher laden
function ladeEmpfehlungsCache() {
  try {
    return JSON.parse(localStorage.getItem('vorschlaege2'))
  } catch {
    return null
  }
}

// Fertige Suchvorschläge zum Entdecken neuer Russisch-Videos
// Die Anfragen stehen teils auf Russisch, teils auf Englisch – und
// das ist Absicht. YouTube findet russische Inhalte am besten über
// russische Begriffe; Lernmaterial FÜR Anfänger ist dagegen meist
// englisch betitelt ("learn russian", "comprehensible input").
const VORSCHLAEGE = [
  { label: tr('🎵 Musik'), query: 'русские песни с текстом' },
  { label: tr('🐣 Für Anfänger'), query: 'russian comprehensible input for beginners' },
  { label: tr('🎙️ Podcasts'), query: 'подкаст на русском для изучающих' },
  { label: tr('📰 Langsame Nachrichten'), query: 'новости на русском медленно для изучающих' },
  { label: tr('🍳 Kochen'), query: 'простой рецепт на русском' },
  { label: tr('✈️ Reisen'), query: 'путешествие по России влог' },
]

function formatDuration(sec) {
  if (!sec) return ''
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

// Gespeicherte Buchzusammenfassungen laden
function ladeBuecher() {
  try {
    return JSON.parse(localStorage.getItem('buecher')) || []
  } catch {
    return []
  }
}

// Die Mediathek: Videos (Link laden, gespeichert, entdecken) und
// Bücher (KI-Zusammenfassungen wie bei Blinkist)
export default function Library({ savedVideos: alleGemerkten, setSavedVideos, onOpenVideo, onLoadUrl, onAddVocab, vocab = {} }) {
  // Eigene YouTube-Videos: nur Premium (09.11.).
  const { premium: istPremium } = usePremium()
  // Gesperrt schon während des Ladens (Stand aus dem Speicher) – sonst blitzt das Formular auf
  const videosGesperrt = !istPremium
  // Songs werden im Songs-Bereich angezeigt, nicht hier.
  // Ältere Einträge haben noch kein "art" – die gelten als Video.
  const savedVideos = alleGemerkten.filter((v) => v.art !== 'musik')
  // Kommt der Nutzer von Spotify zurueck, gehoert er direkt zu den Songs –
  // dort wird der Code eingeloest und die Auswertung gestartet.
  const [bereich, setBereich] = useState(() =>
    SONGS_ZEIGEN && new URLSearchParams(window.location.search).get('code') ? 'songs' : 'videos'
  ) // 'videos', 'songs' oder 'ebooks'
  const [buecher, setBuecher] = useState(ladeBuecher)
  const [buchTitel, setBuchTitel] = useState('')
  const [buchLaden, setBuchLaden] = useState(false)
  const [buchFehler, setBuchFehler] = useState('')
  const [offenesBuch, setOffenesBuch] = useState(null) // gerade geöffnete Zusammenfassung

  // ---------- Kuratierte Mediathek aus der Datenbank ----------
  const [bibliothek, setBibliothek] = useState(null)
  // standVon() versteht beide Formate: alte Eintraege waren eine
  // blosse Prozentzahl, neue enthalten auch die Sekunde.
  const [fortschritt] = useState(() => {
    const roh = ladeVideoFortschritt()
    return Object.fromEntries(
      Object.keys(roh).map((id) => [id, standVon(id).prozent])
    )
  })
  const [sucheOffen, setSucheOffen] = useState(false)
  const [suchFeld, setSuchFeld] = useState('')
  const [alleGemerkt, setAlleGemerkt] = useState(false)
  const [startBegriff, setStartBegriff] = useState('')
  const [kategorie, setKategorie] = useState('alle')
  const [sichtbareVideos, setSichtbareVideos] = useState(SCHRITT)
  const [bibliothekFehler, setbibliothekFehler] = useState('')
  // Die Zahlen am Umschalter. Sie stehen bewusst hier und nicht in
  // den Bereichen selbst: Ein Bereich, den man noch nicht geoeffnet
  // hat, koennte seine eigene Zahl gar nicht kennen.
  const [songAnzahl, setSongAnzahl] = useState(null)
  const [ebookAnzahl, setEbookAnzahl] = useState(null)

  useEffect(() => {
    let abgebrochen = false
    if (supabaseBereit) {
      zaehleSongs()
        .then((n) => !abgebrochen && setSongAnzahl(n))
        .catch(() => {}) // eine fehlende Zahl ist kein Grund fuer eine Fehlermeldung
    }
    // holeVerzeichnis merkt sich das Ergebnis – der Ebooks-Bereich
    // holt es also nicht ein zweites Mal.
    holeVerzeichnis('lesetexte')
      .then((v) => !abgebrochen && setEbookAnzahl(v.length))
      .catch(() => {})
    return () => { abgebrochen = true }
  }, [])

  useEffect(() => {
    if (!supabaseBereit) return
    let abgebrochen = false

    setbibliothekFehler('')
    holeBibliothek('alle')
      .then((videos) => {
        if (abgebrochen) return
        // Auf das Format bringen, das VideoKarte erwartet
        setBibliothek(
          videos.map((v) => ({
            videoId: v.youtube_id,
            title: v.titel,
            channel: v.kanal,
            duration: v.dauer_sek,
            thumbnail: v.thumbnail,
            niveau: v.niveau,
            kategorie: v.kategorie,
          }))
        )
      })
      .catch((f) => {
        if (!abgebrochen) setbibliothekFehler(f.message)
      })

    return () => { abgebrochen = true }
  }, [])

  // Eine neue Buchzusammenfassung generieren lassen
  async function generiereBuch(e) {
    // Das Ereignis ist freiwillig: Das Suchfeld der Hauptkarte hat
    // preventDefault() schon selbst erledigt und ruft ohne Argument.
    e?.preventDefault()
    if (!buchTitel.trim()) return
    setBuchLaden(true)
    setBuchFehler('')
    try {
      const res = await fetch(API_URL + '/api/buch', {
        method: 'POST',
        headers: await kiKopf(),
        body: JSON.stringify({ titel: buchTitel.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.nachricht || data.error)
      const buch = { ...data, id: Date.now(), erstellt: Date.now() }
      const neu = [buch, ...buecher]
      setBuecher(neu)
      localStorage.setItem('buecher', JSON.stringify(neu))
      setBuchTitel('')
      setOffenesBuch(buch)
    } catch (err) {
      setBuchFehler(err.message)
    } finally {
      setBuchLaden(false)
    }
  }

  function loescheBuch(id) {
    const neu = buecher.filter((b) => b.id !== id)
    setBuecher(neu)
    localStorage.setItem('buecher', JSON.stringify(neu))
  }
  const [filter, setFilter] = useState('alle')
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [link, setLink] = useState('') // eingefügter YouTube-Link
  const [empfehlungen, setEmpfehlungen] = useState(() => ladeEmpfehlungsCache()?.videos || null)
  const [empfehlungenLaden, setEmpfehlungenLaden] = useState(false)

  // Beim Öffnen: Empfehlungen holen, falls keine da oder älter als ein Tag
  useEffect(() => {
    const cache = ladeEmpfehlungsCache()
    const frisch = cache && Date.now() - cache.zeit < 24 * 60 * 60 * 1000
    if (!frisch) holeEmpfehlungen()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Holt 6 Video-Empfehlungen über die YouTube-Suche und merkt sie sich
  async function holeEmpfehlungen(zufaellig = false) {
    setEmpfehlungenLaden(true)
    try {
      const q = zufaellig
        ? EMPFEHLUNGS_SUCHEN[Math.floor(Math.random() * EMPFEHLUNGS_SUCHEN.length)]
        : EMPFEHLUNGS_SUCHEN[new Date().getDay() % EMPFEHLUNGS_SUCHEN.length]
      const res = await fetch(API_URL + '/api/search?q=' + encodeURIComponent(q))
      const data = await res.json()
      if (res.ok && data.results?.length) {
        const videos = data.results.slice(0, 6)
        setEmpfehlungen(videos)
        localStorage.setItem('vorschlaege2', JSON.stringify({ zeit: Date.now(), videos }))
      }
    } catch {
      // klappt es nicht, bleibt der Bereich einfach leer
    } finally {
      setEmpfehlungenLaden(false)
    }
  }

  // Alle Kategorien, die in den gespeicherten Videos vorkommen
  const [eigeneListen, setEigeneListen] = useState(ladeListen)
  const [neuOffen, setNeuOffen] = useState(false)
  const [neuName, setNeuName] = useState('')
  const categories = [...new Set([...eigeneListen, ...savedVideos.map((v) => v.category).filter(Boolean)])]

  function listeAnlegen(e) {
    e.preventDefault()
    const name = neuName.trim()
    if (!name) return
    setEigeneListen(neueListe(name))
    setFilter(name)
    setNeuName('')
    setNeuOffen(false)
  }

  // Ein gemerktes Video in eine andere Liste legen
  function verschiebe(videoId, liste) {
    setSavedVideos((alle) => alle.map((v) => (v.videoId === videoId ? { ...v, category: liste } : v)))
  }

  const filtered =
    filter === 'alle'
      ? savedVideos
      : savedVideos.filter((v) => v.category === filter)

  async function search(q) {
    setSearching(true)
    setError('')
    setResults(null)
    setQuery(q)
    try {
      const res = await fetch(API_URL + '/api/search?q=' + encodeURIComponent(q))
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResults(data.results)
    } catch (err) {
      setError(err.message)
    } finally {
      setSearching(false)
    }
  }

  function removeVideo(videoId) {
    setSavedVideos((list) => list.filter((v) => v.videoId !== videoId))
  }

  // ---------- Geöffnete Buchzusammenfassung ----------
  if (offenesBuch) {
    return (
      <BuchView
        buch={offenesBuch}
        onClose={() => setOffenesBuch(null)}
        onAddVocab={onAddVocab}
      />
    )
  }

  return (
    <div className="library">
      {/* Bei den Videos sagt der Toon-Kopf schon alles (06.11.) */}
      {bereich !== 'videos' && (
        <>
        <h1 className="lib-kopf">
          {tr('Lernen mit')} <span className="accent">YouTube</span>
        </h1>
        <p className="lib-unter">
          {{
            videos: tr('Finde russische Videos, die zu deinem Niveau passen.'),
            songs: tr('Russische Songs mit mitlaufendem Text.'),
            hoertexte: tr('Hörtexte mit Tonspur und Übersetzung daneben.'),
            ebooks: tr('Buchzusammenfassungen auf Russisch – oder lass dir selbst eine schreiben.'),
          }[bereich]}
        </p>
        </>
      )}

      {/* Der Umschalter – dieselbe Bauart wie Vokabeln|Grammatik im
          Trainer, damit die App an beiden Stellen gleich umschaltet. */}
      {/* Nur ein Bereich übrig? Dann braucht es keine Reiter. */}
      {BEREICHE.length > 1 && (
      <div className="deck" role="tablist">
        {BEREICHE.map((b) => {
          const zahl = {
            videos: bibliothek?.length ?? null,
            songs: songAnzahl,
            // Die fertigen Zusammenfassungen plus die selbst erzeugten
            ebooks: ebookAnzahl == null ? null : ebookAnzahl + buecher.length,
            hoertexte: null,
          }[b.wert]
          return (
            <button
              key={b.wert}
              role="tab"
              aria-selected={bereich === b.wert}
              className={bereich === b.wert ? 'deck-aktiv' : ''}
              onClick={() => setBereich(b.wert)}
            >
              {b.label}
              {zahl != null && <span className="deck-zahl">{zahl}</span>}
            </button>
          )
        })}
      </div>
      )}

      {/* Der Schluessel ist Absicht: Wechselt der Bereich, baut React
          den Block neu auf – und die Einblend-Animation laeuft von
          vorn. Ohne ihn wuerde nur der Inhalt getauscht, und der
          Wechsel saehe aus wie ein Sprung. */}
      <div className="wechsel" key={bereich}>

      {/* ---------- Songs: Musik mit mitlaufendem Text ---------- */}
      {bereich === 'songs' && <Songs onOpenVideo={onOpenVideo} vocab={vocab} />}

      {/* ---------- Hörtexte und Lesetexte ----------
          Die beiden Bereiche, in denen nichts erzeugt wird: fertige
          Inhalte von russisch-lernen.com. Videos und Songs bleiben
          die generativen Bereiche. */}
      {bereich === 'hoertexte' && (
        <Inhalte art="hoertexte" onAddVocab={onAddVocab} vocab={vocab} />
      )}
      {bereich === 'ebooks' && (
        <>
          {/* Die Hauptkarte des Bereichs ist das Formular – genau wie
              bei den Videos die Suche. Der Filter fuer die fertigen
              Zusammenfassungen sitzt dafuer schmal ueber der Liste. */}
          <Hero
            symbol={<IconBuch groesse={26} />}
            titel={tr('Ebook erstellen')}
            text={tr('Nenn einen Buchtitel oder ein Thema – die KI schreibt eine Zusammenfassung auf Russisch.')}
          >
            <SuchFeld
              rund
              wert={buchTitel}
              onWert={setBuchTitel}
              onAbsenden={generiereBuch}
              platzhalter={tr('z. B. „Ikigai“ oder „Besser schlafen“')}
              knopf={tr('Ebook erstellen')}
              laedt={buchLaden}
            />
          </Hero>

          {buchFehler && <p className="error">{buchFehler}</p>}
          {buchLaden && (
            <p className="inhalt-hinweis">
              {tr('Das dauert einen Moment – die KI schreibt gerade beide Fassungen.')}
            </p>
          )}

          {buecher.length > 0 && (
            <EigeneEbooks
              buecher={buecher}
              onOeffnen={setOffenesBuch}
              onLoeschen={loescheBuch}
            />
          )}

          <Inhalte art="lesetexte" onAddVocab={onAddVocab} vocab={vocab} ohneHero />
        </>
      )}

      </div>

      {sucheOffen && (
        <VideoSuche
          startBegriff={startBegriff}
          onSchliessen={() => {
            setSucheOffen(false)
            setStartBegriff('')
          }}
          onVideoWaehlen={onOpenVideo}
        />
      )}

      {bereich === 'videos' && (
      <>
      {/* ============ 1. SELBST SUCHEN ============ */}
      {/* Das Feld steht direkt hier, nicht hinter einem Knopf: Wer
          schon weiss, wonach er sucht, soll nicht erst ein Fenster
          oeffnen muessen. */}
      <VideoEngine
        gesperrt={videosGesperrt}
        bilder={savedVideos.slice(-5).reverse().map((v) => v.videoId)}
        wert={suchFeld}
        onWert={setSuchFeld}
        onSuche={(begriff) => {
          setStartBegriff(begriff.trim())
          setSucheOffen(true)
        }}
      />

      {/* ============ 2. GEMERKTE VIDEOS ============ */}
      {true && (
        <section className="bereich">
          <Kopf
            symbol={<IconLesezeichen groesse={19} />}
            titel={tr('Deine Listen')}
            text={tr('{0} gespeichert – dort weitermachen, wo du aufgehört hast.', savedVideos.length)}
            aktion={
              savedVideos.length > SICHTBAR_GEMERKT ? (
                <button className="kopf-aktion" onClick={() => setAlleGemerkt((a) => !a)}>
                  {alleGemerkt ? tr('Weniger') : tr('Alle anzeigen')}
                  <IconPfeil groesse={15} />
                </button>
              ) : null
            }
          />
          {/* Listen als Mappen (06.11.): antippen filtert, „Neue Liste“ legt eine an */}
          <div className="yt-regal">
            {neuOffen ? (
              <form className="mappe mappe-form" onSubmit={listeAnlegen}>
                <input autoFocus value={neuName} onChange={(e) => setNeuName(e.target.value)} placeholder={tr('Name der Liste')} />
                <button type="submit" disabled={!neuName.trim()}>{tr('Anlegen')}</button>
              </form>
            ) : (
              <button className="mappe mappe-neu" onClick={() => setNeuOffen(true)}>
                <span className="mappe-reiter" />
                <span className="mappe-koerper"><b>+</b><small>{tr('Neue Liste')}</small></span>
              </button>
            )}
            {['alle', ...categories].map((c, i) => {
              const videos = c === 'alle' ? savedVideos : savedVideos.filter((v) => v.category === c)
              const bild = videos[videos.length - 1]?.videoId
              return (
                <button
                  key={c}
                  className={'mappe mappe-f' + (i % 6) + (filter === c ? ' mappe-an' : '')}
                  onClick={() => setFilter(c)}
                >
                  <span className="mappe-reiter" />
                  {bild && <img className="mappe-blatt" src={`https://i.ytimg.com/vi/${bild}/mqdefault.jpg`} alt="" />}
                  <span className="mappe-koerper">
                    <b>{c === 'alle' ? tr('Alle') : c}</b>
                    <small>{tr('{0} Videos', videos.length)}</small>
                  </span>
                </button>
              )
            })}
          </div>
          {filtered.length === 0 && <p className="row-hint yt-leer">{tr('Noch leer – speichere ein Video in diese Liste oder verschieb eins hierher.')}</p>}

          <div className="quer-liste">
            {(alleGemerkt ? filtered : filtered.slice(0, SICHTBAR_GEMERKT)).map((v) => (
              <div key={v.videoId} className="quer-karte">
                <div className="quer-bild" onClick={() => onOpenVideo(v.videoId)}>
                  <img src={`https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`} alt="" />
                  {v.duration ? (
                    <span className="quer-dauer">{formatDuration(v.duration)}</span>
                  ) : null}
                  {fortschritt[v.videoId] > 0 && (
                    <div className="video-fortschritt" title={tr('{0} % geschaut', fortschritt[v.videoId])}>
                      <div
                        className={'video-fortschritt-balken' + (fortschritt[v.videoId] >= 95 ? ' fertig' : '')}
                        style={{ width: fortschritt[v.videoId] + '%' }}
                      />
                    </div>
                  )}
                </div>
                <div className="quer-text">
                  <div className="quer-titel" onClick={() => onOpenVideo(v.videoId)}>
                    {v.title}
                  </div>
                  <div className="quer-fuss">
                    <select
                      className="liste-wahl"
                      value={v.category || ''}
                      onChange={(e) => verschiebe(v.videoId, e.target.value)}
                    >
                      <option value="">{tr('Ohne Liste')}</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <button
                      className="btn-delete"
                      title={tr('Aus der Mediathek entfernen')}
                      onClick={() => removeVideo(v.videoId)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Kuratierte Davaigo-Mediathek ---------- */}
      {supabaseBereit && (
        <section className="bereich">
          <Kopf
            symbol={<IconGesundheit groesse={19} />}
            titel={tr('Für dich')}
            aktion={
              kategorie !== 'alle' ? (
                <button
                  className="kopf-aktion"
                  onClick={() => {
                    setKategorie('alle')
                    setSichtbareVideos(SCHRITT)
                  }}
                >
                  {tr('Alle ansehen')} <IconPfeil groesse={15} />
                </button>
              ) : null
            }
            zahl={bibliothek && kategorie === 'alle' ? gruppiere(bibliothek).reduce((n, g) => n + g.videos.length, 0) : null}
          />

          {bibliothek && gruppiere(bibliothek).length > 1 && (
            <div className="themen-leiste">
              {[{ wert: 'alle', de: 'Alle', en: 'All', icon: 'alle' }, ...gruppiere(bibliothek)].map((k) => (
                <button
                  key={k.wert}
                  className={'thema' + (kategorie === k.wert ? ' thema-aktiv' : '')}
                  onClick={() => {
                    setKategorie(k.wert)
                    setSichtbareVideos(SCHRITT) // bei neuem Filter wieder oben anfangen
                  }}
                >
                  {(() => { const I = KATEGORIE_ICONS[k.icon]; return I ? <I groesse={15} /> : null })()}
                  {sprache() === 'en' ? k.en : k.de}
                </button>
              ))}
            </div>
          )}

          {bibliothekFehler && <p className="error">{bibliothekFehler}</p>}
          {!bibliothek && !bibliothekFehler && (
            <p className="intro">{tr('Lade Mediathek…')}</p>
          )}

          {bibliothek && (() => {
            const gruppen = gruppiere(bibliothek)
            const gefiltert =
              kategorie === 'alle'
                ? gruppen.flatMap((g) => g.videos)
                : gruppen.find((g) => g.wert === kategorie)?.videos ?? []

            if (gefiltert.length === 0) {
              return <p className="intro">{tr('Zu diesem Thema ist noch nichts dabei.')}</p>
            }

            const sichtbar = gefiltert.slice(0, sichtbareVideos)
            const rest = gefiltert.length - sichtbar.length

            return (
              <>
                <div className="video-zeilen">
                  {sichtbar.map((v) => (
                    <VideoZeile
                      key={v.videoId}
                      video={v}
                      onOpen={onOpenVideo}
                      fortschritt={fortschritt[v.videoId] ?? 0}
                    />
                  ))}
                </div>

                {rest > 0 && (
                  <button
                    className="mehr-videos"
                    onClick={() => setSichtbareVideos((n) => n + SCHRITT)}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
                         stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"
                         strokeLinejoin="round" aria-hidden="true">
                      <path d="m5 9 7 7 7-7" />
                    </svg>
                    {tr('Mehr anzeigen ({0} weitere)', rest)}
                  </button>
                )}
              </>
            )
          })()}
        </section>
      )}

      </>
      )}
    </div>
  )
}

// Die Lese-Ansicht einer Buchzusammenfassung: einfache russische Absätze,
// Übersetzung einblendbar, Vokabeln mit einem Klick in den Trainer
/**
 * Die selbst erzeugten Ebooks.
 *
 * Sie liegen im Browser, nicht in der Bibliothek – deshalb stehen
 * sie in einem eigenen Abschnitt ueber den fertigen und tragen
 * einen Loeschknopf.
 */
function EigeneEbooks({ buecher, onOeffnen, onLoeschen }) {
  return (
    <section className="bereich">
      <Kopf
        symbol={<IconBuch groesse={19} />}
        titel={tr('Deine eigenen Ebooks')}
        text={tr('Auf diesem Gerät gespeichert.')}
        zahl={buecher.length}
      />
      <ul className="inhalt-liste ebook-eigene">
        {buecher.map((b) => (
          <li key={b.id}>
            <button className="inhalt-zeile" onClick={() => onOeffnen(b)}>
              <span className="inhalt-text">
                <span className="inhalt-titel">{b.titel}</span>
                <span className="inhalt-meta">
                  {tr('selbst erstellt{0}', b.kapitel ? ` · ${b.kapitel.length} Kapitel` : '')}
                </span>
              </span>
              <IconPfeil groesse={17} />
            </button>
            <button
              className="btn-delete ebook-weg"
              title={tr('Löschen')}
              onClick={() => onLoeschen(b.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function BuchView({ buch, onClose, onAddVocab }) {
  const [zeigeDe, setZeigeDe] = useState(false)
  const [uebernommen, setUebernommen] = useState(false)

  function vokabelnUebernehmen() {
    onAddVocab(
      buch.vokabeln.map((v) => ({
        wort: v.wort,
        uebersetzung: v.uebersetzung,
        quelle: tr('Buch: {0}', buch.titel),
      }))
    )
    setUebernommen(true)
  }

  return (
    <div className="library buch-view">
      <button className="btn-plain back-link" onClick={onClose}>
        {tr('← Zur Mediathek')}
      </button>
      <h1>{buch.titel}</h1>
      <p className="intro">
        {tr('{0} · Niveau {1}', buch.autor, buch.niveau)}
      </p>

      <label className="autoscroll-toggle">
        <input
          type="checkbox"
          checked={zeigeDe}
          onChange={(e) => setZeigeDe(e.target.checked)}
        />
        {tr('Deutsche Übersetzung einblenden')}
      </label>

      {buch.absaetze.map((a, i) => (
        <div key={i} className="buch-absatz">
          <p className="buch-es">{a.es}</p>
          {zeigeDe && <p className="buch-de">{a.de}</p>}
        </div>
      ))}

      <h2 className="settings-heading">{tr('Vokabeln aus diesem Buch')}</h2>
      <div className="settings-card">
        {buch.vokabeln.map((v) => (
          <div key={v.wort} className="settings-row">
            <div>
              <div className="row-title">{v.wort}</div>
              <div className="row-hint">{v.uebersetzung}</div>
            </div>
          </div>
        ))}
      </div>
      {uebernommen ? (
        <p className="gen-success">{tr('Vokabeln sind im Trainer! ✓')}</p>
      ) : (
        <button className="hero-cta" onClick={vokabelnUebernehmen}>
          {tr('Alle {0} Vokabeln in den Trainer übernehmen', buch.vokabeln.length)}
        </button>
      )}
    </div>
  )
}

// Eine Video-Karte mit Vorschaubild, Titel und Kanal
/**
 * Ein Video als Zeile: Vorschaubild links, Text daneben, rechts der
 * Abspielknopf.
 *
 * Frueher lagen die Videos in einem Raster mit dem Bild obenauf. Bei
 * zwei Spalten auf einem Handy blieb fuer den Titel so wenig Platz,
 * dass fast jeder abgeschnitten wurde – als Zeile bekommt er die
 * ganze Breite.
 */
function VideoZeile({ video, onOpen, fortschritt = 0 }) {
  return (
    <button className="video-zeile" onClick={() => onOpen(video.videoId)}>
      <span className="zeile-bild">
        <img src={video.thumbnail} alt="" loading="lazy" />
        {fortschritt > 0 && (
          <span className="video-fortschritt" title={tr('{0} % geschaut', fortschritt)}>
            <span
              className={'video-fortschritt-balken' + (fortschritt >= 95 ? ' fertig' : '')}
              style={{ width: fortschritt + '%' }}
            />
          </span>
        )}
      </span>

      <span className="zeile-text">
        {video.niveau && (
          <span className={'niveau-badge niveau-' + video.niveau}>{video.niveau}</span>
        )}
        <span className="zeile-titel">{video.title}</span>
        <span className="zeile-kanal">{video.channel}</span>
        {video.duration ? (
          <span className="zeile-dauer">{formatDuration(video.duration)}</span>
        ) : null}
      </span>

      <span className="zeile-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
        </svg>
      </span>
    </button>
  )
}

function VideoKarte({ video, onOpen, fortschritt = 0 }) {
  return (
    <div className="video-card">
      <div className="video-bild" onClick={() => onOpen(video.videoId)}>
        <img src={video.thumbnail} alt="" />
        {fortschritt > 0 && (
          <div className="video-fortschritt" title={tr('{0} % geschaut', fortschritt)}>
            <div
              className={'video-fortschritt-balken' + (fortschritt >= 95 ? ' fertig' : '')}
              style={{ width: fortschritt + '%' }}
            />
          </div>
        )}
      </div>
      <div className="video-card-body">
        <div className="video-card-title" onClick={() => onOpen(video.videoId)}>
          {video.title}
        </div>
        <div className="video-card-meta">
          <span className="video-card-channel">
            {video.channel}
            {video.duration ? ' · ' + formatDuration(video.duration) : ''}
          </span>
        </div>
      </div>
    </div>
  )
}


// ===============================================================
//  Die Video-Engine: Einstieg in die YouTube-Suche
// ===============================================================

const ENGINE_THEMEN = [tr('Fußball'), tr('Kochen'), tr('Reisen'), tr('Musik'), tr('Vlogs'), tr('Psychologie')]

/**
 * Kein Formular, sondern das Aushängeschild der Mediathek: dunkle
 * Bühne mit Glühen, großem Suchfeld und Themen zum Antippen.
 */
function VideoEngine({ wert, onWert, onSuche, bilder = [], gesperrt = false }) {
  function absenden(e) {
    e.preventDefault()
    if (wert.trim()) onSuche(wert)
  }

  return (
    <section className="engine engine-toon">
      {/* Toon-Kopf (06.11., Mix aus V1 + H3): schwebende Vorschaubilder –
          die eigenen gemerkten Videos, sonst bunte Platzhalter */}
      <div className="et-flug" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={'et-bild et-b' + i}
            style={bilder[i] ? { backgroundImage: `url(https://i.ytimg.com/vi/${bilder[i]}/mqdefault.jpg)` } : undefined}
          >
            <i>▶</i>
          </span>
        ))}
        <i className="et-funke et-f1">✦</i>
        <i className="et-funke et-f2">✦</i>
      </div>


      <h2 className="engine-titel">
        {tr('Lerne Russisch mit')} <span>{tr('echten YouTube-Videos')}</span>
      </h2>
      <p className="engine-text">
        {tr('Such dir ein Thema – Davaigo findet russische Videos auf deinem Niveau und macht sie lernbar.')}
      </p>

      <ul className="engine-features">
        <li><b>RU</b> {tr('Untertitel mitlesen')}</li>
        <li><b>↻</b> {tr('Wort antippen = übersetzt')}</li>
        <li><b>✦</b> {tr('Vokabeln per KI')}</li>
      </ul>

      <GratisHinweis art="video" />

      {/* Eigene YouTube-Videos nur mit Premium (Manuel, 09.11.): Gratis
          gibt es die Mediathek, Suche und Link sind gesperrt. */}
      {gesperrt ? (
        <button type="button" className="engine-suche engine-zu" onClick={() => !istApp && zurKasse()} disabled={istApp}>
          <svg className="engine-lupe" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <rect x="5" y="10" width="14" height="10" rx="3" fill="currentColor" />
            <path d="M8 10V8a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="2.6" fill="none" />
          </svg>
          <span>{sprache() === 'en' ? 'Search your own YouTube videos – with Premium' : 'Eigene YouTube-Videos suchen – mit Premium'}</span>
        </button>
      ) : (
        <>
        <form className="engine-suche" onSubmit={absenden}>
          <svg className="engine-lupe" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.4" />
            <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          <input
            value={wert}
            onChange={(e) => onWert(e.target.value)}
            placeholder={tr('Worüber willst du ein Video sehen?')}
            enterKeyHint="search"
          />
          </form>
        <button type="button" className="engine-los" disabled={!wert.trim()} onClick={() => onSuche(wert)}>
          ✦ {tr('Videos für mich finden')}
        </button>
  
        <div className="engine-themen">
          {ENGINE_THEMEN.map((t) => (
            <button key={t} type="button" onClick={() => { onWert(t); onSuche(t) }}>
              {t}
            </button>
          ))}
        </div>
        </>
      )}
    </section>
  )
}
