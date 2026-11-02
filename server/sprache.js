/**
 * In welcher Sprache antwortet der Server gerade?
 *
 * Die App hängt bei englischer Oberfläche ?sprache=en an jede Anfrage
 * (siehe src/sprache.js). Ohne den Parameter bleibt alles deutsch.
 *
 * Über AsyncLocalStorage statt als Argument: Die Sprache müsste sonst
 * durch jede Funktion zwischen Endpunkt und Modellaufruf gereicht werden,
 * und eine einzige vergessene Stelle lieferte still deutsche Antworten.
 */
import { AsyncLocalStorage } from 'node:async_hooks'

const speicher = new AsyncLocalStorage()

export function spracheAusAnfrage(req, res, next) {
  const sprache = req.query.sprache === 'en' ? 'en' : 'de'
  if (sprache === 'en') {
    const original = res.json.bind(res)
    res.json = (daten) => {
      if (daten && typeof daten.error === 'string' && FEHLER_EN[daten.error]) {
        return original({ ...daten, error: FEHLER_EN[daten.error] })
      }
      return original(daten)
    }
  }
  speicher.run(sprache, next)
}

export function zielsprache() {
  return speicher.getStore() ?? 'de'
}

// Die Anweisungen an das Modell sind auf Deutsch geschrieben und nennen
// überall "deutsche Übersetzung". Statt jede doppelt zu pflegen, geht
// bei Englisch ein Vorrang-Hinweis voraus. Die Feldnamen (de, titel_de …)
// bleiben: Sie sind Schlüssel im Code und tragen dann eben Englisch.
const VORRANG =
  'LANGUAGE OVERRIDE, this takes priority over everything below: the learner speaks English and no ' +
  'German. Everything the instructions and the JSON schema describe as German ("Deutsch", "deutsche ' +
  'Übersetzung", "auf Deutsch", fields such as de, titel_de, untertitel_de, label_de, uebersetzung, ' +
  'hinweis, merksatz) must be written in natural English instead. Keep all field names unchanged. ' +
  'Russian stays Russian. Give nouns without an article and ignore any instruction to add a German ' +
  'article. Input from the learner may be in English. Choose what is useful for English speakers.'

/** Wie fetch, setzt bei Englisch aber den Vorrang-Hinweis vor die Nachrichten. */
export function frageOpenAI(url, optionen) {
  if (zielsprache() !== 'en') return fetch(url, optionen)
  const koerper = JSON.parse(optionen.body)
  koerper.messages = [{ role: 'system', content: VORRANG }, ...koerper.messages]
  return fetch(url, { ...optionen, body: JSON.stringify(koerper) })
}

/**
 * Fehlermeldungen, die die App dem Nutzer zeigt. Was hier fehlt, kommt
 * auf Deutsch an: technische Meldungen, die nur im Fehlerfall des
 * Betriebs auftauchen (fehlender Schlüssel und dergleichen).
 */
const FEHLER_EN = {
  'Bitte gib ein Thema an.': 'Please enter a topic.',
  'Bitte zuerst anmelden.': 'Please sign in first.',
  'Das sieht nicht wie ein YouTube-Link aus.': "That doesn't look like a YouTube link.",
  'Der Tutor antwortet gerade nicht. Bitte spaeter erneut.': "The tutor isn't responding right now. Please try again later.",
  'Für dieses Video gibt es leider keine russischen Untertitel.': "Sorry, this video doesn't have Russian subtitles.",
  'Für dieses Video gibt es keine russischen Untertitel.': "This video doesn't have Russian subtitles.",
  'Kein Buchtitel angegeben.': 'No book title given.',
  'Kein Suchbegriff.': 'No search term.',
  'Kein Text übergeben.': 'No text provided.',
  'Kein Wort angegeben.': 'No word given.',
  'Keine Zeilen übergeben.': 'No lines provided.',
  'Kontingent konnte nicht geprüft werden.': 'Could not check your daily limit.',
  'Nicht angemeldet.': 'Not signed in.',
  'Nicht berechtigt.': 'Not allowed.',
  'Ohne Anmeldung geht das nicht.': 'Please sign in to do that.',
  'Sammle erst ein paar Wörter, dann kann ich dir passende Vorschläge machen.': 'Collect a few words first, then I can make suggestions that fit.',
  'Suche fehlgeschlagen.': 'Search failed.',
  'Gerade zu viele Übersetzungen. Bitte versuch es später noch einmal.': 'Too many translations right now. Please try again later.',
  'Wähle ein Thema oder eine Form – dann lege ich los.': 'Pick a topic or a form and I will get started.',
  'Zusammenfassung konnte nicht erstellt werden.': 'The summary could not be created.',
  'Für dieses Konto gibt es kein Abo.': 'There is no subscription on this account.',
  'Das Transkript-Guthaben ist aufgebraucht.': 'Subtitles are temporarily unavailable.',
  'OpenAI-Kontingent erschöpft. Bitte später erneut versuchen.': 'The AI is temporarily unavailable. Please try again later.',
}
