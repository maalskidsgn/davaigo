// Die Bausteine: Grammatik im Karteikasten.
//
// Ein Baustein ist eine Regel – "Ser oder estar", "Indefinido oder
// Imperfekt" – mit fünf Aufgaben dazu. Er läuft durch genau dasselbe
// Spaced-Repetition-Verfahren wie eine Vokabel: review() aus srs.js
// fasst nur intervall, leichtigkeit, level und due an und weiß gar
// nicht, dass hier eine Regel statt eines Wortes steckt.
//
// Deshalb gibt es KEINE zweite Lernlogik. Nur zweites Futter.
//
// Die Erklärung schreibt diese Datei nicht selbst: Jeder Baustein
// zeigt auf eine Lektion, und deren drei wissen-Karten SIND die
// Erklärung. So kann die Grammatik im Trainer nie etwas anderes
// behaupten als die Lektion, aus der sie stammt.

import { LEKTIONEN, mischen } from './lektionen.js'

/**
 * Die Familien – die grobe Sortierung in der Übersicht.
 *
 * Die Reihenfolge hier ist die Reihenfolge auf dem Bildschirm. Sie
 * folgt dem Kurs, nicht der Schulgrammatik: Erst das, was man zum
 * ersten Satz braucht, ganz zum Schluss der Subjuntivo.
 */
export const FAMILIEN = [
  { id: 'lesen', titel: 'Lesen & Laute', text: 'Kyrillisch, Betonung, das schwache o' },
  { id: 'fundamente', titel: 'Fundamente', text: 'Sätze ohne „ist“, ohne Artikel' },
  { id: 'menschen', titel: 'Menschen & Herkunft', text: 'vorstellen, aus und in' },
  { id: 'hoeflich', titel: 'Höflichkeit', text: 'du oder Sie, bitte und danke' },
  { id: 'zahlen', titel: 'Zahlen', text: 'Von null bis zehn' },
]

/**
 * Die Bausteine (russischer Starter-Satz für Modul 1).
 *
 * Jeder hat:
 *   id       – dauerhaft, steckt im Speicher des Nutzers. Nie ändern.
 *   titel    – wie er im Trainer heißt
 *   familie  – eine id aus FAMILIEN
 *   lektion  – die id der Lektion, die das erklärt (Sprung dorthin)
 *   regel    – EIN Satz. Die Kurzfassung, die auf der Karte steht.
 *   aufgaben – mindestens fünf: luecke, wahl, fehler, bauen
 */
