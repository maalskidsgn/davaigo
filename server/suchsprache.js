// Sprache der Suchtreffer prüfen (17.11.2026, Manuel: „in der YouTube-Suche sind englische
// Videos – das darf nicht sein“).
//
// Zwei Ursachen, zwei Mittel:
//  1. YouTube zeigt je nach Oberflächensprache ÜBERSETZTE Titel. Die Suche lief als
//     „englischer“ Besucher – viele russische Videos trugen deshalb englische Titel.
//     Gesucht wird jetzt in einer neutralen Oberflächensprache (Isländisch,
//     SUCH_SPRACHE): Dann liefert YouTube die ORIGINAL-Titel.
//  2. Große englische Kanäle laden russische Tonspuren hoch und landen so in der Suche.
//     Am Original-Titel erkennt man sie – und, wo YouTube sie meldet, an der Tonsprache.
export const ZIEL = 'ru'
export const SUCH_SPRACHE = 'youtube:lang=is'

/** Tonsprache je Video laut YouTube („es“, „en-US“ …) – leere Map, wenn die Abfrage nicht möglich ist. */
export async function audioSprachen(ids) {
  const schluessel = process.env.YOUTUBE_API_KEY
  if (!schluessel || !ids.length) return new Map()
  try {
    const antwort = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${ids.slice(0, 50).join(',')}&key=${schluessel}`)
    if (!antwort.ok) return new Map()
    const daten = await antwort.json()
    if (daten.error) return new Map()
    return new Map((daten.items ?? []).map((v) => [v.id, String(v.snippet?.defaultAudioLanguage || '').toLowerCase()]).filter(([, s]) => s))
  } catch {
    return new Map()
  }
}

/**
 * Ist der (Original-)Titel russisch? true / false – oder null, wenn er nichts verrät
 * (nur Zahlen, Emojis). Ukrainische und kasachische Buchstaben schließen den Titel aus.
 */
export function istZielsprache(titel) {
  const text = String(titel || '').toLowerCase()
  const buchstaben = text.match(/[a-zа-яёіїєґәғқңөұүһ]/g) ?? []
  if (buchstaben.length < 2) return null
  if (/[іїєґәғқңөұүһ]/.test(text)) return false
  const kyrillisch = buchstaben.filter((b) => /[а-яё]/.test(b)).length
  return kyrillisch >= 3 && kyrillisch / buchstaben.length >= 0.35
}
