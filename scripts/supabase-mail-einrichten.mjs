// Richtet den Mailversand von Supabase Auth ein – ohne Klicken.
//
// Aufruf:  node scripts/supabase-mail-einrichten.mjs             (zeigt nur, was es tun würde)
//          node scripts/supabase-mail-einrichten.mjs --los       (schreibt wirklich)
//          node scripts/supabase-mail-einrichten.mjs --test EMAIL (schickt eine echte Passwort-Mail)
//
// Braucht in .env.local:
//   SUPABASE_ACCESS_TOKEN  – persönlicher Token (supabase.com → Account → Access Tokens)
//   SUPABASE_URL, SUPABASE_ANON_KEY
//   SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / SMTP_ABSENDER
//
// Warum ein Skript und kein Klicken: Die Mail-Einstellungen liegen
// hinter der Management-API, nicht hinter dem Projekt-Schlüssel. Mit
// dem Token lassen sich Vorlagen, SMTP und Rückkehr-Adressen in einem
// Rutsch setzen – und vor allem NACHLESEN, was wirklich gespeichert
// ist. Genau das fehlte bei Habloo stundenlang: Das Formular zeigte
// das eine, gespeichert war das andere (site_url stand auf
// http://localhost:3000), und niemand konnte es sehen.

import { readFileSync } from 'node:fs'

for (const z of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = z.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
}

const TOKEN = process.env.SUPABASE_ACCESS_TOKEN
const REF = (process.env.SUPABASE_URL ?? '').match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1]
if (!TOKEN) { console.error('SUPABASE_ACCESS_TOKEN fehlt in .env.local'); process.exit(1) }
if (!REF) { console.error('SUPABASE_URL fehlt oder sieht falsch aus'); process.exit(1) }

const API = `https://api.supabase.com/v1/projects/${REF}/config/auth`
const KOPF = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }
const los = process.argv.includes('--los')
const testAn = process.argv.includes('--test') ? process.argv[process.argv.indexOf('--test') + 1] : null

const vorlage = (name) => readFileSync(`docs/email/${name}`, 'utf8')

// Was gesetzt werden soll – die Feldnamen sind die der Management-API.
const GEWUENSCHT = {
  // Rückkehr-Adressen. Ohne die fällt Supabase still auf die alte
  // Site URL zurück – bei Davaigo stand die auf http://localhost:3000,
  // weshalb jeder Bestätigungslink ins Leere zeigte.
  site_url: 'https://davaigo.de',
  uri_allow_list: 'https://davaigo.de,https://davaigo.de/**,https://www.davaigo.de/**',

  // Mail-Bestätigung bei der Registrierung AN. Steht das auf true,
  // gilt jeder sofort als bestätigt, ohne je eine Mail gesehen zu
  // haben – dann fällt auch nicht auf, wenn keine ankommt.
  mailer_autoconfirm: false,

  // SMTP über das All-Inkl-Postfach lernen@davaigo.de
  external_email_enabled: true,
  smtp_admin_email: process.env.SMTP_USER,
  smtp_sender_name: process.env.SMTP_ABSENDER || 'Davaigo',
  smtp_host: process.env.SMTP_HOST,
  smtp_user: process.env.SMTP_USER,
  // Sekunden zwischen zwei Mails an dieselbe Adresse. Wichtig beim
  // Testen: Ein Nachtest innerhalb dieser Zeit zeigt nichts Neues –
  // Supabase antwortet 429 und schickt trotzdem die alte Mail.
  smtp_max_frequency: 60,
  // Ab Werk lässt Supabase nur zwei Mails pro Stunde durch, weil der
  // Standardabsender geteilt ist. Mit eigenem Postfach ist das unnötig.
  rate_limit_email_sent: 100,

  // Die vier Vorlagen im Davaigo-Design
  mailer_subjects_confirmation: 'Willkommen bei Davaigo – bestätige deine Adresse',
  mailer_templates_confirmation_content: vorlage('1-registrierung-bestaetigen.html'),
  mailer_subjects_magic_link: 'Dein Anmeldelink für Davaigo',
  mailer_templates_magic_link_content: vorlage('2-anmeldelink.html'),
  mailer_subjects_recovery: 'Neues Passwort für Davaigo',
  mailer_templates_recovery_content: vorlage('3-passwort-zuruecksetzen.html'),
  mailer_subjects_email_change: 'Bestätige deine neue E-Mail-Adresse',
  mailer_templates_email_change_content: vorlage('4-adresse-aendern.html'),
}

