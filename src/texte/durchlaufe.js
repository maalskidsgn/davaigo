/**
 * Geht durch einen Lerninhalt und meldet jeden Text, der übersetzt wird.
 *
 * Die App benutzt das zum Tauschen, scripts/uebersetze-inhalte.mjs zum
 * Einsammeln. Weil beide denselben Weg gehen, kann das Skript nichts
 * übersehen, was die App später nachschlägt.
 *
 * besuch.paar(ru, de) – ein deutscher Text mit russischem Gegenstück.
 * Der Schlüssel ist das Paar, nicht das deutsche Wort allein: "die Bank"
 * kann auf Russisch zweierlei sein und auf Englisch ebenso.
 * besuch.text(de)     – ein Erklärtext ohne Gegenstück.
 *
 * Beide liefern den neuen Wert zurück.
 */

/** Felder, die keine deutschen Texte sind. Russisch bleibt Russisch. */
const NIE = new Set([
  'id', 'emoji', 'farbe', 'niveau', 'modul', 'lektion', 'familie', 'typ',
  'es', 'beispielEs', 'titelEs', 'wort', 'sprecher', 'vorher', 'wiederholt',
  'kursNr', 'von', 'bis',
])

/** Deutsches Feld -> Feld mit dem russischen Gegenstück. */
const PARTNER = { de: 'es', beispielDe: 'beispielEs', titelDe: 'titelEs', uebersetzung: 'wort' }

const hatInhalt = (s) => /\p{Script=Latin}/u.test(s)

export function durchlaufe(wert, besuch) {
  if (Array.isArray(wert)) {
    wert.forEach((x, i) => {
      if (typeof x === 'string') {
        if (hatInhalt(x)) wert[i] = besuch.text(x)
      } else durchlaufe(x, besuch)
    })
  } else if (wert && typeof wert === 'object') {
    for (const k of Object.keys(wert)) {
      if (NIE.has(k)) continue
      const v = wert[k]
      if (typeof v === 'string') {
        if (!hatInhalt(v)) continue
        const ru = wert[PARTNER[k]]
        wert[k] = typeof ru === 'string' ? besuch.paar(ru, v) : besuch.text(v)
      } else durchlaufe(v, besuch)
    }
  }
}
