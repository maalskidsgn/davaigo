/**
 * Anmeldung und Konten für Davaigo.
 *
 * Wichtig: Die App funktioniert auch OHNE Konto weiter – dann liegen
 * alle Daten wie bisher nur im Browser. Ein Konto bringt zwei Dinge:
 * Sicherung der Daten und Nutzung auf mehreren Geräten.
 */

import { uebernimmMerker } from './kontoMerker.js'
import { herkunft } from './herkunft.js'
import { useState, useEffect } from 'react'
import { db, supabaseBereit } from './supabase.js'
import { tr, sprache } from './sprache.js'

// ---------------------------------------------------------------
//  Fehlermeldungen auf Deutsch
// ---------------------------------------------------------------
// Supabase antwortet auf Englisch; hier die häufigsten Fälle übersetzt.
const MELDUNGEN = {
  'Invalid login credentials': tr('E-Mail oder Passwort stimmt nicht.'),
  'User already registered': tr('Für diese E-Mail gibt es schon ein Konto. Melde dich einfach an.'),
  'Email not confirmed': tr('Bitte bestätige zuerst den Link in deiner E-Mail.'),
  'Password should be at least 6 characters':
    tr('Das Passwort braucht mindestens 6 Zeichen.'),
  'Unable to validate email address: invalid format':
    tr('Diese E-Mail-Adresse sieht nicht richtig aus.'),
  'For security purposes, you can only request this after 60 seconds.':
    tr('Kurz warten – aus Sicherheitsgründen geht das nur einmal pro Minute.'),
  'Signup requires a valid password': tr('Bitte gib ein Passwort ein.'),
  'Email rate limit exceeded':
    tr('Gerade wurden zu viele E-Mails verschickt. Bitte später noch einmal versuchen.'),
}

function uebersetzeFehler(fehler) {
  if (!fehler) return ''
  const text = fehler.message ?? ''

  if (MELDUNGEN[text]) return MELDUNGEN[text]

  // Meldungen mit wechselndem Inhalt (z. B. die genannte Adresse)
  if (/is invalid/.test(text) && /email/i.test(text)) {
    return tr('Diese E-Mail-Adresse wird nicht akzeptiert. Bitte nimm deine richtige Adresse.')
  }
  if (/password/i.test(text) && /least/i.test(text)) {
    return tr('Das Passwort braucht mindestens 6 Zeichen.')
  }
  return text
}

// ---------------------------------------------------------------
//  Konto anlegen / anmelden / abmelden
// ---------------------------------------------------------------

// Wohin der Link in der Bestätigungs- oder Passwort-Mail führt.
//
// Fest auf davaigo.de, nicht window.location.origin: In der Store-App
// wäre das "capacitor://localhost" – ein Link, den kein Mailprogramm
// öffnen kann. Und beim Entwickeln wäre es localhost, was vom Handy
// aus ins Leere zeigt. Die Mail kommt immer bei einem Menschen an,
// der sie irgendwo öffnet – der einzige Ort, der von überall
// erreichbar ist, ist die echte Domain.
//
// Supabase lässt nur Adressen zu, die dort unter "Redirect URLs"
// eingetragen sind (Authentication → URL Configuration). davaigo.de
// muss dort stehen, sonst fällt Supabase still auf die Site URL
// zurück.
// Wer sich auf der englischen Adresse app.davaigo.com anmeldet, kommt
// auch dorthin zurück (steht ebenfalls unter "Redirect URLs").
const MAIL_RUECKKEHR =
  typeof location !== 'undefined' && location.hostname === 'app.davaigo.com'
    ? 'https://app.davaigo.com'
    : 'https://davaigo.de'

/**
 * Merkt im Konto, ob Mails auf Englisch kommen sollen.
 *
 * Die Mail-Vorlagen von Supabase und der Server lesen das Feld. Nur
 * "englisch: true/false" statt der Sprache als Text: Alte Konten haben das
 * Feld nicht, und bei einem Vergleich mit einem fehlenden Wert bricht die
 * Vorlage ab. So ist "fehlt" einfach Deutsch, und die Mail geht trotzdem raus.
 */
