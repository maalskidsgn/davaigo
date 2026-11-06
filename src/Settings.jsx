import FeedbackKnopf from './Feedback.jsx'
import { useRef, useState, useEffect } from 'react'
import { IconPfeil } from './icons.jsx'
import { API_URL, istApp } from './api.js'
import { usePremium, zurKasse, aboVerwalten, bezahlungBereit } from './premium.js'
import { kaufMoeglich } from './kauf.js'
import { levelFromXp, levelName, xpHeute } from './gamification.js'
import LevelEmblem from './LevelEmblem.jsx'
import Flamme from './Flamme.jsx'
import { supabaseBereit, db } from './supabase.js'
import { abmelden, anzeigename } from './auth.js'
import { tonVonSelbst, setzeTonVonSelbst } from './audio.js'
import { BenutzernameFeld } from './Rangliste.jsx'
import Blockierte from './Blockierte.jsx'
import Freunde from './Freunde.jsx'
import DuellKasten from './Duell.jsx'
import { ladeBenutzername, ladeProfilbild, setzeProfilbild, loescheProfilbild, bildAdresse } from './rangliste.js'

// Der Einstellungsbereich ("Mehr"): Profil-Übersicht, Abo, Lernziele,
// Benachrichtigungen, Daten-Sicherung und App-Infos.
// Preis und Status kommen aus Stripe bzw. der Datenbank – hier steht
// bewusst keine Zahl fest verdrahtet, sonst weicht die Anzeige
// irgendwann von dem ab, was tatsaechlich abgebucht wird.
import { einwilligungsStand, setzeEinwilligung, messungMoeglich } from './messung.js'
import { tr, gebiet, sprache, setzeSprache, SPRACHEN } from './sprache.js'

