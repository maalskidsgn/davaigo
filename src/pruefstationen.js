// Die Prüfstationen: der Abschluss eines Moduls.
//
// Warum keine 8. Lektion pro Modul?
//
// Erstens: Wiederholung gibt es schon. Jede Lektion zieht über
// sammleWiederholung() drei Wörter aus früheren Lektionen. Was
// fehlte, war nicht mehr Wiederholung, sondern ein Moment des
// Abschlusses.
//
// Zweitens: Eine handgeschriebene Zusammenfassung veraltet. Ändert
// jemand Lektion 31, müsste er daran denken, die Zusammenfassung von
// Modul 2 nachzuziehen. Das vergisst man. Deshalb werden die
// Aufgaben aus den Lektionen des Moduls GEZOGEN – sie können gar
// nicht auseinanderlaufen.
//
// Von Hand geschrieben ist nur das, was sich nicht ziehen lässt:
// der rote Faden. Drei Karten pro Modul, die sagen, worum es die
// ganze Zeit ging.
//
// Und: KEIN neuer Wortschatz. Ausgerechnet an der Stelle, an der
// gefestigt werden soll, wären zwölf neue Vokabeln verkehrt.

import { LEKTIONEN, MODULE, lektionenVon, mischen, baueLuecke, baueSatzbau, kernwort } from './lektionen.js'

/**
 * Die sieben Stationen.
 *
 * rueckblick sind drei Karten im Format der wissen-Karten einer
 * Lektion – der Lektions-Ablauf zeigt sie mit demselben Schritt an.
 */
export const PRUEFSTATIONEN = [
  {
    id: 'station-m1',
    modul: 'm1',
    titel: 'Prüfstation: Kyrillisch lesen',
    emoji: '🚩',
    rueckblick: [
      {
        emoji: '🔤',
        titel: 'Du liest Kyrillisch',
        text: 'Alle 33 Buchstaben liegen hinter dir: die alten Bekannten (*А К М О Т Е*), die falschen Freunde (*В Н Р С У Х*) und die Zisch-Familie um *Ж*, *Ш* und *Щ*. Aus einem fremden Code sind Wörter geworden – *метро*, *борщ*, *яблоко* liest du jetzt einfach so.',
      },
      {
        emoji: '🎯',
        titel: 'Die Betonung sitzt',
        text: 'Jedes Wort hat genau eine betonte Silbe, und nur dort klingt ein *о* wie o – überall sonst wird es zum a. *молоко* = „malakó“, *хорошо* = „charaschó“, *спасибо* = „spassíba“. Wer das einmal hört, liest russische Wörter nie wieder falsch vor.',
      },
      {
        emoji: '🗝️',
        titel: 'Deine ersten Alltagswörter',
        text: 'Nebenbei hast du echten Wortschatz gesammelt: *да*, *нет*, *вот*, *где*, dazu Essen und Trinken wie *чай*, *сок* und *суп*. Damit bist du bereit für Modul 2 – deine ersten richtigen Gespräche auf Russisch.',
      },
    ],
  },
  {
    id: 'station-m2',
    modul: 'm2',
    titel: 'Prüfstation: Erste Gespräche',
    emoji: '🚩',
    rueckblick: [
      {
        emoji: '💬',
        titel: 'Dein erstes echtes Gespräch',
        text: 'Begrüßen (*привет*, *здравствуйте*), dich vorstellen (*меня зовут…*), sagen, woher du kommst (*я из Германии*), deinen Beruf nennen und bis zehn zählen – damit hältst du dein erstes Kennenlernen komplett auf Russisch durch. Genau das prüfen wir jetzt.',
      },
      {
        emoji: '🪄',
        titel: 'Sätze ohne „ist“ und ohne Artikel',
        text: 'Der russische Satz ist kürzer als der deutsche: *Я студент* – ich (bin) Student. *Это дом* – das (ist ein) Haus. Kein „ist“, kein der/die/das. Dazu die Verben in zwei Gruppen: *я работаю* und *я говорю* – mehr Muster braucht die Gegenwart nicht.',
      },
      {
        emoji: '🧰',
        titel: 'Die kleinen Wörter tragen dich',
        text: '*спасибо*, *пожалуйста*, *извините*, *можно?*, dazu *правда?*, *понятно* und *медленнее, пожалуйста* – diese Helfer halten jedes Gespräch am Laufen, auch wenn du erst wenig verstehst. Sie sind dein Werkzeugkasten für alles, was ab Modul 3 kommt.',
      },
    ],
  },
  {
    id: 'station-m3',
    modul: 'm3',
    titel: 'Prüfstation: Alltag & Wohnung',
    emoji: '🚩',
    rueckblick: [
      {
        emoji: '📦',
        titel: 'Deine ersten zwei Fälle',
        text: 'Der Akkusativ zeigt, WEN oder WAS: *книга* wird zu *книгу*, wenn du sie liest. Der Präpositiv zeigt, WO: *школа* wird zu *в школе*. Zwei Endungen, mit denen du sagst, was du tust und wo du bist – das Fundament, auf dem Modul 4 die restlichen Fälle aufbaut.',
      },
      {
        emoji: '🏠',
        titel: 'Wohnung und Tagesablauf',
        text: 'Du beschreibst deine Wohnung (*в квартире есть балкон*), erzählst deinen Tag von *утром* bis *вечером* und ordnest ihn mit *сначала*, *потом*, *обычно*. Dazu die Uhrzeit: *в семь часов*. Damit erzählst du dein halbes Leben auf Russisch.',
      },
      {
        emoji: '☕',
        titel: 'Und du überlebst im Café',
        text: '*Меню, пожалуйста* – *Мне, пожалуйста, борщ* – *Очень вкусно!* – *Счёт, пожалуйста!* Vier Sätze, und du kommst durch jedes russische Café. Genau solche fertigen Wendungen bringen dich im echten Gespräch weiter als jede Tabelle.',
      },
    ],
  },
]

