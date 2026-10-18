/**
 * Sätze mit KI erzeugen – das Gegenstück zur Vokabelliste.
 *
 * Der Unterschied zum Wortschatz: Ein Satz trainiert nicht nur die
 * Bedeutung, sondern auch den Satzbau und die Form. Deshalb kann man
 * hier zweierlei vorgeben – ein Thema ("Im Restaurant") UND eine
 * Grammatikvorgabe ("Instrumental"). Beides zusammen ergibt gezielte
 * Übung: "Sätze mit dem Instrumental rund ums Reisen".
 *
 * Erzeugt wird auf dem Server, nicht im Browser: Der Schlüssel bleibt
 * hier, und das Tageskontingent lässt sich nicht umgehen.
 */

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const MODELL = 'gpt-4o-mini'

/** Wie viele Sätze liefert eine Anfrage? */
export const SAETZE_PRO_LISTE = 10

// ---------------------------------------------------------------
//  Was man vorgeben kann
// ---------------------------------------------------------------
//
// Hier steht bewusst nicht dasselbe wie im Spanischkurs. Spanisch
// hat sieben Zeitformen, und die sind dort die eigentliche Arbeit.
// Russisch hat drei – dafür anderes, das Deutschen ungleich schwerer
// fällt:
//
//   Der ASPEKT steht an erster Stelle. Ob man читать oder прочитать
//   sagt, entscheidet über die Bedeutung des Satzes, und im Deutschen
//   gibt es dafür keine Entsprechung. Das ist die Hürde, an der die
//   meisten hängen bleiben – nicht die Zeit.
//
//   Dann die SECHS FÄLLE, einzeln übbar. Wer nur "die Fälle" übt,
//   übt nichts; wer gezielt zwanzig Sätze im Instrumental liest, hat
//   ihn danach.
//
//   Dann die BEWEGUNGSVERBEN, der zweite berüchtigte Brocken.
//
// Der Text hinter dem Schlüssel geht WÖRTLICH an das Modell. Er muss
// die Form also eindeutig benennen und ein Beispiel mitgeben – der
// deutsche Name allein reicht nicht.
export const GRAMMATIK = {
  aspekt_unvollendet:
    'Alle Sätze benutzen den UNVOLLENDETEN Aspekt (читать, делать, писать) – ' +
    'Verlauf, Gewohnheit, Wiederholung, keine Aussage über ein Ergebnis.',
  aspekt_vollendet:
    'Alle Sätze benutzen den VOLLENDETEN Aspekt (прочитать, сделать, написать) – ' +
    'eine abgeschlossene Handlung mit Ergebnis.',
  aspekt_gemischt:
    'Jeder Satz stellt beide Aspekte gegenüber oder zeigt deutlich, warum ' +
    'genau dieser Aspekt gewählt ist (z. B. "Я читал книгу, но не прочитал").',

  nominativ:
    'In jedem Satz steht ein deutlich erkennbarer Nominativ als Satzgegenstand ' +
    '(кто? что?).',
  genitiv:
    'Jeder Satz enthält einen Genitiv (кого? чего?) – Besitz, Verneinung mit нет, ' +
    'Mengenangaben oder nach Präpositionen wie из, от, у, без.',
  dativ:
    'Jeder Satz enthält einen Dativ (кому? чему?) – Empfänger, Alter, Gefallen ' +
    '(мне нравится), nach к und по.',
  akkusativ:
    'Jeder Satz enthält einen Akkusativ (кого? что?) als direktes Objekt. ' +
    'Bring auch belebte Substantive, bei denen der Akkusativ wie der Genitiv aussieht.',
  instrumental:
    'Jeder Satz enthält einen Instrumental (кем? чем?) – Werkzeug, Begleitung mit с, ' +
    'Beruf nach быть/работать, nach заниматься und интересоваться.',
  praepositiv:
    'Jeder Satz enthält einen Präpositiv (о ком? о чём? где?) – nach в, на, о.',

  bewegungsverben:
    'Jeder Satz enthält ein Bewegungsverb und macht den Unterschied sichtbar: ' +
    'идти/ходить, ехать/ездить, бежать/бегать – einmalig und gerichtet gegen ' +
    'wiederholt oder allgemein.',
  praefixverben:
    'Jeder Satz enthält ein Verb mit Vorsilbe, bei dem die Vorsilbe die Bedeutung ' +
    'trägt (приходить, уходить, входить, выходить, переходить).',

  praesens: 'Alle Sätze stehen im Präsens (я читаю, он говорит).',
  praeteritum:
    'Alle Sätze stehen in der Vergangenheit auf -л (я читал, она читала, они читали) – ' +
    'achte auf das Geschlecht des Satzgegenstands.',
  futur:
    'Alle Sätze stehen in der Zukunft. Mische beide Formen: zusammengesetzt mit буду ' +
    'plus unvollendetem Infinitiv und einfach über den vollendeten Aspekt (я сделаю).',

  imperativ:
    'Alle Sätze sind Aufforderungen im Imperativ, jeweils in der Du- und der ' +
    'Sie-Form (скажи / скажите).',
  verneinung:
    'Jeder Satz ist verneint. Bring auch die doppelte Verneinung, die im Russischen ' +
    'richtig ist (я никогда ничего не говорю).',
  reflexiv: 'Jeder Satz enthält ein Verb auf -ся (учиться, находиться, нравиться).',
}

