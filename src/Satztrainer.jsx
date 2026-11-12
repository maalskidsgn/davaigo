import SpielBild from './SpielBild.jsx'
import UebTabs, { useUebTab } from './UebTabs.jsx'
import { leiterName } from './srs.js'
import GratisHinweis, { TrainerGrenze } from './GratisHinweis.jsx'
import { pausierteSchluessel, MAX_SAETZE } from './limits.js'
import { usePremium } from './premium.js'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Pokal } from './Games.jsx'
import { Sockel } from './StartInseln.jsx'
import { review, isDue, formatDue, withSrsDefaults, vorschau, LEVEL_LABELS, wiederholReihenfolge } from './srs.js'
import { XP } from './gamification.js'
import { merkeEinheit } from './aktivitaet.js'
import { merkeGelernt } from './lernkurve.js'
import SatzGenerator from './SatzGenerator.jsx'
import { IconKarten, IconAuswahl, IconListe, IconGemischt, IconSchreiben, IconLektion } from './icons.jsx'
import { tr, sprache } from './sprache.js'
import { erfolgston, fehlerton } from './erfolgston.js'

/** Wie viele Sätze stecken in einer Runde? */
const RUNDE = 10

/** Satzpaare: so viele Paare auf einmal – mehr wird auf dem Handy unübersichtlich */
const PAARE = 4 // 12.11.2026: 4 statt 6 – passt im Spiel-Look auf einen Blick

// Nur zwei Übungsarten – Schreiben und Gemischt gibt es hier
// bewusst nicht: Einen ganzen Satz fehlerfrei abzutippen ist
// Fleißarbeit, kein Lernfortschritt.
// Auswahl im 3D-Toon-Stil wie bei den Vokabeln (10.11.2026)
const SATZ_BILD = {"karten": "karten", "auswahl": "auswahl", "bauen": "schreiben", "luecke": "galgen", "paare": "paare"}
const SATZ_HINWEIS = {"karten": "Klassisch wie Karteikarten", "auswahl": "Schnell zum Aufwärmen", "bauen": "Trainiert den Satzbau", "luecke": "Grammatik im Zusammenhang", "paare": "Spielerisch zum Abschluss"}

// Diese zwei stehen im Tab „Spielen“, der Rest unter „Üben“ (12.11.2026)
const SATZ_SPIELE = ['bauen', 'paare']

const ARTEN = [
  {
    id: 'karten',
    titel: tr('Karten'),
    icon: IconKarten,
    text: tr('Satz lesen, Übersetzung aufdecken, selbst einschätzen'),
  },
  {
    id: 'auswahl',
    titel: tr('Auswahl'),
    icon: IconAuswahl,
    text: tr('Vier Übersetzungen – welche passt?'),
  },
  {
    id: 'bauen',
    titel: tr('Satz bauen'),
    icon: IconSchreiben,
    text: tr('Deutscher Satz oben – die russischen Wörter in die richtige Reihenfolge tippen'),
  },
  {
    id: 'luecke',
    titel: tr('Lückensatz'),
    icon: IconLektion,
    text: tr('Ein Wort fehlt – welches gehört in die Lücke?'),
  },
  {
    id: 'paare',
    titel: tr('Satzpaare'),
    icon: IconGemischt,
    text: tr('{0} Sätze und ihre Übersetzungen richtig verbinden', PAARE),
  },
]

/** Vier falsche Übersetzungen dazumischen. */
function baueAuswahl(richtig, alle, anzahl = 4) {
  const andere = [...new Set(alle.map((e) => e.translation).filter((t) => t && t !== richtig))]
  const gemischt = andere.sort(() => Math.random() - 0.5).slice(0, anzahl - 1)
  return [richtig, ...gemischt].sort(() => Math.random() - 0.5)
}

/**
 * Der Satz-Karteikasten.
 *
 * Derselbe Spaced-Repetition-Kern wie beim Vokabeltrainer (srs.js) –
 * nur steht auf der Karte ein ganzer Satz. Memory passt dafür nicht;
 * statt Wortpaaren gibt es Satzpaare mit 6 Sätzen untereinander (SatzPaare).
 */
