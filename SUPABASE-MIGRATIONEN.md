# Die Datenbank nachziehen

Rangliste, Freunde, Duelle, Melden und Blockieren brauchen Tabellen
und Funktionen, die es in Davaigos Datenbank noch nicht gibt. Bis sie
da sind, blenden sich die neuen Karten **von selbst aus** statt
Fehler zu zeigen – die App läuft also auch ohne. Sichtbar wird das
Neue erst nach diesen acht Schritten.

**Wo:** [Supabase](https://supabase.com/dashboard) → Projekt
`rojsuzwhqcopdbpapwou` → links **SQL Editor** → **New query** →
Dateiinhalt einfügen → **Run**.

Die Schritte 9 und 10 haengen an keinem der anderen und koennen auch zuerst laufen.

Jede Datei ist mehrfach ausführbar. Zweimal laufen zu lassen schadet
also nicht – aber **die Reihenfolge zählt**, weil jede Datei auf der
vorigen aufbaut.

| # | Datei | Was dazukommt |
| --- | --- | --- |
| 1 | `supabase-rangliste.sql` | Benutzernamen, die Top-10-Liste |
| 2 | `supabase-rangliste-zeitraum.sql` | XP je Tag – Grundlage für Woche, Monat, Jahr |
| 3 | `supabase-rangliste-automatisch.sql` | Jeder bekommt automatisch einen Benutzernamen |
| 4 | `supabase-profilbild.sql` | Spalte `profile.bild` und der Speicher-Eimer |
| 5 | `supabase-freunde.sql` | Freundschaften, Suche, öffentliches Profil, Wochenwertung |
| 6 | `supabase-duelle.sql` | Duelle gegen Freunde |
| 7 | `supabase-moderation.sql` | Melden und Blockieren |
| 8 | `supabase-moderation-filter.sql` | Blockierte auch serverseitig aus den Listen nehmen |
| 9 | `supabase-tutor.sql` | Tageskontingent fuer das Gespraech mit Dascha |
| 10 | `supabase-nutzung.sql` | Tageskontingent fuer alle KI-Abrufe |
| 11 | `supabase-ki-nutzung.sql` | Schreibt Teile von ki_nutzung einzeln – gegen Datenverlust |

## Warum die Reihenfolge wichtig ist

- **2 vor 5:** Die Wochenwertung summiert die Tabelle `xp_tage`, und
  die entsteht in Schritt 2.
- **4 vor 5:** Die Rangliste gibt das Profilbild mit heraus. Ohne die
  Spalte `profile.bild` bricht Schritt 5 ab.
- **5 und 6 vor 7:** Beim Blockieren werden Freundschaft und
  laufende Duelle aufgelöst. Fehlen die Tabellen, scheitert erst das
  Blockieren – und zwar still, bis es jemand benutzt.
- **7 vor 8:** Schritt 8 legt sich als Sieb um die Funktionen aus
  den Schritten davor. Ohne sie gibt es nichts zu umhüllen.

## Was Schritt 5 ersetzt

`supabase-freunde.sql` wirft die zweistellige Fassung von
`rangliste_zeitraum` weg und legt eine dreistellige an (Zeitraum,
Anzahl, nur Freunde). Beide nebeneinander mit Vorgabewerten wären
zweideutig – Postgres bräche beim Aufruf ab. Das `drop function`
steht deshalb bewusst darin und ist kein Versehen.

## Hinterher prüfen

Nach Schritt 8 im SQL Editor:

```sql
select proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and proname in ('rangliste_zeitraum','profil_oeffentlich','nutzer_suchen',
                  'meine_freunde','freund_anfragen','nutzer_blockieren','nutzer_melden')
order by proname;
```

Sieben Zeilen heißt: alles da. Danach erscheint die Ranglisten-Karte
auf der Startseite, sobald man angemeldet ist.

## Rückwirkend gibt es nichts

Woche, Monat und Jahr beginnen am Tag der Einrichtung bei null – wer
wann gelernt hat, wurde vorher nicht mitgeschrieben. Die Gesamtliste
ist davon unberührt, sie liest weiter `statistik.xp`.

## Offener Punkt: der Mailversand

Die SMTP-Zugangsdaten in `.env.local` werden von All-Inkl
**abgelehnt** – am 30.10.2026 geprüft, auf Port 587 und 465:

```
535 5.7.8 Error: authentication failed
```

Betroffen sind die Mail zur Freundschaftsanfrage und die
Meldungs-Mail. Beide scheitern still: `schicke()` fängt den Fehler
ab, die Anfrage selbst steht trotzdem in der Datenbank. Niemand
bekommt also einen Fehler zu sehen – aber auch keine Mail.

**Vermutlich betrifft es mehr.** Wenn Supabase dieselben Daten für
die Anmeldebestätigung und „Passwort vergessen" benutzt, kommen
auch die nicht an – und dann kann sich niemand neu registrieren.
Das wäre der dringendere Fall.

Zu prüfen im KAS von All-Inkl:

1. Gibt es das Postfach `lernen@davaigo.de` noch, und stimmt das
   Passwort?
2. Verlangt All-Inkl für dieses Postfach einen anderen
   SMTP-Benutzernamen als die Mailadresse (bei KAS üblich: eine
   Kennung wie `m01234567`)?

Danach `SMTP_USER` und `SMTP_PASS` in `.env.local` berichtigen – und
dieselben Werte in Coolify, denn im Betrieb kommen sie von dort.
