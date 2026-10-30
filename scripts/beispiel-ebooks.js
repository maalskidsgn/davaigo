#!/usr/bin/env node
/**
 * Legt die beiden Beispiel-E-Books an, die jeder Nutzer sieht.
 *
 * Aufbau wie bei Blinkist: Einführung → Kapitel → Schluss, jede
 * Überschrift eine Kernaussage. Alles zweisprachig; in der App
 * schaltet man unten zwischen Russisch und Deutsch um.
 *
 * Aufruf:  node scripts/beispiel-ebooks.js --anlegen
 *
 * Das --anlegen ist Absicht. Ohne das Wort passiert nichts: Die
 * Datei nur zum Nachsehen zu oeffnen oder sie versehentlich
 * auszufuehren soll keine Buecher in die Datenbank schreiben.
 */

import { readFileSync } from 'node:fs'

const env = {}
for (const zeile of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const t = zeile.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
  if (t) env[t[1]] = t[2].trim()
}

if (!process.argv.includes('--anlegen')) {
  console.error('Nichts getan. Zum Anlegen: node scripts/beispiel-ebooks.js --anlegen')
  process.exit(1)
}

const URL_BASIS = env.SUPABASE_URL
const KEY = env.SUPABASE_SERVICE_KEY
// ---------------------------------------------------------------
//  Buch 1 – A1: Kleine Gewohnheiten
// ---------------------------------------------------------------
//
// Auf Russisch NEU GESCHRIEBEN, nicht aus Habloo übersetzt. Ein
// A1-Text muss in der Zielsprache gedacht sein: Was im Spanischen
// ein leichter Satz ist, braucht im Russischen womöglich einen Fall,
// den ein Anfänger noch gar nicht kennt.
//
// Deshalb hier nur Präsens, kurze Sätze, Grundwortschatz – und an
// Fällen fast nur Nominativ und Akkusativ.
const BUCH_A1 = {
  titel: 'Маленькие привычки, большая жизнь',
  titel_de: 'Kleine Gewohnheiten, großes Leben',
  untertitel_es: 'Как маленькие шаги меняют твой день',
  untertitel_de: 'Wie kleine Schritte deinen Alltag verändern',
  autor: 'Davaigo',
  thema: 'Gewohnheiten',
  niveau: 'A1',
  kapitel: [
    {
      label_es: 'Введение', label_de: 'Einführung',
      titel_es: 'Что здесь для тебя: сила маленького',
      titel_de: 'Was drin ist für dich: die Kraft des Kleinen',
      text_es:
        'Многие люди хотят изменить свою жизнь. Они хотят больше спорта, хотят есть лучше или учить русский язык. Но большие планы — это трудно.\n\n' +
        'В этой книге простая идея: тебе не нужны большие планы. Тебе нужны маленькие привычки. Привычка — это то, что ты делаешь каждый день, почти без мыслей.',
      text_de:
        'Viele Menschen wollen ihr Leben verändern. Sie wollen mehr Sport, besser essen oder Russisch lernen. Aber große Pläne sind schwer.\n\n' +
        'Dieses Buch hat eine einfache Idee: Du brauchst keine großen Pläne. Du brauchst kleine Gewohnheiten. Eine Gewohnheit ist etwas, das du jeden Tag tust – fast ohne nachzudenken.',
    },
    {
      label_es: 'Глава 1', label_de: 'Kapitel 1',
      titel_es: 'Начинай так мало, чтобы нельзя было сказать нет',
      titel_de: 'Fang so klein an, dass du nicht Nein sagen kannst',
      text_es:
        'Хочешь больше читать? Читай одну страницу каждый вечер. Хочешь заниматься спортом? Делай две минуты каждое утро.\n\n' +
        'Важен ритм, а не размер. Когда дело очень лёгкое, ты делаешь его каждый день. А каждый день — это много.',
      text_de:
        'Du willst mehr lesen? Lies jeden Abend eine Seite. Du willst Sport machen? Mach jeden Morgen zwei Minuten.\n\n' +
        'Wichtig ist der Rhythmus, nicht die Größe. Wenn eine Sache sehr leicht ist, machst du sie jeden Tag. Und jeden Tag – das ist viel.',
    },
    {
      label_es: 'Глава 2', label_de: 'Kapitel 2',
      titel_es: 'Свяжи новую привычку с тем, что ты уже делаешь',
      titel_de: 'Verbinde die neue Gewohnheit mit etwas, das du schon tust',
      text_es:
        'Твой день уже имеет структуру: ты встаёшь, делаешь кофе, ешь. Используй эту структуру.\n\n' +
        'Формула простая: после X я делаю Y. После кофе я учу пять русских слов. После ужина я читаю одну страницу.',
      text_de:
        'Dein Tag hat schon eine Struktur: Du stehst auf, machst Kaffee, isst. Nutze diese Struktur.\n\n' +
        'Die Formel ist einfach: nach X mache ich Y. Nach dem Kaffee lerne ich fünf russische Wörter. Nach dem Abendessen lese ich eine Seite.',
    },
    {
      label_es: 'Итог', label_de: 'Fazit',
      titel_es: 'Итог: мало плюс каждый день — это много',
      titel_de: 'Das Fazit: klein plus jeden Tag = groß',
      text_es:
        'Тебе не нужна большая мотивация. Тебе нужны маленькие шаги и место в твоём дне.\n\n' +
        'Начни сегодня: выбери одну маленькую привычку. Одна страница, две минуты, пять слов. Через год это будет много.',
      text_de:
        'Du brauchst keine große Motivation. Du brauchst kleine Schritte und einen Platz in deinem Tag.\n\n' +
        'Fang heute an: Wähl eine kleine Gewohnheit. Eine Seite, zwei Minuten, fünf Wörter. In einem Jahr ist das viel.',
    },
  ],
  vokabeln: [
    { es: 'привычка', de: 'die Gewohnheit' },
    { es: 'менять', de: 'verändern' },
    { es: 'лёгкий', de: 'leicht' },
    { es: 'каждый день', de: 'jeden Tag' },
    { es: 'начинать', de: 'anfangen' },
    { es: 'страница', de: 'die Seite' },
    { es: 'после', de: 'nach' },
    { es: 'выбирать', de: 'auswählen' },
    { es: 'шаг', de: 'der Schritt' },
    { es: 'место', de: 'der Ort / Platz' },
  ],
}

