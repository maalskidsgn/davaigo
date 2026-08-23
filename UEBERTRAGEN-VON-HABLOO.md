# Was bei Habloo am 23.08.2026 repariert wurde – und in Davaigo genauso ansteht

Davaigo und Habloo sind aus derselben Vorlage gebaut. **Jeder Fehler
unten wurde bei Habloo gefunden, behoben und nachgemessen – und steckt
in Davaigo an derselben Stelle.** Die Zeilennummern hier sind die von
Davaigo, nicht die von Habloo.

Habloo liegt unter `~/projekte/spanisch-app`, alle genannten Commits
sind dort im `main`. Wo es hilft, einfach `git show <commit>` – die
Commit-Texte erklären das Warum ausführlich.

**Reihenfolge:** 1 → 2 → 3 sind alle derselbe Ausfall und gehören
zusammen erledigt. 4 ist der schwerwiegendste inhaltliche Fehler.
5–7 sind Mail. 8 ist nur Information.

---

## 1. Übersetzen ist komplett kaputt (Ursache aller sichtbaren Fehler)

**Symptom:** „(keine Übersetzung gefunden)" beim Antippen eines Wortes,
Untertitel-Übersetzung tut nichts, Videosuche liefert deutsche Treffer.

**Ursache:** Alle drei Übersetzungswege hängen an

```
https://translate.googleapis.com/translate_a/single?client=gtx…
```

Das ist der undokumentierte Endpunkt hinter Googles eigenem
Übersetzungs-Widget – kein Schlüssel, keine Zusage. **Google antwortet
inzwischen mit HTTP 429 und einer „Sorry"-Seite.** Nachgemessen am
23.08. Wiederholen hilft nicht, das ist keine Überlastung, sondern eine
Sperre. Auf einem Server-Rechenzentrum greift sie schneller als am
Heimanschluss.

**Betroffen in Davaigo** (`server/index.js`):
- Zeile 294 – Einzelwort ru→de (`/api/translate`)
- Zeile 364 – Suchbegriff de→ru (Videosuche)
- Zeile 466 – Untertitel-Stapel (`/api/translate-batch`)

**Lösung:** `server/uebersetzen.js` aus Habloo übernehmen und die drei
Stellen darauf umstellen. Es übersetzt mit `gpt-4o-mini` – kein neues
Konto, kein neuer Schlüssel, dasselbe Modell, das ohnehin Wortlisten
schreibt. **Beim Kopieren die Sprachrichtung anpassen:** Bei Habloo
Spanisch↔Deutsch, bei Davaigo Russisch↔Deutsch (Prompts in
`uebersetzeWort` und `uebersetzeZeilen`).

Zwei Dinge, die dabei besser werden als vorher:
- **Untertitel im Zusammenhang.** Das Modell sieht das ganze Paket und
  trifft den Bezug. Die alte Lösung klebte 25 Zeilen mit `\n` zusammen
  und hoffte auf dieselbe Anzahl zurück – kam eine mehr oder weniger,
  fiel sie auf Zeile-für-Zeile zurück (25 Anfragen statt einer). Jetzt
  garantiert ein JSON-Schema die Anzahl; bei Abweichung wird
  aufgefüllt statt verschoben (eine verrutschte Untertitelspur ist
  schlimmer als eine fehlende Zeile).
- **Zwischenspeicher für Einzelwörter.** Beim Lesen tippt man dasselbe
  Wort ständig an; der zweite Aufruf braucht 0,017 s statt einer
  Sekunde.

→ Habloo-Commit `ceac49b`

---

## 2. Ein Fehlschlag wird als Übersetzung GESPEICHERT (Datenschaden)

**Das ist der schlimmere Teil des Screenshots.** In
`src/App.jsx:696` steht:

```js
const translation = data.translation || '(keine Übersetzung gefunden)'
setVocab(... { translation } ...)   // ← landet im Wortschatz
```

Der Ersatztext wird nicht nur angezeigt, sondern **als Bedeutung
gespeichert**. Jedes Wort, das seit dem Google-Ausfall angetippt wurde,
steht im Vokabeltrainer und wird dort irgendwann mit einer
Fehlermeldung als Lösung abgefragt. Bei Habloo waren es fünf Wörter,
bei Davaigo mit dem sichtbaren `относиться` mindestens eins.

**Lösung:**
- Bei Fehlschlag **nichts** speichern. Das Wort bleibt gemerkt, aber
  ohne erfundene Bedeutung – nachtragbar im Trainer, und beim nächsten
  Antippen wird es erneut versucht.
