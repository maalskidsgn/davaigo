#!/usr/bin/env node
/**
 * Übersetzt alle Oberflächentexte, die im Code als tr('…') stehen, und
 * schreibt src/texte/oberflaeche-en.js. Vorhandenes bleibt stehen.
 * Nach neuen Texten einfach erneut laufen lassen.
 *
 * Aufruf:  node scripts/uebersetze-oberflaeche.mjs
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const SRC = new URL('../src/', import.meta.url)
const ZIEL = new URL('../src/texte/oberflaeche-en.js', import.meta.url)

const env = {}
for (const zeile of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const t = zeile.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
  if (t) env[t[1]] = t[2].trim().replace(/^"|"$/g, '')
}

const schluessel = new Map() // Text -> Datei
for (const datei of readdirSync(SRC)) {
  if (!/\.(jsx|js)$/.test(datei)) continue
  const q = readFileSync(new URL(datei, SRC), 'utf8')
  for (const m of q.matchAll(/\btr\(\s*'((?:[^'\\]|\\.)*)'/g)) {
    const text = m[1].replace(/\\n/g, '\n').replace(/\\(.)/g, '$1')
    if (!schluessel.has(text)) schluessel.set(text, datei)
  }
}

const VORHANDEN = (await import(pathToFileURL(ZIEL.pathname).href)).default
const fertig = { ...VORHANDEN }
const offen = [...schluessel].filter(([k]) => !(k in fertig))
console.log(`Texte: ${schluessel.size}, offen: ${offen.length}`)

const SYSTEM =
  'You localise the interface of Davaigo, an app for learning Russian, from German into natural English ' +
  'for English speakers. Items come as {f: source file, de: text}. They are UI strings and sometimes ' +
  'fragments of one sentence (a bold part follows the rest), so keep leading/trailing spaces and make ' +
  'fragments fit. Friendly, short, addressing the user as "you". Rules: keep placeholders {0} {1} exactly ' +
  '(move them if English word order needs it); keep emoji, arrows, punctuation style and any Cyrillic ' +
  'exactly; keep the names Davaigo, Dascha, YouTube, Spotify, Premium. Where the German refers to the ' +
  'language of the translations ("Deutsch", "Deutsch ausblenden", "auf Deutsch", "deutsche Fassung") it means ' +
  'the learner\'s own language: write "English" ("Hide English", "in English", "English version"). A text ' +
  'addressing German speakers becomes one for English speakers. "Russisch" = Russian. ' +
  'Glossary: Lektion lesson, Modul module, Mediathek library, Trainer trainer, Vokabeltrainer vocabulary ' +
  'trainer, Satz-Trainer sentence trainer, Karteikasten flashcard deck, Baustein building block, ' +
  'Prüfstation checkpoint, Meilenstein milestone, Rangliste leaderboard, Duell duel, Serie/Streak streak, ' +
  'Tagesziel daily goal, Lesestoff reading, Hörtext audio text, Lesetext reading text, Konto account, ' +
  'Abo subscription, fällig due, Fall/Fälle case/cases, Aspekt aspect, vollendet perfective, unvollendet ' +
  'imperfective, Bewegungsverben verbs of motion. Legal texts (source Recht.jsx, AGB): precise, formal English ' +
  '("Impressum" = "Legal notice", "Datenschutzerklärung" = "Privacy policy", "AGB" = "Terms and conditions", ' +
  '"Widerrufsrecht" = "Right of withdrawal"); keep names, addresses and references to German/EU law such as ' +
  'DSGVO (write GDPR), BGB. ' +
  'Answer as JSON {"out":[...]} with exactly one string per item, same order. Never output German.'

async function frage(paket) {
  for (let versuch = 1; versuch <= 4; versuch++) {
    const antwort = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: JSON.stringify(paket.map(([de, f]) => ({ f, de }))) },
        ],
      }),
    })
    if (antwort.ok) {
      const out = JSON.parse((await antwort.json()).choices[0].message.content).out
      const platz = (s) => (s.match(/\{\d+\}/g) ?? []).sort().join()
      if (Array.isArray(out) && out.length === paket.length && paket.every(([de], i) => typeof out[i] === 'string' && platz(de) === platz(out[i]))) return out
      console.warn('  Antwort passt nicht, Versuch', versuch)
    } else {
      console.warn('  HTTP', antwort.status)
      await new Promise((r) => setTimeout(r, 4000 * versuch))
    }
  }
  throw new Error('Paket nicht übersetzbar: ' + paket[0][0])
}

function speichern() {
  const sortiert = Object.fromEntries(Object.entries(fertig).sort(([a], [b]) => a.localeCompare(b, 'de')))
  writeFileSync(ZIEL, '/**\n * Die englischen Oberflächentexte. Schlüssel ist der deutsche Text.\n *\n' +
    ' * ERZEUGT von scripts/uebersetze-oberflaeche.mjs. Korrekturen sind hier\n * erlaubt und bleiben stehen.\n */\n' +
    `export default ${JSON.stringify(sortiert, null, 1)}\n`)
}

const pakete = []
// Nach Datei sortiert: Bruchstücke desselben Satzes landen so beieinander
offen.sort((a, b) => a[1].localeCompare(b[1]))
for (let i = 0; i < offen.length; i += 40) pakete.push(offen.slice(i, i + 40))
let naechster = 0
await Promise.all(Array.from({ length: 6 }, async () => {
  while (naechster < pakete.length) {
    const nr = naechster++
    const out = await frage(pakete[nr])
    pakete[nr].forEach(([de], i) => { fertig[de] = out[i] })
    speichern()
    console.log(`  Paket ${nr + 1}/${pakete.length}`)
  }
}))
speichern()
console.log('Fertig.')
