// Die Adresse des Davaigo-Servers.
//
// Drei Fälle, die sich unterscheiden:
//
// 1. Lokal beim Entwickeln → leer. Vite leitet /api an localhost:8787
//    weiter (siehe vite.config.js).
// 2. Im Browser auf davaigo.de → VITE_API_URL zeigt auf den Server.
// 3. In der Android-App → hier ist eine VOLLSTÄNDIGE Adresse Pflicht.
//    Die App lädt ihre Dateien nicht von einem Webserver, sondern aus
//    dem eigenen Paket. Ein Pfad wie "/api/transcript" würde deshalb
//    ins Leere zeigen statt zum Server.

const AUS_UMGEBUNG = import.meta.env.VITE_API_URL || ''

/** Läuft die App gerade als installierte App statt im Browser? */
export const istApp =
  typeof window !== 'undefined' &&
  (window.Capacitor?.isNativePlatform?.() ||
    ['capacitor:', 'file:'].includes(window.location?.protocol))

// Notfall-Adresse: Ohne sie stünde die App ohne Server da. Sie greift
// nur, wenn beim Bauen vergessen wurde, VITE_API_URL zu setzen.
const NOTFALL = 'https://api.davaigo.de'

export const API_URL = AUS_UMGEBUNG || (istApp ? NOTFALL : '')

// Beim Entwickeln früh warnen statt später rätselhafte Fehler zu suchen
if (istApp && !AUS_UMGEBUNG) {
  console.warn(
    'VITE_API_URL war beim Bauen nicht gesetzt – die App nutzt die ' +
      'hinterlegte Notfall-Adresse. Für Veröffentlichungen bitte setzen.'
  )
}

/**
 * Die Kopfzeilen für einen Aufruf, der Geld kostet.
 *
 * Seit dem 30.10.2026 verlangen die KI-Endpunkte eine Anmeldung und
 * zählen ein Tageskontingent mit. Vorher standen sie offen: Der
 * Zähler lag allein im Browser (src/limits.js), und ein Zähler in
 * localStorage ist keine Grenze, sondern eine Bitte.
 *
 * Gibt es gerade keine Sitzung, kommen nur die Standard-Kopfzeilen
 * zurück – der Server antwortet dann mit 401, und das ist richtig so.
 */
export async function kiKopf() {
  const basis = { 'Content-Type': 'application/json' }
  try {
    const { db, supabaseBereit } = await import('./supabase.js')
    if (!supabaseBereit) return basis
    const { data } = await db.auth.getSession()
    const token = data?.session?.access_token
    return token ? { ...basis, Authorization: 'Bearer ' + token } : basis
  } catch {
    return basis
  }
}
