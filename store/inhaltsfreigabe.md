# Inhaltsfreigabe – die Antworten für die Play Console

In der Play Console unter **Richtlinien → App-Inhalte**. Google
arbeitet dort eine Liste ab; jeder Punkt muss beantwortet sein, bevor
sich die App veröffentlichen lässt.

Hier stehen die Antworten für Davaigo, jeweils mit Begründung. Wo
etwas von der App abhängt, ist es vorher im Code nachgesehen worden.

---

## Datenschutzerklärung

```
https://davaigo.de/datenschutz/
```

Fertiges HTML, ohne JavaScript lesbar. Siehe `checkliste.md`.

---

## Werbung

**Enthält die App Werbung? Nein.**

Es ist keine Werbebibliothek eingebunden, es gibt keine Anzeigen und
keine Werbe-IDs. Das lässt sich prüfen: In `android/app/build.gradle`
steht keine Abhängigkeit zu einem Werbenetzwerk, und das Manifest
verlangt genau **eine** Berechtigung – `INTERNET`.

---

## App-Zugriff

**Sind Teile der App eingeschränkt? Ja – Anmeldung erforderlich.**

Google braucht einen Testzugang, sonst kann der Prüfer nichts sehen
und lehnt ab. Lege dafür ein eigenes Konto an (nicht dein privates)
und trage es unter **Anweisungen für den Zugriff** ein:

```
Alle Lerninhalte sind nach der Anmeldung frei zugänglich.

Testkonto:
E-Mail:   pruefung@davaigo.de
Passwort: <beim Anlegen vergeben>

Hinweis: Premium-Funktionen sind in der App bewusst nicht
buchbar (siehe Abschnitt Abrechnung).
```

---

## Inhaltseinstufung (Fragebogen)

Kategorie wählen: **Bildung / Nachschlagewerke**.

Danach kommt ein Fragebogen. Die Antworten für Davaigo:

| Frage | Antwort |
| --- | --- |
| Gewalt jeder Art | Nein |
| Sexuelle Inhalte oder Nacktheit | Nein |
| Anstößige Sprache | Nein |
| Drogen, Alkohol, Tabak | Nein |
| Glücksspiel oder Simulation davon | Nein |
| Angsteinflößende Inhalte | Nein |
| Nutzer können miteinander kommunizieren | **Ja** – eingeschränkt |
| Nutzer können Inhalte teilen | **Ja** – Benutzername und Profilbild |
| Standort wird geteilt | Nein |
| Käufe digitaler Güter in der App | **Nein** (siehe unten) |

**Diese beiden Antworten haben sich am 30.10.2026 geändert** – mit der
Rangliste, den Freunden und den Duellen sehen Nutzer erstmals Inhalte
anderer Nutzer. Eine falsche Angabe hier ist einer der häufigsten
Gründe für eine nachträgliche Sperre, deshalb lieber zu genau:

- **Kommunizieren:** Es gibt **keinen Chat**, keine Kommentare, keine
  Nachrichten und kein Freitextfeld, das bei jemand anderem landet.
  Was es gibt: eine Freundschaftsanfrage (Knopfdruck, kein Text), die
  Rangliste und ein rundenbasiertes Duell, in dem beide dieselben
  Vokabelfragen beantworten. Mehr geht nicht aneinander.
- **Teilen:** Wer einen Benutzernamen wählt, steht damit in der
  Rangliste; wer ein Profilbild hochlädt, zeigt es dort. Beides ist
  freiwillig – ohne Benutzername lernt man ganz normal weiter und
  taucht nirgends auf.

**Moderation** ist eingebaut, weil Apple (Richtlinie 1.2) und Google
sie verlangen, sobald das zutrifft: Jedes Profil lässt sich melden
und blockieren. Wer blockiert ist, verschwindet in beide Richtungen
aus Rangliste, Suche und Duellen; Meldungen landen in der Datenbank
und zusätzlich per Mail. Wird danach gefragt: **ja, es gibt eine
Melde- und eine Blockierfunktion.**

**Zu erwarten ist: USK 0 / PEGI 3.**

Eine Sache lohnt der Erwähnung im Fragebogen, falls danach gefragt
wird: Teile der Inhalte entstehen mit KI (Vokabellisten, Übungssätze,
Wissenstexte, E-Books). Google fragt das inzwischen bei manchen
Kategorien ab. Die ehrliche Antwort: **Ja, nutzergenerierte Inhalte
entstehen mit KI-Unterstützung, sie sind aber nur für die jeweilige
Person sichtbar und werden nicht geteilt.**

---

## Zielgruppe und Inhalte

| Frage | Antwort |
| --- | --- |
| Zielaltersgruppe | **18 und älter** |
| Richtet sich die App an Kinder? | Nein |
| Unbeabsichtigt für Kinder attraktiv? | Nein |

**Warum 18+ und nicht „alle Altersgruppen":** Sobald eine App auch
Kinder anspricht, greifen die Regeln für Familieninhalte – darunter
Einschränkungen bei Werbung, Analyse und Datenverarbeitung, und ein
zusätzlicher Prüfschritt. Davaigo verlangt in den AGB ohnehin ein
Mindestalter von 16 Jahren. Die einfachste und ehrlichste Einstufung
ist deshalb „Erwachsene".

---

## Abrechnung – der heikelste Punkt

**Enthält die App In-App-Käufe? Nein.**

Google verlangt für digitale Inhalte innerhalb einer App sein eigenes
Abrechnungssystem und erlaubt Stripe dort nicht. Davaigos Kasse läuft
über Stripe.

Deshalb ist Premium in der App **ausgeblendet**. Nachgesehen in
`src/Settings.jsx`: Bei `istApp` erscheint weder ein Kaufknopf noch
ein Preis noch ein Link nach draußen – nur der Satz „Ein bestehendes
Premium-Abo wird nach der Anmeldung automatisch erkannt."

Das ist erlaubt. Wer auf davaigo.de im Browser bucht, bekommt die
Funktionen auch in der App freigeschaltet. **Was NICHT erlaubt wäre:**
in der App auf die Website verlinken oder dazu auffordern, dort zu
kaufen. Das führt zur Sperre.

Vor jedem Upload also prüfen, dass dieser Zustand noch gilt.

---

## Datensicherheit

Eigenes Formular, die Antworten stehen in `datensicherheit.md`.

---

## Staatliche Apps, Finanzdienste, Gesundheit

Alles **nein**. Davaigo ist eine Lern-App.