// ---- 1. Lesen, was gerade gilt ----
const aktuellAntwort = await fetch(API, { headers: KOPF })
if (!aktuellAntwort.ok) {
  console.error(`Konfig nicht lesbar: HTTP ${aktuellAntwort.status} – ${(await aktuellAntwort.text()).slice(0, 200)}`)
  console.error('Stimmt der Token? Hat er Zugriff auf dieses Projekt?')
  process.exit(1)
}
const aktuell = await aktuellAntwort.json()

console.log(`Projekt ${REF} – Stand der Mail-Einstellungen:\n`)
const zeige = (k, v) => console.log(`  ${k.padEnd(42)} ${v}`)
zeige('site_url', aktuell.site_url)
zeige('uri_allow_list', aktuell.uri_allow_list || '(leer)')
zeige('mailer_autoconfirm (Bestätigung AUS?)', aktuell.mailer_autoconfirm)
zeige('smtp_host', aktuell.smtp_host || '(leer)')
zeige('smtp_port', aktuell.smtp_port || '(leer)')
zeige('smtp_user', aktuell.smtp_user || '(leer)')
zeige('smtp_pass gesetzt?', aktuell.smtp_pass ? `ja (${String(aktuell.smtp_pass).length} Zeichen)` : 'NEIN')
zeige('smtp_admin_email', aktuell.smtp_admin_email || '(leer)')
zeige('Mails pro Stunde', aktuell.rate_limit_email_sent ?? '(unbekannt)')
zeige('Betreff Bestätigung', aktuell.mailer_subjects_confirmation)
zeige('Betreff Passwort', aktuell.mailer_subjects_recovery)
zeige('Vorlage Bestätigung (Zeichen)', (aktuell.mailer_templates_confirmation_content ?? '').length)

// Passwort nur nachtragen, wenn in Supabase keins liegt. Es kommt
// verschlüsselt zurück und ist deshalb nie "gleich" – ein blinder
// Vergleich würde es bei jedem Lauf neu schreiben.
if (!aktuell.smtp_pass) GEWUENSCHT.smtp_pass = process.env.SMTP_PASS
// Port ebenso: Was gespeichert ist und nachweislich sendet, bleibt.
if (!aktuell.smtp_port) GEWUENSCHT.smtp_port = String(process.env.SMTP_PORT)

// ---- 2. Unterschiede ----
const aenderungen = Object.entries(GEWUENSCHT).filter(([k, v]) => String(aktuell[k] ?? '') !== String(v ?? ''))
console.log(`\n${aenderungen.length} Feld(er) weichen ab:`)
for (const [k] of aenderungen) console.log('  - ' + k)

if (!los && !testAn) {
  console.log('\nProbelauf. Mit --los wird geschrieben, mit --test EMAIL eine echte Mail verschickt.')
  process.exit(0)
}

// ---- 3. Schreiben ----
if (los && aenderungen.length) {
  const r = await fetch(API, { method: 'PATCH', headers: KOPF, body: JSON.stringify(Object.fromEntries(aenderungen)) })
  if (!r.ok) { console.error(`Schreiben fehlgeschlagen: HTTP ${r.status} – ${(await r.text()).slice(0, 300)}`); process.exit(1) }
  // Kurz warten vor der Gegenprobe. Die Management-API bestätigt den
  // Schreibvorgang sofort, liefert beim unmittelbar folgenden Lesen
  // aber noch den alten Stand – das sah aus, als wäre nichts
  // angekommen, obwohl alles gespeichert war.
  console.log('\nGeschrieben. Gegenprobe in drei Sekunden …')
  await new Promise((f) => setTimeout(f, 3000))
  const nachher = await (await fetch(API, { headers: KOPF })).json()
  const nochAnders = Object.entries(GEWUENSCHT).filter(
    ([k, v]) => String(nachher[k] ?? '') !== String(v ?? '') && k !== 'smtp_pass'
  )
  console.log(nochAnders.length ? '  NOCH ANDERS: ' + nochAnders.map(([k]) => k).join(', ') : '  alles wie gewünscht.')
}

// ---- 4. Echte Test-Mail ----
if (testAn) {
  const B = process.env.SUPABASE_URL
  const r = await fetch(`${B}/auth/v1/recover`, {
    method: 'POST',
    headers: { apikey: process.env.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testAn, options: { redirectTo: 'https://davaigo.de' } }),
  })
  console.log(`\nTest-Mail an ${testAn}: HTTP ${r.status} ${r.status === 200 ? '– raus, schau ins Postfach' : '– ' + (await r.text()).slice(0, 200)}`)
  console.log('(Geht nur, wenn es zu dieser Adresse ein Davaigo-Konto gibt.)')
}
