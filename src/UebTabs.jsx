// Umschalter „Üben | Spielen“ auf der Seite „Wie willst du üben?“
// (12.11.2026) – für Vokabeln und Sätze gleich. Die App merkt sich
// den zuletzt gewählten Tab.
import { useState } from 'react'
import { tr } from './sprache.js'

const SCHLUESSEL = 'uebung-tab'

export function useUebTab() {
  const [tab, setTab] = useState(() => {
    try { return localStorage.getItem(SCHLUESSEL) === 'spielen' ? 'spielen' : 'ueben' } catch { return 'ueben' }
  })
  function waehle(t) {
    setTab(t)
    try { localStorage.setItem(SCHLUESSEL, t) } catch { /* egal */ }
  }
  return [tab, waehle]
}

export default function UebTabs({ tab, onTab, ueben, spielen }) {
  return (
    <div className="ueb-tabs" role="tablist">
      <button type="button" role="tab" aria-selected={tab === 'ueben'} className={tab === 'ueben' ? 'an' : ''} onClick={() => onTab('ueben')}>
        {tr('Üben')} <small>{ueben}</small>
      </button>
      <button type="button" role="tab" aria-selected={tab === 'spielen'} className={tab === 'spielen' ? 'an' : ''} onClick={() => onTab('spielen')}>
        {tr('Spielen')} <small>{spielen}</small>
      </button>
    </div>
  )
}