export default function Satztrainer({ kopf, saetze, setSaetze, addXp }) {
  // Gratis: nur die ersten MAX_SAETZE im Training (09.11.)
  const { premium: stPremium } = usePremium()
  const pausiert = pausierteSchluessel(saetze, MAX_SAETZE, stPremium, 'erstelltAm')
  const [ansicht, setAnsicht] = useState('start') // 'start' | 'liste'
  const [artWahl, setArtWahl] = useState(false)
  const [uebTab, setUebTab] = useUebTab() // 'ueben' | 'spielen'
  const [art, setArt] = useState('karten')
  const [queue, setQueue] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [gewaehlt, setGewaehlt] = useState(null)
  const [result, setResult] = useState({ richtig: 0, falsch: 0 })
  const [xpPopup, setXpPopup] = useState(null)
  const [exiting, setExiting] = useState(null)
  const [filter, setFilter] = useState('faellig')

  // Alle Sätze als Liste, fehlende SRS-Felder ergänzt
  const entries = useMemo(
    () =>
      Object.entries(saetze).map(([key, e]) => ({
        key,
        satz: e.anzeige ?? key,
        ...withSrsDefaults(e),
      })),
    [saetze]
  )

  const faellig = entries.filter((e) => !pausiert.has(e.key) && isDue(e))
  const gewusst = entries.filter((e) => e.status === 'gewusst')

  const gefiltert = entries
    .filter((e) => {
      if (filter === 'alle') return true
      if (filter === 'faellig') return isDue(e)
      if (filter === 'gewusst') return e.status === 'gewusst'
      return true
    })
    .sort((a, b) => (a.due ?? 0) - (b.due ?? 0))

  /** Eine Runde starten – die am längsten fälligen zuerst. */
  function starten(gewaehlteArt) {
    if (gewaehlteArt === 'paare') {
      // Fällige zuerst, mit den übrigen auf sechs auffüllen
      const mitText = entries.filter((e) => e.translation && !pausiert.has(e.key))
      const sortiert = [
        ...mitText.filter(isDue).sort(wiederholReihenfolge),
        ...mitText.filter((e) => !isDue(e)).sort(() => Math.random() - 0.5),
      ]
      setArt('paare')
      setQueue(sortiert.slice(0, PAARE).map((e) => e.key))
      setResult({ richtig: 0, falsch: 0 })
      setArtWahl(false)
      return
    }
    const liste = [...faellig].sort(wiederholReihenfolge).slice(0, RUNDE)
    setArt(gewaehlteArt)
    setQueue(liste.map((e) => e.key))
    setRevealed(false)
    setGewaehlt(null)
    setResult({ richtig: 0, falsch: 0 })
    setArtWahl(false)
  }

  /**
   * Eine Karte bewerten und zur nächsten gehen.
   * @param {string} bewertung – 'nochmal' | 'schwer' | 'gut' | 'einfach'
   */
  function antworten(bewertung) {
    if (exiting) return
    const key = queue[0]
    const richtig = bewertung !== 'nochmal'
    merkeGelernt('saetze') // für die Lernkurve
    if (richtig) erfolgston()
    else fehlerton()

    setExiting(richtig ? 'richtig' : 'falsch')

    setSaetze((alt) => {
      const eintrag = withSrsDefaults(alt[key] ?? {})
      return {
        ...alt,
        [key]: {
          ...review(eintrag, bewertung),
          // Die Satz-eigenen Felder überleben review() nicht von
          // selbst – es kennt nur die Karteikasten-Felder.
          anzeige: eintrag.anzeige,
          schluessel: eintrag.schluessel,
          thema: eintrag.thema,
          grammatik: eintrag.grammatik,
          richtig: (eintrag.richtig ?? 0) + (richtig ? 1 : 0),
          falsch: (eintrag.falsch ?? 0) + (richtig ? 0 : 1),
        },
      }
    })

    if (richtig) {
      addXp?.(XP.SATZ_RICHTIG)
      setXpPopup({ amount: XP.SATZ_RICHTIG, key: Date.now() })
      setTimeout(() => setXpPopup(null), 900)
    }

    setResult((r) => ({
      richtig: r.richtig + (richtig ? 1 : 0),
      falsch: r.falsch + (richtig ? 0 : 1),
    }))

    setTimeout(() => {
      setExiting(null)
      setRevealed(false)
      setGewaehlt(null)
      setQueue((q) => {
        // Wer "Runde abbrechen" drückt, während diese Verzögerung
        // noch läuft, setzt queue auf null – und q.slice() warf
        // dann einen Fehler, der die ganze App weiß werden ließ.
        if (!q) return q
        const rest = q.slice(1)
        // Nicht gewusst? Hinten wieder einreihen, dann kommt der
        // Satz in derselben Runde noch einmal.
        if (!richtig) rest.push(key)
        if (rest.length === 0) merkeEinheit('wiederholung')
        return rest
      })
    }, 320)
  }

  /** Satzpaare: ein Satz verbunden – beim ersten Versuch "gut", sonst "schwer". */
  function paarGeloest(key, ersterVersuch) {
    merkeGelernt('saetze')
    setSaetze((alt) => {
      const eintrag = withSrsDefaults(alt[key] ?? {})
      return {
        ...alt,
        [key]: {
          ...review(eintrag, ersterVersuch ? 'gut' : 'schwer'),
          anzeige: eintrag.anzeige,
          schluessel: eintrag.schluessel,
          thema: eintrag.thema,
          grammatik: eintrag.grammatik,
          richtig: (eintrag.richtig ?? 0) + 1,
          falsch: eintrag.falsch ?? 0,
        },
      }
    })
    addXp?.(XP.SATZ_RICHTIG)
    setXpPopup({ amount: XP.SATZ_RICHTIG, key: Date.now() })
    setTimeout(() => setXpPopup(null), 900)
  }

  /** Einen Satz aus dem Kasten werfen. */
  function entfernen(key) {
    setSaetze((alt) => {
      const neu = { ...alt }
      delete neu[key]
      return neu
    })
  }

  // ---------- Die Satzliste zum Verwalten ----------
  if (ansicht === 'liste') {
    return (
      <div className="trainer wechsel" key="satz-liste">
        {kopf}
        <button className="btn-zurueck" onClick={() => setAnsicht('start')}>
          <span className="zurueck-pfeil" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg></span>{tr('Zurück')}
        </button>

        <div className="satz-filter">
          {[
            ['faellig', tr('Fällig ({0})', faellig.length)],
            ['alle', tr('Alle ({0})', entries.length)],
            ['gewusst', tr('Sitzt ({0})', gewusst.length)],
          ].map(([wert, text]) => (
            <button
              key={wert}
              className={'filter-knopf' + (filter === wert ? ' filter-an' : '')}
              onClick={() => setFilter(wert)}
            >
              {text}
            </button>
          ))}
        </div>

        <GratisHinweis art="saetze" gesamt={entries.length} />

        {gefiltert.length === 0 ? (
          <p className="empty-hint">{tr('Hier ist gerade nichts.')}</p>
        ) : (
          <div className="satz-liste">
            {gefiltert.map((e) => (
              <div key={e.key} className="satz-zeile">
                <div className="satz-zeile-text">
                  <span className="satz-es">{e.satz}{pausiert.has(e.key) && <span className="pausiert">{sprache() === 'en' ? 'Paused · Premium' : 'Pausiert · Premium'}</span>}</span>
                  <span className="satz-de">{e.translation}</span>
                  <span className="satz-meta">
                    {LEVEL_LABELS[e.level] ?? tr('Neu')} · {formatDue(e)}
                    {e.thema ? ' · ' + e.thema : ''}
                  </span>
                </div>
                <button
                  className="satz-weg"
                  onClick={() => entfernen(e.key)}
                  title={tr('Satz entfernen')}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ---------- Satzpaare ----------
  if (queue !== null && art === 'paare') {
    return (
      <div className="trainer training-stage spiel-toon sp-neu">
        {xpPopup && (
          <span key={xpPopup.key} className="xp-popup">
            +{xpPopup.amount} XP
          </span>
        )}
        <SatzPaare
          paare={queue
            .filter((k) => saetze[k])
            .map((k) => ({ key: k, es: saetze[k].anzeige ?? k, de: saetze[k].translation }))}
          onGeloest={paarGeloest}
          onFertig={() => merkeEinheit('wiederholung')}
          onClose={() => setQueue(null)}
          onNochmal={() => starten('paare')}
        />
      </div>
    )
  }

  // ---------- Laufende Runde ----------
  if (queue !== null) {
    if (queue.length === 0) {
      return (
        <div className="trainer">
          <div className="flashcard done sf-toon">
            <div className="confetti-burst" aria-hidden="true">
              {Array.from({ length: 14 }, (_, i) => (
                <span key={i} className="confetti" style={{ '--i': i }} />
              ))}
            </div>
            <span className="sf-bild" aria-hidden="true">
              <Sockel />
              <Pokal />
            </span>
            <h2>{tr('Runde geschafft! 🎉').replace(/\s*🎉/, '')}</h2>
            <p>
              {tr('{0}× gewusst · {1}× nicht gewusst', result.richtig, result.falsch)}
            </p>
            <div className="sf-knoepfe"><button className="sf-zurueck" onClick={() => setQueue(null)}>{tr('Fertig')}</button></div>
          </div>
        </div>
      )
    }

    const key = queue[0]
    const current = withSrsDefaults(saetze[key] ?? {})
    const satz = current.anzeige ?? key
    const loesung = current.translation || tr('(keine Übersetzung gespeichert)')

    return (
      <div className="trainer training-stage">
        {xpPopup && (
          <span key={xpPopup.key} className="xp-popup">
            +{xpPopup.amount} XP
          </span>
        )}
        <div className="lern-fortschritt">
          <div className="lern-balken">
            <div
              className="lern-balken-voll"
              style={{ width: (result.richtig / RUNDE) * 100 + '%' }}
            />
          </div>
          <p className="training-progress">
            {tr('{0} von {1} geschafft', result.richtig, RUNDE)}
          </p>
        </div>

        {/* ---------- Karten ---------- */}
        {art === 'karten' && (
          <div
            className={'flashcard satzkarte' + (exiting ? ' fliegt-' + exiting : '')}
            key={key + queue.length}
          >
            <div className="flash-satz">{satz}</div>
            {revealed ? (
              <div className="flash-back">
                <div className="flash-translation">{loesung}</div>
                {current.schluessel && (
                  <p className="satz-schluessel-hinweis">
                    {tr('Achte auf:')} <b>{current.schluessel}</b>
                  </p>
                )}
                <div className="bewertungen">
                  {[
                    { wert: 'nochmal', text: tr('Nochmal') },
                    { wert: 'schwer', text: tr('Schwer') },
                    { wert: 'gut', text: tr('Gut') },
                    { wert: 'einfach', text: tr('Einfach') },
                  ].map((b) => (
                    <button
                      key={b.wert}
                      className={'bewertung bewertung-' + b.wert}
                      onClick={() => antworten(b.wert)}
                    >
                      <span className="bewertung-text">{leiterName(current, b.wert) ?? b.text}</span>
                      <span className="bewertung-zeit">{vorschau(current, b.wert)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button onClick={() => setRevealed(true)}>{tr('Übersetzung zeigen')}</button>
            )}
          </div>
        )}

        {/* ---------- Multiple Choice ---------- */}
        {art === 'auswahl' && (
          <div
            className={'flashcard satzkarte' + (exiting ? ' fliegt-' + exiting : '')}
            key={key + queue.length}
          >
            <p className="lesson-hint">{tr('Was heißt …')}</p>
            <div className="flash-satz">{satz}</div>
            <SatzAuswahl
              key={key}
              loesung={loesung}
              alle={entries}
              gewaehlt={gewaehlt}
              onWahl={(antwort) => {
                if (gewaehlt) return
                setGewaehlt(antwort)
                setTimeout(() => antworten(antwort === loesung ? 'gut' : 'nochmal'), 750)
              }}
            />
          </div>
        )}

        {/* ---------- Satz bauen ---------- */}
        {art === 'bauen' && (
          <div
            className={'flashcard satzkarte' + (exiting ? ' fliegt-' + exiting : '')}
            key={key + queue.length}
          >
            <p className="lesson-hint">{tr('Bau den Satz auf Russisch')}</p>
            <div className="flash-satz satz-vorgabe">{loesung}</div>
            <SatzBauen
              key={key + queue.length}
              satz={satz}
              onFertig={(richtig) => antworten(richtig ? 'gut' : 'nochmal')}
            />
          </div>
        )}

        {/* ---------- Lückensatz ---------- */}
        {art === 'luecke' && (
          <div
            className={'flashcard satzkarte' + (exiting ? ' fliegt-' + exiting : '')}
            key={key + queue.length}
          >
            <p className="lesson-hint">{tr('Welches Wort fehlt?')}</p>
            <Lueckensatz
              key={key + queue.length}
              satz={satz}
              schluessel={current.schluessel}
              uebersetzung={current.translation}
              alle={entries}
              onFertig={(richtig) => antworten(richtig ? 'gut' : 'nochmal')}
            />
          </div>
        )}

        <button className="btn-plain" onClick={() => setQueue(null)}>
          {tr('Runde abbrechen')}
        </button>
      </div>
    )
  }

  // ---------- Übungsart wählen ----------
  if (artWahl) {
    return (
      <div className="trainer">
        <div className="art-kopf">
          <button className="btn-zurueck" onClick={() => setArtWahl(false)}>
            <span className="zurueck-pfeil" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg></span>{tr('Zurück')}
          </button>
          <h1 className="trainer-titel">
            {tr('Wie willst du')} <span className="accent">{tr('üben?')}</span>
          </h1>
          <p className="art-unterzeile">
            {tr('{0} Sätze stehen an.', Math.min(RUNDE, faellig.length))}
          </p>
        </div>
        <UebTabs
          tab={uebTab}
          onTab={setUebTab}
          ueben={ARTEN.filter((a) => !SATZ_SPIELE.includes(a.id)).length}
          spielen={SATZ_SPIELE.length}
        />
        <div className={'art-liste art-toon' + (uebTab === 'spielen' ? ' ueb-spiele-liste' : '')}>
          {ARTEN.filter((a) => SATZ_SPIELE.includes(a.id) === (uebTab === 'spielen')).map((a) => {
            // Multiple Choice braucht falsche Antworten zum Danebenlegen.
            // Mit weniger als vier Sätzen gibt es die nicht.
            const gesperrt =
              ((a.id === 'auswahl' || a.id === 'luecke') && entries.length < 4) ||
              (a.id === 'paare' && entries.filter((e) => e.translation).length < 3)
            return (
              <button
                key={a.id}
                className="art-karte"
                onClick={() => starten(a.id)}
                disabled={gesperrt}
                title={gesperrt ? tr('Dafür brauchst du mindestens vier Sätze') : undefined}
              >
                <SpielBild id={SATZ_BILD[a.id]} />
                <span className="art-text">
                  <span className="art-titel">{a.titel}</span>
                  <span className="art-beschreibung">{a.text}</span>
                  {gesperrt ? (
                    <span className="art-hinweis">
                      {a.id === 'paare' ? tr('Ab drei gesammelten Sätzen') : tr('Ab vier gesammelten Sätzen')}
                    </span>
                  ) : (
                    <span className="art-hinweis">{tr(SATZ_HINWEIS[a.id])}</span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ---------- Übersicht ----------
  return (
    <div className="trainer wechsel" key="satz-start">
      {kopf}

      {entries.length === 0 ? (
        <div className="bereich satz-leer">
          <h2>{tr('Noch keine Sätze')}</h2>
          <p>
            {tr('Lass dir welche erzeugen – zu einem Thema, zu einer Grammatik oder zu beidem. Danach wiederholst du sie hier, bis sie sitzen.')}
          </p>
        </div>
      ) : (
        <>
          {/* Gleicher Aufbau wie "Heute wiederholen" im Wort-Trainer */}
          <section className="bereich bereich-wiederholen">
            <div className="wiederholen-reihe">
            <div className="wiederholen-zahl">
              <b>{faellig.length}</b>
              <span>{faellig.length === 1 ? tr('Satz wartet') : tr('Sätze warten')}</span>
            </div>
            <div className="wiederholen-text">
              <h2>{tr('Heute wiederholen')}</h2>
              <p>
                {faellig.length > 0
                  ? tr('Diese Sätze drohst du gerade zu vergessen – jetzt sitzen sie am besten.')
                  : tr('Alles erledigt. Neue Sätze erzeugst du unten mit der KI.')}
              </p>
              <p className="wiederholen-stand">
                {tr('{0} gesammelt · {1} sitzen', entries.length, gewusst.length)}
              </p>
            </div>
            </div>
            <TrainerGrenze art="saetze" gesamt={entries.length} />
            {/* Nichts fällig? Satzpaare gehen trotzdem – mit den übrigen Sätzen */}
            <button
              className="btn wiederholen-los"
              disabled={faellig.length === 0 && entries.filter((e) => e.translation).length < 3}
              onClick={() => (faellig.length > 0 ? setArtWahl(true) : starten('paare'))}
            >
              {faellig.length > 0 ? tr('Üben') : entries.filter((e) => e.translation).length >= 3 ? tr('Satzpaare') : tr('Nichts fällig')}
            </button>
          </section>
        </>
      )}

      {/* Der Generator steht direkt hier – wie beim Vokabeltrainer.
          Erst eine Tür antippen, um dann ein Thema zu wählen, war
          ein Schritt zu viel. */}
      <section className="bereich">
        <SatzGenerator saetze={saetze} setSaetze={setSaetze} addXp={addXp} />
      </section>

      {entries.length > 0 && (
        <button className="bereich trainer-sprechen" onClick={() => setAnsicht('liste')}>
          <span className="trainer-sprechen-icon">
            <IconListe groesse={26} />
          </span>
          <span className="trainer-sprechen-text">
            <h2>{tr('Deine Sätze')}</h2>
            <p>{tr('{0} gesammelt – ansehen und aufräumen.', entries.length)}</p>
          </span>
        </button>
      )}
    </div>
  )
}

/** Die Antwortknöpfe beim Multiple Choice – einmal gewürfelt, dann fest. */
function SatzAuswahl({ loesung, alle, gewaehlt, onWahl }) {
  const [optionen] = useState(() => baueAuswahl(loesung, alle))

  return (
    <div className="quiz-options satz-optionen">
      {optionen.map((o) => {
        let klasse = 'quiz-option'
        if (gewaehlt) {
          if (o === loesung) klasse += ' option-richtig'
          else if (o === gewaehlt) klasse += ' option-falsch'
          else klasse += ' option-inaktiv'
        }
        return (
          <button
            key={o}
            className={klasse}
            onClick={(e) => {
              e.currentTarget.blur()
              onWahl(o)
            }}
            disabled={Boolean(gewaehlt)}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Satzpaare: oben die russischen Sätze, darunter die Übersetzungen in
 * anderer Reihenfolge. Erst einen Satz antippen, dann seine Übersetzung.
 * Untereinander statt nebeneinander – zwei Spalten mit ganzen Sätzen
 * werden auf dem Handy zu schmal.
 */
function SatzPaare({ paare, onGeloest, onFertig, onClose, onNochmal }) {
  // Die Reihenfolge leitet sich aus den Daten ab (wie bei den Wortpaaren),
  // damit sie bei einem Abgleich im Hintergrund nicht durcheinandergerät
  const unten = [...paare].sort((a, b) => a.de.localeCompare(b.de, 'de'))
  const [wahl, setWahl] = useState(null)
  const [geloest, setGeloest] = useState([])
  const [daneben, setDaneben] = useState([]) // Sätze mit Fehlversuch
  const [fehler, setFehler] = useState(null)

  const fertig = paare.length > 0 && geloest.length === paare.length

  function klickUnten(p) {
    if (!wahl || geloest.includes(p.key)) return
    if (p.key === wahl) {
      erfolgston()
      setGeloest((g) => [...g, p.key])
      onGeloest(p.key, !daneben.includes(p.key))
      setWahl(null)
      if (geloest.length + 1 === paare.length) onFertig()
    } else {
      setFehler(p.key)
      fehlerton()
      setDaneben((d) => (d.includes(wahl) ? d : [...d, wahl]))
      setTimeout(() => {
        setFehler(null)
        setWahl(null)
      }, 600)
    }
  }

  if (fertig) {
    // Abschluss im Spiel-Look (12.11.2026): Pokal auf der Trommel wie bei den Spielen
    return (
      <div className="flashcard done sf-toon">
        <div className="confetti-burst" aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => (
            <span key={i} className="confetti" style={{ '--i': i }} />
          ))}
        </div>
        <span className="sf-bild" aria-hidden="true">
          <Sockel />
          <Pokal />
        </span>
        <h2>{tr('Geschafft! 🎉').replace(/\s*🎉/, '')}</h2>
        <p>{tr('Alle {0} Satzpaare verbunden! 🎉', paare.length).replace(/\s*🎉/, '')}</p>
        <div className="sf-pillen">
          <span className="sf-pille sf-stufe">{tr('{0}× auf Anhieb · {1}× mit zweitem Versuch', paare.length - daneben.length, daneben.length)}</span>
        </div>
        <div className="sf-knoepfe">
          {onNochmal && <button className="sf-nochmal" onClick={onNochmal}>{tr('Nochmal')}</button>}
          <button className="sf-zurueck" onClick={onClose}>{tr('Fertig')}</button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="player-top sk-kopf">
        <span className="sk-bild"><SpielBild id="paare" /></span>
        <h2 className="game-title">{tr('Satzpaare')}</h2>
        <button className="sk-zu" onClick={onClose} aria-label="✕">✕</button>
      </div>
      <div className="sp-buehne">
        <div className="sp-fortschritt">
          <div className="sp-balken"><i style={{ width: (geloest.length / paare.length) * 100 + '%' }} /></div>
          <span>{tr('{0}/{1} verbunden', geloest.length, paare.length)}</span>
        </div>
        <p className="sp-tipp">
          {wahl ? tr('Jetzt rechts die Übersetzung antippen') : tr('Tippe links einen Satz an, dann rechts die Übersetzung')}
        </p>
        <div className="sp-paare sp-satzpaare">
          <div className="sp-paare-spalte">
            {paare.map((p) => (
              <button
                key={p.key}
                className={
                  'sp-paar sp-paar-links' +
                  (geloest.includes(p.key) ? ' richtig' : '') +
                  (wahl === p.key ? ' gewaehlt' : '')
                }
                disabled={geloest.includes(p.key)}
                onClick={() => setWahl(p.key)}
              >
                {p.es}
              </button>
            ))}
          </div>
          <div className="sp-paare-spalte">
            {unten.map((p) => (
              <button
                key={p.key}
                className={
                  'sp-paar' +
                  (geloest.includes(p.key) ? ' richtig' : '') +
                  (fehler === p.key ? ' falsch' : '') +
                  (wahl && !geloest.includes(p.key) ? ' bereit' : '')
                }
                disabled={geloest.includes(p.key)}
                onClick={() => klickUnten(p)}
              >
                {p.de}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

// ---------------------------------------------------------------
//  Satz bauen + Lückensatz
// ---------------------------------------------------------------

/** Wort ohne Satzzeichen, klein – zum Vergleichen */
const glatt = (w) => w.toLocaleLowerCase('es').replace(/[¿?¡!.,;:«»"“”()…]/g, '')

/** Satz in Wörter zerlegen; Satzzeichen hängen nicht an den Kacheln */
function woerterVon(satz) {
  return satz
    .split(/\s+/)
    .map((w) => w.replace(/^[¿¡«"“(]+|[?!.,;:»"”)…]+$/g, ''))
    .filter(Boolean)
}

function mische(liste) {
  const a = [...liste]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Satz bauen: Wörter als Kacheln, in der richtigen Reihenfolge antippen.
 * Angetippte Kacheln wandern nach oben; dort antippen legt sie zurück.
 * Sind alle verbaut, wird geprüft – ohne Groß/Klein und Satzzeichen.
 */
function SatzBauen({ satz, onFertig }) {
  const woerter = woerterVon(satz)
  // Kacheln über ihre Position merken – gleiche Wörter kommen öfter vor
  const [kacheln] = useState(() => {
    let m = mische(woerter.map((w, i) => ({ w, i })))
    // Nicht zufällig schon richtig sortiert anbieten
    if (m.length > 1 && m.every((k, i) => k.i === i)) m = [...m.slice(1), m[0]]
    return m
  })
  const [gelegt, setGelegt] = useState([]) // Positionen in kacheln
  const [ergebnis, setErgebnis] = useState(null) // null | 'richtig' | 'falsch'
  const [korrigiert, setKorrigiert] = useState(false) // Kacheln stehen nach Fehler richtig
  const knoepfe = useRef({}) // Kachel-Elemente in der Zeile, für die Schiebe-Animation
  const vorher = useRef(null) // Positionen vor dem Umsortieren

  // Falscher Satz: Die Kacheln gleiten an ihren richtigen Platz (FLIP –
  // alte Position merken, neu sortieren, Versatz per transform zurückrollen).
  useLayoutEffect(() => {
    const alt = vorher.current
    if (!alt) return
    vorher.current = null
    for (const [n, el] of Object.entries(knoepfe.current)) {
      if (!el || !alt[n]) continue
      const neu = el.getBoundingClientRect()
      const dx = alt[n].left - neu.left
      const dy = alt[n].top - neu.top
      if (!dx && !dy) continue
      el.style.transition = 'none'
      el.style.transform = `translate(${dx}px, ${dy}px)`
      el.getBoundingClientRect() // Neuberechnung erzwingen
      el.style.transition = 'transform .6s cubic-bezier(.3,.8,.3,1)'
      el.style.transform = ''
    }
  }, [gelegt])

  function korrigiere(neu) {
    const pos = {}
    for (const [n, el] of Object.entries(knoepfe.current)) if (el) pos[n] = el.getBoundingClientRect()
    vorher.current = pos
    // Ursprüngliche Reihenfolge – gleiche Wörter sind austauschbar
    setGelegt([...neu].sort((a, b) => kacheln[a].i - kacheln[b].i))
    setKorrigiert(true)
  }

  function lege(idx) {
    if (ergebnis || gelegt.includes(idx)) return
    const neu = [...gelegt, idx]
    setGelegt(neu)
    if (neu.length === kacheln.length) {
      const gebaut = neu.map((n) => glatt(kacheln[n].w)).join(' ')
      const ziel = woerter.map(glatt).join(' ')
      const ok = gebaut === ziel
      setErgebnis(ok ? 'richtig' : 'falsch')
      if (ok) erfolgston()
      else fehlerton()
      if (ok) setTimeout(() => onFertig(true), 900)
      else {
        // Erst kurz zeigen, was falsch steht, dann an den richtigen Platz
        // schieben. Danach bleibt die Korrektur stehen, bis man selbst
        // auf „Weiter“ tippt (12.11.2026).
        setTimeout(() => korrigiere(neu), 900)
      }
    }
  }

  return (
    <div className="satzbau">
      <div className={'satzbau-zeile' + (ergebnis ? ' satzbau-' + (korrigiert ? 'korrigiert' : ergebnis) : '')}>
        {gelegt.length === 0 && <span className="satzbau-platzhalter">{tr('Tippe die Wörter in der richtigen Reihenfolge')}</span>}
        {gelegt.map((n, pos) => (
          <button
            key={n}
            ref={(el) => { knoepfe.current[n] = el }}
            className={
              'satzbau-kachel gelegt' +
              (ergebnis === 'falsch' && !korrigiert
                ? glatt(kacheln[n].w) === glatt(woerter[pos]) ? ' platz-richtig' : ' platz-falsch'
                : '') +
              (korrigiert ? ' platz-korrigiert' : '')
            }
            disabled={Boolean(ergebnis)}
            onClick={() => setGelegt((g) => g.filter((x) => x !== n))}
          >
            {kacheln[n].w}
          </button>
        ))}
      </div>
      {korrigiert && (
        <p className="satzbau-loesung">
          {tr('Richtig wäre:')} <b>{satz}</b>
        </p>
      )}
      {korrigiert && (
        <button className="btn satzbau-weiter" onClick={() => onFertig(false)}>
          {tr('Weiter')}
        </button>
      )}
      <div className="satzbau-vorrat">
        {kacheln.map((k, n) => (
          <button
            key={n}
            className={'satzbau-kachel' + (gelegt.includes(n) ? ' verbaut' : '')}
            disabled={gelegt.includes(n) || Boolean(ergebnis)}
            onClick={() => lege(n)}
          >
            {k.w}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Welches Wort fehlt? Ausgeblendet wird das Schlüsselwort, das die KI
 * beim Erzeugen mitliefert (meist das Wort in der geübten Form).
 * Fehlt es oder steht es nicht wörtlich im Satz, das längste Wort.
 */
function baueLuecke(satz, schluessel) {
  const tief = satz.toLocaleLowerCase('es')
  const s = (schluessel || '').trim()
  let start = s ? tief.indexOf(s.toLocaleLowerCase('es')) : -1
  let laenge = s.length
  // Nur ganze Wörter – "es" darf nicht mitten in "estamos" treffen
  const istWortgrenze = (i) => i < 0 || i >= satz.length || !/[\p{L}]/u.test(satz[i])
  if (start >= 0 && !(istWortgrenze(start - 1) && istWortgrenze(start + laenge))) start = -1
  if (start < 0) {
    const w = woerterVon(satz).sort((a, b) => b.length - a.length)[0] || satz
    start = satz.indexOf(w)
    laenge = w.length
  }
  return {
    vorher: satz.slice(0, start),
    wort: satz.slice(start, start + laenge),
    nachher: satz.slice(start + laenge),
  }
}

function Lueckensatz({ satz, schluessel, uebersetzung, alle, onFertig }) {
  const [luecke] = useState(() => baueLuecke(satz, schluessel))
  const [optionen] = useState(() => {
    const richtig = glatt(luecke.wort)
    // Falsche Antworten: zuerst die Schlüsselwörter anderer Sätze (meist
    // auch Verbformen – das macht es knifflig), dann sonstige längere Wörter
    const kandidaten = [
      ...mische(alle.map((e) => (e.schluessel || '').trim()).filter(Boolean)),
      ...mische(alle.flatMap((e) => woerterVon(e.satz)).filter((w) => w.length >= 4)),
    ]
    const falsch = []
    for (const k of kandidaten) {
      const g = glatt(k)
      if (!g || g === richtig || falsch.some((f) => glatt(f) === g)) continue
      falsch.push(luecke.wort === luecke.wort.toLowerCase() ? k.toLocaleLowerCase('es') : k)
      if (falsch.length === 3) break
    }
    return mische([luecke.wort, ...falsch])
  })
  const [gewaehlt, setGewaehlt] = useState(null)

  function waehle(o) {
    if (gewaehlt) return
    setGewaehlt(o)
    const ok = glatt(o) === glatt(luecke.wort)
    setTimeout(() => onFertig(ok), ok ? 800 : 1800)
  }

  return (
    <>
      <div className="flash-satz luecken-satz">
        {luecke.vorher}
        <span className={'luecke' + (gewaehlt ? (glatt(gewaehlt) === glatt(luecke.wort) ? ' luecke-richtig' : ' luecke-falsch') : '')}>
          {gewaehlt ? luecke.wort : '\u00a0'.repeat(Math.max(4, luecke.wort.length))}
        </span>
        {luecke.nachher}
      </div>
      {uebersetzung && <p className="luecken-hilfe">{uebersetzung}</p>}
      <div className="quiz-options satz-optionen luecken-optionen">
        {optionen.map((o) => {
          let klasse = 'quiz-option'
          if (gewaehlt) {
            if (glatt(o) === glatt(luecke.wort)) klasse += ' option-richtig'
            else if (o === gewaehlt) klasse += ' option-falsch'
            else klasse += ' option-inaktiv'
          }
          return (
            <button key={o} className={klasse} disabled={Boolean(gewaehlt)} onClick={() => waehle(o)}>
              {o}
            </button>
          )
        })}
      </div>
    </>
  )
}
