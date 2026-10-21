// Erzeugt die Pflichtseiten als statisches HTML.
//
//     node scripts/baue-recht.mjs
//
// Warum das sein muss: Google verlangt für den Play Store eine
// öffentlich erreichbare Datenschutzerklärung. Davaigo ist eine
// Einzelseiten-Anwendung – unter /?recht=datenschutz steht die
// Erklärung zwar, aber erst nachdem ein Megabyte JavaScript gelaufen
// ist. Nachgemessen am 21.10.2026: ohne JavaScript kamen 43 Zeichen
// zurück, und das Wort "Datenschutz" war nicht darunter. Googles
// automatische Prüfung lädt oft ohne JavaScript, und genau daran
// scheitern Einreichungen regelmäßig.
//
// Jetzt liegt unter /datenschutz/ fertiges HTML. Kein Skript, kein
// Warten, für jeden Prüfer und jede Suchmaschine sofort lesbar.
//
// Der Text wird NICHT abgeschrieben. Vite übersetzt src/Recht.jsx für
// Node, React rendert die Komponenten einmal zu HTML, und das Ergebnis
// landet hier in einer Seitenhülle. Ändert jemand die Erklärung in der
// App, ändert sich die statische Seite beim nächsten Build mit.
//
// Dasselbe gilt für das Aussehen: Die .recht-Regeln werden aus
// src/App.css herausgelesen statt nachgebaut.

import { build } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const WURZEL = new URL('..', import.meta.url)
const TEMP = new URL('.recht-ssr/', WURZEL)

const SEITEN = {
  impressum: {
    titel: 'Impressum – Davaigo',
    beschreibung: 'Anbieterkennzeichnung nach § 5 DDG für davaigo.de.',
  },
  datenschutz: {
    titel: 'Datenschutzerklärung – Davaigo',
    beschreibung:
      'Welche Daten Davaigo verarbeitet, an wen sie weitergegeben werden und welche Rechte du hast.',
  },
  agb: {
    titel: 'AGB und Widerrufsrecht – Davaigo',
    beschreibung: 'Allgemeine Geschäftsbedingungen und Widerrufsbelehrung für Davaigo.',
  },
}

const e = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * Die .recht-Regeln aus App.css holen.
 *
 * Eine eigene Kopie wäre die zweite Stelle, an der dasselbe steht –
 * und die zweite, die jemand zu ändern vergisst.
 */
