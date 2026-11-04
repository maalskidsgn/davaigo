#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Erzeugt src/lesekurs-daten.js und kopiert die Übungs-Töne.

Quelle ist ~/russisch-lesekurs (Website-Kurs) und dessen Unterordner app/
(englische Fassung). Die Buchstabenformen kommen als fertige Pfade aus den
Schriften Nunito (Druck) und Marck Script (Schreibschrift), damit die
Zeichen-Animation in jedem Browser gleich aussieht.

  python3 scripts/baue-lesekurs.py
"""
import json, os, shutil, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen

HIER = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KURS = os.path.expanduser('~/russisch-lesekurs')
sys.path.insert(0, KURS + '/app')
os.environ['KURS_SPRACHE'] = 'en'
from kurs_en import L as EN
from vertone_app import datei

GROSS = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
ALLE = GROSS + GROSS.lower()


def pfade(font_pfad, hoehe=720):
    f = TTFont(font_pfad)
    gs = f.getGlyphSet()
    cm = f.getBestCmap()
    raus = {}
    for z in ALLE:
        g = gs[cm[ord(z)]]
        bp = BoundsPen(gs)
        g.draw(bp)
        x0, y0, x1, y1 = bp.bounds
        # Einheitlicher Massstab je Schrift, damit klein auch klein bleibt.
        s = hoehe / f['head'].unitsPerEm * 1.15
        dx = 500 - (x0 + x1) / 2 * s
        dy = 500 + (y0 + y1) / 2 * s
        pen = SVGPathPen(gs, ntos=lambda v: str(round(v)))
        g.draw(TransformPen(pen, (s, 0, 0, -s, dx, dy)))
        raus[z] = pen.getCommands()
    return raus


def en_daten(l):
    """Dieselbe Auswahl wie export.py, nur aus der englischen Fassung."""
    zeichen, woerter = [], []
    for s in l['szenen']:
        ru = [b for b in s['beats'] if b[0] == 'ru']
        ton = datei(ru[0]) + '.mp3' if ru else ''
        if s['t'] in ('buchstabe', 'freund'):
            zeichen.append({'g': s['gross'], 'k': s['klein'], 'l': s['laut'], 'w': s['wie'], 't': ton})
        if s['t'] == 'schrift':
            zeichen.append({'g': s['z'], 'k': '', 'l': s['laut'], 'w': s['wie'], 't': ton})
        if s['t'] in ('handwort', 'wort', 'selbst'):
            woerter.append({'ru': s['wort'], 'lat': s['lat'], 'de': s['de'], 't': ton})
        if s['t'] == 'text' and (not s.get('ohne_de') or len(s['zeilen']) == 1):
            for i, (a, b) in enumerate(s['zeilen']):
                t = datei(ru[i]) + '.mp3' if i < len(ru) else ''
                woerter.append({'ru': a, 'lat': '', 'de': b, 't': t})
    return zeichen, woerter


def main():
    de = json.load(open(KURS + '/web/lesekurs.json', encoding='utf-8'))
    ziel_ton = HIER + '/public/audio/lesekurs'
    os.makedirs(ziel_ton, exist_ok=True)
    raus = []
    for d, e in zip(de, EN):
        ez, ew = en_daten(e)
        assert len(d['zeichen']) == len(ez), f"Lektion {d['nr']}: Zeichen"
        assert len(d['woerter']) == len(ew), f"Lektion {d['nr']}: Wörter ({len(d['woerter'])}/{len(ew)})"
        zeichen = []
        for a, b in zip(d['zeichen'], ez):
            assert a['g'] == b['g'] and a['t'] == b['t'], (d['nr'], a['g'])
            zeichen.append({'g': a['g'], 'k': a['k'], 't': a['t'], 'de': {'l': a['l'], 'w': a['w']}, 'en': {'l': b['l'], 'w': b['w']}})
        woerter = []
        for a, b in zip(d['woerter'], ew):
            assert a['ru'] == b['ru'], (d['nr'], a['ru'], b['ru'])
            woerter.append({'ru': a['ru'], 't': a['t'] or b['t'], 'de': {'lat': a['lat'], 'b': a['de']}, 'en': {'lat': b['lat'], 'b': b['de']}})
        for x in zeichen + woerter:
            if x['t']:
                q = KURS + '/web/ton/' + x['t']
                if not os.path.exists(q):
                    q = KURS + '/ton/' + x['t']
                shutil.copy(q, ziel_ton + '/' + x['t'])
        raus.append({
            'nr': d['nr'], 'frei': d['frei'], 'dauer': d['dauer'],
            'de': {'titel': d['titel'], 'kurz': d['kurz']},
            'en': {'titel': e['titel'], 'kurz': e['kurz']},
            'zeichen': zeichen, 'woerter': woerter,
        })
    glyphen = {
        'druck': pfade(KURS + '/marke/nunito-cyr-800.woff2'),
        'schrift': pfade(os.environ.get('MARCK', KURS + '/app/MarckScript-Regular.ttf'), hoehe=820),
    }
    text = ('// ERZEUGT von scripts/baue-lesekurs.py. Nicht von Hand ändern.\n'
            'export const KURS = ' + json.dumps(raus, ensure_ascii=False, separators=(',', ':')) + '\n'
            'export const GLYPHEN = ' + json.dumps(glyphen, ensure_ascii=False, separators=(',', ':')) + '\n')
    open(HIER + '/src/lesekurs-daten.js', 'w', encoding='utf-8').write(text)
    print(len(raus), 'Lektionen,', len(text) // 1024, 'KB,', len(os.listdir(ziel_ton)), 'Töne')


main()
