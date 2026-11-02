#!/usr/bin/env node
/**
 * Übersetzt die Lerninhalte (Lektionen, Module, Prüfstationen, Feed) ins
 * Englische und schreibt src/texte/inhalte-en.js.
 *
 * Bereits übersetzte Einträge bleiben stehen; es kostet also nur, was neu
 * ist. Nochmal übersetzen: den Eintrag dort löschen und erneut laufen lassen.
 *
 * Aufruf:  node scripts/uebersetze-inhalte.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { durchlaufe } from '../src/texte/durchlaufe.js'
import { LEKTIONEN, MODULE } from '../src/lektionen.js'
import { PRUEFSTATIONEN } from '../src/pruefstationen.js'
import { HAEPPCHEN, TEXTE as FEED_TEXTE } from '../src/feed.js'

const ZIEL = new URL('../src/texte/inhalte-en.js', import.meta.url)
const MODELL = 'gpt-4o'

const env = {}
for (const zeile of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const t = zeile.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
  if (t) env[t[1]] = t[2].trim().replace(/^"|"$/g, '')
}

// ---------- Einsammeln ----------
const paare = new Map() // 'ru\tde' -> {ru, de}
const texte = new Set()
const besuch = {
  paar: (ru, de) => (paare.set(ru + '\t' + de, { ru, de }), de),
  text: (de) => (texte.add(de), de),
}
for (const inhalt of [LEKTIONEN, MODULE, PRUEFSTATIONEN, HAEPPCHEN, FEED_TEXTE]) durchlaufe(inhalt, besuch)

const alt = await import(pathToFileURL(ZIEL.pathname).href)
const PAARE = { ...alt.PAARE }
const TEXTE = { ...alt.TEXTE }

const offenPaare = [...paare].filter(([k]) => !(k in PAARE))
const offenTexte = [...texte].filter((t) => !(t in TEXTE))
console.log(`Paare: ${paare.size} (offen ${offenPaare.length}) | Texte: ${texte.size} (offen ${offenTexte.length})`)

// ---------- Übersetzen ----------
const GRUND =
  'You localise a Russian course from German into English. The learners are English speakers ' +
  'who know no German. Translate into natural, friendly British-neutral English. ' +
  'Never output German. Russian (Cyrillic) text is never changed.'

const REGEL_PAARE =
  ' Each item has "ru" (Russian) and "de" (its German gloss); give the English gloss of the ' +
  'Russian in the sense the German shows. Vocabulary: no article on nouns ("coffee", not "the ' +
  'coffee"), verbs with "to" ("to read"). Keep helpful notes in brackets, translated: ' +
  '"(förmlich)" becomes "(formal)". Where German du/Sie shows the register, keep it visible with ' +
  '"(informal)" or "(formal)". A German name for a country or city becomes its English name. ' +
  'Sentences: translate the whole sentence naturally and faithfully to the Russian.'

const REGEL_TEXTE =
  ' These are lesson titles, goals and explanations. Keep every *asterisk-marked* Russian ' +
  'passage exactly, asterisks included, and keep any line breaks. Same friendly, direct tone, ' +
  'addressing the learner as "you". ' +
  'IMPORTANT: the explanations were written for German speakers. Whenever one compares Russian ' +
  'with German, or relies on German sounds, grammar, articles (der/die/das), cases, du/Sie or ' +
  'German spelling, REWRITE that part so it is true and useful for an English speaker: compare ' +
  'with English sounds and grammar instead, and do not claim English has grammatical cases like ' +
  'German. Pronunciation hints use English spelling ("ш" as "sh", "ж" as the "s" in "pleasure", ' +
  '"в" as "v", "х" as the "ch" in Scottish "loch"). Facts about Russian stay exactly correct. ' +
  'If a word is a loanword from German, you may say so, but never say it sounds "like in your ' +
  'language" when that only holds for German. Grammar terms use the usual English names ' +
  '(nominative, accusative, genitive, dative, instrumental, prepositional; perfective, imperfective).'

async function frage(system, eintraege, feld) {
  for (let versuch = 1; versuch <= 4; versuch++) {
    const antwort = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: MODELL,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system + ' Answer as JSON: {"out":[...]} with exactly one English string per input item, same order.' },
          { role: 'user', content: JSON.stringify(eintraege) },
        ],
      }),
    })
    if (antwort.ok) {
      const inhalt = (await antwort.json()).choices[0].message.content
      const out = JSON.parse(inhalt).out
      if (Array.isArray(out) && out.length === eintraege.length && out.every((x) => typeof x === 'string' && x.trim())) return out
      console.warn(`  Falsche Länge (${feld}), Versuch ${versuch}`)
    } else {
      console.warn(`  HTTP ${antwort.status}, Versuch ${versuch}`)
      await new Promise((r) => setTimeout(r, 4000 * versuch))
    }
  }
  throw new Error('Paket nicht übersetzbar: ' + feld)
}

const kursiv = (s) => (s.match(/\*[^*]+\*/g) ?? []).filter((m) => /\p{Script=Cyrillic}/u.test(m)).sort().join('|')

function speichern() {
  const sortiert = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b, 'ru')))
  writeFileSync(ZIEL, [
    '/**',
    ' * Die englischen Fassungen der Lerninhalte.',
    ' *',
    ' * ERZEUGT von scripts/uebersetze-inhalte.mjs. Korrekturen sind hier',
    ' * erlaubt und bleiben stehen: Das Skript übersetzt nur, was fehlt.',
    ' */',
    `export const PAARE = ${JSON.stringify(sortiert(PAARE), null, 1)}`,
    `export const TEXTE = ${JSON.stringify(sortiert(TEXTE), null, 1)}`,
    '',
  ].join('\n'))
}

async function arbeite(liste, groesse, bearbeite) {
  let naechster = 0
  const pakete = []
  for (let i = 0; i < liste.length; i += groesse) pakete.push(liste.slice(i, i + groesse))
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (naechster < pakete.length) {
      const nr = naechster++
      await bearbeite(pakete[nr])
      speichern()
      console.log(`  Paket ${nr + 1}/${pakete.length}`)
    }
  }))
}

await arbeite(offenPaare, 60, async (paket) => {
  const out = await frage(GRUND + REGEL_PAARE, paket.map(([, p]) => ({ ru: p.ru, de: p.de })), 'paare')
  paket.forEach(([k], i) => { PAARE[k] = out[i].trim() })
})

await arbeite(offenTexte, 20, async (paket) => {
  const out = await frage(GRUND + REGEL_TEXTE, paket, 'texte')
  paket.forEach((de, i) => {
    if (kursiv(de) !== kursiv(out[i])) console.warn('  Russisch verändert:', de.slice(0, 60), '->', out[i].slice(0, 60))
    TEXTE[de] = out[i].trim()
  })
})

speichern()
console.log('Fertig.')
