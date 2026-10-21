# Datensicherheit – die Antworten für das Play-Formular

In der Play Console unter **Richtlinien → App-Inhalte →
Datensicherheit**. Google fragt dort in mehreren Schritten ab, was die
App erhebt und weitergibt. Falsche Angaben sind der häufigste Grund
für eine spätere Sperre – deshalb steht hier nur, was der Code
wirklich tut.

Jede Zeile ist am 21.10.2026 aus dem Quelltext erhoben, nicht
geschätzt. Nachprüfen lässt sich das so:

```bash
grep -rhoE "https://[a-z0-9.-]+\.[a-z]{2,}" src/ server/ | sort -u
```

---

## Schritt 1: Überblick

| Frage | Antwort |
| --- | --- |
| Erhebt oder teilt die App Nutzerdaten? | **Ja** |
| Werden alle Daten bei der Übertragung verschlüsselt? | **Ja** (ausschließlich HTTPS) |
| Können Nutzer die Löschung ihrer Daten verlangen? | **Ja** |
| Löschweg | In der App unter **Mehr → Konto löschen**, zusätzlich per E-Mail an lernen@davaigo.de |

---

## Schritt 2: Welche Daten

### Personenbezogene Daten

| Datenart | erhoben | geteilt | Pflicht | Zweck |
| --- | --- | --- | --- | --- |
| E-Mail-Adresse | ja | nein | ja | Konto und Anmeldung |
| Name | ja | nein | **nein** | Anzeigename, freiwillig |

Beides liegt bei Supabase, unserem Anbieter für Konten und Datenbank.
„Geteilt" im Sinne von Google heißt: an einen Dritten für dessen
eigene Zwecke. Supabase ist Auftragsverarbeiter, nicht Empfänger –
deshalb **nein**.

### App-Aktivität

| Datenart | erhoben | geteilt | Pflicht | Zweck |
| --- | --- | --- | --- | --- |
| In-App-Suchverlauf | ja | **ja** | nein | Videosuche |
| Sonstige nutzergenerierte Inhalte | ja | **ja** | nein | Übersetzen, Vokabellisten, E-Books |
| App-Interaktionen | ja | nein | nein | Lernfortschritt, Punkte, Serie |

Zur Zeile **Suchverlauf**: Gibst du ein Thema ein, geht der Begriff an
unseren Server, von dort zum Übersetzen an OpenAI und zur Suche an
YouTube. Deshalb „geteilt".

Zu **nutzergenerierten Inhalten**: Antippbare Wörter, Untertitelzeilen
und selbst gewählte Themen gehen zum Übersetzen oder Erzeugen an
OpenAI, bei E-Books an Anthropic. Ohne Konto-Kennung und ohne
E-Mail-Adresse – nur der Text selbst.

### Finanzdaten

| Datenart | erhoben | Zweck |
| --- | --- | --- |
| Kaufhistorie | ja | Abo-Status (läuft / gekündigt) |

**Zahlungsinformationen: nein.** Kartendaten gibt der Nutzer direkt
bei Stripe ein, in einem abgeschirmten Rahmen. Weder die App noch
unser Server bekommen sie zu sehen.

### Was NICHT erhoben wird

Diese Punkte im Formular bleiben leer, und das stimmt auch:

- Standort (weder genau noch ungefähr)
- Kontakte, Kalender, Fotos, Dateien
- Nachrichten jeder Art
- Gesundheits- und Fitnessdaten
- Geräte- oder Werbe-IDs
- Absturzberichte und Leistungsdiagnose
- **Analytics.** Google Analytics läuft ausschließlich auf der
  Website und ist dort an eine Einwilligung gebunden. In der
  Store-App ist es abgeschaltet – `messungMoeglich()` in
  `src/messung.js` gibt bei `istApp` immer `false` zurück.

---

## Schritt 3: Sicherheitspraktiken

| Frage | Antwort |
| --- | --- |
| Verschlüsselung bei der Übertragung | **Ja**, ausschließlich HTTPS |
| Löschung auf Anfrage möglich | **Ja** |
| Unabhängige Sicherheitsprüfung | **Nein** (gibt es nicht – ehrlich bleiben) |
| Daten werden an Dritte verkauft | **Nein** |

---

## Die Empfänger, der Vollständigkeit halber

Google fragt das nicht einzeln ab, aber es gehört in die
Datenschutzerklärung – und die ist dort verlinkt:

| Empfänger | wofür | was geht hin |
| --- | --- | --- |
| Supabase | Konto, Datenbank | E-Mail, Passwort (verschlüsselt), Lernstand |
| Hetzner | unser Server | Anfragen, technische Protokolle |
| OpenAI | Übersetzen, Vokabellisten, Sätze | der jeweilige Text |
| Anthropic | E-Books (nur Premium) | Thema und Niveau |
| Google / YouTube | Videos, Suche | IP beim Abspielen, Suchbegriff |
| Google Fonts | Schriftart | IP beim Laden |
| Stripe | Bezahlung | E-Mail, Kontokennung |
| Spotify | Liedvorschläge | nur nach ausdrücklicher Freigabe |
| TubeAlfred | Untertitel | die Video-Kennung, sonst nichts |
| All-Inkl | Anmelde- und Passwortmails | E-Mail-Adresse |

**Nicht in der Liste:** ElevenLabs. Die Sprachaufnahmen sind einmal
vorab erzeugt und liegen als fertige Dateien im Paket. Im Betrieb geht
dorthin kein einziges Nutzerdatum.

---

## Hinweis zu Google Fonts in der App

Die Schrift Nunito wird per `@import` von Google geladen. In der
Store-App bedeutet das: Beim ersten Start geht die IP-Adresse des
Geräts an Google. Wer das vermeiden will, legt die Schriftdatei ins
Projekt und streicht den Import in `src/App.css` – dann fällt dieser
Empfänger weg und die App startet sogar schneller.

Das ist kein Hindernis für die Veröffentlichung, aber einen Gedanken
wert, bevor der Eintrag steht.