// Konten über Google/Apple bekommen die Herkunft nachträglich – aber
// nur frische (unter zwei Tagen), sonst stünde bei alten Konten die
// Herkunft dieses Geräts statt der echten.
let herkunftGemerkt = false
function merkeHerkunftImKonto(nutzer) {
  if (!nutzer || herkunftGemerkt || nutzer.user_metadata?.herkunft) return
  const alter = Date.now() - new Date(nutzer.created_at).getTime()
  if (!(alter < 2 * 86400000)) return
  const h = herkunft()
  if (!h) return
  herkunftGemerkt = true
  setTimeout(() => db.auth.updateUser({ data: { herkunft: h } }).catch(() => {}), 0)
}

let mailSpracheGemerkt = false
function merkeMailSprache(nutzer) {
  if (!nutzer || mailSpracheGemerkt) return
  const englisch = sprache() === 'en'
  if (Boolean(nutzer.user_metadata?.englisch) === englisch) return
  mailSpracheGemerkt = true
  // Setzen löst ein weiteres Anmelde-Ereignis aus, darum nur einmal.
  // Klappt es nicht, ist das nicht schlimm: Dann kommt die Mail auf Deutsch.
  setTimeout(() => db.auth.updateUser({ data: { englisch } }).catch(() => {}), 0)
}

/** Legt ein neues Konto an. */
export async function registrieren(email, passwort, name) {
  const { data, error } = await db.auth.signUp({
    email: email.trim(),
    password: passwort,
    options: {
      data: { name: name?.trim() || undefined, englisch: sprache() === 'en', herkunft: herkunft() },
      // Fehlte bisher ganz – dadurch landete der Bestätigungslink auf
      // Supabases Site URL, und die stand auf localhost:3000.
      emailRedirectTo: MAIL_RUECKKEHR,
    },
  })
  if (error) throw new Error(uebersetzeFehler(error))

  // Gibt es die Adresse schon, meldet Supabase KEINEN Fehler und
  // schickt auch keine Mail (Schutz gegen Konten-Raten). Erkennbar
  // ist es nur an der leeren identities-Liste.
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return { schonVorhanden: true }
  }

  // Wenn Supabase eine Bestätigungs-Mail verschickt, gibt es noch keine Sitzung.
  return { nutzer: data.user, sitzung: data.session, mailBestaetigen: !data.session }
}

/** Meldet einen bestehenden Nutzer an. */
export async function anmelden(email, passwort) {
  const { data, error } = await db.auth.signInWithPassword({
    email: email.trim(),
    password: passwort,
  })
  if (error) throw new Error(uebersetzeFehler(error))
  return data.user
}

/** Meldet ab – die lokalen Daten bleiben, bis sich ein anderes Konto anmeldet. */
export async function abmelden() {
  const { error } = await db.auth.signOut()
  if (error) throw new Error(uebersetzeFehler(error))
}

/**
 * Anmeldung über Google oder Apple. Supabase leitet zum Anbieter
 * und danach zurück auf die Seite – dort steht die Sitzung bereit.
 * @param {'google'|'apple'} anbieter
 */
export async function mitAnbieter(anbieter) {
  const { error } = await db.auth.signInWithOAuth({
    provider: anbieter,
    options: { redirectTo: window.location.origin },
  })
  if (error) throw new Error(uebersetzeFehler(error))
}

/**
 * Welche Anbieter sind in Supabase eingeschaltet? So erscheinen die
 * Knöpfe von selbst, sobald ein Anbieter eingerichtet ist.
 */
export async function aktiveAnbieter() {
  try {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
    const r = await fetch(url + '/auth/v1/settings', { headers: { apikey: key } })
    const d = await r.json()
    return ['apple', 'google'].filter((a) => d.external?.[a])
  } catch {
    return []
  }
}

/** Schickt eine E-Mail zum Zurücksetzen des Passworts. */
export async function passwortVergessen(email) {
  const { error } = await db.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: MAIL_RUECKKEHR,
  })
  if (error) throw new Error(uebersetzeFehler(error))
}

// ---------------------------------------------------------------
//  React-Hook: wer ist gerade angemeldet?
// ---------------------------------------------------------------

