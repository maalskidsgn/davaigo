// ============================================================
//  Das Lektions-Schema (Davaigo / Russisch)
// ============================================================
// Jede Lektion folgt derselben Struktur wie bei Habloo. WICHTIG:
// Die Felder heißen aus historischen Gründen weiter "es" und
// "beispielEs" – sie tragen hier natürlich RUSSISCH. So bleiben
// Engine, Prüfer und künftige Habloo-Updates ohne Umbau nutzbar.
//
//  PFLICHT
//    id            eindeutige Kennung, wird nie wieder geändert
//    titel         Anzeigename
//    emoji         Symbol auf der Landkarte
//    beschreibung  ein Satz, was man danach kann
//    ziele[]       2–4 konkrete Lernziele
//    items[]       8–12 Wörter mit Beispielsatz auf RU und DE
//    wissen[]      Kultur- und Grammatikkarten (*Chips* mit Sternchen)
//    dialog[]      Gespräch mit festen Sprechern
//
//  KURS (für den 180-Lektionen-Aufbau, siehe docs/KURSPLAN.md)
//    niveau        A1.1 … B2.1, Einstufung nach GER
//    grammatik[]   HÖCHSTENS EIN neuer Schwerpunkt je Lektion
//    wiederholt[]  IDs früherer Lektionen, die mitlaufen
//    vorher[]      Lektionen, die man vorher gemacht haben sollte
//    kulturnotiz   ein Satz Landeskunde

