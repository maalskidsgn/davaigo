import { tr, gebiet } from './sprache.js'
/**
 * Songtext als PDF sichern.
 *
 * Bewusst ohne zusätzliche Bibliothek: Der Text wird in ein eigenes
 * Fenster geschrieben und der Druckdialog geöffnet. Dort wählt man
 * "Als PDF sichern" – das kann jeder Browser und jedes Betriebssystem,
 * und das Ergebnis ist echter Text, den man durchsuchen kann.
 *
 * @param {object} daten
 * @param {string} daten.titel    – Name des Songs
 * @param {string} daten.kanal    – Interpret oder Kanal
 * @param {string[]} daten.zeilen – der russische Text, Zeile für Zeile
 * @param {string[]|null} daten.deutsch – die Übersetzung, falls vorhanden
 */
export function songAlsPdf({ titel, kanal, zeilen, deutsch }) {
  const fenster = window.open('', '_blank', 'width=820,height=1000')
  if (!fenster) {
    throw new Error(
      tr('Der Browser hat das Fenster blockiert. Bitte Pop-ups für Davaigo erlauben.')
    )
  }

  // Aufeinanderfolgende Zeilen zu Strophen bündeln: Alle vier Zeilen
  // eine Lücke – so liest sich der Text wie ein Liedtext statt wie
  // eine endlose Liste.
  const strophen = []
  for (let i = 0; i < zeilen.length; i += 4) {
    strophen.push({
      es: zeilen.slice(i, i + 4),
      de: deutsch ? deutsch.slice(i, i + 4) : null,
    })
  }

  const escape = (text) =>
    String(text ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

  const heute = new Date().toLocaleDateString(gebiet(), {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  fenster.document.write(tr('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<title>{0}</title>\n<style>\n  @page { margin: 20mm 18mm; }\n  * { box-sizing: border-box; }\n  body {\n    margin: 0;\n    font-family: "Nunito", -apple-system, "Segoe UI", sans-serif;\n    color: #191933;\n    line-height: 1.55;\n  }\n  header {\n    border-bottom: 3px solid #ff6c00;\n    padding-bottom: 14px;\n    margin-bottom: 26px;\n  }\n  .marke {\n    font-size: 11px;\n    font-weight: 800;\n    letter-spacing: .12em;\n    text-transform: uppercase;\n    color: #ff6c00;\n    margin-bottom: 6px;\n  }\n  h1 { font-size: 24px; margin: 0 0 4px; line-height: 1.2; }\n  .interpret { font-size: 14px; color: #6f6858; margin: 0; }\n\n  .strophe { margin-bottom: 20px; break-inside: avoid; }\n  .zeile { display: block; }\n  .es { font-size: 15px; font-weight: 600; }\n  .de { font-size: 13px; color: #6f6858; margin-bottom: 6px; }\n\n  footer {\n    margin-top: 32px;\n    padding-top: 12px;\n    border-top: 1px solid #e8ded0;\n    font-size: 11px;\n    color: #9a9182;\n    display: flex;\n    justify-content: space-between;\n  }\n\n  /* Beim Drucken die Hinweiszeile ausblenden */\n  .hinweis {\n    background: #fff3e8;\n    border: 1px solid #ffd9b8;\n    border-radius: 10px;\n    padding: 12px 14px;\n    font-size: 13px;\n    margin-bottom: 24px;\n  }\n  @media print { .hinweis { display: none; } }\n</style>\n</head>\n<body>\n  <div class="hinweis">\n    Gleich öffnet sich der Druckdialog – wähle dort <b>„Als PDF sichern“</b>.\n  </div>\n\n  <header>\n    <div class="marke">Davaigo · Songtext</div>\n    <h1>{1}</h1>\n    <p class="interpret">{2}</p>\n  </header>\n\n  {3}\n\n  <footer>\n    <span>davaigo.de</span>\n    <span>{4}</span>\n  </footer>\n</body>\n</html>', escape(titel), escape(titel), escape(kanal || ''), strophen
    .map(
      (s) => `<div class="strophe">${s.es
        .map(
          (zeile, i) =>
            `<span class="zeile"><span class="es">${escape(zeile)}</span></span>` +
            (s.de?.[i] ? `<span class="zeile de">${escape(s.de[i])}</span>` : '')
        )
        .join('')}</div>`
    )
    .join(''), heute))

  fenster.document.close()

  // Kurz warten, bis die Schrift steht – sonst druckt Safari zu früh
  fenster.onload = () => setTimeout(() => fenster.print(), 400)
}
