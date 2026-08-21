# Der Bauplan der Davaigo-Mails

Alle vier Vorlagen in diesem Ordner folgen demselben Aufbau. Wer eine
fünfte braucht, kopiert eine bestehende und tauscht nur den Mittelteil.

## Warum das so umständlich aussieht

E-Mail-HTML ist nicht Web-HTML. Outlook rendert mit der Word-Engine,
Gmail entfernt `<style>`-Blöcke, viele Clients kennen kein Flexbox und
kein Grid. Deshalb:

- **Tabellen statt divs.** Ein `<table>` mit fester Breite ist das
  Einzige, was überall gleich aussieht.
- **Styles direkt am Element** (`style="..."`), nicht im Kopf.
- **Keine externen Bilder.** Das Logo ist ein Buchstabe – ein goldenes
  **Д** auf violettem Kreis, gebaut aus einer Tabellenzelle mit
  `border-radius`. Clients, die das nicht können, zeigen ein Quadrat.
  Auch gut.
- **600 Pixel breit.** Der seit zwanzig Jahren übliche Wert; passt in
  jedes Vorschaufenster.

## Die Farben

| Rolle | Wert |
| --- | --- |
| Violett (Marke, Kopf, Button) | `#7c3aed` |
| Gold (Akzent, Linie unter dem Kopf) | `#ffc800` |
| Hintergrund | `#f5f0fc` |
| Karte | `#ffffff` |
| Text | `#2c2340` |
| Text gedämpft | `#6b6280` |

## Die Platzhalter von Supabase

Supabase ersetzt beim Versand:

| Platzhalter | Inhalt |
| --- | --- |
| `{{ .ConfirmationURL }}` | der fertige Link zum Anklicken |
| `{{ .Token }}` | der sechsstellige Code als Alternative |
| `{{ .Email }}` | die Adresse des Empfängers |
| `{{ .NewEmail }}` | bei Adresswechsel die neue Adresse |
| `{{ .SiteURL }}` | `https://davaigo.de` |

Wichtig: Die geschweiften Klammern und die Punkte müssen exakt so
stehen bleiben. Ein fehlendes Leerzeichen macht aus dem Platzhalter
sichtbaren Text in der Mail.

## Einbauen

Supabase-Dashboard → **Authentication** → **Emails** → Reiter
**Templates**. Für jede Vorlage: Betreff aus der Kopfzeile der Datei
übernehmen, dann den HTML-Block hineinkopieren und speichern.
