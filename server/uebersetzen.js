// Übersetzen zwischen Russisch und Deutsch.
//
// Warum nicht mehr Google: Bis zum 23.08. hingen alle drei
// Übersetzungswege an
//
//   https://translate.googleapis.com/translate_a/single?client=gtx…
//
// Das ist der Endpunkt, den Googles eigenes Übersetzungs-Widget
// benutzt – undokumentiert, ohne Schlüssel, ohne Zusage. Genau
// deshalb war er bequem, und genau deshalb ist er ausgefallen:
// Google antwortet inzwischen mit HTTP 429 und einer "Sorry"-Seite.
// Damit lagen gleichzeitig das Antippen einzelner Wörter im Video,
// die Übersetzung ganzer Untertitel, das Antippen in Ebooks und
// Lesetexten UND die Suche nach russischen Videos still.
//
// Ein Server-Rechenzentrum bekommt so eine Sperre schneller als ein
// Heimanschluss – auf davaigo.de wäre es also eher schlimmer als hier.
// Wiederholen hilft nicht: Es ist keine Überlastung, es ist eine
// Sperre.
//
// Jetzt übersetzt gpt-4o-mini. Kein neues Konto, kein neuer
// Schlüssel, keine neue Rechnung – dasselbe Modell, das ohnehin
// Wortlisten und Übungen schreibt. Für Untertitel ist es sogar
// besser: Es sieht alle Zeilen zusammen und trifft dadurch den
// Bezug, den eine Zeile-für-Zeile-Übersetzung verfehlt.
//
// Für Russisch kommt ein zweiter Vorteil dazu: Ein Wort im Text
// steht fast nie in der Grundform. Wer im Video "книгу" antippt,
// will "das Buch" lesen und nicht "Buch (Akkusativ Singular)".
// Ein Sprachmodell erkennt den Fall und nennt die Grundform –
// eine Wörterbuchabfrage findet dagegen oft gar nichts.
//
// Falls später doch ein spezialisierter Dienst dazukommen soll
// (DeepL hat 500.000 Zeichen im Monat frei): Die beiden Funktionen
// unten sind die einzige Stelle, die man dafür anfassen muss.

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const MODELL = 'gpt-4o-mini'

/**
 * Ein kleiner Zwischenspeicher für einzelne Wörter.
 *
 * Beim Lesen tippt man dasselbe Wort immer wieder an – "работа"
 * kommt in einem Video zwanzigmal vor. Ohne den Speicher wäre das
 * zwanzig Anfragen und zwanzigmal eine Sekunde Wartezeit.
 *
 * Bewusst nur im Arbeitsspeicher und bewusst begrenzt: Bei einem
 * Neustart ist er weg, und das ist in Ordnung. Eine Datenbank dafür
 * wäre mehr Aufwand als Nutzen.
 */
const GEMERKT = new Map()
const MERKGRENZE = 5000

function ausSpeicher(schluessel) {
  return GEMERKT.get(schluessel)
}

function merke(schluessel, wert) {
  // Wenn voll: den ältesten Eintrag raus. Map behält die
  // Einfügereihenfolge, der erste Schlüssel ist also der älteste.
  if (GEMERKT.size >= MERKGRENZE) GEMERKT.delete(GEMERKT.keys().next().value)
  GEMERKT.set(schluessel, wert)
}

async function frageModell(nachrichten, schema) {
  const schluessel = process.env.OPENAI_API_KEY
  if (!schluessel) throw new Error('Kein OpenAI-Schlüssel hinterlegt.')

  const antwort = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${schluessel}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODELL,
      temperature: 0, // Übersetzen ist kein Ort für Einfälle
      messages: nachrichten,
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'uebersetzung', schema, strict: true },
      },
    }),
  })

  if (!antwort.ok) {
    if (antwort.status === 429) throw new Error('OpenAI-Kontingent erschöpft. Bitte später erneut versuchen.')
    throw new Error(`OpenAI antwortet mit ${antwort.status}`)
  }
  const daten = await antwort.json()
  return JSON.parse(daten.choices[0].message.content)
}

const WORT_SCHEMA = {
  type: 'object',
  properties: {
    uebersetzung: {
      type: 'string',
      description: 'Die Übersetzung, ohne Anführungszeichen und ohne Erklärung',
    },
  },
  required: ['uebersetzung'],
  additionalProperties: false,
}

