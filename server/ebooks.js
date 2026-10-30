/**
 * Bilinguale E-Books für Habloo.
 *
 * Ein E-Book besteht aus Absatzpaaren: links der russische Text,
 * rechts die deutsche Übersetzung. So kann man lesen und bei jedem
 * Satz nachschauen, ohne das Wörterbuch zu bemühen.
 *
 * Erzeugt werden sie von OpenAI. Der Server ist bewusst die einzige
 * Stelle, die Bücher anlegen darf – sonst könnte man das Monatslimit
 * im Browser einfach umgehen.
 */

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const MODELL = 'gpt-4o-mini'

/** Wie viele Bücher darf ein kostenloser Zugang pro Monat erzeugen? */
export const FREI_PRO_MONAT = 3

// ---------------------------------------------------------------
//  Aufbau der Antwort, den wir von OpenAI erwarten
// ---------------------------------------------------------------
const SCHEMA = {
  type: 'object',
  properties: {
    titel_es: { type: 'string', description: 'Russischer Titel' },
    titel_de: { type: 'string', description: 'Deutscher Titel' },
    autor: { type: 'string', description: 'Name der Autorin oder des Autors' },
    untertitel_es: { type: 'string', description: 'Kurzer russischer Untertitel, ein Satz' },
    untertitel_de: { type: 'string', description: 'Derselbe Untertitel auf Deutsch' },
    kapitel: {
      type: 'array',
      description: 'Die Kapitel – jedes kurz und in sich abgeschlossen',
      items: {
        type: 'object',
        properties: {
          label_es: {
            type: 'string',
            description: 'Kurze Einordnung auf Russisch, z. B. "Введение", "Глава 1", "Итог"',
          },
          label_de: { type: 'string', description: 'Dieselbe Einordnung auf Deutsch' },
          titel_es: {
            type: 'string',
            description:
              'Die Kernaussage des Kapitels als Überschrift auf Russisch – eine Aussage, kein Etikett',
          },
          titel_de: { type: 'string', description: 'Dieselbe Überschrift auf Deutsch' },
          text_es: {
            type: 'string',
            description: 'Der Kapiteltext auf Russisch, 100–150 Wörter, 2–3 Absätze mit \\n\\n getrennt',
          },
          text_de: {
            type: 'string',
            description: 'Derselbe Text auf Deutsch, natürlich formuliert, gleiche Absatzaufteilung',
          },
        },
        required: ['label_es', 'label_de', 'titel_es', 'titel_de', 'text_es', 'text_de'],
        additionalProperties: false,
      },
    },
    vokabeln: {
      type: 'array',
      description: 'Die 10 wichtigsten Wörter aus dem Text',
      items: {
        type: 'object',
        properties: {
          es: { type: 'string' },
          de: { type: 'string' },
        },
        required: ['es', 'de'],
        additionalProperties: false,
      },
    },
  },
  required: [
    'titel_es', 'titel_de', 'autor', 'untertitel_es', 'untertitel_de', 'kapitel', 'vokabeln',
  ],
  additionalProperties: false,
}

// ---------------------------------------------------------------
//  Erzeugen
// ---------------------------------------------------------------

/**
 * Lässt OpenAI ein bilinguales E-Book schreiben.
 * @param {string} thema  – worum es gehen soll, z. B. "Ein Tag in Barcelona"
 * @param {string} niveau – A1 | A2 | B1 | B2
 */