/** Die Station eines Moduls – oder null. */
export function stationVon(modul) {
  return PRUEFSTATIONEN.find((s) => s.modul === modul.id) ?? null
}

/** Das Modul einer Station. */
export function modulVon(station) {
  return MODULE.find((m) => m.id === station.modul) ?? null
}

/**
 * Ist die Station offen?
 *
 * Erst, wenn alle Lektionen des Moduls abgeschlossen sind. Eine
 * Prüfstation vor der Prüfung wäre keine.
 */
export function stationOffen(station, lessonProgress = {}) {
  const modul = modulVon(station)
  if (!modul) return false
  const lektionen = lektionenVon(modul)
  return lektionen.length > 0 && lektionen.every((l) => lessonProgress?.[l.id]?.fertig)
}

/** Wie viele Lektionen des Moduls fehlen noch bis zur Station? */
export function nochOffen(station, lessonProgress = {}) {
  const modul = modulVon(station)
  if (!modul) return 0
  return lektionenVon(modul).filter((l) => !lessonProgress?.[l.id]?.fertig).length
}

/**
 * Alle Wörter eines Moduls – doppelte entfernt.
 *
 * Das Entfernen ist keine Kosmetik, sondern nötig: baueOptionen()
 * zieht die falschen Antworten aus items. Käme "der Freund" in zwei
 * Lektionen des Moduls vor, stünde dieselbe Übersetzung zweimal
 * unter den vier Antworten – und die Aufgabe wäre nicht mehr
 * eindeutig lösbar.
 *
 * Verglichen wird über kernwort() – dieselbe Funktion, mit der
 * baueOptionen() die falschen Antworten baut. Ein reiner
 * Zeichenvergleich reichte nicht: "menudo susto" und
 * "¡menudo susto!" sind zwei verschiedene Zeichenketten, aber
 * dieselbe Antwort, sobald die Satzzeichen weg sind. Genau das ist
 * einmal durchgerutscht.
 */
export function woerterVon(station) {
  const modul = modulVon(station)
  if (!modul) return []
  const gesehenDe = new Set()
  const gesehenEs = new Set()
  const raus = []
  for (const lektion of lektionenVon(modul)) {
    for (const item of lektion.items) {
      const de = kernwort(item.de).toLowerCase()
      const es = kernwort(item.es).toLowerCase()
      if (gesehenDe.has(de) || gesehenEs.has(es)) continue
      gesehenDe.add(de)
      gesehenEs.add(es)
      raus.push(item)
    }
  }
  return raus
}

/**
 * Die Station als Lektions-Objekt.
 *
 * Damit läuft sie durch denselben Ablauf wie jede Lektion: dieselben
 * Quiz-Knöpfe, derselbe Satzbau, derselbe Abschlussbildschirm mit der
 * 80-Prozent-Marke. Eine zweite Oberfläche wäre eine zweite Stelle
 * zum Kaputtgehen.
 */