/**
 * Ein einzelnes Wort oder eine kurze Wendung übersetzen.
 *
 * @param {string} text
 * @param {'ru-de'|'de-ru'} richtung
 */
export async function uebersetzeWort(text, richtung = 'ru-de') {
  const sauber = text.trim()
  if (!sauber) return ''

  const schluessel = richtung + '|' + sauber.toLowerCase()
  const gemerkt = ausSpeicher(schluessel)
  if (gemerkt !== undefined) return gemerkt

  const nachRussisch = richtung === 'de-ru'

  // Der Zusatz zur Grundform gilt nur für Russisch→Deutsch. In die
  // andere Richtung steht deutscher Text ohnehin schon so da, wie er
  // gemeint ist.
  const grundform = nachRussisch
    ? ''
    : 'Steht das Wort in einer gebeugten Form (Fall, Zahl, Person, Zeit), ' +
      'übersetze die Grundform – wer "книгу" antippt, möchte "das Buch" ' +
      'lesen. Bei einem Substantiv nenne den deutschen Artikel mit. '

  const [von, nach] = nachRussisch ? ['Deutschen', 'Russische'] : ['Russischen', 'Deutsche']

  const { uebersetzung } = await frageModell(
    [
      {
        role: 'system',
        content:
          `Du übersetzt aus dem ${von} ins ${nach}. Antworte NUR mit der ` +
          `Übersetzung – keine Erklärung, keine Anführungszeichen, keine ` +
          `Alternativen, keine Umschrift. ${grundform}` +
          `Ist die Eingabe bereits ${nachRussisch ? 'russisch' : 'deutsch'}, ` +
          `gib sie unverändert zurück.`,
      },
      { role: 'user', content: sauber },
    ],
    WORT_SCHEMA
  )

  const ergebnis = (uebersetzung ?? '').trim()
  if (ergebnis) merke(schluessel, ergebnis)
  return ergebnis
}

const ZEILEN_SCHEMA = {
  type: 'object',
  properties: {
    zeilen: {
      type: 'array',
      description: 'Die Übersetzungen, GENAU so viele wie Zeilen hereinkamen',
      items: { type: 'string' },
    },
  },
  required: ['zeilen'],
  additionalProperties: false,
}

/**
 * Ganze Untertitel übersetzen – Zeile für Zeile, aber im Zusammenhang.
 *
 * Das ist der Vorteil gegenüber vorher: Das Modell sieht das ganze
 * Paket und weiß bei "Не хочешь?", worauf sich das bezieht. Die alte
 * Lösung schickte 25 Zeilen mit \n verbunden hin und hoffte, dass
 * genauso viele zurückkommen – kam eine Zeile mehr oder weniger,
 * fiel sie auf Zeile-für-Zeile zurück und brauchte 25 Anfragen statt
 * einer.
 *
 * Jetzt garantiert das Schema die Anzahl. Stimmt sie wider Erwarten
 * doch nicht, wird aufgefüllt statt verschoben: Eine um eins
 * verrutschte Untertitelspur ist schlimmer als eine fehlende Zeile.
 *
 * @param {string[]} zeilen
 */
export async function uebersetzeZeilen(zeilen) {
  const ergebnis = []
  const PAKET = 40

  for (let i = 0; i < zeilen.length; i += PAKET) {
    const teil = zeilen.slice(i, i + PAKET)
    const { zeilen: uebersetzt } = await frageModell(
      [
        {
          role: 'system',
          content:
            'Du übersetzt russische Untertitel ins Deutsche. Du bekommst ein ' +
            'JSON-Array mit Zeilen und gibst GENAU so viele Zeilen in derselben ' +
            'Reihenfolge zurück. Übersetze jede Zeile einzeln, aber nutze die ' +
            'anderen Zeilen als Zusammenhang. Natürliches gesprochenes Deutsch, ' +
            'keine Erklärungen, keine Zeilennummern, keine Umschrift. ' +
            'Eine leere Zeile bleibt leer.',
        },
        { role: 'user', content: JSON.stringify(teil) },
      ],
      ZEILEN_SCHEMA
    )

    const sicher = Array.isArray(uebersetzt) ? uebersetzt : []
    for (let n = 0; n < teil.length; n++) {
      ergebnis.push((sicher[n] ?? '').trim())
    }
  }

  return ergebnis
}