export async function erzeugeEbook(thema, niveau = 'A2') {
  const schluessel = process.env.OPENAI_API_KEY
  if (!schluessel) throw new Error('Kein OpenAI-Schlüssel hinterlegt.')

  const vorgaben = {
    A1: 'sehr einfache Sätze, nur Präsens, Grundwortschatz; 4 Kapitel',
    A2: 'einfache Sätze, Präsens und einfache Vergangenheit, Alltagswortschatz; 5 Kapitel',
    B1: 'natürliche Sprache, verschiedene Zeiten; 5 Kapitel',
    B2: 'anspruchsvolle Sprache mit Redewendungen; 6 Kapitel',
  }[niveau] ?? 'einfache Sätze; 5 Kapitel'

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
            'Du schreibst kurze Sachbuch-Zusammenfassungen im Stil von Blinkist für ' +
            'deutschsprachige Russischlernende – Lesedauer insgesamt etwa 10 Minuten. ' +
            'Aufbau: eine Einführung ("Введение"), dann Kapitel ("Глава 1", "Глава 2" …), ' +
            'zum Schluss ein knapper Abschluss ("Итог"). Jede Kapitelüberschrift ist eine ' +
            'Kernaussage, kein Etikett. Alles liegt vollständig auf Russisch UND ' +
            'Deutsch vor; die deutsche Fassung ist natürlich formuliert, nicht Wort ' +
            'für Wort übersetzt.',
        },
        {
          role: 'user',
          content:
            `Schreibe eine solche Zusammenfassung zum Thema "${thema}" ` +
            `für Sprachniveau ${niveau}: ${vorgaben}, je Kapitel 100–150 Wörter. ` +
            'Existiert zum Thema ein bekanntes Sachbuch, fasse dessen Kernideen ' +
            'zusammen und nenne den echten Autor. Sonst schreibe einen eigenen ' +
            'Ratgebertext und erfinde einen passenden Autorennamen. ' +
            'Wähle zum Schluss die 10 nützlichsten Vokabeln aus dem Text.',
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'ebook', schema: SCHEMA, strict: true },
      },
    }),
  })

  if (!antwort.ok) {
    const text = await antwort.text()
    // Häufigste Fälle verständlich machen
    if (antwort.status === 401) throw new Error('Der OpenAI-Schlüssel wird nicht akzeptiert.')
    if (antwort.status === 429) throw new Error('OpenAI-Kontingent erschöpft. Bitte später erneut versuchen.')
    throw new Error(`OpenAI antwortet mit ${antwort.status}: ${text.slice(0, 200)}`)
  }

  const daten = await antwort.json()
  const inhalt = daten.choices?.[0]?.message?.content
  if (!inhalt) throw new Error('OpenAI hat keinen Text geliefert.')

  const buch = JSON.parse(inhalt)
  return { ...buch, niveau, thema }
}

// ---------------------------------------------------------------
//  Themen-Vokabellisten (für den Trainer)
// ---------------------------------------------------------------

const LISTEN_SCHEMA = {
  type: 'object',
  properties: {
    begruendung: {
      type: 'string',
      description:
        'Ein bis zwei Sätze auf Deutsch: Was fiel am bisherigen Wortschatz auf, ' +
        'und warum passen genau diese Wörter als nächster Schritt? ' +
        'Persönlich formuliert, direkte Anrede.',
    },
    thema: {
      type: 'string',
      description: 'Kurzer Name für diese Liste, z. B. "Im Restaurant bestellen"',
    },
    vokabeln: {
      type: 'array',
      description: 'Die Vokabeln zum Thema – exakt so viele, wie der Auftrag verlangt',
      items: {
        type: 'object',
        properties: {
          wort: { type: 'string', description: 'Das russische Wort in der Grundform' },
          uebersetzung: { type: 'string', description: 'Die deutsche Übersetzung' },
          beispiel: { type: 'string', description: 'Ein kurzer russischer Beispielsatz' },
        },
        required: ['wort', 'uebersetzung', 'beispiel'],
        additionalProperties: false,
      },
    },
  },
  required: ['begruendung', 'thema', 'vokabeln'],
  additionalProperties: false,
}

/**
 * Vergleichbare Form eines Wortes: klein geschrieben, ohne Artikel
 * und Satzzeichen. So gilt "el menú" als dasselbe Wort wie "Menú".
 */