async function stilAusApp() {
  const css = await readFile(new URL('src/App.css', WURZEL), 'utf8')
  const regeln = []

  // Regeln auf oberster Ebene durchgehen. At-Regeln (Media Queries)
  // werden mitgenommen, wenn darin eine .recht-Klasse vorkommt.
  let i = 0
  let start = 0
  let tiefe = 0
  let selektor = ''
  while (i < css.length) {
    if (css[i] === '@' && tiefe === 0) {
      let j = i
      let t = 0
      while (j < css.length) {
        if (css[j] === '{') t++
        else if (css[j] === '}') {
          t--
          if (t === 0) break
        }
        j++
      }
      const block = css.slice(i, j + 1)
      if (/\.recht[-\s{:,]/.test(block)) regeln.push(block)
      i = j + 1
      start = i
      continue
    }
    if (css[i] === '{') {
      if (tiefe === 0) selektor = css.slice(start, i)
      tiefe++
    } else if (css[i] === '}') {
      tiefe--
      if (tiefe === 0) {
        if (/\.recht[-\s{:,.]|\.recht$/.test(selektor.trim() + ' ')) {
          regeln.push(css.slice(start, i + 1).trim())
        }
        start = i + 1
      }
    }
    i++
  }
  return regeln.join('\n')
}

function huelle({ titel, beschreibung, pfad, inhalt, stil }) {
  const adresse = 'https://davaigo.de' + pfad
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(titel)}</title>
<meta name="description" content="${e(beschreibung)}">
<link rel="canonical" href="${e(adresse)}">
<meta name="theme-color" content="#7c3aed">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon-2.png">
<meta property="og:type" content="article">
<meta property="og:title" content="${e(titel)}">
<meta property="og:description" content="${e(beschreibung)}">
<meta property="og:url" content="${e(adresse)}">
<meta property="og:locale" content="de_DE">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
:root{
  --primary:#7c3aed; --primary-dark:#6d28d9; --gold:#ffc800;
  --navy:#241338; --muted:#756a85; --bg:#f5f0fc; --card:#fff;
  --flaeche:#f5f2fa; --line:#ebe7f4;
}
*{box-sizing:border-box}
body{
  margin:0;background:var(--bg);color:var(--navy);
  font-family:'Nunito',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  font-size:17px;line-height:1.7;-webkit-font-smoothing:antialiased;
}
.kopf{
  display:flex;align-items:center;justify-content:space-between;gap:16px;
  max-width:760px;margin:0 auto;padding:16px 20px;
}
.marke{display:flex;align-items:center;gap:10px;font-weight:900;font-size:1.3rem;color:var(--navy);text-decoration:none}
.marke-zeichen{
  display:grid;place-items:center;width:38px;height:38px;border-radius:11px;
  background:linear-gradient(135deg,#ffd23f,var(--gold));color:var(--navy);
  font-size:1.4rem;font-weight:900;
}
.kopf-knopf{
  background:var(--primary);color:#fff;text-decoration:none;font-weight:800;
  padding:10px 20px;border-radius:12px;box-shadow:0 3px 0 var(--primary-dark);
}
.fuss{
  max-width:760px;margin:40px auto 0;padding:24px 20px 40px;
  border-top:1px solid var(--line);font-size:.9rem;color:var(--muted);text-align:center;
}
.fuss a{color:var(--muted);text-decoration:none;display:inline-block;padding:11px 7px}
.fuss a:hover{color:var(--primary-dark)}

/* Ab hier aus src/App.css übernommen – nicht hier ändern. */
${stil}
</style>
</head>
<body>
<header class="kopf">
  <a class="marke" href="/"><span class="marke-zeichen">Д</span><span>Davaigo</span></a>
  <a class="kopf-knopf" href="/">Zur App</a>
</header>
${inhalt}
<footer class="fuss">
  <p>
    <a href="/impressum/">Impressum</a>
    <a href="/datenschutz/">Datenschutz</a>
    <a href="/agb/">AGB &amp; Widerruf</a>
  </p>
  <p><a href="/">Davaigo – Russisch lernen</a> · <a href="/ratgeber/">Ratgeber</a></p>
</footer>
</body>
</html>
`
}

// ---- 1. src/Recht.jsx für Node übersetzen ----
await build({
  root: fileURLToPath(WURZEL),
  logLevel: 'error',
  plugins: [react()],
  build: {
    ssr: fileURLToPath(new URL('scripts/recht-ssr.jsx', WURZEL)),
    outDir: fileURLToPath(TEMP),
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: 'recht.mjs' } },
  },
})

// ---- 2. Rendern ----
const { seiten } = await import(new URL('recht.mjs', TEMP).href)
const fertig = seiten()
const stil = await stilAusApp()

for (const [name, kopfdaten] of Object.entries(SEITEN)) {
  let inhalt = fertig[name]

  // Der Zurück-Knopf stammt aus der App und führt hier nirgendwohin.
  inhalt = inhalt.replace(/<button class="recht-zurueck">.*?<\/button>/s, '')

  // Was in der App ein Zustandswechsel ist, muss hier ein Link sein.
  inhalt = inhalt
    .replace(/href="\/\?recht=impressum"/g, 'href="/impressum/"')
    .replace(/href="\/\?recht=datenschutz"/g, 'href="/datenschutz/"')
    .replace(/href="\/\?recht=agb"/g, 'href="/agb/"')

  const ordner = new URL(`public/${name}/`, WURZEL)
  await mkdir(ordner, { recursive: true })
  await writeFile(
    new URL('index.html', ordner),
    huelle({ ...kopfdaten, pfad: `/${name}/`, inhalt, stil })
  )

  const woerter = inhalt.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  console.log(`  /${name.padEnd(13)} ${woerter} Wörter, ohne JavaScript lesbar`)
}

await rm(TEMP, { recursive: true, force: true })
console.log('Pflichtseiten geschrieben (Quelle: src/Recht.jsx + src/App.css)')