- Auf der Karte den **echten Grund** zeigen statt „(keine Übersetzung
  gefunden)". Das Wort *hat* eine Übersetzung, der Dienst kam nur nicht
  dran. Habloo nutzt dafür `selected.fehler` + CSS-Klasse
  `.word-fehler`.

**Vorhandene Datensätze reparieren.** In Supabase nachsehen, welche
Einträge die Fehlermeldung als Übersetzung tragen:

```sql
select id, wort_ru, uebersetzung from vokabeln
where uebersetzung ilike '%keine Übersetzung%'
   or uebersetzung ilike '%fehlgeschlagen%';
```

Dann entweder korrigieren (richtige Übersetzung eintragen) oder die
Zeilen löschen – beim nächsten Antippen landen sie sauber wieder drin.
**Manuel vorher fragen**, es sind seine Daten. Bei Habloo hat er
„korrigieren" gewählt.

→ Habloo-Commit `5f16a2b`

---

## 3. Die Suche behauptet etwas, das nicht stimmt

In `server/index.js:361–372` fällt die Suche bei fehlgeschlagener
Übersetzung **still** auf den deutschen Begriff zurück. Über der
Trefferliste steht weiter „russische Videos dazu", darunter kommen
deutsche. Die App behauptet etwas, statt zuzugeben, dass etwas fehlt –
**genau deshalb blieb der Google-Ausfall wochenlang unbemerkt.**

**Lösung:** Der Server schickt ein Feld `hinweis` mit, die Oberfläche
zeigt es über der Trefferliste. Gesucht wird trotzdem weiter, nur eben
ehrlich.

→ Habloo-Commit `6c11879`

**Das Muster dahinter ist wichtiger als die drei Einzelfälle:** An drei
Stellen war ein Fehler abgefangen und weggelächelt worden. Deshalb hat
Manuel sie gefunden und nicht ich. Beim Durchgehen von Davaigo lohnt
sich die Suche nach weiteren leeren `catch {}`-Blöcken.

---

## 4. Der Karteikasten wächst nicht – Wörter hängen bei 2,5 Tagen

**Der schwerwiegendste Fehler, weil er die Kernmechanik betrifft.**

`src/srs.js` rechnet richtig. `src/sync.js` speichert aber nur `stufe`
und `faellig_am` (Zeilen 28–29) – **`intervall` und `leichtigkeit`, von
denen die Rechnung lebt, fallen weg.** Beim nächsten App-Start holt
`zusammenfuehren()` die Datenbankfassung, die bei gleicher Stufe
gewinnt (Zeile 178), und `intervall` fällt auf die grobe Leiter
`[0,1,3,7,14,30,90]` zurück.

Zwölf Wiederholungen mit „Gut", nachgerechnet:

```
ohne Sync:  1 → 2,5 → 6,3 → 15,8 → 39,5 → 98,8 → 247 → 365
mit Sync:   1 → 2,5 → 2,5 → 2,5 → 2,5 → 2,5 → 2,5 → 2,5
```

2,5 Tage runden auf Stufe 1 ab, Stufe 1 heißt wieder 1 Tag, mal 2,5
sind wieder 2,5 – ein Kreis, aus dem kein Wort je herauskommt. Bei
„Schwer" dasselbe bei 0,5 Tagen. Wer täglich übt, sieht dieselben
Wörter für immer alle drei Tage.

**Lösung, drei Teile:**

1. **SQL in Supabase** (Projekt `rojsuzwhqcopdbpapwou`) – das macht
   Manuel im SQL Editor:
   ```sql
   alter table vokabeln
     add column if not exists intervall real,
     add column if not exists leichtigkeit real;
   ```
2. **`sync.js`**: beide Felder in `zuDatenbank`/`zuApp` mitnehmen.
   Wichtig: defensiv bauen – wenn die Spalten noch fehlen, meldet
   PostgREST `PGRST204` und der Schreibvorgang scheitert **komplett**.
   Habloo fängt das ab und schreibt einmal ohne die Felder weiter,
   sonst könnte niemand mehr Vokabeln sichern, nur weil eine Migration
   aussteht. Die Fehlermeldung lautet *„Could not find the 'intervall'
   column of 'vokabeln' in the schema cache"* – der Name steht dort
   **vor** dem Wort `column`, eine Textprüfung auf „column intervall"
   greift daneben.
3. **Zusammenführung**: statt der groben Stufe den echten Abstand
   vergleichen. Zwei Wörter mit 1 und mit 39 Tagen liegen beide auf
   Stufe 1 – bei Gleichstand gewann bisher die Datenbank, also der
   kleinere Abstand.

