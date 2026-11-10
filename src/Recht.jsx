/**
 * Impressum, Datenschutzerklärung und AGB.
 *
 * WICHTIG für alle, die hier etwas ändern: Die Liste der
 * Datenempfänger in der Datenschutzerklärung ist am 23.08.2026 aus
 * Davaigos Quelltext ERHOBEN worden, nicht von Habloo abgeschrieben.
 * Jeder Eintrag entspricht einem Aufruf, den dieser Code wirklich
 * macht. Wer einen Dienst hinzufügt oder entfernt, muss die Liste
 * nachziehen, sonst stimmt die Erklärung nicht mehr.
 *
 * Nachprüfen lässt sich das so:
 *   grep -rhoE "https://[a-z0-9.-]+\.[a-z]{2,}" src/ server/ | sort -u
 *
 * Drei Unterschiede zu Habloo, die beim Erheben herauskamen:
 *
 *   Google Analytics steht DRIN (seit 23.08., Kennung G-HKGRQE66ER).
 *   Geladen wird es aber erst nach Einwilligung über den Hinweis
 *   beim ersten Besuch – siehe src/messung.js. Wer den Schnipsel
 *   aus dem Google-Konto stattdessen in die index.html setzt,
 *   macht die Einwilligung wertlos und den Banner zur Deko.
 *
 *   Google Fonts steht dafür DRIN. Die Schrift Nunito wird in
 *   App.css per @import von fonts.googleapis.com geladen, und damit
 *   geht die IP-Adresse des Besuchers dorthin. Wer das vermeiden
 *   will, legt die Schriftdatei ins Projekt und streicht den Eintrag.
 *
 *   ElevenLabs steht NICHT drin. Die Stimmen sind einmal vorab
 *   erzeugt und liegen als fertige Dateien in public/audio – im
 *   laufenden Betrieb geht kein Nutzerdatum dorthin.
 *
 * Anthropic verarbeitet nur bei Premium (E-Books), nicht bei allen.
 */

import { useEffect } from 'react'
import { tr, sprache } from './sprache.js'

const STAND = tr('23. August 2026')

/* ---------- Bausteine, damit alle drei Seiten gleich aussehen ---------- */

function Seite({ titel, kinder, onZurueck }) {
  // Ohne das oeffnet sich die Seite an der Scrollposition, von der
  // aus man sie angeklickt hat – man landet mitten im Text.
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="recht">
      <button className="btn-zurueck" onClick={onZurueck}><span className="zurueck-pfeil" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg></span>{tr('Zurück')}</button>
      <h1>{titel}</h1>
      {sprache() === 'en' && (
        <p className="recht-stand">
          This English version is a courtesy translation. If there is any difference, the German
          version is legally binding.
        </p>
      )}
      {kinder}
      <p className="recht-stand">{tr('Stand: {0}', STAND)}</p>
    </div>
  )
}

const H2 = ({ children }) => <h2 className="recht-h2">{children}</h2>
const H3 = ({ children }) => <h3 className="recht-h3">{children}</h3>
const P = ({ children, className }) => (
  <p className={className ? 'recht-p ' + className : 'recht-p'}>{children}</p>
)

/* ================================================================
   IMPRESSUM
   ================================================================ */

