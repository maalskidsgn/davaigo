# Veröffentlichung im Play Store – was fertig ist und was fehlt

Stand 21.10.2026.

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

**Der wichtigste Fund:** Die Capacitor-Konfiguration war eine
wortwörtliche Kopie von Habloo – Paketname `de.habloo.app`, App-Name
„Habloo". Hochgeladen wäre Davaigo für Google **dieselbe App** wie
Habloo gewesen und hätte sie überschrieben. Ein Paketname lässt sich
nach der ersten Veröffentlichung nie wieder ändern.

---

## Was nur du tun kannst

### 1. Entwicklerkonto
play.google.com/console, einmalig 25 US-Dollar. Die Identitätsprüfung
dauert ein paar Tage – das lohnt sich als Erstes anzustoßen.

### 2. Java – erledigt

`openjdk@21` ist über Homebrew installiert, nur nicht im
Standardpfad (Homebrew legt es „keg-only" ab). Zum Bauen:

```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
export ANDROID_HOME=~/Library/Android/sdk
```

Das Paket baut damit durch – einmal probiert, Gradle läuft sauber
(nur die üblichen Hinweise zu ungeprüften Vorgängen).

### 3. Signaturschlüssel erzeugen und sichern

Die Verdrahtung steht schon: `android/app/build.gradle` liest
`android/keystore.properties`, und beide Dateien sind gitignored.
Fehlt die Datei, baut Gradle unsigniert durch statt abzubrechen.

**Den Schlüssel musst du selbst erzeugen** – er ist ein Geheimnis und
gehört nicht in einen Chatverlauf. Ein Befehl, der nach einem
Passwort fragt:

```bash
cd ~/projekte/russisch-app/android && $JAVA_HOME/bin/keytool -genkeypair -v -keystore davaigo-release.keystore -alias davaigo -keyalg RSA -keysize 2048 -validity 10000
```

Danach `android/keystore.properties` anlegen:

```
storeFile=davaigo-release.keystore
storePassword=<dein Passwort>
keyAlias=davaigo
keyPassword=<dein Passwort>
```

**Die Schlüsseldatei und das Passwort gehören in den
Passwortmanager.** Gehen sie verloren, kannst du die App im Store nie
wieder aktualisieren – es gibt keinen Weg zurück.

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

## Eine Entscheidung steht noch an: die Paketgröße

Das gebaute Paket ist **98 MB groß – davon 92,6 MB Tonaufnahmen**
(4.221 Dateien). Ohne sie wären es 4 MB.

Erlaubt ist das, aber es kostet Installationen: Über etwa 100 MB
warnt Android beim Herunterladen über Mobilfunk, und viele brechen
dann ab.

Drei Wege:

| Weg | Paket | Ton ohne Netz | Aufwand |
| --- | --- | --- | --- |
| So lassen | 98 MB | ja | keiner |
| Ton vom Server holen | 4 MB | nein | klein – in `src/audio.js` zeigt `ABLAGE` dann auf `https://davaigo.de/audio` |
| Play Asset Delivery | 4 MB + Nachladung | ja, nach dem ersten Start | größer, aber der sauberste Weg |

Mein Rat für die erste Fassung: **Ton vom Server holen.** Die App
fällt ohnehin auf die Gerätestimme zurück, wenn eine Datei fehlt –
der Weg ist also schon gebaut. Wenn Davaigo läuft und jemand nach
Offline fragt, kann man immer noch auf Asset Delivery umstellen.

Sag Bescheid, dann baue ich das um.

## Vorher einmal auf einem echten Gerät prüfen

Die Screenshots sind im Browser bei 393×852 entstanden. Das sieht aus
wie ein Telefon, ist aber keines. Vor dem Hochladen gehört die App
einmal auf ein echtes Android-Gerät – besonders diese Punkte:

- Spielt der Ton? Die 4.178 Aufnahmen liegen im Paket, nicht im Netz.
- Läuft die Anmeldung? Der Bestätigungslink führt nach davaigo.de,
  nicht in die App zurück.
- Laufen die YouTube-Videos im eingebetteten Abspieler?
- Kommt die App nach dem Minimieren an derselben Stelle zurück?

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