**Dazu ein Anzeigefehler:** In `vorschau()` steht auf „Gut" und
„Einfach" beide Male „3 Tage" (2,5 und 3,25 auf ganze Tage gerundet).
Unter einer Woche eine Nachkommastelle zeigen.

**Und einen Prüfer anlegen.** `pruefe-srs.mjs` aus Habloo übernehmen:
Er prüft nicht `review()` allein, sondern die **Rundreise** durch die
Datenbankform – der Fehler war an einer einzelnen Funktion nicht zu
sehen. Gegen den alten Stand gegengeprüft: Er schlägt an und nennt
genau diese Zahlen. Ein Test, der nie fehlschlägt, ist keiner.

→ Habloo-Commit `a7e6efa`

---

## 5. Passwort-Reset ist nur halb gebaut

In Davaigo gibt es **kein** `updateUser` und kein `PASSWORD_RECOVERY`
(geprüft 23.08.). Das heißt: Mail kommt, Link geht, Supabase meldet
den Nutzer an – aber nirgends ein Formular, das ein **neues** Passwort
setzt. Der Nutzer steht angemeldet in der App, weiß nicht, dass er
etwas ändern muss, und hat es beim nächsten Mal wieder vergessen.

**Lösung:** `useNutzer()` fängt das Ereignis `PASSWORD_RECOVERY` ab,
eine Komponente `NeuesPasswort.jsx` legt sich über die App – **ohne
Schließen-Knopf**, denn wer hier abbricht, steht beim nächsten Mal
wieder vor derselben Tür.

**Außerdem die Rückkehr-Adressen:** `src/auth.js:83` nimmt
`window.location.origin`. In der Store-App ist das
`capacitor://localhost` – ein Link, den kein Mailprogramm öffnen kann.
Und `signUp()` hat gar kein `emailRedirectTo`, landet also auf
Supabases Site URL. Beides fest auf `https://davaigo.de` setzen.

→ Habloo-Commit `bcde14a`

---

## 6. Mailversand über eine eigene Adresse

Habloo verschickt selbst keine Mail – alles kommt von **Supabase
Auth**. Der Standard-Absender ist auf wenige Mails pro Stunde
gedrosselt und landet im Spam. Bei Habloo läuft es jetzt über ein
All-Inkl-Postfach.

**Für Davaigo prüfen:** Gibt es ein Postfach (z. B.
`lernen@davaigo.de`)? Wenn ja, dieselben Einstellungen setzen. Wenn
nein, muss Manuel es im KAS anlegen – das kann Claude nicht.

**Was zu setzen ist** (Supabase → Authentication):
- SMTP: Host `wXXXXXXX.kasserver.com`, **Port 587**, Benutzername die
  volle Adresse, Absendername „Davaigo"
- Site URL `https://davaigo.de`, Redirect URLs
  `https://davaigo.de`, `https://davaigo.de/**`
- `mailer_autoconfirm` auf **false** – bei Habloo war jeder sofort
  „bestätigt", ohne je eine Mail zu sehen

**Wichtig: nicht klicken, sondern die Management-API nehmen.**
`scripts/supabase-mail-einrichten.mjs` aus Habloo übernehmen. Es liest
erst, **was wirklich gespeichert ist**, zeigt die Abweichungen, und
schreibt nur mit `--los`. Genau das fehlte bei Habloo stundenlang: Das
Formular zeigte das eine, gespeichert war das andere (`site_url` stand
auf `http://localhost:3000`), und niemand konnte es sehen.

Dafür braucht es `SUPABASE_ACCESS_TOKEN` (supabase.com → Account →
Access Tokens) in `.env.local`. **Den legt Manuel an.**

Zwei Fallen im Skript, die schon eingebaut sind:
- **Passwort nur setzen, wenn keins da ist.** Supabase gibt es
  verschlüsselt zurück, ein blinder Vergleich ist immer „anders" und
  würde es bei jedem Lauf neu schreiben.
- **Port ebenso.** Was gespeichert ist und nachweislich sendet, bleibt.

→ Habloo-Commits `f271b15`, `a6959d6`

---

## 7. Mail-Vorlagen im Davaigo-Design

Die Supabase-Standardvorlagen sind englisch und sehen aus wie ein
Systemfehler. Habloo hat vier Vorlagen in `mail-vorlagen/`:
`confirm-signup.html`, `reset-password.html`, `magic-link.html`,
`change-email.html`, dazu `BETREFFZEILEN.md` mit der Zuordnung.

