import { useEffect, useState } from 'react'
import Logo from './Logo.jsx'
import PremiumDanke from './PremiumDanke.jsx'
import {
  ladeAngebote, kaufe, stelleWiederHer, warteAufFreischaltung, plattform,
} from './kauf.js'
import { tr } from './sprache.js'

/**
 * Die Kasse in der App – Apple App Store oder Google Play.
 *
 * Im Browser übernimmt Bezahlen.jsx mit Stripe. Hier geht es bewusst
 * schlichter zu: Es gibt kein Formular, keine Kartennummer und keine
 * Rechnungsadresse. Der Store fragt das alles selbst ab, sobald man
 * auf den Knopf tippt. Was bleibt, ist die Auswahl.
 */
export default function KaufNativ({ onFertig, onAbbrechen }) {
  const [angebote, setAngebote] = useState(null) // null = lädt
  const [gewaehlt, setGewaehlt] = useState('')
  const [laeuft, setLaeuft] = useState('')       // '' | 'kauf' | 'wieder'
  const [fehler, setFehler] = useState('')
  const [hinweis, setHinweis] = useState('')
  const [danke, setDanke] = useState(null) // null | { verzoegert }

  const laden = plattform() === 'ios' ? tr('App Store') : tr('Google Play')

  useEffect(() => {
    let aktiv = true
    ladeAngebote()
      .then((a) => {
        if (!aktiv) return
        setAngebote(a)
        // Das Jahresabo vorauswählen, sonst das erste – irgendetwas
        // soll markiert sein, damit der Knopf nicht ins Leere zeigt.
        setGewaehlt(a.find((x) => x.id.includes('annual'))?.id || a[0]?.id || '')
      })
      .catch((f) => {
        // Rohe Fehlertexte des Kauf-Dienstes sind nichts für Nutzer.
        console.warn(f)
        if (aktiv) setAngebote([])
      })
    return () => { aktiv = false }
  }, [])

  async function kaufen() {
    const a = angebote.find((x) => x.id === gewaehlt)
    if (!a) return
    setFehler('')
    setHinweis('')
    setLaeuft('kauf')
    try {
      const ergebnis = await kaufe(a.paket)
      if (ergebnis === 'abgebrochen') return setLaeuft('')
      setHinweis(tr('Zahlung angenommen. Wird freigeschaltet …'))
      // Der Store hat bezahlt, aber unsere Datenbank weiss es erst,
      // wenn die Meldung durch ist. Kurz warten statt den Nutzer mit
      // der Premium-Werbung zurückzulassen.
      const frei = await warteAufFreischaltung()
      setDanke({ verzoegert: !frei })
    } catch (f) {
      setFehler(f.message)
    } finally {
      setLaeuft('')
    }
  }

  async function wiederherstellen() {
    setFehler('')
    setHinweis('')
    setLaeuft('wieder')
    try {
      const hat = await stelleWiederHer()
      if (!hat) {
        setHinweis(tr('Auf diesem {0}-Konto ist kein Kauf hinterlegt.', laden))
        return
      }
      setHinweis(tr('Kauf gefunden. Wird freigeschaltet …'))
      await warteAufFreischaltung()
      onFertig?.()
    } catch (f) {
      setFehler(f.message)
    } finally {
      setLaeuft('')
    }
  }

  if (danke) return <PremiumDanke verzoegert={danke.verzoegert} onWeiter={onFertig} />

  return (
    <div className="kassen-seite">
      <header className="kassen-kopf">
        <button className="btn-zurueck" onClick={onAbbrechen}>
          <span className="zurueck-pfeil" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
                 strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </span>
          {tr('Zurück')}
        </button>
        <Logo />
        <span className="kassen-sicher">{tr('über {0}', laden)}</span>
      </header>

      <div className="kn">
        <h1 className="kn-titel">{tr('Davaigo Premium')}</h1>
        <p className="kn-unter">
          {tr('Alle Lektionen, unbegrenzte KI-Vokabellisten, eigene Texte und Sätze.')}
        </p>

        {angebote === null ? (
          <p className="kn-laedt">{tr('Angebote werden geladen …')}</p>
        ) : angebote.length === 0 ? (
          <p className="kn-laedt">
            {tr('Gerade sind keine Angebote verfügbar. Versuch es später nochmal.')}
          </p>
        ) : (
          <>
            <div className="kn-tarife" role="radiogroup" aria-label={tr('Tarif wählen')}>
              {angebote.map((a) => (
                <button
                  key={a.id}
                  role="radio"
                  aria-checked={gewaehlt === a.id}
                  className={'kn-tarif' + (gewaehlt === a.id ? ' ist-aktiv' : '')}
                  onClick={() => setGewaehlt(a.id)}
                  disabled={Boolean(laeuft)}
                >
                  <span className="kn-tarif-name">{a.name}</span>
                  <span className="kn-tarif-preis">{a.preisText}</span>
                  <span className="kn-tarif-zeit">{a.zeitraum}</span>
                </button>
              ))}
            </div>

            <button className="kn-kaufen" onClick={kaufen} disabled={Boolean(laeuft) || !gewaehlt}>
              {laeuft === 'kauf' ? tr('Einen Moment …') : tr('Jetzt holen')}
            </button>

            {/* Apple verlangt diesen Knopf in jeder App mit Käufen:
                Wer das Handy wechselt, muss ohne Support an seinen
                bezahlten Zugang kommen. */}
            <button className="kn-wieder" onClick={wiederherstellen} disabled={Boolean(laeuft)}>
              {laeuft === 'wieder' ? tr('Wird gesucht …') : tr('Käufe wiederherstellen')}
            </button>
          </>
        )}

        {hinweis && <p className="kn-hinweis">{hinweis}</p>}
        {fehler && <p className="kn-fehler">{fehler}</p>}

        <p className="kn-klein">
          {tr('Abrechnung über dein {0}-Konto. Abos verlängern sich automatisch, bis du sie dort kündigst – das geht jederzeit in den Einstellungen deines Geräts.', laden)}
        </p>
        <p className="kn-rechtliches">
          <a href="https://davaigo.de/agb" target="_blank" rel="noreferrer">{tr('Nutzungsbedingungen')}</a>
          <a href="https://davaigo.de/datenschutz" target="_blank" rel="noreferrer">{tr('Datenschutz')}</a>
        </p>
      </div>
    </div>
  )
}