/** Menschenlesbare Namen – die App zeigt sie auf den Chips. */
export const GRAMMATIK_NAMEN = {
  aspekt_unvollendet: 'Aspekt: unvollendet',
  aspekt_vollendet: 'Aspekt: vollendet',
  aspekt_gemischt: 'Aspekt im Vergleich',
  nominativ: 'Nominativ',
  genitiv: 'Genitiv',
  dativ: 'Dativ',
  akkusativ: 'Akkusativ',
  instrumental: 'Instrumental',
  praepositiv: 'Präpositiv',
  bewegungsverben: 'Bewegungsverben',
  praefixverben: 'Verben mit Vorsilbe',
  praesens: 'Präsens',
  praeteritum: 'Vergangenheit',
  futur: 'Zukunft',
  imperativ: 'Imperativ',
  verneinung: 'Verneinung',
  reflexiv: 'Verben auf -ся',
}

/**
 * Die Gruppen für die Oberfläche.
 *
 * Ohne Gruppierung stünden siebzehn Chips in einer Reihe und niemand
 * fände den Aspekt. Die Reihenfolge ist die Reihenfolge der
 * Wichtigkeit, nicht die des Lehrbuchs.
 */
export const GRAMMATIK_GRUPPEN = [
  { titel: 'Aspekt', schluessel: ['aspekt_unvollendet', 'aspekt_vollendet', 'aspekt_gemischt'] },
  {
    titel: 'Die sechs Fälle',
    schluessel: ['nominativ', 'genitiv', 'dativ', 'akkusativ', 'instrumental', 'praepositiv'],
  },
  { titel: 'Bewegung', schluessel: ['bewegungsverben', 'praefixverben'] },
  { titel: 'Zeiten', schluessel: ['praesens', 'praeteritum', 'futur'] },
  { titel: 'Weiteres', schluessel: ['imperativ', 'verneinung', 'reflexiv'] },
]

// ---------------------------------------------------------------
//  Aufbau der erwarteten Antwort
// ---------------------------------------------------------------
const SATZ_SCHEMA = {
  type: 'object',
  properties: {
    thema: {
      type: 'string',
      description: 'Kurzer Name für diese Satzliste, z. B. "Im Restaurant bestellen"',
    },
    hinweis: {
      type: 'string',
      description:
        'Ein bis zwei Sätze auf Deutsch: Was ist an diesen Sätzen das ' +
        'Lernenswerte? Bei vorgegebener Form: woran erkennt man sie? ' +
        'Persönlich formuliert, direkte Anrede.',
    },
    saetze: {
      type: 'array',
      description: `${SAETZE_PRO_LISTE} Sätze zum Thema`,
      items: {
        type: 'object',
        properties: {
          satz: {
            type: 'string',
            description:
              'Der russische Satz in kyrillischer Schrift, ohne Umschrift und ' +
              'ohne Betonungszeichen. Vollständig, natürlich gesprochen, ' +
              'höchstens zwölf Wörter.',
          },
          uebersetzung: {
            type: 'string',
            description:
              'Die deutsche Übersetzung – natürliches Deutsch, keine ' +
              'Wort-für-Wort-Übertragung',
          },
          schluessel: {
            type: 'string',
            description:
              'Das eine Wort oder die eine Wendung aus dem Satz, auf die es ' +
              'ankommt – etwa die Verbform beim Aspekt oder das gebeugte ' +
              'Substantiv beim Fall. Genau so geschrieben wie im Satz.',
          },
        },
        required: ['satz', 'uebersetzung', 'schluessel'],
        additionalProperties: false,
      },
    },
  },
  required: ['thema', 'hinweis', 'saetze'],
  additionalProperties: false,
}