function wortKern(wort) {
  return String(wort)
    .toLowerCase()
    .replace(/^(el|la|los|las|un|una|unos|unas)\s+/, '')
    .replace(/[¿?¡!.,;:()"]/g, '')
    .trim()
}

/**
 * Beschreibt dem Modell, was die Person schon kann.
 * Die Liste wird gekürzt, damit die Anfrage nicht unnötig groß wird.
 */
function bekanntesAlsHinweis(bekannt) {
  const woerter = [...new Set((bekannt ?? []).map(wortKern).filter(Boolean))]
  if (!woerter.length) return ''

  // Die zuletzt gesammelten Wörter sagen am meisten über den Stand aus
  const auswahl = woerter.slice(-600)
  return (
    `\n\nDiese ${woerter.length} Wörter kennt die Person bereits – nimm KEINES davon ` +
    `noch einmal auf, sondern wähle Wörter, die inhaltlich darauf aufbauen ` +
    `und etwas anspruchsvoller sind:\n${auswahl.join(', ')}`
  )
}

/** Entfernt Vorschläge, die die Person schon kennt oder die doppelt sind. */
function ohneBekannte(vorschlaege, bekannt) {
  const gesperrt = new Set((bekannt ?? []).map(wortKern))
  const gesehen = new Set()

  return (vorschlaege ?? []).filter((v) => {
    const kern = wortKern(v.wort)
    if (!kern || gesperrt.has(kern) || gesehen.has(kern)) return false
    gesehen.add(kern)
    return true
  })
}

/**
 * Lässt OpenAI eine Themen-Vokabelliste zusammenstellen.
 * @param {string}   thema   – z. B. "Restaurant"
 * @param {string[]} bekannt – Wörter, die die Person schon gesammelt hat
 */
// Optional nur eine Wortart – russische Grundformen, keine Artikel.
const WORTART_REGEL = {
  verben: 'Wähle AUSSCHLIESSLICH Verben, im Infinitiv (z. B. "читать"); wenn sinnvoll das Aspektpaar.',
  adjektive: 'Wähle AUSSCHLIESSLICH Adjektive in der männlichen Grundform (z. B. "быстрый").',
  nomen: 'Wähle AUSSCHLIESSLICH Nomen (Substantive) im Nominativ Singular.',
}

export async function erzeugeVokabelliste(thema, bekannt = [], anzahl = 10, wortart = 'alle') {
  // Zwischen 5 und 50 Wörtern – das Onboarding bestellt z.B. 50.
  anzahl = Math.max(5, Math.min(50, Number(anzahl) || 10))
  const schluessel = process.env.OPENAI_API_KEY
  if (!schluessel) throw new Error('Kein OpenAI-Schlüssel hinterlegt.')

  // Ohne Thema übernimmt die KI die Auswahl: sie schaut sich den
  // bisherigen Wortschatz an und schlägt den nächsten sinnvollen
  // Schritt vor – etwa passende Verben zu vorhandenen Nomen.
  const automatisch = !thema?.trim()

  const auftrag = automatisch
    ? 'Schau dir den bisherigen Wortschatz an und wähle selbst aus, was als ' +
      'Nächstes am meisten bringt. Achte darauf: Welche Themen tauchen auf? ' +
      'Fehlen zu vorhandenen Nomen die passenden Verben? Fehlen Wörter, die ' +
      'man im Alltag ständig braucht? Wähle ein zusammenhängendes Thema statt ' +
      'wahlloser Einzelwörter.' + bekanntesAlsHinweis(bekannt)
    : `Thema: ${thema}` + bekanntesAlsHinweis(bekannt)
  const auftragMitWortart = WORTART_REGEL[wortart] ? auftrag + '\n' + WORTART_REGEL[wortart] : auftrag

  // Immer genau `anzahl` Wörter. Das Modell schlägt bewusst mehr vor,
  // weil danach alles rausfliegt, was die Person schon kennt – vorher
  // kamen so manchmal nur 1–6 Wörter an. Reicht es nicht, wird mit den
  // aussortierten Wörtern als Sperrliste nachgefragt (max. 3 Runden).
  let gesammelt = []
  let begruendung = ''
  let gefundenesThema = ''
  const abgelehnt = []

  for (let runde = 0; runde < 3 && gesammelt.length < anzahl; runde++) {
    const fehlen = anzahl - gesammelt.length
    const sperre = [...bekannt, ...gesammelt.map((v) => v.wort), ...abgelehnt]
    const nachschlag = runde
      ? `\n\nNICHT erlaubt (schon vorhanden oder schon vorgeschlagen): ${[
          ...new Set([...gesammelt.map((v) => v.wort), ...abgelehnt]),
        ].join(', ')}`
      : ''

    const ergebnis = await frageListe(schluessel, auftragMitWortart + nachschlag, fehlen + 8)
    if (!begruendung) begruendung = ergebnis.begruendung ?? ''
    if (!gefundenesThema) gefundenesThema = ergebnis.thema ?? ''

    const neu = ohneBekannte(ergebnis.vokabeln, sperre)
    const gesperrt = new Set(sperre.map(wortKern))
    for (const v of ergebnis.vokabeln ?? []) if (gesperrt.has(wortKern(v.wort))) abgelehnt.push(v.wort)
    gesammelt = gesammelt.concat(neu)
  }

  return {
    vokabeln: gesammelt.slice(0, anzahl),
    begruendung,
    thema: gefundenesThema || thema || '',
  }
}

/** Eine einzelne Anfrage an das Modell für eine Themenliste. */
async function frageListe(schluessel, auftrag, anzahl) {
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
            `Du stellst Vokabellisten für deutschsprachige Russischlernende zusammen: ` +
            `genau ${anzahl} Wörter, jedes mit einem kurzen, lebendigen Beispielsatz. ` +
            'Wähle Wörter, die Muttersprachler im Alltag WIRKLICH ständig benutzen – ' +
            'echte, nützliche Wörter, bei denen man denkt "oh ja, das brauche ich". ' +
            'Sortiere nach Nutzen: zuerst die häufigsten, die im echten Gespräch fallen. ' +
            'Gern auch typische Alltagsausdrücke, die in Lehrbüchern fehlen. ' +
            'Verben im Infinitiv, Nomen in der Grundform (Nominativ Singular). ' +
            'Keine Anglizismen, keine exotischen Fachbegriffe, keine Wortgruppen über 3 Wörter, ' +
            'keine Allerweltswörter wie "и", "в", "не". Jedes Wort genau einmal. ' +
            'Erkläre in der Begründung kurz und persönlich (2 Sätze), warum du ' +
            'gerade diese Auswahl getroffen hast.',
        },
        { role: 'user', content: auftrag },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'vokabelliste', schema: LISTEN_SCHEMA, strict: true },
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

/**
 * Wählt aus einem Video-Transkript die lernenswertesten Wörter aus.
 * @param {string}   text    – das Transkript
 * @param {string[]} bekannt – schon gesammelte Wörter
 */
export async function erzeugeVideoVokabeln(text, bekannt = []) {
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
      messages: [
        {
          role: 'system',
          content:
            'Du wählst aus einem russischen Video-Transkript die 12 Wörter aus, ' +
            'die sich für deutschsprachige Lernende am meisten zu lernen lohnen: ' +
            'häufig gebraucht, alltagstauglich, keine Eigennamen und keine ' +
            'Allerweltswörter wie "y", "de" oder "que". Nomen mit Artikel, ' +
            'Verben im Infinitiv. Der Beispielsatz stammt möglichst aus dem Text.',
        },
        {
          role: 'user',
          content: `Transkript:\n${text.slice(0, 8000)}` + bekanntesAlsHinweis(bekannt),
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'vokabelliste', schema: LISTEN_SCHEMA, strict: true },
      },
    }),
  })

  if (!antwort.ok) {
    if (antwort.status === 429) throw new Error('OpenAI-Kontingent erschöpft. Bitte später erneut versuchen.')
    throw new Error(`OpenAI antwortet mit ${antwort.status}`)
  }

  const daten = await antwort.json()
  const vorschlaege = JSON.parse(daten.choices[0].message.content).vokabeln
  return ohneBekannte(vorschlaege, bekannt)
}