export function Impressum({ onZurueck }) {
  return (
    <Seite titel={tr('Impressum')} onZurueck={onZurueck} kinder={<>
      <H2>{tr('Angaben gemäß § 5 DDG')}</H2>
      <P>
        {tr('Manuel Killert – Einzelunternehmer')}<br />
        {tr('Klarwerk Digital')}<br />
        {tr('Geschwister-Scholl-Straße 27')}<br />
        {tr('49610 Quakenbrück')}<br />
        {tr('Deutschland')}
      </P>

      <H2>{tr('Kontakt')}</H2>
      <P>
        {tr('Telefon: +49 173 7439196')}<br />
        {tr('E-Mail:')} <a href="mailto:lernen@davaigo.de">lernen@davaigo.de</a>
      </P>

      <H2>{tr('Umsatzsteuer-Identifikationsnummer')}</H2>
      <P>{tr('Gemäß § 27 a Umsatzsteuergesetz: DE323508810')}</P>

      <H2>{tr('Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV')}</H2>
      <P>
        {tr('Manuel Killert')}<br />
        {tr('Geschwister-Scholl-Straße 27')}<br />
        {tr('49610 Quakenbrück')}
      </P>

      <H2>{tr('Streitbeilegung')}</H2>
      <P>
        {tr('Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:')}{' '}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer">
          ec.europa.eu/consumers/odr
        </a>
      </P>
      <P>
        {tr('Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.')}
      </P>
    </>} />
  )
}

/* ================================================================
   DATENSCHUTZERKLÄRUNG
   ================================================================ */

/** Ein Empfänger in der Übersicht – Zweck, Daten, Sitz, Grundlage. */
function Empfaenger({ name, sitz, zweck, daten, grundlage, drittland }) {
  return (
    <div className="recht-dienst">
      <h4>{name}</h4>
      <dl>
        <dt>{tr('Zweck')}</dt><dd>{zweck}</dd>
        <dt>{tr('Übermittelte Daten')}</dt><dd>{daten}</dd>
        <dt>{tr('Anbieter / Sitz')}</dt><dd>{sitz}</dd>
        <dt>{tr('Rechtsgrundlage')}</dt><dd>{grundlage}</dd>
        {drittland && <><dt>{tr('Drittland')}</dt><dd>{drittland}</dd></>}
      </dl>
    </div>
  )
}