// ---------------------------------------------------------------
//  Wem gehoeren die Lerndaten auf diesem Geraet?
// ---------------------------------------------------------------
// Beim Abmelden bleiben die Daten im Speicher, und beim Anmelden
// werden sie ins Konto uebernommen - gewollt fuer alle, die erst ohne
// Konto lernen. Bis 05.11. galt das aber auch, wenn sich danach ein
// ANDERES Konto anmeldete: Dessen Konto bekam dann den kompletten
// Stand des vorigen. Deshalb merken wir uns, wem die Daten gehoeren.
const BESITZER = 'daten-besitzer'
// Geraete-Einstellungen, keine Lerndaten - die bleiben stehen.
const BLEIBEN = ['oberflaeche-sprache', 'messungEinwilligung', 'install-hinweis', BESITZER]

/**
 * Meldet sich ein anderes Konto an als das, dem die Daten hier
 * gehoeren, wird der Speicher geleert und die Seite neu geladen.
 * Liefert dann true - der Aufrufer setzt den Nutzer nicht mehr.
 */
function fremdeDatenWeg(user) {
  if (!user) return false
  try {
    const besitzer = localStorage.getItem(BESITZER)
    if (besitzer === user.id) return false
    if (besitzer) {
      for (const k of Object.keys(localStorage)) {
        // sb-… ist die Anmeldung selbst
        if (k.startsWith('sb-') || k.startsWith('CapacitorStorage.') || BLEIBEN.includes(k)) continue
        localStorage.removeItem(k)
      }
    }
    localStorage.setItem(BESITZER, user.id)
    if (!besitzer) return false // Daten ohne Konto: werden uebernommen
  } catch {
    return false
  }
  window.location.reload()
  return true
}

/**
 * Liefert den angemeldeten Nutzer (oder null) und meldet sich
 * automatisch bei jeder Änderung neu.
 *
 *   const { nutzer, laedt } = useNutzer()
 */
export function useNutzer() {
  const [nutzer, setNutzer] = useState(null)
  const [laedt, setLaedt] = useState(supabaseBereit)
  const [passwortNeuSetzen, setPasswortNeuSetzen] = useState(false)

  useEffect(() => {
    if (!supabaseBereit) return

    // Beim Start: gibt es noch eine gültige Sitzung?
    db.auth.getSession().then(({ data }) => {
      if (fremdeDatenWeg(data.session?.user)) return
      uebernimmMerker(data.session?.user)
      setNutzer(data.session?.user ?? null)
      setLaedt(false)
    })

    // Danach: auf An- und Abmelden reagieren
    const { data: beobachter } = db.auth.onAuthStateChange((ereignis, sitzung) => {
      if (fremdeDatenWeg(sitzung?.user)) return
      uebernimmMerker(sitzung?.user)
      setNutzer(sitzung?.user ?? null)
      setLaedt(false)
      merkeMailSprache(sitzung?.user)
      merkeHerkunftImKonto(sitzung?.user)

      // Der Klick in der "Passwort vergessen"-Mail meldet den Nutzer
      // an – aber das alte Passwort gilt weiter, und er hat das neue
      // immer noch nicht im Kopf. Ohne dieses Signal stünde er einfach
      // in der App, wüsste nicht, dass er jetzt eines setzen muss, und
      // hätte es beim nächsten Mal wieder vergessen. Bis zum 23.08.
      // war genau das der Zustand: Mail kam, Link ging, Formular fehlte.
      if (ereignis === 'PASSWORD_RECOVERY') setPasswortNeuSetzen(true)
    })

    return () => beobachter.subscription.unsubscribe()
  }, [])

  return { nutzer, laedt, passwortNeuSetzen, passwortGesetzt: () => setPasswortNeuSetzen(false) }
}

/** Setzt nach dem Klick in der Wiederherstellungs-Mail das neue Passwort. */
export async function neuesPasswortSetzen(passwort) {
  const { error } = await db.auth.updateUser({ password: passwort })
  if (error) throw new Error(uebersetzeFehler(error))
}

/** Anzeigename fürs Profil – fällt auf den Teil vor dem @ zurück. */
export function anzeigename(nutzer) {
  if (!nutzer) return ''
  return nutzer.user_metadata?.name || nutzer.email?.split('@')[0] || tr('Du')
}
