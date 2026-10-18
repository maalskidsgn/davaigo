/**
 * Der Feed – Russisch zum Durchwischen.
 *
 * Die Idee: Die Minuten, die sonst in Instagram verschwinden, sollen
 * hier landen. Also dasselbe Format – eine Karte pro Bildschirm,
 * hochwischen, nächste – nur mit Inhalt, der etwas bringt.
 *
 * Zwei Sorten Karten:
 *
 *   'haeppchen' – eine Grundlagen-Regel in dreißig Sekunden. Baut
 *                 sich beim Erscheinen auf (erst die Regel, dann
 *                 die Beispiele), jedes Beispiel antippbar zum
 *                 Anhören. Das sind die "Kurzvideos": kein echtes
 *                 Video, sondern eine bewegte Karte – lädt sofort,
 *                 kostet kein Hosting und ist in zwei Minuten
 *                 geändert, wenn etwas falsch ist.
 *
 *   'text'      – ein kurzer Wissenstext auf Russisch zum Hören und
 *                 Mitlesen, mit Umschalter auf Deutsch und
 *                 antippbaren Wörtern.
 *
 * Die Inhalte stehen HIER und kommen nicht aus der KI: Eine falsche
 * Grammatikregel im Feed wäre schlimmer als gar keine. Jede Zeile ist
 * von Hand geschrieben und geprüft.
 *
 * Zu den Feldnamen: Der russische Teil heißt `es`, der deutsche `de`.
 * Das ist ein Erbe des Spanischkurses, aus dem Davaigo entstanden
 * ist, und bleibt absichtlich so – Lektionen, Vertonung und
 * Prüfskripte benutzen dieselbe Schreibweise.
 */

// ---------------------------------------------------------------
//  Grundlagen-Häppchen
// ---------------------------------------------------------------
//
// Aufbau jeder Karte:
//   titel    – worum es geht, auf Deutsch
//   kern     – die Regel in EINEM Satz. Das ist die Hauptsache.
//   zeilen   – zwei bis vier Beispiele, je { es, de }
//   merke    – der eine Satz, den man behalten soll (optional)
//   farbe    – Nummer 0-5 für den Hintergrundverlauf
//
// Die Reihenfolge ist die des Nutzens, nicht die des Lehrbuchs: Was
// jemand am ersten Tag braucht, steht vorn. Die berüchtigten Brocken
// – Aspekt und Bewegungsverben – kommen später, aber sie kommen.

