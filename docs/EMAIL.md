# E-Mail für Davaigo

**Eingerichtet am 23.08.2026.** Supabase Auth verschickt die Anmelde-
und Passwortmails über das All-Inkl-Postfach `lernen@davaigo.de`, in
vier Vorlagen im Davaigo-Design.

## Was gesetzt ist

| Einstellung | Wert |
| --- | --- |
| Site URL | `https://davaigo.de` |
| Redirect URLs | `https://davaigo.de`, `https://davaigo.de/**`, `https://www.davaigo.de/**` |
| SMTP | `w01a848c.kasserver.com` Port **587** (STARTTLS) |
| Absender | Davaigo &lt;lernen@davaigo.de&gt; |
| Mails pro Stunde | 100 (vorher 2) |
| Abstand je Empfänger | 60 Sekunden |
| Bestätigung bei Registrierung | an (`mailer_autoconfirm` = false) |

All-Inkl bietet auch Port 465 mit direktem SSL an. Es läuft auf 587,
weil das der Weg ist, der bei Habloo mit demselben Anbieter
nachweislich sendet.

**Der wichtigste Punkt:** Die Site URL stand bis dahin auf
`http://localhost:3000`. Deshalb zeigte jeder Bestätigungslink ins
Leere – die Mail kam an, der Klick führte auf einen Rechner, den es
außerhalb des Entwicklungsrechners nicht gibt.

## Ändern

Nicht im Dashboard klicken, sondern:

```bash
node scripts/supabase-mail-einrichten.mjs
```

Das zeigt erst, **was wirklich gespeichert ist**, und nennt die
Abweichungen. Geschrieben wird nur mit `--los`:

```bash
node scripts/supabase-mail-einrichten.mjs --los
```

Der Grund für den Umweg: Bei Habloo zeigte das Formular stundenlang
das eine, gespeichert war das andere, und niemand konnte es sehen.
Über die Management-API lässt sich der echte Stand nachlesen.

Zwei Fallen sind im Skript schon abgefangen:

- **Passwort und Port nur setzen, wenn nichts da ist.** Supabase gibt
  das Passwort verschlüsselt zurück; ein blinder Vergleich wäre immer
  „anders" und würde es bei jedem Lauf neu schreiben.
- **Vor der Gegenprobe kurz warten.** Die API bestätigt den
  Schreibvorgang sofort, liefert beim unmittelbar folgenden Lesen aber
  noch den alten Stand. Das sah aus, als wäre nichts angekommen –
  obwohl alles gespeichert war.

## Prüfen, ob es noch geht

```bash
node scripts/smtp-pruefen.mjs
```

Meldet sich am Postfach an und legt sofort wieder auf – kein `MAIL
FROM`, kein `DATA`, es wird nichts verschickt. Das ist der Test, der
zählt: Stimmt das Passwort nicht, scheitert Supabases Versand
**still**. Der Nutzer sieht „Schau in dein Postfach", und dort kommt
nie etwas an.

Eine echte Mail verschickt dagegen:

```bash
node scripts/supabase-mail-einrichten.mjs --test deine@adresse.de
```

Das geht nur, wenn es zu der Adresse schon ein Davaigo-Konto gibt.

## Die vier Vorlagen

Sie liegen in `docs/email/`; ihr Aufbau ist in `docs/email/_vorlage.md`
erklärt. Das Skript liest sie von dort und schiebt sie nach Supabase.
Wer eine ändert, lässt danach `--los` laufen.

| Datei | Supabase-Vorlage | Betreff |
| --- | --- | --- |
| `1-registrierung-bestaetigen.html` | Confirm signup | Willkommen bei Davaigo – bestätige deine Adresse |
| `2-anmeldelink.html` | Magic Link | Dein Anmeldelink für Davaigo |
| `3-passwort-zuruecksetzen.html` | Reset Password | Neues Passwort für Davaigo |
| `4-adresse-aendern.html` | Change Email | Bestätige deine neue E-Mail-Adresse |

Unter dem Knopf steht bewusst **keine** lange Rückfall-Adresse. Ein
150 Zeichen langer Link sieht nach Spam aus, und abtippen würde ihn
ohnehin niemand. Stattdessen ein kurzer Hinweis auf
`lernen@davaigo.de`.

## Fallen beim Testen

- **`example.com`-Adressen** blockt Supabase **vor** dem Versand und
  meldet HTTP 500 „Error sending recovery email". Das sieht aus wie
  ein SMTP-Fehler, ist aber keiner.
- **Web.de kennt keine Plus-Adressen.** `name+tag@web.de` wird mit
  `550 mailbox unavailable` abgewiesen. Für Tests Gmail nehmen oder
  eine echte zweite Adresse.
- **60 Sekunden Abstand je Empfänger.** Ein Nachtest an dieselbe
  Adresse zeigt nichts Neues – Supabase antwortet 429 und verschickt
  die alte Mail trotzdem. So entsteht der Eindruck, die Vorlage ändere
  sich nicht, obwohl sie längst aktiv ist.
- **Bounces landen im Postfach selbst** (IMAP `w01a848c.kasserver.com`
  Port 993). Dort steht der echte Grund und der Betreff der
  abgewiesenen Mail.

## Noch offen: Spam-Vorbeugung

Damit die Mails nicht im Spam landen, fehlen die Einträge, mit denen
sich der Absender ausweist. Im KAS unter **Domain → DNS-Einstellungen**:

- **SPF** – nachsehen, ob ein TXT-Eintrag mit `v=spf1` existiert.
  All-Inkl legt ihn beim Anlegen des Postfachs meist selbst an.
- **DKIM** – im KAS unter **E-Mail → DKIM** für davaigo.de einschalten;
  All-Inkl trägt den Schlüssel dann selbst ein.
- **DMARC** – TXT-Eintrag auf `_dmarc.davaigo.de` mit
  `v=DMARC1; p=none; rua=mailto:killert.manuel@web.de`. Das `p=none`
  heißt: nur beobachten, nichts blockieren – der richtige Anfang.
