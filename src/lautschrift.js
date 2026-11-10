// Lautschrift: Russisch in lateinischen Buchstaben – so, wie man es auf
// Deutsch (bzw. Englisch) liest. Für A1-Bücher (Manuel, 10.11.2026).
// Läuft im Gerät, ohne KI und ohne Kosten.

const DE = {
  а: 'a', б: 'b', в: 'w', г: 'g', д: 'd', е: 'e', ё: 'jo', ж: 'sch', з: 's', и: 'i', й: 'j',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
  х: 'ch', ц: 'z', ч: 'tsch', ш: 'sch', щ: 'schtsch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'ju', я: 'ja',
}
const EN = {
  ...DE, в: 'v', е: 'e', ё: 'yo', ж: 'zh', з: 'z', й: 'y', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh',
  щ: 'shch', ю: 'yu', я: 'ya',
}
const VOKAL = 'аеёиоуыэюяaeiouy'

/**
 * @param {string} text  russischer Text
 * @param {string} ui    'de' | 'en' – nach wessen Lesegewohnheit
 */
export function lautschrift(text = '', ui = 'de') {
  const T = ui === 'en' ? EN : DE
  const zeichen = [...String(text)]
  let aus = ''
  for (let i = 0; i < zeichen.length; i++) {
    const z = zeichen[i]
    const klein = z.toLowerCase()
    if (!(klein in T)) { aus += z; continue }
    const vor = (zeichen[i - 1] || '').toLowerCase()
    const nach = (zeichen[i + 1] || '').toLowerCase()
    const amAnfang = !vor || !/[а-яё]/.test(vor)
    let laut = T[klein]
    // е nach Vokal, ъ/ь oder am Wortanfang spricht man „je“ (ye)
    if (klein === 'е' && (amAnfang || (vor && VOKAL.includes(vor)) || vor === 'ь' || vor === 'ъ')) laut = ui === 'en' ? 'ye' : 'je'
    // stimmloses s zwischen Vokalen: im Deutschen „ss“
    if (klein === 'с' && ui !== 'en' && vor && nach && VOKAL.includes(vor) && VOKAL.includes(nach)) laut = 'ss'
    if (z !== klein && laut) laut = laut[0].toUpperCase() + laut.slice(1)
    aus += laut
  }
  return aus
}
