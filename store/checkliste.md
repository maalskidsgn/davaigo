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

### 2. Java installieren
Auf dem Rechner fehlt eine Java-Laufzeit, deshalb lässt sich das Paket
hier nicht bauen. Am einfachsten über Android Studio, das bringt ein
passendes JDK mit.

### 3. Signaturschlüssel erzeugen und sichern
Google unterschreibt die App zwar selbst (Play App Signing), aber den
Upload-Schlüssel brauchst du – **und wenn er verloren geht, kannst du
nie wieder ein Update hochladen.** Gehört in einen Passwortmanager,
nicht in dieses Projekt.

### 4. Das Paket bauen

```bash
cd ~/projekte/russisch-app && npm run build:app
```

Das baut mit `--mode app` (damit `VITE_API_URL` auf
`https://api.davaigo.de` zeigt – in der Store-App gibt es kein
`/api` im eigenen Paket) und schiebt alles nach `android/`. Danach in
Android Studio: **Build → Generate Signed Bundle** → `.aab`.

### 5. Datenschutzerklärung – hier ist noch etwas zu tun

**Das ist der Punkt, an dem Einreichungen am häufigsten scheitern.**

Google verlangt eine öffentlich erreichbare Adresse. Wir haben
`https://davaigo.de/?recht=datenschutz` – die Seite zeigt die
Erklärung, **aber nur mit JavaScript**. Nachgemessen: ohne JavaScript
kommen 43 Zeichen zurück, und das Wort „Datenschutz" ist nicht
darunter. Googles automatische Prüfung lädt oft ohne JavaScript.

Zwei Wege:

- **Erst einreichen, dann sehen.** Viele Prüfer öffnen die Adresse im
  Browser, dort funktioniert sie einwandfrei. Kommt eine Ablehnung,
  ist sie in einem Tag behoben.
- **Vorher absichern.** Ich baue eine statische Seite unter
  `/datenschutz/`, wie die Ratgeberseiten – fertiges HTML, ohne
  JavaScript lesbar. Sag Bescheid, dann mache ich das.

### 6. Inhaltsfreigabe ausfüllen
Altersfreigabe (Fragebogen), Zielgruppe, Werbung (**keine**),
Datensicherheit (Antworten stehen in `datensicherheit.md`).

---

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