// ---------------------------------------------------------------
//  Buch 2 – A2: Ikigai
// ---------------------------------------------------------------
const BUCH_A2 = {
  titel: 'Икигай: японские секреты долгой и счастливой жизни',
  titel_de: 'Ikigai: Japans Geheimnisse für ein langes, glückliches Leben',
  untertitel_es: 'Почему японцы находят смысл в маленьких вещах',
  untertitel_de: 'Warum die Japaner Sinn in den kleinen Dingen finden',
  autor: 'Ken Mogi',
  thema: 'Ikigai',
  niveau: 'A2',
  kapitel: [
    {
      label_es: 'Введение', label_de: 'Einführung',
      titel_es: 'О чём книга «Икигай»?',
      titel_de: 'Worum geht es in „Ikigai"?',
      text_es:
        'Кэн Моги объясняет в книге «Икигай» главный принцип японской жизни. Икигай значит примерно «причина вставать утром».\n\n' +
        'Для этого не нужна блестящая работа и не нужны большие деньги. Икигай может быть чем-то маленьким: ухаживать за садом, готовить хороший чай или каждый день видеть море.',
      text_de:
        'Ken Mogi erklärt in „Ikigai" ein zentrales Prinzip des japanischen Lebens. Ikigai bedeutet ungefähr „ein Grund, morgens aufzustehen".\n\n' +
        'Man braucht dafür keinen glänzenden Job und kein großes Geld. Das Ikigai kann etwas Kleines sein: einen Garten pflegen, einen guten Tee zubereiten oder jeden Tag das Meer sehen.',
    },
    {
      label_es: 'Глава 1', label_de: 'Kapitel 1',
      titel_es: 'Начинать с малого — японское искусство',
      titel_de: 'Klein anzufangen ist eine japanische Kunst',
      text_es:
        'Первая опора икигая — начинать с малого. Японские мастера суши учатся годами, прежде чем им разрешают готовить рис.\n\n' +
        'Моги говорит: когда ты делаешь маленькое дело очень внимательно, ты находишь в нём радость. Совершенство здесь не цель, а побочный результат.',
      text_de:
        'Die erste Säule des Ikigai ist, klein anzufangen. Japanische Sushi-Meister lernen jahrelang, bevor sie den Reis zubereiten dürfen.\n\n' +
        'Mogi sagt: Wenn du eine kleine Sache sehr sorgfältig machst, findest du Freude darin. Perfektion ist dabei nicht das Ziel, sondern ein Nebenergebnis.',
    },
    {
      label_es: 'Глава 2', label_de: 'Kapitel 2',
      titel_es: 'Отпустить себя — значит снять давление',
      titel_de: 'Sich selbst loszulassen nimmt den Druck',
      text_es:
        'Вторая опора — отпустить своё «я». В Японии многие работают не для того, чтобы стать известными. Они работают, потому что дело само важно.\n\n' +
        'Когда ты не думаешь всё время о себе, о своём образе и своём успехе, жизнь становится легче. Ты просто делаешь то, что делаешь.',
      text_de:
        'Die zweite Säule ist, das eigene Ich loszulassen. In Japan arbeiten viele nicht, um berühmt zu werden. Sie arbeiten, weil die Sache selbst wichtig ist.\n\n' +
        'Wenn du nicht ständig an dich denkst, an dein Bild und deinen Erfolg, wird das Leben leichter. Du machst einfach, was du machst.',
    },
    {
      label_es: 'Глава 3', label_de: 'Kapitel 3',
      titel_es: 'Гармония с другими делает жизнь прочной',
      titel_de: 'Harmonie mit anderen macht das Leben tragfähig',
      text_es:
        'Третья опора — гармония. На острове Окинава, где живёт особенно много людей старше ста лет, каждый принадлежит к группе: это моаи.\n\n' +
        'Моаи — это круг друзей на всю жизнь. Его члены помогают друг другу, едят вместе и празднуют вместе. Эта связь, говорит Моги, одна из причин долгой жизни.',
      text_de:
        'Die dritte Säule ist die Harmonie. Auf der Insel Okinawa, wo besonders viele über Hundertjährige leben, gehört jeder zu einer Gruppe: dem Moai.\n\n' +
        'Ein Moai ist ein Freundeskreis fürs Leben. Seine Mitglieder helfen sich, essen zusammen und feiern zusammen. Diese Verbundenheit, sagt Mogi, ist einer der Gründe für das lange Leben.',
    },
    {
      label_es: 'Итог', label_de: 'Fazit',
      titel_es: 'Икигай не ищут — его выращивают',
      titel_de: 'Das Ikigai sucht man nicht – man pflegt es',
      text_es:
        'Последняя мысль Моги: тебе не надо ехать далеко, чтобы найти свой икигай. Он уже есть в твоей жизни — в маленьких вещах, которые ты любишь.\n\n' +
        'Спроси себя: что радует меня утром? Это может быть кофе, прогулка, разговор. Расти эти вещи каждый день, и твоя жизнь получит смысл. Это и есть икигай.',
      text_de:
        'Mogis Botschaft am Ende: Du musst nicht weit reisen, um dein Ikigai zu finden. Es ist schon in deinem Leben – in den kleinen Dingen, die du liebst.\n\n' +
        'Frag dich: Was macht mir morgens Freude? Das kann der Kaffee sein, ein Spaziergang, ein Gespräch. Pflege diese Dinge jeden Tag, und dein Leben bekommt Sinn – genau das ist Ikigai.',
    },
  ],
  vokabeln: [
    { es: 'причина', de: 'der Grund' },
    { es: 'вставать', de: 'aufstehen' },
    { es: 'ухаживать', de: 'pflegen, sich kümmern um' },
    { es: 'опора', de: 'die Säule, die Stütze' },
    { es: 'радость', de: 'die Freude' },
    { es: 'цель', de: 'das Ziel' },
    { es: 'успех', de: 'der Erfolg' },
    { es: 'лёгкий', de: 'leicht' },
    { es: 'гармония', de: 'die Harmonie' },
    { es: 'смысл', de: 'der Sinn' },
  ],
}

// ---------------------------------------------------------------
//  Einspielen
// ---------------------------------------------------------------
const kopf = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
}

console.log('\n📖 Beispiel-E-Books anlegen\n')

await fetch(`${URL_BASIS}/rest/v1/ebooks?ist_beispiel=eq.true`, {
  method: 'DELETE',
  headers: kopf,
})

for (const buch of [BUCH_A1, BUCH_A2]) {
  const antwort = await fetch(`${URL_BASIS}/rest/v1/ebooks`, {
    method: 'POST',
    headers: { ...kopf, Prefer: 'return=representation' },
    body: JSON.stringify({ ...buch, nutzer_id: null, ist_beispiel: true }),
  })

  if (!antwort.ok) {
    console.error(`❌ ${buch.titel}: ${(await antwort.text()).slice(0, 200)}`)
    continue
  }
  console.log(`✅ ${buch.titel} (${buch.niveau}) – ${buch.kapitel.length} Kapitel`)
}

const alle = await (
  await fetch(`${URL_BASIS}/rest/v1/ebooks?select=titel,niveau&ist_beispiel=eq.true`, { headers: kopf })
).json()
console.log(`\n── Beispiel-Bücher in der Datenbank: ${alle.length}\n`)
