"""
Erzeugt die Davaigo-Symbole für Startbildschirm und Browser.

Warum ein Skript und keine handgemalte Datei: Das Zeichen soll in
jeder Größe identisch aussehen, und wenn sich die Markenfarben ändern,
reicht ein Lauf statt vier neuer Dateien aus dem Grafikprogramm.

    python3 scripts/icons.py

Aufbau: violetter Verlauf über die ganze Fläche, darauf ein goldenes Д.
Bewusst OHNE eigene runde Ecken – iOS und Android schneiden das Symbol
selbst zurecht. Wer die Ecken vorher abrundet, bekommt einen hässlichen
doppelten Rand.

Das Д füllt nur gut die Hälfte der Fläche. Android beschneidet
sogenannte "maskable"-Symbole bis zu 20 Prozent am Rand; alles
Wichtige muss innerhalb dieser Schutzzone liegen.
"""

from PIL import Image, ImageDraw, ImageFont

VIOLETT_HELL = (139, 92, 246)   # #8b5cf6
VIOLETT_DUNKEL = (109, 40, 217)  # #6d28d9
GOLD_HELL = (255, 210, 63)       # #ffd23f
GOLD_DUNKEL = (255, 179, 0)      # #ffb300

SCHRIFT = '/System/Library/Fonts/Supplemental/Arial Black.ttf'
KANTE = 1024  # großzügig gerechnet, danach sauber verkleinert

# Die Nummer steckt im Dateinamen, und das ist Absicht.
#
# iOS brennt das Symbol beim Speichern auf den Startbildschirm ein und
# merkt es sich zur ADRESSE. Bleibt die Datei "/apple-touch-icon.png"
# heißen, lädt Safari sie nach einer Änderung nicht neu – das alte Bild
# klebt fest, auch wenn der Server längst ein neues ausliefert.
#
# Deshalb: Bei jeder Änderung am Symbol diese Zahl erhöhen und die
# neuen Namen in index.html und public/manifest.webmanifest eintragen.
# Neue Adresse, neues Bild, kein Rätselraten.
STAND = 2


def verlauf(groesse, oben_links, unten_rechts, diagonal=True):
    """Ein linearer Farbverlauf als Bild."""
    bild = Image.new('RGB', (groesse, groesse))
    pixel = bild.load()
    for y in range(groesse):
        for x in range(groesse):
            anteil = (x + y) / (2 * groesse - 2) if diagonal else y / (groesse - 1)
            pixel[x, y] = tuple(
                round(a + (b - a) * anteil)
                for a, b in zip(oben_links, unten_rechts)
            )
    return bild


def zeichen_maske(groesse, anteil=0.58):
    """Das Д als Graustufenmaske, mittig gesetzt."""
    maske = Image.new('L', (groesse, groesse), 0)
    stift = ImageDraw.Draw(maske)
    schrift = ImageFont.truetype(SCHRIFT, int(groesse * anteil))
    # Der Kasten um den Buchstaben ist nicht symmetrisch – Д hat unten
    # zwei Füßchen. Deshalb wird über die echten Maße zentriert und
    # nicht über die Zeilenhöhe der Schrift.
    links, oben, rechts, unten = stift.textbbox((0, 0), 'Д', font=schrift)
    stift.text(
        ((groesse - (rechts - links)) / 2 - links,
         (groesse - (unten - oben)) / 2 - oben),
        'Д', font=schrift, fill=255,
    )
    return maske


def symbol(groesse, anteil=0.58):
    grund = verlauf(KANTE, VIOLETT_HELL, VIOLETT_DUNKEL)
    gold = verlauf(KANTE, GOLD_HELL, GOLD_DUNKEL, diagonal=False)
    grund.paste(gold, (0, 0), zeichen_maske(KANTE, anteil))
    return grund.resize((groesse, groesse), Image.LANCZOS)


if __name__ == '__main__':
    for datei, groesse, anteil in [
        # Ohne Nummer, weil manche Dienste stur die Wurzeladresse
        # abfragen. Verlinkt wird aber die Fassung mit Nummer.
        ('public/apple-touch-icon.png', 180, 0.58),
        (f'public/apple-touch-icon-{STAND}.png', 180, 0.58),
        (f'public/icon-192-{STAND}.png', 192, 0.58),
        (f'public/icon-512-{STAND}.png', 512, 0.58),
        # Android beschneidet "maskable"-Symbole auf einen Kreis mit
        # 80 Prozent Durchmesser. Hier steht das Д deshalb kleiner,
        # damit die Füßchen nicht abgeschnitten werden.
        (f'public/icon-maskable-512-{STAND}.png', 512, 0.42),
    ]:
        symbol(groesse, anteil).save(datei, optimize=True)
        print(f'{datei}  {groesse}x{groesse}')
