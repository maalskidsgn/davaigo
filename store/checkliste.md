# Veröffentlichung in den Stores – was fertig ist und was fehlt

Stand 30.10.2026 (Android seit 21.10., iOS neu dazu).

---

## Fertig

| | |
| --- | --- |
| Paketname | `de.davaigo.app` |
| App-Name | Davaigo |
| Android-Projekt | `android/`, Mindest-Android 7.0 (SDK 24), Ziel SDK 36 |
| Symbole | alle fünf Auflösungen plus adaptives Symbol, violett mit goldenem Д |
| Store-Symbol 512×512 | `store/grafiken/app-symbol-512.png` |
| Hauptgrafik 1024×500 | `store/grafiken/hauptgrafik-1024x500.png` |
| Screenshots | vier Stück, 786×1704, in `store/screenshots/` |
| Texte | `store/eintrag.md` |
| Datensicherheits-Formular | `store/datensicherheit.md` |
| iOS-Projekt | `ios/`, Paketkennung `de.davaigo.app`, Team 2S6262ZCFW |
| iOS-Symbol und Startbild | aus `scripts/icons.py`, ohne Alpha-Kanal |
| Signaturschlüssel | erzeugt, Paket wird signiert – **sichern!** (Punkt 3) |

Beide Pakete bauen durch. Nachgeprüft am 30.10.2026:

- Android: `app-release.aab`, **4,1 MB**, signiert.
- iOS: `xcodebuild` läuft sauber durch, einschließlich
  `-validate-for-store`. Im Simulator startet die App und zeigt die
  Startseite.

**Der wichtigste Fund:** Die Capacitor-Konfiguration war eine
wortwörtliche Kopie von Habloo – Paketname `de.habloo.app`, App-Name
„Habloo". Hochgeladen wäre Davaigo für Google **dieselbe App** wie
Habloo gewesen und hätte sie überschrieben. Ein Paketname lässt sich
nach der ersten Veröffentlichung nie wieder ändern.

---

## Was nur du tun kannst

### 1. Entwicklerkonto
Laut Manuel bezahlt (21.10.2026). Nachsehen kann ich das nicht: Die
Browser-Ansicht hier hat eine eigene Sitzung, in der kein
Google-Konto angemeldet ist.

Zu prüfen ist dort noch die **Identitätsprüfung** – ohne
abgeschlossene Verifizierung lässt sich nichts veröffentlichen, und
sie dauert mitunter Tage.

### 2. Java – erledigt

