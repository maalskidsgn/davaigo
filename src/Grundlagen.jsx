import { useMemo, useState } from 'react'
import { LEKTIONEN } from './lektionen.js'
import WISSEN_TABELLEN from './wissenTabellen.js'
import { tr, sprache } from './sprache.js'
import { erfolgston, fehlerton } from './erfolgston.js'
import { newEntry, review, vorschau, isDue, withSrsDefaults } from './srs.js'
import { useLautschrift, LautSchalter } from './lautAn.jsx'
import { lautschrift } from './lautschrift.js'

/**
 * Grundlagen-Trainer (16.11.2026, Entwurf): Die „Gut zu wissen“-Karten aus
 * abgeschlossenen Lektionen kommen hierher und werden wiederholt wie
 * Vokabeln – mit Abständen, die mit jedem „Gut“ wachsen.
 *
 * Abgefragt wird aus der Lerntabelle heraus (Zeile wählen, zweite Spalte
 * erraten), danach steht die ganze Karte samt Tabelle zum Nachlesen da.
 * Stand je Karte im Browser: localStorage „grundlagen-stand“ – im selben
 * Format wie eine Vokabel, damit dieselbe Wiederholungslogik (srs.js) gilt:
 * Nochmal in 15 Min., Schwer/Gut/Einfach mit wachsendem Abstand.
 */

const SPEICHER = 'grundlagen-stand'
const RUNDE = 8
const KYRILLISCH = /[а-яё]/i

function lies() {
  try { return JSON.parse(localStorage.getItem(SPEICHER)) ?? {} } catch { return {} }
}
function schreib(stand) {
  try { localStorage.setItem(SPEICHER, JSON.stringify(stand)) } catch { /* egal */ }
}

/** *Wörter* als Chips – auf Wunsch mit Lautschrift darunter. */
function chips(text = '', laut = false) {
  return String(text).split('*').map((t, i) => {
    if (!(i % 2)) return t
    if (!laut || !KYRILLISCH.test(t)) return <span key={i} className="wort-chip">{t}</span>
    return (
      <span key={i} className="gl-chip-laut">
        <span className="wort-chip">{t}</span>
        <small>{lautschrift(t, sprache())}</small>
      </span>
    )
  })
}
function zelle(text, laut) {
  const [wort, bedeutung] = String(text).split(' – ')
  if (!bedeutung) return chips(text, laut)
  return <span className="info-zelle"><span>{chips(wort, laut)}</span><small>{bedeutung}</small></span>
}

/** Alle Karten aus abgeschlossenen Lektionen, die eine Tabelle haben. */
export function grundlagenKarten(lessonProgress = {}) {
  const sp = sprache() === 'en' ? 'en' : 'de'
  const karten = []
  for (const l of LEKTIONEN) {
    if (!lessonProgress[l.id]?.fertig) continue
    ;(l.wissen ?? []).forEach((k, i) => {
      const tabelle = WISSEN_TABELLEN[`${l.id}:${i}`]?.[sp]
      if (tabelle) karten.push({ id: `${l.id}:${i}`, lektion: l.titel, emoji: k.emoji, titel: k.titel, text: k.text, tabelle })
    })
  }
  return karten
}

const eintrag = (stand, id) => withSrsDefaults(stand[id] ?? newEntry('', 'Grundlagen'))

export function faelligeGrundlagen(lessonProgress) {
  const stand = lies()
  return grundlagenKarten(lessonProgress).filter((k) => isDue(eintrag(stand, k.id)))
}

