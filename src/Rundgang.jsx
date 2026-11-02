// Die Bereichs-Einführungen – und der Rundgang, der sie verbindet.
//
// Übernommen aus Habloo, ein System für zwei Wünsche:
//
//   1. Betritt jemand einen Bereich zum ERSTEN Mal, erklärt eine
//      Infobox in zwei, drei Sätzen, was er hier kann. Einmal
//      weggeklickt, kommt sie nie wieder (localStorage).
//
//   2. Der RUNDGANG klickt genau diese Boxen der Reihe nach durch
//      alle Bereiche – die App wechselt selbst die Ansicht, man
//      schaut zu und tippt „Weiter". Kein zweiter Satz Texte, der
//      auseinanderlaufen könnte: Es sind dieselben.
//
// Ein Unterschied zu Habloo: Davaigo hat kein Onboarding mehr (Manuel
// wollte die Leute direkt in die App lassen). Deshalb erklärt sich
// hier auch die Startseite beim allerersten Öffnen – und bietet dort
// gleich den Rundgang an. Bei Habloo übernimmt das das Onboarding.
//
// Die Texte nennen nur, was gerade sichtbar ist. Grammatik-Reiter und
// KI-Tutor sind ausgeblendet (Schalter in Trainer.jsx) – kommen sie
// zurück, gehören sie hier wieder in den Trainer-Text.

import { useEffect } from 'react'
import { IconLektion, IconKarten, IconMediathek, IconMehr, IconLandkarte } from './icons.jsx'
import { tr } from './sprache.js'

const SPEICHER = 'bereichGesehen'

export function gesehene() {
  try {
    return JSON.parse(localStorage.getItem(SPEICHER)) ?? {}
  } catch {
    return {}
  }
}

export function merkeGesehen(bereich) {
  try {
    localStorage.setItem(SPEICHER, JSON.stringify({ ...gesehene(), [bereich]: true }))
  } catch {
    // Kein Speicher – dann kommt die Box eben noch einmal.
  }
}

/** Die Texte je Bereich. Der Schlüssel ist der view-Name aus App.jsx. */
export const BEREICHE = {
  start: {
    icon: IconLandkarte,
    titel: tr('Willkommen bei Davaigo'),
    text:
      tr('Hier beginnt jeder Tag: deine nächste Lektion, die Rangliste, der Kalender mit deinen Lerntagen und deine Meilensteine. Einmal am Tag reinschauen reicht, um dranzubleiben.'),
  },
  lektionen: {
    icon: IconLektion,
    titel: tr('Die Lektionen'),
    text:
      tr('180 Lektionen in zehn Modulen – vom kyrillischen Alphabet bis zu natürlichem Russisch. Alle vertont, jede in wenigen Minuten geschafft.'),
  },
  trainer: {
    icon: IconKarten,
    titel: tr('Der Trainer'),
    text:
      tr('Dein Karteikasten: Er zeigt dir jedes Wort genau dann wieder, wenn du es zu vergessen drohst. Dazu Sätze, Lesetexte und Spiele, wenn du mal keine Lust auf Abfragen hast.'),
  },
  videos: {
    icon: IconMediathek,
    titel: tr('Videos auf Russisch'),
    text:
      tr('Echte YouTube-Videos mit Untertiteln. Tippe ein unbekanntes Wort an – es wandert mit Übersetzung in deinen Trainer. Jede Minute Zuschauen bringt XP.'),
  },
  mehr: {
    icon: IconMehr,
    titel: tr('Mehr'),
    text:
      tr('Dein Konto, Freunde und Duelle, Tagesziel und Ton. Und falls du mal etwas suchst: Der Leitfaden hier unter Mehr erklärt die ganze App in Ruhe – samt diesem Rundgang.'),
  },
}

/** Die Stationen des Rundgangs, in Lauf-Reihenfolge. */
export const RUNDGANG_REIHE = ['start', 'lektionen', 'trainer', 'videos', 'mehr']

/**
 * Die Infobox selbst – als Overlay über dem Bereich.
 *
 * @param bereich     Schlüssel aus BEREICHE
 * @param rundgang    { nr, von } wenn Teil des Rundgangs, sonst null
 * @param onWeiter    Rundgang: nächste Station
 * @param onFertig    Schließen (Einzelbox) bzw. Rundgang beenden
 * @param onRundgang  Nur bei der Startbox außerhalb des Rundgangs:
 *                    bietet an, ihn gleich zu starten
 */
export default function BereichsIntro({ bereich, rundgang, onWeiter, onFertig, onRundgang }) {
  const info = BEREICHE[bereich]

  // Gesehen wird beim ANZEIGEN gemerkt, nicht beim Schließen: Wer die
  // Box einmal vor sich hatte, braucht sie kein zweites Mal.
  useEffect(() => {
    merkeGesehen(bereich)
  }, [bereich])

  if (!info) return null
  const Icon = info.icon
  const letzte = rundgang && rundgang.nr >= rundgang.von

  return (
    <div className="intro-hintergrund" onClick={rundgang ? undefined : onFertig}>
      <div className="intro-karte" onClick={(e) => e.stopPropagation()} key={bereich}>
        <span className="intro-funke intro-funke-a" aria-hidden="true" />
        <span className="intro-funke intro-funke-b" aria-hidden="true" />

        <span className="intro-icon">
          <Icon groesse={30} />
        </span>

        {rundgang && (
          <span className="intro-schritt">
            {tr('{0} von {1}', rundgang.nr, rundgang.von)}
          </span>
        )}

        <h2>{info.titel}</h2>
        <p>{info.text}</p>

        <div className="intro-knoepfe">
          {rundgang ? (
            <>
              <button className="btn-outline" onClick={onFertig}>
                {tr('Rundgang beenden')}
              </button>
              <button className="btn" onClick={letzte ? onFertig : onWeiter}>
                {letzte ? tr('Fertig – davai!') : tr('Weiter →')}
              </button>
            </>
          ) : onRundgang ? (
            <>
              <button className="btn-outline" onClick={onFertig}>
                {tr('Später')}
              </button>
              <button className="btn" onClick={onRundgang}>
                {tr('Kurzer Rundgang')}
              </button>
            </>
          ) : (
            <button className="btn intro-alles-klar" onClick={onFertig}>
              {tr('Alles klar')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