export function Datenschutz({ onZurueck }) {
  return (
    <Seite titel={tr('Datenschutzerklärung')} onZurueck={onZurueck} kinder={<>
      <H2>{tr('1. Verantwortlicher')}</H2>
      <P>
        {tr('Manuel Killert, Geschwister-Scholl-Straße 27, 49610 Quakenbrück, Deutschland. E-Mail:')} <a href="mailto:lernen@davaigo.de">lernen@davaigo.de</a>{tr('. Einen Datenschutzbeauftragten haben wir nicht bestellt; dazu sind wir nicht verpflichtet.')}
      </P>

      <H2>{tr('2. Was Davaigo von dir verarbeitet')}</H2>

      <H3>{tr('Ohne Konto')}</H3>
      <P>
        {tr('Du kannst die Startseite ansehen und den Einstiegsfragebogen durchklicken, ohne ein Konto anzulegen. Dabei speichern wir keine personenbezogenen Daten auf unseren Servern. Deine Antworten und das daraus gewählte Startpaket liegen ausschließlich im Speicher deines Geräts, bis du dich anmeldest.')}
      </P>

      <H3>{tr('Mit Konto')}</H3>
      <P>
        {tr('Für ein Konto brauchen wir deine E-Mail-Adresse und ein Passwort; freiwillig kannst du einen Anzeigenamen angeben. Beim Lernen entstehen außerdem: deine gesammelten Vokabeln samt Lernstand, abgeschlossene Lektionen, Punkte, Level und Tagesserie, gemerkte Videos und Songs sowie – bei Premium – erzeugte E-Books.')}
      </P>
      <P>
        {tr('Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO: Ohne diese Daten lässt sich der Dienst nicht erbringen, denn genau darin besteht er.')}
      </P>

      <H3>{tr('Server-Protokolle')}</H3>
      <P>
        {tr('Beim Aufruf entstehen technische Protokolldaten (IP-Adresse, Zeitpunkt, abgerufene Adresse, Browsertyp). Sie dienen dem sicheren Betrieb und werden kurzfristig gelöscht. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO – unser berechtigtes Interesse an einem funktionierenden, angriffssicheren Dienst.')}
      </P>

      <H2>{tr('3. An wen Daten weitergegeben werden')}</H2>
      <P>
        {tr('Diese Liste ist vollständig und aus dem Programmcode erhoben. Weitergegeben wird jeweils nur, was für den genannten Zweck nötig ist.')}
      </P>

      <Empfaenger
        name="Supabase"
        zweck={tr('Konto, Anmeldung und Speicherung deines Lernfortschritts')}
        daten={tr('E-Mail-Adresse, Passwort (verschlüsselt), Anzeigename, Vokabeln, Lektionsfortschritt, Punktestand, Abo-Status')}
        sitz={tr('Supabase Inc., San Francisco, USA – Datenhaltung in der EU')}
        grundlage={tr('Art. 6 Abs. 1 lit. b DSGVO (Vertrag), Auftragsverarbeitung nach Art. 28')}
      />
      <Empfaenger
        name="Hetzner Online GmbH"
        zweck={tr('Betrieb von Website und Anwendungsserver')}
        daten={tr('Alle Anfragen an davaigo.de, technische Protokolldaten')}
        sitz={tr('Hetzner Online GmbH, Gunzenhausen, Deutschland – Rechenzentrum Falkenstein')}
        grundlage={tr('Art. 6 Abs. 1 lit. b und f DSGVO, Auftragsverarbeitung nach Art. 28')}
      />
      <Empfaenger
        name="OpenAI"
        zweck={tr('Erzeugen von Vokabellisten und zusätzlichen Grammatikaufgaben, Übersetzen von Wörtern und Untertiteln')}
        daten={tr('Der jeweils zu übersetzende Text bzw. das gewählte Thema und – zur Vermeidung von Wiederholungen – eine Liste bereits gelernter Wörter. Keine E-Mail-Adresse, keine Kontokennung.')}
        sitz={tr('OpenAI Ireland Ltd., Dublin, Irland')}
        grundlage={tr('Art. 6 Abs. 1 lit. b DSGVO')}
        drittland={tr('Verarbeitung kann in den USA erfolgen; abgesichert über Standardvertragsklauseln.')}
      />
      <Empfaenger
        name="OpenAI (Sprach-Trainer)"
        zweck={tr('Sprach-Trainer: Führen des Gesprächs per Stimme, Umschreiben des Gesprochenen in Text, Auswertung des Gesprächs. Nur nach deiner Einwilligung vor dem ersten Gespräch.')}
        daten={tr('Deine Stimme während des Gesprächs, der Gesprächstext, dein gewähltes Niveau sowie dein Lernprofil, frühere Gesprächszusammenfassungen und dein Lernstand. Keine E-Mail-Adresse und kein Name aus deinem Konto.')}
        sitz={tr('OpenAI Ireland Ltd., Dublin, Irland')}
        grundlage={tr('Art. 6 Abs. 1 lit. a DSGVO')}
        drittland={tr('Verarbeitung kann in den USA erfolgen; abgesichert über Standardvertragsklauseln.')}
      />
      <Empfaenger
        name={tr('Anthropic (nur Premium)')}
        zweck={tr('Erzeugen zweisprachiger E-Books zu deinem Wunschthema')}
        daten={tr('Das von dir angegebene Thema und dein Niveau. Keine E-Mail-Adresse, keine Kontokennung.')}
        sitz={tr('Anthropic PBC, San Francisco, USA')}
        grundlage={tr('Art. 6 Abs. 1 lit. b DSGVO')}
        drittland={tr('USA, abgesichert über Standardvertragsklauseln.')}
      />
      <Empfaenger
        name="Google / YouTube"
        zweck={tr('Eingebettete Lernvideos, Vorschaubilder und Videosuche')}
        daten={tr('Beim Abspielen eines Videos: IP-Adresse und Geräteinformationen an YouTube. Bei der Suche: dein Suchbegriff. Wir betten Videos im erweiterten Datenschutzmodus ein (youtube-nocookie), dennoch stellt YouTube beim Abspielen eine Verbindung her.')}
        sitz={tr('Google Ireland Ltd., Dublin, Irland')}
        grundlage={tr('Art. 6 Abs. 1 lit. b DSGVO')}
        drittland={tr('USA, abgesichert über Standardvertragsklauseln.')}
      />
      <Empfaenger
        name="Google Analytics"
        zweck={tr('Anonyme Reichweitenmessung – wie viele Menschen Davaigo nutzen und über welche Wege sie herkommen')}
        daten={tr('Gekürzte IP-Adresse, Seitenaufrufe, Gerätetyp, Herkunftsseite. Cookies mit den Namen _ga und _ga_*. Keine Vokabeln, keine Kontokennung, keine E-Mail-Adresse.')}
        sitz={tr('Google Ireland Ltd., Dublin, Irland')}
        grundlage={tr('Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG – ausschließlich nach deiner Einwilligung. Ohne Einwilligung wird kein Skript geladen und kein Cookie gesetzt. Widerruf jederzeit unter „Mehr → Messung“.')}
        drittland={tr('USA, abgesichert über Standardvertragsklauseln.')}
      />
      <Empfaenger
        name="Google Fonts"
        zweck={tr('Laden der Schriftart Nunito, in der die App gesetzt ist')}
        daten={tr('Beim Aufruf der Seite ruft dein Browser die Schriftdatei bei Google ab und übermittelt dabei deine IP-Adresse.')}
        sitz={tr('Google Ireland Ltd., Dublin, Irland')}
        grundlage={tr('Art. 6 Abs. 1 lit. f DSGVO – berechtigtes Interesse an einer einheitlichen Darstellung')}
        drittland={tr('USA, abgesichert über Standardvertragsklauseln.')}
      />
      <Empfaenger
        name="Stripe"
        zweck={tr('Abwicklung der Premium-Zahlung')}
        daten={tr('E-Mail-Adresse und eine Kennung deines Kontos. Deine Zahlungsdaten gibst du unmittelbar bei Stripe ein; wir sehen und speichern sie nicht.')}
        sitz={tr('Stripe Payments Europe Ltd., Dublin, Irland')}
        grundlage={tr('Art. 6 Abs. 1 lit. b DSGVO')}
      />
      <Empfaenger
        name={tr('RevenueCat (nur bei Käufen in der App)')}
        zweck={tr('Verwaltung von Abos, die du in der App über Apple oder Google abschließt')}
        daten={tr('Eine Kennung deines Kontos, Kaufdaten wie Produkt, Zeitpunkt und Laufzeit sowie technische Angaben zu Gerät und App. Deine Zahlungsdaten gibst du direkt bei Apple oder Google ein; wir sehen und speichern sie nicht.')}
        sitz={tr('RevenueCat, Inc., San Francisco, USA')}
        grundlage={tr('Art. 6 Abs. 1 lit. b DSGVO')}
        drittland={tr('USA, abgesichert über Standardvertragsklauseln.')}
      />
      <Empfaenger
        name={tr('All-Inkl (nur beim Feedback-Formular)')}
        zweck={tr('Zustellung deiner Nachricht an uns per E-Mail')}
        daten={tr('Deine Nachricht, deine E-Mail-Adresse falls angegeben, die Kennung deines Kontos, Sprache und Geräte-Angaben des Browsers bzw. der App')}
        sitz={tr('ALL-INKL.COM – Neue Medien Münnich, Friedersdorf, Deutschland')}
        grundlage={tr('Art. 6 Abs. 1 lit. f DSGVO')}
      />
      <Empfaenger
        name={tr('Spotify (nur wenn du es verbindest)')}
        zweck={tr('Songvorschläge auf Grundlage deines Musikgeschmacks')}
        daten={tr('Nach deiner Freigabe liest Davaigo deine gespeicherten Titel, deine privaten Playlists und deine meistgehörten Künstler (Berechtigungen: user-library-read, playlist-read-private, user-top-read). Die Verbindung kannst du jederzeit trennen.')}
        sitz={tr('Spotify AB, Stockholm, Schweden')}
        grundlage={tr('Art. 6 Abs. 1 lit. a DSGVO – nur nach ausdrücklicher Freigabe durch dich')}
      />
      <Empfaenger
        name="TubeAlfred"
        zweck={tr('Abruf von Video-Untertiteln, wenn unser Server sie nicht selbst laden kann')}
        daten={tr('Die Kennung des Videos. Keine personenbezogenen Daten.')}
        sitz={tr('TubeAlfred, EU')}
        grundlage={tr('Art. 6 Abs. 1 lit. b DSGVO')}
      />
      <Empfaenger
        name="ALL-INKL.COM – Neue Medien Münnich"
        zweck={tr('Versand von Bestätigungs- und Passwort-E-Mails')}
        daten={tr('Deine E-Mail-Adresse und der Inhalt der jeweiligen Nachricht')}
        sitz={tr('Neue Medien Münnich, Friedersdorf, Deutschland')}
        grundlage={tr('Art. 6 Abs. 1 lit. b DSGVO, Auftragsverarbeitung nach Art. 28')}
      />

      <P className="recht-hinweis">
        <b>{tr('Nicht in dieser Liste – und warum:')}</b> {tr('Die Sprachaufnahmen im Kurs wurden einmalig vorab mit einem Sprachdienst erzeugt und liegen seither als fertige Audiodateien auf unserem Speicher. Beim Lernen wird nichts an diesen Dienst übermittelt.')}
      </P>

      <H3>{tr('Was der Sprach-Trainer speichert')}</H3>
      <P>{tr('Deine Stimme speichern wir nicht. Wir speichern das Gesprächsprotokoll als Text, eine Zusammenfassung, erkannte Fehler und neue Wörter sowie ein Lernprofil mit deinen Zielen, Interessen, deinem geschätzten Niveau und deinen Fortschritten. Das dient dazu, dass der Trainer sich auf frühere Gespräche beziehen kann und du sie nachlesen kannst. Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Du kannst sie jederzeit widerrufen, indem du einzelne Gespräche oder das gesamte Gedächtnis auf der Seite des Trainers löschst und den Trainer nicht mehr nutzt. Mit deinem Konto werden auch diese Daten gelöscht. Dauer und Beginn jedes Gesprächs behalten wir, um dein Minutenkontingent berechnen zu können. Die Auswertung ist automatisiert und kann Fehler enthalten. Sie hat keine rechtliche Wirkung für dich.')}</P>

      <H2>{tr('4. Cookies und Speicherung auf deinem Gerät')}</H2>
      <P>
        {tr('Davaigo speichert deinen Lernstand im lokalen Speicher deines Browsers, damit die App auch ohne Verbindung funktioniert und schnell startet. Das ist technisch notwendig (§ 25 Abs. 2 Nr. 2 TDDDG) und braucht keine Einwilligung. Ein Cookie zur Anmeldung setzt Supabase, solange du angemeldet bist.')}
      </P>
      <P>
        {tr('Cookies zur Reichweitenmessung (Google Analytics) setzen wir ausschließlich nach deiner Einwilligung über den Hinweis beim ersten Besuch. Bis du dort geklickt hast, wird kein Google-Skript geladen und kein Cookie gesetzt. Du kannst deine Entscheidung jederzeit unter „Mehr → Messung“ ändern; beim Widerruf werden die Cookies gelöscht.')}
      </P>
      <P>
        {tr('Werbenetzwerke, Zählpixel oder ein Weiterverkauf deiner Daten finden nicht statt.')}
      </P>

      <H2>{tr('5. Wie lange wir speichern')}</H2>
      <P>
        {tr('Kontodaten und Lernfortschritt speichern wir, solange dein Konto besteht. Löschst du dein Konto unter „Mehr → Konto löschen“, werden alle zugehörigen Daten unwiderruflich entfernt. Rechnungsdaten bewahren wir aufgrund steuerrechtlicher Pflichten zehn Jahre auf (§ 147 AO).')}
      </P>

      <H2>{tr('6. Deine Rechte')}</H2>
      <P>
        {tr('Du hast das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21 DSGVO). Eine erteilte Einwilligung kannst du jederzeit mit Wirkung für die Zukunft widerrufen.')}
      </P>
      <P>
        {tr('Für Auskunft und Löschung genügt eine E-Mail an')}{' '}
        <a href="mailto:lernen@davaigo.de">lernen@davaigo.de</a>{tr('. Deinen gesamten Lernstand kannst du außerdem jederzeit selbst unter „Mehr → Backup erstellen“ als Datei herunterladen.')}
      </P>
      <P>
        {tr('Du kannst dich bei einer Aufsichtsbehörde beschweren. Für uns zuständig ist die Landesbeauftragte für Datenschutz Niedersachsen, Prinzenstraße 5, 30159 Hannover.')}
      </P>

      <H2>{tr('7. Änderungen')}</H2>
      <P>
        {tr('Wenn sich Davaigo ändert, ändert sich diese Erklärung mit. Es gilt jeweils die hier veröffentlichte Fassung.')}
      </P>
    </>} />
  )
}