export const LEKTIONEN = [
  {
    id: 'einstieg',
    niveau: 'A1.1',
    kursNr: 1,
    grammatik: ['Verwandte Wörter erkennen'],
    wiederholt: [],
    vorher: [],
    kulturnotiz: 'Russisch sprechen rund 250 Millionen Menschen – es ist die meistgesprochene Muttersprache Europas.',
    titel: 'Du kannst schon Russisch',
    emoji: '🚪',
    beschreibung: 'Der Einstieg – und warum du mehr verstehst, als du denkst',
    ziele: [
      'Verwandte Wörter auf Anhieb verstehen',
      'Keine Angst mehr vor kyrillischen Buchstaben haben',
      'Wissen, wie dieser Kurs aufgebaut ist',
    ],
    items: [
      { es: 'кофе', de: 'der Kaffee', beispielEs: 'Кофе, пожалуйста.', beispielDe: 'Einen Kaffee, bitte.' },
      { es: 'метро', de: 'die Metro', beispielEs: 'Метро там.', beispielDe: 'Die Metro ist dort.' },
      { es: 'такси', de: 'das Taxi', beispielEs: 'Такси уже тут.', beispielDe: 'Das Taxi ist schon hier.' },
      { es: 'банк', de: 'die Bank (Geldinstitut)', beispielEs: 'Банк в центре.', beispielDe: 'Die Bank ist im Zentrum.' },
      { es: 'парк', de: 'der Park', beispielEs: 'Парк очень красивый.', beispielDe: 'Der Park ist sehr schön.' },
      { es: 'спорт', de: 'der Sport', beispielEs: 'Спорт – это жизнь.', beispielDe: 'Sport ist Leben.' },
      { es: 'музей', de: 'das Museum', beispielEs: 'Музей сегодня открыт.', beispielDe: 'Das Museum ist heute geöffnet.' },
      { es: 'ресторан', de: 'das Restaurant', beispielEs: 'Ресторан очень хороший.', beispielDe: 'Das Restaurant ist sehr gut.' },
      { es: 'телефон', de: 'das Telefon', beispielEs: 'Где мой телефон?', beispielDe: 'Wo ist mein Telefon?' },
      { es: 'интернет', de: 'das Internet', beispielEs: 'Тут есть интернет?', beispielDe: 'Gibt es hier Internet?' },
      { es: 'музыка', de: 'die Musik', beispielEs: 'Музыка – это класс!', beispielDe: 'Musik ist klasse!' },
      { es: 'проблема', de: 'das Problem', beispielEs: 'Это не проблема.', beispielDe: 'Das ist kein Problem.' },
    ],
    wissen: [
      {
        emoji: '🎁',
        titel: 'Hunderte Wörter bekommst du geschenkt',
        text: 'Russisch steckt voller internationaler Wörter: *кофе*, *метро*, *такси*, *банк*, *спорт*. Sie klingen fast wie im Deutschen – nur die Schrift ist neu. Genau die knackst du in den nächsten drei Lektionen.',
      },
      {
        emoji: '🔐',
        titel: 'Kyrillisch ist ein Code, kein Hindernis',
        text: 'Das Alphabet hat 33 Buchstaben. Sechs kennst du schon (*А К М О Т Е*), etliche sehen nur anders aus, als sie klingen – und der Rest ist schnell gelernt. Nach drei Lektionen liest du echte Wörter.',
      },
      {
        emoji: '🧭',
        titel: 'So läuft dieser Kurs',
        text: 'Jede Lektion bringt neue Wörter, einen Dialog und Übungen – und holt ein paar alte Wörter zurück, damit nichts verloren geht. Nebenbei sammelst du alles im Vokabeltrainer, der weiß, wann du wiederholen musst.',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Кофе?', de: 'Kaffee?' },
      { sprecher: 'Tom', es: 'Да! Кофе – это класс.', de: 'Ja! Kaffee ist klasse.' },
      { sprecher: 'Anna', es: 'Ресторан или парк?', de: 'Restaurant oder Park?' },
      { sprecher: 'Tom', es: 'Парк! Там музыка.', de: 'Der Park! Dort ist Musik.' },
    ],
  },

  {
    id: 'kyrillisch-1',
    niveau: 'A1.1',
    kursNr: 2,
    grammatik: ['Kyrillisch I: echte und falsche Freunde'],
    wiederholt: [],
    vorher: ['einstieg'],
    kulturnotiz: 'Das kyrillische Alphabet geht auf die Slawenlehrer Kyrill und Method zurück – daher der Name.',
    titel: 'Kyrillisch I: Alte Bekannte',
    emoji: '🔤',
    beschreibung: 'Zwölf Buchstaben, die du (fast) schon kennst',
    ziele: [
      'Die echten Freunde А, Е, К, М, О, Т lesen',
      'Die falschen Freunde В, Н, Р, С, У, Х durchschauen',
      'Deine ersten russischen Wörter selbst entziffern',
    ],
    items: [
      { es: 'мама', de: 'die Mama', beispielEs: 'Мама там.', beispielDe: 'Mama ist dort.' },
      { es: 'кот', de: 'der Kater', beispielEs: 'Кот тут.', beispielDe: 'Der Kater ist hier.' },
      { es: 'нет', de: 'nein', beispielEs: 'Нет, это не кот.', beispielDe: 'Nein, das ist kein Kater.' },
      { es: 'вот', de: 'hier ist', beispielEs: 'Вот метро.', beispielDe: 'Hier ist die Metro.' },
      { es: 'сок', de: 'der Saft', beispielEs: 'Вот сок.', beispielDe: 'Hier ist der Saft.' },
      { es: 'суп', de: 'die Suppe', beispielEs: 'Суп очень вкусный.', beispielDe: 'Die Suppe ist sehr lecker.' },
      { es: 'море', de: 'das Meer', beispielEs: 'Море там.', beispielDe: 'Das Meer ist dort.' },
      { es: 'утро', de: 'der Morgen', beispielEs: 'Утро! Кофе?', beispielDe: 'Morgen! Kaffee?' },
      { es: 'окно', de: 'das Fenster', beispielEs: 'Вот окно.', beispielDe: 'Hier ist das Fenster.' },
      { es: 'нос', de: 'die Nase', beispielEs: 'Это нос кота.', beispielDe: 'Das ist die Nase des Katers.' },
    ],
    wissen: [
      {
        emoji: '🤝',
        titel: 'Sechs echte Freunde',
        text: '*А, Е, К, М, О, Т* sehen aus wie bei uns und klingen auch so. Damit liest du sofort: *мама*, *кот*, *атом*. Du kannst also schon lesen – nur ein bisschen.',
      },
      {
        emoji: '🎭',
        titel: 'Sechs falsche Freunde',
        text: 'Diese Buchstaben tragen Masken: *В* = W, *Н* = N, *Р* = R, *С* = S, *У* = U, *Х* = ch. *вот* liest sich „wot“, *нос* ist „nos“. Merk dir: Nicht dem Aussehen trauen, dem Klang!',
      },
      {
        emoji: '🗣️',
        titel: 'Der beste Trick: laut lesen',
        text: 'Lies jedes Wort laut, Buchstabe für Buchstabe. Was das Ohr einmal gehört hat, erkennt das Auge beim nächsten Mal von selbst – so lernten auch russische Kinder lesen.',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Вот суп и сок.', de: 'Hier sind Suppe und Saft.' },
      { sprecher: 'Tom', es: 'Суп? Класс!', de: 'Suppe? Klasse!' },
      { sprecher: 'Anna', es: 'А кот там?', de: 'Und ist der Kater dort?' },
      { sprecher: 'Tom', es: 'Нет, кот тут.', de: 'Nein, der Kater ist hier.' },
    ],
  },

  {
    id: 'kyrillisch-2',
    niveau: 'A1.1',
    kursNr: 4,
    grammatik: ['Kyrillisch II: die neuen Zeichen'],
    wiederholt: ['kyrillisch-falsche', 'einstieg'],
    vorher: ['kyrillisch-falsche'],
    kulturnotiz: 'Kyrillisch schreiben über 250 Millionen Menschen – neben Russisch auch Ukrainisch, Serbisch und Bulgarisch.',
    titel: 'Kyrillisch II: Die Neuen',
    emoji: '✍️',
    beschreibung: 'Zehn neue Zeichen – und du liest schon halbe Sätze',
    ziele: [
      'Б, Г, Д, З, И, Й, Л, П, Ф, Э sicher lesen',
      'Б und В nie wieder verwechseln',
      'Ganze Alltagswörter flüssig entziffern',
    ],
    items: [
      { es: 'да', de: 'ja', beispielEs: 'Да, это дом.', beispielDe: 'Ja, das ist ein Haus.' },
      { es: 'дом', de: 'das Haus', beispielEs: 'Дом там.', beispielDe: 'Das Haus ist dort.' },
      { es: 'вода', de: 'das Wasser', beispielEs: 'Вода тут.', beispielDe: 'Das Wasser ist hier.' },
      { es: 'где', de: 'wo', beispielEs: 'Где дом?', beispielDe: 'Wo ist das Haus?' },
      { es: 'брат', de: 'der Bruder', beispielEs: 'Это мой брат.', beispielDe: 'Das ist mein Bruder.' },
      { es: 'друг', de: 'der Freund', beispielEs: 'Том – мой друг.', beispielDe: 'Tom ist mein Freund.' },
      { es: 'лимон', de: 'die Zitrone', beispielEs: 'Лимон в воде.', beispielDe: 'Die Zitrone ist im Wasser.' },
      { es: 'салат', de: 'der Salat', beispielEs: 'Салат и суп.', beispielDe: 'Salat und Suppe.' },
      { es: 'гид', de: 'der Reiseführer (Person)', beispielEs: 'Гид в музее.', beispielDe: 'Der Reiseführer ist im Museum.' },
      { es: 'зима', de: 'der Winter', beispielEs: 'Зима – это снег.', beispielDe: 'Winter – das ist Schnee.' },
    ],
    wissen: [
      {
        emoji: '⚡',
        titel: 'Die Stolperfalle Б und В',
        text: '*Б* ist unser B (*брат* = Bruder), *В* bleibt W (*вода* = „wada“). Das ist DIE Verwechslung schlechthin – wer die zwei auseinanderhält, hat das Schwerste hinter sich.',
      },
      {
        emoji: '🧩',
        titel: 'Die übrigen Neuen',
        text: '*Г* = G, *Д* = D, *З* = stimmhaftes S wie in „Rose“, *И* = i, *Й* = kurzes j, *Л* = L, *П* = P, *Ф* = F, *Э* = offenes E. Zusammen mit Lektion 2 liest du jetzt 22 von 33 Buchstaben!',
      },
      {
        emoji: '🏠',
        titel: 'Дом, вода, да',
        text: 'Mit den Neuen liest du Kernwörter des Alltags: *да* (ja), *дом* (Haus), *вода* (Wasser), *где* (wo). Aus Buchstaben werden Sätze: *Где дом?* – Wo ist das Haus?',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Где дом?', de: 'Wo ist das Haus?' },
      { sprecher: 'Tom', es: 'Дом там. Вот парк.', de: 'Das Haus ist dort. Hier ist der Park.' },
      { sprecher: 'Anna', es: 'А где вода?', de: 'Und wo ist das Wasser?' },
      { sprecher: 'Tom', es: 'Вот вода и лимон.', de: 'Hier sind Wasser und Zitrone.' },
    ],
  },

  {
    id: 'kyrillisch-3',
    niveau: 'A1.1',
    kursNr: 5,
    grammatik: ['Kyrillisch III: Zischlaute und weiche Zeichen'],
    wiederholt: ['einstieg', 'kyrillisch-1'],
    vorher: ['kyrillisch-2'],
    kulturnotiz: 'Борщ gilt als DAS Nationalgericht des Ostens – die rote Farbe kommt von der Roten Bete.',
    titel: 'Kyrillisch III: Die Besonderen',
    emoji: '🌶️',
    beschreibung: 'Die letzten elf Zeichen – jetzt liest du ALLES',
    ziele: [
      'Die Zischlaute Ж, Ч, Ш, Щ, Ц unterscheiden',
      'Я, Ю, Ё als ja, ju, jo lesen',
      'Wissen, was Ь, Ъ und Ы tun',
    ],
    items: [
      { es: 'я', de: 'ich', beispielEs: 'Я тут.', beispielDe: 'Ich bin hier.' },
      { es: 'чай', de: 'der Tee', beispielEs: 'Чай или кофе?', beispielDe: 'Tee oder Kaffee?' },
      { es: 'борщ', de: 'der Borschtsch', beispielEs: 'Борщ очень вкусный.', beispielDe: 'Der Borschtsch ist sehr lecker.' },
      { es: 'шоколад', de: 'die Schokolade', beispielEs: 'Шоколад и чай.', beispielDe: 'Schokolade und Tee.' },
      { es: 'журнал', de: 'die Zeitschrift', beispielEs: 'Вот журнал.', beispielDe: 'Hier ist die Zeitschrift.' },
      { es: 'цирк', de: 'der Zirkus', beispielEs: 'Цирк в парке.', beispielDe: 'Der Zirkus ist im Park.' },
      { es: 'яблоко', de: 'der Apfel', beispielEs: 'Яблоко тут.', beispielDe: 'Der Apfel ist hier.' },
      { es: 'ключ', de: 'der Schlüssel', beispielEs: 'Где ключ?', beispielDe: 'Wo ist der Schlüssel?' },
      { es: 'ночь', de: 'die Nacht', beispielEs: 'Ночь. Пока!', beispielDe: 'Es ist Nacht. Tschüss!' },
      { es: 'сыр', de: 'der Käse', beispielEs: 'Сыр и салат.', beispielDe: 'Käse und Salat.' },
    ],
    wissen: [
      {
        emoji: '🐝',
        titel: 'Die Zisch-Familie',
        text: '*Ж* summt wie in „Garage“, *Ш* = sch, *Щ* = weiches „schtsch“ (*борщ*!), *Ч* = tsch, *Ц* = z wie in „Zirkus“ – *цирк* liest sich fast von selbst.',
      },
      {
        emoji: '🎶',
        titel: 'Drei Buchstaben mit j',
        text: '*Я* = ja (und heißt allein „ich“!), *Ю* = ju, *Ё* = jo – die Pünktchen auf dem *ё* sind immer betont. *яблоко* = „jábloko“.',
      },
      {
        emoji: '🪶',
        titel: 'Die stillen Helfer',
        text: '*Ь* spricht man nicht – es macht den Buchstaben davor weich (*ночь*). *Ы* ist ein dunkles i aus dem Bauch (*сыр*). Damit kennst du ALLE 33 Buchstaben. Du liest jetzt Russisch!',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Чай или кофе?', de: 'Tee oder Kaffee?' },
      { sprecher: 'Tom', es: 'Чай и шоколад!', de: 'Tee und Schokolade!' },
      { sprecher: 'Anna', es: 'А борщ?', de: 'Und Borschtsch?' },
      { sprecher: 'Tom', es: 'Да! Борщ и сыр.', de: 'Ja! Borschtsch und Käse.' },
    ],
  },

  {
    id: 'betonung',
    niveau: 'A1.1',
    kursNr: 13,
    grammatik: ['Vokalreduktion: unbetontes о klingt wie a'],
    wiederholt: ['i-y', 'kyrillisch-3'],
    vorher: ['i-y'],
    kulturnotiz: 'спасибо kommt von „спаси Бог“ – „Gott schütze dich“. Das Dankeschön ist ein kleiner Segen.',
    titel: 'Betonung & das schwache O',
    emoji: '🎯',
    beschreibung: 'Warum молоко wie „malakó“ klingt',
    ziele: [
      'Die betonte Silbe hören und treffen',
      'Unbetontes о als a sprechen',
      'спасибо und пожалуйста wie ein Profi sagen',
    ],
    items: [
      { es: 'хорошо', de: 'gut', beispielEs: 'Всё хорошо!', beispielDe: 'Alles gut!' },
      { es: 'спасибо', de: 'danke', beispielEs: 'Спасибо, мама!', beispielDe: 'Danke, Mama!' },
      { es: 'пожалуйста', de: 'bitte', beispielEs: 'Чай, пожалуйста.', beispielDe: 'Tee, bitte.' },
      { es: 'молоко', de: 'die Milch', beispielEs: 'Молоко в кофе?', beispielDe: 'Milch in den Kaffee?' },
      { es: 'сейчас', de: 'jetzt', beispielEs: 'Сейчас утро.', beispielDe: 'Jetzt ist Morgen.' },
      { es: 'немного', de: 'ein bisschen', beispielEs: 'Немного молока, пожалуйста.', beispielDe: 'Ein bisschen Milch, bitte.' },
      { es: 'потом', de: 'später', beispielEs: 'Суп потом.', beispielDe: 'Die Suppe später.' },
      { es: 'дорого', de: 'teuer', beispielEs: 'Такси – это дорого.', beispielDe: 'Taxi – das ist teuer.' },
    ],
    wissen: [
      {
        emoji: '🥛',
        titel: 'Ein Wort, EIN Star',
        text: 'Jedes russische Wort hat genau eine betonte Silbe – die spricht man voll aus. Alle anderen werden leise und schlampig: *молоко* klingt „malakó“, *хорошо* klingt „charaschó“.',
      },
      {
        emoji: '🅾️',
        titel: 'Die O-Regel',
        text: 'Nur ein BETONTES *о* klingt wie o. Jedes unbetonte *о* wird zum a. Deshalb hörst du in *спасибо* („spassíba“) gar kein o – obwohl eins dasteht.',
      },
      {
        emoji: '✨',
        titel: 'Zwei Zauberwörter',
        text: '*спасибо* (danke) und *пожалуйста* (bitte) öffnen jede Tür. Und praktisch: *пожалуйста* heißt auch „bitte schön“, wenn man etwas reicht. Zwei Wörter, dreifache Wirkung.',
      },
    ],
    dialog: [
      { sprecher: 'Tom', es: 'Молоко, пожалуйста.', de: 'Milch, bitte.' },
      { sprecher: 'Anna', es: 'Сейчас… Вот молоко.', de: 'Moment… Hier ist die Milch.' },
      { sprecher: 'Tom', es: 'Спасибо!', de: 'Danke!' },
      { sprecher: 'Anna', es: 'Пожалуйста!', de: 'Bitte schön!' },
    ],
  },

  {
    id: 'begruessung',
    niveau: 'A1.1',
    kursNr: 19,
    grammatik: ['Register: du oder Sie'],
    wiederholt: ['abschluss-lesen', 'betonung'],
    vorher: ['abschluss-lesen'],
    kulturnotiz: 'In Russland gibt man sich zur Begrüßung die Hand – aber nie über die Türschwelle, das bringt Streit, sagt der Aberglaube.',
    titel: 'Begrüßung',
    emoji: '👋',
    beschreibung: 'Hallo sagen wie ein Muttersprachler',
    ziele: [
      'Hallo und Tschüss sagen – locker und höflich',
      'Grüße für jede Tageszeit kennen',
      'Deinen ersten echten Dialog verstehen',
    ],
    items: [
      { es: 'привет', de: 'hallo', beispielEs: 'Привет, Анна!', beispielDe: 'Hallo, Anna!' },
      { es: 'здравствуйте', de: 'guten Tag (höflich)', beispielEs: 'Здравствуйте! Как дела?', beispielDe: 'Guten Tag! Wie geht es Ihnen?' },
      { es: 'доброе утро', de: 'guten Morgen', beispielEs: 'Доброе утро! Кофе?', beispielDe: 'Guten Morgen! Kaffee?' },
      { es: 'добрый вечер', de: 'guten Abend', beispielEs: 'Добрый вечер, Том!', beispielDe: 'Guten Abend, Tom!' },
      { es: 'спокойной ночи', de: 'gute Nacht', beispielEs: 'Спокойной ночи, мама.', beispielDe: 'Gute Nacht, Mama.' },
      { es: 'пока', de: 'tschüss', beispielEs: 'Я домой. Пока!', beispielDe: 'Ich gehe nach Hause. Tschüss!' },
      { es: 'до свидания', de: 'auf Wiedersehen', beispielEs: 'До свидания! Спасибо!', beispielDe: 'Auf Wiedersehen! Danke!' },
      { es: 'как дела?', de: 'wie geht’s?', beispielEs: 'Привет! Как дела?', beispielDe: 'Hallo! Wie geht’s?' },
      { es: 'отлично', de: 'super', beispielEs: 'Как дела? – Отлично!', beispielDe: 'Wie geht’s? – Super!' },
      { es: 'нормально', de: 'ganz okay', beispielEs: 'Как дела? – Нормально.', beispielDe: 'Wie geht’s? – Ganz okay.' },
    ],
    wissen: [
      {
        emoji: '🤝',
        titel: 'Du oder Sie?',
        text: 'Wie im Deutschen: *привет* und *пока* sagst du zu Freunden. *здравствуйте* und *до свидания* sind die höflichen Formen für Fremde, Ältere und im Geschäft.',
      },
      {
        emoji: '🕐',
        titel: 'Der Gruß zur Tageszeit',
        text: '*доброе утро* am Morgen, *добрый вечер* am Abend – wörtlich „guter Morgen“, „guter Abend“. *спокойной ночи* („ruhige Nacht“) sagt man nur zum Abschied ins Bett.',
      },
      {
        emoji: '💬',
        titel: 'Wie geht’s – ehrlich beantwortet',
        text: 'Auf *как дела?* antworten Russen ehrlich: *отлично* (super), *хорошо* (gut) oder *нормально* (ganz okay). Ein „normально“ ist keine schlechte Laune – nur keine Show.',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Привет, Том!', de: 'Hallo, Tom!' },
      { sprecher: 'Tom', es: 'Доброе утро, Анна! Как дела?', de: 'Guten Morgen, Anna! Wie geht’s?' },
      { sprecher: 'Anna', es: 'Отлично, спасибо!', de: 'Super, danke!' },
      { sprecher: 'Tom', es: 'Я в метро. Пока!', de: 'Ich gehe zur Metro. Tschüss!' },
    ],
  },

  {
    id: 'vorstellen',
    niveau: 'A1.1',
    kursNr: 20,
    grammatik: ['меня зовут – wörtlich „mich nennt man“'],
    wiederholt: ['begruessung', 'betonung'],
    vorher: ['begruessung'],
    kulturnotiz: 'Russen haben drei Namen: Vorname, Vatersname, Nachname. Anna Iwanowna ist „Anna, Tochter des Iwan“.',
    titel: 'Sich vorstellen',
    emoji: '🙋',
    beschreibung: 'Name sagen, Namen erfragen, Menschen vorstellen',
    ziele: [
      'Deinen Namen sagen und nach Namen fragen',
      'Freunde und Familie vorstellen',
      'Den Unterschied zwischen du- und Sie-Frage kennen',
    ],
    items: [
      { es: 'меня зовут…', de: 'ich heiße …', beispielEs: 'Меня зовут Мануэль.', beispielDe: 'Ich heiße Manuel.' },
      { es: 'как тебя зовут?', de: 'wie heißt du?', beispielEs: 'Привет! Как тебя зовут?', beispielDe: 'Hallo! Wie heißt du?' },
      { es: 'как вас зовут?', de: 'wie heißen Sie?', beispielEs: 'Здравствуйте, как вас зовут?', beispielDe: 'Guten Tag, wie heißen Sie?' },
      { es: 'очень приятно', de: 'freut mich', beispielEs: 'Очень приятно, Анна!', beispielDe: 'Freut mich, Anna!' },
      { es: 'это', de: 'das ist', beispielEs: 'Это Том.', beispielDe: 'Das ist Tom.' },
      { es: 'мой друг', de: 'mein Freund', beispielEs: 'Это мой друг Том.', beispielDe: 'Das ist mein Freund Tom.' },
      { es: 'моя подруга', de: 'meine Freundin', beispielEs: 'Это моя подруга Анна.', beispielDe: 'Das ist meine Freundin Anna.' },
      { es: 'кто это?', de: 'wer ist das?', beispielEs: 'Кто это? – Это мой брат.', beispielDe: 'Wer ist das? – Das ist mein Bruder.' },
    ],
    wissen: [
      {
        emoji: '🪞',
        titel: 'Wörtlich: „Mich nennt man…“',
        text: '*меня зовут* heißt wörtlich „mich nennt man“ – so stellt man sich vor. Die Antwort auf *как тебя зовут?* ist also immer: *меня зовут* + Name.',
      },
      {
        emoji: '👥',
        titel: 'тебя oder вас',
        text: 'Zum Freund: *как тебя зовут?* Zum Fremden: *как вас зовут?* – dieselbe du/Sie-Regel wie bei der Begrüßung. Einmal verstanden, überall anwendbar.',
      },
      {
        emoji: '🫱',
        titel: 'Vorstellen mit это',
        text: '*Это мой друг Том.* – „Das ist mein Freund Tom.“ Das kleine *это* (das ist) stellt Menschen UND Dinge vor. Merk’s dir gut, in Lektion 11 wird es zum Star.',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Привет! Как тебя зовут?', de: 'Hallo! Wie heißt du?' },
      { sprecher: 'Tom', es: 'Меня зовут Том. А тебя?', de: 'Ich heiße Tom. Und du?' },
      { sprecher: 'Anna', es: 'Я Анна. Очень приятно!', de: 'Ich bin Anna. Freut mich!' },
      { sprecher: 'Tom', es: 'Это моя подруга Лена.', de: 'Das ist meine Freundin Lena.' },
    ],
  },

  {
    id: 'herkunft',
    niveau: 'A1.1',
    kursNr: 34,
    grammatik: ['из + Land: woher jemand kommt'],
    wiederholt: ['vorstellen', 'begruessung'],
    vorher: ['vorstellen'],
    kulturnotiz: 'Russland ist das größte Land der Erde – elf Zeitzonen liegen zwischen Kaliningrad und Kamtschatka.',
    titel: 'Woher kommst du?',
    emoji: '🌍',
    beschreibung: 'Herkunft und Wohnort – deine ersten aus-Sätze',
    ziele: [
      'Sagen, woher du kommst',
      'Sagen, wo du wohnst',
      'Nach der Herkunft fragen',
    ],
    items: [
      { es: 'я из Германии', de: 'ich komme aus Deutschland', beispielEs: 'Я из Германии, из Берлина.', beispielDe: 'Ich komme aus Deutschland, aus Berlin.' },
      { es: 'откуда ты?', de: 'woher kommst du?', beispielEs: 'Привет! Откуда ты?', beispielDe: 'Hallo! Woher kommst du?' },
      { es: 'Германия', de: 'Deutschland', beispielEs: 'Германия – это моя страна.', beispielDe: 'Deutschland ist mein Land.' },
      { es: 'Россия', de: 'Russland', beispielEs: 'Анна из России.', beispielDe: 'Anna kommt aus Russland.' },
      { es: 'Австрия', de: 'Österreich', beispielEs: 'Мой друг из Австрии.', beispielDe: 'Mein Freund kommt aus Österreich.' },
      { es: 'Швейцария', de: 'die Schweiz', beispielEs: 'Швейцария очень красивая.', beispielDe: 'Die Schweiz ist sehr schön.' },
      { es: 'я живу в Берлине', de: 'ich wohne in Berlin', beispielEs: 'Сейчас я живу в Берлине.', beispielDe: 'Jetzt wohne ich in Berlin.' },
      { es: 'город', de: 'die Stadt', beispielEs: 'Берлин – большой город.', beispielDe: 'Berlin ist eine große Stadt.' },
      { es: 'страна', de: 'das Land', beispielEs: 'Россия – большая страна.', beispielDe: 'Russland ist ein großes Land.' },
      { es: 'тоже', de: 'auch', beispielEs: 'Я тоже из Германии!', beispielDe: 'Ich komme auch aus Deutschland!' },
    ],
    wissen: [
      {
        emoji: '🧳',
        titel: 'из heißt aus',
        text: '*я из Германии* – ich bin aus Deutschland. Nach *из* ändert das Land leicht die Endung: *Германия* wird zu *Германии*, *Россия* zu *России*. Das passiert von selbst, je öfter du es hörst.',
      },
      {
        emoji: '📍',
        titel: 'Wohnen mit в',
        text: '*я живу в Берлине* – ich wohne IN Berlin. *из* = woher, *в* = wo. Zwei kleine Wörter, und du kannst deine ganze Geschichte erzählen.',
      },
      {
        emoji: '➕',
        titel: 'Das praktische тоже',
        text: '*тоже* (auch) macht aus jeder Antwort ein Gespräch: *Я тоже из Германии!* – Ich auch! Einfacher kann Anschluss nicht sein.',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Том, откуда ты?', de: 'Tom, woher kommst du?' },
      { sprecher: 'Tom', es: 'Я из Германии. А ты?', de: 'Ich komme aus Deutschland. Und du?' },
      { sprecher: 'Anna', es: 'Я из России, из Москвы.', de: 'Ich komme aus Russland, aus Moskau.' },
      { sprecher: 'Tom', es: 'Сейчас я живу в Берлине.', de: 'Jetzt wohne ich in Berlin.' },
    ],
  },

  {
    id: 'hoeflichkeit',
    niveau: 'A1.1',
    kursNr: 35,
    grammatik: ['можно? – die höfliche Alles-Frage'],
    wiederholt: ['herkunft', 'vorstellen', 'kyrillisch-2'],
    vorher: ['herkunft'],
    kulturnotiz: 'In Russland lächelt man Fremde selten grundlos an – ein Lächeln ist dort persönlich gemeint und dadurch mehr wert.',
    titel: 'Höflichkeit',
    emoji: '🙏',
    beschreibung: 'Entschuldigen, bitten, um Erlaubnis fragen',
    ziele: [
      'Dich entschuldigen und jemanden ansprechen',
      'Mit можно höflich um Erlaubnis fragen',
      'Auf ein Danke richtig antworten',
    ],
    items: [
      { es: 'извините', de: 'Entschuldigung', beispielEs: 'Извините, где метро?', beispielDe: 'Entschuldigung, wo ist die Metro?' },
      { es: 'простите', de: 'Verzeihung', beispielEs: 'Простите, это ваш кот?', beispielDe: 'Verzeihung, ist das Ihr Kater?' },
      { es: 'можно?', de: 'darf ich?', beispielEs: 'Можно чай, пожалуйста?', beispielDe: 'Kann ich bitte einen Tee haben?' },
      { es: 'конечно', de: 'natürlich', beispielEs: 'Можно? – Конечно!', beispielDe: 'Darf ich? – Natürlich!' },
      { es: 'не за что', de: 'gern geschehen', beispielEs: 'Спасибо! – Не за что.', beispielDe: 'Danke! – Gern geschehen.' },
      { es: 'всё хорошо', de: 'alles gut', beispielEs: 'Всё хорошо, спасибо.', beispielDe: 'Alles gut, danke.' },
      { es: 'к сожалению', de: 'leider', beispielEs: 'К сожалению, нет.', beispielDe: 'Leider nein.' },
      { es: 'ничего', de: 'macht nichts', beispielEs: 'Извините! – Ничего.', beispielDe: 'Entschuldigung! – Macht nichts.' },
    ],
    wissen: [
      {
        emoji: '🚪',
        titel: 'извините öffnet Türen',
        text: 'Mit *извините* sprichst du Fremde an UND entschuldigst dich für Kleinigkeiten – wie unser „Entschuldigung“. *простите* ist die etwas ernstere Schwester.',
      },
      {
        emoji: '🎫',
        titel: 'можно – ein Wort, tausend Fragen',
        text: '*можно?* heißt „darf man?“ und funktioniert überall: *Можно чай?* (Krieg ich Tee?), *Можно?* mit Blick auf den freien Stuhl. Die Antwort ist meist *конечно* – natürlich!',
      },
      {
        emoji: '🔁',
        titel: 'Danke – und zurück',
        text: 'Auf *спасибо* antwortest du *не за что* („nichts zu danken“) oder *пожалуйста*. Auf ein *извините* sagst du großzügig *ничего* – macht nichts.',
      },
    ],
    dialog: [
      { sprecher: 'Tom', es: 'Извините, где банк?', de: 'Entschuldigung, wo ist die Bank?' },
      { sprecher: 'Anna', es: 'Банк там, в центре.', de: 'Die Bank ist dort, im Zentrum.' },
      { sprecher: 'Tom', es: 'Спасибо!', de: 'Danke!' },
      { sprecher: 'Anna', es: 'Не за что!', de: 'Gern geschehen!' },
    ],
  },

  {
    id: 'zahlen',
    niveau: 'A1.1',
    kursNr: 33,
    grammatik: ['Die Zahlen 0–10'],
    wiederholt: ['fragen', 'begruessung'],
    vorher: ['fragen'],
    kulturnotiz: 'Blumen schenkt man in Russland nur in UNGERADER Zahl – gerade Zahlen gehören zur Beerdigung.',
    titel: 'Zahlen 0–10',
    emoji: '🔢',
    beschreibung: 'Zählen, bestellen, Preise verstehen',
    ziele: [
      'Von null bis zehn zählen',
      'Mengen bestellen wie ein Local',
      'Zahlen im Alltag wiedererkennen',
    ],
    items: [
      { es: 'ноль', de: 'null', beispielEs: 'Ноль проблем!', beispielDe: 'Null Probleme!' },
      { es: 'один', de: 'eins', beispielEs: 'Один кофе, пожалуйста.', beispielDe: 'Einen Kaffee, bitte.' },
      { es: 'два', de: 'zwei', beispielEs: 'Два чая, пожалуйста.', beispielDe: 'Zwei Tee, bitte.' },
      { es: 'три', de: 'drei', beispielEs: 'Три яблока.', beispielDe: 'Drei Äpfel.' },
      { es: 'четыре', de: 'vier', beispielEs: 'Четыре лимона.', beispielDe: 'Vier Zitronen.' },
      { es: 'пять', de: 'fünf', beispielEs: 'Пять минут, пожалуйста.', beispielDe: 'Fünf Minuten, bitte.' },
      { es: 'шесть', de: 'sechs', beispielEs: 'Шесть – это не семь.', beispielDe: 'Sechs ist nicht sieben.' },
      { es: 'семь', de: 'sieben', beispielEs: 'Семь дней – это неделя.', beispielDe: 'Sieben Tage sind eine Woche.' },
      { es: 'восемь', de: 'acht', beispielEs: 'Сейчас восемь утра.', beispielDe: 'Es ist acht Uhr morgens.' },
      { es: 'девять', de: 'neun', beispielEs: 'Девять, а потом десять.', beispielDe: 'Neun, und dann zehn.' },
      { es: 'десять', de: 'zehn', beispielEs: 'Десять минут до метро.', beispielDe: 'Zehn Minuten bis zur Metro.' },
    ],
    wissen: [
      {
        emoji: '☕',
        titel: 'Die Bestell-Formel',
        text: 'Zahl + Wort + *пожалуйста* funktioniert immer: *Два кофе, пожалуйста* – zwei Kaffee, bitte. Mehr Grammatik braucht ein Café nicht.',
      },
      {
        emoji: '🧮',
        titel: 'Kleine Endungs-Magie',
        text: 'Nach *два*, *три*, *четыре* ändert sich das Wort leicht: *два чая* (zwei Tee), *три яблока* (drei Äpfel). Nimm es einfach als Klang mit – die Regel kommt später im Kurs.',
      },
      {
        emoji: '👂',
        titel: 'Zahlen hören lernen',
        text: 'Preise, Busnummern, Uhrzeiten – Zahlen sind das Erste, was du „in freier Wildbahn“ verstehst. Achte auf *пять* (5) und *десять* (10), die hörst du ständig.',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Один кофе и два чая?', de: 'Ein Kaffee und zwei Tee?' },
      { sprecher: 'Tom', es: 'Нет, два кофе, пожалуйста.', de: 'Nein, zwei Kaffee, bitte.' },
      { sprecher: 'Anna', es: 'Хорошо, два кофе. Сейчас!', de: 'Gut, zwei Kaffee. Sofort!' },
      { sprecher: 'Tom', es: 'Спасибо! И один шоколад.', de: 'Danke! Und eine Schokolade.' },
    ],
  },

  {
    id: 'kein-sein',
    niveau: 'A1.1',
    kursNr: 21,
    grammatik: ['Kein „ist“, kein Artikel: Это дом.'],
    wiederholt: ['vorstellen', 'begruessung', 'kyrillisch-1'],
    vorher: ['vorstellen'],
    kulturnotiz: 'Russische Studenten feiern am 25. Januar den Tatjana-Tag – den offiziellen Feiertag aller Studierenden.',
    titel: 'Der unsichtbare Satz',
    emoji: '🪄',
    beschreibung: 'Sätze bauen ohne „ist“ und ohne Artikel',
    ziele: [
      'Sätze wie „Das ist ein Haus“ mit zwei Wörtern bauen',
      'er, sie, wir und die anderen kennen',
      'Nach Personen und Dingen fragen',
    ],
    items: [
      { es: 'кто', de: 'wer', beispielEs: 'Кто это? – Это Анна.', beispielDe: 'Wer ist das? – Das ist Anna.' },
      { es: 'что', de: 'was', beispielEs: 'Что это? – Это борщ.', beispielDe: 'Was ist das? – Das ist Borschtsch.' },
      { es: 'он', de: 'er', beispielEs: 'Он мой брат.', beispielDe: 'Er ist mein Bruder.' },
      { es: 'она', de: 'sie (Einzahl)', beispielEs: 'Она моя подруга.', beispielDe: 'Sie ist meine Freundin.' },
      { es: 'мы', de: 'wir', beispielEs: 'Мы из Германии.', beispielDe: 'Wir kommen aus Deutschland.' },
      { es: 'вы', de: 'Sie / ihr', beispielEs: 'Вы из России?', beispielDe: 'Kommen Sie aus Russland?' },
      { es: 'они', de: 'sie (Mehrzahl)', beispielEs: 'Они в парке.', beispielDe: 'Sie sind im Park.' },
      { es: 'студент', de: 'der Student', beispielEs: 'Том – студент.', beispielDe: 'Tom ist Student.' },
      { es: 'студентка', de: 'die Studentin', beispielEs: 'Анна – студентка.', beispielDe: 'Anna ist Studentin.' },
      { es: 'дома', de: 'zu Hause', beispielEs: 'Я сейчас дома.', beispielDe: 'Ich bin jetzt zu Hause.' },
    ],
    wissen: [
      {
        emoji: '🪄',
        titel: 'Das unsichtbare „ist“',
        text: 'Russisch lässt „ist/bin/sind“ in der Gegenwart einfach weg: *Я студент* – „Ich (bin) Student“. *Он дома* – „Er (ist) zu Hause“. Weniger Wörter, gleiche Aussage.',
      },
      {
        emoji: '🚫',
        titel: 'Auch kein der/die/das',
        text: 'Artikel gibt es nicht: *дом* heißt „Haus“ UND „das Haus“. Zwei ganze Fehlerquellen des Deutschen existieren im Russischen einfach nicht – genieß das!',
      },
      {
        emoji: '🧲',
        titel: 'это als Satz-Motor',
        text: '*Это* + Wort = fertiger Satz: *Это дом* (Das ist ein Haus), *Кто это?* (Wer ist das?), *Что это?* (Was ist das?). Mit einem Wort baust du unendlich viele Sätze.',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Кто это?', de: 'Wer ist das?' },
      { sprecher: 'Tom', es: 'Это мой друг Макс.', de: 'Das ist mein Freund Max.' },
      { sprecher: 'Anna', es: 'Он студент?', de: 'Ist er Student?' },
      { sprecher: 'Tom', es: 'Да, он студент. Мы из Берлина.', de: 'Ja, er ist Student. Wir kommen aus Berlin.' },
    ],
  },

  {
    id: 'fragen',
    niveau: 'A1.1',
    kursNr: 27,
    grammatik: ['Ja/Nein-Fragen nur mit der Stimme'],
    wiederholt: ['kein-sein', 'vorstellen', 'begruessung'],
    vorher: ['kein-sein'],
    kulturnotiz: 'Das russische „ладно“ ist wie das deutsche „na gut“ – halb Zustimmung, halb Schulterzucken.',
    titel: 'Fragen & kleine Antworten',
    emoji: '❓',
    beschreibung: 'Nachfragen, zustimmen, um Wiederholung bitten',
    ziele: [
      'Ja/Nein-Fragen nur mit der Stimme stellen',
      'Mit kleinen Wörtern flüssig reagieren',
      'Um Wiederholung und langsames Sprechen bitten',
    ],
    items: [
      { es: 'вопрос', de: 'die Frage', beispielEs: 'Можно вопрос?', beispielDe: 'Darf ich etwas fragen?' },
      { es: 'ответ', de: 'die Antwort', beispielEs: 'Хороший ответ!', beispielDe: 'Gute Antwort!' },
      { es: 'может быть', de: 'vielleicht', beispielEs: 'Может быть, потом.', beispielDe: 'Vielleicht später.' },
      { es: 'не знаю', de: 'ich weiß nicht', beispielEs: 'Где Том? – Не знаю.', beispielDe: 'Wo ist Tom? – Ich weiß nicht.' },
      { es: 'правда?', de: 'wirklich?', beispielEs: 'Я из Москвы. – Правда?', beispielDe: 'Ich komme aus Moskau. – Wirklich?' },
      { es: 'ладно', de: 'na gut', beispielEs: 'Ладно, потом.', beispielDe: 'Na gut, später.' },
      { es: 'понятно', de: 'alles klar', beispielEs: 'Метро там. – Понятно!', beispielDe: 'Die Metro ist dort. – Alles klar!' },
      { es: 'ещё раз', de: 'noch einmal', beispielEs: 'Ещё раз, пожалуйста.', beispielDe: 'Noch einmal, bitte.' },
      { es: 'медленнее', de: 'langsamer', beispielEs: 'Медленнее, пожалуйста!', beispielDe: 'Langsamer, bitte!' },
    ],
    wissen: [
      {
        emoji: '🎤',
        titel: 'Fragen ohne Umbau',
        text: 'Eine Ja/Nein-Frage ist derselbe Satz mit anderer Melodie: *Он студент.* (Aussage) – *Он студент?* (Frage). Die Stimme geht auf dem wichtigen Wort nach oben. Kein „do“, kein Umstellen.',
      },
      {
        emoji: '🧰',
        titel: 'Der Small-Talk-Werkzeugkasten',
        text: '*правда?* (echt?), *понятно* (alles klar), *может быть* (vielleicht), *ладно* (na gut), *не знаю* (weiß nicht) – mit diesen fünf hältst du jedes Gespräch am Laufen, auch wenn du fast nichts verstehst.',
      },
      {
        emoji: '🐢',
        titel: 'Deine Lern-Superkraft',
        text: '*Ещё раз, пожалуйста* (noch einmal) und *медленнее, пожалуйста* (langsamer) sind die zwei wichtigsten Sätze für Lernende. Trau dich, sie zu benutzen – jeder hilft gern.',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Ты из Москвы?', de: 'Kommst du aus Moskau?' },
      { sprecher: 'Tom', es: 'Нет, из Берлина.', de: 'Nein, aus Berlin.' },
      { sprecher: 'Anna', es: 'Правда? Класс!', de: 'Wirklich? Klasse!' },
      { sprecher: 'Tom', es: 'Ещё раз, пожалуйста. Медленнее!', de: 'Noch einmal, bitte. Langsamer!' },
    ],
  },
  {
    id: 'kyrillisch-falsche',
    niveau: 'A1.1',
    kursNr: 3,
    grammatik: ['Kyrillisch: и – und die Masken sicher lesen'],
    wiederholt: ['kyrillisch-1', 'einstieg'],
    vorher: ['kyrillisch-1'],
    kulturnotiz: 'мир heißt „Welt“ UND „Frieden“ – im Russischen ist das ein und dasselbe Wort.',
    titel: 'Die Masken im Einsatz',
    emoji: '🎭',
    hoerwort: true,
    beschreibung: 'и kommt dazu – und die falschen Freunde sitzen',
    ziele: [
      'Das neue и sicher lesen',
      'Die Masken В, Н, Р, С, У, Х in echten Wörtern treffen',
      'Zehn neue Alltagswörter entziffern',
    ],
    items: [
      { es: 'мир', de: 'die Welt', beispielEs: 'Мир – это мы.', beispielDe: 'Die Welt – das sind wir.' },
      { es: 'кино', de: 'das Kino', beispielEs: 'Кино там, в центре.', beispielDe: 'Das Kino ist dort, im Zentrum.' },
      { es: 'вино', de: 'der Wein', beispielEs: 'Вино или сок?', beispielDe: 'Wein oder Saft?' },
      { es: 'река', de: 'der Fluss', beispielEs: 'Река тут, море там.', beispielDe: 'Der Fluss ist hier, das Meer ist dort.' },
      { es: 'рука', de: 'die Hand', beispielEs: 'Это моя рука.', beispielDe: 'Das ist meine Hand.' },
      { es: 'ухо', de: 'das Ohr', beispielEs: 'Ухо и нос.', beispielDe: 'Ohr und Nase.' },
      { es: 'сахар', de: 'der Zucker', beispielEs: 'Сахар в кофе?', beispielDe: 'Zucker in den Kaffee?' },
      { es: 'сон', de: 'der Schlaf', beispielEs: 'Сон – это хорошо.', beispielDe: 'Schlaf ist gut.' },
      { es: 'весна', de: 'der Frühling', beispielEs: 'Весна уже тут!', beispielDe: 'Der Frühling ist schon da!' },
      { es: 'март', de: 'der März', beispielEs: 'Март – это весна.', beispielDe: 'März – das ist Frühling.' },
    ],
    wissen: [
      {
        emoji: '🆕',
        titel: 'Das kleine и',
        text: '*и* ist ein ganz normales i – und gleichzeitig das Wort für „und“: *ухо и нос* = Ohr und Nase. Ein Buchstabe, der ein ganzes Wort ist!',
      },
      {
        emoji: '🎭',
        titel: 'Masken-Check',
        text: 'Lies laut und langsam: *вино* = „wino“, *река* = „reká“, *сахар* = „sáchar“. Jedes Mal, wenn du eine Maske richtig liest, sitzt sie ein Stück fester.',
      },
      {
        emoji: '🕵️',
        titel: 'Der Doppelgänger-Trick',
        text: '*кино* und *вино* unterscheiden sich nur im ersten Buchstaben – genau solche Paare trainieren dein Auge. Die Hör-Übungen gleich nutzen das aus.',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Кино или река?', de: 'Kino oder Fluss?' },
      { sprecher: 'Tom', es: 'Река! Там хорошо.', de: 'Der Fluss! Dort ist es schön.' },
      { sprecher: 'Anna', es: 'А потом кино?', de: 'Und danach Kino?' },
      { sprecher: 'Tom', es: 'Да! И сок с сахаром.', de: 'Ja! Und Saft mit Zucker.' },
    ],
  },

  {
    id: 'kyrillisch-selten',
    niveau: 'A1.1',
    kursNr: 6,
    grammatik: ['Kyrillisch: й, ы und э'],
    wiederholt: ['kyrillisch-3', 'kyrillisch-2'],
    vorher: ['kyrillisch-3'],
    kulturnotiz: 'Die Straßenbahn (трамвай) ist in russischen Städten überall – das Netz von Sankt Petersburg war einmal das längste der Welt.',
    titel: 'Die drei Sonderlinge',
    emoji: '🧩',
    hoerwort: true,
    beschreibung: 'й, ы und э – die letzten drei Lücken schließen sich',
    ziele: [
      'й als kurzes j am Wortende lesen',
      'ы als dunkles i erkennen',
      'э als offenes E von е unterscheiden',
    ],
    items: [
      { es: 'май', de: 'der Mai', beispielEs: 'Май – это весна.', beispielDe: 'Mai – das ist Frühling.' },
      { es: 'йогурт', de: 'der Joghurt', beispielEs: 'Йогурт и чай.', beispielDe: 'Joghurt und Tee.' },
      { es: 'трамвай', de: 'die Straßenbahn', beispielEs: 'Вот трамвай!', beispielDe: 'Da ist die Straßenbahn!' },
      { es: 'ты', de: 'du', beispielEs: 'Ты тут? – Да, я тут.', beispielDe: 'Bist du hier? – Ja, ich bin hier.' },
      { es: 'рыба', de: 'der Fisch', beispielEs: 'Рыба в реке.', beispielDe: 'Der Fisch ist im Fluss.' },
      { es: 'дым', de: 'der Rauch', beispielEs: 'Там дым!', beispielDe: 'Dort ist Rauch!' },
      { es: 'мыло', de: 'die Seife', beispielEs: 'Вот мыло и вода.', beispielDe: 'Hier sind Seife und Wasser.' },
      { es: 'эхо', de: 'das Echo', beispielEs: 'Эхо: да… да… да…', beispielDe: 'Das Echo: ja… ja… ja…' },
      { es: 'поэт', de: 'der Dichter', beispielEs: 'Пушкин – поэт.', beispielDe: 'Puschkin ist ein Dichter.' },
      { es: 'экран', de: 'der Bildschirm', beispielEs: 'Экран там.', beispielDe: 'Der Bildschirm ist dort.' },
    ],
    wissen: [
      {
        emoji: '🐦',
        titel: 'й – das flüchtige j',
        text: '*й* ist ein ganz kurzes j, meist am Wortende: *май* („maj“), *трамвай* („tramwáj“). Nie betont, immer flink.',
      },
      {
        emoji: '🪨',
        titel: 'ы – das i aus dem Bauch',
        text: '*ы* klingt wie ein i, das tief hinten im Mund entsteht. Sprich „i“ und zieh dabei die Zunge zurück: *ты*, *рыба*, *дым*. Kein deutsches ü!',
      },
      {
        emoji: '📣',
        titel: 'э – das ehrliche E',
        text: '*э* ist ein offenes E ohne j davor: *эхо*, *экран*. Das normale *е* dagegen trägt oft ein verstecktes j – der Unterschied kommt in Lektion 11 groß raus.',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Ты тут, Том?', de: 'Bist du hier, Tom?' },
      { sprecher: 'Tom', es: 'Да! Вот трамвай.', de: 'Ja! Da ist die Straßenbahn.' },
      { sprecher: 'Anna', es: 'А это что? Дым?', de: 'Und was ist das? Rauch?' },
      { sprecher: 'Tom', es: 'Нет, это эхо и туман.', de: 'Nein, das sind Echo und Nebel.' },
    ],
  },

  {
    id: 'weiche-zeichen',
    niveau: 'A1.1',
    kursNr: 7,
    grammatik: ['Kyrillisch: ь und ъ – Zeichen ohne Laut'],
    wiederholt: ['kyrillisch-selten', 'kyrillisch-3'],
    vorher: ['kyrillisch-selten'],
    kulturnotiz: 'семья (die Familie) steckt voller Sprachgeschichte: wörtlich „sieben Ich“ – so groß dachte man sich früher eine Familie.',
    titel: 'Die stummen Zeichen',
    emoji: '🤫',
    hoerwort: true,
    beschreibung: 'ь und ъ – man hört sie nicht, aber sie verändern alles',
    ziele: [
      'ь als Weichmacher erkennen',
      'ъ als Trennzeichen verstehen',
      'Wörter mit und ohne ь unterscheiden',
    ],
    items: [
      { es: 'день', de: 'der Tag', beispielEs: 'Добрый день!', beispielDe: 'Guten Tag!' },
      { es: 'мать', de: 'die Mutter', beispielEs: 'Мать и сын тут.', beispielDe: 'Mutter und Sohn sind hier.' },
      { es: 'дверь', de: 'die Tür', beispielEs: 'Дверь там.', beispielDe: 'Die Tür ist dort.' },
      { es: 'соль', de: 'das Salz', beispielEs: 'Соль в супе.', beispielDe: 'Das Salz ist in der Suppe.' },
      { es: 'конь', de: 'das Pferd', beispielEs: 'Конь в парке.', beispielDe: 'Das Pferd ist im Park.' },
      { es: 'осень', de: 'der Herbst', beispielEs: 'Осень – это красиво.', beispielDe: 'Der Herbst ist schön.' },
      { es: 'словарь', de: 'das Wörterbuch', beispielEs: 'Вот мой словарь.', beispielDe: 'Hier ist mein Wörterbuch.' },
      { es: 'семья', de: 'die Familie', beispielEs: 'Моя семья тут.', beispielDe: 'Meine Familie ist hier.' },
      { es: 'объект', de: 'das Objekt', beispielEs: 'Это объект номер пять.', beispielDe: 'Das ist Objekt Nummer fünf.' },
      { es: 'подъезд', de: 'der Hauseingang', beispielEs: 'Подъезд там.', beispielDe: 'Der Hauseingang ist dort.' },
    ],
    wissen: [
      {
        emoji: '🧈',
        titel: 'ь macht weich',
        text: 'Das Weichheitszeichen *ь* hat keinen eigenen Laut – es macht den Konsonanten davor weich, als würde ein Hauch j mitschwingen: *день*, *соль*, *дверь*.',
      },
      {
        emoji: '🧱',
        titel: 'ъ trennt',
        text: 'Das harte Zeichen *ъ* ist selten und trennt zwei Laute sauber: *подъезд* = „pod-jesd“, nicht „podesd“. Du erkennst es sofort – es steht fast nur nach Vorsilben.',
      },
      {
        emoji: '👂',
        titel: 'Hör den Unterschied',
        text: '*кон* wäre „kon“ – *конь* ist „konj“ mit weichem n. Die Hör-Übungen gleich trainieren genau dieses Ohr. Klein, aber es unterscheidet echte Wörter!',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Добрый день, Том!', de: 'Guten Tag, Tom!' },
      { sprecher: 'Tom', es: 'День? Уже осень и вечер!', de: 'Tag? Es ist schon Herbst und Abend!' },
      { sprecher: 'Anna', es: 'Где моя семья?', de: 'Wo ist meine Familie?' },
      { sprecher: 'Tom', es: 'Там, у подъезда.', de: 'Dort, am Hauseingang.' },
    ],
  },

  {
    id: 'silben',
    niveau: 'A1.1',
    kursNr: 8,
    grammatik: ['Silbenweise lesen statt Buchstabe für Buchstabe'],
    wiederholt: ['weiche-zeichen', 'kyrillisch-selten', 'kyrillisch-1'],
    vorher: ['weiche-zeichen'],
    kulturnotiz: 'молодец! („gut gemacht!“) ist DAS russische Lob – wörtlich „Prachtkerl“, und es funktioniert für alle.',
    titel: 'Silben statt Buchstaben',
    emoji: '🧱',
    hoerwort: true,
    beschreibung: 'Lange Wörter flüssig lesen – Silbe für Silbe',
    ziele: [
      'Wörter in Silben zerlegen',
      'Dreisilbige Wörter flüssig lesen',
      'Zehn lange Alltagswörter meistern',
    ],
    items: [
      { es: 'собака', de: 'der Hund', beispielEs: 'Собака в парке.', beispielDe: 'Der Hund ist im Park.' },
      { es: 'машина', de: 'das Auto', beispielEs: 'Машина тут.', beispielDe: 'Das Auto ist hier.' },
      { es: 'магазин', de: 'das Geschäft', beispielEs: 'Магазин в центре.', beispielDe: 'Das Geschäft ist im Zentrum.' },
      { es: 'комната', de: 'das Zimmer', beispielEs: 'Моя комната там.', beispielDe: 'Mein Zimmer ist dort.' },
      { es: 'погода', de: 'das Wetter', beispielEs: 'Погода – класс!', beispielDe: 'Das Wetter ist klasse!' },
      { es: 'дорога', de: 'die Straße', beispielEs: 'Дорога к морю.', beispielDe: 'Die Straße zum Meer.' },
      { es: 'голова', de: 'der Kopf', beispielEs: 'Голова и рука.', beispielDe: 'Kopf und Hand.' },
      { es: 'бабушка', de: 'die Oma', beispielEs: 'Бабушка дома.', beispielDe: 'Oma ist zu Hause.' },
      { es: 'молодец', de: 'gut gemacht!', beispielEs: 'Ты молодец!', beispielDe: 'Das hast du gut gemacht!' },
      { es: 'бумага', de: 'das Papier', beispielEs: 'Бумага на столе.', beispielDe: 'Das Papier liegt auf dem Tisch.' },
    ],
    wissen: [
      {
        emoji: '🧱',
        titel: 'Der Silben-Trick',
        text: 'Lange Wörter liest man in Häppchen: *со-ба-ка*, *ма-ши-на*, *ба-буш-ка*. Konsonant plus Vokal = eine Silbe. So liest du jedes neue Wort, egal wie lang.',
      },
      {
        emoji: '🚫',
        titel: 'Nicht mehr buchstabieren',
        text: 'Ab jetzt gilt: nie wieder „м… а… м… а“. Wer Silben liest, liest doppelt so schnell – und hört dabei schon, wie das Wort wirklich klingt.',
      },
      {
        emoji: '🥇',
        titel: 'Dein neues Lieblingswort',
        text: '*молодец!* heißt „gut gemacht!“ – Merk es dir gut: Ab jetzt sagt es dir die App, und bald sagst du es anderen.',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Где магазин?', de: 'Wo ist das Geschäft?' },
      { sprecher: 'Tom', es: 'Там, у дороги.', de: 'Dort, an der Straße.' },
      { sprecher: 'Anna', es: 'А это твоя машина?', de: 'Und ist das dein Auto?' },
      { sprecher: 'Tom', es: 'Да! Собака тоже моя.', de: 'Ja! Der Hund ist auch meiner.' },
    ],
  },

  {
    id: 'international',
    niveau: 'A1.1',
    kursNr: 9,
    grammatik: ['Internationale Wörter: gleich – und doch anders betont'],
    wiederholt: ['silben', 'einstieg'],
    vorher: ['silben'],
    kulturnotiz: 'Das Wort спутник (Sputnik, „Wegbegleiter“) ist eines der wenigen russischen Wörter, das um die ganze Welt ging.',
    titel: 'Geschenkte Wörter II',
    emoji: '🎁',
    hoerwort: true,
    beschreibung: 'Zehn internationale Wörter – jetzt liest du sie selbst',
    ziele: [
      'Internationale Wörter flüssig lesen',
      'Auf die russische Betonung achten',
      'Dein Lese-Tempo steigern',
    ],
    items: [
      { es: 'компьютер', de: 'der Computer', beispielEs: 'Компьютер на столе.', beispielDe: 'Der Computer steht auf dem Tisch.' },
      { es: 'программа', de: 'das Programm', beispielEs: 'Программа – класс!', beispielDe: 'Das Programm ist klasse!' },
      { es: 'пицца', de: 'die Pizza', beispielEs: 'Пицца и сок.', beispielDe: 'Pizza und Saft.' },
      { es: 'паспорт', de: 'der Pass', beispielEs: 'Вот мой паспорт.', beispielDe: 'Hier ist mein Pass.' },
      { es: 'аэропорт', de: 'der Flughafen', beispielEs: 'Аэропорт там.', beispielDe: 'Der Flughafen ist dort.' },
      { es: 'центр', de: 'das Zentrum', beispielEs: 'Я в центре.', beispielDe: 'Ich bin im Zentrum.' },
      { es: 'театр', de: 'das Theater', beispielEs: 'Театр в центре.', beispielDe: 'Das Theater ist im Zentrum.' },
      { es: 'команда', de: 'das Team', beispielEs: 'Моя команда – класс!', beispielDe: 'Mein Team ist klasse!' },
      { es: 'минута', de: 'die Minute', beispielEs: 'Одна минута!', beispielDe: 'Eine Minute!' },
      { es: 'секунда', de: 'die Sekunde', beispielEs: 'Секунда – и готово.', beispielDe: 'Eine Sekunde – und fertig.' },
    ],
    wissen: [
      {
        emoji: '🌍',
        titel: 'Bekannt, aber nicht gleich',
        text: '*компьютер* verstehst du sofort – aber es klingt „kompjúter“, mit Betonung auf ju. Internationale Wörter sind Geschenke mit russischem Akzent.',
      },
      {
        emoji: '🎯',
        titel: 'Betonung mitlernen',
        text: 'Ab jetzt lernst du jedes Wort MIT seiner Betonung: *аэропóрт*, *прогрáмма*, *секýнда*. Das Ohr zuerst – deshalb spricht die App jedes Wort vor.',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Ты где? В аэропорту?', de: 'Wo bist du? Am Flughafen?' },
      { sprecher: 'Tom', es: 'Да! Вот мой паспорт.', de: 'Ja! Hier ist mein Pass.' },
      { sprecher: 'Anna', es: 'Одна минута – и я тут.', de: 'Eine Minute – und ich bin da.' },
      { sprecher: 'Tom', es: 'Хорошо. Потом пицца?', de: 'Gut. Danach Pizza?' },
    ],
  },

  {
    id: 'hart-weich',
    niveau: 'A1.1',
    kursNr: 10,
    grammatik: ['Harte und weiche Konsonanten (Palatalisierung)'],
    wiederholt: ['international', 'kyrillisch-3'],
    vorher: ['international'],
    kulturnotiz: 'лук heißt Zwiebel UND Bogen (wie bei Pfeil und Bogen) – nur der Kontext verrät, was gemeint ist.',
    titel: 'Hart oder weich?',
    emoji: '🍦',
    hoerwort: true,
    beschreibung: 'Der Lautunterschied, der Russisch russisch macht',
    ziele: [
      'Weiche Konsonanten hören',
      'я, е, ё, ю, и als Weichmacher verstehen',
      'Paare wie ма/мя sicher unterscheiden',
    ],
    items: [
      { es: 'тётя', de: 'die Tante', beispielEs: 'Тётя Анна тут.', beispielDe: 'Tante Anna ist hier.' },
      { es: 'дядя', de: 'der Onkel', beispielEs: 'Дядя Том дома.', beispielDe: 'Onkel Tom ist zu Hause.' },
      { es: 'мясо', de: 'das Fleisch', beispielEs: 'Мясо и салат.', beispielDe: 'Fleisch und Salat.' },
      { es: 'люди', de: 'die Leute', beispielEs: 'Люди в парке.', beispielDe: 'Die Leute sind im Park.' },
      { es: 'лето', de: 'der Sommer', beispielEs: 'Лето – это море.', beispielDe: 'Sommer – das ist Meer.' },
      { es: 'место', de: 'der Platz', beispielEs: 'Это моё место.', beispielDe: 'Das ist mein Platz.' },
      { es: 'песня', de: 'das Lied', beispielEs: 'Песня – класс!', beispielDe: 'Das Lied ist klasse!' },
      { es: 'неделя', de: 'die Woche', beispielEs: 'Одна неделя – и лето!', beispielDe: 'Eine Woche – und es ist Sommer!' },
      { es: 'тело', de: 'der Körper', beispielEs: 'Голова – это тело.', beispielDe: 'Der Kopf gehört zum Körper.' },
      { es: 'лук', de: 'die Zwiebel', beispielEs: 'Лук в супе.', beispielDe: 'Die Zwiebel ist in der Suppe.' },
    ],
    wissen: [
      {
        emoji: '🍦',
        titel: 'Weich heißt: ein Hauch j',
        text: 'Ein weicher Konsonant klingt, als würde ein winziges j mitschwingen: *мя* in *мясо* klingt wie „mja“, *тё* in *тётя* wie „tjo“. Das ist ein ECHTER Unterschied – kein Schnörkel.',
      },
      {
        emoji: '🔑',
        titel: 'Wer macht weich?',
        text: 'Die Vokale *я, е, ё, ю, и* machen den Konsonanten davor weich – zusätzlich das stille *ь* aus Lektion 7. *лук* = hart („luk“), *люк* = weich („ljuk“, die Luke). Zwei Wörter!',
      },
      {
        emoji: '🎧',
        titel: 'Ohr vor Mund',
        text: 'Erst HÖREN lernen, dann sprechen: Die Übungen gleich spielen dir Paare vor. Wenn dein Ohr hart und weich trennt, folgt der Mund von ganz allein.',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Тётя и дядя тут!', de: 'Tante und Onkel sind da!' },
      { sprecher: 'Tom', es: 'Класс! А что на ужин?', de: 'Klasse! Und was gibt es zum Abendessen?' },
      { sprecher: 'Anna', es: 'Мясо, суп и лук.', de: 'Fleisch, Suppe und Zwiebeln.' },
      { sprecher: 'Tom', es: 'И песня! Лето же!', de: 'Und ein Lied! Es ist doch Sommer!' },
    ],
  },

  {
    id: 'je-laute',
    niveau: 'A1.1',
    kursNr: 11,
    grammatik: ['е, ё, ю, я: mit j oder ohne – je nach Position'],
    wiederholt: ['hart-weich', 'kyrillisch-selten'],
    vorher: ['hart-weich'],
    kulturnotiz: 'Die ёлка (der Tannenbaum) gehört in Russland zu Neujahr, nicht zu Weihnachten – geschmückt wird zum 31. Dezember.',
    titel: 'Die Verwandlungs-Vokale',
    emoji: '🎄',
    hoerwort: true,
    beschreibung: 'Wann е, ё, ю, я ein j tragen – und wann nicht',
    ziele: [
      'Am Wortanfang: je, jo, ju, ja hören',
      'Nach Konsonant: nur Weichheit, kein j',
      'Zehn Wörter mit den Verwandlungs-Vokalen lesen',
    ],
    items: [
      { es: 'еда', de: 'das Essen', beispielEs: 'Еда на столе!', beispielDe: 'Das Essen steht auf dem Tisch!' },
      { es: 'ель', de: 'die Tanne', beispielEs: 'Ель в парке.', beispielDe: 'Die Tanne steht im Park.' },
      { es: 'ёж', de: 'der Igel', beispielEs: 'Ёж тут! Вот он!', beispielDe: 'Ein Igel! Da ist er!' },
      { es: 'ёлка', de: 'der Tannenbaum', beispielEs: 'Ёлка дома.', beispielDe: 'Der Tannenbaum ist zu Hause.' },
      { es: 'юг', de: 'der Süden', beispielEs: 'Море на юге.', beispielDe: 'Das Meer ist im Süden.' },
      { es: 'юбка', de: 'der Rock', beispielEs: 'Юбка – класс!', beispielDe: 'Der Rock ist klasse!' },
      { es: 'яйцо', de: 'das Ei', beispielEs: 'Яйцо и хлеб на ужин.', beispielDe: 'Ei und Brot zum Abendessen.' },
      { es: 'ягода', de: 'die Beere', beispielEs: 'Ягода в саду.', beispielDe: 'Die Beere ist im Garten.' },
      { es: 'земля', de: 'die Erde', beispielEs: 'Земля – наш дом.', beispielDe: 'Die Erde ist unser Zuhause.' },
      { es: 'имя', de: 'der Name', beispielEs: 'Моё имя – Том.', beispielDe: 'Mein Name ist Tom.' },
    ],
    wissen: [
      {
        emoji: '🚪',
        titel: 'Am Anfang: volles j',
        text: 'Am Wortanfang und nach Vokalen sprichst du das j mit: *еда* = „jedá“, *ёж* = „josch“, *юг* = „jug“, *яйцо* = „jajzó“.',
      },
      {
        emoji: '🍦',
        titel: 'Nach Konsonant: nur weich',
        text: 'Nach einem Konsonanten verschwindet das j – übrig bleibt Weichheit: *земля* = „semljá“, *имя* = „ímja“. Genau das hast du in Lektion 10 gehört.',
      },
      {
        emoji: '🎄',
        titel: 'ё ist immer der Star',
        text: 'Wo ein *ё* steht, liegt IMMER die Betonung: *ёлка*, *ёж*, *актёр*. Ein Buchstabe, der dir die Betonung gratis verrät – deshalb schreiben wir ihn konsequent.',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Смотри, ёж!', de: 'Schau, ein Igel!' },
      { sprecher: 'Tom', es: 'Где? У ёлки?', de: 'Wo? Am Tannenbaum?' },
      { sprecher: 'Anna', es: 'Да! А там ягода.', de: 'Ja! Und dort ist eine Beere.' },
      { sprecher: 'Tom', es: 'Его имя – Ёжик!', de: 'Sein Name ist Joschik!' },
    ],
  },

  {
    id: 'i-y',
    niveau: 'A1.1',
    kursNr: 12,
    grammatik: ['и oder ы – zwei Laute, zwei Welten'],
    wiederholt: ['je-laute', 'hart-weich'],
    vorher: ['je-laute'],
    kulturnotiz: 'Kein einziges echtes russisches Wort beginnt mit ы – der Laut lebt nur mitten im Wort.',
    titel: 'и oder ы?',
    emoji: '⚖️',
    hoerwort: true,
    beschreibung: 'Das helle und das dunkle i endlich auseinanderhalten',
    ziele: [
      'и und ы im Hören unterscheiden',
      'Die Mundposition für ы finden',
      'Zehn Wörter mit beiden Lauten meistern',
    ],
    items: [
      { es: 'рынок', de: 'der Markt', beispielEs: 'Рынок в центре.', beispielDe: 'Der Markt ist im Zentrum.' },
      { es: 'сын', de: 'der Sohn', beispielEs: 'Мой сын дома.', beispielDe: 'Mein Sohn ist zu Hause.' },
      { es: 'мышь', de: 'die Maus', beispielEs: 'Мышь тут! Ой!', beispielDe: 'Eine Maus! Oh!' },
      { es: 'быстро', de: 'schnell', beispielEs: 'Трамвай – это быстро.', beispielDe: 'Die Straßenbahn ist schnell.' },
      { es: 'дыня', de: 'die Melone', beispielEs: 'Дыня на рынке.', beispielDe: 'Die Melone gibt es auf dem Markt.' },
      { es: 'книга', de: 'das Buch', beispielEs: 'Книга на столе.', beispielDe: 'Das Buch liegt auf dem Tisch.' },
      { es: 'лицо', de: 'das Gesicht', beispielEs: 'Лицо и голова.', beispielDe: 'Gesicht und Kopf.' },
      { es: 'лиса', de: 'der Fuchs', beispielEs: 'Лиса в лесу.', beispielDe: 'Der Fuchs ist im Wald.' },
      { es: 'письмо', de: 'der Brief', beispielEs: 'Вот твоё письмо.', beispielDe: 'Hier ist dein Brief.' },
    ],
    wissen: [
      {
        emoji: '👄',
        titel: 'So findest du ы',
        text: 'Sprich ein „i“ – und zieh die Zunge nach hinten, als würdest du gleich „u“ sagen. Der Laut, der dabei entsteht, IST *ы*: *сын*, *рынок*, *быстро*.',
      },
      {
        emoji: '⚖️',
        titel: 'Das Paar üben',
        text: '*мишка* (Bärchen) gegen *мышка* (Mäuschen) – nur и/ы trennt sie. Die Hör-Übungen spielen dir solche Fast-Zwillinge vor, bis dein Ohr sie sauber trennt.',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Мышь! Там мышь!', de: 'Eine Maus! Dort ist eine Maus!' },
      { sprecher: 'Tom', es: 'Где? Это не мышь.', de: 'Wo? Das ist keine Maus.' },
      { sprecher: 'Anna', es: 'А что это?', de: 'Und was ist das?' },
      { sprecher: 'Tom', es: 'Это лиса! Быстро домой!', de: 'Das ist ein Fuchs! Schnell nach Hause!' },
    ],
  },

  {
    id: 'stimmhaft',
    niveau: 'A1.1',
    kursNr: 14,
    grammatik: ['Auslautverhärtung: хлеб klingt wie „chlep“'],
    wiederholt: ['betonung', 'silben'],
    vorher: ['betonung'],
    kulturnotiz: 'Brot (хлеб) ist in Russland heilig – Brot wegzuwerfen galt lange als eine der schlimmsten Sünden im Haushalt.',
    titel: 'Das harte Ende',
    emoji: '🍞',
    diktat: true,
    beschreibung: 'Warum б am Wortende wie p klingt',
    ziele: [
      'Die Auslautverhärtung hören',
      'б/п, д/т, г/к, ж/ш, з/с als Paare kennen',
      'Beim Schreiben trotzdem den weichen Buchstaben treffen',
    ],
    items: [
      { es: 'хлеб', de: 'das Brot', beispielEs: 'Хлеб на столе.', beispielDe: 'Das Brot liegt auf dem Tisch.' },
      { es: 'зуб', de: 'der Zahn', beispielEs: 'Зуб болит.', beispielDe: 'Der Zahn tut weh.' },
      { es: 'глаз', de: 'das Auge', beispielEs: 'Глаз видит всё.', beispielDe: 'Das Auge sieht alles.' },
      { es: 'снег', de: 'der Schnee', beispielEs: 'Снег! Уже зима.', beispielDe: 'Schnee! Es ist schon Winter.' },
      { es: 'гараж', de: 'die Garage', beispielEs: 'Машина в гараже.', beispielDe: 'Das Auto steht in der Garage.' },
      { es: 'нож', de: 'das Messer', beispielEs: 'Нож на кухне.', beispielDe: 'Das Messer ist in der Küche.' },
      { es: 'сад', de: 'der Garten', beispielEs: 'Бабушка в саду.', beispielDe: 'Oma ist im Garten.' },
      { es: 'обед', de: 'das Mittagessen', beispielEs: 'Обед готов!', beispielDe: 'Das Mittagessen ist fertig!' },
      { es: 'завод', de: 'die Fabrik', beispielEs: 'Завод за городом.', beispielDe: 'Die Fabrik ist außerhalb der Stadt.' },
      { es: 'рассказ', de: 'die Erzählung', beispielEs: 'Рассказ – класс!', beispielDe: 'Die Erzählung ist klasse!' },
    ],
    wissen: [
      {
        emoji: '🔇',
        titel: 'Am Ende wird alles hart',
        text: 'Stimmhafte Konsonanten verlieren am Wortende ihre Stimme: *хлеб* klingt „chlep“, *сад* klingt „sat“, *нож* klingt „nosch“. Geschrieben bleibt der weiche Buchstabe!',
      },
      {
        emoji: '👯',
        titel: 'Die fünf Paare',
        text: '*б/п, д/т, г/к, ж/ш, з/с* – jeder stimmhafte Laut hat einen stimmlosen Zwilling. Am Wortende spricht man immer den Zwilling. Deshalb reimt sich *глаз* auf „las“.',
      },
      {
        emoji: '✍️',
        titel: 'Darum gibt es jetzt Diktate',
        text: 'Du hörst „sat“ – schreibst aber *сад*. Genau diese Falle üben die neuen Diktat-Aufgaben: Ohr hört hart, Hand schreibt weich.',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Обед готов! Хлеб тут.', de: 'Das Mittagessen ist fertig! Das Brot ist hier.' },
      { sprecher: 'Tom', es: 'А где нож?', de: 'Und wo ist das Messer?' },
      { sprecher: 'Anna', es: 'На кухне. Смотри – снег!', de: 'In der Küche. Schau – Schnee!' },
      { sprecher: 'Tom', es: 'Снег в саду! Красиво.', de: 'Schnee im Garten! Wie schön.' },
    ],
  },

  {
    id: 'schwere-laute',
    niveau: 'A1.1',
    kursNr: 15,
    grammatik: ['Die schweren Laute und Lautgruppen'],
    wiederholt: ['stimmhaft', 'betonung'],
    vorher: ['stimmhaft'],
    kulturnotiz: 'здравствуйте sagt kaum ein Russe in voller Länge – gesprochen wird meist „sdrásste“.',
    titel: 'Die Endgegner',
    emoji: '🐉',
    diktat: true,
    beschreibung: 'ж, ш, щ, ц und die berühmten Konsonanten-Türme',
    ziele: [
      'Die Zischlaute in echten Wörtern sprechen',
      'Konsonantengruppen entschärfen',
      'Verständlich sein statt perfekt',
    ],
    items: [
      { es: 'жизнь', de: 'das Leben', beispielEs: 'Жизнь – это класс!', beispielDe: 'Das Leben ist klasse!' },
      { es: 'женщина', de: 'die Frau', beispielEs: 'Эта женщина – мой гид.', beispielDe: 'Diese Frau ist meine Reiseführerin.' },
      { es: 'мужчина', de: 'der Mann', beispielEs: 'Мужчина у окна.', beispielDe: 'Der Mann steht am Fenster.' },
      { es: 'чашка', de: 'die Tasse', beispielEs: 'Чашка чая, пожалуйста.', beispielDe: 'Eine Tasse Tee, bitte.' },
      { es: 'шапка', de: 'die Mütze', beispielEs: 'Зима! Где моя шапка?', beispielDe: 'Winter! Wo ist meine Mütze?' },
      { es: 'цветок', de: 'die Blume', beispielEs: 'Цветок для мамы.', beispielDe: 'Eine Blume für Mama.' },
      { es: 'часы', de: 'die Uhr', beispielEs: 'Часы на руке.', beispielDe: 'Die Uhr ist am Handgelenk.' },
      { es: 'чемодан', de: 'der Koffer', beispielEs: 'Чемодан уже в такси.', beispielDe: 'Der Koffer ist schon im Taxi.' },
      { es: 'площадь', de: 'der Platz (in der Stadt)', beispielEs: 'Красная площадь в Москве.', beispielDe: 'Der Rote Platz ist in Moskau.' },
      { es: 'счастье', de: 'das Glück', beispielEs: 'Это счастье!', beispielDe: 'Das ist Glück!' },
    ],
    wissen: [
      {
        emoji: '🐉',
        titel: 'Der Turm in здравствуйте',
        text: 'Der Trick bei Konsonanten-Türmen: einfach einen verschlucken. In *здравствуйте* spricht niemand das erste в – „sdrástwujte“. In *счастье* klingt сч wie щ: „schtschástje“.',
      },
      {
        emoji: '🎯',
        titel: 'Verständlich schlägt perfekt',
        text: 'Dein Ziel ist nicht die perfekte russische Kehle – dein Ziel ist, verstanden zu werden. Ein deutsches r in *рынок* versteht jeder Russe sofort. Sprich mutig!',
      },
      {
        emoji: '🧊',
        titel: 'ж wie in Garage',
        text: 'Das summende *ж* kennst du längst: „Garage“, „Journal“. *жизнь* = „schisnj“ mit Summton. Und *ц* ist einfach unser z: *цветок* = „zwetók“.',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Где мой чемодан?', de: 'Wo ist mein Koffer?' },
      { sprecher: 'Tom', es: 'Тут! И твоя шапка тоже.', de: 'Hier! Und deine Mütze auch.' },
      { sprecher: 'Anna', es: 'Часы, цветок, чашка…', de: 'Die Uhr, die Blume, die Tasse…' },
      { sprecher: 'Tom', es: 'Всё тут. Это счастье!', de: 'Alles ist da. So ein Glück!' },
    ],
  },

  {
    id: 'schrift',
    niveau: 'A1.1',
    kursNr: 16,
    grammatik: ['Schilder, Chats und die kyrillische Tastatur'],
    wiederholt: ['schwere-laute', 'international'],
    vorher: ['schwere-laute'],
    kulturnotiz: 'Auf russischen Schildern steht fast alles in GROSSBUCHSTABEN – ВХОД und ВЫХОД liest du an jeder Tür.',
    titel: 'Russisch in freier Wildbahn',
    emoji: '🪧',
    diktat: true,
    beschreibung: 'Schilder lesen, Chats verstehen, Tastatur einrichten',
    ziele: [
      'Die wichtigsten Schilder sofort erkennen',
      'Kursive Buchstaben nicht mehr fürchten',
      'Die kyrillische Tastatur aktivieren',
    ],
    items: [
      { es: 'вход', de: 'der Eingang', beispielEs: 'Вход там.', beispielDe: 'Der Eingang ist dort.' },
      { es: 'выход', de: 'der Ausgang', beispielEs: 'Где выход?', beispielDe: 'Wo ist der Ausgang?' },
      { es: 'открыто', de: 'geöffnet', beispielEs: 'Магазин открыто? Да!', beispielDe: 'Hat das Geschäft geöffnet? Ja!' },
      { es: 'закрыто', de: 'geschlossen', beispielEs: 'Музей закрыто сегодня.', beispielDe: 'Das Museum ist heute geschlossen.' },
      { es: 'касса', de: 'die Kasse', beispielEs: 'Касса там, у входа.', beispielDe: 'Die Kasse ist dort, am Eingang.' },
      { es: 'аптека', de: 'die Apotheke', beispielEs: 'Аптека у метро.', beispielDe: 'Die Apotheke ist an der Metro.' },
      { es: 'вокзал', de: 'der Bahnhof', beispielEs: 'Вокзал в центре.', beispielDe: 'Der Bahnhof ist im Zentrum.' },
      { es: 'туалет', de: 'die Toilette', beispielEs: 'Извините, где туалет?', beispielDe: 'Entschuldigung, wo ist die Toilette?' },
      { es: 'улица', de: 'die Straße (in der Stadt)', beispielEs: 'Улица Мира – это тут.', beispielDe: 'Die Friedensstraße – das ist hier.' },
      { es: 'остановка', de: 'die Haltestelle', beispielEs: 'Остановка у парка.', beispielDe: 'Die Haltestelle ist am Park.' },
    ],
    wissen: [
      {
        emoji: '🪧',
        titel: 'Die Schilder-Vier',
        text: '*ВХОД*, *ВЫХОД*, *ОТКРЫТО*, *ЗАКРЫТО* – wer diese vier kennt, kommt in jede Tür rein und wieder raus. Dazu *КАССА* und *АПТЕКА*, und die Stadt gehört dir.',
      },
      {
        emoji: '✒️',
        titel: 'Kursiv sieht anders aus',
        text: 'Kursives *т* sieht aus wie ein m, kursives *и* wie ein u, kursives *д* wie ein g. Nicht erschrecken – der Zusammenhang verrät das Wort fast immer.',
      },
      {
        emoji: '⌨️',
        titel: 'Aktivier deine Tastatur',
        text: 'Handy: Einstellungen → Tastatur → Russisch hinzufügen. Ab jetzt kannst du auf Russisch tippen – und ab dieser Lektion fragt dich das Diktat genau das ab.',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Смотри: „Закрыто“.', de: 'Schau: „Geschlossen“.' },
      { sprecher: 'Tom', es: 'А аптека? Открыто?', de: 'Und die Apotheke? Geöffnet?' },
      { sprecher: 'Anna', es: 'Да. Она у остановки.', de: 'Ja. Sie ist an der Haltestelle.' },
      { sprecher: 'Tom', es: 'Хорошо, а потом на вокзал.', de: 'Gut, und danach zum Bahnhof.' },
    ],
  },

  {
    id: 'leseseite',
    niveau: 'A1.1',
    kursNr: 17,
    grammatik: ['Die erste echte Leseseite'],
    wiederholt: ['schrift', 'stimmhaft', 'silben'],
    vorher: ['schrift'],
    kulturnotiz: 'Wer in Russland zu Gast ist, bekommt IMMER Tee und etwas Süßes – ablehnen gilt als unhöflich.',
    titel: 'Deine erste Leseseite',
    emoji: '📖',
    diktat: true,
    beschreibung: 'Eine kleine Geschichte – und du liest einfach mit',
    ziele: [
      'Einen zusammenhängenden Text lesen',
      'Unbekannte Wörter aus dem Zusammenhang erraten',
      'Dein erstes Diktat mit echten Sätzen',
    ],
    items: [
      { es: 'гость', de: 'der Gast', beispielEs: 'Том – наш гость.', beispielDe: 'Tom ist unser Gast.' },
      { es: 'стол', de: 'der Tisch', beispielEs: 'Торт на столе.', beispielDe: 'Die Torte steht auf dem Tisch.' },
      { es: 'стул', de: 'der Stuhl', beispielEs: 'Вот твой стул.', beispielDe: 'Hier ist dein Stuhl.' },
      { es: 'кухня', de: 'die Küche', beispielEs: 'Бабушка на кухне.', beispielDe: 'Oma ist in der Küche.' },
      { es: 'вечер', de: 'der Abend', beispielEs: 'Добрый вечер!', beispielDe: 'Guten Abend!' },
      { es: 'ужин', de: 'das Abendessen', beispielEs: 'Ужин готов.', beispielDe: 'Das Abendessen ist fertig.' },
      { es: 'торт', de: 'die Torte', beispielEs: 'Торт – это счастье.', beispielDe: 'Torte ist Glück.' },
      { es: 'подарок', de: 'das Geschenk', beispielEs: 'Подарок для тёти.', beispielDe: 'Ein Geschenk für die Tante.' },
      { es: 'цветы', de: 'die Blumen', beispielEs: 'Цветы для бабушки.', beispielDe: 'Blumen für Oma.' },
      { es: 'дома', de: 'zu Hause', beispielEs: 'Вечером я дома.', beispielDe: 'Abends bin ich zu Hause.' },
    ],
    wissen: [
      {
        emoji: '📖',
        titel: 'Die Geschichte, Teil 1',
        text: 'Вечер. Том – гость. Он у подъезда, в руке – *цветы* и *подарок*. Дверь открыта. „Добрый вечер!“ – Abend. Tom ist zu Gast, mit Blumen und Geschenk an der Tür.',
      },
      {
        emoji: '📖',
        titel: 'Die Geschichte, Teil 2',
        text: 'Бабушка на *кухне*. На столе – суп, хлеб, мясо и *торт*. „Ты наш гость! Вот твой стул.“ – Oma kocht, der Tisch ist voll, Tom bekommt den Ehrenplatz.',
      },
      {
        emoji: '💡',
        titel: 'So liest man „echt“',
        text: 'Du hast gerade eine halbe Seite Russisch gelesen – ohne Wörterbuch. Unbekanntes hast du aus dem Zusammenhang erraten. GENAU SO funktioniert Lesen ab jetzt immer.',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Добрый вечер! Ты наш гость!', de: 'Guten Abend! Du bist unser Gast!' },
      { sprecher: 'Tom', es: 'Вот цветы и подарок.', de: 'Hier sind Blumen und ein Geschenk.' },
      { sprecher: 'Anna', es: 'Спасибо! Ужин на столе.', de: 'Danke! Das Abendessen steht auf dem Tisch.' },
      { sprecher: 'Tom', es: 'Суп, торт… Это счастье!', de: 'Suppe, Torte… Das ist Glück!' },
    ],
  },

  {
    id: 'abschluss-lesen',
    niveau: 'A1.1',
    kursNr: 18,
    grammatik: ['Modulabschluss: Kyrillisch sitzt'],
    wiederholt: ['leseseite', 'schwere-laute', 'betonung', 'hart-weich'],
    vorher: ['leseseite'],
    kulturnotiz: 'Am 1. September beginnt in ganz Russland die Schule – der „Tag des Wissens“ mit Blumen für die Lehrer.',
    titel: 'Ich kann Kyrillisch lesen',
    emoji: '🏁',
    hoerwort: true,
    diktat: true,
    beschreibung: 'Der Beweis: Du liest, hörst und schreibst Russisch',
    ziele: [
      'Unbekannte Wörter selbstständig lesen',
      'Gehörtes sicher zuordnen und schreiben',
      'Bereit sein für Modul 2: echte Gespräche',
    ],
    items: [
      { es: 'алфавит', de: 'das Alphabet', beispielEs: 'Алфавит – это 33 буквы.', beispielDe: 'Das Alphabet – das sind 33 Buchstaben.' },
      { es: 'буква', de: 'der Buchstabe', beispielEs: 'Это буква Ж.', beispielDe: 'Das ist der Buchstabe Ж.' },
      { es: 'слово', de: 'das Wort', beispielEs: 'Это новое слово.', beispielDe: 'Das ist ein neues Wort.' },
      { es: 'язык', de: 'die Sprache', beispielEs: 'Русский язык – класс!', beispielDe: 'Die russische Sprache ist klasse!' },
      { es: 'урок', de: 'die Lektion', beispielEs: 'Урок номер восемнадцать.', beispielDe: 'Lektion Nummer achtzehn.' },
      { es: 'задание', de: 'die Aufgabe', beispielEs: 'Задание – это не проблема.', beispielDe: 'Die Aufgabe ist kein Problem.' },
      { es: 'пример', de: 'das Beispiel', beispielEs: 'Вот пример.', beispielDe: 'Hier ist ein Beispiel.' },
      { es: 'школа', de: 'die Schule', beispielEs: 'Школа у парка.', beispielDe: 'Die Schule ist am Park.' },
      { es: 'учитель', de: 'der Lehrer', beispielEs: 'Учитель в классе.', beispielDe: 'Der Lehrer ist im Klassenzimmer.' },
      { es: 'класс', de: 'die Klasse', beispielEs: 'Мой класс – это класс!', beispielDe: 'Meine Klasse ist klasse!' },
    ],
    wissen: [
      {
        emoji: '🏆',
        titel: 'Schau, was du kannst',
        text: 'Vor 18 Lektionen war *алфавит* ein Rätsel aus fremden Zeichen. Jetzt liest du *счастье*, hörst den Unterschied zwischen *и* und *ы* und schreibst *хлеб* trotz „chlep“. Das ist die härteste Hürde des Russischen – und sie liegt HINTER dir.',
      },
      {
        emoji: '🗺️',
        titel: 'Was jetzt kommt',
        text: 'Modul 2 heißt „Erste Gespräche“: begrüßen, dich vorstellen, fragen und antworten. Die Schrift ist ab jetzt dein Werkzeug, nicht mehr dein Thema.',
      },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Урок восемнадцать – финал!', de: 'Lektion achtzehn – das Finale!' },
      { sprecher: 'Tom', es: 'Я читаю! Это не проблема!', de: 'Ich kann lesen! Das ist kein Problem!' },
      { sprecher: 'Anna', es: 'Молодец! Ты мой лучший класс.', de: 'Gut gemacht! Du bist meine beste Klasse.' },
      { sprecher: 'Tom', es: 'Спасибо, учитель Анна!', de: 'Danke, Lehrerin Anna!' },
    ],
  },

  {
    id: 'berufe',
    niveau: 'A1.1',
    kursNr: 22,
    grammatik: ['Я студент – Identität ohne „sein“'],
    wiederholt: ['kein-sein', 'vorstellen', 'begruessung'],
    vorher: ['kein-sein'],
    kulturnotiz: 'In Russland fragt man beim Kennenlernen schnell nach dem Beruf – er gilt als Teil der Identität, nicht als Privatsache.',
    titel: 'Wer bist du von Beruf?',
    emoji: '👩‍⚕️',
    beschreibung: 'Berufe nennen – ganz ohne „ich bin“',
    ziele: ['Deinen Beruf sagen', 'Nach dem Beruf fragen', 'Zehn Berufe kennen'],
    items: [
      { es: 'врач', de: 'der Arzt', beispielEs: 'Моя мама – врач.', beispielDe: 'Meine Mutter ist Ärztin.' },
      { es: 'учительница', de: 'die Lehrerin', beispielEs: 'Анна – учительница.', beispielDe: 'Anna ist Lehrerin.' },
      { es: 'инженер', de: 'der Ingenieur', beispielEs: 'Мой папа – инженер.', beispielDe: 'Mein Papa ist Ingenieur.' },
      { es: 'программист', de: 'der Programmierer', beispielEs: 'Я программист.', beispielDe: 'Ich bin Programmierer.' },
      { es: 'повар', de: 'der Koch', beispielEs: 'Том – повар? Нет!', beispielDe: 'Tom ist Koch? Nein!' },
      { es: 'водитель', de: 'der Fahrer', beispielEs: 'Водитель уже тут.', beispielDe: 'Der Fahrer ist schon da.' },
      { es: 'продавец', de: 'der Verkäufer', beispielEs: 'Продавец в магазине.', beispielDe: 'Der Verkäufer ist im Geschäft.' },
      { es: 'художник', de: 'der Künstler', beispielEs: 'Она художник.', beispielDe: 'Sie ist Künstlerin.' },
      { es: 'менеджер', de: 'der Manager', beispielEs: 'Он менеджер в банке.', beispielDe: 'Er ist Manager in einer Bank.' },
      { es: 'музыкант', de: 'der Musiker', beispielEs: 'Мой брат – музыкант.', beispielDe: 'Mein Bruder ist Musiker.' },
    ],
    wissen: [
      { emoji: '🪄', titel: 'Beruf = Wort, fertig', text: '*Я программист* – „Ich (bin) Programmierer.“ Kein „bin“, kein Artikel: Person + Beruf, Satz fertig. Kürzer geht Russisch nicht.' },
      { emoji: '👩‍🏫', titel: 'Weibliche Formen', text: 'Viele Berufe haben eine weibliche Form: *учитель* → *учительница*. Andere gelten für alle: *врач* (Arzt/Ärztin), *инженер*. Im Zweifel: die männliche Form ist für beide okay.' },
      { emoji: '❓', titel: 'Die Frage dazu', text: '*Кто ты по профессии?* – wörtlich „Wer bist du nach Beruf?“ Die Antwort: einfach das Berufswort. *Я врач.* Danke, nächste Frage.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Том, ты студент?', de: 'Tom, bist du Student?' },
      { sprecher: 'Tom', es: 'Нет, я программист. А ты?', de: 'Nein, ich bin Programmierer. Und du?' },
      { sprecher: 'Anna', es: 'Я учительница.', de: 'Ich bin Lehrerin.' },
      { sprecher: 'Tom', es: 'А твой брат – музыкант?', de: 'Und dein Bruder ist Musiker?' },
    ],
  },

  {
    id: 'pronomen',
    niveau: 'A1.1',
    kursNr: 23,
    grammatik: ['ты oder вы – und das höfliche Вы'],
    wiederholt: ['berufe', 'kein-sein', 'vorstellen'],
    vorher: ['berufe'],
    kulturnotiz: 'In Briefen und Mails schreibt man das höfliche Вы groß – ein kleines Zeichen großen Respekts.',
    titel: 'Du oder Sie?',
    emoji: '🫵',
    beschreibung: 'ты, вы und alle anderen – wer wen wie anspricht',
    ziele: ['Alle Personalpronomen sicher haben', 'ты und вы richtig wählen', 'Höflich fragen, wie es jemandem geht'],
    items: [
      { es: 'оно', de: 'es', beispielEs: 'Это окно. Оно открыто.', beispielDe: 'Das ist das Fenster. Es ist offen.' },
      { es: 'как ты?', de: 'wie geht’s dir?', beispielEs: 'Привет! Как ты?', beispielDe: 'Hallo! Wie geht’s dir?' },
      { es: 'как вы?', de: 'wie geht es Ihnen?', beispielEs: 'Здравствуйте! Как вы?', beispielDe: 'Guten Tag! Wie geht es Ihnen?' },
      { es: 'ты прав', de: 'du hast recht', beispielEs: 'Да, ты прав.', beispielDe: 'Ja, du hast recht.' },
      { es: 'вы правы', de: 'Sie haben recht', beispielEs: 'Вы правы, это дорого.', beispielDe: 'Sie haben recht, das ist teuer.' },
      { es: 'это ты?', de: 'bist du das?', beispielEs: 'Том, это ты?', beispielDe: 'Tom, bist du das?' },
      { es: 'это вы?', de: 'sind Sie das?', beispielEs: 'Анна Ивановна, это вы?', beispielDe: 'Anna Iwanowna, sind Sie das?' },
      { es: 'вместе', de: 'zusammen', beispielEs: 'Мы вместе в парке.', beispielDe: 'Wir sind zusammen im Park.' },
      { es: 'друзья', de: 'die Freunde', beispielEs: 'Они мои друзья.', beispielDe: 'Sie sind meine Freunde.' },
      { es: 'коллеги', de: 'die Kollegen', beispielEs: 'Мы коллеги.', beispielDe: 'Wir sind Kollegen.' },
    ],
    wissen: [
      { emoji: '🫵', titel: 'Wann ты, wann вы?', text: '*ты* zu Freunden, Familie, Kindern. *вы* zu Fremden, Älteren, im Geschäft – und zu mehreren Leuten zugleich. Unsicher? Nimm *вы*, das ist nie falsch.' },
      { emoji: '📋', titel: 'Die ganze Familie', text: '*я* ich, *ты* du, *он* er, *она* sie, *оно* es, *мы* wir, *вы* ihr/Sie, *они* sie. Acht Wörter – mehr Pronomen braucht der Alltag nicht.' },
      { emoji: '✉️', titel: 'Das große Вы', text: 'Schreibst du jemandem höflich, wird *Вы* großgeschrieben – wie unser „Sie“. Im Gespräch hört man keinen Unterschied, im Chat sieht man ihn sofort.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Здравствуйте! Это вы – Том?', de: 'Guten Tag! Sind Sie Tom?' },
      { sprecher: 'Tom', es: 'Да, это я. Можно на ты?', de: 'Ja, das bin ich. Dürfen wir uns duzen?' },
      { sprecher: 'Anna', es: 'Конечно! Как ты?', de: 'Natürlich! Wie geht’s dir?' },
      { sprecher: 'Tom', es: 'Отлично. Мы теперь друзья!', de: 'Super. Wir sind jetzt Freunde!' },
    ],
  },

  {
    id: 'genus',
    niveau: 'A1.1',
    kursNr: 24,
    grammatik: ['Das Geschlecht: -а/-я weiblich, -о/-е sächlich, Konsonant männlich'],
    wiederholt: ['pronomen', 'berufe', 'kyrillisch-falsche'],
    vorher: ['pronomen'],
    kulturnotiz: 'Das Wort кафе ist „unveränderlich“ – es kommt aus dem Französischen und macht bei keiner Endung mit.',
    titel: 'Er, sie oder es?',
    emoji: '🚻',
    hoerwort: true,
    beschreibung: 'Das Geschlecht erkennst du am Wortende',
    ziele: ['Das Geschlecht an der Endung ablesen', 'он/она/оно für Dinge benutzen', 'Zehn Möbel und Orte kennen'],
    items: [
      { es: 'парень', de: 'der junge Mann', beispielEs: 'Этот парень – мой брат.', beispielDe: 'Dieser junge Mann ist mein Bruder.' },
      { es: 'девушка', de: 'das Mädchen', beispielEs: 'Девушка читает.', beispielDe: 'Das Mädchen liest.' },
      { es: 'здание', de: 'das Gebäude', beispielEs: 'Здание очень старое.', beispielDe: 'Das Gebäude ist sehr alt.' },
      { es: 'поле', de: 'das Feld', beispielEs: 'Поле за домом.', beispielDe: 'Das Feld ist hinter dem Haus.' },
      { es: 'кафе', de: 'das Café', beispielEs: 'Кафе открыто.', beispielDe: 'Das Café ist geöffnet.' },
      { es: 'лампа', de: 'die Lampe', beispielEs: 'Лампа на столе.', beispielDe: 'Die Lampe steht auf dem Tisch.' },
      { es: 'диван', de: 'das Sofa', beispielEs: 'Диван новый.', beispielDe: 'Das Sofa ist neu.' },
      { es: 'кресло', de: 'der Sessel', beispielEs: 'Кресло у окна.', beispielDe: 'Der Sessel steht am Fenster.' },
      { es: 'зеркало', de: 'der Spiegel', beispielEs: 'Зеркало в коридоре.', beispielDe: 'Der Spiegel hängt im Flur.' },
      { es: 'тетрадь', de: 'das Heft', beispielEs: 'Тетрадь дома.', beispielDe: 'Das Heft ist zu Hause.' },
    ],
    wissen: [
      { emoji: '🚻', titel: 'Die Endung verrät es', text: 'Endet ein Wort auf Konsonant → männlich (*диван*, *парень*). Auf *-а/-я* → weiblich (*лампа*, *девушка*). Auf *-о/-е* → sächlich (*зеркало*, *поле*). Das Wortende sagt dir, ob он, она oder оно.' },
      { emoji: '🎭', titel: 'Die Ausnahme: -ь', text: 'Wörter auf *ь* können beides sein: *парень* ist männlich, *тетрадь* weiblich. Die lernst du einfach mit ihrem Geschlecht – es sind nicht viele.' },
      { emoji: '🧊', titel: 'Die Unbeweglichen', text: '*кафе*, *метро*, *такси* sind Fremdwörter und ändern sich nie. Sie sind sächlich und bleiben einfach, wie sie sind. Angenehm!' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Смотри, какое здание!', de: 'Schau, was für ein Gebäude!' },
      { sprecher: 'Tom', es: 'Оно старое, но красивое.', de: 'Es ist alt, aber schön.' },
      { sprecher: 'Anna', es: 'А там кафе. Оно открыто?', de: 'Und dort ist ein Café. Hat es offen?' },
      { sprecher: 'Tom', es: 'Да! Кафе, диван, лампа – уют!', de: 'Ja! Café, Sofa, Lampe – Gemütlichkeit!' },
    ],
  },

  {
    id: 'adjektive',
    niveau: 'A1.1',
    kursNr: 25,
    grammatik: ['Adjektive im Nominativ: новый, новая, новое, новые'],
    wiederholt: ['genus', 'pronomen'],
    vorher: ['genus'],
    kulturnotiz: 'красивый (schön) kommt von краса (Schönheit) – und „Krasnaja Ploschtschad“ hieß ursprünglich „schöner“, nicht „roter“ Platz.',
    titel: 'Neu, alt, groß, klein',
    emoji: '🎨',
    beschreibung: 'Eigenschaften – passend zum Geschlecht',
    ziele: ['Dinge und Menschen beschreiben', 'Adjektiv-Endungen an das Geschlecht anpassen', 'Zehn Grund-Adjektive kennen'],
    items: [
      { es: 'новый', de: 'neu', beispielEs: 'Новый телефон!', beispielDe: 'Ein neues Telefon!' },
      { es: 'старый', de: 'alt', beispielEs: 'Старый дом в центре.', beispielDe: 'Das alte Haus im Zentrum.' },
      { es: 'большой', de: 'groß', beispielEs: 'Москва – большой город.', beispielDe: 'Moskau ist eine große Stadt.' },
      { es: 'маленький', de: 'klein', beispielEs: 'Маленькая комната.', beispielDe: 'Ein kleines Zimmer.' },
      { es: 'красивый', de: 'schön', beispielEs: 'Красивая девушка.', beispielDe: 'Ein schönes Mädchen.' },
      { es: 'хороший', de: 'gut (Adjektiv)', beispielEs: 'Хороший друг.', beispielDe: 'Ein guter Freund.' },
      { es: 'плохой', de: 'schlecht', beispielEs: 'Плохая погода.', beispielDe: 'Schlechtes Wetter.' },
      { es: 'молодой', de: 'jung', beispielEs: 'Молодой врач.', beispielDe: 'Ein junger Arzt.' },
      { es: 'дорогой', de: 'teuer (Adjektiv)', beispielEs: 'Дорогое кафе.', beispielDe: 'Ein teures Café.' },
      { es: 'вкусный', de: 'lecker', beispielEs: 'Вкусный борщ!', beispielDe: 'Leckerer Borschtsch!' },
    ],
    wissen: [
      { emoji: '🎨', titel: 'Vier Endungen', text: '*новый дом* (m), *новая лампа* (f), *новое кафе* (n), *новые друзья* (Pl). Das Adjektiv trägt die Endung des Geschlechts – wie eine passende Jacke.' },
      { emoji: '👀', titel: 'Die Kurzform im Ohr', text: '*новый* wird „nówyj“ gesprochen, *большой* „balschój“ mit Betonung hinten. Achte auf das *-ой*: Dort liegt immer die Betonung.' },
      { emoji: '💡', titel: 'Erst Adjektiv, dann Wort', text: 'Wie im Deutschen: *красивая девушка*, *большой город*. Die Reihenfolge kennst du schon – nur die Endung ist neu.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Это новый телефон?', de: 'Ist das ein neues Telefon?' },
      { sprecher: 'Tom', es: 'Да, но дорогой.', de: 'Ja, aber teuer.' },
      { sprecher: 'Anna', es: 'Красивый! А старый где?', de: 'Schön! Und wo ist das alte?' },
      { sprecher: 'Tom', es: 'Дома. Он плохой и маленький.', de: 'Zu Hause. Es ist schlecht und klein.' },
    ],
  },

  {
    id: 'plural',
    niveau: 'A1.1',
    kursNr: 26,
    grammatik: ['Nominativ Plural: -ы/-и und die Regel nach г к х ж ш щ ч'],
    wiederholt: ['adjektive', 'genus', 'silben'],
    vorher: ['adjektive'],
    kulturnotiz: 'дети (Kinder) hat keine Einzahl vom gleichen Stamm – ein Kind ist ребёнок. Solche Paare gibt es im Russischen ein paar.',
    titel: 'Einer, viele',
    emoji: '👥',
    hoerwort: true,
    beschreibung: 'Die Mehrzahl – und die eine Rechtschreibregel, die alles regelt',
    ziele: ['Die Pluralendungen -ы und -и bilden', 'Die Schreibregel nach г, к, х, ж, ш, щ, ч kennen', 'Die wichtigsten unregelmäßigen Plurale'],
    items: [
      { es: 'книги', de: 'die Bücher', beispielEs: 'Книги на полке.', beispielDe: 'Die Bücher stehen im Regal.' },
      { es: 'столы', de: 'die Tische', beispielEs: 'Столы в кафе.', beispielDe: 'Die Tische sind im Café.' },
      { es: 'машины', de: 'die Autos', beispielEs: 'Машины на улице.', beispielDe: 'Die Autos sind auf der Straße.' },
      { es: 'студенты', de: 'die Studenten', beispielEs: 'Студенты в классе.', beispielDe: 'Die Studenten sind im Klassenzimmer.' },
      { es: 'города', de: 'die Städte', beispielEs: 'Города России большие.', beispielDe: 'Die Städte Russlands sind groß.' },
      { es: 'окна', de: 'die Fenster', beispielEs: 'Окна открыты.', beispielDe: 'Die Fenster sind offen.' },
      { es: 'дети', de: 'die Kinder', beispielEs: 'Дети в парке.', beispielDe: 'Die Kinder sind im Park.' },
      { es: 'яблоки', de: 'die Äpfel', beispielEs: 'Яблоки вкусные.', beispielDe: 'Die Äpfel sind lecker.' },
      { es: 'кошки', de: 'die Katzen', beispielEs: 'Кошки дома.', beispielDe: 'Die Katzen sind zu Hause.' },
      { es: 'мальчики', de: 'die Jungen', beispielEs: 'Мальчики играют.', beispielDe: 'Die Jungen spielen.' },
    ],
    wissen: [
      { emoji: '👥', titel: '-ы ist die Normalform', text: '*стол → столы*, *машина → машины*, *студент → студенты*. Die Endung *-ы* ist der Standard für männlich und weiblich.' },
      { emoji: '🔑', titel: 'Die 7-Buchstaben-Regel', text: 'Nach *г, к, х, ж, ш, щ, ч* schreibt man NIE ы, immer и: *книга → книги*, *мальчик → мальчики*, *кошка → кошки*. Diese Regel begleitet dich durch die ganze Grammatik.' },
      { emoji: '🎲', titel: 'Die Ausreißer', text: '*город → города*, *окно → окна*, *ребёнок → дети*. Ein paar Wörter tanzen aus der Reihe – die lernst du als Klang, nicht als Regel.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Сколько тут книг!', de: 'So viele Bücher hier!' },
      { sprecher: 'Tom', es: 'Да, книги, журналы… и кошки!', de: 'Ja, Bücher, Zeitschriften… und Katzen!' },
      { sprecher: 'Anna', es: 'А где дети?', de: 'Und wo sind die Kinder?' },
      { sprecher: 'Tom', es: 'Дети и мальчики в парке.', de: 'Die Kinder und die Jungen sind im Park.' },
    ],
  },

  {
    id: 'verben-1',
    niveau: 'A1.1',
    kursNr: 28,
    grammatik: ['Präsens, erste Konjugation: -ю, -ешь, -ет, -ем, -ете, -ют'],
    wiederholt: ['fragen', 'plural', 'berufe'],
    vorher: ['fragen'],
    kulturnotiz: 'Russen fragen selten „Was machst du beruflich?“ – eher „Wo arbeitest du?“ (Где ты работаешь?).',
    titel: 'Ich arbeite, du liest',
    emoji: '⚙️',
    hoerwort: true,
    beschreibung: 'Deine ersten Verben – die e-Konjugation',
    ziele: ['Sechs Formen eines Verbs bilden', 'Stamm und Endung erkennen', 'Zehn Alltagsverben benutzen'],
    items: [
      { es: 'работать', de: 'arbeiten', beispielEs: 'Я работаю в банке.', beispielDe: 'Ich arbeite in einer Bank.' },
      { es: 'читать', de: 'lesen', beispielEs: 'Ты читаешь книгу?', beispielDe: 'Liest du ein Buch?' },
      { es: 'знать', de: 'wissen', beispielEs: 'Он знает всё.', beispielDe: 'Er weiß alles.' },
      { es: 'делать', de: 'machen', beispielEs: 'Что ты делаешь?', beispielDe: 'Was machst du?' },
      { es: 'играть', de: 'spielen', beispielEs: 'Дети играют в парке.', beispielDe: 'Die Kinder spielen im Park.' },
      { es: 'гулять', de: 'spazieren gehen', beispielEs: 'Мы гуляем вечером.', beispielDe: 'Wir gehen abends spazieren.' },
      { es: 'слушать', de: 'zuhören', beispielEs: 'Вы слушаете музыку?', beispielDe: 'Hört ihr Musik?' },
      { es: 'думать', de: 'denken', beispielEs: 'Я думаю, это хорошо.', beispielDe: 'Ich denke, das ist gut.' },
      { es: 'понимать', de: 'verstehen', beispielEs: 'Ты понимаешь меня?', beispielDe: 'Verstehst du mich?' },
      { es: 'отдыхать', de: 'sich erholen', beispielEs: 'Они отдыхают на море.', beispielDe: 'Sie erholen sich am Meer.' },
    ],
    wissen: [
      { emoji: '⚙️', titel: 'Das Muster', text: '*работать*: я работа-*ю*, ты работа-*ешь*, он работа-*ет*, мы работа-*ем*, вы работа-*ете*, они работа-*ют*. Stamm + sechs Endungen = fertig.' },
      { emoji: '✂️', titel: '-ть abschneiden', text: 'Der Infinitiv endet auf *-ть*. Schneid es ab – übrig bleibt der Stamm: *чита-*, *зна-*, *дела-*. Daran hängst du die Endungen. Das funktioniert bei allen zehn Verben hier.' },
      { emoji: '🗣️', titel: 'Das Pronomen darf bleiben', text: 'Anders als im Spanischen sagt man *я работаю* meist MIT я. Die Endung verrät zwar die Person, aber Russen lassen das Pronomen trotzdem gern stehen.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Том, что ты делаешь?', de: 'Tom, was machst du?' },
      { sprecher: 'Tom', es: 'Я читаю. А ты работаешь?', de: 'Ich lese. Und du, arbeitest du?' },
      { sprecher: 'Anna', es: 'Нет, я отдыхаю и слушаю музыку.', de: 'Nein, ich erhole mich und höre Musik.' },
      { sprecher: 'Tom', es: 'Я понимаю! Потом гуляем?', de: 'Ich verstehe! Gehen wir danach spazieren?' },
    ],
  },

  {
    id: 'verben-2',
    niveau: 'A1.1',
    kursNr: 29,
    grammatik: ['Präsens, zweite Konjugation: -ю, -ишь, -ит, -им, -ите, -ят'],
    wiederholt: ['verben-1', 'adjektive'],
    vorher: ['verben-1'],
    kulturnotiz: 'любить heißt „lieben“ UND „gern mögen“ – Я люблю кофе ist keine Liebeserklärung, nur eine Vorliebe.',
    titel: 'Sprechen, lieben, sehen',
    emoji: '❤️',
    hoerwort: true,
    beschreibung: 'Die i-Konjugation – das zweite Muster',
    ziele: ['Die i-Endungen bilden', 'говорить und любить sicher benutzen', 'Zehn weitere Alltagsverben'],
    items: [
      { es: 'говорить', de: 'sprechen', beispielEs: 'Я говорю по-русски.', beispielDe: 'Ich spreche Russisch.' },
      { es: 'любить', de: 'lieben', beispielEs: 'Я люблю чай.', beispielDe: 'Ich mag Tee.' },
      { es: 'учить', de: 'lernen', beispielEs: 'Мы учим русский.', beispielDe: 'Wir lernen Russisch.' },
      { es: 'смотреть', de: 'schauen', beispielEs: 'Ты смотришь фильм?', beispielDe: 'Schaust du einen Film?' },
      { es: 'видеть', de: 'sehen', beispielEs: 'Я вижу море!', beispielDe: 'Ich sehe das Meer!' },
      { es: 'слышать', de: 'hören', beispielEs: 'Вы слышите меня?', beispielDe: 'Hören Sie mich?' },
      { es: 'стоять', de: 'stehen', beispielEs: 'Он стоит у окна.', beispielDe: 'Er steht am Fenster.' },
      { es: 'лежать', de: 'liegen', beispielEs: 'Книга лежит на столе.', beispielDe: 'Das Buch liegt auf dem Tisch.' },
      { es: 'сидеть', de: 'sitzen', beispielEs: 'Мы сидим в кафе.', beispielDe: 'Wir sitzen im Café.' },
      { es: 'спать', de: 'schlafen', beispielEs: 'Дети спят.', beispielDe: 'Die Kinder schlafen.' },
    ],
    wissen: [
      { emoji: '❤️', titel: 'Das zweite Muster', text: '*говорить*: говор-*ю*, говор-*ишь*, говор-*ит*, говор-*им*, говор-*ите*, говор-*ят*. Statt е steht и – das ist der ganze Unterschied zur ersten Gruppe.' },
      { emoji: '🔀', titel: 'Kleine Überraschungen', text: '*любить* → *я люблю* (ein л schleicht sich ein), *видеть* → *я вижу*, *сидеть* → *я сижу*. Nur die ich-Form ist speziell – der Rest läuft regelmäßig.' },
      { emoji: '🤷', titel: 'Woran erkenne ich die Gruppe?', text: 'Ehrlich: nicht immer am Infinitiv. *-ить* ist meist Gruppe 2, *-ать* meist Gruppe 1 – aber *спать* ist Gruppe 2. Lern jedes Verb mit seiner ich- und du-Form, dann sitzt es.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Ты говоришь по-русски?', de: 'Sprichst du Russisch?' },
      { sprecher: 'Tom', es: 'Немного. Я учу и смотрю фильмы.', de: 'Ein bisschen. Ich lerne und schaue Filme.' },
      { sprecher: 'Anna', es: 'Я тебя вижу и слышу – молодец!', de: 'Ich sehe und höre dich – gut gemacht!' },
      { sprecher: 'Tom', es: 'Спасибо! Я люблю русский.', de: 'Danke! Ich liebe Russisch.' },
    ],
  },

  {
    id: 'verben-muster',
    niveau: 'A1.1',
    kursNr: 30,
    grammatik: ['Die wichtigsten unregelmäßigen Verben als Ganzes'],
    wiederholt: ['verben-2', 'verben-1', 'pronomen'],
    vorher: ['verben-2'],
    kulturnotiz: 'Das russische Wort есть heißt „essen“ – und als Wort in der Gegenwart „es gibt“. Zwei Bedeutungen, ein Wort.',
    titel: 'Die Verben, die man täglich braucht',
    emoji: '🧰',
    beschreibung: 'жить, хотеть, мочь & Co. – als Muster, nicht als Tabelle',
    ziele: ['жить, хотеть, мочь benutzen', 'есть, пить, писать sicher haben', 'идти und ехать unterscheiden'],
    items: [
      { es: 'жить', de: 'wohnen', beispielEs: 'Я живу в Берлине.', beispielDe: 'Ich wohne in Berlin.' },
      { es: 'хотеть', de: 'wollen', beispielEs: 'Я хочу кофе.', beispielDe: 'Ich will einen Kaffee.' },
      { es: 'мочь', de: 'können', beispielEs: 'Ты можешь помочь?', beispielDe: 'Kannst du helfen?' },
      { es: 'есть', de: 'essen', beispielEs: 'Мы едим суп.', beispielDe: 'Wir essen Suppe.' },
      { es: 'пить', de: 'trinken', beispielEs: 'Он пьёт чай.', beispielDe: 'Er trinkt Tee.' },
      { es: 'писать', de: 'schreiben', beispielEs: 'Я пишу письмо.', beispielDe: 'Ich schreibe einen Brief.' },
      { es: 'идти', de: 'gehen (zu Fuß)', beispielEs: 'Я иду домой.', beispielDe: 'Ich gehe nach Hause.' },
      { es: 'ехать', de: 'fahren', beispielEs: 'Мы едем в Москву.', beispielDe: 'Wir fahren nach Moskau.' },
      { es: 'давать', de: 'geben', beispielEs: 'Она даёт мне книгу.', beispielDe: 'Sie gibt mir ein Buch.' },
      { es: 'брать', de: 'nehmen', beispielEs: 'Я беру такси.', beispielDe: 'Ich nehme ein Taxi.' },
    ],
    wissen: [
      { emoji: '🧰', titel: 'Die Unregelmäßigen', text: '*жить* → *я живу, ты живёшь*. *хотеть* → *я хочу, ты хочешь, мы хотим*. *мочь* → *я могу, ты можешь*. Diese Verben lernst du als Klangbild – und sie sind so häufig, dass sie schnell sitzen.' },
      { emoji: '🚶', titel: 'идти oder ехать?', text: '*идти* = zu Fuß gehen, *ехать* = mit etwas fahren (Auto, Bus, Zug). Russisch trennt das immer – in Modul 6 wird das ein großes Thema.' },
      { emoji: '🍽️', titel: 'есть und пить', text: '*я ем, ты ешь, он ест, мы едим* – und *я пью, ты пьёшь*. Zwei Verben, die du dreimal am Tag brauchst.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Ты хочешь есть?', de: 'Willst du etwas essen?' },
      { sprecher: 'Tom', es: 'Да! Я хочу суп и хлеб.', de: 'Ja! Ich will Suppe und Brot.' },
      { sprecher: 'Anna', es: 'Где ты живёшь сейчас?', de: 'Wo wohnst du jetzt?' },
      { sprecher: 'Tom', es: 'В центре. Я иду пешком домой.', de: 'Im Zentrum. Ich gehe zu Fuß nach Hause.' },
    ],
  },

  {
    id: 'verneinung',
    niveau: 'A1.1',
    kursNr: 31,
    grammatik: ['Verneinung mit не und нет – und die neutrale Wortstellung'],
    wiederholt: ['verben-muster', 'fragen'],
    vorher: ['verben-muster'],
    kulturnotiz: 'Russen verneinen gern doppelt: Я никогда не… (ich nie nicht…) ist völlig korrekt – und Pflicht!',
    titel: 'Nein, nicht, nie',
    emoji: '🚫',
    beschreibung: 'Verneinen – und dabei die Wortstellung im Griff behalten',
    ziele: ['не vor dem Verb setzen', 'никогда und никто mit не kombinieren', 'Die neutrale Satzstellung kennen'],
    items: [
      { es: 'не', de: 'nicht', beispielEs: 'Я не знаю.', beispielDe: 'Ich weiß nicht.' },
      { es: 'не хочу', de: 'ich will nicht', beispielEs: 'Я не хочу кофе.', beispielDe: 'Ich will keinen Kaffee.' },
      { es: 'не могу', de: 'ich kann nicht', beispielEs: 'Извини, я не могу.', beispielDe: 'Entschuldige, ich kann nicht.' },
      { es: 'не понимаю', de: 'ich verstehe nicht', beispielEs: 'Я не понимаю. Ещё раз?', beispielDe: 'Ich verstehe nicht. Noch einmal?' },
      { es: 'никогда', de: 'nie', beispielEs: 'Я никогда не ем мясо.', beispielDe: 'Ich esse nie Fleisch.' },
      { es: 'никто', de: 'niemand', beispielEs: 'Никто не знает.', beispielDe: 'Niemand weiß es.' },
      { es: 'нигде', de: 'nirgends', beispielEs: 'Я нигде не вижу ключ.', beispielDe: 'Ich sehe nirgends den Schlüssel.' },
      { es: 'совсем не', de: 'gar nicht', beispielEs: 'Это совсем не дорого.', beispielDe: 'Das ist gar nicht teuer.' },
      { es: 'уже не', de: 'nicht mehr', beispielEs: 'Я уже не студент.', beispielDe: 'Ich bin nicht mehr Student.' },
      { es: 'нет, спасибо', de: 'nein danke', beispielEs: 'Чай? – Нет, спасибо.', beispielDe: 'Tee? – Nein danke.' },
    ],
    wissen: [
      { emoji: '🚫', titel: 'не vor das Verb', text: '*не* steht direkt vor dem, was verneint wird: *Я не знаю*, *Он не работает*. Kein Extra-Hilfsverb, kein „do“. Einfach не davor.' },
      { emoji: '➕', titel: 'Doppelt hält besser', text: '*никогда* (nie), *никто* (niemand), *нигде* (nirgends) brauchen ZUSÄTZLICH не beim Verb: *Я никогда не ем мясо*. Was im Deutschen falsch wäre, ist hier Pflicht.' },
      { emoji: '📐', titel: 'Die neutrale Reihenfolge', text: 'Subjekt – Verb – Objekt: *Я читаю книгу*. Russisch kann umstellen, um etwas zu betonen – aber lern erst die neutrale Form. Sie ist nie falsch.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Ты хочешь мясо?', de: 'Willst du Fleisch?' },
      { sprecher: 'Tom', es: 'Нет, спасибо. Я никогда не ем мясо.', de: 'Nein danke. Ich esse nie Fleisch.' },
      { sprecher: 'Anna', es: 'Правда? А рыбу?', de: 'Wirklich? Und Fisch?' },
      { sprecher: 'Tom', es: 'Рыбу – да! Это совсем не проблема.', de: 'Fisch – ja! Das ist gar kein Problem.' },
    ],
  },

  {
    id: 'possessiv',
    niveau: 'A1.1',
    kursNr: 32,
    grammatik: ['Possessivbegleiter: мой, твой, наш, ваш – его, её, их'],
    wiederholt: ['verneinung', 'genus', 'vorstellen'],
    vorher: ['verneinung'],
    kulturnotiz: 'Zu Verwandten sagt man oft nicht „meine Mutter“, sondern einfach мама – der Besitz ist sowieso klar.',
    titel: 'Mein, dein, unser',
    emoji: '🔑',
    beschreibung: 'Wem gehört was – passend zum Geschlecht',
    ziele: ['мой/моя/моё/мои anpassen', 'его, её, их als unveränderlich kennen', 'Nach dem Besitzer fragen'],
    items: [
      { es: 'твой', de: 'dein', beispielEs: 'Это твой телефон?', beispielDe: 'Ist das dein Telefon?' },
      { es: 'твоя', de: 'deine', beispielEs: 'Твоя книга на столе.', beispielDe: 'Dein Buch liegt auf dem Tisch.' },
      { es: 'наш', de: 'unser', beispielEs: 'Наш дом большой.', beispielDe: 'Unser Haus ist groß.' },
      { es: 'наша', de: 'unsere', beispielEs: 'Наша машина там.', beispielDe: 'Unser Auto steht dort.' },
      { es: 'ваш', de: 'euer / Ihr', beispielEs: 'Ваш город красивый.', beispielDe: 'Eure Stadt ist schön.' },
      { es: 'ваша', de: 'eure / Ihre', beispielEs: 'Это ваша семья?', beispielDe: 'Ist das Ihre Familie?' },
      { es: 'его', de: 'sein (Besitz)', beispielEs: 'Это его брат.', beispielDe: 'Das ist sein Bruder.' },
      { es: 'её', de: 'ihr (Besitz, Einzahl)', beispielEs: 'Её мама – врач.', beispielDe: 'Ihre Mutter ist Ärztin.' },
      { es: 'их', de: 'ihr (Besitz, Mehrzahl)', beispielEs: 'Их дети в школе.', beispielDe: 'Ihre Kinder sind in der Schule.' },
      { es: 'чей?', de: 'wessen?', beispielEs: 'Чей это ключ?', beispielDe: 'Wessen Schlüssel ist das?' },
    ],
    wissen: [
      { emoji: '🔑', titel: 'Vier Formen wie das Adjektiv', text: '*мой дом* (m), *моя книга* (f), *моё окно* (n), *мои друзья* (Pl). Genauso *твой/твоя/твоё/твои*, *наш/наша/наше/наши*, *ваш/ваша/ваше/ваши*.' },
      { emoji: '🧊', titel: 'Drei Unveränderliche', text: '*его* (sein), *её* (ihr), *их* (ihr, Mehrzahl) bleiben IMMER gleich: *его дом, его книга, его друзья*. Eine Sorge weniger.' },
      { emoji: '❓', titel: 'Wessen?', text: '*Чей это ключ?* – Wessen Schlüssel? Auch *чей* passt sich an: *чья книга*, *чьё окно*, *чьи дети*. Die Antwort: *мой, твоя, наше…*' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Чей это телефон? Твой?', de: 'Wessen Telefon ist das? Deins?' },
      { sprecher: 'Tom', es: 'Нет, не мой. Может, её?', de: 'Nein, nicht meins. Vielleicht ihres?' },
      { sprecher: 'Anna', es: 'Это наш гость. Его телефон.', de: 'Das ist unser Gast. Sein Telefon.' },
      { sprecher: 'Tom', es: 'А ваша семья уже дома?', de: 'Und ist eure Familie schon zu Hause?' },
    ],
  },

  {
    id: 'abschluss-gespraeche',
    niveau: 'A1.1',
    kursNr: 36,
    grammatik: ['Modulabschluss: dein erstes Kennenlernen'],
    wiederholt: ['possessiv', 'zahlen', 'hoeflichkeit', 'herkunft', 'verben-muster'],
    vorher: ['hoeflichkeit'],
    kulturnotiz: 'Beim Kennenlernen fragt man in Russland früh nach dem Alter – das ist keine Unhöflichkeit, sondern Interesse.',
    titel: 'Erstes Kennenlernen',
    emoji: '🤝',
    beschreibung: 'Alles zusammen: begrüßen, vorstellen, fragen, antworten',
    ziele: ['Ein komplettes Kennenlern-Gespräch führen', 'Fünf Fragen stellen und beantworten', 'Bereit für den Alltag in Modul 3'],
    items: [
      { es: 'знакомство', de: 'das Kennenlernen', beispielEs: 'Знакомство – это легко.', beispielDe: 'Kennenlernen ist leicht.' },
      { es: 'разговор', de: 'das Gespräch', beispielEs: 'Хороший разговор!', beispielDe: 'Ein gutes Gespräch!' },
      { es: 'встреча', de: 'das Treffen', beispielEs: 'Встреча в кафе в семь.', beispielDe: 'Das Treffen ist um sieben im Café.' },
      { es: 'новости', de: 'die Neuigkeiten', beispielEs: 'Какие новости?', beispielDe: 'Was gibt es Neues?' },
      { es: 'история', de: 'die Geschichte', beispielEs: 'Это долгая история.', beispielDe: 'Das ist eine lange Geschichte.' },
      { es: 'интервью', de: 'das Interview', beispielEs: 'Интервью завтра.', beispielDe: 'Das Interview ist morgen.' },
      { es: 'фото', de: 'das Foto', beispielEs: 'Вот фото моей семьи.', beispielDe: 'Hier ist ein Foto meiner Familie.' },
      { es: 'адрес', de: 'die Adresse', beispielEs: 'Какой твой адрес?', beispielDe: 'Wie ist deine Adresse?' },
      { es: 'номер', de: 'die Nummer', beispielEs: 'Мой номер – пять, семь, два.', beispielDe: 'Meine Nummer ist fünf, sieben, zwei.' },
      { es: 'удача', de: 'der Erfolg (Glück)', beispielEs: 'Удачи тебе!', beispielDe: 'Viel Erfolg dir!' },
    ],
    wissen: [
      { emoji: '🤝', titel: 'Das Drehbuch', text: 'Begrüßen (*привет / здравствуйте*), Name (*меня зовут*), Herkunft (*я из…*), Beruf (*я программист*), Frage zurück (*а ты?*). Fünf Bausteine – und du hast ein Gespräch.' },
      { emoji: '🔢', titel: 'Zahlen im Gespräch', text: 'Telefonnummer, Alter, Adresse – die Zahlen 0–10 reichen für jede Nummer, die man Ziffer für Ziffer sagt: *пять, семь, два*.' },
      { emoji: '🚀', titel: 'Und jetzt?', text: 'Modul 3 heißt „Alltag, Wohnung und Tagesablauf“: Du lernst, über dein Leben zu sprechen – was du isst, wo du wohnst, wie dein Tag aussieht.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Привет! Меня зовут Анна. А тебя?', de: 'Hallo! Ich heiße Anna. Und du?' },
      { sprecher: 'Tom', es: 'Я Том, из Германии. Я программист.', de: 'Ich bin Tom, aus Deutschland. Ich bin Programmierer.' },
      { sprecher: 'Anna', es: 'Очень приятно! Какой твой номер?', de: 'Freut mich! Wie ist deine Nummer?' },
      { sprecher: 'Tom', es: 'Пять, семь, два. Удачи – и до встречи!', de: 'Fünf, sieben, zwei. Viel Erfolg – und bis zum Treffen!' },
    ],
  },

  {
    id: 'akkusativ',
    niveau: 'A1.1',
    kursNr: 37,
    grammatik: ['Akkusativ der Objekte: книга → книгу'],
    wiederholt: ['abschluss-gespraeche', 'verben-1', 'plural'],
    vorher: ['abschluss-gespraeche'],
    kulturnotiz: 'Im Russischen wird das Objekt am Wortende markiert – deshalb ist die Wortstellung so frei: Книгу читаю я ist derselbe Satz.',
    titel: 'Ich lese ein Buch',
    emoji: '📦',
    diktat: true,
    beschreibung: 'Der erste Fall: wen oder was?',
    ziele: ['Weibliche Wörter auf -у/-ю setzen', 'Männliche und sächliche Objekte erkennen', 'Zehn neue Dinge benennen'],
    items: [
      { es: 'газета', de: 'die Zeitung', beispielEs: 'Я читаю газету.', beispielDe: 'Ich lese die Zeitung.' },
      { es: 'статья', de: 'der Artikel (Text)', beispielEs: 'Она пишет статью.', beispielDe: 'Sie schreibt einen Artikel.' },
      { es: 'сумка', de: 'die Tasche', beispielEs: 'Я вижу сумку.', beispielDe: 'Ich sehe die Tasche.' },
      { es: 'кружка', de: 'der Becher', beispielEs: 'Дай мне кружку.', beispielDe: 'Gib mir den Becher.' },
      { es: 'ручка', de: 'der Stift', beispielEs: 'Где ручка? Я беру ручку.', beispielDe: 'Wo ist der Stift? Ich nehme den Stift.' },
      { es: 'карта', de: 'die Landkarte', beispielEs: 'Мы смотрим карту.', beispielDe: 'Wir schauen auf die Landkarte.' },
      { es: 'билет', de: 'die Fahrkarte', beispielEs: 'Я покупаю билет.', beispielDe: 'Ich kaufe eine Fahrkarte.' },
      { es: 'рубашка', de: 'das Hemd', beispielEs: 'Он покупает рубашку.', beispielDe: 'Er kauft ein Hemd.' },
      { es: 'куртка', de: 'die Jacke', beispielEs: 'Я беру куртку.', beispielDe: 'Ich nehme die Jacke.' },
      { es: 'квартира', de: 'die Wohnung', beispielEs: 'Мы смотрим квартиру.', beispielDe: 'Wir schauen uns die Wohnung an.' },
    ],
    wissen: [
      { emoji: '📦', titel: '-а wird zu -у', text: 'Weibliche Wörter ändern im Akkusativ die Endung: *книга → книгу*, *газета → газету*, *сумка → сумку*. Wer oder was? *книга*. Wen oder was? *книгу*.' },
      { emoji: '🧊', titel: 'Männlich und sächlich: nichts passiert', text: '*Я читаю журнал*, *Я вижу окно* – unbelebte männliche und sächliche Wörter bleiben im Akkusativ genau gleich. Die Hälfte des Falls ist also geschenkt.' },
      { emoji: '🎯', titel: 'Warum das wichtig ist', text: 'Der Akkusativ ist der häufigste Fall nach dem Nominativ. Jedes *читать, видеть, покупать, брать* zieht ihn nach sich. Ab hier hörst du ihn überall.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Что ты читаешь?', de: 'Was liest du?' },
      { sprecher: 'Tom', es: 'Газету. А ты?', de: 'Die Zeitung. Und du?' },
      { sprecher: 'Anna', es: 'Я пишу статью. И пью чай.', de: 'Ich schreibe einen Artikel. Und trinke Tee.' },
      { sprecher: 'Tom', es: 'Дай мне кружку, пожалуйста!', de: 'Gib mir bitte den Becher!' },
    ],
  },

  {
    id: 'objektpronomen',
    niveau: 'A1.1',
    kursNr: 38,
    grammatik: ['Objektpronomen: меня, тебя, его, её, нас, вас, их'],
    wiederholt: ['akkusativ', 'pronomen', 'verben-2'],
    vorher: ['akkusativ'],
    kulturnotiz: 'Я тебя люблю – die drei wichtigsten Wörter der Welt stehen im Russischen gern mit dem Objekt in der Mitte.',
    titel: 'Mich, dich, uns',
    emoji: '🫂',
    beschreibung: 'Wen kennst du, wen siehst du?',
    ziele: ['Die Objektformen der Pronomen', 'Sätze wie „ich kenne dich“ bauen', 'Das Pronomen vor dem Verb platzieren'],
    items: [
      { es: 'меня', de: 'mich', beispielEs: 'Ты понимаешь меня?', beispielDe: 'Verstehst du mich?' },
      { es: 'тебя', de: 'dich', beispielEs: 'Я вижу тебя.', beispielDe: 'Ich sehe dich.' },
      { es: 'его', de: 'ihn', beispielEs: 'Мы знаем его.', beispielDe: 'Wir kennen ihn.' },
      { es: 'её', de: 'sie (Einzahl, Objekt)', beispielEs: 'Я люблю её.', beispielDe: 'Ich liebe sie.' },
      { es: 'нас', de: 'uns', beispielEs: 'Он слушает нас.', beispielDe: 'Er hört uns zu.' },
      { es: 'вас', de: 'euch / Sie (Objekt)', beispielEs: 'Я слышу вас.', beispielDe: 'Ich höre Sie.' },
      { es: 'их', de: 'sie (Mehrzahl, Objekt)', beispielEs: 'Дети? Я вижу их.', beispielDe: 'Die Kinder? Ich sehe sie.' },
      { es: 'я знаю тебя', de: 'ich kenne dich', beispielEs: 'Я знаю тебя! Ты Том.', beispielDe: 'Ich kenne dich! Du bist Tom.' },
      { es: 'он видит нас', de: 'er sieht uns', beispielEs: 'Он видит нас в окне.', beispielDe: 'Er sieht uns im Fenster.' },
      { es: 'они любят её', de: 'sie lieben sie', beispielEs: 'Они любят её музыку.', beispielDe: 'Sie lieben ihre Musik.' },
    ],
    wissen: [
      { emoji: '🫂', titel: 'Die Objekt-Familie', text: '*меня, тебя, его, её, нас, вас, их* – das sind я, ты, он, она, мы, вы, они als Objekt. *Я знаю тебя* – ich kenne dich.' },
      { emoji: '🔁', titel: 'Bekannte Gesichter', text: '*его, её, их* kennst du aus Lektion 32 als „sein/ihr“. Jetzt heißen sie auch „ihn/sie/sie“. Gleiche Form, zwei Aufgaben – der Satz verrät, welche.' },
      { emoji: '📍', titel: 'Gern vor dem Verb', text: 'Russen sagen oft *Я тебя вижу* statt *Я вижу тебя*. Beides ist richtig – das Pronomen rutscht gern nach vorn, besonders in der gesprochenen Sprache.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Ты меня слышишь?', de: 'Hörst du mich?' },
      { sprecher: 'Tom', es: 'Да, я тебя слышу и вижу.', de: 'Ja, ich höre und sehe dich.' },
      { sprecher: 'Anna', es: 'А их? Они в парке.', de: 'Und sie? Sie sind im Park.' },
      { sprecher: 'Tom', es: 'Их я не вижу. Идём к ним!', de: 'Sie sehe ich nicht. Gehen wir zu ihnen!' },
    ],
  },

  {
    id: 'wollen-koennen',
    niveau: 'A1.1',
    kursNr: 39,
    grammatik: ['хотеть, мочь, любить + Infinitiv'],
    wiederholt: ['objektpronomen', 'verben-muster'],
    vorher: ['objektpronomen'],
    kulturnotiz: 'Можно помочь? ist der höfliche Klassiker – wörtlich „Darf man helfen?“, gemeint ist „Kann ich helfen?“.',
    titel: 'Ich will, ich kann, ich mag',
    emoji: '💪',
    beschreibung: 'Wünsche und Fähigkeiten mit dem Infinitiv',
    ziele: ['хочу/хочешь mit Infinitiv benutzen', 'могу/можешь für Fähigkeiten', 'Wünsche höflich äußern'],
    items: [
      { es: 'хочу', de: 'ich will', beispielEs: 'Я хочу спать.', beispielDe: 'Ich will schlafen.' },
      { es: 'хочешь?', de: 'willst du?', beispielEs: 'Хочешь чай?', beispielDe: 'Willst du Tee?' },
      { es: 'люблю', de: 'ich mag', beispielEs: 'Я люблю читать.', beispielDe: 'Ich lese gern.' },
      { es: 'могу', de: 'ich kann', beispielEs: 'Я могу помочь.', beispielDe: 'Ich kann helfen.' },
      { es: 'можешь?', de: 'kannst du?', beispielEs: 'Ты можешь говорить медленнее?', beispielDe: 'Kannst du langsamer sprechen?' },
      { es: 'хотим', de: 'wir wollen', beispielEs: 'Мы хотим гулять.', beispielDe: 'Wir wollen spazieren gehen.' },
      { es: 'любим', de: 'wir mögen', beispielEs: 'Мы любим музыку.', beispielDe: 'Wir mögen Musik.' },
      { es: 'хочу есть', de: 'ich will essen', beispielEs: 'Я хочу есть. Где кафе?', beispielDe: 'Ich will essen. Wo ist ein Café?' },
      { es: 'хочу пить', de: 'ich will trinken', beispielEs: 'Я хочу пить. Вода есть?', beispielDe: 'Ich will trinken. Gibt es Wasser?' },
      { es: 'могу помочь', de: 'ich kann helfen', beispielEs: 'Я могу помочь тебе.', beispielDe: 'Ich kann dir helfen.' },
    ],
    wissen: [
      { emoji: '💪', titel: 'Verb + Infinitiv', text: '*Я хочу спать*, *Я могу помочь*, *Я люблю читать* – nach хотеть, мочь, любить steht das zweite Verb im Infinitiv (auf *-ть*). Genau wie im Deutschen.' },
      { emoji: '🍲', titel: 'хочу есть = ich habe Hunger', text: 'Russen sagen nicht „ich habe Hunger“, sondern *я хочу есть* (ich will essen) und *я хочу пить* (ich will trinken). Zwei Sätze, die dich durch jeden Tag bringen.' },
      { emoji: '💝', titel: 'любить mit Verb', text: '*Я люблю читать* heißt „ich lese gern“ – любить + Infinitiv drückt aus, was man gern tut. Nicht nur Menschen, auch Tätigkeiten kann man „lieben“.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Ты хочешь есть?', de: 'Willst du essen?' },
      { sprecher: 'Tom', es: 'Да, очень! Я хочу суп.', de: 'Ja, sehr! Ich will Suppe.' },
      { sprecher: 'Anna', es: 'Можешь помочь на кухне?', de: 'Kannst du in der Küche helfen?' },
      { sprecher: 'Tom', es: 'Конечно, я могу и люблю готовить!', de: 'Natürlich, ich kann und mag kochen!' },
    ],
  },

  {
    id: 'praepositiv',
    niveau: 'A1.1',
    kursNr: 40,
    grammatik: ['Präpositiv für Orte: в/на + -е'],
    wiederholt: ['wollen-koennen', 'herkunft', 'akkusativ'],
    vorher: ['wollen-koennen'],
    kulturnotiz: 'На работе (auf der Arbeit) – Russen sind „auf“ der Arbeit, nicht „in“ ihr. Solche Bilder prägen die Sprache.',
    titel: 'Wo bist du?',
    emoji: '📍',
    beschreibung: 'Der Fall für den Aufenthaltsort',
    ziele: ['Orte mit в + -е nennen', 'на für Flächen und Veranstaltungen', 'Sagen, wo jemand gerade ist'],
    items: [
      { es: 'в школе', de: 'in der Schule', beispielEs: 'Дети в школе.', beispielDe: 'Die Kinder sind in der Schule.' },
      { es: 'в городе', de: 'in der Stadt', beispielEs: 'Я живу в городе.', beispielDe: 'Ich wohne in der Stadt.' },
      { es: 'в парке', de: 'im Park', beispielEs: 'Мы гуляем в парке.', beispielDe: 'Wir spazieren im Park.' },
      { es: 'на работе', de: 'auf der Arbeit', beispielEs: 'Папа на работе.', beispielDe: 'Papa ist auf der Arbeit.' },
      { es: 'на улице', de: 'auf der Straße', beispielEs: 'Дети играют на улице.', beispielDe: 'Die Kinder spielen auf der Straße.' },
      { es: 'в магазине', de: 'im Geschäft', beispielEs: 'Мама в магазине.', beispielDe: 'Mama ist im Geschäft.' },
      { es: 'в кафе', de: 'im Café', beispielEs: 'Мы сидим в кафе.', beispielDe: 'Wir sitzen im Café.' },
      { es: 'на море', de: 'am Meer', beispielEs: 'Летом мы на море.', beispielDe: 'Im Sommer sind wir am Meer.' },
      { es: 'в Москве', de: 'in Moskau', beispielEs: 'Анна живёт в Москве.', beispielDe: 'Anna wohnt in Moskau.' },
      { es: 'в Берлине', de: 'in Berlin', beispielEs: 'Том живёт в Берлине.', beispielDe: 'Tom wohnt in Berlin.' },
    ],
    wissen: [
      { emoji: '📍', titel: 'Wo? – Endung -е', text: 'Auf die Frage „wo?“ bekommt das Wort ein *-е*: *школа → в школе*, *парк → в парке*, *Москва → в Москве*. Das ist der Präpositiv – er heißt so, weil er nur nach Präpositionen steht.' },
      { emoji: '🏙️', titel: 'в oder на?', text: '*в* = in einem Raum (*в школе, в кафе*). *на* = auf einer Fläche oder bei einer Veranstaltung (*на улице, на работе, на море*). Lektion 41 macht daraus eine Regel.' },
      { emoji: '🔗', titel: 'Du kennst ihn schon', text: '*Я живу в Берлине* hast du in Lektion 34 gelernt – das war schon der Präpositiv! Jetzt weißt du, warum Берлин zu Берлине wird.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Где Том? В школе?', de: 'Wo ist Tom? In der Schule?' },
      { sprecher: 'Tom', es: 'Нет, я в кафе в центре.', de: 'Nein, ich bin im Café im Zentrum.' },
      { sprecher: 'Anna', es: 'А мама и папа?', de: 'Und Mama und Papa?' },
      { sprecher: 'Tom', es: 'Мама в магазине, папа на работе.', de: 'Mama ist im Geschäft, Papa auf der Arbeit.' },
    ],
  },

  {
    id: 'v-oder-na',
    niveau: 'A1.1',
    kursNr: 41,
    grammatik: ['в oder на: geschlossene Räume gegen Flächen und Ereignisse'],
    wiederholt: ['praepositiv', 'schrift'],
    vorher: ['praepositiv'],
    kulturnotiz: 'На почте (auf der Post), на вокзале (am Bahnhof) – alte Ortsbilder, bei denen sich keine Logik mehr finden lässt. Einfach mitlernen.',
    titel: 'в oder на?',
    emoji: '🧭',
    beschreibung: 'Die Orts-Paare als feste Verbindungen',
    ziele: ['на-Orte als Chunks speichern', 'в-Orte sicher bilden', 'Zehn neue Orte nennen'],
    items: [
      { es: 'на концерте', de: 'auf dem Konzert', beispielEs: 'Мы на концерте.', beispielDe: 'Wir sind auf dem Konzert.' },
      { es: 'на почте', de: 'auf der Post', beispielEs: 'Я на почте.', beispielDe: 'Ich bin auf der Post.' },
      { es: 'на вокзале', de: 'am Bahnhof', beispielEs: 'Поезд на вокзале.', beispielDe: 'Der Zug ist am Bahnhof.' },
      { es: 'на уроке', de: 'im Unterricht', beispielEs: 'Дети на уроке.', beispielDe: 'Die Kinder sind im Unterricht.' },
      { es: 'в театре', de: 'im Theater', beispielEs: 'Вечером мы в театре.', beispielDe: 'Abends sind wir im Theater.' },
      { es: 'в музее', de: 'im Museum', beispielEs: 'Гид в музее.', beispielDe: 'Der Reiseführer ist im Museum.' },
      { es: 'в банке', de: 'in der Bank', beispielEs: 'Папа работает в банке.', beispielDe: 'Papa arbeitet in einer Bank.' },
      { es: 'на площади', de: 'auf dem Platz', beispielEs: 'Люди на площади.', beispielDe: 'Die Leute sind auf dem Platz.' },
      { es: 'в России', de: 'in Russland', beispielEs: 'Анна живёт в России.', beispielDe: 'Anna lebt in Russland.' },
      { es: 'на юге', de: 'im Süden', beispielEs: 'Море на юге.', beispielDe: 'Das Meer ist im Süden.' },
    ],
    wissen: [
      { emoji: '🧭', titel: 'Die Faustregel', text: '*в* für geschlossene Räume und Länder/Städte: *в театре, в банке, в России*. *на* für Flächen, Veranstaltungen und Himmelsrichtungen: *на площади, на концерте, на юге*.' },
      { emoji: '📌', titel: 'Die berühmten Ausnahmen', text: '*на почте, на вокзале, на работе, на уроке* – hier hilft keine Logik. Lern sie als feste Paare, wie ein Vorname und Nachname: *на вокзале* ist ein Wort.' },
      { emoji: '🎧', titel: 'Chunks statt Regeln', text: 'Merk dir nicht „вокзал + на“, sondern *на вокзале* als Klang. Wer die Verbindung tausendmal gehört hat, macht nie wieder einen Fehler.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Ты где? На вокзале?', de: 'Wo bist du? Am Bahnhof?' },
      { sprecher: 'Tom', es: 'Нет, я на почте. Потом в банке.', de: 'Nein, ich bin auf der Post. Danach in der Bank.' },
      { sprecher: 'Anna', es: 'А вечером? Концерт в театре?', de: 'Und abends? Konzert im Theater?' },
      { sprecher: 'Tom', es: 'Да! Мы на концерте в семь.', de: 'Ja! Wir sind um sieben auf dem Konzert.' },
    ],
  },

  {
    id: 'est',
    niveau: 'A1.1',
    kursNr: 42,
    grammatik: ['Existenz mit есть: здесь есть кафе'],
    wiederholt: ['v-oder-na', 'verneinung'],
    vorher: ['v-oder-na'],
    kulturnotiz: 'Ein Balkon ist in russischen Wohnungen oft verglast und dient als Abstellraum – der „балкон“ ist mehr Kammer als Terrasse.',
    titel: 'Es gibt hier…',
    emoji: '✨',
    beschreibung: 'Sagen, dass etwas da ist – mit есть',
    ziele: ['есть für Existenz benutzen', 'есть von „ist“ unterscheiden', 'Die Ausstattung eines Ortes beschreiben'],
    items: [
      { es: 'есть', de: 'es gibt', beispielEs: 'Здесь есть кафе.', beispielDe: 'Hier gibt es ein Café.' },
      { es: 'здесь', de: 'hier', beispielEs: 'Я здесь!', beispielDe: 'Ich bin hier!' },
      { es: 'балкон', de: 'der Balkon', beispielEs: 'В квартире есть балкон.', beispielDe: 'In der Wohnung gibt es einen Balkon.' },
      { es: 'лифт', de: 'der Aufzug', beispielEs: 'В доме есть лифт.', beispielDe: 'Im Haus gibt es einen Aufzug.' },
      { es: 'душ', de: 'die Dusche', beispielEs: 'В ванной есть душ.', beispielDe: 'Im Bad gibt es eine Dusche.' },
      { es: 'ванна', de: 'die Badewanne', beispielEs: 'Ванна большая.', beispielDe: 'Die Badewanne ist groß.' },
      { es: 'холодильник', de: 'der Kühlschrank', beispielEs: 'Холодильник на кухне.', beispielDe: 'Der Kühlschrank steht in der Küche.' },
      { es: 'телевизор', de: 'der Fernseher', beispielEs: 'Телевизор в комнате.', beispielDe: 'Der Fernseher ist im Zimmer.' },
      { es: 'плита', de: 'der Herd', beispielEs: 'Плита новая.', beispielDe: 'Der Herd ist neu.' },
      { es: 'сосед', de: 'der Nachbar', beispielEs: 'Мой сосед – врач.', beispielDe: 'Mein Nachbar ist Arzt.' },
    ],
    wissen: [
      { emoji: '✨', titel: 'есть = „es gibt“', text: '*Здесь есть кафе* – hier gibt es ein Café. *В доме есть лифт* – im Haus gibt es einen Aufzug. *есть* sagt: Das existiert, das ist vorhanden.' },
      { emoji: '⚖️', titel: 'Wann KEIN есть?', text: 'Wenn es nicht um Existenz geht, sondern um Eigenschaft oder Ort: *Кафе открыто* (das Café ist offen), *Лифт там* (der Aufzug ist dort). Da bleibt „ist“ unsichtbar wie immer.' },
      { emoji: '❓', titel: 'Gibt es…?', text: '*Здесь есть интернет?* – Gibt es hier Internet? Die häufigste Frage in jedem Hotel. Die Antwort: *Да, есть.* oder *Нет.*' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'В квартире есть балкон?', de: 'Gibt es in der Wohnung einen Balkon?' },
      { sprecher: 'Tom', es: 'Да, есть. И лифт в доме.', de: 'Ja, gibt es. Und einen Aufzug im Haus.' },
      { sprecher: 'Anna', es: 'А душ? Холодильник?', de: 'Und eine Dusche? Einen Kühlschrank?' },
      { sprecher: 'Tom', es: 'Всё есть! И сосед – хороший.', de: 'Alles da! Und der Nachbar ist nett.' },
    ],
  },

  {
    id: 'wohnung',
    niveau: 'A1.1',
    kursNr: 43,
    grammatik: ['Wohnung beschreiben: есть, в, на und это zusammen'],
    wiederholt: ['est', 'leseseite', 'genus'],
    vorher: ['est'],
    kulturnotiz: 'In russischen Wohnungen zieht man an der Tür die Schuhe aus – Hausschuhe (тапочки) für Gäste stehen bereit.',
    titel: 'Willkommen in meiner Wohnung',
    emoji: '🏠',
    beschreibung: 'Räume und Möbel – eine Führung durch die Wohnung',
    ziele: ['Räume benennen', 'Sagen, wo etwas steht', 'Eine Wohnung beschreiben'],
    items: [
      { es: 'спальня', de: 'das Schlafzimmer', beispielEs: 'Спальня маленькая.', beispielDe: 'Das Schlafzimmer ist klein.' },
      { es: 'гостиная', de: 'das Wohnzimmer', beispielEs: 'Телевизор в гостиной.', beispielDe: 'Der Fernseher ist im Wohnzimmer.' },
      { es: 'ванная', de: 'das Badezimmer', beispielEs: 'Ванная справа.', beispielDe: 'Das Bad ist rechts.' },
      { es: 'коридор', de: 'der Flur', beispielEs: 'Зеркало в коридоре.', beispielDe: 'Der Spiegel hängt im Flur.' },
      { es: 'шкаф', de: 'der Schrank', beispielEs: 'Шкаф в спальне.', beispielDe: 'Der Schrank steht im Schlafzimmer.' },
      { es: 'кровать', de: 'das Bett', beispielEs: 'Кровать большая.', beispielDe: 'Das Bett ist groß.' },
      { es: 'этаж', de: 'die Etage', beispielEs: 'Мы живём на пятом этаже.', beispielDe: 'Wir wohnen in der fünften Etage.' },
      { es: 'прихожая', de: 'der Eingangsbereich', beispielEs: 'Прихожая у двери.', beispielDe: 'Der Eingangsbereich ist an der Tür.' },
      { es: 'потолок', de: 'die Decke (Raum)', beispielEs: 'Потолок высокий.', beispielDe: 'Die Decke ist hoch.' },
      { es: 'пол', de: 'der Fußboden', beispielEs: 'Кот на полу.', beispielDe: 'Der Kater liegt auf dem Fußboden.' },
    ],
    wissen: [
      { emoji: '🏠', titel: 'Die Führung', text: '*Это прихожая. Вот коридор. Здесь гостиная, там спальня.* Mit *это, вот, здесь, там* führst du jeden Gast durch die Wohnung – ohne ein einziges Verb.' },
      { emoji: '🛋️', titel: 'Wo steht was?', text: '*Шкаф в спальне* (im Schlafzimmer), *кот на полу* (auf dem Boden), *зеркало в коридоре*. Präpositiv aus Lektion 40 – jetzt mit Möbeln.' },
      { emoji: '🔢', titel: 'Welche Etage?', text: '*на пятом этаже* – in der fünften Etage. Russische Wohnhäuser sind hoch; die Etage gehört zur Adresse wie die Hausnummer.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Это твоя квартира? Красиво!', de: 'Das ist deine Wohnung? Schön!' },
      { sprecher: 'Tom', es: 'Да. Вот коридор, там гостиная.', de: 'Ja. Hier ist der Flur, dort das Wohnzimmer.' },
      { sprecher: 'Anna', es: 'А где спальня и ванная?', de: 'Und wo sind Schlafzimmer und Bad?' },
      { sprecher: 'Tom', es: 'Спальня справа, ванная там. Кот на кровати!', de: 'Schlafzimmer rechts, Bad dort. Der Kater liegt auf dem Bett!' },
    ],
  },

  {
    id: 'adjektiv-praepositiv',
    niveau: 'A1.1',
    kursNr: 44,
    grammatik: ['Adjektive im Präpositiv: в новом доме, на большой кухне'],
    wiederholt: ['wohnung', 'adjektive', 'praepositiv'],
    vorher: ['wohnung'],
    kulturnotiz: 'Die „Chruschtschowka“ – der typische Plattenbau der 60er – hat in Russland einen fast liebevollen Klang.',
    titel: 'Im neuen Haus',
    emoji: '🏢',
    beschreibung: 'Adjektiv und Ort zusammen – die Endungen -ом/-ой',
    ziele: ['-ом für männlich/sächlich im Präpositiv', '-ой für weiblich', 'Orte genauer beschreiben'],
    items: [
      { es: 'в новом доме', de: 'im neuen Haus', beispielEs: 'Мы живём в новом доме.', beispielDe: 'Wir wohnen im neuen Haus.' },
      { es: 'в большом городе', de: 'in der großen Stadt', beispielEs: 'Я живу в большом городе.', beispielDe: 'Ich wohne in einer großen Stadt.' },
      { es: 'на большой кухне', de: 'in der großen Küche', beispielEs: 'Мы готовим на большой кухне.', beispielDe: 'Wir kochen in der großen Küche.' },
      { es: 'в маленькой комнате', de: 'im kleinen Zimmer', beispielEs: 'Я сплю в маленькой комнате.', beispielDe: 'Ich schlafe im kleinen Zimmer.' },
      { es: 'в старом парке', de: 'im alten Park', beispielEs: 'Мы гуляем в старом парке.', beispielDe: 'Wir spazieren im alten Park.' },
      { es: 'в красивом месте', de: 'an einem schönen Ort', beispielEs: 'Кафе в красивом месте.', beispielDe: 'Das Café liegt an einem schönen Ort.' },
      { es: 'на новой работе', de: 'auf der neuen Arbeit', beispielEs: 'Он на новой работе.', beispielDe: 'Er ist auf der neuen Arbeit.' },
      { es: 'в хорошем кафе', de: 'in einem guten Café', beispielEs: 'Мы сидим в хорошем кафе.', beispielDe: 'Wir sitzen in einem guten Café.' },
      { es: 'в тихом месте', de: 'an einem ruhigen Ort', beispielEs: 'Дом в тихом месте.', beispielDe: 'Das Haus steht an einem ruhigen Ort.' },
      { es: 'в центре города', de: 'im Stadtzentrum', beispielEs: 'Я работаю в центре города.', beispielDe: 'Ich arbeite im Stadtzentrum.' },
    ],
    wissen: [
      { emoji: '🏢', titel: 'Zwei Endungen reichen', text: 'Männlich und sächlich: *-ом* (*в новом доме, в красивом месте*). Weiblich: *-ой* (*на большой кухне, в маленькой комнате*). Das Adjektiv folgt seinem Wort in den Fall.' },
      { emoji: '🧲', titel: 'Immer im Paar', text: 'Lern Adjektiv und Ort zusammen: *в новом доме* ist EIN Chunk. So musst du nie im Kopf deklinieren – der Klang ist schon richtig.' },
      { emoji: '🌆', titel: 'Deine Stadt beschreiben', text: '*Я живу в большом городе, в новом доме, в тихом месте.* – Drei Chunks, und du hast dein Zuhause beschrieben. Probier es gleich mit deiner Adresse.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Где ты живёшь?', de: 'Wo wohnst du?' },
      { sprecher: 'Tom', es: 'В новом доме, в центре города.', de: 'In einem neuen Haus, im Stadtzentrum.' },
      { sprecher: 'Anna', es: 'А я – в старом доме в тихом месте.', de: 'Und ich – in einem alten Haus an einem ruhigen Ort.' },
      { sprecher: 'Tom', es: 'Красиво! Встреча в хорошем кафе?', de: 'Schön! Treffen in einem guten Café?' },
    ],
  },

  {
    id: 'o-chom',
    niveau: 'A1.1',
    kursNr: 45,
    grammatik: ['о ком? о чём? – über etwas sprechen mit о/об'],
    wiederholt: ['adjektiv-praepositiv', 'verben-2'],
    vorher: ['adjektiv-praepositiv'],
    kulturnotiz: 'О чём ты думаешь? (Woran denkst du?) ist in Russland eine ganz normale Frage – auch unter Fremden im Zug.',
    titel: 'Worüber sprechen wir?',
    emoji: '💭',
    beschreibung: 'Themen nennen mit о + Präpositiv',
    ziele: ['о/об richtig wählen', 'Über Dinge und Menschen sprechen', 'Nach dem Thema fragen'],
    items: [
      { es: 'говорить о работе', de: 'über die Arbeit sprechen', beispielEs: 'Мы говорим о работе.', beispielDe: 'Wir sprechen über die Arbeit.' },
      { es: 'думать о тебе', de: 'an dich denken', beispielEs: 'Я думаю о тебе.', beispielDe: 'Ich denke an dich.' },
      { es: 'читать о Москве', de: 'über Moskau lesen', beispielEs: 'Я читаю о Москве.', beispielDe: 'Ich lese über Moskau.' },
      { es: 'о погоде', de: 'über das Wetter', beispielEs: 'Они говорят о погоде.', beispielDe: 'Sie sprechen über das Wetter.' },
      { es: 'о семье', de: 'über die Familie', beispielEs: 'Расскажи о семье!', beispielDe: 'Erzähl von deiner Familie!' },
      { es: 'о жизни', de: 'über das Leben', beispielEs: 'Фильм о жизни в Москве.', beispielDe: 'Ein Film über das Leben in Moskau.' },
      { es: 'о музыке', de: 'über die Musik', beispielEs: 'Книга о музыке.', beispielDe: 'Ein Buch über Musik.' },
      { es: 'об этом', de: 'darüber', beispielEs: 'Я знаю об этом.', beispielDe: 'Ich weiß darüber Bescheid.' },
      { es: 'о ком?', de: 'über wen?', beispielEs: 'О ком ты думаешь?', beispielDe: 'An wen denkst du?' },
      { es: 'о чём?', de: 'worüber?', beispielEs: 'О чём фильм?', beispielDe: 'Worüber geht der Film?' },
    ],
    wissen: [
      { emoji: '💭', titel: 'о + Präpositiv', text: '*о работе, о погоде, о семье* – nach *о* steht derselbe Fall wie nach *в/на*: die -е-Endung. Ein Fall, drei Präpositionen – das spart Lernarbeit.' },
      { emoji: '🔤', titel: 'о oder об?', text: 'Vor Vokalen wird *о* zu *об*: *об этом* (darüber), *об Анне*. Wie unser „a“ und „an“ im Englischen – rein für den Klang.' },
      { emoji: '❓', titel: 'Nach dem Thema fragen', text: '*О чём?* – worüber? *О ком?* – über wen? Damit fragst du nach jedem Film, Buch und Gespräch: *О чём фильм?*' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'О чём ты думаешь?', de: 'Woran denkst du?' },
      { sprecher: 'Tom', es: 'О работе… и о погоде.', de: 'An die Arbeit… und ans Wetter.' },
      { sprecher: 'Anna', es: 'А о ком?', de: 'Und an wen?' },
      { sprecher: 'Tom', es: 'О тебе! И об этом фильме о Москве.', de: 'An dich! Und an diesen Film über Moskau.' },
    ],
  },

  {
    id: 'wochentage',
    niveau: 'A1.1',
    kursNr: 46,
    grammatik: ['Wochentage, Monate und Datum'],
    wiederholt: ['o-chom', 'zahlen'],
    vorher: ['o-chom'],
    kulturnotiz: 'Die russische Woche beginnt am Montag – понедельник heißt wörtlich „der Tag nach dem Nichtstun“ (воскресенье = Sonntag).',
    titel: 'Montag bis Sonntag',
    emoji: '📅',
    diktat: true,
    beschreibung: 'Die Woche, die Monate und „heute, morgen, gestern“',
    ziele: ['Die sieben Wochentage', 'heute, morgen, gestern', 'Einen Termin nennen'],
    items: [
      { es: 'понедельник', de: 'der Montag', beispielEs: 'В понедельник я работаю.', beispielDe: 'Am Montag arbeite ich.' },
      { es: 'вторник', de: 'der Dienstag', beispielEs: 'Во вторник – урок.', beispielDe: 'Am Dienstag ist Unterricht.' },
      { es: 'среда', de: 'der Mittwoch', beispielEs: 'В среду мы в кафе.', beispielDe: 'Am Mittwoch sind wir im Café.' },
      { es: 'четверг', de: 'der Donnerstag', beispielEs: 'В четверг – концерт.', beispielDe: 'Am Donnerstag ist das Konzert.' },
      { es: 'пятница', de: 'der Freitag', beispielEs: 'Пятница – ура!', beispielDe: 'Freitag – hurra!' },
      { es: 'суббота', de: 'der Samstag', beispielEs: 'В субботу я отдыхаю.', beispielDe: 'Am Samstag erhole ich mich.' },
      { es: 'воскресенье', de: 'der Sonntag', beispielEs: 'В воскресенье мы гуляем.', beispielDe: 'Am Sonntag gehen wir spazieren.' },
      { es: 'сегодня', de: 'heute', beispielEs: 'Сегодня среда.', beispielDe: 'Heute ist Mittwoch.' },
      { es: 'завтра', de: 'morgen', beispielEs: 'Завтра четверг.', beispielDe: 'Morgen ist Donnerstag.' },
      { es: 'вчера', de: 'gestern', beispielEs: 'Вчера был вторник.', beispielDe: 'Gestern war Dienstag.' },
      { es: 'месяц', de: 'der Monat', beispielEs: 'Один месяц – и лето!', beispielDe: 'Ein Monat – und es ist Sommer!' },
      { es: 'год', de: 'das Jahr', beispielEs: 'Новый год!', beispielDe: 'Neujahr!' },
    ],
    wissen: [
      { emoji: '📅', titel: 'Die Woche zählt', text: '*вторник* (2. Tag), *четверг* (4. Tag), *пятница* (5. Tag) – in den Wochentagen stecken die Zahlen zwei, vier, fünf. Russische Wochentage sind Zahlenspiele.' },
      { emoji: '📆', titel: 'Am Montag = в + Tag', text: '*в понедельник, в среду, в субботу* – „am“ heißt *в* plus der Tag im Akkusativ (weibliche Tage bekommen -у: *в среду, в пятницу, в субботу*).' },
      { emoji: '🎄', titel: 'Новый год', text: 'Das wichtigste Fest Russlands ist Neujahr (*Новый год*) – mit Tannenbaum, Geschenken und Väterchen Frost. Weihnachten folgt erst am 7. Januar.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Какой сегодня день?', de: 'Welcher Tag ist heute?' },
      { sprecher: 'Tom', es: 'Сегодня среда. Завтра четверг.', de: 'Heute ist Mittwoch. Morgen ist Donnerstag.' },
      { sprecher: 'Anna', es: 'В четверг концерт, помнишь?', de: 'Am Donnerstag ist Konzert, weißt du noch?' },
      { sprecher: 'Tom', es: 'Да! А в субботу отдыхаем.', de: 'Ja! Und am Samstag erholen wir uns.' },
    ],
  },

  {
    id: 'tagesablauf',
    niveau: 'A1.1',
    kursNr: 47,
    grammatik: ['Der Tagesablauf in der Gegenwart'],
    wiederholt: ['wochentage', 'verben-1', 'verben-muster'],
    vorher: ['wochentage'],
    kulturnotiz: 'Das russische Frühstück (завтрак) ist oft warm: Grießbrei, Blini oder Rührei – Müsli ist eine neue Mode.',
    titel: 'Mein Tag',
    emoji: '⏰',
    beschreibung: 'Aufstehen, essen, arbeiten, schlafen – in der richtigen Reihenfolge',
    ziele: ['Den eigenen Tag erzählen', 'Die Tageszeiten утром, днём, вечером', 'Zehn Tagesablauf-Verben'],
    items: [
      { es: 'вставать', de: 'aufstehen', beispielEs: 'Я встаю в семь.', beispielDe: 'Ich stehe um sieben auf.' },
      { es: 'завтракать', de: 'frühstücken', beispielEs: 'Мы завтракаем дома.', beispielDe: 'Wir frühstücken zu Hause.' },
      { es: 'обедать', de: 'zu Mittag essen', beispielEs: 'Я обедаю на работе.', beispielDe: 'Ich esse auf der Arbeit zu Mittag.' },
      { es: 'ужинать', de: 'zu Abend essen', beispielEs: 'Вечером мы ужинаем.', beispielDe: 'Abends essen wir zu Abend.' },
      { es: 'готовить', de: 'kochen', beispielEs: 'Папа готовит ужин.', beispielDe: 'Papa kocht das Abendessen.' },
      { es: 'убирать', de: 'aufräumen', beispielEs: 'Я убираю комнату.', beispielDe: 'Ich räume das Zimmer auf.' },
      { es: 'покупать', de: 'kaufen', beispielEs: 'Мама покупает хлеб.', beispielDe: 'Mama kauft Brot.' },
      { es: 'ложиться спать', de: 'schlafen gehen', beispielEs: 'Я ложусь спать в одиннадцать.', beispielDe: 'Ich gehe um elf schlafen.' },
      { es: 'утром', de: 'morgens', beispielEs: 'Утром я пью кофе.', beispielDe: 'Morgens trinke ich Kaffee.' },
      { es: 'вечером', de: 'abends', beispielEs: 'Вечером мы смотрим фильм.', beispielDe: 'Abends schauen wir einen Film.' },
    ],
    wissen: [
      { emoji: '⏰', titel: 'Der Tag als Kette', text: '*Утром я встаю, завтракаю и иду на работу. Днём обедаю. Вечером готовлю, ужинаю и смотрю фильм.* – Mit den Verben aus Lektion 28–30 erzählst du deinen ganzen Tag.' },
      { emoji: '🌅', titel: 'утром, днём, вечером', text: 'Morgens, tagsüber, abends – drei Wörter, die jeden Satz zeitlich einordnen. Dazu *ночью* (nachts). Alle vier enden auf -ом/-ём: ein kleines Muster.' },
      { emoji: '🛏️', titel: 'ложиться спать', text: '„Ich gehe schlafen“ = *я ложусь спать* – wörtlich „ich lege mich schlafen“. Das *-сь* am Ende ist neu und kommt in der nächsten Lektion groß raus.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Во сколько ты встаёшь?', de: 'Um wie viel Uhr stehst du auf?' },
      { sprecher: 'Tom', es: 'В семь. Завтракаю и иду на работу.', de: 'Um sieben. Ich frühstücke und gehe zur Arbeit.' },
      { sprecher: 'Anna', es: 'А вечером?', de: 'Und abends?' },
      { sprecher: 'Tom', es: 'Готовлю ужин и ложусь спать в одиннадцать.', de: 'Ich koche Abendessen und gehe um elf schlafen.' },
    ],
  },

  {
    id: 'reflexiv',
    niveau: 'A1.1',
    kursNr: 48,
    grammatik: ['Reflexive Verben auf -ся/-сь'],
    wiederholt: ['tagesablauf', 'verben-2'],
    vorher: ['tagesablauf'],
    kulturnotiz: 'учиться (lernen, studieren) ist reflexiv, учить (lehren, auswendig lernen) nicht – ein Buchstabe, zwei Welten.',
    titel: 'Sich treffen, sich waschen',
    emoji: '🔁',
    hoerwort: true,
    beschreibung: 'Das kleine -ся am Verb',
    ziele: ['-ся/-сь richtig anhängen', 'учиться und заниматься benutzen', 'Wissen, dass -ся nicht immer „sich“ heißt'],
    items: [
      { es: 'учиться', de: 'studieren', beispielEs: 'Я учусь в университете.', beispielDe: 'Ich studiere an der Universität.' },
      { es: 'заниматься', de: 'sich beschäftigen', beispielEs: 'Я занимаюсь спортом.', beispielDe: 'Ich treibe Sport.' },
      { es: 'встречаться', de: 'sich treffen', beispielEs: 'Мы встречаемся в кафе.', beispielDe: 'Wir treffen uns im Café.' },
      { es: 'просыпаться', de: 'aufwachen', beispielEs: 'Я просыпаюсь в шесть.', beispielDe: 'Ich wache um sechs auf.' },
      { es: 'одеваться', de: 'sich anziehen', beispielEs: 'Он одевается быстро.', beispielDe: 'Er zieht sich schnell an.' },
      { es: 'умываться', de: 'sich waschen', beispielEs: 'Утром я умываюсь.', beispielDe: 'Morgens wasche ich mich.' },
      { es: 'улыбаться', de: 'lächeln', beispielEs: 'Она улыбается.', beispielDe: 'Sie lächelt.' },
      { es: 'смеяться', de: 'lachen', beispielEs: 'Дети смеются.', beispielDe: 'Die Kinder lachen.' },
      { es: 'бояться', de: 'Angst haben', beispielEs: 'Я не боюсь!', beispielDe: 'Ich habe keine Angst!' },
      { es: 'называться', de: 'heißen (Dinge)', beispielEs: 'Как это называется?', beispielDe: 'Wie heißt das?' },
    ],
    wissen: [
      { emoji: '🔁', titel: '-ся nach Konsonant, -сь nach Vokal', text: '*он одевается*, *она учится* – nach Konsonant *-ся*. *я учусь*, *мы встречаемся* – nach Vokal *-сь*. Beim Sprechen klingt beides wie „-ssa“ bzw. „-ss“.' },
      { emoji: '⚠️', titel: 'Nicht immer „sich“', text: '*улыбаться* = lächeln, *смеяться* = lachen, *бояться* = Angst haben – kein „sich“ im Deutschen. Das *-ся* ist oft einfach Teil des Verbs. Lern es mit.' },
      { emoji: '🎓', titel: 'учиться vs. учить', text: '*Я учусь в университете* (ich studiere), aber *Я учу русский* (ich lerne Russisch). Mit -ся: der Ort/Status. Ohne: das Fach. Eine feine, wichtige Grenze.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Где ты учишься?', de: 'Wo studierst du?' },
      { sprecher: 'Tom', es: 'В университете. И занимаюсь спортом.', de: 'An der Universität. Und ich treibe Sport.' },
      { sprecher: 'Anna', es: 'Когда мы встречаемся?', de: 'Wann treffen wir uns?' },
      { sprecher: 'Tom', es: 'В шесть. Не бойся, я не опаздываю!', de: 'Um sechs. Keine Angst, ich komme nicht zu spät!' },
    ],
  },

  {
    id: 'haeufigkeit',
    niveau: 'A1.1',
    kursNr: 49,
    grammatik: ['Häufigkeit und Reihenfolge: обычно, часто, сначала, потом'],
    wiederholt: ['reflexiv', 'tagesablauf'],
    vorher: ['reflexiv'],
    kulturnotiz: 'Обычно (normalerweise) hört man in Russland ständig – Russen lieben es, Gewohnheiten zu beschreiben.',
    titel: 'Immer, oft, manchmal',
    emoji: '🔂',
    beschreibung: 'Wie oft – und in welcher Reihenfolge',
    ziele: ['Häufigkeitswörter richtig platzieren', 'Reihenfolgen mit сначала/после этого', 'Zwei Routinen vergleichen'],
    items: [
      { es: 'обычно', de: 'normalerweise', beispielEs: 'Обычно я встаю в семь.', beispielDe: 'Normalerweise stehe ich um sieben auf.' },
      { es: 'часто', de: 'oft', beispielEs: 'Мы часто гуляем.', beispielDe: 'Wir gehen oft spazieren.' },
      { es: 'иногда', de: 'manchmal', beispielEs: 'Иногда я готовлю борщ.', beispielDe: 'Manchmal koche ich Borschtsch.' },
      { es: 'редко', de: 'selten', beispielEs: 'Я редко смотрю телевизор.', beispielDe: 'Ich schaue selten fern.' },
      { es: 'всегда', de: 'immer', beispielEs: 'Она всегда улыбается.', beispielDe: 'Sie lächelt immer.' },
      { es: 'сначала', de: 'zuerst', beispielEs: 'Сначала кофе, потом работа.', beispielDe: 'Zuerst Kaffee, dann Arbeit.' },
      { es: 'после этого', de: 'danach', beispielEs: 'После этого я гуляю.', beispielDe: 'Danach gehe ich spazieren.' },
      { es: 'каждый день', de: 'jeden Tag', beispielEs: 'Я учу русский каждый день.', beispielDe: 'Ich lerne jeden Tag Russisch.' },
      { es: 'раз в неделю', de: 'einmal pro Woche', beispielEs: 'Раз в неделю мы в театре.', beispielDe: 'Einmal pro Woche sind wir im Theater.' },
      { es: 'уже', de: 'schon', beispielEs: 'Я уже дома.', beispielDe: 'Ich bin schon zu Hause.' },
    ],
    wissen: [
      { emoji: '🔂', titel: 'Die Häufigkeits-Leiter', text: '*всегда* (immer) – *обычно* (meist) – *часто* (oft) – *иногда* (manchmal) – *редко* (selten) – *никогда* (nie). Sechs Stufen, mit denen du jede Gewohnheit einordnest.' },
      { emoji: '📍', titel: 'Wo steht das Wort?', text: 'Vor dem Verb: *Я часто гуляю*, *Она всегда улыбается*. Oder ganz vorn für Betonung: *Обычно я встаю в семь*. Beides klingt natürlich.' },
      { emoji: '🪜', titel: 'Reihenfolgen bauen', text: '*Сначала … потом … после этого …* – damit erzählst du Abläufe: *Сначала я встаю, потом завтракаю, после этого иду на работу.* Drei Wörter, fertige Geschichte.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Ты часто готовишь?', de: 'Kochst du oft?' },
      { sprecher: 'Tom', es: 'Иногда. Обычно ужинаю в кафе.', de: 'Manchmal. Normalerweise esse ich im Café zu Abend.' },
      { sprecher: 'Anna', es: 'А я каждый день готовлю!', de: 'Und ich koche jeden Tag!' },
      { sprecher: 'Tom', es: 'Молодец. Сначала суп, потом торт?', de: 'Gut gemacht. Zuerst Suppe, dann Torte?' },
    ],
  },

  {
    id: 'uhrzeit',
    niveau: 'A1.1',
    kursNr: 50,
    grammatik: ['Uhrzeit: который час? в семь часов'],
    wiederholt: ['haeufigkeit', 'zahlen', 'wochentage'],
    vorher: ['haeufigkeit'],
    kulturnotiz: 'Russland hat elf Zeitzonen – wenn in Moskau Mittag ist, gehen in Wladiwostok die Lichter an.',
    titel: 'Wie spät ist es?',
    emoji: '🕰️',
    diktat: true,
    beschreibung: 'Volle Stunden und einfache Zeitangaben',
    ziele: ['Nach der Uhrzeit fragen', 'Volle Stunden sagen', 'Termine mit в + Uhrzeit nennen'],
    items: [
      { es: 'час', de: 'die Stunde', beispielEs: 'Один час – и я дома.', beispielDe: 'Eine Stunde – und ich bin zu Hause.' },
      { es: 'который час?', de: 'wie spät ist es?', beispielEs: 'Извините, который час?', beispielDe: 'Entschuldigung, wie spät ist es?' },
      { es: 'в семь часов', de: 'um sieben Uhr', beispielEs: 'Я встаю в семь часов.', beispielDe: 'Ich stehe um sieben Uhr auf.' },
      { es: 'в девять часов', de: 'um neun Uhr', beispielEs: 'Урок в девять часов.', beispielDe: 'Der Unterricht ist um neun Uhr.' },
      { es: 'полчаса', de: 'eine halbe Stunde', beispielEs: 'Полчаса – и обед.', beispielDe: 'Eine halbe Stunde – und dann Mittagessen.' },
      { es: 'рано', de: 'früh', beispielEs: 'Сегодня я встаю рано.', beispielDe: 'Heute stehe ich früh auf.' },
      { es: 'поздно', de: 'spät', beispielEs: 'Уже поздно. Спокойной ночи!', beispielDe: 'Es ist schon spät. Gute Nacht!' },
      { es: 'вовремя', de: 'pünktlich', beispielEs: 'Том всегда вовремя.', beispielDe: 'Tom ist immer pünktlich.' },
      { es: 'полдень', de: 'der Mittag', beispielEs: 'В полдень мы обедаем.', beispielDe: 'Um zwölf Uhr mittags essen wir.' },
      { es: 'полночь', de: 'die Mitternacht', beispielEs: 'В полночь – Новый год!', beispielDe: 'Um Mitternacht ist Neujahr!' },
    ],
    wissen: [
      { emoji: '🕰️', titel: 'Die volle Stunde', text: '*час* (1 Uhr), *два часа*, *три часа*, *четыре часа* – und ab fünf: *пять часов, семь часов, десять часов*. Die Endung wechselt mit der Zahl – das kennst du aus Lektion 33.' },
      { emoji: '⏰', titel: 'Um … Uhr = в', text: '*в семь часов* (um sieben), *в девять часов* (um neun). Kurz und umgangssprachlich: *в семь*. Im Alltag lässt man часов oft weg.' },
      { emoji: '❓', titel: 'Die Frage', text: '*Который час?* ist die höfliche Frage nach der Uhrzeit. Genauso gut: *Сколько времени?* – „wie viel Zeit?“. Beides hörst du ständig.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Который час?', de: 'Wie spät ist es?' },
      { sprecher: 'Tom', es: 'Полдень. Ровно двенадцать.', de: 'Mittag. Genau zwölf.' },
      { sprecher: 'Anna', es: 'Встреча в семь часов, не забудь!', de: 'Das Treffen ist um sieben Uhr, vergiss es nicht!' },
      { sprecher: 'Tom', es: 'Я всегда вовремя. Не поздно!', de: 'Ich bin immer pünktlich. Nicht zu spät!' },
    ],
  },

  {
    id: 'lesen-moskau',
    niveau: 'A1.1',
    kursNr: 51,
    grammatik: ['Lesetraining: Ein Tag in Moskau'],
    wiederholt: ['uhrzeit', 'praepositiv', 'wohnung'],
    vorher: ['uhrzeit'],
    kulturnotiz: 'Die Moskauer Metro ist ein unterirdisches Museum – Stationen wie Komsomolskaja haben Kronleuchter und Mosaike.',
    titel: 'Ein Tag in Moskau',
    emoji: '🏛️',
    beschreibung: 'Dein erster längerer Lesetext – Schritt für Schritt',
    ziele: ['Einen Tagesablauf-Text lesen', 'Überschriften und Reihenfolge zuordnen', 'Unbekanntes aus dem Zusammenhang erschließen'],
    items: [
      { es: 'Москва', de: 'Moskau', beispielEs: 'Москва – столица России.', beispielDe: 'Moskau ist die Hauptstadt Russlands.' },
      { es: 'Кремль', de: 'der Kreml', beispielEs: 'Кремль в центре.', beispielDe: 'Der Kreml ist im Zentrum.' },
      { es: 'Красная площадь', de: 'der Rote Platz', beispielEs: 'Красная площадь – это сердце Москвы.', beispielDe: 'Der Rote Platz ist das Herz Moskaus.' },
      { es: 'прогулка', de: 'der Spaziergang', beispielEs: 'Прогулка по центру.', beispielDe: 'Ein Spaziergang durchs Zentrum.' },
      { es: 'экскурсия', de: 'die Führung', beispielEs: 'Экскурсия в Кремль в десять.', beispielDe: 'Die Kreml-Führung ist um zehn.' },
      { es: 'завтрак', de: 'das Frühstück', beispielEs: 'Завтрак в кафе.', beispielDe: 'Frühstück im Café.' },
      { es: 'столица', de: 'die Hauptstadt', beispielEs: 'Берлин – столица Германии.', beispielDe: 'Berlin ist die Hauptstadt Deutschlands.' },
      { es: 'мост', de: 'die Brücke', beispielEs: 'Мост через реку.', beispielDe: 'Eine Brücke über den Fluss.' },
      { es: 'туристы', de: 'die Touristen', beispielEs: 'Туристы на площади.', beispielDe: 'Die Touristen sind auf dem Platz.' },
      { es: 'фотография', de: 'die Fotografie', beispielEs: 'Фотография на мосту.', beispielDe: 'Ein Foto auf der Brücke.' },
    ],
    wissen: [
      { emoji: '🏛️', titel: 'Der Text, Teil 1', text: 'Утро. Анна в Москве. В восемь – *завтрак* в кафе. В девять – *прогулка* по центру. В десять – *экскурсия* в Кремль. Там много *туристов*.' },
      { emoji: '🏛️', titel: 'Der Text, Teil 2', text: 'Днём Анна на *Красной площади*. Потом – *мост* через реку и *фотография*. Вечером она ужинает в хорошем кафе. Поздно. Спокойной ночи, Москва!' },
      { emoji: '🧩', titel: 'So liest man lange Texte', text: 'Erst die Zeitwörter suchen (*утром, в восемь, потом, вечером*) – sie geben das Gerüst. Dann die Orte (*в кафе, в Кремль, на площади*). Der Rest ergibt sich. Du musst nicht jedes Wort kennen.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Сегодня я в Москве!', de: 'Heute bin ich in Moskau!' },
      { sprecher: 'Tom', es: 'Что сначала? Кремль?', de: 'Was zuerst? Der Kreml?' },
      { sprecher: 'Anna', es: 'Сначала завтрак, потом экскурсия.', de: 'Zuerst Frühstück, dann die Führung.' },
      { sprecher: 'Tom', es: 'А вечером – фотография на мосту!', de: 'Und abends – ein Foto auf der Brücke!' },
    ],
  },

  {
    id: 'hoeren-wann',
    niveau: 'A1.1',
    kursNr: 52,
    grammatik: ['Hörtraining: Wann macht sie was?'],
    wiederholt: ['lesen-moskau', 'uhrzeit', 'haeufigkeit'],
    vorher: ['lesen-moskau'],
    kulturnotiz: 'Выходные (das Wochenende) heißt wörtlich „die Ausgangstage“ – die Tage, an denen man rausgeht.',
    titel: 'Wann macht sie was?',
    emoji: '🎧',
    beschreibung: 'Zeitangaben heraushören – erst grob, dann genau',
    ziele: ['Uhrzeiten im Hören erkennen', 'Zeitangaben wie „nach der Arbeit“ verstehen', 'Einen Zeitplan nachvollziehen'],
    items: [
      { es: 'во сколько?', de: 'um wie viel Uhr?', beispielEs: 'Во сколько встреча?', beispielDe: 'Um wie viel Uhr ist das Treffen?' },
      { es: 'в восемь утра', de: 'um acht Uhr morgens', beispielEs: 'Я встаю в восемь утра.', beispielDe: 'Ich stehe um acht Uhr morgens auf.' },
      { es: 'в шесть вечера', de: 'um sechs Uhr abends', beispielEs: 'Ужин в шесть вечера.', beispielDe: 'Abendessen um sechs Uhr abends.' },
      { es: 'после работы', de: 'nach der Arbeit', beispielEs: 'После работы я гуляю.', beispielDe: 'Nach der Arbeit gehe ich spazieren.' },
      { es: 'до обеда', de: 'vor dem Mittagessen', beispielEs: 'До обеда – спорт.', beispielDe: 'Vor dem Mittagessen – Sport.' },
      { es: 'перед сном', de: 'vor dem Schlafengehen', beispielEs: 'Перед сном я читаю.', beispielDe: 'Vor dem Schlafengehen lese ich.' },
      { es: 'весь день', de: 'den ganzen Tag', beispielEs: 'Весь день я работаю.', beispielDe: 'Den ganzen Tag arbeite ich.' },
      { es: 'выходные', de: 'das Wochenende', beispielEs: 'В выходные мы отдыхаем.', beispielDe: 'Am Wochenende erholen wir uns.' },
      { es: 'будни', de: 'die Werktage', beispielEs: 'В будни я работаю.', beispielDe: 'An Werktagen arbeite ich.' },
      { es: 'расписание', de: 'der Zeitplan', beispielEs: 'Вот моё расписание.', beispielDe: 'Hier ist mein Zeitplan.' },
    ],
    wissen: [
      { emoji: '🎧', titel: 'Erst grob, dann fein', text: 'Beim ersten Hören nur: Wann? Morgens oder abends? Beim zweiten: Welche Uhrzeit genau? Beim dritten: Welche Tätigkeit? Drei Durchgänge – niemand versteht alles beim ersten Mal.' },
      { emoji: '🔑', titel: 'Die Signalwörter', text: '*во сколько, в восемь, после, до, перед, весь день* – wer diese Wörter hört, weiß, dass gleich eine Zeitangabe kommt. Spitz die Ohren genau dort.' },
      { emoji: '📋', titel: 'Werktag vs. Wochenende', text: '*в будни* (werktags) und *в выходные* (am Wochenende) – mit diesen zwei Chunks vergleichst du jeden Alltag: *В будни я работаю, в выходные отдыхаю.*' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Во сколько ты встаёшь в будни?', de: 'Um wie viel Uhr stehst du werktags auf?' },
      { sprecher: 'Tom', es: 'В восемь утра. А в выходные – поздно.', de: 'Um acht Uhr morgens. Und am Wochenende – spät.' },
      { sprecher: 'Anna', es: 'Что делаешь после работы?', de: 'Was machst du nach der Arbeit?' },
      { sprecher: 'Tom', es: 'Гуляю, ужинаю в шесть вечера, читаю перед сном.', de: 'Ich spaziere, esse um sechs zu Abend, lese vor dem Schlafen.' },
    ],
  },

  {
    id: 'cafe',
    niveau: 'A1.1',
    kursNr: 53,
    grammatik: ['Café-Sprache: bestellen mit Chunks'],
    wiederholt: ['hoeren-wann', 'wollen-koennen', 'hoeflichkeit'],
    vorher: ['hoeren-wann'],
    kulturnotiz: 'In Russland ruft man den Kellner nicht – man hebt die Hand oder sucht Blickkontakt. Ein Fingerschnipp gilt als unverschämt.',
    titel: 'Im Café bestellen',
    emoji: '☕',
    beschreibung: 'Speisekarte, Bestellung, Rechnung – alles mit festen Wendungen',
    ziele: ['Höflich bestellen', 'Nach der Rechnung fragen', 'Wünsche wie „ohne Zucker“ äußern'],
    items: [
      { es: 'меню', de: 'die Speisekarte', beispielEs: 'Меню, пожалуйста.', beispielDe: 'Die Speisekarte, bitte.' },
      { es: 'счёт', de: 'die Rechnung', beispielEs: 'Счёт, пожалуйста!', beispielDe: 'Die Rechnung, bitte!' },
      { es: 'официант', de: 'der Kellner', beispielEs: 'Официант идёт.', beispielDe: 'Der Kellner kommt.' },
      { es: 'можно кофе?', de: 'kann ich einen Kaffee haben?', beispielEs: 'Можно кофе с молоком?', beispielDe: 'Kann ich einen Kaffee mit Milch haben?' },
      { es: 'мне, пожалуйста…', de: 'für mich bitte …', beispielEs: 'Мне, пожалуйста, борщ.', beispielDe: 'Für mich bitte Borschtsch.' },
      { es: 'я хочу чай', de: 'ich möchte Tee', beispielEs: 'Я хочу чай с лимоном.', beispielDe: 'Ich möchte Tee mit Zitrone.' },
      { es: 'вкусно', de: 'es schmeckt (lecker)', beispielEs: 'Очень вкусно!', beispielDe: 'Sehr lecker!' },
      { es: 'ещё одну', de: 'noch eine', beispielEs: 'Ещё одну чашку, пожалуйста.', beispielDe: 'Noch eine Tasse, bitte.' },
      { es: 'без сахара', de: 'ohne Zucker', beispielEs: 'Чай без сахара.', beispielDe: 'Tee ohne Zucker.' },
      { es: 'с молоком', de: 'mit Milch', beispielEs: 'Кофе с молоком, пожалуйста.', beispielDe: 'Kaffee mit Milch, bitte.' },
    ],
    wissen: [
      { emoji: '☕', titel: 'Die drei Bestell-Formeln', text: '*Можно кофе?* (Kann ich…?), *Мне, пожалуйста, борщ* (Für mich bitte…), *Я хочу чай* (Ich möchte…). Eine davon reicht – alle drei sind höflich und normal.' },
      { emoji: '🧾', titel: 'Счёт, пожалуйста', text: 'Die Rechnung heißt *счёт* – mit dem ё, das du kennst. *Счёт, пожалуйста!* ist der wichtigste Satz am Ende jedes Essens. Trinkgeld: rund 10 %, liegt auf dem Tisch.' },
      { emoji: '🥛', titel: 'Mit und ohne', text: '*с молоком* (mit Milch), *с лимоном* (mit Zitrone), *без сахара* (ohne Zucker). Das *с* und *без* verändern die Endung leicht – nimm die Chunks einfach als Ganzes.' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Меню, пожалуйста. Что тут вкусно?', de: 'Die Speisekarte, bitte. Was ist hier lecker?' },
      { sprecher: 'Tom', es: 'Борщ! Мне, пожалуйста, борщ и чай.', de: 'Borschtsch! Für mich bitte Borschtsch und Tee.' },
      { sprecher: 'Anna', es: 'А мне кофе с молоком, без сахара.', de: 'Und für mich Kaffee mit Milch, ohne Zucker.' },
      { sprecher: 'Tom', es: 'Очень вкусно! Счёт, пожалуйста!', de: 'Sehr lecker! Die Rechnung, bitte!' },
    ],
  },

  {
    id: 'abschluss-alltag',
    niveau: 'A1.1',
    kursNr: 54,
    grammatik: ['Modulabschluss: mein typischer Tag'],
    wiederholt: ['cafe', 'reflexiv', 'akkusativ', 'est'],
    vorher: ['cafe'],
    kulturnotiz: 'Уют – die russische Gemütlichkeit – hat kein deutsches Wort, das ganz passt. Am nächsten kommt „Hygge“.',
    titel: 'Mein typischer Tag',
    emoji: '🏁',
    hoerwort: true,
    beschreibung: 'Wohnung, Tag, Uhrzeit und Café – alles in einem',
    ziele: ['Deinen Tag komplett erzählen', 'Die Wohnung beschreiben', 'Im Café sicher bestellen'],
    items: [
      { es: 'день рождения', de: 'der Geburtstag', beispielEs: 'Сегодня мой день рождения!', beispielDe: 'Heute ist mein Geburtstag!' },
      { es: 'планы', de: 'die Pläne', beispielEs: 'Какие планы на выходные?', beispielDe: 'Was sind die Pläne fürs Wochenende?' },
      { es: 'привычка', de: 'die Gewohnheit', beispielEs: 'Кофе утром – моя привычка.', beispielDe: 'Kaffee am Morgen ist meine Gewohnheit.' },
      { es: 'свободное время', de: 'die Freizeit', beispielEs: 'В свободное время я читаю.', beispielDe: 'In meiner Freizeit lese ich.' },
      { es: 'отпуск', de: 'der Urlaub', beispielEs: 'Отпуск на море!', beispielDe: 'Urlaub am Meer!' },
      { es: 'покупки', de: 'die Einkäufe', beispielEs: 'Покупки в субботу.', beispielDe: 'Die Einkäufe sind am Samstag.' },
      { es: 'дела', de: 'die Angelegenheiten', beispielEs: 'У меня много дел.', beispielDe: 'Ich habe viel zu tun.' },
      { es: 'порядок', de: 'die Ordnung', beispielEs: 'В комнате порядок.', beispielDe: 'Im Zimmer herrscht Ordnung.' },
      { es: 'режим дня', de: 'der Tagesrhythmus', beispielEs: 'Мой режим дня: рано вставать.', beispielDe: 'Mein Tagesrhythmus: früh aufstehen.' },
      { es: 'уют', de: 'die Gemütlichkeit', beispielEs: 'Дома – уют.', beispielDe: 'Zu Hause ist es gemütlich.' },
    ],
    wissen: [
      { emoji: '🏁', titel: 'Was du jetzt kannst', text: 'Du beschreibst deine Wohnung (*в новом доме, есть балкон*), deinen Tag (*встаю в семь, завтракаю, иду на работу*), die Uhrzeit (*в шесть вечера*) und bestellst im Café (*мне, пожалуйста*). Das ist echter Alltag auf Russisch.' },
      { emoji: '🗺️', titel: 'Drei Fälle im Gepäck', text: 'Nominativ, Akkusativ (*книгу*), Präpositiv (*в школе*) – drei der sechs Fälle benutzt du schon. Modul 4 bringt die anderen drei: Genitiv, Dativ, Instrumental.' },
      { emoji: '🚀', titel: 'Und jetzt?', text: 'Modul 4 heißt „Menschen, Beziehungen und die sechs Fälle“: Familie, Freunde, *у меня есть* (ich habe) und die Fälle als System. Дава́й!' },
    ],
    dialog: [
      { sprecher: 'Anna', es: 'Какие планы на выходные?', de: 'Was sind deine Pläne fürs Wochenende?' },
      { sprecher: 'Tom', es: 'Покупки, прогулка – и уют дома.', de: 'Einkäufe, ein Spaziergang – und Gemütlichkeit zu Hause.' },
      { sprecher: 'Anna', es: 'А в воскресенье – мой день рождения!', de: 'Und am Sonntag ist mein Geburtstag!' },
      { sprecher: 'Tom', es: 'Правда? Тогда торт и кафе в семь!', de: 'Wirklich? Dann Torte und Café um sieben!' },
    ],
  },

]

// Die zehn Module des 180er-Kursplans – Details in docs/KURSPLAN.md.
// "geplant" zeigt in der App, was ein noch leeres Modul bringen wird.
export const MODULE = [
  {
    id: 'm1',
    von: 1,
    bis: 18,
    titel: 'Kyrillisch lesen',
    emoji: '🔤',
    beschreibung: 'Alle 33 Buchstaben lesen und richtig aussprechen',
    farbe: '#8b5cf6',
  },
  {
    id: 'm2',
    von: 19,
    bis: 36,
    titel: 'Erste Gespräche',
    emoji: '💬',
    beschreibung: 'Begrüßen, dich vorstellen und einfache Fragen stellen',
    farbe: '#d4930d',
  },
  {
    id: 'm3',
    von: 37,
    bis: 54,
    titel: 'Alltag & Wohnung',
    emoji: '🏠',
    beschreibung: 'Tagesablauf, Wohnung, Uhrzeit und erste Café-Sprache',
    farbe: '#2a9d8f',
    geplant: ['Akkusativ & Objekte', 'Wo? – der Präpositiv', 'Wohnung & Möbel', 'Uhrzeit & Tagesablauf', 'Im Café bestellen'],
  },
  {
    id: 'm4',
    von: 55,
    bis: 72,
    titel: 'Menschen & Fälle',
    emoji: '👨‍👩‍👧',
    beschreibung: 'Familie, Beziehungen und die sechs Fälle',
    farbe: '#c96f4a',
    geplant: ['Familie', 'Besitz: у меня есть', 'Genitiv, Dativ, Instrumental', 'Die Fälle als Funktionskarte'],
  },
  {
    id: 'm5',
    von: 73,
    bis: 90,
    titel: 'Einkaufen & Vergangenheit',
    emoji: '🛒',
    beschreibung: 'Mengen, Gesundheit und zum ersten Mal erzählen, was war',
    farbe: '#e76f51',
    geplant: ['Zahlen bis 1000 & Preise', 'Kleidung & Größen', 'Beim Arzt', 'Die Vergangenheit'],
  },
  {
    id: 'm6',
    von: 91,
    bis: 108,
    titel: 'Stadt & Bewegung',
    emoji: '🚇',
    beschreibung: 'Wege, Reisen und die berühmten Bewegungsverben',
    farbe: '#457b9d',
    geplant: ['Wegbeschreibung', 'идти oder ходить', 'Metro & Bahnhof', 'Unterkunft buchen', 'Was ist ein Aspekt?'],
  },
  {
    id: 'm7',
    von: 109,
    bis: 126,
    titel: 'Aspekt & Zukunft',
    emoji: '🔮',
    beschreibung: 'Aspektpaare, Zukunftspläne, Bitten und Bedingungen',
    farbe: '#b5179e',
    geplant: ['Aspektpaare', 'Die zwei Zukünfte', 'Der Imperativ', 'Konditional mit бы'],
  },
  {
    id: 'm8',
    von: 127,
    bis: 144,
    titel: 'Erzählen & Meinungen',
    emoji: '🗣️',
    beschreibung: 'Nebensätze, Partikeln und die eigene Meinung vertreten',
    farbe: '#7c3aed',
    geplant: ['Relativsätze mit который', 'Ursache & Gegensatz', 'Indirekte Rede', 'Meinung äußern'],
  },
  {
    id: 'm9',
    von: 145,
    bis: 162,
    titel: 'Arbeit & Medien',
    emoji: '💼',
    beschreibung: 'Beruflich kommunizieren und echte Medien verstehen',
    farbe: '#3a6b8a',
    geplant: ['Bewerbung & Lebenslauf', 'Formelle E-Mails', 'Meetings', 'Partizipien', 'Nachrichten verstehen'],
  },
  {
    id: 'm10',
    von: 163,
    bis: 180,
    titel: 'Natürliches Russisch',
    emoji: '🚀',
    beschreibung: 'Nuancen, Tempo und die Brücke zu B2',
    farbe: '#6d28d9',
    geplant: ['Aspekt-Feinheiten', 'Gesprochene Partikeln', 'Natürliches Hörtempo', 'Langes Lesen & Hören', 'Finales Projekt'],
  },
]

export function kommtBald(modul) {
  return lektionenVon(modul).length === 0
}

/**
 * Alle Lektionen in KURSREIHENFOLGE.
 *
 * LEKTIONEN selbst steht in der Reihenfolge, in der geschrieben
 * wurde – an Position 0 liegt Kurs-Nr. 5, Kurs-Nr. 1 liegt an
 * Position 26. Wer "die naechste offene Lektion" sucht, muss diese
 * Liste nehmen; ein find() ueber LEKTIONEN liefert die falsche.
 */
export const KURSFOLGE = [...LEKTIONEN].sort((a, b) => a.kursNr - b.kursNr)

/** Die naechste Lektion, die noch nicht geschafft ist. */
export function naechsteLektion(lessonProgress = {}) {
  return KURSFOLGE.find((l) => !lessonProgress?.[l.id]?.fertig) ?? null
}

export function lektionenVon(modul) {
  return LEKTIONEN
    .filter((l) => l.kursNr >= modul.von && l.kursNr <= modul.bis)
    .sort((a, b) => a.kursNr - b.kursNr)
}

export function modulFortschritt(modul, lessonProgress) {
  const liste = lektionenVon(modul)
  const fertig = liste.filter((l) => lessonProgress[l.id]?.fertig).length
  return { fertig, gesamt: liste.length }
}

// Ein Modul ist offen, wenn das vorherige komplett geschafft ist
// Auf true setzen, um beim Entwickeln alle Module und Lektionen
// sofort öffnen zu können (ohne sie der Reihe nach abzuschließen).
export const ALLES_OFFEN = true

export function modulOffen(index, lessonProgress) {
  if (kommtBald(MODULE[index])) return false
  if (ALLES_OFFEN) return true
  if (index === 0) return true
  const vorher = MODULE[index - 1]
  if (kommtBald(vorher)) return false
  const { fertig, gesamt } = modulFortschritt(vorher, lessonProgress)
  return gesamt > 0 && fertig === gesamt
}

// Mischt eine Liste zufällig durch (Fisher-Yates-Verfahren)
export function mischen(liste) {
  const copy = [...liste]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Das "Kernwort" eines Eintrags: ohne Satzzeichen wie ¿? ¡! und …
export function kernwort(es) {
  return es.replace(/[¿¡?!….]/g, '').trim()
}

// Baut aus einem Beispielsatz eine Lücken-Übung: das gelernte Wort
// wird im Satz durch ___ ersetzt. Klappt das nicht, gibt es keine Lücke.
/** Platzhalter fuer die Luecke im Satz – wird als Linie gezeichnet. */
export const LUECKE_MARKE = '\u0000LUECKE\u0000'

export function baueLuecke(item) {
  const kern = kernwort(item.es)
  const regex = new RegExp(kern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
  const treffer = item.beispielEs.match(regex)
  if (!treffer) return null
  // Marke statt Unterstrichen: Die Luecke wird als saubere Linie
  // gezeichnet, nicht als fuenf einzelne Striche.
  return { satz: item.beispielEs.replace(regex, LUECKE_MARKE), loesung: treffer[0] }
}

/**
 * Sammelt Wörter aus den Lektionen, die diese hier wiederholt.
 * Höchstens drei, gemischt – mehr würde die Lektion überladen.
 */
export function sammleWiederholung(lektion) {
  const quellen = (lektion.wiederholt ?? [])
    .map((id) => LEKTIONEN.find((l) => l.id === id))
    .filter(Boolean)
  if (quellen.length === 0) return []

  // Aus jeder Quelle EIN Wort, damit die Wiederholung breit streut
  const gezogen = quellen.map((q) => mischen(q.items)[0]).filter(Boolean)
  return mischen(gezogen).slice(0, 3)
}

// Baut den geführten Ablauf einer Lektion:
// Einleitung → Wörter → Gut zu wissen → Dialog → Auswahl-Übungen → Lücken-Übungen
/**
 * Wie lange dauert diese Lektion ungefaehr?
 *
 * Eine Schaetzung, keine Messung – aber eine, die sich aus dem
 * Inhalt ergibt und nicht geraten ist: Jedes Wort wird einmal
 * vorgestellt und zweimal abgefragt, jede Wissenskarte gelesen,
 * der Dialog einmal gehoert. Die Zahlen sind Erfahrungswerte in
 * Sekunden, wie schon in tagesplan.js.
 *
 * Zurueck kommt eine Spanne, kein Punkt: "8-10 Min." ist ehrlicher
 * als "9 Min.", weil niemand gleich schnell liest.
 */
export function dauerMinuten(lektion) {
  const sekunden =
    (lektion.items?.length ?? 0) * 20 +
    (lektion.wissen?.length ?? 0) * 25 +
    (lektion.dialog?.length ?? 0) * 8 +
    90 // Einstieg, Wortpaare, Abschluss
  const mitte = Math.round(sekunden / 60)
  return { von: Math.max(3, mitte - 1), bis: mitte + 1 }
}

export function baueSchritte(lektion) {
  const schritte = [{ typ: 'intro' }]
  for (const item of lektion.items) schritte.push({ typ: 'lernen', item })
  // Ein Schritt JE Karte, nicht ein Schritt fuer alle drei.
  // Vorher standen drei Erklaerungen gestapelt auf einem Bildschirm –
  // zusammen rund 600 Zeichen, die man am Stueck lesen sollte. Einzeln
  // sind es 200, und man kommt nach jeder einmal zum Luftholen.
  if (lektion.wissen) {
    lektion.wissen.forEach((_, i) => schritte.push({ typ: 'info', karte: i }))
  }

  // Hörverstehen VOR dem Dialog: eine Zeile nur hören, Bedeutung
  // wählen. Wer den Dialog schon gelesen hat, hört nicht mehr
  // wirklich hin – deshalb kommt dieser Schritt zuerst.
  if (lektion.dialog?.length >= 4) {
    const kandidaten = lektion.dialog.filter((z) => z.es.length > 12)
    if (kandidaten.length) {
      const zeile = mischen(kandidaten)[0]
      schritte.push({ typ: 'hoeren', zeile, dialog: lektion.dialog })
    }
  }

  if (lektion.dialog) schritte.push({ typ: 'dialog' })
  mischen(lektion.items).forEach((item, i) =>
    schritte.push({ typ: 'quiz', item, richtung: i % 2 === 0 ? 'es-de' : 'de-es' })
  )
  for (const item of mischen(lektion.items).slice(0, 3)) {
    const luecke = baueLuecke(item)
    if (luecke) schritte.push({ typ: 'luecke', item, luecke })
  }

  // Hörwort: das gesprochene Wort der richtigen SCHREIBUNG zuordnen.
  // DIE Kernübung der Kyrillisch-Lektionen – Laute unterscheiden,
  // ohne dass die Schrift schon sitzen muss. (Flag: hoerwort: true)
  if (lektion.hoerwort) {
    for (const item of mischen(lektion.items).slice(0, 3)) {
      schritte.push({ typ: 'hoerwort', item })
    }
  }

  // Diktat: ein gehörtes Wort aus Buchstaben-Kacheln zusammensetzen.
  // (Flag: diktat: true – ab Lektion 14, wenn alle Buchstaben sitzen)
  if (lektion.diktat) {
    for (const item of mischen(lektion.items).slice(0, 2)) {
      const wort = item.es.toLowerCase().replace(/[^а-яё]/g, '')
      if (wort.length >= 3 && wort.length <= 10) {
        schritte.push({ typ: 'diktat', item, wort })
      }
    }
  }

  // Satzbau: zwei Beispielsätze aus Bausteinen zusammensetzen
  for (const item of mischen(lektion.items).slice(0, 6)) {
    const satzbau = baueSatzbau(item)
    if (satzbau) {
      schritte.push({ typ: 'satzbau', item, satzbau })
      if (schritte.filter((s) => s.typ === 'satzbau').length >= 2) break
    }
  }

  // Wortpaare: fuenf Woerter der Lektion verbinden – lockert die
  // Quiz-Strecke auf und wiederholt nebenbei den halben Wortschatz
  if (lektion.items.length >= 5) {
    schritte.push({
      typ: 'paare',
      paare: mischen(lektion.items).slice(0, 5).map((i) => ({ es: i.es, de: i.de })),
    })
  }

  // Wiederholung aus frueheren Lektionen. DAS macht aus 150
  // Einzelstuecken einen Kurs: Jede Lektion greift drei bis fuenf
  // aeltere Woerter auf, statt nur Neues aufzutuermen.
  const rueckblick = sammleWiederholung(lektion)
  for (const item of rueckblick) {
    schritte.push({ typ: 'rueckblick', item, richtung: 'es-de' })
  }

  // Abschlussfragen: ganze Saetze aus dem Dialog verstehen, nicht
  // nur einzelne Woerter – das ist die eigentliche Vertiefung
  if (lektion.dialog?.length >= 4) {
    const zeilen = mischen(lektion.dialog.filter((z) => z.es.length > 12)).slice(0, 3)
    for (const zeile of zeilen) {
      schritte.push({ typ: 'dialogquiz', zeile, dialog: lektion.dialog })
    }
  }
  return schritte
}

/**
 * Baut eine Satzbau-Übung aus einem Beispielsatz: Die Wörter werden
 * gemischt, der Lernende tippt sie in die richtige Reihenfolge.
 * Nur Sätze mit 4 bis 8 Wörtern taugen dafür – kürzere sind trivial,
 * längere werden zum Geduldsspiel.
 */
export function baueSatzbau(item) {
  const satz = (item.beispielEs || '').trim()
  const woerter = satz.split(/\s+/)
  if (woerter.length < 4 || woerter.length > 8) return null
  // Erst mischen, wenn wirklich eine andere Reihenfolge entsteht
  let gemischt = woerter
  for (let i = 0; i < 8 && gemischt.join(' ') === satz; i++) {
    gemischt = mischen(woerter)
  }
  if (gemischt.join(' ') === satz) return null
  return { woerter: gemischt, loesung: satz, uebersetzung: item.beispielDe }
}

// Baut die vier Antwort-Möglichkeiten für eine Übung (richtige + drei falsche)
export function baueOptionen(schritt, lektion) {
  if (schritt.typ === 'rueckblick') {
    // Falsche Antworten aus der AKTUELLEN Lektion – so muss man
    // Altes und Neues auseinanderhalten
    const falsche = mischen(
      lektion.items.map((i) => i.de).filter((d) => d !== schritt.item.de)
    ).slice(0, 3)
    return mischen([schritt.item.de, ...falsche])
  }
  if (schritt.typ === 'hoerwort') {
    // Die falschen Antworten sind ANDERE Wörter der Lektion in
    // kyrillischer Schrift – man muss wirklich hinhören
    const falsche = mischen(
      lektion.items.map((i) => i.es).filter((w) => w !== schritt.item.es)
    ).slice(0, 3)
    return mischen([schritt.item.es, ...falsche])
  }
  if (schritt.typ === 'hoeren' || schritt.typ === 'dialogquiz') {
    // Die falschen Antworten sind die deutschen Saetze der ANDEREN
    // Dialogzeilen – nah genug am Thema, um zum Nachdenken zu zwingen
    const falsche = mischen(
      schritt.dialog.filter((z) => z !== schritt.zeile).map((z) => z.de)
    ).slice(0, 3)
    return mischen([schritt.zeile.de, ...falsche])
  }
  if (schritt.typ === 'luecke') {
    const falsche = mischen(
      lektion.items.filter((i) => i !== schritt.item).map((i) => kernwort(i.es))
    ).slice(0, 3)
    return mischen([schritt.luecke.loesung, ...falsche])
  }
  const feld = schritt.richtung === 'es-de' ? 'de' : 'es'
  const richtig = schritt.item[feld]
  const falsche = mischen(
    lektion.items.filter((i) => i !== schritt.item).map((i) => i[feld])
  ).slice(0, 3)
  return mischen([richtig, ...falsche])
}
