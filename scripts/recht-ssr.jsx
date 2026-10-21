/**
 * Der Einstiegspunkt, mit dem die Pflichtseiten zu HTML werden.
 *
 * Wird nicht im Browser geladen, sondern einmal beim Bauen: Vite
 * übersetzt diese Datei für Node (--ssr), scripts/baue-recht.mjs
 * führt sie aus und schreibt das Ergebnis nach public/.
 *
 * Der Sinn: Impressum, Datenschutz und AGB stehen EINMAL in
 * src/Recht.jsx. Die App zeigt sie dort, und die statischen Seiten
 * entstehen aus derselben Quelle. Würde man den Text abschreiben,
 * liefen beide Fassungen nach der ersten Änderung auseinander – und
 * ausgerechnet bei Rechtstexten wäre das ein ernstes Problem.
 *
 * renderToStaticMarkup statt renderToString: Wir brauchen kein React
 * im Browser, das HTML soll einfach nur dastehen. Deshalb auch keine
 * data-reactroot-Attribute im Ergebnis.
 */

import { renderToStaticMarkup } from 'react-dom/server'
import { Impressum, Datenschutz, AGB } from '../src/Recht.jsx'

export function seiten() {
  // onZurueck läuft ins Leere: Auf der statischen Seite gibt es
  // keinen App-Zustand, zu dem man zurückkehren könnte. Der Knopf
  // wird hinterher aus dem HTML entfernt.
  const nichts = () => {}

  return {
    impressum: renderToStaticMarkup(<Impressum onZurueck={nichts} />),
    datenschutz: renderToStaticMarkup(<Datenschutz onZurueck={nichts} />),
    agb: renderToStaticMarkup(<AGB onZurueck={nichts} />),
  }
}
