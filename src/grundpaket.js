// Das Grundpaket: Jedes Konto (und jeder Gast) bekommt es einmal,
// damit der Trainer am ersten Tag nicht leer ist. 100 wichtige Wörter,
// 5 Sätze und ein Text auf Russisch mit Übersetzung, der erklärt, wie
// man Davaigo benutzt. Von Hand geschrieben, nicht von der KI erzeugt.
// Eingeräumt in App.jsx (Suche nach "Grundpaket").
//
// Jede Übersetzung gibt es zweimal: deutsch ("uebersetzung", "de",
// "titel_de") und englisch ("en", "titel_en"). Welche in den Trainer
// kommt, entscheidet die App-Sprache – siehe geschenkSprache.js.

export const GRUNDPAKET_VERSION = 1

export const GRUNDPAKET_WOERTER = [
  {
    "wort": "я",
    "uebersetzung": "ich",
    "en": "I"
  },
  {
    "wort": "ты",
    "uebersetzung": "du",
    "en": "you (informal)"
  },
  {
    "wort": "он",
    "uebersetzung": "er",
    "en": "he"
  },
  {
    "wort": "она",
    "uebersetzung": "sie",
    "en": "she"
  },
  {
    "wort": "мы",
    "uebersetzung": "wir",
    "en": "we"
  },
  {
    "wort": "вы",
    "uebersetzung": "ihr, Sie (höflich)",
    "en": "you (plural or formal)"
  },
  {
    "wort": "они",
    "uebersetzung": "sie (Mehrzahl)",
    "en": "they"
  },
  {
    "wort": "делать",
    "uebersetzung": "machen",
    "en": "to do, to make"
  },
  {
    "wort": "идти",
    "uebersetzung": "gehen",
    "en": "to go (on foot)"
  },
  {
    "wort": "ехать",
    "uebersetzung": "fahren",
    "en": "to go (by transport)"
  },
  {
    "wort": "мочь",
    "uebersetzung": "können",
    "en": "can, to be able to"
  },
  {
    "wort": "хотеть",
    "uebersetzung": "wollen",
    "en": "to want"
  },
  {
    "wort": "говорить",
    "uebersetzung": "sprechen, sagen",
    "en": "to speak, to say"
  },
  {
    "wort": "знать",
    "uebersetzung": "wissen, kennen",
    "en": "to know"
  },
  {
    "wort": "видеть",
    "uebersetzung": "sehen",
    "en": "to see"
  },
  {
    "wort": "жить",
    "uebersetzung": "wohnen, leben",
    "en": "to live"
  },
  {
    "wort": "любить",
    "uebersetzung": "lieben, mögen",
    "en": "to love, to like"
  },
  {
    "wort": "работать",
    "uebersetzung": "arbeiten",
    "en": "to work"
  },
  {
    "wort": "понимать",
    "uebersetzung": "verstehen",
    "en": "to understand"
  },
  {
    "wort": "учить",
    "uebersetzung": "lernen",
    "en": "to learn"
  },
  {
    "wort": "читать",
    "uebersetzung": "lesen",
    "en": "to read"
  },
  {
    "wort": "писать",
    "uebersetzung": "schreiben",
    "en": "to write"
  },
  {
    "wort": "есть",
    "uebersetzung": "essen",
    "en": "to eat"
  },
  {
    "wort": "пить",
    "uebersetzung": "trinken",
    "en": "to drink"
  },
  {
    "wort": "что",
    "uebersetzung": "was",
    "en": "what"
  },
  {
    "wort": "кто",
    "uebersetzung": "wer",
    "en": "who"
  },
  {
    "wort": "где",
    "uebersetzung": "wo",
    "en": "where"
  },
  {
    "wort": "когда",
    "uebersetzung": "wann",
    "en": "when"
  },
  {
    "wort": "как",
    "uebersetzung": "wie",
    "en": "how"
  },
  {
    "wort": "почему",
    "uebersetzung": "warum",
    "en": "why"
  },
  {
    "wort": "сколько",
    "uebersetzung": "wie viel",
    "en": "how much, how many"
  },
  {
    "wort": "да",
    "uebersetzung": "ja",
    "en": "yes"
  },
  {
    "wort": "нет",
    "uebersetzung": "nein",
    "en": "no"
  },
  {
    "wort": "не",
    "uebersetzung": "nicht",
    "en": "not"
  },
  {
    "wort": "привет",
    "uebersetzung": "hallo",
    "en": "hi"
  },
  {
    "wort": "здравствуйте",
    "uebersetzung": "guten Tag",
    "en": "hello (formal)"
  },
  {
    "wort": "пока",
    "uebersetzung": "tschüss",
    "en": "bye"
  },
  {
    "wort": "до свидания",
    "uebersetzung": "auf Wiedersehen",
    "en": "goodbye"
  },
  {
    "wort": "спасибо",
    "uebersetzung": "danke",
    "en": "thank you"
  },
  {
    "wort": "пожалуйста",
    "uebersetzung": "bitte",
    "en": "please"
  },
  {
    "wort": "извините",
    "uebersetzung": "Entschuldigung",
    "en": "sorry, excuse me"
  },
  {
    "wort": "хорошо",
    "uebersetzung": "gut",
    "en": "good, well"
  },
  {
    "wort": "плохо",
    "uebersetzung": "schlecht",
    "en": "bad, badly"
  },
  {
    "wort": "очень",
    "uebersetzung": "sehr",
    "en": "very"
  },
  {
    "wort": "тоже",
    "uebersetzung": "auch",
    "en": "also, too"
  },
  {
    "wort": "но",
    "uebersetzung": "aber",
    "en": "but"
  },
  {
    "wort": "и",
    "uebersetzung": "und",
    "en": "and"
  },
  {
    "wort": "или",
    "uebersetzung": "oder",
    "en": "or"
  },
  {
    "wort": "с",
    "uebersetzung": "mit",
    "en": "with"
  },
  {
    "wort": "без",
    "uebersetzung": "ohne",
    "en": "without"
  },
  {
    "wort": "для",
    "uebersetzung": "für",
    "en": "for"
  },
  {
    "wort": "здесь",
    "uebersetzung": "hier",
    "en": "here"
  },
  {
    "wort": "там",
    "uebersetzung": "dort",
    "en": "there"
  },
  {
    "wort": "сейчас",
    "uebersetzung": "jetzt",
    "en": "now"
  },
  {
    "wort": "сегодня",
    "uebersetzung": "heute",
    "en": "today"
  },
  {
    "wort": "завтра",
    "uebersetzung": "morgen",
    "en": "tomorrow"
  },
  {
    "wort": "вчера",
    "uebersetzung": "gestern",
    "en": "yesterday"
  },
  {
    "wort": "всегда",
    "uebersetzung": "immer",
    "en": "always"
  },
  {
    "wort": "никогда",
    "uebersetzung": "nie",
    "en": "never"
  },
  {
    "wort": "много",
    "uebersetzung": "viel",
    "en": "a lot, much"
  },
  {
    "wort": "всё",
    "uebersetzung": "alles",
    "en": "everything"
  },
  {
    "wort": "ничего",
    "uebersetzung": "nichts",
    "en": "nothing"
  },
  {
    "wort": "это",
    "uebersetzung": "das (ist)",
    "en": "this (is)"
  },
  {
    "wort": "уже",
    "uebersetzung": "schon",
    "en": "already"
  },
  {
    "wort": "ещё",
    "uebersetzung": "noch",
    "en": "still, more"
  },
  {
    "wort": "можно",
    "uebersetzung": "darf man, man kann",
    "en": "one may, it's possible"
  },
  {
    "wort": "нужно",
    "uebersetzung": "man muss, nötig",
    "en": "one must, necessary"
  },
  {
    "wort": "дом",
    "uebersetzung": "das Haus",
    "en": "house"
  },
  {
    "wort": "вода",
    "uebersetzung": "das Wasser",
    "en": "water"
  },
  {
    "wort": "еда",
    "uebersetzung": "das Essen",
    "en": "food"
  },
  {
    "wort": "день",
    "uebersetzung": "der Tag",
    "en": "day"
  },
  {
    "wort": "ночь",
    "uebersetzung": "die Nacht",
    "en": "night"
  },
  {
    "wort": "время",
    "uebersetzung": "die Zeit",
    "en": "time"
  },
  {
    "wort": "год",
    "uebersetzung": "das Jahr",
    "en": "year"
  },
  {
    "wort": "неделя",
    "uebersetzung": "die Woche",
    "en": "week"
  },
  {
    "wort": "час",
    "uebersetzung": "die Stunde",
    "en": "hour"
  },
  {
    "wort": "работа",
    "uebersetzung": "die Arbeit",
    "en": "work, job"
  },
  {
    "wort": "друг",
    "uebersetzung": "der Freund",
    "en": "friend (male)"
  },
  {
    "wort": "подруга",
    "uebersetzung": "die Freundin",
    "en": "friend (female)"
  },
  {
    "wort": "семья",
    "uebersetzung": "die Familie",
    "en": "family"
  },
  {
    "wort": "город",
    "uebersetzung": "die Stadt",
    "en": "city"
  },
  {
    "wort": "страна",
    "uebersetzung": "das Land",
    "en": "country"
  },
  {
    "wort": "улица",
    "uebersetzung": "die Straße",
    "en": "street"
  },
  {
    "wort": "деньги",
    "uebersetzung": "das Geld",
    "en": "money"
  },
  {
    "wort": "имя",
    "uebersetzung": "der Vorname",
    "en": "first name"
  },
  {
    "wort": "человек",
    "uebersetzung": "der Mensch",
    "en": "person"
  },
  {
    "wort": "мужчина",
    "uebersetzung": "der Mann",
    "en": "man"
  },
  {
    "wort": "женщина",
    "uebersetzung": "die Frau",
    "en": "woman"
  },
  {
    "wort": "ребёнок",
    "uebersetzung": "das Kind",
    "en": "child"
  },
  {
    "wort": "мама",
    "uebersetzung": "die Mama",
    "en": "mum"
  },
  {
    "wort": "папа",
    "uebersetzung": "der Papa",
    "en": "dad"
  },
  {
    "wort": "кофе",
    "uebersetzung": "der Kaffee",
    "en": "coffee"
  },
  {
    "wort": "чай",
    "uebersetzung": "der Tee",
    "en": "tea"
  },
  {
    "wort": "хлеб",
    "uebersetzung": "das Brot",
    "en": "bread"
  },
  {
    "wort": "магазин",
    "uebersetzung": "das Geschäft",
    "en": "shop"
  },
  {
    "wort": "слово",
    "uebersetzung": "das Wort",
    "en": "word"
  },
  {
    "wort": "большой",
    "uebersetzung": "groß",
    "en": "big"
  },
  {
    "wort": "маленький",
    "uebersetzung": "klein",
    "en": "small"
  },
  {
    "wort": "хороший",
    "uebersetzung": "gut",
    "en": "good"
  },
  {
    "wort": "новый",
    "uebersetzung": "neu",
    "en": "new"
  }
]

