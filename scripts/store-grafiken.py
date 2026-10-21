"""
Die Bilder für den Play-Store-Eintrag.

    python3 scripts/store-grafiken.py

Google verlangt zwingend ein App-Symbol in 512x512 und ein
"Feature-Grafik" genanntes Banner in 1024x500. Beide landen in
store/grafiken/.

Warum hier und nicht von Hand in einem Grafikprogramm: Dieselbe
Begründung wie bei scripts/icons.py – ändern sich die Markenfarben,
reicht ein Lauf statt zweier neuer Dateien.

WICHTIG beim Banner: Auf der Store-Seite liegt oben links oft das
App-Symbol darüber, und auf schmalen Geräten wird rechts und links
beschnitten. Deshalb steht der Text mittig und mit reichlich Luft.
"""

import pathlib
from PIL import Image, ImageDraw, ImageFont

VIOLETT_HELL = (139, 92, 246)
VIOLETT_DUNKEL = (91, 33, 182)
GOLD_HELL = (255, 210, 63)
GOLD_DUNKEL = (255, 179, 0)
WEISS = (255, 255, 255)

FETT = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
SCHWARZ = '/System/Library/Fonts/Supplemental/Arial Black.ttf'

ZIEL = pathlib.Path('store/grafiken')
ZIEL.mkdir(parents=True, exist_ok=True)


def verlauf(b, h, von, bis):
    bild = Image.new('RGB', (b, h))
    px = bild.load()
    for y in range(h):
        for x in range(b):
            anteil = (x / (b - 1) * 0.7) + (y / (h - 1) * 0.3)
            px[x, y] = tuple(round(a + (c - a) * anteil) for a, c in zip(von, bis))
    return bild


def mittig(stift, text, schrift, b, y, farbe):
    l, o, r, u = stift.textbbox((0, 0), text, font=schrift)
    stift.text(((b - (r - l)) / 2 - l, y), text, font=schrift, fill=farbe)
    return u - o


def banner():
    B, H = 1024, 500
    bild = verlauf(B, H, VIOLETT_HELL, VIOLETT_DUNKEL)
    stift = ImageDraw.Draw(bild)

    # Das Zeichen als goldene Kachel, wie in der App
    kachel = 128
    k = Image.new('RGB', (kachel, kachel), GOLD_HELL)
    ks = ImageDraw.Draw(k)
    f = ImageFont.truetype(SCHWARZ, 86)
    l, o, r, u = ks.textbbox((0, 0), 'Д', font=f)
    ks.text(((kachel - (r - l)) / 2 - l, (kachel - (u - o)) / 2 - o), 'Д', font=f, fill=(36, 19, 56))
    maske = Image.new('L', (kachel, kachel), 0)
    ImageDraw.Draw(maske).rounded_rectangle([0, 0, kachel - 1, kachel - 1], radius=34, fill=255)
    bild.paste(k, ((B - kachel) // 2, 74), maske)

    mittig(stift, 'Davaigo', ImageFont.truetype(SCHWARZ, 76), B, 228, WEISS)
    mittig(stift, 'Russisch lernen, das hängen bleibt', ImageFont.truetype(FETT, 34), B, 330, (226, 214, 250))
    mittig(stift, '180 Lektionen  ·  echte Stimmen  ·  Videos & Songs',
           ImageFont.truetype(FETT, 25), B, 392, (196, 176, 240))

    bild.save(ZIEL / 'hauptgrafik-1024x500.png', optimize=True)
    print('  hauptgrafik-1024x500.png')


def symbol512():
    # Dasselbe Zeichen wie die App, nur in Store-Größe und ohne
    # runde Ecken: Google rundet selbst.
    import sys
    sys.path.insert(0, 'scripts')
    from icons import symbol
    symbol(512, 0.58).save(ZIEL / 'app-symbol-512.png', optimize=True)
    print('  app-symbol-512.png')


if __name__ == '__main__':
    banner()
    symbol512()
    print('Fertig in store/grafiken/')
