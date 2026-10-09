// Baut aus inhalte/ratgeber.js fertige HTML-Seiten.
//
//     node scripts/baue-ratgeber.mjs
//
// Warum statische Seiten und keine Route in der React-App?
//
// Davaigo ist eine Einzelseiten-Anwendung: Alles steckt in einem
// JavaScript-Paket von gut einem Megabyte, und der Seitentitel wird
// erst nachträglich gesetzt. Für die App ist das richtig, für Texte,
// die bei Google ranken sollen, ist es der falsche Weg. Eine
// Suchmaschine bekommt hier stattdessen fertiges HTML: eigener
// Titel, eigene Beschreibung, Inhalt sofort im Quelltext, ohne dass
// ein einziges Skript laufen muss.
//
// Die Dateien landen in public/ratgeber/ und werden von Vite
// unverändert nach dist/ kopiert. Caddy liefert sie direkt aus.
//
// Geschrieben wird immer der ganze Ordner neu – so kann keine alte
// Seite liegen bleiben, deren Beitrag es nicht mehr gibt.

import { mkdir, writeFile, rm } from 'node:fs/promises'
import { BEITRAEGE, SEITE } from '../inhalte/ratgeber.js'

const ZIEL = new URL('../public/ratgeber/', import.meta.url)

/** Text für HTML entschärfen. */
const e = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * Eine Zeile Fließtext in HTML.
 *
 * Bewusst winzig gehalten: **fett**, *kursiv*, [Text](Adresse) und
 * `Code`. Mehr braucht ein Ratgebertext nicht, und alles, was nicht
 * gebraucht wird, kann auch nicht kaputtgehen.
 */
