import { pausierteSchluessel, MAX_VOKABELN } from './limits.js'
import { usePremium } from './premium.js'
import { loginKopf } from './limits.js'
import { API_URL, istApp, kiKopf } from './api.js'
import { sichereMerker } from './kontoMerker.js'
import { serieAusVerlauf } from './verlauf.js'
import { ladeListen } from './videoListen.js'
import NavBild from './NavBild.jsx'
import { holeVideoMitTranskript, supabaseBereit } from './supabase.js'
import { useNutzer } from './auth.js'
import {
  zusammenfuehren,
  speichereVokabeln,
  speichereStatistik,
  speichereFortschritt,
} from './sync.js'
import Login from './Login.jsx'
import NeuesPasswort from './NeuesPasswort.jsx'
import { Impressum, Datenschutz, AGB, KontoLoeschen } from './Recht.jsx'
import Bezahlen from './Bezahlen.jsx'
import KaufNativ from './KaufNativ.jsx'
import { kaufMoeglich, kaufVorbereiten, kaufBeenden } from './kauf.js'
import Sprechen from './Sprechen.jsx'
import PremiumDanke from './PremiumDanke.jsx'
import MeilensteinMeldung from './MeilensteinMeldung.jsx'
import { neueMeilensteine, meilensteineGleichsetzen, meilensteineStillSetzen, MEILENSTEIN_XP } from './meilensteine.js'
// Pakete, die man geschenkt bekommt – zählen nicht für Meilensteine
const GESCHENKT = new Set(['Grundpaket', 'Startpaket', 'Startgeschenk'])
import { summeWiederholungen } from './aktivitaet.js'
import { seitenaufruf } from './messung.js'
import Feed from './Feed.jsx'
import {
  ladeSaetzeLokal,
  speichereSaetzeLokal,
  ladeSaetze,
  speichereSaetze,
  neuerSatz,
  satzSchluessel,
} from './saetze.js'
import {
  ladeTexteLokal,
  speichereTexteLokal,
  ladeTexte,
  speichereTexte,
  neuerText,
} from './lesetexte.js'
import { GRUNDPAKET_VERSION, STARTGESCHENK_WOERTER, GRUNDPAKET_SAETZE } from './grundpaket.js'
import { geschenkWoerter, geschenkSaetze, geschenkText, woerterInSprache, saetzeInSprache, textInSprache } from './geschenkSprache.js'
import StartGeschenk from './StartGeschenk.jsx'
import Einrichtung from './Einrichtung.jsx'
import Willkommen from './Willkommen.jsx'
import Logo from './Logo.jsx'
import { useState, useEffect, useRef } from 'react'
import { uebersetzungsAdresse } from './satzUmfeld.js'

/** Zieht die YouTube-ID aus einem Link oder gibt eine reine ID zurück. */
function videoIdAusEingabe(eingabe) {
  const text = String(eingabe).trim()
  if (/^[\w-]{11}$/.test(text)) return text
  const treffer = text.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)
  return treffer ? treffer[1] : null
}
import Trainer from './Trainer.jsx'
import Library from './Library.jsx'
import VocabGenerator from './VocabGenerator.jsx'
import Settings from './Settings.jsx'
import Lessons from './Lessons.jsx'
import Home, { Leitfaden } from './Home.jsx'
import BereichsIntro, { BEREICHE, RUNDGANG_REIHE, gesehene } from './Rundgang.jsx'
import { naechsteLektion, LEKTIONEN } from './lektionen.js'

// Der Name der App – an dieser einen Stelle änderbar
export const APP_NAME = 'Davaigo'
import { newEntry, withSrsDefaults, isDue } from './srs.js'
import {
  XP,
  loadProgress,
  serieAufraeumen,
  applyXp,
  levelFromXp,
  xpForLevel,
  levelName,
  xpHeute,
} from './gamification.js'
import { hakeAb } from './tagesplan.js'
import './App.css'
import { zeigeMichAn, verschwinde } from './praesenz.js'
import { merkeGelernt } from './lernkurve.js'
import { gleicheGeraetedatenAb } from './geraeteSync.js'
import { gleicheVideosAb, ladeGeloeschteLokal, speichereGeloeschteLokal } from './videoSync.js'
import { ladeBenutzername } from './rangliste.js'
import { baueBrueckenPlayer } from './ytBruecke.js'
import Gespraech from './Gespraech.jsx'
import { tr, sprache, geradeGewechselt } from './sprache.js'
import LevelEmblem from './LevelEmblem.jsx'
import Flamme from './Flamme.jsx'
import { lebenszeichen } from './lernzeit.js'

// Moderne Icons für die Menüleiste (schlanke SVG-Zeichnungen im Lucide-Stil)
const ICONS = {
  start: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h5v-6h4v6h5V9.5" />
    </svg>
  ),
  trainer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="8" width="13" height="13" rx="2.5" />
      <path d="M8 8V6a2.5 2.5 0 0 1 2.5-2.5h8A2.5 2.5 0 0 1 21 6v8a2.5 2.5 0 0 1-2.5 2.5H16" />
    </svg>
  ),
  bibliothek: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* YouTube-artig: abgerundeter Bildschirm mit Play-Dreieck */}
      <rect x="2.5" y="5" width="19" height="14" rx="4.5" />
      <path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" />
    </svg>
  ),
  lektionen: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 9.5L12 4.5 2 9.5l10 5 10-5z" />
      <path d="M6 11.8V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.2" />
    </svg>
  ),
  mehr: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
}

// Lektions-Fortschritt aus dem Browser-Speicher laden
function loadLessonProgress() {
  try {
    return JSON.parse(localStorage.getItem('lektionen')) || {}
  } catch {
    return {}
  }
}

// Einstellungen aus dem Browser-Speicher laden (mit sinnvollen Standardwerten)
function loadSettings() {
  try {
    return {
      tagesziel: 30,
      erinnerungen: true,
      ...JSON.parse(localStorage.getItem('einstellungen')),
    }
  } catch {
    return { tagesziel: 30, erinnerungen: true }
  }
}

// ---------------------------------------------------------------
//  Wie weit man in einem Video schon gekommen ist (in Prozent)
// ---------------------------------------------------------------
export function ladeVideoFortschritt() {
  try {
    return JSON.parse(localStorage.getItem('videoFortschritt')) || {}
  } catch {
    return {}
  }
}

// Wird beim Abspielen laufend aufgerufen – deshalb nur schreiben,
// wenn sich der Wert um mindestens einen Prozentpunkt geändert hat.
let letzterFortschritt = {}
function merkeFortschritt(videoId, prozent, sekunden) {
  if (letzterFortschritt[videoId] === prozent) return
  letzterFortschritt[videoId] = prozent
  const alle = ladeVideoFortschritt()
  // Prozent fuer die Kachel, Sekunden zum Weiterschauen. Aeltere
  // Eintraege sind nur eine Zahl – die lesen wir weiter unten ab.
  alle[videoId] = { prozent, sekunden: Math.round(sekunden) }
  localStorage.setItem('videoFortschritt', JSON.stringify(alle))
}

/** Wie weit war man in diesem Video? Versteht auch alte Eintraege. */
export function standVon(videoId) {
  const eintrag = ladeVideoFortschritt()[videoId]
  if (typeof eintrag === 'number') return { prozent: eintrag, sekunden: 0 }
  return { prozent: eintrag?.prozent ?? 0, sekunden: eintrag?.sekunden ?? 0 }
}

// Gespeicherte Videos aus dem Browser-Speicher laden
function loadSavedVideos() {
  try {
    return JSON.parse(localStorage.getItem('videos')) || []
  } catch {
    return []
  }
}

// Wörter werden im Browser gespeichert (localStorage), damit sie beim
// nächsten Besuch noch da sind. Status: "neu" (blau), "lernen" (gelb), "gewusst".
function loadVocab() {
  try {
    return JSON.parse(localStorage.getItem('vokabeln')) || {}
  } catch {
    return {}
  }
}

// Der Grammatik-Karteikasten liegt getrennt von den Vokabeln:
// { bausteinId: srsEintrag }. Getrennt, weil die Schluessel sonst
// kollidieren koennten – eine Vokabel "tener" und der Baustein
// "tener" waeren im selben Objekt dasselbe Feld.
function loadBausteine() {
  try {
    return JSON.parse(localStorage.getItem('bausteine')) || {}
  } catch {
    return {}
  }
}

// Macht aus einem Wort eine saubere Kleinschreibung ohne Satzzeichen,
// damit "Hola," und "hola" als dasselbe Wort zählen.
function cleanWord(word) {
  return word.toLowerCase().replace(/[^а-яё]/gi, '')
}

// Lädt die YouTube-Player-API (einmalig). Über sie erfahren wir,
// an welcher Sekunde das Video gerade ist.
let ytApiPromise = null
function loadYouTubeApi() {
  if (!ytApiPromise) {
    ytApiPromise = new Promise((resolve) => {
      if (window.YT?.Player) return resolve(window.YT)
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
      window.onYouTubeIframeAPIReady = () => resolve(window.YT)
    })
  }
  return ytApiPromise
}


/**
 * Fertige Übersetzung einer Mediathek-Zeile für Zeile (09.11.2026).
 * Liegt als public/uebersetzungen/<youtube_id>.<sprache>.json im Build –
 * kostet nichts und ist sofort da. Fehlt sie: null, dann übersetzt der
 * Server wie bisher beim Einschalten.
 */
async function ladeFertigeUebersetzung(id, laenge) {
  try {
    const r = await fetch(`/uebersetzungen/${encodeURIComponent(id)}.${sprache()}.json`)
    if (!r.ok) return null
    const z = await r.json()
    return Array.isArray(z) && z.length === laenge ? z : null
  } catch {
    return null
  }
}

