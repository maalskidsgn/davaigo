// Kleiner Server, der das Transkript (Untertitel) eines YouTube-Videos holt.
// Er benutzt dafür das Programm "yt-dlp" (per Homebrew installiert), weil das
// zuverlässig an die YouTube-Untertitel kommt.
import express from 'express'
import { execFile } from 'child_process'
import { mkdtemp, readFile, readdir, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import Anthropic from '@anthropic-ai/sdk'
import { findeRussischeInterpreten, ergaenzeSongs } from './interpreten.js'
import { uebersetzeWort, uebersetzeZeilen } from './uebersetzen.js'
import { erzeugeSatzliste, GRAMMATIK } from './saetze.js'
import { erzeugeLesetext, GEBIETE } from './lesetexte.js'
import { loescheKonto } from './konto.js'
import { schicke, freundschaftsanfrage, mailBereit } from './mail.js'
import { KI_PRO_TAG, nutzungHeute, zaehleNutzung, naechsteAuffuellung } from './kontingent.js'
import {
  antworte,
  istPremium,
  tutorNutzungHeute,
  zaehleTutorNutzung,
  GESPRAECHE_PRO_TAG,
} from './gespraech.js'
import {
  starteBezahlung,
  verwaltungsLink,
  pruefeMeldung,
  verarbeiteMeldung,
  stripeBereit,
  holePreis,
  holePreise,
} from './bezahlung.js'
import {
  holeTranskript as holeUeberDienst,
  tubeAlfredBereit,
  merkeInBibliothek,
  ausBibliothek,
} from './transkripte.js'
import {
  erzeugeEbook,
  nutzerAusToken,
  anzahlDiesenMonat,
  speichereEbook,
  FREI_PRO_MONAT,
  erzeugeVokabelliste,
  erzeugeVideoVokabeln,
} from './ebooks.js'

// Beim lokalen Entwickeln die Zugangsdaten aus .env.local einlesen.
// In der Produktion (Coolify/Docker) kommen sie als echte Umgebungsvariablen.
try {
  const { readFileSync } = await import('fs')
  const datei = new URL('../.env.local', import.meta.url)
  for (const zeile of readFileSync(datei, 'utf8').split('\n')) {
    const treffer = zeile.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (treffer && !process.env[treffer[1]]) {
      process.env[treffer[1]] = treffer[2].trim()
    }
  }
} catch {
  // Keine .env.local vorhanden – das ist im Betrieb der Normalfall.
}

const app = express()

// Die Stripe-Meldung MUSS vor express.json stehen und roh bleiben:
// Stripe unterschreibt den unveraenderten Text. Sobald express.json
// ihn einliest und wieder ausgibt, passt die Signatur nicht mehr –
// dann waeren alle Meldungen ungueltig.
app.post(
  '/api/bezahlung/melden',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      const ereignis = pruefeMeldung(req.body, req.headers['stripe-signature'])
      const ergebnis = await verarbeiteMeldung(ereignis)
      console.log('[stripe]', ereignis.type, JSON.stringify(ergebnis))
      res.json({ empfangen: true })
    } catch (fehler) {
      // 400 signalisiert Stripe: nicht erneut versuchen (Signatur falsch).
      console.error('[stripe] Meldung abgelehnt:', fehler.message)
      res.status(400).json({ error: fehler.message })
    }
  }
)

app.use(express.json({ limit: '2mb' }))
const PORT = process.env.PORT || 8787

// CORS: erlaubt dem Frontend (andere Domain, z.B. Vercel), diesen Server
// anzusprechen. Ohne diese Kopfzeilen blockt der Browser solche Anfragen.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

// Gesundheits-Check: damit sieht das Hosting, dass der Server lebt
app.get('/health', (req, res) => res.json({ ok: true }))

// Claude-KI nur nutzen, wenn ein API-Schlüssel hinterlegt ist —
// sonst arbeitet der Vokabelgenerator mit Häufigkeits-Analyse + Übersetzung.
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null

/**
 * Schaetzt ein, wie brauchbar ein Transkript ist.
 *
 * Automatische Untertitel von Musikvideos zerfallen typischerweise
 * in Bruchstuecke ("teot un", "bes en"): sehr kurze Zeilen, viele
 * Ein-Wort-Zeilen, kaum Woerter je Zeile. Genau daran erkennen
 * wir sie – ohne die Sprache verstehen zu muessen.
 *
 * @returns {{stufe: 'gut'|'mittel'|'schlecht', woerterProZeile: number}}
 */
function pruefeQualitaet(lines) {
  if (!lines?.length) return { stufe: 'schlecht', woerterProZeile: 0 }

  const woerterJe = lines.map((l) => l.text.trim().split(/\s+/).filter(Boolean).length)
  const schnitt = woerterJe.reduce((s, n) => s + n, 0) / woerterJe.length
  const anteilWinzig = woerterJe.filter((n) => n <= 2).length / woerterJe.length

  // Erfahrungswerte: Ordentliche Untertitel haben 5+ Woerter je
  // Zeile; unter 3,5 im Schnitt oder mehr als 35 % Zwei-Wort-Zeilen
  // ist der Text zerhackt.
  let stufe = 'gut'
  if (schnitt < 3.5 || anteilWinzig > 0.35) stufe = 'schlecht'
  else if (schnitt < 5 || anteilWinzig > 0.2) stufe = 'mittel'

  return { stufe, woerterProZeile: Math.round(schnitt * 10) / 10 }
}