function satz(text) {
  return e(text)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

/** Ein Abschnittsbaustein → HTML. */
function baustein(b) {
  if (typeof b === 'string') return `<p>${satz(b)}</p>`
  if (b.liste) return `<ul>${b.liste.map((p) => `<li>${satz(p)}</li>`).join('')}</ul>`
  if (b.nummern) return `<ol>${b.nummern.map((p) => `<li>${satz(p)}</li>`).join('')}</ol>`
  if (b.kasten)
    return `<aside class="kasten"><p class="kasten-titel">${e(b.titel)}</p>${b.kasten
      .map((p) => `<p>${satz(p)}</p>`)
      .join('')}</aside>`
  if (b.zitat) return `<blockquote><p>${satz(b.zitat)}</p></blockquote>`
  if (b.h3) return `<h3>${e(b.h3)}</h3>`
  if (b.tabelle)
    return `<div class="tabelle-rahmen"><table><thead><tr>${b.kopf
      .map((k) => `<th>${e(k)}</th>`)
      .join('')}</tr></thead><tbody>${b.tabelle
      .map((r) => `<tr>${r.map((z) => `<td>${satz(z)}</td>`).join('')}</tr>`)
      .join('')}</tbody></table></div>`
  return ''
}

const AUFRUF = `
<div class="cta">
  <p class="cta-titel">Probier es mit Davaigo</p>
  <p>180 Lektionen vom kyrillischen Alphabet bis zur B2-Schwelle, jedes Wort von
     russischen Muttersprachlern gesprochen. Der Einstieg kostet nichts.</p>
  <a class="cta-knopf" href="/">Kostenlos anfangen</a>
</div>`

function seite({ titel, beschreibung, pfad, inhalt, kopfzeile = '', jsonLd = [] }) {
  const adresse = SEITE.basis + pfad
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
<meta property="og:type" content="${pfad === '/ratgeber/' ? 'website' : 'article'}">
<meta property="og:title" content="${e(titel)}">
<meta property="og:description" content="${e(beschreibung)}">
<meta property="og:url" content="${e(adresse)}">
<meta property="og:locale" content="de_DE">
<meta property="og:site_name" content="Davaigo">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/ratgeber/ratgeber.css">
${jsonLd.map((d) => `<script type="application/ld+json">${JSON.stringify(d)}</script>`).join('\n')}
</head>
<body>
<header class="kopf">
  <a class="marke" href="/"><span class="marke-zeichen">Д</span><span>Davaigo</span></a>
  <a class="kopf-knopf" href="/">Zur App</a>
</header>
${kopfzeile}
<main>${inhalt}</main>
<footer class="fuss">
  <p><a href="/">Davaigo – Russisch lernen</a> · <a href="/ratgeber/">Alle Ratgeber</a></p>
  <p class="fuss-recht">
    <a href="/?recht=impressum">Impressum</a>
    <a href="/?recht=datenschutz">Datenschutz</a>
    <a href="/?recht=agb">AGB &amp; Widerruf</a>
  </p>
  <p class="fuss-klein">Сделано с любовью – mit Liebe gemacht 💜</p>
</footer>
</body>
</html>
`
}

// --------------------------------------------------------------
//  Schreiben
// --------------------------------------------------------------

await rm(ZIEL, { recursive: true, force: true })
await mkdir(ZIEL, { recursive: true })

const heute = new Date().toISOString().slice(0, 10)

// --- Stilblatt (einmal für alle Seiten) ---
await writeFile(new URL('ratgeber.css', ZIEL), STIL())

// --- Die einzelnen Beiträge ---
for (const b of BEITRAEGE) {
  const andere = BEITRAEGE.filter((x) => x.slug !== b.slug).slice(0, 3)

  const koerper = b.abschnitte
    .map((a, i) => {
      const teil = `<section><h2>${e(a.h2)}</h2>${a.inhalt.map(baustein).join('\n')}</section>`
      // Ein Handlungsaufruf in der Mitte, einer am Schluss. Mehr
      // wirkt wie Werbung und vertreibt genau die Leute, die
      // eigentlich bleiben wollten.
      return i === Math.floor(b.abschnitte.length / 2) ? teil + AUFRUF : teil
    })
    .join('\n')

  const faq = b.faq?.length
    ? `<section class="faq"><h2>Häufige Fragen</h2>${b.faq
        .map((f) => `<details><summary>${e(f.frage)}</summary><p>${satz(f.antwort)}</p></details>`)
        .join('')}</section>`
    : ''

  const weiter = `<section class="weiter"><h2>Weiterlesen</h2><div class="karten">${andere
    .map(
      (a) =>
        `<a class="karte" href="/ratgeber/${a.slug}/"><span class="karte-emoji">${a.emoji}</span><span class="karte-titel">${e(
          a.titel
        )}</span><span class="karte-text">${e(a.beschreibung)}</span></a>`
    )
    .join('')}</div></section>`

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: b.titel,
      description: b.beschreibung,
      inLanguage: 'de-DE',
      datePublished: b.datum,
      dateModified: heute,
      mainEntityOfPage: SEITE.basis + '/ratgeber/' + b.slug + '/',
      author: { '@type': 'Organization', name: 'Davaigo' },
      publisher: { '@type': 'Organization', name: 'Davaigo', url: SEITE.basis },
    },
  ]
  if (b.faq?.length) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: b.faq.map((f) => ({
        '@type': 'Question',
        name: f.frage,
        acceptedAnswer: { '@type': 'Answer', text: f.antwort.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') },
      })),
    })
  }

  const kopfzeile = `
<div class="titelblock">
  <p class="brotkrumen"><a href="/">Davaigo</a> › <a href="/ratgeber/">Ratgeber</a></p>
  <h1>${e(b.titel)}</h1>
  <p class="anreisser">${e(b.anreisser)}</p>
  <p class="meta">${b.lesezeit} Minuten Lesezeit · zuletzt geprüft ${new Date(heute).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</p>
</div>`

  await mkdir(new URL(b.slug + '/', ZIEL), { recursive: true })
  await writeFile(
    new URL(b.slug + '/index.html', ZIEL),
    seite({
      titel: b.seitentitel,
      beschreibung: b.beschreibung,
      pfad: '/ratgeber/' + b.slug + '/',
      kopfzeile,
      inhalt: koerper + faq + weiter + AUFRUF,
      jsonLd,
    })
  )
}

// --- Übersichtsseite ---
await writeFile(
  new URL('index.html', ZIEL),
  seite({
    titel: 'Ratgeber: Russisch lernen – Davaigo',
    beschreibung:
      'Ehrliche Ratgeber zum Russischlernen: welche App wirklich hilft, was kostenlos geht, wie Vokabeln hängen bleiben und wie Videos zum Unterricht werden.',
    pfad: '/ratgeber/',
    kopfzeile: `
<div class="titelblock">
  <p class="brotkrumen"><a href="/">Davaigo</a> › Ratgeber</p>
  <h1>Ratgeber zum Russischlernen</h1>
  <p class="anreisser">Keine Werbetexte, sondern das, was wir beim Bauen einer Lern-App über das Lernen selbst gelernt haben.</p>
</div>`,
    inhalt: `<section><div class="karten karten-gross">${BEITRAEGE.map(
      (b) =>
        `<a class="karte" href="/ratgeber/${b.slug}/"><span class="karte-emoji">${b.emoji}</span><span class="karte-titel">${e(
          b.titel
        )}</span><span class="karte-text">${e(b.beschreibung)}</span><span class="karte-mehr">Lesen →</span></a>`
    ).join('')}</div></section>${AUFRUF}`,
  })
)

// --- Sitemap: die App und alle Ratgeber ---
const adressen = [
  { loc: SEITE.basis + '/', prio: '1.0' },
  { loc: SEITE.basis + '/ratgeber/', prio: '0.8' },
  ...BEITRAEGE.map((b) => ({ loc: SEITE.basis + '/ratgeber/' + b.slug + '/', prio: '0.7' })),
]
await writeFile(
  new URL('../sitemap.xml', ZIEL),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${adressen
  .map((a) => `  <url><loc>${a.loc}</loc><lastmod>${heute}</lastmod><priority>${a.prio}</priority></url>`)
  .join('\n')}
</urlset>
`
)

await writeFile(
  new URL('../robots.txt', ZIEL),
  `User-agent: *
Allow: /

Sitemap: ${SEITE.basis}/sitemap.xml
`
)

console.log(`${BEITRAEGE.length} Ratgeber, Übersicht, Sitemap und robots.txt geschrieben.`)
for (const b of BEITRAEGE) {
  const woerter = JSON.stringify(b.abschnitte).split(/\s+/).length
  console.log(`  /ratgeber/${b.slug.padEnd(42)} ~${woerter} Wörter`)
}

// --------------------------------------------------------------

function STIL() {
  return `/* Erzeugt von scripts/baue-ratgeber.mjs – nicht von Hand ändern.
   Eigenes Stilblatt statt App.css: Die Ratgeberseiten sollen ohne
   das 1-MB-Paket der App auskommen und sofort dastehen. */
:root{
  --primary:#7c3aed; --primary-dark:#6d28d9; --gold:#ffc800;
  --navy:#241338; --muted:#756a85; --bg:#f5f0fc; --karte:#fff; --rand:#ebe3f7;
}
*{box-sizing:border-box}
body{
  margin:0;background:var(--bg);color:var(--navy);
  font-family:'Nunito',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  font-size:18px;line-height:1.7;-webkit-font-smoothing:antialiased;
}
a{color:var(--primary-dark)}
main,.titelblock{max-width:720px;margin:0 auto;padding:0 20px}

.kopf{
  display:flex;align-items:center;justify-content:space-between;gap:16px;
  max-width:1080px;margin:0 auto;padding:16px 20px;
}
.marke{display:flex;align-items:center;gap:10px;font-weight:900;font-size:1.3rem;color:var(--navy);text-decoration:none}
.marke-zeichen{
  display:grid;place-items:center;width:38px;height:38px;border-radius:11px;
  background:linear-gradient(135deg,#ffd23f,var(--gold));color:var(--navy);font-size:1.4rem;font-weight:900;
}
.kopf-knopf{
  background:var(--primary);color:#fff;text-decoration:none;font-weight:800;
  padding:10px 20px;border-radius:12px;box-shadow:0 3px 0 var(--primary-dark);
}

.titelblock{padding-top:24px;padding-bottom:8px}
.brotkrumen{font-size:.86rem;color:var(--muted);margin:0 0 14px}
.brotkrumen a{color:var(--muted)}
h1{font-size:2.15rem;line-height:1.2;font-weight:900;letter-spacing:-.5px;margin:0 0 14px}
.anreisser{font-size:1.14rem;color:#4a4160;margin:0 0 10px}
.meta{font-size:.86rem;color:var(--muted);margin:0 0 8px}

h2{font-size:1.5rem;font-weight:900;line-height:1.3;margin:40px 0 14px}
h3{font-size:1.16rem;font-weight:800;margin:26px 0 8px}
p{margin:0 0 16px}
ul,ol{margin:0 0 18px;padding-left:22px}
li{margin-bottom:9px}
code{background:#ede6f9;padding:2px 6px;border-radius:5px;font-size:.92em}
blockquote{
  margin:22px 0;padding:14px 18px;border-left:4px solid var(--gold);
  background:#fffaeb;border-radius:0 12px 12px 0;font-style:italic;
}
blockquote p{margin:0}

.kasten{
  background:var(--karte);border:1px solid var(--rand);border-radius:16px;
  padding:18px 20px;margin:24px 0;
}
.kasten-titel{font-weight:800;margin:0 0 8px;color:var(--primary-dark)}
.kasten p:last-child{margin-bottom:0}

.tabelle-rahmen{overflow-x:auto;margin:22px 0}
table{border-collapse:collapse;width:100%;background:var(--karte);border-radius:12px;overflow:hidden;font-size:.95rem}
th,td{text-align:left;padding:11px 14px;border-bottom:1px solid var(--rand)}
th{background:#f3ecff;font-weight:800}
tr:last-child td{border-bottom:none}

.cta{
  background:linear-gradient(135deg,var(--primary),var(--primary-dark));
  color:#fff;border-radius:20px;padding:26px 24px;margin:38px 0;text-align:center;
}
.cta-titel{font-size:1.3rem;font-weight:900;margin:0 0 8px}
.cta p{margin:0 0 18px;opacity:.93}
.cta-knopf{
  display:inline-block;background:var(--gold);color:var(--navy);font-weight:900;
  padding:13px 30px;border-radius:13px;text-decoration:none;box-shadow:0 3px 0 #d19b00;
}

.faq{margin-top:40px}
details{background:var(--karte);border:1px solid var(--rand);border-radius:13px;padding:14px 18px;margin-bottom:10px}
summary{font-weight:800;cursor:pointer}
details p{margin:10px 0 0}

.weiter{margin-top:44px}
.karten{display:grid;gap:14px;grid-template-columns:1fr}
@media(min-width:720px){.karten{grid-template-columns:1fr 1fr}.karten-gross{grid-template-columns:1fr 1fr}}
.karte{
  display:block;background:var(--karte);border:1px solid var(--rand);border-radius:16px;
  padding:18px;text-decoration:none;color:var(--navy);
}
.karte:hover{border-color:var(--primary);box-shadow:0 4px 18px rgba(124,58,237,.12)}
.karte-emoji{font-size:1.6rem;display:block;margin-bottom:8px}
.karte-titel{display:block;font-weight:900;line-height:1.3;margin-bottom:6px}
.karte-text{display:block;font-size:.92rem;color:var(--muted);line-height:1.55}
.karte-mehr{display:block;margin-top:10px;font-weight:800;color:var(--primary-dark);font-size:.92rem}

.fuss{
  max-width:720px;margin:56px auto 0;padding:24px 20px 40px;
  border-top:1px solid var(--rand);font-size:.9rem;color:var(--muted);text-align:center;
}
.fuss a{color:var(--muted);text-decoration:none;margin:0 7px}
.fuss a:hover{color:var(--primary-dark)}
.fuss-recht{margin:10px 0}
.fuss-klein{font-size:.84rem;margin:10px 0 0}

@media(max-width:560px){
  body{font-size:17px}
  h1{font-size:1.72rem}
  h2{font-size:1.3rem}
}
`
}