export default function App() {
  const { premium: appPremium } = usePremium()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [video, setVideo] = useState(null) // { videoId, title, lines }
  const [vocab, setVocab] = useState(loadVocab)
  // Der Satz-Karteikasten liegt getrennt von den Vokabeln: dort steht
  // ein Wort auf der Karte, hier ein ganzer Satz.
  const [saetze, setSaetze] = useState(ladeSaetzeLokal)
  // Die Wissenstexte zum Lesen und Wiederlesen
  const [texte, setTexte] = useState(ladeTexteLokal)
  const [bausteinStand, setBausteinStand] = useState(loadBausteine)
  const [selected, setSelected] = useState(null) // { word, translation, loading }
  const [cardExit, setCardExit] = useState(null) // 'lernen'|'gewusst' – Erfolgs-Animation der Wortkarte
  const [genOpen, setGenOpen] = useState(false) // Vokabelgenerator-Panel offen?
  const [saveOpen, setSaveOpen] = useState(false) // Speichern-Panel offen?
  const [showDe, setShowDe] = useState(false) // deutsche Übersetzung eingeblendet?
  const [deLines, setDeLines] = useState(null) // die übersetzten Zeilen
  const [deLoading, setDeLoading] = useState(false)
  const [activeLine, setActiveLine] = useState(-1) // welche Zeile gerade gesprochen wird
  const [autoScroll, setAutoScroll] = useState(true)
  const [laeuft, setLaeuft] = useState(false) // spielt das Video gerade?
  const [tempo, setTempo] = useState(1) // Abspielgeschwindigkeit
  const [weiterAb, setWeiterAb] = useState(null) // Hinweis "weiter bei ..."
  const [aktuelleArt, setAktuelleArt] = useState('video') // 'video' | 'musik'
  // Kommt der Nutzer von Spotify zurueck (Adresse /spotify?code=...),
  // starten wir gleich im Songs-Bereich – sonst landet er auf der
  // Startseite und der Code wird nie eingeloest.
  const [view, setView] = useState(() =>
    geradeGewechselt()
      ? 'mehr'
      : new URLSearchParams(window.location.search).get('code') ? 'videos' : 'start'
  ) // 'start', 'lesen', 'lektionen', 'trainer', 'videos', 'mehr'

  // Bereichs-Einführungen: Welche Infobox ist gerade offen, und läuft
  // der Rundgang (Index in RUNDGANG_REIHE)? null = nichts davon.
  // Anders als in Habloo erklärt sich auch die Startseite selbst:
  // Davaigo hat kein Onboarding, die Startbox ist der erste Gruß.
  const [intro, setIntro] = useState(null)
  const [rundgangNr, setRundgangNr] = useState(null)

  // Jeder Tab beginnt oben, nicht an der Scrollstelle des vorigen.
  useEffect(() => { window.scrollTo(0, 0) }, [view])

  useEffect(() => {
    if (rundgangNr !== null) return // der Rundgang zeigt selbst an
    if (BEREICHE[view] && !gesehene()[view]) setIntro(view)
  }, [view, rundgangNr])

  function starteRundgang() {
    setRundgangNr(0)
    setView(RUNDGANG_REIHE[0])
    setIntro(RUNDGANG_REIHE[0])
  }

  function rundgangWeiter() {
    const naechste = rundgangNr + 1
    if (naechste >= RUNDGANG_REIHE.length) return rundgangEnde()
    setRundgangNr(naechste)
    setView(RUNDGANG_REIHE[naechste])
    setIntro(RUNDGANG_REIHE[naechste])
  }

  function rundgangEnde() {
    setRundgangNr(null)
    setIntro(null)
    setView('start')
  }
  const [savedVideos, setSavedVideos] = useState(loadSavedVideos)
  const [categoryInput, setCategoryInput] = useState('')
  const [progress, setProgress] = useState(() => serieAufraeumen(loadProgress())) // XP, Streak, letzter Lerntag
  const [settings, setSettings] = useState(loadSettings) // Tagesziel, Erinnerungen …
  const [lessonProgress, setLessonProgress] = useState(loadLessonProgress) // welche Lektionen geschafft sind
  const [levelUp, setLevelUp] = useState(null) // welches Level gerade erreicht wurde
  const prevLevelRef = useRef(levelFromXp(loadProgress().xp))

  // Serie gegen die echten Lerntage prüfen (07.11.): Ist der Verlauf
  // länger als der Zähler, gilt der Verlauf. Nur nach oben – nie
  // kürzen, ältere Serien reichen weiter zurück als der Verlauf.
  useEffect(() => {
    const pruefe = () => {
      const echt = serieAusVerlauf()
      setProgress((p) => {
        const q = serieAufraeumen(p) // gerissene Serie auf 0
        return echt > (q.streak || 0) ? { ...q, streak: echt } : q
      })
    }
    pruefe()
    window.addEventListener('aktivitaet', pruefe)
    window.addEventListener('lernkurve', pruefe)
    return () => {
      window.removeEventListener('aktivitaet', pruefe)
      window.removeEventListener('lernkurve', pruefe)
    }
  }, [])

  // ---------- Konto & Abgleich ----------
  const { nutzer, laedt: nutzerLaedt, passwortNeuSetzen, passwortGesetzt } = useNutzer()

  // Welche Pflichtseite gerade offen ist – oder null.
  //
  // Steht bewusst hier oben und nicht bei den Ansichten: Impressum,
  // Datenschutz und AGB müssen auch OHNE Konto erreichbar sein, und
  // dort unten gibt es die normale Ansichtssteuerung noch gar nicht.
  // Aus der Adresse lesen, damit ?recht=impressum von außen
  // verlinkbar ist – die Ratgeberseiten im Fuß tun genau das.
  // Die Kassenseite – eigene Vollbildseite unter /kasse
  const [kasseOffen, setKasseOffen] = useState(
    () => window.location.pathname.replace(/^\/+|\/+$/g, '') === 'kasse'
  )

  // Der Sprach-Trainer – eigene Seite unter /sprechen
  // Stripe schickt nach der Zahlung mit ?bezahlt=ja zurück
  const [dankeOffen, setDankeOffen] = useState(
    () => new URLSearchParams(window.location.search).get('bezahlt') === 'ja'
  )
  const [sprechenOffen, setSprechenOffen] = useState(
    () => window.location.pathname.replace(/^\/+|\/+$/g, '') === 'sprechen'
  )
  useEffect(() => {
    const auf = () => {
      window.history.pushState({}, '', '/sprechen')
      setSprechenOffen(true)
    }
    const zurueck = () => {
      const pfad = window.location.pathname.replace(/^\/+|\/+$/g, '')
      setSprechenOffen(pfad === 'sprechen')
      // Premium-Knöpfe (Lesekurs, Gratis-Hinweise, Werbung) wechseln nur
      // die Adresse auf /kasse – hier wird daraus die Kassenseite (09.11.).
      setKasseOffen(pfad === 'kasse')
    }
    window.addEventListener('sprechen-oeffnen', auf)
    window.addEventListener('popstate', zurueck)
    return () => {
      window.removeEventListener('sprechen-oeffnen', auf)
      window.removeEventListener('popstate', zurueck)
    }
  }, [])

  const [rechtSeite, setRechtSeite] = useState(() => {
    const gewuenscht = new URLSearchParams(window.location.search).get('recht')
    return ['impressum', 'datenschutz', 'agb', 'konto-loeschen'].includes(gewuenscht) ? gewuenscht : null
  })

  // Der Einwilligungs-Hinweis hängt neben <App/> im Baum (App steigt
  // für Abgemeldete früh aus), kann also keine Prop bekommen.
  // Deshalb meldet er sich über ein Fenster-Ereignis.
  useEffect(() => {
    const auf = (e) => setRechtSeite(e.detail)
    window.addEventListener('recht', auf)
    return () => window.removeEventListener('recht', auf)
  }, [])

  // Jeden Ansichtswechsel an die Messung melden.
  //
  // Ohne das zählte Google genau EINEN Seitenaufruf pro Sitzung:
  // Davaigo hat keinen Router, die Adresse in der Leiste ändert sich
  // nie. Wer zwei Stunden durch die App geht, sähe in der Statistik
  // aus wie jemand, der sofort wieder weg ist.
  useEffect(() => {
    seitenaufruf(view)
  }, [view])
  const [loginOffen, setLoginOffen] = useState(false)
  const [loginStart, setLoginStart] = useState('anmelden') // womit der Dialog aufgeht
  const [syncStatus, setSyncStatus] = useState('') // '' | 'laeuft' | 'fertig' | Fehlertext
  const angemeldetRef = useRef(null) // verhindert doppeltes Zusammenführen

  // Abgleich nach Fehler von Hand neu anstoßen (Hinweisleiste)
  const [abgleichNr, setAbgleichNr] = useState(0)
  function abgleichNochmal() {
    angemeldetRef.current = null
    setAbgleichNr((n) => n + 1)
  }

  // Nach dem Anmelden: lokale und gespeicherte Daten zusammenführen
  useEffect(() => {
    if (!nutzer || angemeldetRef.current === nutzer.id) return
    angemeldetRef.current = nutzer.id

    let abgebrochen = false
    setSyncStatus('laeuft')

    zusammenfuehren(nutzer.id, {
      vokabeln: vocab,
      stats: progress,
      fortschritt: lessonProgress,
    })
      .then((vereint) => {
        if (abgebrochen) return
        setVocab(vereint.vokabeln)
        // Der Sprung durch den Abgleich ist kein Aufstieg – keine Feier (09.11.)
        prevLevelRef.current = Math.max(prevLevelRef.current, levelFromXp(vereint.stats?.xp ?? 0))
        setProgress((p) => ({ ...p, ...vereint.stats }))
        setLessonProgress(vereint.fortschritt)
        setSyncStatus('fertig')
      })
      .catch((f) => {
        if (!abgebrochen) setSyncStatus('fehler: ' + f.message)
      })

    return () => { abgebrochen = true }
    // Nur an der Nutzer-ID haengen (09.11.): Supabase meldet nach dem Login
    // denselben Nutzer mehrfach neu (Schluessel erneuert). Das brach den
    // laufenden Abgleich ab, ohne ihn neu zu starten – „wird abgeglichen …“
    // blieb ewig stehen, und das Grundpaket kam nie.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nutzer?.id, abgleichNr])

  // Der Store-Kauf gehoert zum Konto, nicht zum Geraet.
  useEffect(() => {
    if (!kaufMoeglich()) return
    if (!nutzer) {
      kaufBeenden()
      return
    }
    kaufVorbereiten(nutzer.id)
  }, [nutzer])

  // Startgeschenk (vorher Grundpaket): einmal je Konto (bzw. Gast) die 50 wichtigsten Wörter, 10 Sätze und
  // der Text „So lernst du mit Davaigo“ – damit Trainer, Sätze und Texte
  // am ersten Tag nicht leer sind. Wer schon 50+ Wörter hat, bekommt
  // nur Sätze und Text. Doppeltes fällt über die Schlüssel weg.
  // Die Übersetzungen kommen in der Sprache der App (geschenkSprache.js).
  useEffect(() => {
    if (nutzer && syncStatus !== 'fertig') return
    const merker = 'grundpaket-' + GRUNDPAKET_VERSION + ':' + (nutzer?.id ?? 'gast')
    try {
      if (localStorage.getItem(merker)) return
    } catch {
      return
    }
    // Kurz warten: Sätze und Texte aus der Datenbank kommen erst nach dem Abgleich
    const zeit = setTimeout(() => {
      try { localStorage.setItem(merker, 'ja') } catch { /* egal */ }
      const sp = sprache()
      setVocab((v) => {
        if (Object.keys(v).length >= 50) return v
        const copy = { ...v }
        for (const w of geschenkWoerter(sp)) {
          const key = w.wort.toLowerCase()
          if (!copy[key]) copy[key] = { ...newEntry(w.uebersetzung, 'Startgeschenk'), status: 'lernen' }
        }
        return copy
      })
      setSaetze((alt) => {
        const neu = { ...alt }
        for (const s of geschenkSaetze(sp)) {
          const key = satzSchluessel(s.satz)
          if (!neu[key]) neu[key] = neuerSatz(s, { thema: 'Startgeschenk' })
        }
        return neu
      })
      setTexte((alt) => (alt['t-grundpaket'] ? alt : { ...alt, 't-grundpaket': neuerText(geschenkText(sp)) }))
      // Das Geschenk löst keine Meilensteine aus (Sera bekam 600 XP für geschenkte Wörter):
      // beim nächsten Prüfen alles Erreichte still eintragen, ohne XP.
      meilensteinAbgleichRef.current = null
      if (nutzer && !einrichtungRef.current) setStartGeschenk(true) // nur mit Konto zeigen, nicht auf der Startseite für Gäste
    }, 2500)
    return () => clearTimeout(zeit)
  }, [nutzer, syncStatus])

  // Das Geschenk folgt der App-Sprache: Wer es noch mit deutscher
  // Übersetzung im Trainer hat und die App auf Englisch nutzt, bekommt
  // die englische – und umgekehrt. Läuft bei jeder Änderung mit, weil
  // Sätze und Texte vom Konto erst nach dem Abgleich eintreffen; ohne
  // Treffer kommt dasselbe Objekt zurück, es passiert also nichts.
  const appSprache = sprache()
  useEffect(() => {
    if (nutzer && syncStatus !== 'fertig') return
    setVocab((v) => woerterInSprache(v, appSprache))
    setSaetze((s) => saetzeInSprache(s, appSprache))
    setTexte((x) => textInSprache(x, appSprache))
  }, [vocab, saetze, texte, nutzer, syncStatus, appSprache])

  // Beim Abmelden wieder auf reinen Browser-Betrieb umstellen
  useEffect(() => {
    if (!nutzer) {
      angemeldetRef.current = null
      setSyncStatus('')
    }
  }, [nutzer])

  // Freunden zeigen, dass man da ist. Braucht den Benutzernamen –
  // ohne den steht man ohnehin in keiner Liste.
  useEffect(() => {
    if (!nutzer) {
      verschwinde()
      return
    }
    let aktiv = true
    ladeBenutzername(nutzer.id).then((n) => {
      if (aktiv && n) zeigeMichAn(n)
    })
    // Nach einem Namenswechsel neu anmelden
    const neu = () => ladeBenutzername(nutzer.id).then((n) => n && zeigeMichAn(n))
    window.addEventListener('benutzername', neu)
    return () => {
      aktiv = false
      window.removeEventListener('benutzername', neu)
    }
  }, [nutzer])

  // Beim Schließen des Tabs sauber abmelden, damit der grüne Punkt
  // bei den Freunden nicht stehen bleibt.
  useEffect(() => {
    const weg = () => verschwinde()
    window.addEventListener('pagehide', weg)
    return () => window.removeEventListener('pagehide', weg)
  }, [])

  const playerRef = useRef(null) // der YouTube-Player
  const lineRefs = useRef([]) // die Zeilen-Elemente, damit wir hinscrollen können
  const textPaneRef = useRef(null) // der scrollbare Text-Kasten

  // Bei jeder Änderung die Vokabeln speichern – im Browser sofort,
  // in der Datenbank kurz verzögert (damit nicht bei jedem Tastendruck
  // eine Anfrage rausgeht)
  // Der Grammatik-Karteikasten wird nur lokal gehalten. Er haengt an
  // den Lektionen, die ohnehin schon synchronisiert werden – und ein
  // eigener Tabellen-Anbau in Supabase waere fuer 55 Zahlenpaare
  // mehr Aufwand als Nutzen.
  useEffect(() => {
    localStorage.setItem('bausteine', JSON.stringify(bausteinStand))
  }, [bausteinStand])

  useEffect(() => {
    localStorage.setItem('vokabeln', JSON.stringify(vocab))

    if (!nutzer || syncStatus !== 'fertig') return // erst nach erfolgreichem Abgleich – sonst überschreibt ein leerer Stand die Datenbank
    const timer = setTimeout(() => {
      speichereVokabeln(nutzer.id, vocab).catch((f) =>
        console.warn(tr('Vokabeln konnten nicht gesichert werden:'), f.message)
      )
    }, 1500)
    return () => clearTimeout(timer)
  }, [vocab, nutzer, syncStatus])

  // Dasselbe für die Sätze. Die Datenbank-Tabelle gibt es eventuell
  // noch nicht – dann bleibt speichereSaetze() still wirkungslos und
  // der Browser-Speicher ist die einzige Ablage (siehe saetze.js).
  useEffect(() => {
    speichereSaetzeLokal(saetze)

    if (!nutzer || syncStatus !== 'fertig') return // erst nach erfolgreichem Abgleich – sonst überschreibt ein leerer Stand die Datenbank
    const timer = setTimeout(() => {
      speichereSaetze(nutzer.id, saetze).catch(() => {})
    }, 1500)
    return () => clearTimeout(timer)
  }, [saetze, nutzer, syncStatus])

  // Und dasselbe für die Lesetexte.
  useEffect(() => {
    speichereTexteLokal(texte)

    if (!nutzer || syncStatus !== 'fertig') return // erst nach erfolgreichem Abgleich – sonst überschreibt ein leerer Stand die Datenbank
    const timer = setTimeout(() => {
      speichereTexte(nutzer.id, texte).catch(() => {})
    }, 1500)
    return () => clearTimeout(timer)
  }, [texte, nutzer, syncStatus])

  // Beim Anmelden die Sätze vom Konto holen und mit den lokalen
  // zusammenführen – der weiter fortgeschrittene Stand gewinnt.
  useEffect(() => {
    if (!nutzer) return
    let abgebrochen = false
    ladeSaetze(nutzer.id)
      .then((ausDb) => {
        if (!ausDb || abgebrochen) return
        setSaetze((lokal) => {
          const zusammen = { ...ausDb }
          for (const [key, e] of Object.entries(lokal)) {
            const da = zusammen[key]
            // Ohne Gegenstück übernehmen; sonst den neueren Termin behalten
            if (!da || (e.due ?? 0) > (da.due ?? 0)) zusammen[key] = e
          }
          return zusammen
        })
      })
      .catch(() => {})
    return () => {
      abgebrochen = true
    }
  }, [nutzer])

  // Lesetexte vom Konto holen und zusammenführen.
  useEffect(() => {
    if (!nutzer) return
    let abgebrochen = false
    ladeTexte(nutzer.id)
      .then((ausDb) => {
        if (!ausDb || abgebrochen) return
        setTexte((lokal) => ({ ...ausDb, ...lokal }))
      })
      .catch(() => {})
    return () => {
      abgebrochen = true
    }
  }, [nutzer])

  // Gespeicherte Videos im Browser sichern und mit dem Konto abgleichen
  // (vorher nur lokal – auf dem Tablet fehlte die Liste vom Handy).
  // Verschwundene Videos bekommen einen Lösch-Zeitpunkt, damit ein
  // anderes Gerät sie nicht wieder zurückbringt (siehe videoSync.js).
  const vorherigeVideos = useRef(savedVideos)
  const [videosAbgeglichen, setVideosAbgeglichen] = useState(false)
  useEffect(() => {
    localStorage.setItem('videos', JSON.stringify(savedVideos))
    const jetzt = new Set(savedVideos.map((v) => v.videoId))
    const weg = vorherigeVideos.current.filter((v) => !jetzt.has(v.videoId))
    vorherigeVideos.current = savedVideos
    if (weg.length) {
      const geloescht = ladeGeloeschteLokal()
      for (const v of weg) geloescht[v.videoId] = Date.now()
      speichereGeloeschteLokal(geloescht)
    }

    if (!nutzer || !videosAbgeglichen) return
    const timer = setTimeout(() => {
      gleicheVideosAb(nutzer.id, {
        videos: savedVideos,
        geloescht: ladeGeloeschteLokal(),
      }).catch((f) => console.warn(tr('Videos konnten nicht gesichert werden:'), f.message))
    }, 1500)
    return () => clearTimeout(timer)
  }, [savedVideos, nutzer, videosAbgeglichen])

  // Beim Start/Anmelden: Liste vom Konto holen und vereinen
  useEffect(() => {
    setVideosAbgeglichen(false)
    if (!nutzer) return
    let abgebrochen = false
    gleicheVideosAb(nutzer.id, { videos: loadSavedVideos(), geloescht: ladeGeloeschteLokal() })
      .then((vereint) => {
        if (abgebrochen) return
        speichereGeloeschteLokal(vereint.geloescht)
        // Vom Konto entfernte Videos sind kein neues Löschen
        vorherigeVideos.current = vereint.videos
        setSavedVideos(vereint.videos)
        setVideosAbgeglichen(true)
      })
      .catch((f) => console.warn(tr('Videos konnten nicht abgeglichen werden:'), f.message))
    return () => {
      abgebrochen = true
    }
  }, [nutzer])

  // Übrige Lerndaten (Einstellungen, Grammatik, Video-Stände, Bücher,
  // "schon belohnt"-Listen …) mit dem Konto abgleichen: beim Start,
  // jede Minute und beim Verlassen der App (siehe geraeteSync.js).
  useEffect(() => {
    if (!nutzer) return
    const abgleich = () =>
      gleicheGeraetedatenAb(nutzer.id).catch((f) =>
        console.warn(tr('Abgleich fehlgeschlagen:'), f.message)
      )
    abgleich()
    const takt = setInterval(abgleich, 60000)
    const weg = () => document.visibilityState === 'hidden' && abgleich()
    document.addEventListener('visibilitychange', weg)
    const neuEinlesen = (e) => {
      if (e.detail.includes('einstellungen')) setSettings(loadSettings())
      if (e.detail.includes('bausteine')) setBausteinStand(loadBausteine())
    }
    window.addEventListener('geraetedaten', neuEinlesen)
    return () => {
      clearInterval(takt)
      document.removeEventListener('visibilitychange', weg)
      window.removeEventListener('geraetedaten', neuEinlesen)
    }
  }, [nutzer])

  // Einstellungen sichern
  useEffect(() => {
    localStorage.setItem('einstellungen', JSON.stringify(settings))
  }, [settings])

  // Lektions-Fortschritt sichern
  useEffect(() => {
    localStorage.setItem('lektionen', JSON.stringify(lessonProgress))
  }, [lessonProgress])

  // Statistik (XP, Level, Serie) in der Datenbank nachziehen
  useEffect(() => {
    if (!nutzer || syncStatus !== 'fertig') return // erst nach erfolgreichem Abgleich – sonst überschreibt ein leerer Stand die Datenbank
    const timer = setTimeout(() => {
      speichereStatistik(nutzer.id, {
        xp: progress.xp,
        level: levelFromXp(progress.xp),
        streak: progress.streak,
        // Der Fortschritt heißt lastActive, nicht lastDay – bis 06.11. ging
        // hier immer null raus, und die Serie fing nach jedem Abgleich
        // (anderes Gerät, neu angemeldet) wieder bei 1 an.
        lastDay: progress.lastActive,
        xpToday: xpHeute(progress),
      }).catch((f) => console.warn(tr('Statistik nicht gesichert:'), f.message))
    }, 1500)
    return () => clearTimeout(timer)
  }, [progress, nutzer, syncStatus])

  // Eine Lektion wurde abgeschlossen: merken und die Wörter der Lektion
  // in den Vokabeltrainer übernehmen (Status "Lernen")
  function lektionGeschafft(lektion) {
    setLessonProgress((p) => ({ ...p, [lektion.id]: { fertig: true } }))
    if (nutzer) {
      speichereFortschritt(nutzer.id, lektion.id).catch((f) =>
        console.warn(tr('Lektion nicht gesichert:'), f.message)
      )
    }
    setVocab((v) => {
      const copy = { ...v }
      for (const item of lektion.items) {
        const key = item.es.toLowerCase()
        if (!copy[key]) {
          copy[key] = {
            ...newEntry(item.de, tr('Lektion: {0}', lektion.titel)),
            status: 'lernen',
          }
        }
      }
      return copy
    })
  }

  // Fortschritt (XP & Streak) sichern und Level-Aufstieg erkennen
  useEffect(() => {
    localStorage.setItem('fortschritt', JSON.stringify(progress))
    const level = levelFromXp(progress.xp)
    if (level > prevLevelRef.current) setLevelUp(level)
    prevLevelRef.current = level
  }, [progress])

  // Level-Up-Feier nach ein paar Sekunden automatisch ausblenden
  useEffect(() => {
    if (!levelUp) return
    const timer = setTimeout(() => setLevelUp(null), 3200)
    return () => clearTimeout(timer)
  }, [levelUp])

  // XP gutschreiben (pflegt automatisch auch die Tagesserie)
  // Eine kurze Einblendung, wenn XP dazukommen – sonst merkt
  // niemand, dass Videogucken oder ein neues Wort etwas bringt.
  const [xpMeldung, setXpMeldung] = useState(null)

  function addXp(amount, text) {
    setProgress((p) => applyXp(p, amount))
    if (text && amount > 0) setXpMeldung({ punkte: amount, text, key: Date.now() + Math.random() })
  }

  // Videogucken lohnt sich: je volle Minute Wiedergabe gibt es XP.
  // Gezählt wird nur, solange das Video WIRKLICH läuft – Pause und
  // Spulen zählen nicht, angefangene Sekunden bleiben für die
  // nächste Minute stehen.
  const videoSekunden = useRef(0)
  useEffect(() => {
    if (!laeuft || view !== 'lesen') return
    const takt = setInterval(() => {
      // Bei jedem Takt neu prüfen: Lese-Ansicht offen, Seite
      // sichtbar, Player meldet wirklich "spielt". Ohne das zählten
      // die Minuten im Hintergrund weiter, wenn jemand mitten im
      // Video auf einen anderen Reiter wechselt.
      let spielt = false
      try {
        const spieler = playerRef.current
        spielt = spieler?.getIframe?.()?.isConnected && spieler.getPlayerState?.() === 1
      } catch { /* Player schon abgebaut */ }
      if (!spielt || document.hidden) return

      videoSekunden.current += 1
      lebenszeichen() // Video läuft: zählt als Lernzeit, auch ohne Tippen
      if (videoSekunden.current >= 60) {
        videoSekunden.current -= 60
        addXp(XP.VIDEO_MINUTE, tr('Video-Minute'))
        merkeGelernt('video') // für die Lernkurve
      }
    }, 1000)
    return () => clearInterval(takt)
  }, [laeuft, view])

  // Beim Verlassen der Lese-Ansicht gilt das Video als angehalten
  useEffect(() => {
    if (view !== 'lesen') setLaeuft(false)
  }, [view])

  // Wenn ein Video geladen wurde: YouTube-Player erstellen
  useEffect(() => {
    if (!video) return
    let cancelled = false

    // Was beim Start passieren soll – für beide Wege gleich
    const ereignisse = {
      // Damit der Pause-Knopf immer das richtige Symbol zeigt –
      // auch wenn direkt im Player geklickt wird (1 = läuft)
      onStateChange: (e) => setLaeuft(e.data === 1),
      onReady: (e) => {
        setLaeuft(false)
        setTempo(1)
        // Dort weitermachen, wo man aufgehoert hat. Nur wenn man
        // wirklich mittendrin war: Die ersten 10 Sekunden lohnen
        // sich nicht, und ab 95 % faengt man lieber neu an.
        const { prozent, sekunden } = standVon(video.videoId)
        if (sekunden > 10 && prozent < 95) {
          e.target.seekTo(sekunden, true)
          setWeiterAb(sekunden)
          setTimeout(() => setWeiterAb(null), 4000)
        }
      },
    }

    // In der App über die Seite auf davaigo.de, im Browser direkt.
    //
    // YouTube weist seit Juli 2025 jede Einbettung ohne gültigen
    // Referer ab ("Fehler 153"). Eine App lädt ihre Oberfläche
    // lokal, hat also keinen – deshalb dort der Umweg über eine
    // Seite, die wirklich auf davaigo.de liegt. Im Browser stimmt
    // der Referer ohnehin, da bleibt der direkte Weg.
    if (istApp) {
      playerRef.current = baueBrueckenPlayer('yt-player', {
        videoId: video.videoId,
        events: ereignisse,
      })
      return () => {
        cancelled = true
        playerRef.current?.destroy?.()
        playerRef.current = null
        setActiveLine(-1)
      }
    }

    loadYouTubeApi().then((YT) => {
      if (cancelled) return
      playerRef.current = new YT.Player('yt-player', {
        videoId: video.videoId,
        playerVars: { rel: 0 },
        events: ereignisse,
      })
    })
    return () => {
      cancelled = true
      playerRef.current?.destroy?.()
      playerRef.current = null
      setActiveLine(-1)
    }
  }, [video])

  // Alle 300ms nachschauen, wo das Video gerade ist,
  // und die passende Textzeile aktiv setzen
  useEffect(() => {
    if (!video) return
    const timer = setInterval(() => {
      const player = playerRef.current
      if (!player?.getCurrentTime) return
      const t = player.getCurrentTime()
      // Die letzte Zeile finden, die schon angefangen hat
      let idx = -1
      for (let i = 0; i < video.lines.length; i++) {
        if (video.lines[i].start <= t) idx = i
        else break
      }
      setActiveLine(idx)

      // Fortschritt merken, damit die Video-Kachel zeigt, wie weit man ist
      const dauer = player.getDuration?.() ?? 0
      if (dauer > 0) {
        merkeFortschritt(video.videoId, Math.min(100, Math.round((t / dauer) * 100)), t)
      }
    }, 300)
    return () => clearInterval(timer)
  }, [video])

  // Wenn sich die aktive Zeile ändert: den Text-Kasten sanft dorthin scrollen
  // (nur den Kasten, nicht die ganze Seite)
  useEffect(() => {
    if (!autoScroll || activeLine < 0) return
    const box = textPaneRef.current
    if (!box) return

    // Die Zeile direkt aus dem DOM holen statt über eine gespeicherte
    // Referenz: React setzt Inline-Referenzen bei jedem Neuzeichnen
    // kurz auf null, und genau dann lief dieser Effekt ins Leere.
    const el = box.children[activeLine]
    if (!el) return

    const ziel = Math.max(0, el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2)

    // Sanft hingleiten – aber selbst gesteuert. Große Sprünge (etwa beim
    // Öffnen mittendrin) macht der Code sofort, kleine Schritte von Zeile
    // zu Zeile gleiten in ~300 ms.
    const start = box.scrollTop
    const weg = ziel - start
    if (Math.abs(weg) < 2) return
    if (Math.abs(weg) > 1200) {
      box.scrollTop = ziel
      return
    }

    const beginn = performance.now()
    const dauer = 300
    let abgebrochen = false

    function schritt(jetzt) {
      if (abgebrochen) return
      const anteil = Math.min(1, (jetzt - beginn) / dauer)
      // weiches Ein- und Ausgleiten
      const weich = anteil < 0.5 ? 2 * anteil * anteil : 1 - (-2 * anteil + 2) ** 2 / 2
      box.scrollTop = start + weg * weich
      if (anteil < 1) requestAnimationFrame(schritt)
    }
    requestAnimationFrame(schritt)

    // Läuft die nächste Zeile an, bricht die alte Bewegung ab
    return () => { abgebrochen = true }
  }, [activeLine, autoScroll])

  // Holt das Transkript zu einem Link oder einer Video-ID.
  // Erst wird in der Davaigo-Mediathek nachgesehen (schnell und überall
  // verfügbar); nur wenn das Video dort fehlt, wird YouTube gefragt.
  async function fetchTranscript(input, art = 'video') {
    setLoading(true)
    setError('')
    setVideo(null)
    setSelected(null)
    setDeLines(null) // Übersetzung gehört zum alten Video
    setShowDe(false)

    try {
      // 1) Mediathek
      const id = videoIdAusEingabe(input)
      if (id && supabaseBereit) {
        const treffer = await holeVideoMitTranskript(id).catch(() => null)
        if (treffer?.transkript?.length) {
          setVideo({
            videoId: treffer.youtube_id,
            title: treffer.titel,
            lines: treffer.transkript.map((z) => ({
              text: z.text,
              start: z.start,
              end: z.start + (z.dauer ?? 0),
            })),
          })
          // Die deutsche Fassung liegt fertig in der Datenbank – dadurch
          // lässt sie sich ohne Wartezeit ein- und ausblenden.
          // Nur für Deutsch – englische Nutzer bekamen hier vorher die deutsche Fassung.
          if (sprache() === 'de' && treffer.transkript_de?.length === treffer.transkript.length) {
            setDeLines(treffer.transkript_de)
          } else {
            // Sonst die fertig abgelegte Übersetzung aus public/uebersetzungen (09.11.)
            const laenge = treffer.transkript.length
            ladeFertigeUebersetzung(treffer.youtube_id, laenge).then((z) => z && setDeLines(z))
          }
          return
        }
      }

      // 2) Sonst direkt bei YouTube nachfragen (klappt nur lokal)
      // Mit Anmeldung: Der Server zählt neue Videos (1 pro Woche gratis)
      const zugang = await loginKopf()
      const res = await fetch(
        API_URL +
          '/api/transcript?url=' + encodeURIComponent(input) +
          (art === 'musik' ? '&art=musik' : '') + '&sprache=' + sprache(),
        zugang.Authorization ? { headers: zugang } : undefined
      )
      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error(
          tr('Dieses Video ist noch nicht in der Davaigo-Mediathek und der Transkript-Dienst ist gerade nicht erreichbar.')
        )
      }
      if (!res.ok) throw new Error(data.error)
      setVideo(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ---------- Steuerung des YouTube-Players ----------

  /** Startet oder pausiert das Video. */
  function spielPause() {
    const p = playerRef.current
    if (!p) return
    // 1 = läuft (YouTube-Zustandscode)
    if (p.getPlayerState?.() === 1) p.pauseVideo()
    else p.playVideo()
  }

  /** Springt um einige Sekunden vor oder zurück. */
  function springe(sekunden) {
    const p = playerRef.current
    if (!p?.getCurrentTime) return
    p.seekTo(Math.max(0, p.getCurrentTime() + sekunden), true)
  }

  /** Ändert die Abspielgeschwindigkeit (langsamer = leichter zu verstehen). */
  function setzeTempo(wert) {
    playerRef.current?.setPlaybackRate?.(wert)
    setTempo(wert)
  }

  // Beim Lesen eines Videos die Navigation ausblenden
  useEffect(() => {
    const liest = view === 'lesen' && Boolean(video)
    document.body.classList.toggle('liest-video', liest)
    return () => document.body.classList.remove('liest-video')
  }, [view, video])

  // Aus der Mediathek öffnen. "art" unterscheidet Song von Video –
  // damit ein Song später auch wieder unter Songs auftaucht.
  function openVideo(videoId, art = 'video') {
    hakeAb('video') // Schritt im Tagesplan erledigt
    setView('lesen')
    setAktuelleArt(art)
    fetchTranscript('https://www.youtube.com/watch?v=' + videoId, art)
  }

  // Eingefügter YouTube-Link aus dem Videobereich
  function openUrl(link) {
    setView('lesen')
    fetchTranscript(link)
  }

  // Übersetzung ein-/ausschalten – beim ersten Mal werden alle Zeilen
  // auf einen Schlag vom Server übersetzt und dann wiederverwendet
  async function toggleUebersetzung() {
    if (showDe) return setShowDe(false)
    setShowDe(true)
    if (deLines || deLoading || !video) return
    setDeLoading(true)
    try {
      const res = await fetch(API_URL + '/api/translate-batch', {
        method: 'POST',
        headers: await kiKopf(),
        body: JSON.stringify({ lines: video.lines.map((l) => l.text) }),
      })
      const data = await res.json()
      if (res.ok) setDeLines(data.uebersetzungen)
    } catch {
      // klappt es nicht, bleibt einfach nur das Russische sichtbar
    } finally {
      setDeLoading(false)
    }
  }

  // Vokabeln von außen (z.B. aus einer Buchzusammenfassung) in den Trainer legen
  function addVocabWords(woerter) {
    // XP je wirklich neuem Wort (doppelte und schon bekannte zählen nicht)
    const neu = new Set(woerter.map((w) => w.wort.toLowerCase()).filter((k) => k && !vocab[k]))
    if (neu.size) {
      addXp(
        XP.WORT_NEU * neu.size,
        neu.size === 1 ? tr('Wort hinzugefügt') : tr('{0} Wörter hinzugefügt', neu.size)
      )
    }
    setVocab((v) => {
      const copy = { ...v }
      for (const w of woerter) {
        const key = w.wort.toLowerCase()
        if (!copy[key]) {
          copy[key] = { ...newEntry(w.uebersetzung, w.quelle), status: 'lernen' }
        }
      }
      return copy
    })
  }

  // Aktuelles Video mit Kategorie in der Mediathek speichern
  function saveVideo() {
    if (!video) return
    setSavedVideos((list) => [
      ...list.filter((v) => v.videoId !== video.videoId),
      {
        videoId: video.videoId,
        title: video.title,
        category: categoryInput.trim(),
        art: aktuelleArt,
        addedAt: Date.now(),
      },
    ])
  }

  const currentSaved = video && savedVideos.find((v) => v.videoId === video.videoId)

  // Wenn man ein Wort anklickt: Übersetzung holen und Wort als "neu" merken
  async function clickWord(rawWord, umfeld) {
    const word = cleanWord(rawWord)
    if (!word) return
    setSelected({ word, translation: '…', loading: true })

    // Wort merken, falls es noch nicht bekannt ist – mit dem Videotitel als Quelle,
    // damit man im Trainer sieht, aus welchem Video/Song das Wort stammt.
    // XP gibt es erst, wenn man das Wort mit "Lernen" wirklich aufnimmt
    // (sonst kassiert man still beim Antippen und sieht nur "+2").
    setVocab((v) => (v[word] ? v : { ...v, [word]: newEntry('', video?.title) }))

    try {
      const res = await fetch(uebersetzungsAdresse(API_URL, word, umfeld), { headers: await kiKopf() })
      const data = await res.json()
      // Einen Fehler NICHT in eine Übersetzung verwandeln. Bis zum
      // 23.08. stand hier `data.translation || '(keine Übersetzung
      // gefunden)'` – und dieser Satz wurde als Bedeutung GESPEICHERT.
      // Wörter landeten mit einer Fehlermeldung als Lösung im Trainer
      // und wurden dort irgendwann so abgefragt.
      if (!res.ok || !data.translation) {
        throw new Error(data.error || tr('Der Übersetzungsdienst antwortet nicht.'))
      }
      const translation = data.translation
      setSelected({ word, translation, fehler: '', loading: false })
      setVocab((v) => ({
        ...v,
        [word]: { ...(v[word] || newEntry('', video?.title)), translation },
      }))
    } catch (f) {
      // Das Wort bleibt gemerkt – aber ohne erfundene Bedeutung. Man
      // kann sie im Trainer selbst nachtragen, und beim nächsten
      // Antippen wird es erneut versucht.
      setSelected({ word, translation: '', fehler: f.message, loading: false })
    }
  }

  // "Lernen" oder "Gewusst" geklickt: Status setzen, XP feiern,
  // Erfolgs-Animation zeigen und die Karte danach sanft ausblenden
  function setStatus(word, status) {
    if (cardExit) return // Animation läuft gerade schon
    const entry = vocab[word]
    // XP gibt es nur, wenn sich der Status wirklich ändert (kein Doppelt-Kassieren)
    let earned = 0
    if (entry && entry.status !== status) {
      setVocab((v) => ({ ...v, [word]: { ...v[word], status } }))
      earned =
        status === 'gewusst' ? XP.SCHON_GEWUSST : entry.status === 'neu' ? XP.WORT_NEU : XP.SAMMELN
      addXp(earned)
    }
    setCardExit({ status, earned })
    setTimeout(() => {
      setSelected(null)
      setCardExit(null)
    }, 1100) // so lange dauert die Erfolgs-Animation
  }

  // Klick auf die Zeit einer Zeile: Video an diese Stelle springen lassen
  function jumpTo(seconds) {
    playerRef.current?.seekTo?.(seconds, true)
  }

  const gelernt = Object.values(vocab).filter((v) => v.status === 'gewusst').length

  // ---------- Meilensteine ----------
  // Nach jeder Änderung an den Zählern nachsehen, ob eine Stufe
  // dazugekommen ist. Beim allerersten Mal wird nur gleichgesetzt,
  // ohne XP – sonst regnet es beim Update XP für alte Arbeit.
  const [neueAbzeichen, setNeueAbzeichen] = useState([])
  const meilensteinAbgleichRef = useRef(null)
  const [startGeschenk, setStartGeschenk] = useState(false)
  // Einrichtungs-Animation: einmal direkt nach der Registrierung (Konto
  // jünger als ein Tag), zum Ansehen jederzeit mit ?einrichtung (12.11.).
  const [einrichtung, setEinrichtung] = useState(() => {
    try { return new URLSearchParams(window.location.search).has('einrichtung') } catch { return false }
  })
  const einrichtungRef = useRef(false)
  useEffect(() => {
    if (!nutzer) return
    try {
      const k = 'einrichtung:' + nutzer.id
      if (localStorage.getItem(k)) return
      localStorage.setItem(k, 'ja')
      if (Date.now() - new Date(nutzer.created_at).getTime() < 86400000) {
        einrichtungRef.current = true
        setEinrichtung(true)
      }
    } catch { /* ohne Speicher keine Animation */ }
  }, [nutzer])
  function einrichtungZu(trainer) {
    einrichtungRef.current = true
    setEinrichtung(false)
    setStartGeschenk(false)
    try {
      const u = new URL(window.location.href)
      if (u.searchParams.has('einrichtung')) { u.searchParams.delete('einrichtung'); window.history.replaceState(null, '', u) }
    } catch { /* egal */ }
    if (trainer) setView('trainer')
  }
  useEffect(() => {
    const werte = {
      // Geschenkte Pakete (Grund-/Startpaket) zählen nicht: Sonst kam gleich
      // nach dem Anmelden „50 Wörter geschafft“ für Wörter, die man nie gelernt hat.
      woerter: Object.values(vocab).filter((w) => !GESCHENKT.has(w?.source)).length,
      texte: Object.values(texte).reduce((n, x) => n + (x.gelesen ?? 0), 0),
      saetze: Object.values(saetze).filter((s) => !GESCHENKT.has(s?.thema)).length,
      lektionen: Object.keys(lessonProgress).filter(
        (id) => lessonProgress[id]?.fertig && !id.startsWith('station-')
      ).length,
      streak: progress.streak ?? 0,
      wiederholungen: summeWiederholungen(),
    }
    // Angemeldet: erst nach dem Abgleich prüfen. Was beim ersten Prüfen
    // danach schon erreicht ist, kam vom Konto (anderes Gerät, frühere
    // Sitzung) und wird still eingetragen – sonst gab es nach jedem
    // Anmelden alle Meldungen samt XP noch einmal (09.11.).
    if (nutzer && syncStatus !== 'fertig') return
    if (meilensteinAbgleichRef.current !== (nutzer?.id ?? 'gast')) {
      meilensteinAbgleichRef.current = nutzer?.id ?? 'gast'
      meilensteineStillSetzen(werte)
      return
    }
    if (meilensteineGleichsetzen(werte)) return
    const neu = neueMeilensteine(werte)
    if (neu.length) {
      addXp(MEILENSTEIN_XP * neu.length)
      setNeueAbzeichen(neu)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vocab, texte, saetze, lessonProgress, progress.streak, nutzer, syncStatus])
  // Wie viele Vokabeln sind gerade zum Üben fällig? (für das rote Punkt-Badge im Tab)
  // Gratis: pausierte Vokabeln (über 500) zählen nicht als fällig (09.11.)
  const pausiertApp = pausierteSchluessel(vocab, MAX_VOKABELN, appPremium, 'addedAt')
  const faellig = Object.entries(vocab).filter(([k, v]) => !pausiertApp.has(k) && isDue(withSrsDefaults(v))).length

  // Level-Fortschritt für die Anzeige oben berechnen
  const level = levelFromXp(progress.xp)
  const levelStartXp = xpForLevel(level)
  const nextLevelXp = xpForLevel(level + 1)
  // Alle Kategorien, die schon vergeben wurden – für die Schnellauswahl
  const vorhandeneKategorien = [
    ...new Set([...ladeListen(), ...savedVideos.map((v) => v.category).filter(Boolean)]),
  ].sort()

  const levelPercent = Math.round(
    ((progress.xp - levelStartXp) / (nextLevelXp - levelStartXp)) * 100
  )

  // ---------- Zugang: ohne Konto geht es nicht weiter ----------
  // ---------- Der Feed: Vollbild, ohne Tab-Leiste ----------
  // Eine Karte je Bildschirm – da störte eine Menüleiste am unteren
  // Rand beim Wischen und würde die Karte beschneiden.
  if (view === 'feed') {
    return (
      <Feed
        onZurueck={() => setView('start')}
        onAddVocab={addVocabWords}
        vocab={vocab}
        addXp={addXp}
      />
    )
  }

  // ---------- Der Sprach-Trainer: eigene Seite ohne Tab-Leiste
  if (sprechenOffen) {
    return (
      <Sprechen
        addXp={addXp}
        onAddVocab={addVocabWords}
        onZurueck={() => {
          window.history.pushState({}, '', '/')
          setSprechenOffen(false)
        }}
      />
    )
  }

  if (dankeOffen) {
    return (
      <PremiumDanke
        onWeiter={() => {
          setDankeOffen(false)
          window.history.replaceState(null, '', window.location.pathname)
          window.dispatchEvent(new CustomEvent('premium-neu'))
        }}
      />
    )
  }

  // ---------- Die Kasse: eine eigene Seite, keine Karte in den
  // Einstellungen. Wer bezahlt, soll sehen, was er kauft – und keine
  // Tab-Leiste danebenhaben, die zum Wegklicken einlädt.
  if (kasseOffen) {
    // In der App muss der Kauf ueber Apple bzw. Google laufen, beide
    // verlangen das fuer digitale Inhalte. Im Browser bleibt Stripe.
    const Kasse = kaufMoeglich() ? KaufNativ : Bezahlen
    return (
      <Kasse
        onAbbrechen={() => {
          setKasseOffen(false)
          if (window.location.pathname.replace(/^\/+|\/+$/g, '') === 'kasse') {
            // Über einen Premium-Knopf gekommen: zurück dorthin. Direkt aufgerufen: zur Startseite.
            if (window.history.state?.kasse) window.history.back()
            else window.history.replaceState({}, '', '/')
          }
        }}
        onFertig={() => {
          setKasseOffen(false)
          if (window.location.pathname.replace(/^\/+|\/+$/g, '') === 'kasse') window.history.replaceState({}, '', '/')
          // Die Anzeige haengt an "abos": nach dem Kauf neu fragen.
          window.dispatchEvent(new CustomEvent('premium-neu'))
        }}
      />
    )
  }

  // Pflichtseiten zuerst: Impressum, Datenschutz und AGB müssen auch
  // ohne Konto erreichbar sein – sonst stünden sie hinter der
  // Anmeldung, und genau das wäre der Fehler.
  if (rechtSeite) {
    const zu = () => setRechtSeite(null)
    if (rechtSeite === 'impressum') return <Impressum onZurueck={zu} />
    if (rechtSeite === 'datenschutz') return <Datenschutz onZurueck={zu} />
    if (rechtSeite === 'agb') return <AGB onZurueck={zu} />
    if (rechtSeite === 'konto-loeschen') return <KontoLoeschen onZurueck={zu} />
  }

  // "?willkommen" in der Adresse zeigt die Startseite auch ohne
  // eingerichtete Datenbank – zum Ansehen und Gestalten.
  const willkommenErzwungen = new URLSearchParams(window.location.search).has('willkommen')
  if ((supabaseBereit && !nutzer) || willkommenErzwungen) {
    // Solange noch geprüft wird, ob eine Sitzung besteht: nichts zeigen,
    // damit die Willkommensseite nicht kurz aufblitzt
    if (nutzerLaedt) return <div className="app app-laedt" />

    return (
      <>
        <Willkommen
          onRecht={setRechtSeite}
          onStarten={() => {
            setLoginStart('registrieren')
            setLoginOffen(true)
          }}
          onAnmelden={() => { setLoginStart('anmelden'); setLoginOffen(true) }}
        />
        {/* key sorgt dafür, dass der Dialog bei jedem Öffnen frisch
            startet – sonst bliebe der zuletzt gewählte Modus stehen */}
        {loginOffen && (
          <Login
            key={loginStart}
            startModus={loginStart}
            onSchliessen={() => setLoginOffen(false)}
          />
        )}
      </>
    )
  }


  return (
    <div className="app">
      {/* Nach dem Klick in der Passwort-Mail: erst neues Passwort, dann App.
          Der Link meldet den Nutzer bereits an, deshalb steht das Fenster
          hier und nicht bei der Willkommensseite. */}
      {passwortNeuSetzen && <NeuesPasswort onFertig={passwortGesetzt} />}

      {xpMeldung && (
        <span key={xpMeldung.key} className="spiel-xp" onAnimationEnd={() => setXpMeldung(null)}>
          {tr('+{0} XP · {1}', xpMeldung.punkte, xpMeldung.text)}
        </span>
      )}

      {/* Meldung, wenn ein Abzeichen dazugekommen ist */}
      <MeilensteinMeldung liste={neueAbzeichen} onFertig={() => setNeueAbzeichen([])} />
      {einrichtung && (
        <Einrichtung
          app="Davaigo"
          woerter={STARTGESCHENK_WOERTER}
          saetze={GRUNDPAKET_SAETZE.length}
          lektionen={LEKTIONEN.length}
          onFertig={() => einrichtungZu(false)}
          onTrainer={() => einrichtungZu(true)}
        />
      )}
      {startGeschenk && !einrichtung && (
        <StartGeschenk
          woerter={STARTGESCHENK_WOERTER.length}
          onZu={() => setStartGeschenk(false)}
          onAnsehen={() => { setStartGeschenk(false); setView('trainer') }}
        />
      )}

      {/* Feier-Einblendung beim Level-Aufstieg */}
      {levelUp && (
        <div className="levelup-overlay" onClick={() => setLevelUp(null)}>
          <div className={'levelup-card' + (levelUp >= 100 ? ' levelup-sol' : '')}>
            <div className="levelup-emoji"><LevelEmblem level={levelUp} groesse={levelUp >= 100 ? 150 : 96} /></div>
            <h2>{tr('Level {0} erreicht!', levelUp)}</h2>
            <p>{tr('Du bist jetzt: {0}', levelName(levelUp))}</p>
          </div>
        </div>
      )}

      <header className="topbar">
        {/* Klick aufs Logo führt immer zum Start */}
        <button className="logo" onClick={() => setView('start')}>
          <Logo />
          {APP_NAME}
        </button>
        <nav className="tabs">
          <button
            className={'tab ' + (view === 'start' ? 'tab-active' : '')}
            onClick={() => setView('start')}
          >
            <span className="tab-icon">{ICONS.start}<NavBild art="start" /></span>
            <span className="tab-label">{tr('Start')}</span>
          </button>
          <button
            className={'tab ' + (view === 'lektionen' ? 'tab-active' : '')}
            onClick={() => setView('lektionen')}
          >
            <span className="tab-icon">{ICONS.lektionen}<NavBild art="lektionen" /></span>
            <span className="tab-label">{tr('Lektionen')}</span>
          </button>
          <button
            className={'tab ' + (view === 'trainer' ? 'tab-active' : '')}
            onClick={() => setView('trainer')}
          >
            <span className="tab-icon">
              {ICONS.trainer}<NavBild art="trainer" />
              {faellig > 0 && <span className="due-badge">{faellig}</span>}
            </span>
            <span className="tab-label">{tr('Trainer')}</span>
          </button>
          <button
            className={'tab ' + (view === 'videos' || view === 'lesen' ? 'tab-active' : '')}
            onClick={() => setView('videos')}
          >
            <span className="tab-icon">{ICONS.bibliothek}<NavBild art="youtube" /></span>
            <span className="tab-label">{tr('Mediathek')}</span>
          </button>
          <button
            className={'tab ' + (view === 'mehr' ? 'tab-active' : '')}
            onClick={() => setView('mehr')}
          >
            <span className="tab-icon">{ICONS.mehr}<NavBild art="profil" /></span>
            <span className="tab-label">{tr('Mehr')}</span>
          </button>
        </nav>
        <div className="stats">
          {progress.streak > 0 && (
            <span className="streak" title={tr('{0} Tage in Folge gelernt', progress.streak)}>
              <Flamme groesse={22} /> {progress.streak}
            </span>
          )}
          <div
            className="level-pill"
            title={tr('{0} Wörter · {1} gewusst · {2}', Object.keys(vocab).length, gelernt, levelName(level))}
            role="img"
            aria-label={tr('Level {0} – noch {1} XP bis Level {2}', level, nextLevelXp - progress.xp, level + 1)}
          >
            {/* key={xp} lässt den Kreis bei jedem XP-Gewinn kurz hüpfen */}
            <span className="level-circle" key={progress.xp}>
              {level}
            </span>
            <div className="xp-bar">
              <div className="xp-bar-fill" style={{ width: levelPercent + '%' }} />
            </div>
            {/* Ausdruecklich als Level-Fortschritt benannt – sonst
                sieht es neben den Tages-XP wie ein zweites, konkurrierendes
                Punktesystem aus. */}
            <span className="xp-text">
              {tr('Noch {0} XP bis Level {1}', nextLevelXp - progress.xp, level + 1)}
            </span>
            {/* Auf dem Handy ist fuer den Satz kein Platz. Statt gar
                nichts – ein leerer grauer Balken sagt nichts aus –
                steht dort die Zahl, um die es geht. */}
            <span className="xp-text-kurz">{nextLevelXp - progress.xp} XP</span>
          </div>
        </div>
      </header>

      {view === 'start' && (
        <main>
          {nutzer && syncStatus !== 'fertig' && (
            <div className={'sync-leiste' + (syncStatus.startsWith('fehler') ? ' sync-fehler' : '')} role="status">
              {syncStatus.startsWith('fehler') ? (
                <>⚠️ {tr('Dein Lernstand konnte nicht abgeglichen werden.')} <button type="button" onClick={abgleichNochmal}>{tr('Erneut versuchen')}</button></>
              ) : (
                <>⏳ {tr('Dein Lernstand wird abgeglichen …')}</>
              )}
            </div>
          )}
          <Home
            progress={progress}
            settings={settings}
            counts={{
              faellig,
              woerter: Object.keys(vocab).length,
              // Gelesene Texte, nicht angelegte: Die Meilenstein-Reihe
              // heisst "Texte gelesen", und ein Text, der nur herumliegt,
              // hat niemandem etwas beigebracht.
              texte: Object.values(texte).reduce((n, t) => n + (t.gelesen ?? 0), 0),
              saetze: Object.keys(saetze).length,
              texteAnzahl: Object.keys(texte).length,
              videos: savedVideos.length,
            }}
            nextLesson={naechsteLektion(lessonProgress)}
            lessonProgress={lessonProgress}
            onNavigate={setView}
            nutzerId={nutzer?.id}
            onAddVocab={addVocabWords}
            vocab={vocab}
          />
        </main>
      )}

      {view === 'trainer' && (
        <main>
          <Trainer
            vocab={vocab}
            setVocab={setVocab}
            addXp={addXp}
            bausteinStand={bausteinStand}
            setBausteinStand={setBausteinStand}
            lessonProgress={lessonProgress}
            onNavigate={setView}
            saetze={saetze}
            setSaetze={setSaetze}
            texte={texte}
            setTexte={setTexte}
            onAddVocab={addVocabWords}
          />
        </main>
      )}

      {view === 'videos' && (
        <main>
          <Library
            savedVideos={savedVideos}
            setSavedVideos={setSavedVideos}
            onOpenVideo={openVideo}
            onLoadUrl={openUrl}
            onAddVocab={addVocabWords}
            vocab={vocab}
          />
        </main>
      )}

      {/* Der Leitfaden: eine eigene Seite, erreichbar vom Start */}
      {view === 'leitfaden' && (
        <main>
          <Leitfaden onNavigate={setView} onZurueck={() => setView('start')} onRundgang={starteRundgang} />
        </main>
      )}

      {view === 'lektionen' && (
        <main>
          <Lessons
            lessonProgress={lessonProgress}
            addXp={addXp}
            onLessonComplete={lektionGeschafft}
            onKasse={() => setKasseOffen(true)}
          />
        </main>
      )}

      {/* Sprechen: der KI-Tutor als Chat. Erreichbar ueber den
          Reiter im Trainer (dort noch ausgeblendet) – die Ansicht
          steht hier, damit sie den ganzen Bildschirm bekommt. */}
      {view === 'gespraech' && (
        <main>
          <Gespraech
            onZurueck={() => setView('start')}
            onAddVocab={addVocabWords}
            vocab={vocab}
          />
        </main>
      )}

      {view === 'mehr' && (
        <main>
          <Settings
            onNavigate={setView}
            onRecht={setRechtSeite}
            onLeitfaden={() => setView('leitfaden')}
            onRundgang={starteRundgang}
            onKasse={() => setKasseOffen(true)}
            addXp={addXp}
            progress={progress}
            settings={settings}
            setSettings={setSettings}
            counts={{
              woerter: Object.keys(vocab).length,
              gelernt,
              videos: savedVideos.length,
            }}
            nutzer={nutzer}
            syncStatus={syncStatus}
            onLoginOeffnen={() => setLoginOffen(true)}
          />
        </main>
      )}

      {view === 'lesen' && (
      <main>
        <button className="zurueck-knopf" onClick={() => setView('videos')}>
          {tr('← Zu den Videos')}
        </button>

        {/* Statt "Lade Transkript…" ein Geruest, das schon so
            aussieht wie das, was gleich kommt. Wartezeit fuehlt
            sich kuerzer an, wenn man sieht, WAS geladen wird. */}
        {loading && (
          <div className="lade-geruest" aria-label={tr('Video wird geladen')} role="status">
            <div className="lade-buehne">
              <div className="lade-video schimmer" />
              <div className="lade-titel schimmer" />
              <div className="lade-knoepfe">
                <span className="schimmer" />
                <span className="schimmer" />
                <span className="schimmer" />
              </div>
              {/* Dieselbe Welle wie in der fertigen Ansicht – so
                  springt beim Umschalten nichts */}
              <svg className="buehnen-welle" viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 44 C 180 88, 340 4, 560 30 C 760 54, 900 92, 1200 46 L1200 90 L0 90 Z" />
              </svg>
            </div>
            <div className="lade-zeilen">
              {[92, 64, 84, 72, 88, 56].map((breite, i) => (
                <div
                  key={i}
                  className="lade-zeile schimmer"
                  style={{ width: breite + '%', animationDelay: i * 0.09 + 's' }}
                />
              ))}
            </div>
            <p className="lade-text">{tr('Untertitel werden geholt …')}</p>
          </div>
        )}
        {error && <p className="error">{error}</p>}
        {!video && !loading && !error && (
          <div className="empty-reader">
            <h1>
              {tr('Kein Video')} <span className="accent">{tr('geladen')}</span>
            </h1>
            <p className="intro">
              {tr('Such dir im Videobereich ein Video aus oder füge dort einen YouTube-Link ein.')}
            </p>
            <button onClick={() => setView('videos')}>{tr('Zu den Videos')}</button>
          </div>
        )}

        {video && (
          <div className="reader">
            <div className="video-pane">
              {/* Oranger Verlauf mit Wellenkante: hebt Video und Titel
                  vom Lesetext ab, ohne eine harte Linie zu ziehen */}
              <div className="video-buehne">
                <svg className="buehnen-welle" viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 44 C 180 88, 340 4, 560 30 C 760 54, 900 92, 1200 46 L1200 90 L0 90 Z" />
                </svg>
              </div>
              <div className="player-wrap">
                <div id="yt-player" />
              </div>

              {/* Warnen, wenn YouTube nur automatische Untertitel hat.
                  Bei Musik zerfallen die in Bruchstuecke – dann ist
                  ein anderes Video die bessere Wahl. */}
              {video.qualitaet?.stufe === 'schlecht' && (
                <p className="text-warnung">
                  {tr('⚠️ Dieser Text stammt aus YouTubes automatischer Spracherkennung und ist bei Musik oft zerstückelt. Such lieber eine Fassung mit „Letra" im Titel – die hat meist einen sauber getippten Text.')}
                </p>
              )}

              {/* Kurz einblenden, damit klar ist, warum das Video
                  nicht bei null anfaengt */}
              {weiterAb !== null && (
                <p className="weiter-hinweis">
                  {tr('⏱ Weiter bei {0}:{1}', Math.floor(weiterAb / 60), String(Math.round(weiterAb % 60)).padStart(2, '0'))}
                  <button className="weiter-neu" onClick={() => { playerRef.current?.seekTo?.(0, true); setWeiterAb(null) }}>
                    {tr('Von vorn')}
                  </button>
                </p>
              )}
              <div className="video-kopf">
                <h2 className="video-titel">{video.title}</h2>
                <div className="video-aktionen">
                  <button
                    className={'video-aktion' + (showDe ? ' aktion-an' : '')}
                    onClick={toggleUebersetzung}
                    disabled={deLoading}
                  >
                    {deLoading ? tr('Übersetze …') : tr('Übersetzung')}
                  </button>
                  <button
                    className="video-aktion"
                    onClick={() => { setGenOpen(!genOpen); setSaveOpen(false) }}
                  >
                    {tr('Vokabeln sammeln')}
                  </button>
                  <button
                    className={'video-aktion' + (currentSaved ? ' aktion-fertig' : '')}
                    onClick={() => { setSaveOpen(!saveOpen); setGenOpen(false) }}
                  >
                    {currentSaved ? tr('Gemerkt') : tr('Merken')}
                  </button>
                </div>
              </div>


              {currentSaved?.category && (
                <p className="saved-note">
                  <span className="category-badge">{currentSaved.category}</span>
                </p>
              )}

              {selected && (
                <div className={'word-card' + (cardExit ? ' word-card-exit' : '')}>
                  {cardExit ? (
                    /* Erfolgs-Ansicht: Häkchen/Stern + XP, dann verschwindet die Karte */
                    <div className="card-success">
                      <span className="success-icon">
                        {cardExit.status === 'gewusst' ? '⭐' : '✓'}
                      </span>
                      <div>
                        <div className="success-text">
                          {cardExit.status === 'gewusst'
                            ? tr('Stark, das kannst du schon!')
                            : tr('Gespeichert – ab in den Trainer!')}
                        </div>
                        {cardExit.earned > 0 && (
                          <div className="success-xp">+{cardExit.earned} XP</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="word-es">{selected.word}</div>
                      {selected.fehler ? (
                        <div className="word-fehler">
                          {selected.fehler}
                          <small>
                            {tr('Das Wort ist gemerkt – die Bedeutung kannst du im Trainer nachtragen.')}
                          </small>
                        </div>
                      ) : (
                        <div className="word-de">{selected.translation}</div>
                      )}
                      <div className="word-actions">
                        <button onClick={() => setStatus(selected.word, 'lernen')}>
                          {tr('Lernen')}
                        </button>
                        <button
                          className="btn-right"
                          onClick={() => setStatus(selected.word, 'gewusst')}
                        >
                          {tr('Gewusst ✓')}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="text-pane" ref={textPaneRef}>
              {video.lines.map((line, i) => (
                <p
                  key={i}
                  ref={(el) => (lineRefs.current[i] = el)}
                  className={'line ' + (i === activeLine ? 'active' : '')}
                >
                  <span className="time" onClick={() => jumpTo(line.start)}>
                    {Math.floor(line.start / 60)}:{String(Math.floor(line.start % 60)).padStart(2, '0')}
                  </span>
                  {line.text.split(/\s+/).map((w, j) => {
                    const status = vocab[cleanWord(w)]?.status
                    // Das gerade angeklickte Wort bekommt eine kleine Plopp-Animation
                    const isActive = selected && cleanWord(w) === selected.word
                    return (
                      <span
                        key={j}
                        className={'word ' + (status || '') + (isActive ? ' word-active' : '')}
                        onClick={() => clickWord(w, line.text)}
                      >
                        {w}{' '}
                      </span>
                    )
                  })}
                  {/* Die deutsche Übersetzung der Zeile (per Klick zuschaltbar) */}
                  {showDe && deLines?.[i] && (
                    <span className="line-de">{deLines[i]}</span>
                  )}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* ---------- Fußzeile: nur Abspielen und Tempo ---------- */}
        {video && (
          <div className="reader-fuss">
            <button
              className="fuss-spiel"
              onClick={spielPause}
              title={laeuft ? tr('Pause') : tr('Abspielen')}
              aria-label={laeuft ? tr('Pause') : tr('Abspielen')}
            >
              {/* Gezeichnete Symbole statt Emoji – die sehen auf jedem
                  Gerät gleich aus und lassen sich einfärben */}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {laeuft ? (
                  <>
                    <rect x="7" y="5" width="3.6" height="14" rx="1.4" />
                    <rect x="13.4" y="5" width="3.6" height="14" rx="1.4" />
                  </>
                ) : (
                  <path d="M8.5 5.6a1 1 0 0 1 1.52-.85l8.2 5.15a1.3 1.3 0 0 1 0 2.2l-8.2 5.15A1 1 0 0 1 8.5 16.4z" />
                )}
              </svg>
            </button>

            {/* Tempo in kleinen Schritten – langsamer hilft beim Verstehen */}
            <div className="tempo-steller">
              <button
                className="tempo-schritt"
                onClick={() => setzeTempo(Math.max(0.5, Math.round((tempo - 0.25) * 100) / 100))}
                disabled={tempo <= 0.5}
                title={tr('Langsamer')}
              >
                −
              </button>
              <span className="tempo-wert">{tempo}×</span>
              <button
                className="tempo-schritt"
                onClick={() => setzeTempo(Math.min(2, Math.round((tempo + 0.25) * 100) / 100))}
                disabled={tempo >= 2}
                title={tr('Schneller')}
              >
                +
              </button>
            </div>

            <button
              className={'fuss-knopf' + (autoScroll ? ' fuss-an' : '')}
              onClick={() => setAutoScroll(!autoScroll)}
              title={tr('Text läuft mit dem Video mit')}
            >
              {tr('Mitlaufen')}
            </button>
          </div>
        )}

        {/* Ein- und ausklappbare Bereiche zu den Fußzeilen-Aktionen */}
        {video && (
          <>

            {saveOpen && (
              <div className="fab-panel">
                <div className="fab-panel-head">
                  <b>{currentSaved ? tr('In deiner Mediathek ✓') : tr('Video speichern')}</b>
                  <button className="btn-plain" onClick={() => setSaveOpen(false)}>
                    ✕
                  </button>
                </div>
                {currentSaved ? (
                  <p className="row-hint">
                    {tr('Dieses Video ist gespeichert{0}.', currentSaved.category ? tr(' – Kategorie „{0}“', currentSaved.category) : '')}
                  </p>
                ) : (
                  <div className="save-form">
                    {/* Schon benutzte Kategorien zum Antippen – schneller
                        als tippen und hält die Namen einheitlich */}
                    {vorhandeneKategorien.length > 0 && (
                      <div className="kategorie-wahl">
                        {vorhandeneKategorien.map((c) => (
                          <button
                            key={c}
                            type="button"
                            className={
                              'kategorie-chip' + (categoryInput === c ? ' kategorie-aktiv' : '')
                            }
                            onClick={() => setCategoryInput(categoryInput === c ? '' : c)}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                    <input
                      type="text"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      placeholder={
                        vorhandeneKategorien.length
                          ? tr('Oder neue Kategorie eingeben…')
                          : tr('Kategorie, z.B. Musik')
                      }
                    />
                    <button
                      className="btn"
                      onClick={() => {
                        saveVideo()
                        setSaveOpen(false)
                      }}
                    >
                      {tr('Speichern')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {genOpen && (
              <div className="fab-panel">
                <div className="fab-panel-head">
                  <b>{tr('Vokabelgenerator')}</b>
                  <button className="btn-plain" onClick={() => setGenOpen(false)}>
                    ✕
                  </button>
                </div>
                <VocabGenerator video={video} vocab={vocab} setVocab={setVocab} addXp={addXp} />
              </div>
            )}
          </>
        )}
      </main>
      )}

      {loginOffen && <Login onSchliessen={() => setLoginOffen(false)} />}

      {/* Bereichs-Einführung bzw. Rundgang – liegt über allem */}
      {intro && (
        <BereichsIntro
          bereich={intro}
          rundgang={
            rundgangNr !== null
              ? { nr: rundgangNr + 1, von: RUNDGANG_REIHE.length }
              : null
          }
          onWeiter={rundgangWeiter}
          onFertig={rundgangNr !== null ? rundgangEnde : () => setIntro(null)}
          onRundgang={rundgangNr === null && intro === 'start' ? starteRundgang : undefined}
        />
      )}
    </div>
  )
}