/**
 * Welche dieser Videos haben ueberhaupt Untertitel?
 *
 * Ohne diese Pruefung landen Songs in den Treffern, die gar keinen
 * Text haben – der Nutzer klickt, wartet, und bekommt "keine
 * spanischen Untertitel". Schlimmer noch: Der Versuch geht ueber
 * den kostenpflichtigen Dienst.
 *
 * Ein einziger Aufruf prueft bis zu 50 Videos (1 Kontingent-Einheit).
 * Scheitert er – etwa weil der Schluessel auf eine andere Adresse
 * beschraenkt ist – lassen wir ALLE durch, statt gar nichts zu
 * zeigen.
 *
 * @returns {Promise<Set<string>|null>} IDs mit Untertiteln, oder null
 */
async function mitUntertiteln(ids) {
  const schluessel = process.env.YOUTUBE_API_KEY
  if (!schluessel || ids.length === 0) return null

  try {
    const antwort = await fetch(
      'https://www.googleapis.com/youtube/v3/videos' +
        `?part=contentDetails&id=${ids.slice(0, 50).join(',')}&key=${schluessel}`
    )
    if (!antwort.ok) return null

    const daten = await antwort.json()
    if (daten.error) {
      console.warn('[suche] Untertitel-Pruefung nicht moeglich:', daten.error.message)
      return null
    }
    return new Set(
      (daten.items ?? [])
        .filter((v) => v.contentDetails?.caption === 'true')
        .map((v) => v.id)
    )
  } catch {
    return null
  }
}