export const HAEPPCHEN = [
  {
    id: 'h-gruessen',
    titel: 'Hallo sagen',
    kern: 'Zwei Grüße reichen für den Anfang – einer förmlich, einer für Freunde.',
    zeilen: [
      { es: 'Здравствуйте', de: 'Guten Tag (förmlich, zu allen)' },
      { es: 'Привет', de: 'Hallo (nur zu Freunden und Jüngeren)' },
      { es: 'Доброе утро', de: 'Guten Morgen' },
      { es: 'Как дела?', de: 'Wie geht’s?' },
    ],
    merke: 'Здравствуйте spricht niemand aus wie geschrieben – es klingt wie „sdrasste“.',
    farbe: 0,
  },
  {
    id: 'h-falsche-freunde',
    titel: 'Die falschen Freunde',
    kern: 'Sechs Buchstaben sehen aus wie unsere und klingen völlig anders.',
    zeilen: [
      { es: 'ресторан', de: 'Restaurant – Р ist R, С ist S, Н ist N' },
      { es: 'вино', de: 'Wein – В ist W, nicht B' },
      { es: 'утро', de: 'Morgen – У ist U, nicht Y' },
      { es: 'хорошо', de: 'gut – Х ist ein Rachen-CH wie in „Bach“' },
    ],
    merke: 'В Н Р С У Х sind die sechs Fallen: W N R S U CH.',
    farbe: 1,
  },
  {
    id: 'h-betonung',
    titel: 'Das wandernde O',
    kern: 'Nur in der betonten Silbe klingt ein о wie o – überall sonst wird es zum a.',
    zeilen: [
      { es: 'молоко', de: 'Milch – gesprochen „malakó“' },
      { es: 'хорошо', de: 'gut – gesprochen „charaschó“' },
      { es: 'спасибо', de: 'danke – gesprochen „spassíba“' },
    ],
    merke: 'Ein Wort hat genau eine betonte Silbe. Lern sie mit, nicht nur die Buchstaben.',
    farbe: 2,
  },
  {
    id: 'h-kein-sein',
    titel: 'Das fehlende „ist“',
    kern: 'Im Präsens gibt es kein „sein“ – der Satz steht einfach ohne Verb da.',
    zeilen: [
      { es: 'Я студент.', de: 'Ich bin Student.' },
      { es: 'Он дома.', de: 'Er ist zu Hause.' },
      { es: 'Это хорошо.', de: 'Das ist gut.' },
      { es: 'Москва большая.', de: 'Moskau ist groß.' },
    ],
    merke: 'In der Vergangenheit kommt es zurück: Я был студентом.',
    farbe: 3,
  },
  {
    id: 'h-haben',
    titel: '„Haben“ gibt es auch nicht',
    kern: 'Statt „ich habe“ sagt man „bei mir ist“ – у меня есть.',
    zeilen: [
      { es: 'У меня есть собака.', de: 'Ich habe einen Hund.' },
      { es: 'У тебя есть время?', de: 'Hast du Zeit?' },
      { es: 'У нас нет машины.', de: 'Wir haben kein Auto.' },
    ],
    merke: 'Bei der Verneinung wird aus есть ein нет – und das Ding dahinter steht im Genitiv.',
    farbe: 4,
  },
  {
    id: 'h-du-sie',
    titel: 'ты oder вы?',
    kern: 'Dieselbe Entscheidung wie im Deutschen – nur triffst du sie öfter falsch herum.',
    zeilen: [
      { es: 'Как тебя зовут?', de: 'Wie heißt du?' },
      { es: 'Как вас зовут?', de: 'Wie heißen Sie?' },
      { es: 'Извините, пожалуйста.', de: 'Entschuldigen Sie bitte.' },
    ],
    merke: 'Im Zweifel вы. Zu höflich ist nie peinlich, zu vertraulich schon.',
    farbe: 5,
  },
  {
    id: 'h-vergangenheit',
    titel: 'Die Vergangenheit auf -л',
    kern: 'Die Vergangenheit richtet sich nicht nach der Person, sondern nach dem Geschlecht.',
    zeilen: [
      { es: 'Я читал.', de: 'Ich las. (ein Mann spricht)' },
      { es: 'Я читала.', de: 'Ich las. (eine Frau spricht)' },
      { es: 'Мы читали.', de: 'Wir lasen. (alle, egal wer)' },
    ],
    merke: 'Ein -а heißt hier nicht „sie“, sondern: Die sprechende Person ist weiblich.',
    farbe: 0,
  },
  {
    id: 'h-aspekt',
    titel: 'Film oder Foto?',
    kern: 'Jedes Verb gibt es zweimal: einmal für den Verlauf, einmal für das Ergebnis.',
    zeilen: [
      { es: 'Я читал книгу.', de: 'Ich las in einem Buch. (Film – irgendwann, eine Weile)' },
      { es: 'Я прочитал книгу.', de: 'Ich habe das Buch ausgelesen. (Foto – fertig)' },
      { es: 'Я делал уроки.', de: 'Ich machte Hausaufgaben.' },
      { es: 'Я сделал уроки.', de: 'Ich habe die Hausaufgaben fertig.' },
    ],
    merke: 'Das ist die größte Hürde des Russischen – und sie hat nichts mit der Zeit zu tun.',
    farbe: 1,
  },
  {
    id: 'h-bewegung',
    titel: 'Gehen ist nicht gleich gehen',
    kern: 'идти heißt: gerade unterwegs, in eine Richtung. ходить heißt: regelmäßig, hin und zurück.',
    zeilen: [
      { es: 'Я иду в магазин.', de: 'Ich gehe (jetzt) zum Laden.' },
      { es: 'Я хожу в школу.', de: 'Ich gehe (immer) zur Schule.' },
      { es: 'Я еду в Москву.', de: 'Ich fahre (jetzt) nach Moskau.' },
      { es: 'Я езжу на работу.', de: 'Ich fahre (täglich) zur Arbeit.' },
    ],
    merke: 'Zu Fuß идти/ходить, mit einem Fahrzeug ехать/ездить. Verwechseln fällt sofort auf.',
    farbe: 2,
  },
  {
    id: 'h-verneinung',
    titel: 'Doppelt verneint bleibt verneint',
    kern: 'Was im Deutschen falsch wäre, ist im Russischen Pflicht: alles wird mitverneint.',
    zeilen: [
      { es: 'Я ничего не знаю.', de: 'Ich weiß nichts. (wörtlich: nichts nicht)' },
      { es: 'Я никогда не был в Москве.', de: 'Ich war nie in Moskau.' },
      { es: 'Никто ничего не сказал.', de: 'Niemand hat etwas gesagt.' },
    ],
    merke: 'Das не vor dem Verb fällt nie weg – auch wenn schon ничего oder никогда dasteht.',
    farbe: 3,
  },
  {
    id: 'h-instrumental',
    titel: 'Womit und mit wem',
    kern: 'Für Werkzeug, Begleitung und Beruf gibt es einen eigenen Fall: den Instrumental.',
    zeilen: [
      { es: 'Я пишу ручкой.', de: 'Ich schreibe mit einem Stift.' },
      { es: 'Я иду с другом.', de: 'Ich gehe mit einem Freund.' },
      { es: 'Он работает врачом.', de: 'Er arbeitet als Arzt.' },
    ],
    merke: 'Ohne с ist es das Werkzeug, mit с die Begleitung. Beim Beruf steht kein „als“.',
    farbe: 4,
  },
  {
    id: 'h-zahlen',
    titel: 'Zählen verändert das Wort',
    kern: 'Nach 2, 3 und 4 steht etwas anderes als ab 5 – und nach 1 wieder etwas anderes.',
    zeilen: [
      { es: 'один час', de: 'eine Stunde' },
      { es: 'два часа', de: 'zwei Stunden' },
      { es: 'пять часов', de: 'fünf Stunden' },
    ],
    merke: '1 → Grundform, 2–4 → Genitiv Singular, ab 5 → Genitiv Plural. Gilt auch bei 22 und 25.',
    farbe: 5,
  },
]

