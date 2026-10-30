# Stripe für Davaigo – Stand 30.10.2026

## Fertig (von mir im Dashboard angelegt)

Konto **Klarwerk Digital**, Live-Modus. Dort liegen auch Habloo
Premium und „Italienisch Grundlagen" – die habe ich nicht angefasst.

### Produkt

`Davaigo Premium` · `prod_VXPLcrZbMaRvqn` · Aktiv

| Preis | Zeitraum | Kennung (`lookup_key`) |
| --- | --- | --- |
| 6,99 € | pro Monat | `davaigo_monat` |
| 49,99 € | pro Jahr | `davaigo_jahr` |
| 99,99 € | einmalig | `davaigo_lifetime` |

**Die Kennungen sind der entscheidende Teil.** `server/bezahlung.js`
sucht die Preise ausschließlich darüber (`prices.list({lookup_keys})`),
nicht über Preis-IDs. Deshalb braucht ein neuer Preis keinen Deploy:
in Stripe anlegen, Kennung vergeben, fertig.

Die Kennungen tragen den App-Namen aus `APP_KENNUNG` (`davaigo`) als
Präfix. So liegen Davaigo und Habloo im selben Stripe-Konto, ohne
sich in die Quere zu kommen.

### Webhook

```
https://api.davaigo.de/api/bezahlung/melden
```

Vier Ereignisse, genau die, die `verarbeiteMeldung()` auswertet:

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `checkout.session.completed`

Mehr wäre unnötiger Verkehr: Der Server lehnt alles andere ohnehin ab.

---

## Was noch fehlt – das musst du selbst machen

Beides sind Geheimnisse, die ich weder lesen noch eintippen darf.

### 1. Der geheime Schlüssel

Stripe → **Entwickler → API-Schlüssel** → „Geheimer Schlüssel"
anzeigen und kopieren (beginnt mit `sk_live_`).

### 2. Das Webhook-Geheimnis

Steht auf der Webhook-Seite unter **Signatur-Geheimnis** (beginnt
mit `whsec_`). Auge-Symbol anklicken, dann kopieren.

Der Webhook heißt `charismatic-jubilee` – den Namen vergibt Stripe
selbst, er lässt sich umbenennen.

### 3. Beides eintragen, an ZWEI Stellen

In `.env.local` (fürs Entwickeln):

```
STRIPE_SECRET_KEY=sk_live_…
STRIPE_WEBHOOK_SECRET=whsec_…
```

Und in **Coolify → davaigo-api → Environment Variables** (für den
Betrieb). Danach **Redeploy**, sonst greifen sie nicht.

`STRIPE_PREIS_ID` brauchst du nicht mehr. Die Variable ist nur noch
ein Rückfall für den alten Einzelpreis; mit den Kennungen oben
findet der Server alles selbst.

---

## Danach prüfen

```bash
curl -s https://api.davaigo.de/api/bezahlung/stand | head -c 400
```

Kommen dort drei Preise zurück, steht die Kasse. Vorher antwortet
der Server, dass `STRIPE_SECRET_KEY` fehlt.

## Was bewusst nicht eingerichtet ist

**In-App-Käufe für iOS und Android.** Apple und Google verlangen in
der App ihr eigenes Abrechnungssystem und erlauben Stripe dort
nicht. Die Bausteine dafür liegen bereit (`src/kauf.js`,
`src/KaufNativ.jsx`, `server/kauf.js`, Paket
`@revenuecat/purchases-capacitor`), sind aber **nirgends
eingebunden** – siehe `store/checkliste.md`. Zum Einschalten fehlt
ein eigenes RevenueCat-Projekt für Davaigo samt Schlüsseln.