// Holt aus einer YouTube-URL die Video-ID (der Teil nach "v=" oder hinter youtu.be/)
function extractVideoId(url) {
  const patterns = [
    /(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

// Führt yt-dlp aus und gibt die Ausgabe zurück (als Promise, damit man "await" nutzen kann)
function runYtDlp(args) {
  return new Promise((resolve, reject) => {
    execFile('yt-dlp', args, { timeout: 60000 }, (err, stdout, stderr) => {
      if (err) {
        // Besser: YouTube-Blockade erkennen und verständlich erklären
        if (stderr?.includes('Sign in to confirm you\'re not a bot') || stderr?.includes('429')) {
          reject(new Error('YouTube hat diese Anfrage blockiert (zu viele Zugriffe von diesem Server). Das ist bei Rechenzentrums-IPs häufig. Lokal (auf der Mac) funktioniert es.'))
        } else {
          reject(new Error(stderr || err.message))
        }
      } else {
        resolve(stdout)
      }
    })
  })
}

app.get('/api/transcript', async (req, res) => {
  const videoId = extractVideoId(req.query.url || '')
  // Songs sollen als Musik abgelegt werden, nicht als normales Video
  const kategorie = req.query.art === 'musik' ? 'musik' : 'gefunden'
  if (!videoId) {
    return res.status(400).json({ error: 'Das sieht nicht wie ein YouTube-Link aus.' })
  }

  // Temporärer Ordner für die Untertitel-Datei
  const dir = await mkdtemp(join(tmpdir(), 'subs-'))
  try {
    // Titel des Videos holen
    const title = (
      await runYtDlp(['--skip-download', '--print', 'title', `https://www.youtube.com/watch?v=${videoId}`])
    ).trim()

    // Untertitel in ZWEI Stufen holen.
    //
    // Wichtig bei Musik: YouTubes automatische Spracherkennung
    // scheitert an Gesang und liefert Bruchstuecke wie "teot un".
    // Von Hand hochgeladene Untertitel (bei Lyrics-Videos die Regel)
    // sind dagegen wortgenau. Deshalb fragen wir sie ZUERST an und
    // nehmen die automatischen nur als Notloesung – klar markiert.
    const holeUntertitel = async (automatisch) => {
      await runYtDlp([
        '--skip-download',
        automatisch ? '--write-auto-subs' : '--write-subs',
        '--sub-langs', 'ru,ru-RU',
        '--sub-format', 'json3',
        '-o', join(dir, 'subs.%(ext)s'),
        `https://www.youtube.com/watch?v=${videoId}`,
      ])
      return (await readdir(dir)).filter((f) => f.endsWith('.json3'))
    }

    let files = await holeUntertitel(false)
    let automatisch = false
    if (files.length === 0) {
      files = await holeUntertitel(true)
      automatisch = true
    }

    if (files.length === 0) {
      return res.status(404).json({ error: 'Für dieses Video gibt es leider keine russischen Untertitel.' })
    }

    const captionData = JSON.parse(await readFile(join(dir, files[0]), 'utf8'))

    // YouTube liefert "events" mit Startzeit, Dauer und Text-Schnipseln
    const lines = (captionData.events || [])
      .filter((ev) => ev.segs)
      .map((ev) => ({
        text: ev.segs.map((s) => s.utf8).join('').replace(/\n/g, ' ').trim(),
        start: ev.tStartMs / 1000,
        end: (ev.tStartMs + (ev.dDurationMs || 0)) / 1000,
      }))
      .filter((l) => l.text)

    res.json({ videoId, title, lines, automatisch, qualitaet: pruefeQualitaet(lines) })
  } catch (err) {
    // yt-dlp scheitert auf Servern regelmäßig an YouTubes Bot-Sperre.
    // Dann übernimmt TubeAlfred – das kostet ein Guthaben, deshalb
    // wird es bewusst erst hier versucht.
    // ZUERST in der eigenen Datenbank nachsehen – kostet nichts.
    const gespeichert = await ausBibliothek(videoId)
    if (gespeichert) {
      console.log('aus der Bibliothek, kein Guthaben:', videoId)
      return res.json({ ...gespeichert, qualitaet: pruefeQualitaet(gespeichert.lines) })
    }

    if (tubeAlfredBereit()) {
      try {
        console.log('yt-dlp blockiert, frage TubeAlfred:', videoId)
        const ergebnis = await holeUeberDienst(videoId)
        // Gleich in die Bibliothek legen: so kostet dieses Video
        // nie wieder ein Guthaben – auch nicht bei anderen Nutzern
        merkeInBibliothek(videoId, ergebnis.title, ergebnis.lines, kategorie)
        // Auch ueber diesen Weg soll die App erfahren, ob der Text
        // brauchbar ist – sonst warnt sie nur bei lokal geholten.
        return res.json({ ...ergebnis, qualitaet: pruefeQualitaet(ergebnis.lines) })
      } catch (dienstFehler) {
        console.error('TubeAlfred:', dienstFehler.message)
        return res.status(502).json({ error: dienstFehler.message })
      }
    }
    console.error(err.message)
    res.status(500).json({ error: 'Transkript konnte nicht geladen werden: ' + err.message })
  } finally {
    // Temporären Ordner wieder aufräumen
    rm(dir, { recursive: true, force: true }).catch(() => {})
  }
})

// Übersetzt ein russisches Wort ins Deutsche.
//
// Lief bis zum 23.08. über Googles Widget-Endpunkt, der inzwischen
// mit HTTP 429 sperrt – siehe server/uebersetzen.js. Jetzt macht das
// ein Sprachmodell, das nebenbei die Grundform findet: Wer "книгу"
// antippt, bekommt "das Buch" statt einer Fehlanzeige.
app.get('/api/translate', async (req, res) => {
  const word = (req.query.q || '').trim()
  if (!word) return res.status(400).json({ error: 'Kein Wort angegeben.' })
  try {
    // Der Satz drumherum (optional) – damit mehrdeutige Wörter passend übersetzt werden
    const satz = String(req.query.satz || '').trim().slice(0, 300)
    const translation = await uebersetzeWort(word, 'ru-de', satz)
    if (!translation) throw new Error('Leere Antwort')
    res.json({ translation })
  } catch (err) {
    console.error('Übersetzung fehlgeschlagen:', err.message)
    // Der echte Grund geht mit. Die App zeigt ihn an, statt einen
    // Ersatztext als Bedeutung auszugeben – siehe src/App.jsx.
    res.status(502).json({ error: err.message || 'Übersetzung fehlgeschlagen' })
  }
})

// Prüft, ob ein Video in fremde Seiten eingebettet werden darf.
// Manche Kanäle verbieten das – dann antwortet YouTubes oEmbed-Dienst
// mit einem Fehler, und wir sortieren das Video aus.
async function istEinbettbar(videoId) {
  try {
    const r = await fetch(
      'https://www.youtube.com/oembed?format=json&url=' +
        encodeURIComponent('https://www.youtube.com/watch?v=' + videoId)
    )
    return r.ok
  } catch {
    return true // Netzwerkproblem? Dann im Zweifel nicht wegfiltern.
  }
}

// Sucht Videos auf YouTube (über yt-dlp, ohne API-Schlüssel).
// Nicht-einbettbare Videos werden direkt herausgefiltert.
// Wie ein Niveau die Suche beeinflusst.
// YouTube kennt keine Sprachniveaus – wir steuern über Suchwörter und
// Videolänge. Für Anfänger sucht man gezielt nach langsam gesprochenen
// Lernvideos, für Fortgeschrittene nach echten Podcasts und Gesprächen.
// Die Zusätze sind bewusst knapp gehalten: zu viele Schlagwörter
// verschieben das Thema (z. B. führte "lento" zu Meditationsvideos).
const NIVEAU_SUCHE = {
  A1: { zusatz: 'простое объяснение', maxSek: 900 },
  A2: { zusatz: 'понятное объяснение', maxSek: 1200 },
  B1: { zusatz: 'объяснение', maxSek: 1800 },
  B2: { zusatz: '', maxSek: 2700 },
  C1: { zusatz: 'подкаст', maxSek: 4500 },
  C2: { zusatz: 'подкаст анализ', maxSek: 7200 },
}

// Die drei Längen zur Auswahl (in Sekunden)
const LAENGEN = {
  kurz: { min: 240, max: 660 },     // ~5–10 Minuten
  mittel: { min: 600, max: 960 },   // ~10–15 Minuten
  lang: { min: 900, max: 7200 },    // über 15 Minuten
}

app.get('/api/search', async (req, res) => {
  const q = (req.query.q || '').trim()
  const niveau = NIVEAU_SUCHE[req.query.niveau] ? req.query.niveau : null
  const laenge = LAENGEN[req.query.laenge] ?? null
  // Bei der Songsuche wollen wir Musik statt Erklärvideos
  const nurMusik = req.query.nurMusik === '1'
  if (!q) return res.status(400).json({ error: 'Kein Suchbegriff.' })
  try {
    // Deutsche Eingabe ins Russische übersetzen, damit auch russische
    // Videos gefunden werden ("gesunde Ernährung" -> "здоровое питание").
    // Steht dort schon Russisches, ändert die Übersetzung praktisch nichts.
    let suchbegriff = q
    // Ob das geklappt hat, wird weiter unten mitgeschickt. Vorher fiel
    // die Suche hier STILL auf den deutschen Begriff zurück, während
    // über der Trefferliste weiter "russische Videos" stand – genau
    // deshalb blieb der Google-Ausfall wochenlang unbemerkt.
    let uebersetzungGelang = true
    try {
      const russisch = await uebersetzeWort(q, 'de-ru')
      if (russisch) suchbegriff = russisch
      else uebersetzungGelang = false
    } catch (fehler) {
      console.error('Suchbegriff übersetzen:', fehler.message)
      uebersetzungGelang = false
    }

    // Beim Niveau helfen zusätzliche Suchwörter: "para principiantes"
    // findet andere Videos als "podcast debate".
    if (niveau && NIVEAU_SUCHE[niveau].zusatz) {
      suchbegriff += ' ' + NIVEAU_SUCHE[niveau].zusatz
    }

    // Songsuche: "letra" (Songtext) findet die Fassungen mit
    // eingeblendetem Text – genau die, bei denen auch Untertitel
    // vorhanden sind und die sich zum Mitlesen eignen.
    if (nurMusik) suchbegriff = `${suchbegriff} песня текст караоке`

    // Großzügig suchen: Einbettbarkeit, Länge und Niveau sieben kräftig aus
    const out = await runYtDlp([
      `ytsearch25:${suchbegriff}`,
      '--flat-playlist',
      '-J',
      '--no-warnings',
    ])
    const data = JSON.parse(out)
    const alle = (data.entries || [])
      .filter((e) => e.id && e.title)
      // Nach gewünschter Länge sieben; ohne Auswahl gilt nur die
      // Obergrenze des Niveaus, damit nichts Endloses dabei ist
      .filter((e) => {
        const dauer = e.duration || 0
        // Songs sind kurz: alles über 10 Minuten ist eher ein Mix
        if (nurMusik) return dauer >= 60 && dauer <= 600
        if (laenge) return dauer >= laenge.min && dauer <= laenge.max
        if (niveau) return dauer > 0 && dauer <= NIVEAU_SUCHE[niveau].maxSek
        return true
      })
      .map((e) => ({
        videoId: e.id,
        title: e.title,
        channel: e.channel || e.uploader || '',
        duration: e.duration || 0,
        thumbnail: `https://i.ytimg.com/vi/${e.id}/mqdefault.jpg`,
      }))

    // Alle parallel prüfen und nur einbettbare behalten
    const checks = await Promise.all(alle.map((v) => istEinbettbar(v.videoId)))
    let brauchbar = alle.filter((_, i) => checks[i])

    // Bei Songs zusaetzlich: nur Videos MIT Untertiteln. Ein Song
    // ohne Text ist fuer uns wertlos – und der Versuch, ihn zu
    // oeffnen, geht ueber den kostenpflichtigen Dienst.
    if (nurMusik) {
      const mitText = await mitUntertiteln(brauchbar.map((v) => v.videoId))
      if (mitText) {
        const gefiltert = brauchbar.filter((v) => mitText.has(v.videoId))
        console.log(`[suche] ${gefiltert.length} von ${brauchbar.length} Songs haben Untertitel`)
        // Wenn gar nichts uebrig bleibt, lieber die ungefilterten
        // zeigen als eine leere Liste
        if (gefiltert.length > 0) brauchbar = gefiltert
      }
    }

    res.json({
      results: brauchbar.slice(0, 10),
      suchbegriff,
      // Nur gesetzt, wenn wirklich etwas schiefging – die App zeigt
      // den Satz dann über der Trefferliste. Lieber zugeben, dass
      // etwas fehlt, als deutsche Videos als russische auszugeben.
      hinweis: uebersetzungGelang
        ? null
        : 'Der Suchbegriff konnte nicht ins Russische übersetzt werden – ' +
          'die Treffer sind deshalb vielleicht nicht russisch.',
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Suche fehlgeschlagen.' })
  }
})

// Die häufigsten russischen Füllwörter, die kein Lernender einzeln üben muss
const STOPWORDS = new Set(
  `и в во не что он на я с со как а то все она так его но да ты к у же вы за бы по только ее мне было вот от меня еще нет о из ему теперь когда даже ну вдруг ли если уже или ни быть был него до вас нибудь опять уж вам ведь там потом себя ничего ей может они тут где есть надо ней для мы тебя их чем была сам чтоб без будто чего раз тоже себе под будет ж тогда кто этот того потому этого какой совсем ним здесь этом один почти мой тем чтобы нее сейчас были куда зачем всех никогда можно при наконец два об другой хоть после над больше тот через эти нас про всего них какая много разве три эту моя впрочем хорошо свою этой перед иногда лучше чуть том нельзя такой им более всегда конечно всю между это`.split(/\s+/)
)

// Erstellt Vokabel-Vorschläge aus einem Transkript.
// Mit ANTHROPIC_API_KEY: Claude wählt die nützlichsten Wörter aus.
// Ohne: Häufigkeits-Analyse + automatische Übersetzung.
app.post('/api/generate-vocab', async (req, res) => {
  const text = (req.body.text || '').slice(0, 8000)
  // "exclude" sind die Wörter, die der Nutzer schon gesammelt hat
  const bekannt = Array.isArray(req.body.exclude) ? req.body.exclude : []
  if (!text.trim()) return res.status(400).json({ error: 'Kein Text übergeben.' })

  const tuerV = await kiTuersteher(req, res, 'ki')
  if (!tuerV) return

  try {
    const vokabeln = await erzeugeVideoVokabeln(text, bekannt)
    await zaehleNutzung(tuerV.nutzer.id, 'ki')
    res.json({ quelle: 'ki', vokabeln })
  } catch (err) {
    console.error('Video-Vokabeln:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Übersetzt viele Transkript-Zeilen auf einmal ins Deutsche.
//
// Die Arbeit steckt in server/uebersetzen.js. Dort sieht das Modell
// das ganze Paket auf einmal und trifft dadurch den Bezug, den eine
// Zeile-für-Zeile-Übersetzung verfehlt.
app.post('/api/translate-batch', async (req, res) => {
  const lines = Array.isArray(req.body.lines) ? req.body.lines.slice(0, 500) : []
  if (lines.length === 0) return res.status(400).json({ error: 'Keine Zeilen übergeben.' })

  try {
    const uebersetzungen = await uebersetzeZeilen(lines)
    res.json({ uebersetzungen })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: err.message || 'Übersetzung fehlgeschlagen.' })
  }
})

// Satzliste mit KI erstellen – das Gegenstück zu /api/vokabelliste.
//
// Zwei Vorgaben sind möglich und lassen sich kombinieren: ein Thema
// ("Reisen") und eine Grammatikform ("instrumental"). Ohne beides
// schaut die KI auf die bisherigen Sätze und ergänzt passend.
app.post('/api/saetze', async (req, res) => {
  const thema = (req.body.thema || '').trim().slice(0, 80)
  const grammatik = GRAMMATIK[req.body.grammatik] ? req.body.grammatik : ''
  const bekannt = Array.isArray(req.body.bekannt) ? req.body.bekannt : []

  // Ohne jede Vorgabe braucht das Modell etwas, woran es sich
  // orientieren kann – sonst käme beliebiges Zeug zurück.
  if (!thema && !grammatik && bekannt.length < 5) {
    return res.status(400).json({
      error: 'Wähle ein Thema oder eine Form – dann lege ich los.',
    })
  }

  const tuerS = await kiTuersteher(req, res, 'ki')
  if (!tuerS) return

  try {
    const liste = await erzeugeSatzliste(thema, grammatik, bekannt)
    await zaehleNutzung(tuerS.nutzer.id, 'ki')
    res.json(liste)
  } catch (err) {
    console.error('Satzliste:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Kurzer zweisprachiger Wissenstext zum mehrmaligen Lesen.

/**
 * Türsteher für alles, was KI-Geld kostet.
 *
 * Bis zum 30.10.2026 standen /api/vokabelliste und /api/lesetext
 * offen: keine Anmeldung, keine Grenze. Der Zähler lag allein in
 * src/limits.js, also im Browser – Konsole auf, localStorage
 * geleert, und das Kontingent war zurück. Wer die Adresse kannte,
 * konnte beliebig viele OpenAI-Anfragen auf unsere Rechnung
 * auslösen.
 *
 * @returns {Promise<{nutzer}|null>} null heißt: Es wurde schon
 *   geantwortet, der Aufrufer soll aufhören.
 */
async function kiTuersteher(req, res, art) {
  const nutzer = await nutzerAusToken(req.headers.authorization?.replace('Bearer ', ''))
  if (!nutzer) {
    res.status(401).json({ error: 'Bitte zuerst anmelden.' })
    return null
  }
  // Premium kennt keine Grenze.
  if (await istPremium(nutzer.id)) return { nutzer }

  const heute = await nutzungHeute(nutzer.id, art)
  if (heute >= KI_PRO_TAG) {
    res.status(402).json({
      error: 'limit',
      nachricht:
        `Du hast heute ${KI_PRO_TAG} Mal die KI genutzt. ` +
        `Neues Kontingent gibt es ${naechsteAuffuellung()} – oder sofort mit Premium.`,
    })
    return null
  }
  return { nutzer }
}

app.post('/api/lesetext', async (req, res) => {
  const gebiet = GEBIETE[req.body?.gebiet] ? req.body.gebiet : ''
  const thema = (req.body?.thema || '').trim().slice(0, 600)
  const stufe = ['a2', 'b1', 'b2'].includes(req.body?.stufe) ? req.body.stufe : 'b1'
  const bekannt = Array.isArray(req.body?.bekannt) ? req.body.bekannt : []

  const tuer = await kiTuersteher(req, res, 'ki')
  if (!tuer) return

  try {
    const text = await erzeugeLesetext(gebiet, thema, stufe, bekannt)
    // Erst nach Erfolg verbuchen – ein Fehlversuch soll nicht aufs
    // Kontingent gehen.
    await zaehleNutzung(tuer.nutzer.id, 'ki')
    res.json(text)
  } catch (err) {
    console.error('Lesetext:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Erstellt eine Vokabelliste zu einem frei gewählten Thema (nur mit KI).
app.post('/api/vokabelliste', async (req, res) => {
  const thema = (req.body.thema || '').trim().slice(0, 80)
  // Die schon gesammelten Wörter: verhindern Dopplungen und verraten
  // dem Modell, auf welchem Stand die Person ist.
  const bekannt = Array.isArray(req.body.bekannt) ? req.body.bekannt : []
  const anzahl = req.body.anzahl

  // Ohne Thema wählt die KI selbst – dafür braucht sie aber Wörter,
  // an denen sie sich orientieren kann.
  if (!thema && bekannt.length < 5) {
    return res.status(400).json({
      error: 'Sammle erst ein paar Wörter, dann kann ich dir passende Vorschläge machen.',
    })
  }

  const tuer = await kiTuersteher(req, res, 'ki')
  if (!tuer) return

  try {
    const wortart = ['verben', 'adjektive', 'nomen'].includes(req.body.wortart) ? req.body.wortart : 'alle'
    const ergebnis = await erzeugeVokabelliste(thema, bekannt, anzahl, wortart)
    await zaehleNutzung(tuer.nutzer.id, 'ki')
    res.json(ergebnis)
  } catch (err) {
    console.error('Vokabelliste:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Erstellt eine Blinkist-artige Buchzusammenfassung in einfachem Spanisch.
// Braucht die Claude-KI – ohne API-Schlüssel kommt ein "Premium"-Hinweis.
app.post('/api/buch', async (req, res) => {
  const titel = (req.body.titel || '').trim().slice(0, 120)
  if (!titel) return res.status(400).json({ error: 'Kein Buchtitel angegeben.' })
  if (!anthropic) return res.status(402).json({ error: 'premium' })

  // Buchzusammenfassungen laufen ueber Anthropic und sind von allem
  // hier das Teuerste. Ohne Anmeldung geht gar nichts.
  const tuerB = await kiTuersteher(req, res, 'ki')
  if (!tuerB) return

  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-5',
      max_tokens: 16000,
      output_config: {
        format: {
          type: 'json_schema',
          schema: {
            type: 'object',
            properties: {
              titel: { type: 'string' },
              autor: { type: 'string' },
              niveau: { type: 'string' },
              absaetze: {
                type: 'array',
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
              vokabeln: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    wort: { type: 'string' },
                    uebersetzung: { type: 'string' },
                  },
                  required: ['wort', 'uebersetzung'],
                  additionalProperties: false,
                },
              },
            },
            required: ['titel', 'autor', 'niveau', 'absaetze', 'vokabeln'],
            additionalProperties: false,
          },
        },
      },
      messages: [
        {
          role: 'user',
          content:
            `Erstelle eine Blinkist-artige Zusammenfassung des Buches "${titel}" für deutschsprachige Russisch-Anfänger (Niveau A2): ` +
            '5 bis 7 kurze Absätze in EINFACHEM Russisch (kurze Sätze, Grundwortschatz), jeder Absatz mit deutscher Übersetzung. ' +
            'Schreibe ausschließlich in kyrillischer Schrift, niemals in Umschrift, und setze keine Betonungszeichen. ' +
            'Dazu 8 nützliche russische Vokabeln aus der Zusammenfassung mit deutscher Übersetzung. ' +
            'Kennst du das Buch nicht sicher, sage das im ersten Absatz ehrlich und fasse zusammen, wofür der Titel bekannt ist.',
        },
      ],
    })
    const textBlock = response.content.find((b) => b.type === 'text')
    res.json(JSON.parse(textBlock.text))
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Zusammenfassung konnte nicht erstellt werden.' })
  }
})

// ============================================================
//  Bilinguale E-Books
// ============================================================

// Wie viele Bücher darf der Nutzer diesen Monat noch erzeugen?
app.get('/api/ebook/kontingent', async (req, res) => {
  try {
    const nutzer = await nutzerAusToken(req.headers.authorization?.replace('Bearer ', ''))
    if (!nutzer) return res.status(401).json({ error: 'Bitte zuerst anmelden.' })

    const genutzt = await anzahlDiesenMonat(nutzer.id)
    res.json({ genutzt, frei: Math.max(0, FREI_PRO_MONAT - genutzt), gesamt: FREI_PRO_MONAT })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Kontingent konnte nicht geprüft werden.' })
  }
})

// Ein neues E-Book erzeugen
app.post('/api/ebook', async (req, res) => {
  const thema = (req.body?.thema || '').trim()
  const niveau = req.body?.niveau || 'A2'

  if (!thema) return res.status(400).json({ error: 'Bitte gib ein Thema an.' })

  try {
    const nutzer = await nutzerAusToken(req.headers.authorization?.replace('Bearer ', ''))
    if (!nutzer) return res.status(401).json({ error: 'Bitte zuerst anmelden.' })

    // Freemium-Grenze prüfen
    const genutzt = await anzahlDiesenMonat(nutzer.id)
    if (genutzt >= FREI_PRO_MONAT) {
      return res.status(402).json({
        error: 'premium',
        nachricht:
          `Du hast diesen Monat schon ${FREI_PRO_MONAT} E-Books erstellt. ` +
          'Mit Premium sind es unbegrenzt viele.',
      })
    }

    const buch = await erzeugeEbook(thema, niveau)
    const gespeichert = await speichereEbook(nutzer.id, buch)

    res.json({ buch: gespeichert, frei: Math.max(0, FREI_PRO_MONAT - genutzt - 1) })
  } catch (err) {
    console.error('E-Book:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Spotify-Künstler durch die KI filtern: Wer singt auf Russisch?
app.post('/api/spotify/interpreten', async (req, res) => {
  try {
    const kuenstler = req.body?.kuenstler ?? []
    const ergebnis = await findeRussischeInterpreten(kuenstler)

    // Songs aus der Bibliothek des Nutzers uebernehmen …
    const ausBibliothek = new Map(kuenstler.map((k) => [k.name, k.songs ?? []]))
    for (const i of ergebnis.interpreten) {
      i.songs = (ausBibliothek.get(i.name) ?? []).slice(0, 5)
    }

    // … und wo weniger als 3 zusammenkommen, von der KI auffuellen.
    // Spotifys Katalog-Abfragen stehen uns nicht mehr offen.
    const duenn = ergebnis.interpreten.filter((i) => i.songs.length < 3).map((i) => i.name)
    if (duenn.length) {
      try {
        const { interpreten: vorschlaege } = await ergaenzeSongs(duenn)
        const nachName = new Map(vorschlaege.map((v) => [v.name, v.songs]))
        for (const i of ergebnis.interpreten) {
          if (i.songs.length >= 3) continue
          const bekannt = new Set(i.songs.map((s) => s.titel.toLowerCase()))
          for (const titel of nachName.get(i.name) ?? []) {
            if (i.songs.length >= 5) break
            if (bekannt.has(titel.toLowerCase())) continue
            i.songs.push({ titel, ausKi: true })
          }
        }
      } catch (fehler) {
        console.error('[interpreten] Songs ergaenzen fehlgeschlagen:', fehler.message)
      }
    }
    res.json(ergebnis)
  } catch (fehler) {
    res.status(500).json({ error: fehler.message })
  }
})

// ---------- Bezahlung ----------
// Sagt der App, ob Bezahlen ueberhaupt eingerichtet ist.
app.get('/api/bezahlung/status', async (req, res) => {
  if (!stripeBereit()) return res.json({ bereit: false })

  // Der öffentliche Schlüssel ist nicht geheim – er steht in jeder
  // Stripe-Einbindung im Quelltext. Er kommt trotzdem vom Server und
  // nicht aus dem Build: So passt derselbe Build zu Test- und
  // Echtbetrieb, und ein Wechsel braucht keinen neuen Build.
  const antwort = {
    bereit: true,
    schluessel: process.env.STRIPE_PUBLIC_KEY || null,
  }
  try {
    const preise = await holePreise()
    res.json({ ...antwort, preis: preise.monat ?? null, preise })
  } catch (fehler) {
    // Bezahlen geht, nur der Preis liess sich nicht laden
    res.json({ ...antwort, preis: null, hinweis: fehler.message })
  }
})

// Bezahlvorgang starten. Die Nutzer-Kennung nehmen wir NICHT aus der
// Anfrage, sondern aus dem geprueften Anmelde-Token – sonst koennte
// jemand ein Abo auf ein fremdes Konto buchen.
app.post('/api/bezahlung/start', async (req, res) => {
  try {
    const token = (req.headers.authorization || '').replace('Bearer ', '')
    const nutzer = await nutzerAusToken(token)
    if (!nutzer) return res.status(401).json({ error: 'Bitte zuerst anmelden.' })

    const herkunft = req.body?.herkunft || 'https://davaigo.de'
    // 'elements' = Formular in der App (Standard), 'hosted' = Stripe-Seite
    const art = req.body?.art === 'hosted' ? 'hosted' : 'elements'
    const tarif = ['monat', 'jahr', 'lifetime'].includes(req.body?.tarif) ? req.body.tarif : 'monat'
    res.json(await starteBezahlung(nutzer.id, nutzer.email, herkunft, art, tarif))
  } catch (fehler) {
    res.status(500).json({ error: fehler.message })
  }
})

// Stripes eigene Verwaltungsseite (kuendigen, Zahlungsart aendern)
app.post('/api/bezahlung/verwalten', async (req, res) => {
  try {
    const token = (req.headers.authorization || '').replace('Bearer ', '')
    const nutzer = await nutzerAusToken(token)
    if (!nutzer) return res.status(401).json({ error: 'Bitte zuerst anmelden.' })

    const url = await verwaltungsLink(nutzer.id, req.body?.herkunft || 'https://davaigo.de')
    res.json({ url })
  } catch (fehler) {
    res.status(500).json({ error: fehler.message })
  }
})

// Konto endgueltig loeschen. Apple und Google verlangen das von
// jeder App, in der man sich registrieren kann.
app.post('/api/konto/loeschen', async (req, res) => {
  try {
    const token = (req.headers.authorization || '').replace('Bearer ', '')
    const nutzer = await nutzerAusToken(token)
    if (!nutzer) return res.status(401).json({ error: 'Bitte zuerst anmelden.' })

    const ergebnis = await loescheKonto(nutzer)
    console.log('[konto] geloescht:', nutzer.id, JSON.stringify(ergebnis))
    res.json(ergebnis)
  } catch (fehler) {
    res.status(500).json({ error: fehler.message })
  }
})


// ============================================================
//  Sprechen mit Dascha – der KI-Tutor
// ============================================================

app.post('/api/gespraech', async (req, res) => {
  const verlauf = Array.isArray(req.body.verlauf) ? req.body.verlauf : null
  if (!verlauf || verlauf.length === 0) {
    return res.status(400).json({ error: 'Kein Gespraechsverlauf uebergeben.' })
  }
  // Der letzte Zug MUSS vom Nutzer sein – sonst antwortet der Tutor
  // auf sich selbst.
  if (verlauf[verlauf.length - 1].rolle !== 'ich') {
    return res.status(400).json({ error: 'Zuletzt ist der Nutzer dran.' })
  }

  try {
    // Anmeldung ist Pflicht – nur so laesst sich das Tageslimit pro
    // Konto fuehren.
    const nutzer = await nutzerAusToken(req.headers.authorization?.replace('Bearer ', ''))
    if (!nutzer) return res.status(401).json({ error: 'Bitte zuerst anmelden.' })

    // Das Limit gilt nur fuer Gratis-Nutzer. Erst pruefen, dann
    // antworten: Ein Aufruf, der ohnehin abgelehnt wird, soll kein
    // OpenAI-Geld kosten.
    const premium = await istPremium(nutzer.id)
    if (!premium) {
      const heute = await tutorNutzungHeute(nutzer.id)
      if (heute >= GESPRAECHE_PRO_TAG) {
        return res.status(402).json({
          error: 'limit',
          nachricht:
            `Du hast heute ${GESPRAECHE_PRO_TAG} Nachrichten geschrieben. ` +
            'Morgen geht es weiter – oder unbegrenzt mit Premium.',
        })
      }
    }

    const niveau = (req.body.niveau || 'Anfaenger').toString().slice(0, 40)
    const antwortObj = await antworte(verlauf, niveau)

    // Erst nach erfolgreicher Antwort verbuchen.
    let frei = null
    if (!premium) {
      const genutzt = await zaehleTutorNutzung(nutzer.id)
      frei = Math.max(0, GESPRAECHE_PRO_TAG - genutzt)
    }
    res.json({ ...antwortObj, frei })
  } catch (err) {
    console.error('Gespraech:', err.message)
    res.status(500).json({ error: 'Der Tutor antwortet gerade nicht. Bitte spaeter erneut.' })
  }
})


// ============================================================
//  Mails rund um Freunde und Meldungen
// ============================================================

// "X moechte mit dir lernen." Die Adresse des Empfaengers holt der
// Server selbst - sie kommt nie in den Browser.
app.post('/api/freunde/melden', async (req, res) => {
  try {
    if (!mailBereit()) return res.json({ gesendet: false, grund: 'kein-smtp' })

    const token = (req.headers.authorization || '').replace('Bearer ', '')
    const nutzer = token ? await nutzerAusToken(token).catch(() => null) : null
    if (!nutzer) return res.status(401).json({ error: 'Nicht angemeldet.' })

    const kopf = {
      apikey: process.env.SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
    }
    const basis = `${process.env.SUPABASE_URL}/rest/v1`

    // Gibt es die offene Anfrage wirklich, und ist sie von diesem Nutzer?
    // Ohne diese Pruefung koennte jemand ueber den Endpunkt beliebige
    // Leute anschreiben lassen.
    const a = await fetch(
      `${basis}/freunde?select=an&von=eq.${nutzer.id}&status=eq.offen&order=erstellt_am.desc&limit=1`,
      { headers: kopf }
    )
    const anfrage = (await a.json())[0]
    if (!anfrage) return res.json({ gesendet: false, grund: 'keine-anfrage' })

    // Name des Anfragenden – der steht in der Mail
    const p = await fetch(`${basis}/profile?select=benutzername&id=eq.${nutzer.id}`, {
      headers: kopf,
    })
    const von = (await p.json())[0]?.benutzername || 'Jemand'

    // Adresse des Empfaengers – nur hier, nie im Browser
    const u = await fetch(`${process.env.SUPABASE_URL}/auth/v1/admin/users/${anfrage.an}`, {
      headers: kopf,
    })
    const ziel = (await u.json())?.email
    if (!ziel) return res.json({ gesendet: false, grund: 'keine-adresse' })

    const adresse = (req.body?.herkunft || 'https://davaigo.de').replace(/\/$/, '')
    const ok = await schicke({ an: ziel, ...freundschaftsanfrage({ von, adresse }) })
    res.json({ gesendet: ok })
  } catch (fehler) {
    console.error('Freundesmail:', fehler.message)
    res.json({ gesendet: false })
  }
})

// Eine Meldung steht in der Tabelle "meldungen" – und geht
// zusaetzlich per Mail raus. Eine Meldung, die niemand liest, waere
// keine.
app.post('/api/meldung', async (req, res) => {
  try {
    const token = (req.headers.authorization || '').replace('Bearer ', '')
    const nutzer = token ? await nutzerAusToken(token).catch(() => null) : null
    if (!nutzer) return res.status(401).json({ error: 'Nicht angemeldet.' })

    const { wen, grund, bemerkung } = req.body || {}
    if (!wen || !grund) return res.status(400).json({ error: 'Unvollstaendig.' })

    if (!mailBereit()) return res.json({ gesendet: false, grund: 'kein-smtp' })

    const kopf = {
      apikey: process.env.SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
    }
    const p = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/profile?select=benutzername&id=eq.${nutzer.id}`,
      { headers: kopf }
    )
    const melder = (await p.json())[0]?.benutzername || nutzer.email || 'unbekannt'

    const GRUND_TEXT = {
      bild: 'Anstoessiges Profilbild',
      name: 'Anstoessiger Benutzername',
      belaestigung: 'Belaestigung',
      spam: 'Spam oder Werbung',
      anderes: 'Etwas anderes',
    }

    const ok = await schicke({
      an: process.env.MELDUNGEN_AN || 'lernen@davaigo.de',
      betreff: `Meldung: ${String(wen).slice(0, 40)} (${GRUND_TEXT[grund] || grund})`,
      text:
        `${melder} hat ${wen} gemeldet.\n\n` +
        `Grund: ${GRUND_TEXT[grund] || grund}\n` +
        (bemerkung ? `Bemerkung: ${String(bemerkung).slice(0, 500)}\n` : '') +
        `\nDie Meldung steht in der Tabelle "meldungen" (Stand: offen).\n` +
        `Profil ansehen: https://davaigo.de\n`,
    })
    res.json({ gesendet: ok })
  } catch (fehler) {
    console.error('Meldung:', fehler.message)
    res.json({ gesendet: false })
  }
})

app.listen(PORT, () => console.log(`Transkript-Server läuft auf http://localhost:${PORT}`))
