# Davaigo auf dem eigenen Server (Hetzner + Coolify)

Alles läuft auf deinem Hetzner-Server – kein Vercel, keine
Nutzungsklauseln, keine Extra-Kosten. Zwei Container:

| Container | Was | Domain |
|---|---|---|
| **davaigo-web** | die Web-App (Frontend) | `davaigo.de` |
| **davaigo-api** | der Server (Backend) | `api.davaigo.de` |

Dazu extern: **Supabase** (Konten + Datenbank) – läuft schon.

---

## Schritt 1: Code auf GitHub

```bash
cd ~/projekte/russisch-app
git init
git add .
git commit -m "Davaigo: Russisch-Lernapp"
git branch -M main
git remote add origin https://github.com/DEIN-NAME/DEIN-REPO.git
git push -u origin main
```

Die `.env.local` bleibt dabei automatisch draußen (steht in `.gitignore`).

---

## Schritt 2: DNS bei All-Inkl

Im KAS unter *Domain → davaigo.de → DNS*:

| Name | Typ | Wert |
|---|---|---|
| `@` (davaigo.de) | A | `2.28.31.213` |
| `www` | A | `2.28.31.213` |
| `api` | A | `2.28.31.213` |

Die Verbreitung dauert bis zu einer Stunde. Prüfen mit:
`dig +short davaigo.de`

---

## Schritt 3: Backend in Coolify

*New Resource → Application → GitHub Repository*

| Einstellung | Wert |
|---|---|
| Build Pack | **Dockerfile** |
| Dockerfile | `Dockerfile` |
| Port | `8787` |
| Domain | `https://api.davaigo.de` |
| Health Check Path | `/health` |

**Umgebungsvariablen** (Coolify → Environment Variables), Werte aus
deiner lokalen `.env.local`:

```
SUPABASE_URL
SUPABASE_SERVICE_KEY
SUPABASE_ANON_KEY
OPENAI_API_KEY
ELEVENLABS_API_KEY
YOUTUBE_API_KEY
TUBEALFRED_API_KEY
APP_KENNUNG=davaigo
PORT=8787
```

Später für die Bezahlung zusätzlich: `STRIPE_SECRET_KEY`,
`STRIPE_PREIS_ID`, `STRIPE_WEBHOOK_SECRET`.

---

## Schritt 4: Frontend in Coolify

*New Resource → Application → dasselbe GitHub Repository*

| Einstellung | Wert |
|---|---|
| Build Pack | **Dockerfile** |
| Dockerfile | `Dockerfile.web` |
| Port | `80` |
| Domain | `https://davaigo.de` |

**Build-Variablen** (wichtig: als *Build Variable* markieren, nicht
nur als Runtime – Vite backt sie beim Bauen ein):

```
VITE_API_URL=https://api.davaigo.de
VITE_SUPABASE_URL=https://rojsuzwhqcopdbpapwou.supabase.co
VITE_SUPABASE_ANON_KEY=<der sb_publishable_… Schlüssel>
```

Optional: `VITE_SPOTIFY_CLIENT_ID` für den Songs-Bereich.

---

## Schritt 5: Supabase auf die Domain hinweisen

Damit Bestätigungs-Mails und Passwort-Links richtig zurückführen:

*Supabase → Authentication → URL Configuration*

- **Site URL:** `https://davaigo.de`
- **Redirect URLs:** `https://davaigo.de/**`

---

## Schritt 6: Automatisch veröffentlichen

In beiden Coolify-Apps: *Webhooks → GitHub* aktivieren.
Ab dann gilt `git push` = neue Version ist live.

---

## Danach prüfen

1. `https://api.davaigo.de/health` → `{"ok":true}`
2. `https://davaigo.de` → Landingpage erscheint
3. Konto anlegen → Bestätigungsmail kommt an
4. Eine Lektion starten → Audio spielt ab
5. Ein Video öffnen → Transkript erscheint

## Nicht vergessen

- **Backups:** Hetzner-Snapshots einschalten (~1 €/Monat). Die
  Lerndaten liegen zwar bei Supabase, aber der Server-Zustand nicht.
- **Schlüssel wechseln,** falls sie je öffentlich standen:
  Supabase → Settings → API Keys → Rotate.

## Der Auto-Deploy löst nicht aus (Stand 21.08.2026)

**Befund.** In Coolify steht bei beiden Anwendungen `Auto Deploy` auf
an, und ein Webhook-Geheimnis ist hinterlegt. Trotzdem passiert bei
`git push` nichts: In Coolifys Log taucht in 30 Minuten kein einziger
eingehender Webhook auf, und die Deploy-Warteschlange bleibt leer.

**Ursache.** Coolify wartet auf einen Anruf von GitHub, aber im
Repository ist kein Webhook eingetragen. Beim Anlegen über einen
öffentlichen Repository-Link legt Coolify den Webhook nicht selbst an –
das macht nur die GitHub-App-Anbindung. Der Schalter im Coolify-Menü
sagt also nur: *„Wenn ein Webhook kommt, dann deploye"* – nicht:
*„Richte einen Webhook ein."*

### Sofort deployen

Coolify öffnen (`http://2.28.31.213:8000`) → Projekt **Davaigo** → erst
**davaigo-api**, dann **davaigo-web** → oben rechts auf **Deploy**.
Zwei Klicks, danach ist der aktuelle Stand live.

### Dauerhaft reparieren

Für **jede der beiden Anwendungen** einzeln, weil jede ihr eigenes
Geheimnis hat:

1. In Coolify die Anwendung öffnen → Reiter **Webhooks** → Abschnitt
   **Manual Git Webhooks**. Dort stehen eine URL und ein Secret für
   GitHub. Beide kopieren.
2. Auf GitHub: `github.com/maalskidsgn/davaigo` → **Settings** →
   **Webhooks** → **Add webhook**.
   - *Payload URL*: die URL aus Schritt 1
   - *Content type*: `application/json`
   - *Secret*: das Secret aus Schritt 1
   - *Which events*: `Just the push event`
3. Für die zweite Anwendung wiederholen – dann hat das Repository zwei
   Webhooks, einen je Anwendung.

Danach zeigt GitHub unter **Recent Deliveries** bei jedem Push eine
grüne Auslieferung, und Coolify baut von allein.

## Nebenbei: die App ohne Anmeldung anschauen

Zum Durchklicken von Lektionen und Design braucht es keine Datenbank.
Der Vorschau-Modus startet Vite mit `--mode vorschau`, wodurch
`.env.vorschau` die Supabase-Zugangsdaten aus `.env.local` überschreibt
– mit leeren Werten. Die App merkt das und läuft rein im Browser:
kein Konto, keine Anmeldung, alles im localStorage.

```bash
npm run dev -- --mode vorschau --port 5175
```

Dann `http://localhost:5175` öffnen. Der Onboarding-Trichter läuft
einmal durch, danach steht die vollständige App bereit.