export default function Settings({
  onLeitfaden,
  onRundgang,
  progress,
  settings,
  setSettings,
  counts,
  nutzer,
  syncStatus,
  onLoginOeffnen,
  onRecht,
  onKasse,
  addXp,
}) {
  // Von den Start-Inseln: direkt zum Duell springen
  useEffect(() => {
    let ziel = null
    try {
      ziel = sessionStorage.getItem('profil-ziel')
      sessionStorage.removeItem('profil-ziel')
    } catch { /* egal */ }
    if (ziel === 'duell') {
      setTimeout(() => document.getElementById('profil-duell')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
    }
  }, [])
  const { premium, bis, status: aboStatus, neuLaden } = usePremium()
  // Steht die Rangliste in der Datenbank schon? undefined heisst nein
  // (oder noch nicht geladen). Solange zeigen wir Freunde und Duell
  // gar nicht erst – leere Kaesten, deren Knoepfe mit einer
  // Fehlermeldung antworten, sind schlimmer als keine Kaesten.
  const [ranglisteDa, setRanglisteDa] = useState(false)
  useEffect(() => {
    if (!nutzer?.id) return setRanglisteDa(false)
    ladeBenutzername(nutzer.id).then((n) => setRanglisteDa(n !== undefined))
  }, [nutzer])
  // Profilbild – erscheint in Rangliste, Freundesliste und Duellen
  const [bild, setBild] = useState(null)
  const [bildLaeuft, setBildLaeuft] = useState(false)
  const bildFeld = useRef(null)
  useEffect(() => {
    if (!nutzer?.id) return setBild(null)
    ladeProfilbild(nutzer.id).then(setBild)
  }, [nutzer])
  const [autoTon, setAutoTon] = useState(tonVonSelbst)
  const [bezahlbar, setBezahlbar] = useState(false)
  const [preis, setPreis] = useState(null)
  // Die Einwilligung zur Messung – zurücknehmen muss genauso leicht
  // sein wie zustimmen, deshalb steht der Schalter auch hier.
  const [messung, setMessung] = useState(() => einwilligungsStand() === 'ja')
  const [laedt, setLaedt] = useState(false)
  const [kaufFehler, setKaufFehler] = useState('')
  const [kasseInApp, setKasseInApp] = useState(false) // Formular in der App möglich?
  const [loeschLaeuft, setLoeschLaeuft] = useState(false)

  // Steht die Bezahlung bereit, und was kostet es?
  useEffect(() => {
    fetch(API_URL + '/api/bezahlung/status')
      .then((r) => r.json())
      .then((d) => {
        setBezahlbar(Boolean(d.bereit))
        setPreis(d.preis ?? null)
        // Ohne öffentlichen Schlüssel kann das Formular in der App
        // nicht laufen – dann bleibt es beim alten Weg über Stripe,
        // statt den Nutzer in eine Fehlermeldung laufen zu lassen.
        setKasseInApp(Boolean(d.schluessel))
      })
      .catch(() => setBezahlbar(false))
  }, [])

  // Nach der Rueckkehr von Stripe kann die Meldung noch unterwegs
  // sein – deshalb kurz warten und dann erneut nachsehen.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('bezahlt') !== 'ja') return
    window.history.replaceState({}, '', '/')
    const timer = setTimeout(neuLaden, 2500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const gueltigBis = bis ? bis.toLocaleDateString(gebiet()) : ''

  // Das Bezahlformular läuft jetzt IN der App (Bezahlen.jsx) statt
  // auf einer Stripe-Seite. Fehlt dem Server der öffentliche
  // Schlüssel, geht es wie früher zu Stripe – besser als nichts.
  async function kaufen() {
    setKaufFehler('')
    if (kasseInApp) return onKasse?.()

    setLaedt(true)
    try { await zurKasse() } catch (f) { setKaufFehler(f.message); setLaedt(false) }
  }

  async function verwalten() {
    setLaedt(true); setKaufFehler('')
    try { await aboVerwalten() } catch (f) { setKaufFehler(f.message); setLaedt(false) }
  }

  // Abmelden – die lokalen Daten bleiben erhalten
  async function abmeldenKlick() {
    if (!confirm(tr('Wirklich abmelden? Deine Daten bleiben gesichert.'))) return
    try {
      await abmelden()
    } catch (f) {
      alert(tr('Abmelden hat nicht geklappt: {0}', f.message))
    }
  }

  const fileInputRef = useRef(null)

  const level = levelFromXp(progress.xp)
  const heutigeXp = xpHeute(progress)
  const zielProzent = Math.min(100, Math.round((heutigeXp / settings.tagesziel) * 100))

  // Was in ein Backup gehoert – eine Liste, damit Export und Import
  // nicht auseinanderlaufen koennen. Frueher sicherte der Export nur
  // vier Schluessel: Lektionsfortschritt, Videostaende und die
  // Tagesserie waren nach dem Einspielen weg.
  const BACKUP_SCHLUESSEL = [
    'vokabeln',
    'videos',
    'videoFortschritt',
    'fortschritt',
    'einstellungen',
    'lektionen',
    'aktivitaet',
    'buecher',
  ]

  // Alle Lerndaten als Datei herunterladen (Backup)
  function exportData() {
    const daten = {}
    for (const schluessel of BACKUP_SCHLUESSEL) {
      const wert = localStorage.getItem(schluessel)
      if (wert !== null) daten[schluessel] = wert
    }
    const backup = {
      app: 'russisch-lernen',
      version: 2,
      exportiertAm: new Date().toISOString(),
      daten,
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'russisch-lernen-backup.json'
    a.click()
    // Erst freigeben, wenn der Download angestossen ist – sonst bricht
    // er in manchen Browsern ab.
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }

  // Backup-Datei wieder einlesen
  function importData(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (data.app !== 'russisch-lernen') throw new Error(tr('Falsche Datei'))

        if (data.daten) {
          // Neues Format (Version 2): fertige Werte je Schluessel
          for (const schluessel of BACKUP_SCHLUESSEL) {
            if (typeof data.daten[schluessel] === 'string') {
              localStorage.setItem(schluessel, data.daten[schluessel])
            }
          }
        } else {
          // Alte Backups weiter einlesen koennen
          for (const schluessel of ['vokabeln', 'videos', 'fortschritt', 'einstellungen']) {
            if (data[schluessel]) {
              localStorage.setItem(schluessel, JSON.stringify(data[schluessel]))
            }
          }
        }
        window.location.reload() // App mit den importierten Daten neu laden
      } catch {
        alert(tr('Das ist leider keine gültige Backup-Datei.'))
      }
    }
    reader.readAsText(file)
  }

  // Alles auf null zurücksetzen (mit doppelter Nachfrage!)
  //
  // Die Liste steht bewusst vollstaendig hier: Frueher blieben
  // Lektionsfortschritt, Videostaende und die Tagesserie stehen –
  // "Alles zurücksetzen" loeschte also gerade nicht alles.
  function resetData() {
    if (!confirm(tr('Wirklich ALLE Vokabeln, Videos und deinen Fortschritt löschen?'))) return
    if (!confirm(tr('Ganz sicher? Das kann nicht rückgängig gemacht werden!'))) return
    for (const schluessel of [
      'vokabeln',
      'videos',
      'videoFortschritt',
      'fortschritt',
      'einstellungen',
      'lektionen',
      'aktivitaet',
      'tagesplan',
      'nutzung',
      'buecher',
      'vorschlaege2',
    ]) {
      localStorage.removeItem(schluessel)
    }
    window.location.reload()
  }

  // Konto endgueltig loeschen – Pflicht fuer App Store und Play Store.
  // Zweimal nachfragen, beim zweiten Mal muss der Nutzer tippen.
  async function kontoLoeschen() {
    if (!confirm(tr('Dein Konto und ALLE Daten werden unwiderruflich gelöscht. Ein laufendes Abo wird gekündigt. Fortfahren?'))) return
    const bestaetigung = prompt(tr('Zum Bestätigen bitte LÖSCHEN eintippen:'))
    if (bestaetigung !== tr('LÖSCHEN')) return

    setLoeschLaeuft(true)
    try {
      const { data: sitzung } = await db.auth.getSession()
      const token = sitzung?.session?.access_token
      if (!token) throw new Error(tr('Bitte zuerst anmelden.'))

      const res = await fetch(API_URL + '/api/konto/loeschen', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const daten = await res.json()
      if (!res.ok) throw new Error(daten.error || tr('Löschen fehlgeschlagen.'))

      localStorage.clear()
      await db.auth.signOut()
      window.location.href = '/'
    } catch (f) {
      alert(f.message)
      setLoeschLaeuft(false)
    }
  }

  return (
    <div className="settings">
      {/* ---------- Profil-Übersicht ---------- */}
      <div className="profile-card">
        <LevelEmblem level={level} groesse={64} />
        <div className="profile-info">
          <div className="profile-name">{levelName(level)}</div>
          <div className="profile-rang">{tr('Level {0}', level)}</div>
          <div className="profile-stats">
            {progress.xp} XP · <Flamme an={progress.streak > 0} groesse={16} /> {tr('{0} Tage', progress.streak)} · {tr('{0} Wörter', counts.woerter)} · {tr('{0} Videos', counts.videos)}
          </div>
        </div>
      </div>

      {/* ---------- Konto ---------- */}
      {supabaseBereit && (
        <>
          <h2 className="settings-heading">{tr('Dein Konto')}</h2>
          {nutzer ? (
            <>
              <div className="konto-karte">
                <button
                  className="konto-avatar konto-avatar-knopf"
                  onClick={() => bildFeld.current?.click()}
                  disabled={bildLaeuft}
                  aria-label={bild ? tr('Profilbild ändern') : tr('Profilbild hinzufügen')}
                >
                  {bild ? (
                    <img src={bildAdresse(bild)} alt="" />
                  ) : (
                    anzeigename(nutzer).charAt(0).toUpperCase()
                  )}
                  <span className="konto-avatar-stift" aria-hidden="true">{bildLaeuft ? '…' : '✎'}</span>
                </button>
                <input
                  ref={bildFeld}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={async (e) => {
                    const datei = e.target.files?.[0]
                    e.target.value = ''
                    if (!datei) return
                    setBildLaeuft(true)
                    try {
                      await setzeProfilbild(nutzer.id, datei)
                      setBild(await ladeProfilbild(nutzer.id))
                    } catch (f) {
                      alert(f.message)
                    } finally {
                      setBildLaeuft(false)
                    }
                  }}
                />
                <div className="konto-text">
                  <div className="konto-name">{anzeigename(nutzer)}</div>
                  <div className="konto-mail">{nutzer.email}</div>
                </div>
                <span className="konto-sync">
                  {syncStatus === 'laeuft' ? tr('⏳ Gleicht ab…') : tr('✓ Gesichert')}
                </span>
              </div>
              <p className="settings-hint">
                {bild
                  ? tr('Tippe auf dein Bild, um es zu ändern.')
                  : tr('Tippe auf den Kreis, um ein Profilbild hinzuzufügen. Es erscheint in Rangliste und Freundesliste.')}
                {bild && (
                  <>
                    {' '}
                    <button
                      className="btn-plain konto-bild-weg"
                      onClick={async () => {
                        await loescheProfilbild(nutzer.id)
                        setBild(null)
                      }}
                    >
                      {tr('Bild entfernen')}
                    </button>
                  </>
                )}
              </p>
              <p className="settings-hint">
                {tr('Dein Fortschritt wird automatisch gesichert und steht auf allen Geräten zur Verfügung.')}
              </p>
              <BenutzernameEinstellung nutzerId={nutzer.id} />

              {/* Zeigt sich nur, wenn wirklich jemand blockiert ist */}
              <Blockierte />

              <button className="btn-outline" onClick={abmeldenKlick}>
                {tr('Abmelden')}
              </button>
            </>
          ) : (
            <>
              <p className="settings-hint">
                {tr('Ohne Konto liegen deine Vokabeln nur auf diesem Gerät. Mit Konto sind sie gesichert und du lernst auf Handy und Rechner am gleichen Stand weiter.')}
              </p>
              <button className="btn" onClick={onLoginOeffnen}>
                {tr('Anmelden oder Konto anlegen')}
              </button>
            </>
          )}
        </>
      )}

      {/* ---------- Freunde ----------
          Gleich unter dem Konto: Das Soziale gehört zum eigenen
          Konto, und ein sechster Reiter unten würde die Leiste
          unübersichtlich machen. Ohne Konto gibt es nichts zu
          zeigen – ohne Benutzername erst recht nicht. */}
      {supabaseBereit && nutzer && ranglisteDa && (
        <>
          <h2 className="settings-heading">{tr('Freunde')}</h2>
          <div className="settings-card">
            <Freunde />
          </div>

          {/* ---------- Duell ----------
              Direkt unter den Freunden: Gegen wen man spielt, steht
              eine Kachel weiter oben. */}
          <h2 className="settings-heading" id="profil-duell">{tr('Duell')}</h2>
          <div className="settings-card">
            <p className="settings-hint">
              {tr('Sieben Vokabeln, zehn Sekunden pro Frage. Ihr bekommt dieselben – wer mehr trifft, gewinnt.')}
            </p>
            <DuellKasten addXp={addXp} />
          </div>
        </>
      )}

      {/* ---------- Abo ---------- */}
      {/* In der Store-App nur zeigen, wenn dort gekauft werden kann oder schon Premium besteht */}
      {(!istApp || premium || kaufMoeglich()) && (
      <>
      <h2 className="settings-heading">{tr('Dein Abo')}</h2>
      <div className="plan-grid">
        <div className="plan-card plan-active">
          <div className="plan-name">
            {tr('Kostenlos')}{' '}
            {!premium && <span className="plan-badge">{tr('Aktueller Plan')}</span>}
          </div>
          <ul className="plan-features">
            <li>{tr('Unbegrenzt Videos lesen')}</li>
            <li>{tr('Vokabeltrainer mit Spaced Repetition')}</li>
            <li>{tr('XP, Level & Tagesserie')}</li>
          </ul>
        </div>
        <div className="plan-card plan-premium">
          <div className="plan-name">
            {tr('Premium')}{' '}
            {premium ? (
              <span className="plan-badge">{tr('Dein Plan')}</span>
            ) : !bezahlbar && !kaufMoeglich() ? (
              <span className="plan-badge badge-soon">{tr('Bald verfügbar')}</span>
            ) : null}
          </div>
          <ul className="plan-features">
            <li>{tr('Unbegrenzte KI-Vokabellisten')}</li>
            <li>{tr('Unbegrenzte zweisprachige E-Books')}</li>
            <li>{tr('Eigene Videos ohne Begrenzung')}</li>
          </ul>

          {preis && !premium && !istApp && (
            <div className="price-options">
              <div className="price-row price-best">
                <span>{preis.zeitraum === 'year' ? tr('Jährlich') : tr('Monatlich')}</span>
                <b>
                  {preis.betrag.toLocaleString(gebiet(), {
                    style: 'currency',
                    currency: preis.waehrung,
                  })}
                </b>
              </div>
            </div>
          )}

          {premium ? (
            <>
              <p className="abo-status">
                {!gueltigBis
                  ? tr('Aktiv – unbegrenzt')
                  : aboStatus === 'gekuendigt'
                    ? tr('Gekündigt – läuft noch bis {0}', gueltigBis)
                    : tr('Aktiv – verlängert sich am {0}', gueltigBis)}
              </p>
              {!istApp && (
                <button onClick={verwalten} disabled={laedt}>
                  {laedt ? tr('Öffnet …') : tr('Abo verwalten')}
                </button>
              )}
            </>
          ) : istApp && kaufMoeglich() ? (
            <button onClick={onKasse}>{tr('Premium holen')}</button>
          ) : istApp ? (
            /* Kein Kauf und kein Link nach draussen – nur der neutrale
               Hinweis, dass ein bestehendes Abo hier ankommt. */
            <p className="abo-status">
              {tr('Ein bestehendes Premium-Abo wird nach der Anmeldung automatisch erkannt.')}
            </p>
          ) : bezahlbar ? (
            <button onClick={kaufen} disabled={laedt}>
              {laedt ? tr('Weiterleitung …') : tr('Premium holen')}
            </button>
          ) : (
            <button disabled title={tr('Bezahlung wird gerade eingerichtet')}>
              {tr('Demnächst')}
            </button>
          )}

          {kaufFehler && <p className="error">{kaufFehler}</p>}
        </div>
      </div>
      </>
      )}

      {/* ---------- Hilfe ----------
          Der Leitfaden war bisher von nirgends verlinkt – die Seite
          gab es, nur kam niemand hin. */}
      {onLeitfaden && (
        <button className="leitfaden-zeile" onClick={onLeitfaden}>
          <span className="leitfaden-zeile-text">
            <b>{tr('So nutzt du Davaigo')}</b>
            <span>{tr('Deine Reise durch die App – und was wir uns dabei gedacht haben.')}</span>
          </span>
          <IconPfeil groesse={17} />
        </button>
      )}
      {onRundgang && (
        <button className="leitfaden-zeile" onClick={onRundgang}>
          <span className="leitfaden-zeile-text">
            <b>{tr('Rundgang starten')}</b>
            <span>{tr('Einmal durch alle Bereiche, in einer Minute.')}</span>
          </span>
          <IconPfeil groesse={17} />
        </button>
      )}

      {/* ---------- Sprache der Oberfläche ---------- */}
      <h2 className="settings-heading">{tr('Sprache')}</h2>
      <div className="settings-card">
        <div className="goal-row">
          {SPRACHEN.map(([kuerzel, name]) => (
            <button
              key={kuerzel}
              className={'chip ' + (sprache() === kuerzel ? 'chip-active' : '')}
              onClick={() => setzeSprache(kuerzel)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- Lernziel ---------- */}
      <h2 className="settings-heading">{tr('Tagesziel')}</h2>
      <div className="settings-card">
        <div className="goal-row">
          {[10, 20, 30, 50].map((ziel) => (
            <button
              key={ziel}
              className={'chip ' + (settings.tagesziel === ziel ? 'chip-active' : '')}
              onClick={() => setSettings((s) => ({ ...s, tagesziel: ziel }))}
            >
              {ziel} XP
            </button>
          ))}
        </div>
        <div className="goal-progress">
          <div className="xp-bar goal-bar">
            <div className="xp-bar-fill" style={{ width: zielProzent + '%' }} />
          </div>
          <span className="goal-text">
            {tr('{0}/{1} XP heute {2}', heutigeXp, settings.tagesziel, zielProzent >= 100 && tr('– geschafft! 🎉'))}
          </span>
        </div>
      </div>

      {/* ---------- Benachrichtigungen ---------- */}
      {/* ---------- Ton ---------- */}
      <h2 className="settings-heading">{tr('Ton')}</h2>
      <div className="settings-card">
        <label className="settings-row">
          <div>
            <div className="row-title">{tr('Wörter von selbst vorlesen')}</div>
            <div className="row-hint">
              {tr('Spielt die Aufnahme, sobald ein neues Wort erscheint – ohne tippen. Aus, wenn du unterwegs oder im Büro lernst.')}
            </div>
          </div>
          <span className="switch">
            <input
              type="checkbox"
              checked={autoTon}
              onChange={(e) => {
                setAutoTon(e.target.checked)
                setzeTonVonSelbst(e.target.checked)
              }}
            />
            <span className="slider" />
          </span>
        </label>
      </div>

      <h2 className="settings-heading">{tr('Benachrichtigungen')}</h2>
      <div className="settings-card">
        <label className="settings-row">
          <div>
            <div className="row-title">{tr('Lern-Erinnerungen')}</div>
            <div className="row-hint">
              {tr('Erinnert dich an fällige Vokabeln (als Push-Nachricht ab der App-Version)')}
            </div>
          </div>
          <span className="switch">
            <input
              type="checkbox"
              checked={settings.erinnerungen}
              onChange={(e) =>
                setSettings((s) => ({ ...s, erinnerungen: e.target.checked }))
              }
            />
            <span className="slider" />
          </span>
        </label>
      </div>

      {/* ---------- Daten ---------- */}
      <h2 className="settings-heading">{tr('Deine Daten')}</h2>
      <div className="settings-card">
        <div className="settings-row">
          <div>
            <div className="row-title">{tr('Backup erstellen')}</div>
            <div className="row-hint">{tr('Lädt alle Vokabeln & Fortschritte als Datei herunter')}</div>
          </div>
          <button className="btn-small" onClick={exportData}>
            {tr('Exportieren')}
          </button>
        </div>
        <div className="settings-row">
          <div>
            <div className="row-title">{tr('Backup einspielen')}</div>
            <div className="row-hint">{tr('Stellt Daten aus einer Backup-Datei wieder her')}</div>
          </div>
          <button className="btn-small" onClick={() => fileInputRef.current.click()}>
            {tr('Importieren')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            hidden
            onChange={importData}
          />
        </div>
        <div className="settings-row">
          <div>
            <div className="row-title">{tr('Alles zurücksetzen')}</div>
            <div className="row-hint">
              {tr('Leert diese App – dein Konto bleibt bestehen')}
            </div>
          </div>
          <button className="btn-small btn-danger" onClick={resetData}>
            {tr('Zurücksetzen')}
          </button>
        </div>

        {/* Ohne Konto gibt es nichts zu loeschen – der Knopf fuehrte
            sonst nach zwei Warnungen nur in eine Fehlermeldung. */}
        {nutzer && (
        <div className="settings-row">
          <div>
            <div className="row-title">{tr('Konto löschen')}</div>
            <div className="row-hint">
              {tr('Entfernt dein Konto und alle Daten endgültig. Ein laufendes Abo wird dabei gekündigt.')}
            </div>
          </div>
          <button
            className="btn-small btn-danger"
            onClick={kontoLoeschen}
            disabled={loeschLaeuft}
          >
            {loeschLaeuft ? tr('Löscht …') : tr('Konto löschen')}
          </button>
        </div>
        )}
      </div>

      {/* ---------- Messung ---------- */}
      {messungMoeglich() && (
        <>
          <h2 className="settings-heading">{tr('Messung')}</h2>
          <div className="settings-card">
            <label className="settings-row">
              <div>
                <div className="row-title">{tr('Anonyme Reichweitenmessung')}</div>
                <div className="row-hint">
                  {tr('Zählt mit Google Analytics, wie viele Menschen Davaigo benutzen. Aus heißt: kein Skript, keine Cookies. Davaigo funktioniert genauso.')}
                </div>
              </div>
              <span className="switch">
                <input
                  type="checkbox"
                  checked={messung}
                  onChange={(e) => {
                    setMessung(e.target.checked)
                    setzeEinwilligung(e.target.checked)
                  }}
                />
                <span className="slider" />
              </span>
            </label>
          </div>
        </>
      )}

      <div className="settings-card">
        <div className="settings-row">
          <div>
            <div className="row-title">{tr('Feedback und Kritik')}</div>
            <div className="row-hint">{tr('Sag mir, was gut ist und was besser werden soll.')}</div>
          </div>
          <FeedbackKnopf />
        </div>
      </div>

      {/* ---------- Rechtliches ---------- */}
      {/* Auch hier erreichbar, nicht nur im Fuß der Startseite: Wer
          angemeldet ist, sieht die Startseite nie wieder. */}
      <h2 className="settings-heading">{tr('Rechtliches')}</h2>
      <div className="settings-card">
        {[
          ['impressum', tr('Impressum')],
          ['datenschutz', tr('Datenschutzerklärung')],
          ['agb', tr('AGB & Widerrufsrecht')],
        ].map(([kennung, text]) => (
          <div className="settings-row" key={kennung}>
            <div>
              <div className="row-title">{text}</div>
            </div>
            <button className="btn-small" onClick={() => onRecht(kennung)}>
              {tr('Lesen')}
            </button>
          </div>
        ))}
      </div>

      {/* ---------- Über ---------- */}
      <p className="about-note">{tr('Mit Herz entwickelt von Klarwerk Digital')}</p>
    </div>
  )
}

/**
 * Benutzername für die Rangliste ansehen und ändern.
 *
 * Gibt null zurück, solange die Rangliste nicht verfügbar ist –
 * also auch dann, wenn die Migration in der Datenbank noch fehlt.
 * Ein Feld, das beim Speichern scheitert, wäre schlimmer als keins.
 */
function BenutzernameEinstellung({ nutzerId }) {
  const [name, setName] = useState(undefined)
  useEffect(() => {
    ladeBenutzername(nutzerId).then(setName)
  }, [nutzerId])
  if (name === undefined) return null
  return (
    <div className="name-einstellung">
      <h3>{tr('Benutzername')}</h3>
      <p className="settings-hint">
        {tr('So erscheinst du in der Rangliste auf der Startseite. Jeden Namen gibt es nur einmal.')}
      </p>
      <BenutzernameFeld
        key={name ?? ''}
        nutzerId={nutzerId}
        start={name ?? ''}
        knopf={name ? tr('Ändern') : tr('Speichern')}
        onGespeichert={setName}
      />
    </div>
  )
}
