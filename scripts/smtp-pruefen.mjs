// Prüft, ob die SMTP-Zugangsdaten aus .env.local wirklich gelten.
//
//     node scripts/smtp-pruefen.mjs
//
// Warum das nützlich ist: Supabase verschickt die Anmeldemails, nicht
// unser Server. Stimmt das Passwort nicht, scheitert der Versand
// STILL – der Nutzer sieht "Schau in dein Postfach", und dort kommt
// nie etwas an. Supabase zeigt den SMTP-Fehler nirgends an.
//
// Der Ablauf hier ist der einer echten Anmeldung, hört aber nach dem
// AUTH auf: kein MAIL FROM, kein RCPT TO, kein DATA. Es wird also
// nichts verschickt und niemand bekommt eine Testmail.

import net from 'node:net'
import tls from 'node:tls'
import { readFileSync } from 'node:fs'

for (const z of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = z.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
}
const { SMTP_HOST: HOST, SMTP_PORT: PORT, SMTP_USER: USER, SMTP_PASS: PASS } = process.env

function gespraech(sock) {
  let puffer = ''
  const warten = () => new Promise((fertig) => {
    const lauscher = (d) => {
      puffer += d.toString()
      if (/^\d{3} .*\r\n$/m.test(puffer)) {
        sock.off('data', lauscher)
        const antwort = puffer; puffer = ''
        fertig(antwort.trim())
      }
    }
    sock.on('data', lauscher)
  })
  return {
    warten,
    sag: (zeile) => { sock.write(zeile + '\r\n'); return warten() },
  }
}

const roh = net.connect(Number(PORT), HOST)
await new Promise((f, r) => { roh.once('connect', f); roh.once('error', r) })
let g = gespraech(roh)
console.log('  Begrüßung:  ', (await g.warten()).split('\n')[0])
console.log('  EHLO:       ', (await g.sag('EHLO davaigo.de')).split('\n').at(-1))
console.log('  STARTTLS:   ', await g.sag('STARTTLS'))

const sicher = tls.connect({ socket: roh, servername: HOST })
await new Promise((f, r) => { sicher.once('secureConnect', f); sicher.once('error', r) })
console.log('  verschlüsselt:', sicher.getProtocol(), '/', sicher.getCipher().name)

g = gespraech(sicher)
await g.sag('EHLO davaigo.de')
const auth = await g.sag('AUTH PLAIN ' + Buffer.from('\0' + USER + '\0' + PASS).toString('base64'))
console.log('  Anmeldung:  ', auth)
console.log(auth.startsWith('235')
  ? '\n  ✓ Passwort stimmt – Supabase kann über dieses Postfach verschicken.'
  : '\n  ✗ Anmeldung abgelehnt. Passwort oder Benutzername prüfen.')
sicher.write('QUIT\r\n')
sicher.end()