export const BAUSTEINE = [
  // ---------------------------------------------------------------
  //  Lesen & Laute
  // ---------------------------------------------------------------
  {
    id: 'schwaches-o',
    titel: 'Das schwache o',
    familie: 'lesen',
    lektion: 'betonung',
    regel: 'Nur die betonte Silbe hat ein volles o – jedes andere о klingt wie a: молоко = „malakó“.',
    aufgaben: [
      { typ: 'wahl', satz: 'молоко klingt wie ___.', optionen: ['malakó', 'molokó', 'mólóko'], loesung: 'malakó', de: 'молоко = die Milch' },
      { typ: 'wahl', satz: 'хорошо klingt wie ___.', optionen: ['charaschó', 'chóroscho', 'choroschó'], loesung: 'charaschó', de: 'хорошо = gut' },
      { typ: 'wahl', satz: 'спасибо klingt wie ___.', optionen: ['spassíba', 'spassíbo', 'spossibó'], loesung: 'spassíba', de: 'спасибо = danke' },
      { typ: 'wahl', satz: 'Ein о klingt nur dann wie o, wenn es ___ ist.', optionen: ['betont', 'am Wortende', 'großgeschrieben'], loesung: 'betont', de: 'die O-Regel' },
      { typ: 'bauen', loesung: 'Вот молоко и сок', de: 'Hier sind Milch und Saft.' },
    ],
  },
  {
    id: 'falsche-freunde',
    titel: 'Die falschen Freunde',
    familie: 'lesen',
    lektion: 'kyrillisch-1',
    regel: 'В = W, Н = N, Р = R, С = S, У = U, Х = ch – sie sehen vertraut aus, klingen aber anders.',
    aufgaben: [
      { typ: 'wahl', satz: 'вот liest man ___.', optionen: ['wot', 'bot', 'vot mit v wie Vogel'], loesung: 'wot', de: 'вот = hier ist' },
      { typ: 'wahl', satz: 'нос liest man ___.', optionen: ['nos', 'hos', 'mos'], loesung: 'nos', de: 'нос = die Nase' },
      { typ: 'wahl', satz: 'Das kyrillische С klingt wie ___.', optionen: ['s', 'k', 'z'], loesung: 's', de: 'сок = der Saft' },
      { typ: 'wahl', satz: 'Das kyrillische Р klingt wie ___.', optionen: ['r', 'p', 'b'], loesung: 'r', de: 'море = das Meer' },
      { typ: 'bauen', loesung: 'Вот сок и суп', de: 'Hier sind Saft und Suppe.' },
    ],
  },
  // ---------------------------------------------------------------
  //  Fundamente
  // ---------------------------------------------------------------
  {
    id: 'kein-sein',
    titel: 'Das unsichtbare „ist“',
    familie: 'fundamente',
    lektion: 'kein-sein',
    regel: 'In der Gegenwart fällt „ist/bin/sind“ weg: Я студент – ich (bin) Student.',
    aufgaben: [
      { typ: 'luecke', satz: '___ это? – Это Анна.', loesung: 'Кто', hilfe: 'wer', de: 'Wer ist das? – Das ist Anna.' },
      { typ: 'luecke', satz: '___ это? – Это борщ.', loesung: 'Что', hilfe: 'was', de: 'Was ist das? – Das ist Borschtsch.' },
      { typ: 'wahl', satz: '„Er ist Student“ heißt: ___', optionen: ['Он студент', 'Он есть студент', 'Он это студент'], loesung: 'Он студент', de: 'kein „ist“ nötig' },
      { typ: 'fehler', satz: 'Она есть моя подруга.', falsch: 'есть', richtig: '(weglassen)', de: 'Sie ist meine Freundin – ohne „ist“.' },
      { typ: 'bauen', loesung: 'Это мой друг', de: 'Das ist mein Freund.' },
    ],
  },
  {
    id: 'kein-artikel',
    titel: 'Ohne der, die, das',
    familie: 'fundamente',
    lektion: 'einstieg',
    regel: 'Russisch kennt keine Artikel: дом heißt „Haus“ und „das Haus“ zugleich.',
    aufgaben: [
      { typ: 'wahl', satz: '„die Bank“ heißt ___.', optionen: ['банк', 'ла банк', 'банка'], loesung: 'банк', de: 'die Bank (Geldinstitut)' },
      { typ: 'wahl', satz: '„das Haus“ heißt ___.', optionen: ['дом', 'дас дом', 'дома'], loesung: 'дом', de: 'das Haus' },
      { typ: 'luecke', satz: 'Вот ___. (der Park)', loesung: 'парк', hilfe: 'der Park', de: 'Hier ist der Park.' },
      { typ: 'luecke', satz: 'Где ___? (das Telefon)', loesung: 'телефон', hilfe: 'das Telefon', de: 'Wo ist das Telefon?' },
      { typ: 'bauen', loesung: 'Это не проблема', de: 'Das ist kein Problem.' },
    ],
  },
  // ---------------------------------------------------------------
  //  Menschen & Herkunft
  // ---------------------------------------------------------------
  {
    id: 'iz-und-w',
    titel: 'из und в',
    familie: 'menschen',
    lektion: 'herkunft',
    regel: 'Woher? из + Land: я из Германии. Wo? в + Stadt: я живу в Берлине.',
    aufgaben: [
      { typ: 'luecke', satz: 'Я ___ Германии.', loesung: 'из', hilfe: 'woher = aus', de: 'Ich komme aus Deutschland.' },
      { typ: 'wahl', satz: 'Я живу ___ Берлине.', optionen: ['в', 'из', 'у'], loesung: 'в', de: 'Ich wohne in Berlin.' },
      { typ: 'wahl', satz: 'Откуда ты? – Я ___ России.', optionen: ['из', 'в', 'на'], loesung: 'из', de: 'Woher kommst du? – Aus Russland.' },
      { typ: 'fehler', satz: 'Анна живёт из Москве.', falsch: 'из', richtig: 'в', de: 'Anna wohnt IN Moskau – wo, nicht woher.' },
      { typ: 'bauen', loesung: 'Я из Германии', de: 'Ich komme aus Deutschland.' },
    ],
  },
  {
    id: 'menja-sowut',
    titel: 'меня зовут',
    familie: 'menschen',
    lektion: 'vorstellen',
    regel: 'меня зовут heißt wörtlich „mich nennt man“ – so sagst du deinen Namen.',
    aufgaben: [
      { typ: 'luecke', satz: '___ зовут Том.', loesung: 'Меня', hilfe: 'wörtlich: mich', de: 'Ich heiße Tom.' },
      { typ: 'wahl', satz: 'Zum Freund: Как ___ зовут?', optionen: ['тебя', 'вас', 'меня'], loesung: 'тебя', de: 'Wie heißt du?' },
      { typ: 'wahl', satz: 'Zum Fremden: Как ___ зовут?', optionen: ['вас', 'тебя', 'он'], loesung: 'вас', de: 'Wie heißen Sie?' },
      { typ: 'fehler', satz: 'Я зовут Анна.', falsch: 'Я', richtig: 'Меня', de: 'Ich heiße Anna – wörtlich „MICH nennt man“.' },
      { typ: 'bauen', loesung: 'Меня зовут Анна', de: 'Ich heiße Anna.' },
    ],
  },
  // ---------------------------------------------------------------
  //  Höflichkeit
  // ---------------------------------------------------------------
  {
    id: 'du-oder-sie',
    titel: 'привет oder здравствуйте',
    familie: 'hoeflich',
    lektion: 'begruessung',
    regel: 'привет und пока zu Freunden – здравствуйте und до свидания zu Fremden und Älteren.',
    aufgaben: [
      { typ: 'wahl', satz: 'Zur besten Freundin: ___!', optionen: ['Привет', 'Здравствуйте', 'До свидания'], loesung: 'Привет', de: 'hallo (locker)' },
      { typ: 'wahl', satz: 'Im Amt: ___!', optionen: ['Здравствуйте', 'Привет', 'Пока'], loesung: 'Здравствуйте', de: 'guten Tag (höflich)' },
      { typ: 'wahl', satz: 'Tschüss zum Kumpel: ___!', optionen: ['Пока', 'До свидания', 'Спокойной ночи'], loesung: 'Пока', de: 'tschüss (locker)' },
      { typ: 'fehler', satz: 'Привет, как вас зовут?', falsch: 'Привет', richtig: 'Здравствуйте', de: 'Wer „Sie“ sagt, grüßt auch höflich.' },
      { typ: 'bauen', loesung: 'Здравствуйте, как дела', de: 'Guten Tag, wie geht es Ihnen?' },
    ],
  },
  // ---------------------------------------------------------------
  //  Zahlen
  // ---------------------------------------------------------------
  {
    id: 'zahlen-0-10',
    titel: 'Die Zahlen 0–10',
    familie: 'zahlen',
    lektion: 'zahlen',
    regel: 'ноль, один, два, три, четыре, пять, шесть, семь, восемь, девять, десять.',
    aufgaben: [
      { typ: 'luecke', satz: 'один, два, ___, четыре', loesung: 'три', hilfe: '3', de: 'eins, zwei, drei, vier' },
      { typ: 'luecke', satz: 'восемь, девять, ___', loesung: 'десять', hilfe: '10', de: 'acht, neun, zehn' },
      { typ: 'wahl', satz: '5 = ___', optionen: ['пять', 'петь', 'пятьдесят'], loesung: 'пять', de: 'fünf' },
      { typ: 'wahl', satz: '7 = ___', optionen: ['семь', 'восемь', 'семья'], loesung: 'семь', de: 'sieben' },
      { typ: 'bauen', loesung: 'Два кофе пожалуйста', de: 'Zwei Kaffee, bitte.' },
    ],
  },
]