`openjdk@21` ist über Homebrew installiert, nur nicht im
Standardpfad (Homebrew legt es „keg-only" ab). Zum Bauen:

```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
export ANDROID_HOME=~/Library/Android/sdk
```

Das Paket baut damit durch – einmal probiert, Gradle läuft sauber
(nur die üblichen Hinweise zu ungeprüften Vorgängen).

### 3. Signaturschlüssel – erledigt, aber du musst ihn sichern

Der Schlüssel ist am 30.10.2026 erzeugt worden und liegt hier:

```
android/davaigo-release.keystore     die Schlüsseldatei
android/keystore.properties          Alias und Passwort im Klartext
```

Beide Dateien sind gitignored (nachgeprüft mit `git check-ignore`)
und stehen auf `chmod 600`. Das Passwort hat 40 Zeichen und ist
zufällig erzeugt – es steht **nirgends sonst**, auch in keinem
Chatverlauf. Nachlesen kannst du es in `keystore.properties`.

Nachgeprüft: `./gradlew bundleRelease` erzeugt jetzt ein **signiertes**
Paket – `META-INF/DAVAIGO.RSA` liegt darin.

| | |
| --- | --- |
| Alias | `davaigo` |
| Verfahren | RSA 4096, SHA384withRSA |
| Gültig bis | 17.03.2054 |
| SHA-256 | `0B:79:14:BC:42:73:38:DE:C8:59:B6:14:18:EF:90:DE:60:49:2A:96:D5:46:FF:28:DE:3D:2C:00:8C:A4:94:49` |

**Jetzt bist du dran, und das ist wirklich wichtig:**

1. `android/keystore.properties` öffnen, das Passwort in deinen
   Passwortmanager übertragen.
2. `android/davaigo-release.keystore` als Datei dazulegen – die
   meisten Passwortmanager können Anhänge. Sonst ein verschlüsseltes
   Backup an einem zweiten Ort.

**Warum das kein Papierkram ist:** Beide Dateien liegen nur auf
diesem Rechner und in keinem Repository. Festplatte kaputt, Rechner
weg, Ordner versehentlich gelöscht – und du kannst Davaigo im Play
Store **nie wieder aktualisieren**. Google nimmt keine App an, die
mit einem anderen Schlüssel signiert ist, und es gibt keinen Weg
zurück. Die einzige Rettung wäre dann eine neue App unter neuem
Paketnamen, ohne Bewertungen und ohne die bisherigen Installationen.

Falls du bei Google **Play App Signing** einschaltest (empfohlen und
bei neuen Apps ohnehin Pflicht), verwaltet Google den eigentlichen
Verteilungsschlüssel. Dieser hier bleibt trotzdem nötig: Er ist der
Upload-Schlüssel, mit dem du beweist, dass du der Absender bist.

### 4. Das Paket bauen

```bash
cd ~/projekte/russisch-app && npm run build:app
```

Das baut mit `--mode app` (damit `VITE_API_URL` auf
`https://api.davaigo.de` zeigt – in der Store-App gibt es kein
`/api` im eigenen Paket) und schiebt alles nach `android/`. Danach in
Android Studio: **Build → Generate Signed Bundle** → `.aab`.

### 5. Datenschutzerklärung – erledigt

Die Adresse für die Play Console lautet:

```
https://davaigo.de/datenschutz/
```

Das ist fertiges HTML, ohne JavaScript lesbar – 1.080 Wörter kommen
auch dann zurück, wenn kein Skript läuft. Vorher waren es 43 Zeichen,
in denen das Wort „Datenschutz" nicht einmal vorkam.

Der Text wird nicht doppelt gepflegt: `scripts/baue-recht.mjs` lässt
React die Komponenten aus `src/Recht.jsx` einmal beim Bauen zu HTML
rendern. Ändert sich die Erklärung in der App, ändert sich die Seite
beim nächsten Build mit. Auch das Aussehen kommt aus `src/App.css`
statt aus einer zweiten Kopie.

Unter `/impressum/` und `/agb/` liegen die beiden anderen
Pflichtseiten genauso.

### 6. Inhaltsfreigabe ausfüllen – vorbereitet

Alle Antworten stehen in `store/inhaltsfreigabe.md`: Fragebogen zur
Altersfreigabe, Zielgruppe, Werbung, Abrechnung und der Testzugang,
den Google braucht. Abtippen, nicht nachdenken.

---

## Paketgröße – entschieden und umgesetzt

Das Paket ist jetzt **4,1 MB** statt 98 MB. Die 4.221 Tonaufnahmen
liegen nicht mehr im Paket, sondern werden von
`https://davaigo.de/audio` geholt.

Was das bedeutet: Ohne Netz spricht in der App die Gerätestimme statt
der echten Aufnahme. Der Weg dorthin war ohnehin gebaut – fehlt eine
Datei, fällt die App von selbst zurück.

Falls später jemand nach Offline-Ton fragt, ist Play Asset Delivery
der saubere Weg: Das Paket bleibt klein, die Aufnahmen kommen beim
ersten Start nach.

## Vorher einmal auf einem echten Gerät prüfen

Die Screenshots sind im Browser bei 393×852 entstanden. Das sieht aus
wie ein Telefon, ist aber keines. Vor dem Hochladen gehört die App
einmal auf ein echtes Android-Gerät – besonders diese Punkte:

- Spielt der Ton? Die Aufnahmen liegen NICHT im Paket, sondern
  unter https://davaigo.de/audio – ohne Netz spricht die
  Gerätestimme.
- Läuft die Anmeldung? Der Bestätigungslink führt nach davaigo.de,
  nicht in die App zurück.
- Laufen die YouTube-Videos im eingebetteten Abspieler?
- Kommt die App nach dem Minimieren an derselben Stelle zurück?

---

## iOS – was noch fehlt

Das Projekt steht unter `ios/` und baut durch. Was nur über Xcode
und App Store Connect geht:

1. **App in App Store Connect anlegen** – mit der Kennung
   `de.davaigo.app`. Die gibt es dort noch nicht; Habloo läuft unter
   `de.habloo.app` und bleibt davon unberührt.
2. **Archivieren und hochladen:** in Xcode `ios/App/App.xcodeproj`
   öffnen, Gerät auf „Any iOS Device", dann **Product → Archive** →
   **Distribute App**. Das Entwicklerteam steht schon im Projekt.
3. **Datenschutz-Angaben** in App Store Connect: dieselben Antworten
   wie bei Google, siehe `datensicherheit.md`.
4. **Melden und Blockieren** erwähnen, falls gefragt wird. Apples
   Richtlinie 1.2 verlangt das, seit es Benutzernamen und
   Profilbilder gibt – eingebaut ist es (siehe
   `inhaltsfreigabe.md`).

Anders als bei Android ist auf iOS **kein eigener Signaturschlüssel**
nötig: Das übernimmt Xcode über das Entwicklerkonto.

```bash
cd ~/projekte/russisch-app && npm run build:app && npx cap open ios
```

---

## Die Angaben zur Interaktion haben sich geändert

Mit Rangliste, Freunden und Duellen sehen Nutzer erstmals Inhalte
anderer Nutzer. Im Fragebogen zur Inhaltseinstufung stehen deshalb
zwei Antworten jetzt auf **Ja** statt Nein, und es gibt eine Melde-
und Blockierfunktion. Die Begründungen stehen in
`store/inhaltsfreigabe.md` – falsche Angaben dort sind einer der
häufigsten Gründe für eine nachträgliche Sperre.

---

## Was bewusst NICHT in die erste Fassung gehört

**Die Bezahlung.** Google verlangt für digitale Inhalte in der App
sein eigenes Abrechnungssystem (Play Billing) und erlaubt Stripe dort
nicht. Unsere Kasse läuft über Stripe.

Für die erste Veröffentlichung ist das kein Problem: Premium wird in
der App gar nicht angeboten, `istApp` blendet es aus. Wer es haben
will, kauft es auf davaigo.de im Browser. Das ist erlaubt, solange die
App nicht dorthin verlinkt oder dazu auffordert.

**Vor dem Hochladen prüfen**, dass in der App wirklich kein
Premium-Knopf und kein Hinweis auf davaigo.de/kasse auftaucht – sonst
droht eine Sperre wegen Umgehung der Abrechnung.