export const GRUNDPAKET_SAETZE = [
  {
    "satz": "Как тебя зовут?",
    "uebersetzung": "Wie heißt du?",
    "en": "What's your name?",
    "schluessel": "зовут"
  },
  {
    "satz": "Меня зовут Анна, я из Германии.",
    "uebersetzung": "Ich heiße Anna, ich komme aus Deutschland.",
    "en": "My name is Anna, I'm from Germany.",
    "schluessel": "из"
  },
  {
    "satz": "Где туалет?",
    "uebersetzung": "Wo ist die Toilette?",
    "en": "Where is the toilet?",
    "schluessel": "где"
  },
  {
    "satz": "Можно кофе, пожалуйста?",
    "uebersetzung": "Einen Kaffee, bitte?",
    "en": "Could I have a coffee, please?",
    "schluessel": "можно"
  },
  {
    "satz": "Я не понимаю, повторите, пожалуйста.",
    "uebersetzung": "Ich verstehe nicht, wiederholen Sie bitte.",
    "en": "I don't understand, please repeat that.",
    "schluessel": "понимаю"
  },
  {
    "satz": "Сколько это стоит?",
    "uebersetzung": "Wie viel kostet das?",
    "en": "How much does this cost?",
    "schluessel": "сколько"
  },
  {
    "satz": "Я учу русский язык.",
    "uebersetzung": "Ich lerne Russisch.",
    "en": "I'm learning Russian.",
    "schluessel": "учу"
  },
  {
    "satz": "Спасибо, всё хорошо.",
    "uebersetzung": "Danke, alles gut.",
    "en": "Thanks, all good.",
    "schluessel": "хорошо"
  },
  {
    "satz": "Говорите медленнее, пожалуйста.",
    "uebersetzung": "Sprechen Sie bitte langsamer.",
    "en": "Please speak more slowly.",
    "schluessel": "медленнее"
  },
  {
    "satz": "До завтра!",
    "uebersetzung": "Bis morgen!",
    "en": "See you tomorrow!",
    "schluessel": "завтра"
  }
]

