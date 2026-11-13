// Lautschrift ein-/ausblenden – eine Wahl für die ganze App (13.11.2026).
//
// Manuel: In Trainer, Sätzen, Texten und Lektionen soll man selbst
// entscheiden, ob unter dem Russischen die Lautschrift steht. Der
// Schalter sitzt überall dort, wo Russisch gelernt wird; wer ihn an
// einer Stelle umlegt, hat ihn überall umgelegt (Ereignis „lautschrift“).

import { useEffect, useState } from 'react'
import { lautschrift } from './lautschrift.js'
import { tr, sprache } from './sprache.js'

const SCHLUESSEL = 'lautschrift'
const ALT = 'lektion-lautschrift' // so hieß die Wahl, als es sie nur in den Lektionen gab
const KYRILLISCH = /[а-яё]/i

function lies() {
  try {
    return (localStorage.getItem(SCHLUESSEL) ?? localStorage.getItem(ALT)) === 'an'
  } catch {
    return false
  }
}

/** [an, umschalten] – bleibt mit allen anderen Schaltern in der App gleich. */
export function useLautschrift() {
  const [an, setAn] = useState(lies)
  useEffect(() => {
    const neu = () => setAn(lies())
    window.addEventListener('lautschrift', neu)
    return () => window.removeEventListener('lautschrift', neu)
  }, [])
  function umschalten() {
    const neu = !lies()
    try { localStorage.setItem(SCHLUESSEL, neu ? 'an' : 'aus') } catch { /* gilt dann nur bis zum Neuladen */ }
    setAn(neu)
    window.dispatchEvent(new Event('lautschrift'))
  }
  return [an, umschalten]
}

/**
 * Die Lautschrift zu einem russischen Wort oder Satz – nur wenn sie an
 * ist und der Text überhaupt Kyrillisch enthält (die deutsche oder
 * englische Seite einer Karte bekommt keine).
 * art: 'wort' (groß, unter dem Kartenwort) · 'satz' · 'klein' (in Listen)
 */
export function Laut({ text, an, art = 'wort' }) {
  if (!an || !text || !KYRILLISCH.test(text)) return null
  const umschrift = lautschrift(text, sprache())
  if (art === 'klein') return <span className="laut-klein">{umschrift}</span>
  return <div className={art === 'satz' ? 'laut-satz' : 'laut-wort'}>{umschrift}</div>
}

/** Der Schalter „Aa Lautschrift“. */
export function LautSchalter({ an, onClick, className = '' }) {
  return (
    <button
      type="button"
      className={'laut-schalter' + (an ? ' an' : '') + (className ? ' ' + className : '')}
      onClick={onClick}
      aria-pressed={an}
    >
      <b>Aa</b> {tr('Lautschrift')}
    </button>
  )
}