**Zum Übernehmen:** Farben tauschen (Habloo-Orange `#ff6c00` →
Davaigo-Violett `#8b5cf6` / `#6d28d9`, Gold `#ffd23f` für Akzente),
Texte auf Russisch-Kontext anpassen (`¡Hola!` → `Привет!`), Logo-Kachel
mit dem Davaigo-Zeichen.

**Warum Tabellen und Inline-Styles statt schönem CSS:** Mailprogramme
sind keine Browser. Outlook, Gmail und Apple Mail werfen Stylesheets,
Flexbox, Webfonts und SVG unterschiedlich weg. Tabellen mit
Inline-Styles sind das Einzige, was überall gleich aussieht. Das Logo
ist deshalb eine farbige Kachel mit einem Unicode-Zeichen statt des
SVG aus der App.

**Keine lange Rückfall-Adresse unter den Knopf.** Habloo hatte erst
„Falls der Knopf nicht geht, kopiere diesen Link" samt 150-Zeichen-
Token darunter – Manuels Urteil: „so ein komischer Link unten". Sieht
nach Spam aus, und niemand tippt das ab. Stattdessen ein kurzer
Hinweis, an wen man sich wendet.

→ Habloo-Commits `8518470`, `9a92111`

---

## 8. Auto-Deploy läuft für Davaigo bereits

**Nichts zu tun, nur zur Information.** Auf dem Hetzner-Server
(`2.28.31.213`) läuft seit dem 23.08. ein Wächter:

```
/usr/local/bin/coolify-autodeploy.sh   (systemd-Timer, alle 2 Minuten)
Protokoll: /var/log/coolify-autodeploy.log
```

Er vergleicht `git ls-remote` mit dem letzten ausgelieferten Commit in
Coolifys Datenbank und stößt bei Abweichung Coolifys eigenen
Deploy-Vorgang an. **Er gilt für alle Apps, auch `davaigo-web` und
`davaigo-api`** – beide hingen zwei Tage hinterher und wurden dabei
gleich mit ausgeliefert.

Nach einem Push also **nicht** manuell deployen, sondern
`tail /var/log/coolify-autodeploy.log` ansehen. Abschalten mit
`systemctl disable --now coolify-autodeploy.timer`.

Zugang zum Server: `ssh -i ~/.ssh/hetzner_vamigo root@2.28.31.213`.
Coolify per Kommandozeile: `docker exec coolify php artisan tinker
--execute="…"`, Datenbank `docker exec coolify-db psql -U coolify`.

---

## Fallen beim Testen (bei Habloo teuer gelernt)

- **`example.com`-Adressen** blockt Supabase **vor** dem Versand und
  meldet HTTP 500 „Error sending recovery email". Das sieht aus wie ein
  SMTP-Fehler, ist aber keiner. Kostete mehrere Stunden Fehlersuche.
- **Web.de kennt keine Plus-Adressen.** `name+tag@web.de` → `550
  mailbox unavailable`. Für Tests Gmail nehmen oder eine echte zweite
  Adresse.
- **60-Sekunden-Drossel je Empfänger.** Ein Nachtest an dieselbe
  Adresse zeigt nichts Neues – Supabase antwortet 429, verschickt die
  alte Mail aber trotzdem. So entsteht der Eindruck „die Vorlage ändert
  sich nicht", obwohl sie längst aktiv ist.
- **Bounces landen im Postfach selbst** (IMAP 993). Dort steht der
  echte Grund **und der Betreff der abgewiesenen Mail** – so ließ sich
  bei Habloo beweisen, dass die neue Vorlage längst gerendert wurde.
- **Jeder PATCH auf `config/auth`** löst sofort ein `reloading api with
  new configuration` aus (im Auth-Log sichtbar). Vorlagen greifen
  unmittelbar, man muss nicht warten.

---

## Reihenfolge, die ich vorschlagen würde

1. **Übersetzen reparieren** (1) – dann sind 2 und 3 nur noch
   Aufräumarbeiten, und Manuel kann die App wieder normal benutzen
2. **Kaputte Vokabeln reparieren** (2) – vorher mit Manuel abstimmen
3. **Karteikasten** (4) – braucht Manuels SQL, also früh ansprechen
4. **Passwort-Formular** (5)
5. **Mail** (6, 7) – braucht ein Postfach und einen Access-Token von
   Manuel

Nach jedem Schritt pushen; der Wächter liefert innerhalb von zwei
Minuten aus, ohne dass jemand etwas anklicken muss.