// ---------------------------------------------------------------
//  Zugriff auf die Datenbank (mit service_role, umgeht RLS)
// ---------------------------------------------------------------

function supabaseKopf() {
  const key = process.env.SUPABASE_SERVICE_KEY
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  }
}

/** Prüft anhand des Anmelde-Tokens, wer gerade fragt. */
export async function nutzerAusToken(token) {
  if (!token) return null

  const antwort = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
    },
  })
  if (!antwort.ok) return null

  const nutzer = await antwort.json()
  return nutzer?.id ? nutzer : null
}

/** Zählt, wie viele Bücher dieser Nutzer im laufenden Monat erzeugt hat. */
export async function anzahlDiesenMonat(nutzerId) {
  const monatsAnfang = new Date()
  monatsAnfang.setDate(1)
  monatsAnfang.setHours(0, 0, 0, 0)

  const antwort = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/ebooks` +
      `?select=id&nutzer_id=eq.${nutzerId}` +
      `&erstellt_am=gte.${monatsAnfang.toISOString()}`,
    { headers: { ...supabaseKopf(), Prefer: 'count=exact' } }
  )

  if (!antwort.ok) return 0
  return (await antwort.json()).length
}

/** Legt ein erzeugtes Buch für den Nutzer ab. */
export async function speichereEbook(nutzerId, buch) {
  const antwort = await fetch(`${process.env.SUPABASE_URL}/rest/v1/ebooks`, {
    method: 'POST',
    headers: { ...supabaseKopf(), Prefer: 'return=representation' },
    body: JSON.stringify({
      nutzer_id: nutzerId,
      titel: buch.titel_es,
      titel_de: buch.titel_de,
      untertitel_es: buch.untertitel_es,
      untertitel_de: buch.untertitel_de,
      autor: buch.autor,
      thema: buch.thema,
      niveau: buch.niveau,
      kapitel: buch.kapitel,
      vokabeln: buch.vokabeln,
      ist_beispiel: false,
    }),
  })

  if (!antwort.ok) {
    throw new Error('Buch konnte nicht gespeichert werden: ' + (await antwort.text()).slice(0, 200))
  }
  return (await antwort.json())[0]
}

/* ---------------------------------------------------------------- *
 *  Buchzusammenfassung für die Bibliothek
 * ---------------------------------------------------------------- */

const BUCH_SCHEMA = {
  type: 'object',
  properties: {
    titel: { type: 'string', description: 'Der Buchtitel' },
    autor: { type: 'string', description: 'Der echte Autor des Buches' },
    niveau: { type: 'string', description: 'A1, A2 oder B1' },
    absaetze: {
      type: 'array',
      description: '5 bis 7 Absätze, jeder zweisprachig',
      items: {
        type: 'object',
        properties: {
          es: { type: 'string', description: 'Der Absatz auf Russisch, kyrillisch' },
          de: { type: 'string', description: 'Derselbe Absatz auf Deutsch' },
        },
        required: ['es', 'de'],
        additionalProperties: false,
      },
    },
    vokabeln: {
      type: 'array',
      description: '8 nützliche Wörter aus dem Text',
      items: {
        type: 'object',
        properties: {
          wort: { type: 'string', description: 'Das russische Wort' },
          uebersetzung: { type: 'string', description: 'Die deutsche Bedeutung' },
        },
        required: ['wort', 'uebersetzung'],
        additionalProperties: false,
      },
    },
  },
  required: ['titel', 'autor', 'niveau', 'absaetze', 'vokabeln'],
  additionalProperties: false,
}

/**
 * Eine Blinkist-artige Zusammenfassung zu einem Buchtitel.
 *
 * Lief bis zum 30.10.2026 über Anthropic (claude-opus-5) – als
 * einzige Stelle im ganzen Projekt. Alles andere, von den
 * Vokabellisten bis zum Tutor, nutzt gpt-4o-mini. Ein zweiter
 * Anbieter für eine einzige Funktion heißt: ein zweiter Vertrag,
 * eine zweite Rechnung und ein zweiter Schlüssel, der in Coolify
 * fehlen kann – und genau das war er auch.
 */
export async function erzeugeBuchzusammenfassung(titel) {
  const schluessel = process.env.OPENAI_API_KEY
  if (!schluessel) throw new Error('OPENAI_API_KEY fehlt.')

  const antwort = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${schluessel}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODELL,
      messages: [
        {
          role: 'system',
          content:
            'Du schreibst kurze Buchzusammenfassungen im Stil von Blinkist für ' +
            'deutschsprachige Russisch-Anfänger. Schreib ausschließlich in ' +
            'kyrillischer Schrift, niemals in Umschrift, und setze keine ' +
            'Betonungszeichen – die stehen in Lehrbüchern, nicht in echten Texten.',
        },
        {
          role: 'user',
          content:
            `Fasse das Buch "${titel}" zusammen: 5 bis 7 kurze Absätze in ` +
            'EINFACHEM Russisch (kurze Sätze, Grundwortschatz, Niveau A2), jeder ' +
            'Absatz mit deutscher Übersetzung. Dazu 8 nützliche russische Wörter ' +
            'aus dem Text.\n\n' +
            'Kennst du das Buch nicht sicher, sag das ehrlich im ersten Absatz und ' +
            'fasse zusammen, wofür der Titel bekannt ist. Erfinde keine Inhalte und ' +
            'keinen Autor.',
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'buch', schema: BUCH_SCHEMA, strict: true },
      },
    }),
  })

  if (!antwort.ok) {
    const fehler = await antwort.text()
    throw new Error(`OpenAI antwortet mit ${antwort.status}: ${fehler.slice(0, 200)}`)
  }
  const daten = await antwort.json()
  return JSON.parse(daten.choices[0].message.content)
}