/* ================================================================
   AGB
   ================================================================ */

export function KontoLoeschen({ onZurueck }) {
  return (
    <Seite titel={tr('Dein Konto und deine Daten löschen')} onZurueck={onZurueck} kinder={<>
      <P>{tr('Du kannst dein Davaigo-Konto jederzeit selbst löschen. Dafür gibt es zwei Wege.')}</P>

      <H2>{tr('In der App')}</H2>
      <P>{tr('Öffne „Mehr“ und scrolle nach unten zu „Konto löschen“. Nach zwei Rückfragen ist das Konto weg. Das ist der schnellste Weg.')}</P>

      <H2>{tr('Per E-Mail')}</H2>
      <P>
        {tr('Wenn du die App schon gelöscht hast oder nicht mehr hineinkommst, schreib von der Adresse, mit der du dich angemeldet hast, an')}{' '}
        <a href="mailto:lernen@davaigo.de?subject=Konto%20l%C3%B6schen">lernen@davaigo.de</a>.{' '}
        {tr('Wir löschen das Konto innerhalb von 30 Tagen und bestätigen es dir.')}
      </P>

      <H2>{tr('Was gelöscht wird')}</H2>
      <div className="recht-kasten">
        <P><b>{tr('Sofort und vollständig:')}</b> {tr('dein Konto und die Anmeldedaten, dein Anzeigename, alle gesammelten Vokabeln samt Lernstand, dein Lektionsfortschritt, gespeicherte Videos, Punktestand und Tagesserie.')}</P>
        <P><b>{tr('Was bleibt:')}</b> {tr('Rechnungsdaten zu einem bezahlten Abo. Die müssen wir nach § 147 AO und § 257 HGB zehn Jahre aufbewahren. Sie werden für nichts anderes verwendet.')}</P>
      </div>
    </>} />
  )
}