export function stationAlsLektion(station) {
  return {
    id: station.id,
    titel: station.titel,
    emoji: station.emoji,
    // Module tragen kein Niveau – das der letzten Lektion passt:
    // Die Station prüft alles bis dorthin.
    niveau: lektionenVon(modulVon(station) ?? {}).slice(-1)[0]?.niveau ?? '',
    beschreibung: 'Alles aus dem Modul – ohne neue Wörter',
    items: woerterVon(station),
    wissen: station.rueckblick,
    dialog: null,
    // Der Intro-Schritt zeigt diese Liste unter "Das lernst du …".
    // Ohne sie stuende dort eine leere Aufzaehlung – und eine
    // Station "lernt" ja auch nichts Neues, sie prueft.
    ziele: [
      'Zeigen, was aus dem Modul wirklich sitzt',
      'Rund 25 Aufgaben – keine neuen Wörter',
      'Ab 80 % gilt das Modul als bestanden',
    ],
    istStation: true,
  }
}

/** Wie viele Aufgaben eine Station hat. Ungefähr eine Doppellektion. */
export const STATION_AUFGABEN = 25

/**
 * Die Schritte einer Station.
 *
 * Bewusst OHNE die Schritte "lernen" und "dialog": Hier wird nichts
 * mehr vorgestellt, hier wird nur noch abgefragt. Der einzige
 * Lesetext ist der Rückblick am Anfang.
 */
export function baueSchritteStation(station) {
  const lektion = stationAlsLektion(station)
  const modul = modulVon(station)
  // Der Rueckblick blaettert genauso wie die Wissenskarten einer
  // Lektion: eine Karte je Schritt.
  const schritte = [
    { typ: 'intro' },
    ...station.rueckblick.map((_, i) => ({ typ: 'info', karte: i })),
  ]

  const woerter = mischen(lektion.items)

  // Die Hälfte der Aufgaben sind Vokabelfragen, abwechselnd in
  // beide Richtungen – Erkennen und Abrufen sind zwei Fähigkeiten.
  const quizAnzahl = Math.min(14, woerter.length)
  woerter.slice(0, quizAnzahl).forEach((item, i) => {
    schritte.push({ typ: 'quiz', item, richtung: i % 2 === 0 ? 'es-de' : 'de-es' })
  })

  // Lücken: das Wort im eigenen Beispielsatz wiederfinden
  let luecken = 0
  for (const item of woerter.slice(quizAnzahl)) {
    if (luecken >= 5) break
    const luecke = baueLuecke(item)
    if (luecke) {
      schritte.push({ typ: 'luecke', item, luecke })
      luecken++
    }
  }

  // Satzbau: zwei Sätze aus Bausteinen zusammensetzen
  let saetze = 0
  for (const item of mischen(lektion.items)) {
    if (saetze >= 2) break
    const satzbau = baueSatzbau(item)
    if (satzbau) {
      schritte.push({ typ: 'satzbau', item, satzbau })
      saetze++
    }
  }

  // Ein Paare-Spiel als Verschnaufpause in der Mitte
  if (lektion.items.length >= 5) {
    schritte.push({
      typ: 'paare',
      paare: mischen(lektion.items).slice(0, 5).map((i) => ({ es: i.es, de: i.de })),
    })
  }

  // Und zum Schluss ganze Sätze: Dialogzeilen aus verschiedenen
  // Lektionen des Moduls. Das ist der eigentliche Test – einzelne
  // Wörter kann man raten, einen Satz nicht.
  const dialoge = lektionenVon(modul)
    .filter((l) => l.dialog?.length >= 4)
    .map((l) => l.dialog)
  for (const dialog of mischen(dialoge).slice(0, 4)) {
    const kandidaten = dialog.filter((z) => z.es.length > 12)
    if (kandidaten.length >= 4) {
      schritte.push({ typ: 'dialogquiz', zeile: mischen(kandidaten)[0], dialog })
    }
  }

  return schritte
}

/** Wurde die Station schon geschafft? */
export function stationGeschafft(station, lessonProgress = {}) {
  return Boolean(lessonProgress?.[station.id]?.fertig)
}

/** Für die Anzeige: gehört diese id zu einer Station? */
export function istStationsId(id) {
  return PRUEFSTATIONEN.some((s) => s.id === id)
}

/** Alle Lektions-Ids, damit der Prüfer Kollisionen erkennt. */
export const LEKTIONS_IDS = new Set(LEKTIONEN.map((l) => l.id))