export const RUNDE_GROESSE = 5

/** Einen Baustein über seine id finden. */
export function bausteinMit(id) {
  return BAUSTEINE.find((b) => b.id === id) ?? null
}

/** Die Lektion, die diesen Baustein erklärt – für den Sprung dorthin. */
export function lektionZu(baustein) {
  return LEKTIONEN.find((l) => l.id === baustein.lektion) ?? null
}

/**
 * Ist dieser Baustein schon freigeschaltet?
 *
 * Regel: sobald die erklärende Lektion durch ist. Sonst bekäme ein
 * Anfänger am dritten Tag den Subjuntivo vorgesetzt.
 *
 * Die Ausnahme sind die ersten fünf: Wer die App frisch installiert
 * hat, soll den Trainer trotzdem anfassen können, statt vor einer
 * leeren Seite zu stehen.
 */
export function istOffen(baustein, lessonProgress = {}) {
  if (BAUSTEINE.indexOf(baustein) < 5) return true
  return Boolean(lessonProgress?.[baustein.lektion]?.fertig)
}

/** Alle freigeschalteten Bausteine, in Kursreihenfolge. */
export function offeneBausteine(lessonProgress = {}) {
  return BAUSTEINE.filter((b) => istOffen(b, lessonProgress))
}

/**
 * Der Baustein des Tages.
 *
 * Genommen wird der am längsten überfällige. Ein noch nie geübter
 * Baustein hat keinen Termin und gilt damit als maximal überfällig –
 * so arbeitet man sich der Reihe nach vor, ohne dass jemand eine
 * Reihenfolge festlegen müsste.
 *
 * Kein Zufall, kein Datum: Wer heute übt, schiebt den Termin nach
 * hinten, und morgen steht von selbst ein anderer oben. Genau das
 * ist mit "jeden Tag eine andere Grundlage" gemeint.
 */