export function AGB({ onZurueck }) {
  return (
    <Seite titel={tr('Allgemeine Geschäftsbedingungen')} onZurueck={onZurueck} kinder={<>
      <H2>{tr('§ 1 Geltungsbereich und Anbieter')}</H2>
      <P>
        {tr('Diese Bedingungen gelten für die Nutzung der Sprachlern-Anwendung Davaigo, angeboten von Manuel Killert, Geschwister-Scholl-Straße 27, 49610 Quakenbrück („wir“). Vertragspartner bist du als Nutzer.')}
      </P>

      <H2>{tr('§ 2 Was Davaigo ist')}</H2>
      <P>
        {tr('Davaigo ist eine Anwendung zum Russischlernen mit geführten Lektionen, einem Vokabeltrainer, Hörverstehensübungen und einer Mediathek mit Videos, Songs und E-Books. Teile der Inhalte werden mit Hilfe künstlicher Intelligenz erzeugt.')}
      </P>
      <P>
        {tr('Davaigo ist ein Lernangebot, keine Unterrichtsleistung und keine Prüfungsvorbereitung mit zugesichertem Ergebnis. Einen bestimmten Lernerfolg schulden wir nicht.')}
      </P>

      <H2>{tr('§ 3 Konto')}</H2>
      <P>
        {tr('Für die Nutzung ist ein Konto erforderlich. Du musst mindestens 16 Jahre alt sein; jüngere Nutzer brauchen die Einwilligung der Eltern. Halte dein Passwort geheim und gib dein Konto nicht weiter.')}
      </P>

      <H2>{tr('§ 4 Kostenlose Nutzung und Premium')}</H2>
      <P>
        {tr('Gratis: 20 % der Lektionen, 10 KI-Erstellungen im Monat, alle Videos aus der Mediathek sowie 10 Minuten Sprach-Trainer im Monat. Premium schaltet alles ohne Limit frei: alle Lektionen, unbegrenzte Vokabellisten, Sätze, Texte und E-Books, eigene Videos und 120 Minuten Sprach-Trainer im Monat.')}
      </P>
      <P>
        {tr('Der jeweils geltende Preis wird dir vor dem Kauf in der Anwendung angezeigt, zusammen mit dem Abrechnungszeitraum. Alle Preise verstehen sich inklusive gesetzlicher Umsatzsteuer. Maßgeblich ist der Preis, der dir im Bestellvorgang angezeigt wird.')}
      </P>

      <H2>{tr('§ 5 Vertragsschluss')}</H2>
      <P>
        {tr('Mit dem Anlegen eines Kontos kommt ein unentgeltlicher Nutzungsvertrag zustande. Ein Premium-Vertrag kommt zustande, wenn du den Bestellvorgang über unseren Zahlungsdienstleister Stripe abschließt. Wir bestätigen dir den Vertrag per E-Mail.')}
      </P>

      <H2>{tr('§ 6 Laufzeit und Kündigung')}</H2>
      <P>
        {tr('Das Monatsabo läuft einen Monat und verlängert sich um jeweils einen weiteren Monat, wenn du es nicht bis zum Ende der Laufzeit kündigst. Das Jahresabo läuft ein Jahr und verlängert sich nach dem ersten Jahr um jeweils einen Monat (§ 312k BGB). Der Einmalkauf hat keine Laufzeit.')}
      </P>
      <P>
        {tr('Kündigen kannst du jederzeit unter „Mehr → Abo verwalten“ – ohne Begründung und ohne Frist bis zum Ende der laufenden Periode. Das kostenlose Konto kannst du jederzeit unter „Mehr → Konto löschen“ beenden.')}
      </P>

      <H2>{tr('§ 7 Widerrufsrecht für Verbraucher')}</H2>
      <div className="recht-kasten">
        <H3>{tr('Widerrufsbelehrung')}</H3>
        <P>
          {tr('Du hast das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.')}
        </P>
        <P>
          {tr('Um dein Widerrufsrecht auszuüben, musst du uns – Manuel Killert, Geschwister-Scholl-Straße 27, 49610 Quakenbrück,')}{' '}
          <a href="mailto:lernen@davaigo.de">lernen@davaigo.de</a> {tr('– mittels einer eindeutigen Erklärung (z. B. per E-Mail) über deinen Entschluss informieren. Zur Wahrung der Frist reicht es, dass du die Mitteilung vor Ablauf der Frist absendest.')}
        </P>
        <P>
          <b>{tr('Folgen des Widerrufs:')}</b> {tr('Wenn du diesen Vertrag widerrufst, erstatten wir dir alle Zahlungen unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurück, an dem die Mitteilung über deinen Widerruf bei uns eingegangen ist. Für die Rückzahlung verwenden wir dasselbe Zahlungsmittel, das du eingesetzt hast; dafür entstehen dir keine Kosten.')}
        </P>
        <P>
          <b>{tr('Vorzeitiges Erlöschen:')}</b> {tr('Dein Widerrufsrecht erlischt vorzeitig, wenn wir mit der Leistung begonnen haben, nachdem du ausdrücklich zugestimmt hast, dass wir vor Ablauf der Widerrufsfrist beginnen, und du bestätigt hast, dass du dein Widerrufsrecht damit verlierst (§ 356 Abs. 5 BGB).')}
        </P>
      </div>

      <H2>{tr('§ 8 Inhalte, die eine KI erzeugt')}</H2>
      <P>
        {tr('Vokabellisten, zusätzliche Übungen, E-Books und Übersetzungen erzeugen wir zum Teil automatisch. Solche Inhalte können Fehler enthalten. Wir prüfen sie mit automatischen Regeln, können aber nicht für die Richtigkeit jedes einzelnen Satzes einstehen. Verlasse dich bei wichtigen Angelegenheiten nicht allein darauf.')}
      </P>

      <H2>{tr('§ 9 Inhalte Dritter')}</H2>
      <P>
        {tr('Davaigo bindet Videos von YouTube ein und kann auf Wunsch auf Spotify zugreifen. Für diese Inhalte gelten zusätzlich die Bedingungen der jeweiligen Anbieter. Auf Verfügbarkeit und Inhalt haben wir keinen Einfluss.')}
      </P>

      <H2>{tr('§ 10 Deine Pflichten')}</H2>
      <P>
        {tr('Nutze Davaigo nicht missbräuchlich: kein automatisiertes Auslesen, kein Umgehen von Nutzungsgrenzen, keine Weitergabe von Zugangsdaten, keine Nutzung für rechtswidrige Zwecke. Bei erheblichen Verstößen dürfen wir das Konto sperren.')}
      </P>

      <H2>{tr('§ 11 Verfügbarkeit')}</H2>
      <P>
        {tr('Wir bemühen uns um einen durchgehenden Betrieb, schulden aber keine bestimmte Verfügbarkeit. Wartungsarbeiten, Störungen und Ausfälle bei Diensten Dritter können zu Unterbrechungen führen. Bei längeren Ausfällen im Premium-Zeitraum erstatten wir anteilig.')}
      </P>

      <H2>{tr('§ 12 Haftung')}</H2>
      <P>
        {tr('Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei Verletzung von Leben, Körper und Gesundheit. Bei einfacher Fahrlässigkeit haften wir nur für die Verletzung wesentlicher Vertragspflichten – also solcher, deren Erfüllung den Vertrag überhaupt erst ermöglicht – und der Höhe nach begrenzt auf den vertragstypischen, vorhersehbaren Schaden. Die Haftung nach dem Produkthaftungsgesetz bleibt unberührt.')}
      </P>

      <H2>{tr('§ 13 Änderungen dieser Bedingungen')}</H2>
      <P>
        {tr('Wir dürfen diese Bedingungen ändern, wenn dafür ein sachlicher Grund besteht. Über Änderungen informieren wir dich mindestens sechs Wochen vorher per E-Mail. Widersprichst du nicht bis zum Wirksamwerden, gelten sie als angenommen; darauf weisen wir in der Mitteilung gesondert hin. Widersprichst du, dürfen wir zum Ende der Laufzeit kündigen.')}
      </P>

      <H2>{tr('§ 14 Schlussbestimmungen')}</H2>
      <P>
        {tr('Es gilt deutsches Recht. Ist eine Bestimmung unwirksam, bleibt der übrige Vertrag wirksam. Zur Teilnahme an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle sind wir nicht bereit oder verpflichtet.')}
      </P>
    </>} />
  )
}