// ---------------------------------------------------------------
//  Wissenstexte
// ---------------------------------------------------------------
//
// Kurz gehalten: vier bis fünf Sätze, damit eine Karte auf einen
// Bildschirm passt. Geschrieben auf A2/B1-Niveau.
//
// Nur Tatsachen, bei denen keine Unsicherheit besteht – lieber eine
// Zahl weglassen als sie zu erfinden. Wer hier etwas ergänzt, prüft
// vorher nach.
//
// Jede Karte: titelEs/titelDe, absaetze [{es, de}], woerter, merksatz

export const TEXTE = [
  {
    id: 't-baikal',
    titelEs: 'Самое глубокое озеро',
    titelDe: 'Der tiefste See der Welt',
    absaetze: [
      {
        es: 'Байкал в Сибири — самое глубокое озеро на Земле. Его глубина больше полутора километров.',
        de: 'Der Baikal in Sibirien ist der tiefste See der Erde. Seine Tiefe beträgt mehr als anderthalb Kilometer.',
      },
      {
        es: 'В озере очень много пресной воды. Зимой лёд такой прозрачный, что видно дно.',
        de: 'Im See ist sehr viel Süßwasser. Im Winter ist das Eis so durchsichtig, dass man den Grund sieht.',
      },
    ],
    woerter: [
      { wort: 'озеро', uebersetzung: 'der See' },
      { wort: 'глубина', uebersetzung: 'die Tiefe' },
      { wort: 'вода', uebersetzung: 'das Wasser' },
      { wort: 'лёд', uebersetzung: 'das Eis' },
    ],
    merksatz: 'Der Baikal ist so tief, dass alle Menschen der Erde Jahre daraus trinken könnten.',
    farbe: 1,
  },
  {
    id: 't-transsib',
    titelEs: 'Семь дней в поезде',
    titelDe: 'Sieben Tage im Zug',
    absaetze: [
      {
        es: 'Транссибирская магистраль — самая длинная железная дорога в мире. Она идёт от Москвы до Владивостока.',
        de: 'Die Transsibirische Eisenbahn ist die längste Bahnstrecke der Welt. Sie führt von Moskau bis Wladiwostok.',
      },
      {
        es: 'Поезд едет почти семь дней. За это время пассажиры пересекают восемь часовых поясов.',
        de: 'Der Zug fährt fast sieben Tage. In dieser Zeit überqueren die Fahrgäste acht Zeitzonen.',
      },
    ],
    woerter: [
      { wort: 'поезд', uebersetzung: 'der Zug' },
      { wort: 'дорога', uebersetzung: 'der Weg, die Strecke' },
      { wort: 'неделя', uebersetzung: 'die Woche' },
      { wort: 'ехать', uebersetzung: 'fahren' },
    ],
    merksatz: 'Wer die ganze Strecke fährt, stellt die Uhr unterwegs acht Mal vor.',
    farbe: 2,
  },
  {
    id: 't-osminog',
    titelEs: 'Три сердца осьминога',
    titelDe: 'Die drei Herzen des Oktopus',
    absaetze: [
      {
        es: 'У осьминога три сердца. Одно гонит кровь по телу, а два других — к жабрам.',
        de: 'Der Oktopus hat drei Herzen. Eines treibt das Blut durch den Körper, die zwei anderen zu den Kiemen.',
      },
      {
        es: 'Когда осьминог плывёт, главное сердце останавливается. Поэтому он больше любит ходить по дну.',
        de: 'Wenn der Oktopus schwimmt, bleibt das Hauptherz stehen. Deshalb läuft er lieber über den Grund.',
      },
    ],
    woerter: [
      { wort: 'сердце', uebersetzung: 'das Herz' },
      { wort: 'кровь', uebersetzung: 'das Blut' },
      { wort: 'тело', uebersetzung: 'der Körper' },
      { wort: 'плавать', uebersetzung: 'schwimmen' },
    ],
    merksatz: 'Beim Schwimmen steht dem Oktopus das Herz still – deshalb geht er lieber zu Fuß.',
    farbe: 3,
  },
  {
    id: 't-siyanie',
    titelEs: 'Свет на небе',
    titelDe: 'Licht am Himmel',
    absaetze: [
      {
        es: 'Северное сияние появляется, когда частицы от Солнца летят к Земле. Магнитное поле ведёт их к полюсам.',
        de: 'Das Nordlicht entsteht, wenn Teilchen von der Sonne zur Erde fliegen. Das Magnetfeld lenkt sie zu den Polen.',
      },
      {
        es: 'Там частицы встречают воздух, и небо начинает светиться. Чаще всего сияние зелёное.',
        de: 'Dort treffen die Teilchen auf die Luft, und der Himmel beginnt zu leuchten. Meistens ist das Leuchten grün.',
      },
    ],
    woerter: [
      { wort: 'небо', uebersetzung: 'der Himmel' },
      { wort: 'солнце', uebersetzung: 'die Sonne' },
      { wort: 'земля', uebersetzung: 'die Erde' },
      { wort: 'зелёный', uebersetzung: 'grün' },
    ],
    merksatz: 'Das Nordlicht ist Sonnenwind, der auf Luft trifft – deshalb leuchtet es in Polnähe.',
    farbe: 4,
  },
  {
    id: 't-med',
    titelEs: 'Мёд не портится',
    titelDe: 'Honig verdirbt nicht',
    absaetze: [
      {
        es: 'В мёде очень мало воды и много сахара. Поэтому бактерии не могут там жить.',
        de: 'Im Honig ist sehr wenig Wasser und viel Zucker. Deshalb können Bakterien dort nicht leben.',
      },
      {
        es: 'В египетских гробницах находили мёд, которому тысячи лет. Он всё ещё был съедобным.',
        de: 'In ägyptischen Grabkammern fand man Honig, der Tausende Jahre alt ist. Er war immer noch essbar.',
      },
    ],
    woerter: [
      { wort: 'мёд', uebersetzung: 'der Honig' },
      { wort: 'сахар', uebersetzung: 'der Zucker' },
      { wort: 'год', uebersetzung: 'das Jahr' },
      { wort: 'жить', uebersetzung: 'leben' },
    ],
    merksatz: 'Honig ist so zuckrig, dass Bakterien darin vertrocknen – er hält praktisch ewig.',
    farbe: 5,
  },
  {
    id: 't-sneg',
    titelEs: 'Почему снег белый',
    titelDe: 'Warum Schnee weiß ist',
    absaetze: [
      {
        es: 'Лёд прозрачный, а снег белый. Разница в том, что снег состоит из множества маленьких кристаллов.',
        de: 'Eis ist durchsichtig, Schnee aber weiß. Der Unterschied: Schnee besteht aus vielen kleinen Kristallen.',
      },
      {
        es: 'Свет отражается от каждого кристалла в разные стороны. Все цвета возвращаются вместе — и мы видим белый.',
        de: 'Das Licht wird von jedem Kristall in verschiedene Richtungen zurückgeworfen. Alle Farben kommen zusammen zurück – und wir sehen Weiß.',
      },
    ],
    woerter: [
      { wort: 'снег', uebersetzung: 'der Schnee' },
      { wort: 'белый', uebersetzung: 'weiß' },
      { wort: 'свет', uebersetzung: 'das Licht' },
      { wort: 'цвет', uebersetzung: 'die Farbe' },
    ],
    merksatz: 'Schnee ist weiß, weil er aus Millionen Spiegeln besteht – jeder einzelne ist durchsichtig.',
    farbe: 0,
  },
]