/** Eine Frage aus der Tabelle: erste Spalte zeigen, zweite erraten. */
function frageAus(karte) {
  const { kopf, zeilen } = karte.tabelle
  const brauchbar = zeilen.filter((z) => z[0] && z[1])
  const werte = [...new Set(brauchbar.map((z) => z[1]))]
  if (brauchbar.length < 2 || werte.length < 2) return null
  const zeile = brauchbar[Math.floor(Math.random() * brauchbar.length)]
  const falsch = werte.filter((w) => w !== zeile[1]).sort(() => Math.random() - 0.5).slice(0, 3)
  return {
    vorne: zeile[0],
    spalte: kopf[1],
    richtig: zeile[1],
    optionen: [zeile[1], ...falsch].sort(() => Math.random() - 0.5),
  }
}

function Tabelle({ tabelle, laut }) {
  return (
    <div className="info-tabelle-rahmen">
      <table className="info-tabelle">
        <thead><tr>{tabelle.kopf.map((k) => <th key={k}>{k}</th>)}</tr></thead>
        <tbody>
          {tabelle.zeilen.map((z, i) => (
            <tr key={i}>{z.map((c, j) => <td key={j}>{zelle(c, laut)}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Grundlagen({ kopf, lessonProgress, addXp }) {
  const alle = useMemo(() => grundlagenKarten(lessonProgress), [lessonProgress])
  const [stand, setStand] = useState(lies)
  const [runde, setRunde] = useState(null) // Karten der laufenden Runde
  const [nr, setNr] = useState(0)
  const [frage, setFrage] = useState(null)
  const [antwort, setAntwort] = useState(null)
  const [offen, setOffen] = useState(null) // aufgeklappte Karte in der Liste
  const [listeOffen, setListeOffen] = useState(false)
  const [laut, lautUmschalten] = useLautschrift()

  const faellig = alle.filter((k) => isDue(eintrag(stand, k.id)))
  const sitzen = alle.filter((k) => (eintrag(stand, k.id).intervall ?? 0) >= 21).length

  function starten() {
    const r = faellig.slice(0, RUNDE)
    setRunde(r)
    setNr(0)
    setAntwort(null)
    setFrage(frageAus(r[0]))
  }

  function waehlen(o) {
    if (antwort) return
    const richtig = o === frage.richtig
    setAntwort({ o, richtig })
    if (richtig) { erfolgston(); addXp?.(5) } else fehlerton()
  }

  function bewerten(wert) {
    const karte = runde[nr]
    const neu = { ...stand, [karte.id]: review(eintrag(stand, karte.id), wert) }
    setStand(neu)
    schreib(neu)
    if (nr + 1 >= runde.length) { setRunde(null); return }
    setNr(nr + 1)
    setAntwort(null)
    setFrage(frageAus(runde[nr + 1]))
  }

  // ---------- Laufende Runde ----------
  if (runde) {
    const karte = runde[nr]
    const aufgedeckt = !frage || antwort
    return (
      <div className="training-stage gl-runde">
        <div className="lern-balken"><div className="lern-balken-voll" style={{ width: (nr / runde.length) * 100 + '%' }} /></div>
        <p className="training-progress">{tr('Regel {0} von {1}', nr + 1, runde.length)}</p>
        <div className="laut-zeile laut-oben"><LautSchalter an={laut} onClick={lautUmschalten} /></div>

        <div className="flashcard karte-toon gl-karte">
          <p className="gl-herkunft">{karte.emoji} {karte.lektion}</p>
          {frage ? (
            <>
              <p className="gl-frage">{chips(frage.vorne, laut)}</p>
              <p className="lesson-hint">{frage.spalte}?</p>
              <div className="gl-optionen">
                {frage.optionen.map((o) => (
                  <button
                    key={o}
                    className={'quiz-option' + (antwort && o === frage.richtig ? ' option-richtig' : '') + (antwort?.o === o && !antwort.richtig ? ' option-falsch' : '')}
                    onClick={() => waehlen(o)}
                  >
                    {zelle(o, laut)}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="gl-frage gl-frage-klein">{tr('Erinnerst du dich?')} <b>{karte.titel}</b></p>
          )}

          {aufgedeckt && (
            <div className="gl-loesung">
              <h3 className="info-title">{karte.titel}</h3>
              <p className="info-text">{chips(karte.text, laut)}</p>
              <Tabelle tabelle={karte.tabelle} laut={laut} />
              <div className="bewertungen">
                {[['nochmal', tr('Nochmal')], ['schwer', tr('Schwer')], ['gut', tr('Gut')], ['einfach', tr('Einfach')]].map(([w, t]) => (
                  <button key={w} className={'bewertung bewertung-' + w} onClick={() => bewerten(w)}>
                    <span className="bewertung-text">{t}</span>
                    <span className="bewertung-zeit">{vorschau(eintrag(stand, karte.id), w)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {!aufgedeckt && null}
        </div>

        <button className="btn-plain" onClick={() => setRunde(null)}>{tr('Runde abbrechen')}</button>
      </div>
    )
  }

  // ---------- Übersicht ----------
  return (
    <div className="trainer gl">
      {kopf}

      <div className="gl-held">
        <div className="gl-held-zahl">
          <b>{faellig.length}</b>
          <span>{tr('Regeln fällig')}</span>
        </div>
        <div className="gl-held-text">
          <h2>{tr('Grundlagen wiederholen')}</h2>
          <p>{tr('Alles aus „Gut zu wissen“ deiner Lektionen – genau dann wieder, wenn du es zu vergessen drohst.')}</p>
        </div>
        <button className="btn gl-los" disabled={!faellig.length} onClick={starten}>
          {faellig.length ? tr('{0} Regeln üben', Math.min(RUNDE, faellig.length)) : tr('Alles wiederholt')}
        </button>
      </div>

      {/* Alle Grundlagen – aufklappbar wie „Alle deine Wörter“ im Vokabeltrainer */}
      <section className="bereich">
        <button className="liste-kopf" onClick={() => setListeOffen((o) => !o)} aria-expanded={listeOffen}>
          <span className="liste-kopf-text">
            <span className="liste-titel">{tr('Alle deine Grundlagen')}</span>
            <span className="liste-sub">{tr('{0} gesammelt · {1} sitzen schon fest', alle.length, sitzen)}</span>
          </span>
          <span className={'liste-pfeil' + (listeOffen ? ' liste-pfeil-auf' : '')}>▾</span>
        </button>
        <p className="gl-liste-hinweis">{tr('Alle Grundlagen aus den Lektionen landen hier, um sie nochmal zu wiederholen.')}</p>

        {listeOffen && (
          alle.length === 0 ? (
            <p className="intro">{tr('Schließ deine erste Lektion ab – dann landen ihre Grundlagen hier.')}</p>
          ) : (
            <>
              <div className="liste-werkzeuge"><LautSchalter an={laut} onClick={lautUmschalten} className="laut-liste" /></div>
              <ul className="gl-liste">
                {alle.map((k) => {
                  const e = eintrag(stand, k.id)
                  const neuKarte = !stand[k.id]
                  const istFaellig = isDue(e)
                  return (
                    <li key={k.id} className={'gl-eintrag' + (offen === k.id ? ' gl-offen' : '')}>
                      <button className="gl-zeile" onClick={() => setOffen(offen === k.id ? null : k.id)}>
                        <span className="gl-emoji" aria-hidden="true">{k.emoji}</span>
                        <span className="gl-zeile-text"><b>{k.titel}</b><small>{k.lektion}</small></span>
                        <span className={'gl-stufe gl-stufe-' + Math.min(4, e.level ?? 0)}>
                          {neuKarte ? tr('neu') : istFaellig ? tr('fällig') : tr('Stufe {0}', e.level ?? 0)}
                        </span>
                      </button>
                      {offen === k.id && (
                        <div className="gl-detail">
                          <p className="info-text">{chips(k.text, laut)}</p>
                          <Tabelle tabelle={k.tabelle} laut={laut} />
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </>
          )
        )}
      </section>
    </div>
  )
}
