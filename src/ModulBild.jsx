import { INSEL_TOENE } from './Rangliste.jsx'

/**
 * Die Modul-Bilder: je Modul ein Toon-Emblem auf einer Trommel, im
 * selben Comic-3D-Stil wie die Start-Karten (StartInseln.jsx).
 *
 * Die Embleme liegen als fertiges SVG-Markup vor (eigene Zeichnungen,
 * keine Nutzereingaben) – deshalb dangerouslySetInnerHTML. Gezeichnet
 * im Entwurf vom 06.11.2026; Davaigo-Farben schon eingesetzt.
 * Fehlt ein Bild, bleibt das Emoji des Moduls stehen.
 */
const BILDER = {
  "m1": "<ellipse cx=\"40\" cy=\"74\" rx=\"24\" ry=\"4.2\" fill=\"#000\" opacity=\".13\"/><rect x=\"8\" y=\"42\" width=\"26\" height=\"28\" rx=\"7\" fill=\"#6d28d9\"/><rect x=\"8\" y=\"40\" width=\"26\" height=\"25\" rx=\"7\" fill=\"#8b5cf6\"/><text x=\"21\" y=\"60\" text-anchor=\"middle\" font-family=\"Nunito,system-ui\" font-weight=\"900\" font-size=\"18\" fill=\"#fff\">Б</text> <rect x=\"46\" y=\"42\" width=\"26\" height=\"28\" rx=\"7\" fill=\"#e0661a\"/><rect x=\"46\" y=\"40\" width=\"26\" height=\"25\" rx=\"7\" fill=\"#ff8a2a\"/><text x=\"59\" y=\"60\" text-anchor=\"middle\" font-family=\"Nunito,system-ui\" font-weight=\"900\" font-size=\"18\" fill=\"#fff\">Я</text> <rect x=\"26\" y=\"14\" width=\"28\" height=\"30\" rx=\"7\" fill=\"#e2d4ff\"/><rect x=\"26\" y=\"12\" width=\"28\" height=\"27\" rx=\"7\" fill=\"#faf6ff\"/><text x=\"40\" y=\"33\" text-anchor=\"middle\" font-family=\"Nunito,system-ui\" font-weight=\"900\" font-size=\"20\" fill=\"#6d28d9\">Д</text><rect x=\"29\" y=\"15\" width=\"10\" height=\"4\" rx=\"2\" fill=\"#fff\"/>",
  "m2": "<ellipse cx=\"40\" cy=\"74\" rx=\"24\" ry=\"4.2\" fill=\"#000\" opacity=\".13\"/><rect x=\"4\" y=\"16\" width=\"64\" height=\"32\" rx=\"13\" fill=\"#6d28d9\" transform=\"translate(0 4)\"/><rect x=\"4\" y=\"16\" width=\"64\" height=\"32\" rx=\"13\" fill=\"#8b5cf6\"/><path d=\"M18 46 l-6 12 l16 -10 z\" fill=\"#8b5cf6\"/><text x=\"36\" y=\"37\" text-anchor=\"middle\" font-family=\"Nunito,system-ui\" font-weight=\"900\" font-size=\"12.5\" fill=\"#fff\">Привет!</text> <rect x=\"40\" y=\"46\" width=\"32\" height=\"22\" rx=\"10\" fill=\"#ff8a2a\"/><path d=\"M62 66 l6 8 l-1 -9 z\" fill=\"#ff8a2a\"/><circle cx=\"49\" cy=\"57\" r=\"2.6\" fill=\"#fff\"/><circle cx=\"56\" cy=\"57\" r=\"2.6\" fill=\"#fff\"/><circle cx=\"63\" cy=\"57\" r=\"2.6\" fill=\"#fff\"/>",
  "m3": "<ellipse cx=\"40\" cy=\"74\" rx=\"24\" ry=\"4.2\" fill=\"#000\" opacity=\".13\"/><rect x=\"18\" y=\"38\" width=\"44\" height=\"32\" rx=\"4\" fill=\"#faf6ff\"/><rect x=\"40\" y=\"38\" width=\"22\" height=\"32\" rx=\"4\" fill=\"#e2d4ff\"/><path d=\"M10 40 L40 14 L70 40 Z\" fill=\"#8b5cf6\"/><path d=\"M40 14 L70 40 L58 40 Z\" fill=\"#6d28d9\"/><rect x=\"52\" y=\"18\" width=\"7\" height=\"14\" fill=\"#e0661a\"/> <rect x=\"34\" y=\"52\" width=\"12\" height=\"18\" rx=\"3\" fill=\"#ff8a2a\"/><circle cx=\"43\" cy=\"61\" r=\"1.4\" fill=\"#fff\"/><rect x=\"22\" y=\"45\" width=\"10\" height=\"9\" rx=\"2\" fill=\"#7fc8ff\"/><rect x=\"50\" y=\"45\" width=\"10\" height=\"9\" rx=\"2\" fill=\"#7fc8ff\"/><path d=\"M24 47 h4\" stroke=\"#fff\" stroke-width=\"2\" stroke-linecap=\"round\"/>",
  "m4": "<ellipse cx=\"40\" cy=\"74\" rx=\"24\" ry=\"4.2\" fill=\"#000\" opacity=\".13\"/><g transform=\"rotate(-12 30 44)\"><rect x=\"10\" y=\"22\" width=\"34\" height=\"42\" rx=\"7\" fill=\"#e2d4ff\"/></g> <g transform=\"rotate(10 50 44)\"><rect x=\"36\" y=\"22\" width=\"34\" height=\"42\" rx=\"7\" fill=\"#ff8a2a\"/></g> <rect x=\"23\" y=\"18\" width=\"34\" height=\"46\" rx=\"8\" fill=\"#6d28d9\" transform=\"translate(0 3)\"/><rect x=\"23\" y=\"18\" width=\"34\" height=\"46\" rx=\"8\" fill=\"#8b5cf6\"/><text x=\"40\" y=\"46\" text-anchor=\"middle\" font-family=\"Nunito,system-ui\" font-weight=\"900\" font-size=\"13\" fill=\"#fff\">кого</text><rect x=\"27\" y=\"22\" width=\"12\" height=\"4\" rx=\"2\" fill=\"#fff\" opacity=\".4\"/>",
  "m5": "<ellipse cx=\"40\" cy=\"74\" rx=\"24\" ry=\"4.2\" fill=\"#000\" opacity=\".13\"/><path d=\"M28 30 v-6 a12 12 0 0 1 24 0 v6\" stroke=\"#e0661a\" stroke-width=\"4.5\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M14 28 h52 l-5 40 a5 5 0 0 1 -5 4 h-32 a5 5 0 0 1 -5 -4 z\" fill=\"#8b5cf6\"/><path d=\"M40 28 h26 l-5 40 a5 5 0 0 1 -5 4 h-16 z\" fill=\"#6d28d9\"/> <rect x=\"14\" y=\"26\" width=\"52\" height=\"7\" rx=\"3\" fill=\"#faf6ff\"/><circle cx=\"58\" cy=\"20\" r=\"7\" fill=\"#3fbf6f\"/><path d=\"M58 13 q4 -6 8 -4\" stroke=\"#2a9a55\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\"/><rect x=\"20\" y=\"20\" width=\"10\" height=\"14\" rx=\"3\" fill=\"#ffd34d\" transform=\"rotate(-12 25 27)\"/><rect x=\"20\" y=\"38\" width=\"5\" height=\"18\" rx=\"2.5\" fill=\"#fff\" opacity=\".3\"/>",
  "m6": "<ellipse cx=\"40\" cy=\"74\" rx=\"24\" ry=\"4.2\" fill=\"#000\" opacity=\".13\"/><rect x=\"37\" y=\"34\" width=\"6\" height=\"36\" rx=\"2\" fill=\"#e0661a\"/><ellipse cx=\"40\" cy=\"70\" rx=\"10\" ry=\"3\" fill=\"#e0661a\"/> <circle cx=\"40\" cy=\"26\" r=\"20\" fill=\"#6d28d9\"/><circle cx=\"40\" cy=\"24\" r=\"20\" fill=\"#8b5cf6\"/><circle cx=\"40\" cy=\"24\" r=\"15\" fill=\"#fff\"/><path d=\"M29 33 L33 15 L40 26 L47 15 L51 33\" stroke=\"#e5484d\" stroke-width=\"5\" fill=\"none\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/>",
  "m7": "<ellipse cx=\"40\" cy=\"74\" rx=\"24\" ry=\"4.2\" fill=\"#000\" opacity=\".13\"/><path d=\"M22 62 h36 l-4 -8 h-28 z\" fill=\"#ff8a2a\"/><rect x=\"18\" y=\"62\" width=\"44\" height=\"8\" rx=\"4\" fill=\"#e0661a\"/> <circle cx=\"40\" cy=\"34\" r=\"22\" fill=\"#8b5cf6\"/><circle cx=\"40\" cy=\"34\" r=\"22\" fill=\"url(#k)\"/><defs><radialGradient id=\"k\" cx=\".35\" cy=\".3\" r=\".8\"><stop offset=\"0\" stop-color=\"#fff\" stop-opacity=\".7\"/><stop offset=\".45\" stop-color=\"#fff\" stop-opacity=\"0\"/></radialGradient></defs> <path d=\"M30 40 q10 -10 20 0 q-10 8 -20 0\" fill=\"#faf6ff\" opacity=\".6\"/><path d=\"M47 22 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 z\" fill=\"#ffd34d\"/><circle cx=\"31\" cy=\"26\" r=\"2.2\" fill=\"#fff\"/>",
  "m8": "<ellipse cx=\"40\" cy=\"74\" rx=\"24\" ry=\"4.2\" fill=\"#000\" opacity=\".13\"/><path d=\"M14 34 h10 v16 h-10 a4 4 0 0 1 -4 -4 v-8 a4 4 0 0 1 4 -4 z\" fill=\"#ff8a2a\"/><path d=\"M24 34 L56 18 V66 L24 50 Z\" fill=\"#8b5cf6\"/><path d=\"M24 42 L56 42 V66 L24 50 Z\" fill=\"#6d28d9\"/><ellipse cx=\"56\" cy=\"42\" rx=\"6\" ry=\"24\" fill=\"#faf6ff\"/><ellipse cx=\"56\" cy=\"42\" rx=\"3.5\" ry=\"16\" fill=\"#e2d4ff\"/> <path d=\"M26 52 l4 14 h6 l-3 -12\" fill=\"#ff8a2a\"/><path d=\"M66 28 l6 -4 M68 42 h7 M66 56 l6 4\" stroke=\"#8b5cf6\" stroke-width=\"3.2\" stroke-linecap=\"round\"/>",
  "m9": "<ellipse cx=\"40\" cy=\"74\" rx=\"24\" ry=\"4.2\" fill=\"#000\" opacity=\".13\"/><rect x=\"16\" y=\"14\" width=\"46\" height=\"56\" rx=\"5\" fill=\"#e2d4ff\" transform=\"rotate(6 39 42)\"/><rect x=\"14\" y=\"12\" width=\"46\" height=\"56\" rx=\"5\" fill=\"#fff\"/> <rect x=\"19\" y=\"17\" width=\"36\" height=\"8\" rx=\"2\" fill=\"#ff8a2a\"/><rect x=\"19\" y=\"29\" width=\"16\" height=\"14\" rx=\"2\" fill=\"#8b5cf6\"/><path d=\"M39 31 h16 M39 36 h16 M39 41 h12 M19 48 h36 M19 53 h36 M19 58 h26\" stroke=\"#e2d4ff\" stroke-width=\"2.8\" stroke-linecap=\"round\"/> <circle cx=\"60\" cy=\"58\" r=\"11\" fill=\"#e5484d\"/><path d=\"M57 53 l8 5 l-8 5 z\" fill=\"#fff\"/>",
  "m10": "<ellipse cx=\"40\" cy=\"74\" rx=\"24\" ry=\"4.2\" fill=\"#000\" opacity=\".13\"/><path d=\"M30 58 q-8 6 -6 16 q8 -2 14 -8 z\" fill=\"#ff8a2a\"/><path d=\"M34 60 q-4 4 -3 9 q5 -1 8 -5 z\" fill=\"#ffd34d\"/> <path d=\"M28 50 l-10 4 l6 -14 z\" fill=\"#e0661a\"/><path d=\"M52 50 l10 4 l-6 -14 z\" fill=\"#e0661a\"/> <path d=\"M40 8 C54 18 56 38 50 56 H30 C24 38 26 18 40 8 Z\" fill=\"#faf6ff\"/><path d=\"M40 8 C54 18 56 38 50 56 H40 Z\" fill=\"#e2d4ff\"/><path d=\"M40 8 C46 12 50 18 51 24 H29 C30 18 34 12 40 8 Z\" fill=\"#8b5cf6\"/> <circle cx=\"40\" cy=\"34\" r=\"7\" fill=\"#ff8a2a\"/><circle cx=\"40\" cy=\"34\" r=\"4.5\" fill=\"#7fc8ff\"/><rect x=\"36\" y=\"56\" width=\"8\" height=\"5\" rx=\"1.5\" fill=\"#ff8a2a\"/>"
}

