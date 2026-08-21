# E-Mail für Davaigo einrichten

Supabase verschickt die Anmelde- und Passwortmails. Ab Werk läuft das
über einen geteilten Absender von Supabase – mit drei Nachteilen:
maximal **zwei Mails pro Stunde**, ein fremder Absender im Postfach,
und ein spürbares Spam-Risiko. Mit einem eigenen SMTP-Zugang bei
All-Inkl ist das erledigt.

## Schritt 1: Das Postfach anlegen (bei All-Inkl)

Im KAS unter **E-Mail → E-Mail-Postfach → Neues Postfach**:

| Feld | Wert |
| --- | --- |
| Adresse | `noreply@davaigo.de` |
| Passwort | ein neues, langes – nicht das vom KAS-Login |

Das Passwort danach gut aufheben, es wird gleich in Supabase gebraucht.

## Schritt 2: Supabase auf diesen Zugang umstellen

Dashboard → **Project Settings → Authentication → SMTP Settings**,
**Enable Custom SMTP** einschalten und eintragen:

| Feld | Wert |
| --- | --- |
| Host | `w01a848c.kasserver.com` |
| Port | `587` |
| Username | `noreply@davaigo.de` |
| Password | das Passwort aus Schritt 1 |
| Sender email | `noreply@davaigo.de` |
| Sender name | `Davaigo` |

Port 587 nutzt STARTTLS – die Verbindung ist verschlüsselt, auch wenn
in der Zeile nichts von SSL steht. Der genaue Hostname steht im KAS
unter **Postfach → Zugangsdaten**; sollte dort ein anderer stehen,
gilt der aus dem KAS.

Direkt darunter unter **Rate Limits** den Wert für
`Emails per hour` von 2 auf etwas Brauchbares heben – 100 reicht
für den Anfang locker.

## Schritt 3: Die Weiterleitungen richtigstellen

**Das ist der Grund, warum der Bestätigungslink zurzeit auf
`localhost:3000` zeigt.** Dashboard → **Authentication → URL
Configuration**:

| Feld | Wert |
| --- | --- |
| Site URL | `https://davaigo.de` |
| Redirect URLs | `https://davaigo.de/**` |

Wer lokal weiterentwickeln will, trägt bei den Redirect URLs zusätzlich
`http://localhost:5174/**` ein. Die **Site URL** bleibt trotzdem die
öffentliche Adresse – nur sie landet in den Mails.

## Schritt 4: Die Vorlagen einsetzen

In `docs/email/` liegen vier fertige Vorlagen im Davaigo-Violett mit
goldenem Д. Dashboard → **Authentication → Emails → Templates**, dann
je Vorlage Betreff und HTML übernehmen:

| Datei | Supabase-Vorlage |
| --- | --- |
| `1-registrierung-bestaetigen.html` | Confirm signup |
| `2-anmeldelink.html` | Magic Link |
| `3-passwort-zuruecksetzen.html` | Reset Password |
| `4-adresse-aendern.html` | Change Email Address |

Der Aufbau der Dateien ist in `docs/email/_vorlage.md` erklärt.

## Schritt 5: Prüfen

Mit einer echten Adresse registrieren und darauf achten:

1. Kommt die Mail an – und zwar im Posteingang, nicht im Spam?
2. Steht `Davaigo <noreply@davaigo.de>` als Absender?
3. Führt der Knopf nach `https://davaigo.de` und nicht nach localhost?

## Wenn die Mails im Spam landen

Dann fehlen die Einträge, mit denen dein Server sich als berechtigter
Absender ausweist. Bei All-Inkl im KAS unter **Domain → DNS-Einstellungen**:

- **SPF**: All-Inkl legt den Eintrag beim Anlegen des Postfachs meist
  selbst an. Nachsehen, ob ein TXT-Eintrag mit `v=spf1` existiert.
- **DKIM**: im KAS unter **E-Mail → DKIM** für davaigo.de einschalten –
  All-Inkl trägt den Schlüssel dann selbst ein.
- **DMARC**: ein TXT-Eintrag auf `_dmarc.davaigo.de` mit dem Wert
  `v=DMARC1; p=none; rua=mailto:killert.manuel@web.de`. Das `p=none`
  sagt: nur beobachten, nichts blockieren – der richtige Anfang.

Danach ein bis zwei Tage warten, bis die Einträge überall bekannt sind.