/**
 * Alle Karten im Wechsel: Häppchen, Text, Häppchen, Text …
 *
 * So trifft man nie drei Grammatikkarten hintereinander. Die
 * Reihenfolge ist fest und nicht zufällig: Dann kann man dort
 * weiterlesen, wo man aufgehört hat, und trifft nicht zweimal
 * dieselbe Karte.
 */
export function feedKarten() {
  const karten = []
  const max = Math.max(HAEPPCHEN.length, TEXTE.length)
  for (let i = 0; i < max; i++) {
    if (HAEPPCHEN[i]) karten.push({ art: 'haeppchen', ...HAEPPCHEN[i] })
    if (TEXTE[i]) karten.push({ art: 'text', ...TEXTE[i] })
  }
  return karten
}

// Welche Karten hat man schon gesehen? (localStorage)
const SPEICHER = 'feedGesehen'

export function gesehene() {
  try {
    return new Set(JSON.parse(localStorage.getItem(SPEICHER)) ?? [])
  } catch {
    return new Set()
  }
}

export function merkeGesehen(id) {
  try {
    const alle = gesehene()
    alle.add(id)
    localStorage.setItem(SPEICHER, JSON.stringify([...alle]))
  } catch {
    // Kein Speicher: dann merkt sich der Feed eben nichts
  }
}