/** Schon gesammelte Sätze als Hinweis – verhindert Dopplungen. */
function bekanntesAlsHinweis(bekannt) {
  const liste = (bekannt ?? []).filter(Boolean).slice(0, 60)
  if (!liste.length) return ''
  return (
    '\n\nDiese Sätze hat die Person schon – nimm sie NICHT noch einmal und ' +
    'auch nichts, was ihnen fast gleicht:\n' +
    liste.map((s) => '- ' + s).join('\n')
  )
}

/** Sicherheitsnetz: Dopplungen rausfiltern, falls das Modell sich nicht hält. */
function ohneBekannte(saetze, bekannt) {
  const schonDa = new Set((bekannt ?? []).map((s) => String(s).toLowerCase().trim()))
  return (saetze ?? []).filter((s) => s?.satz && !schonDa.has(s.satz.toLowerCase().trim()))
}

/**
 * Stellt eine Satzliste zusammen.
 *
 * @param {string}   thema     – z. B. "Reisen"; leer = die KI wählt selbst
 * @param {string}   grammatik – Schlüssel aus GRAMMATIK, oder '' für gemischt
 * @param {string[]} bekannt   – schon gesammelte Sätze
 */
export async function erzeugeSatzliste(thema, grammatik = '', bekannt = []) {
  const schluessel = process.env.OPENAI_API_KEY
  if (!schluessel) throw new Error('Kein OpenAI-Schlüssel hinterlegt.')

  const regel = GRAMMATIK[grammatik]
  const automatisch = !thema?.trim()

  // Ohne Thema UND ohne Vorgabe bräuchte das Modell etwas, woran es
  // sich orientiert – dann schaut es auf die bisherigen Sätze.
  const auftrag =
    (automatisch
      ? 'Wähle selbst ein zusammenhängendes Alltagsthema, das zu den bisherigen ' +
        'Sätzen passt und sie sinnvoll ergänzt.'
      : `Thema: ${thema}`) +
    (regel ? '\n' + regel : '\nMische die Formen natürlich, wie im Alltag.') +
    bekanntesAlsHinweis(bekannt)

  const antwort = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${schluessel}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODELL,
      messages: [
        {
          role: 'system',
          content:
            'Du schreibst Übungssätze für deutschsprachige Russischlernende auf ' +
            `Alltagsniveau (A2–B1). Genau ${SAETZE_PRO_LISTE} Sätze. Regeln: ` +
            'Jeder Satz muss für sich allein verständlich sein, ohne Zusammenhang ' +
            'davor. Natürliches gesprochenes Russisch, keine Lehrbuchsätze wie ' +
            '"Der Füller liegt auf dem Tisch". Höchstens zwölf Wörter. Nur ' +
            'kyrillische Schrift, niemals Umschrift, keine Betonungszeichen. ' +
            'Nicht in jedem zweiten Satz erfundene Eigennamen. Halte dich strikt ' +
            'an die vorgegebene Form, wenn eine genannt ist – lieber ein ' +
            'einfacherer Satz als eine falsche Form.',
        },
        { role: 'user', content: auftrag },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'satzliste', schema: SATZ_SCHEMA, strict: true },
      },
    }),
  })

  if (!antwort.ok) {
    if (antwort.status === 429) {
      throw new Error('OpenAI-Kontingent erschöpft. Bitte später erneut versuchen.')
    }
    throw new Error(`OpenAI antwortet mit ${antwort.status}`)
  }

  const daten = await antwort.json()
  const ergebnis = JSON.parse(daten.choices[0].message.content)

  return {
    saetze: ohneBekannte(ergebnis.saetze, bekannt),
    hinweis: ergebnis.hinweis ?? '',
    thema: ergebnis.thema ?? thema ?? '',
    grammatik: grammatik || '',
  }
}