export const GRUNDPAKET_TEXT = {
  "titel_es": "Как учить русский с Davaigo",
  "titel_de": "So lernst du mit Davaigo",
  "titel_en": "How to learn with Davaigo",
  "stufe": "a1",
  "absaetze": [
    {
      "es": "Привет! Добро пожаловать в Davaigo. Здесь ты учишь русский понемногу каждый день.",
      "de": "Hallo! Willkommen bei Davaigo. Hier lernst du jeden Tag ein bisschen Russisch.",
      "en": "Hi! Welcome to Davaigo. Here you learn a little Russian every day."
    },
    {
      "es": "Начни с уроков. Они короткие и идут шаг за шагом.",
      "de": "Fang mit den Lektionen an. Sie sind kurz und gehen Schritt für Schritt.",
      "en": "Start with the lessons. They are short and go step by step."
    },
    {
      "es": "Потом смотри видео на YouTube. Нажми на слово, и оно будет в тренажёре.",
      "de": "Dann schau Videos auf YouTube. Tippe auf ein Wort, und es landet im Trainer.",
      "en": "Then watch videos on YouTube. Tap a word and it lands in the trainer."
    },
    {
      "es": "Тренажёр показывает слова снова, когда ты их почти забыл.",
      "de": "Der Trainer zeigt dir die Wörter wieder, wenn du sie fast vergessen hast.",
      "en": "The trainer shows you the words again when you've almost forgotten them."
    },
    {
      "es": "Хочешь говорить? Катя говорит с тобой по-русски.",
      "de": "Willst du sprechen? Katja spricht mit dir auf Russisch.",
      "en": "Want to speak? Katja talks with you in Russian."
    },
    {
      "es": "Учись немного каждый день, и твоя серия растёт. Давай!",
      "de": "Lerne jeden Tag ein bisschen, und deine Serie wächst. Dawai!",
      "en": "Learn a little every day and your streak grows. Davai!"
    }
  ],
  "woerter": [
    {
      "wort": "добро пожаловать",
      "uebersetzung": "willkommen",
      "en": "welcome"
    },
    {
      "wort": "понемногу",
      "uebersetzung": "nach und nach, ein bisschen",
      "en": "little by little, a bit"
    },
    {
      "wort": "шаг за шагом",
      "uebersetzung": "Schritt für Schritt",
      "en": "step by step"
    },
    {
      "wort": "тренажёр",
      "uebersetzung": "der Trainer",
      "en": "trainer"
    },
    {
      "wort": "забыть",
      "uebersetzung": "vergessen",
      "en": "to forget"
    },
    {
      "wort": "серия",
      "uebersetzung": "die Serie",
      "en": "streak"
    }
  ]
}

// Startgeschenk (10.11.2026): nur die ERSTEN 50 – die Liste ist nach Wichtigkeit sortiert.
export const STARTGESCHENK_WOERTER = GRUNDPAKET_WOERTER.slice(0, 50)