export function bausteinDesTages(stand = {}, lessonProgress = {}) {
  const offen = offeneBausteine(lessonProgress)
  if (offen.length === 0) return null

  let bester = offen[0]
  let besterTermin = stand[bester.id]?.due ?? 0
  for (const b of offen) {
    const termin = stand[b.id]?.due ?? 0
    if (termin < besterTermin) {
      bester = b
      besterTermin = termin
    }
  }
  return bester
}

/** Wie viele Bausteine sind gerade fällig? Für die Zahl im Trainer. */
export function faelligeBausteine(stand = {}, lessonProgress = {}) {
  const jetzt = Date.now()
  return offeneBausteine(lessonProgress).filter(
    (b) => (stand[b.id]?.due ?? 0) <= jetzt
  )
}

/**
 * Die Aufgaben für eine Runde zusammenstellen.
 *
 * Gemischt, damit nicht jedes Mal dieselbe Reihenfolge kommt – aber
 * alle fünf, damit man die Regel von allen Seiten sieht. Kommen
 * später KI-Varianten dazu, werden sie hier eingehängt: Sie ersetzen
 * einzelne Aufgaben, nie die ganze Runde.
 */
export function baueRunde(baustein, zusatz = []) {
  const alle = [...baustein.aufgaben, ...zusatz]
  return mischen(alle).slice(0, RUNDE_GROESSE)
}

/** Die Bausteine einer Familie – für die Übersicht. */
export function bausteineVon(familie) {
  return BAUSTEINE.filter((b) => b.familie === familie.id)
}