function Trommel() {
  const [hell, oben, links, mitte, rechts, tief] = INSEL_TOENE.zweiter
  return (
    <svg className="mb-sockel" viewBox="0 0 120 64" aria-hidden="true">
      <path d="M8 22 V40 Q60 62 112 40 V22 Z" fill={mitte} />
      <path d="M60 51 Q90 50 112 40 V22 Q90 34 60 36 Z" fill={rechts} />
      <path d="M8 22 V40 Q22 46 30 47.5 V30 Q16 27 8 22 Z" fill={links} />
      <path d="M8 40 Q60 62 112 40 V44 Q60 66 8 44 Z" fill={tief} />
      <ellipse cx="60" cy="22" rx="52" ry="14" fill={oben} />
      <ellipse cx="55" cy="19" rx="35" ry="8" fill={hell} />
      <path d="M22 17 Q32 11 46 10.5" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" fill="none" opacity=".85" />
    </svg>
  )
}

export default function ModulBild({ modul }) {
  const bild = BILDER[modul?.id]
  if (!bild) return modul?.emoji ?? null
  return (
    <span className="mb">
      <Trommel />
      <svg className="mb-emblem" viewBox="0 0 80 80" aria-hidden="true" dangerouslySetInnerHTML={{ __html: bild }} />
    </span>
  )
}
