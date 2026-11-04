/**
 * Der Lesekurs: Kyrillisch in 16 Videos.
 *
 * Der Einstieg für Anfänger, oben im Lernpfad. Lektion 1 ist frei, der
 * Rest gehört zu Premium. Ob ein Video läuft, entscheidet der Server:
 * Die Adressen liegen nicht im Paket und laufen nach drei Stunden ab.
 *
 * In der Store-App steht hier bewusst kein Preis und kein Weg zur
 * Website. Apple und Google werten das als Hinweis, am Store vorbei
 * zu kaufen.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { API_URL, istApp, kiKopf } from './api.js'
import { kaufMoeglich } from './kauf.js'
import { spiele } from './audio.js'
import { XP } from './gamification.js'
import { KURS, GLYPHEN } from './lesekurs-daten.js'
import { sprache, tr } from './sprache.js'

const TON = istApp ? 'https://davaigo.de/audio/lesekurs' : '/audio/lesekurs'
const lektionsId = (nr) => `lesekurs-${nr}`
const minuten = (s) => Math.max(1, Math.round(s / 60))
const poster = (nr) => `/lesekurs/poster-${String(nr).padStart(2, '0')}.jpg`

let laufenderTon = null
function hoere(eintrag, text) {
  laufenderTon?.pause()
  if (!eintrag) return spiele(text)
  laufenderTon = new Audio(`${TON}/${eintrag}`)
  laufenderTon.play().catch(() => spiele(text))
}

const fertigeZahl = (fortschritt) => KURS.filter((l) => fortschritt?.[lektionsId(l.nr)]?.fertig).length

/** Die große Karte oben im Lernpfad. */
export function LesekursKarte({ lessonProgress, onOeffnen }) {
  const fertig = fertigeZahl(lessonProgress)
  const alles = fertig === KURS.length
  const minutenGesamt = minuten(KURS.reduce((s, l) => s + l.dauer, 0))
  return (
    <button className={'lk-karte' + (alles ? ' ist-fertig' : '')} onClick={onOeffnen}>
      <span className="lk-karte-zeichen" aria-hidden="true">
        <svg viewBox="0 0 1000 1000"><path d={GLYPHEN.druck['Д']} pathLength="1" /></svg>
      </span>
      <span className="lk-karte-text">
        <small>{fertig > 0 ? tr('Dein Lesekurs') : tr('Neu in Kyrillisch? Starte hier')}</small>
        <b>{tr('Kyrillisch lesen in 16 Videos')}</b>
        <span>
          {fertig > 0
            ? tr('{0} von {1} Lektionen geschafft', fertig, KURS.length)
            : tr('Von null zum ersten Text, in rund {0} Minuten', minutenGesamt)}
        </span>
        {fertig > 0 && (
          <span className="lk-balken" aria-hidden="true"><i style={{ width: (fertig / KURS.length) * 100 + '%' }} /></span>
        )}
      </span>
      <span className="lk-karte-pfeil" aria-hidden="true">›</span>
    </button>
  )
}

/** Fährt den Buchstaben mit dem Finger nach und prüft, ob alles getroffen ist. */
function Nachspuren({ pfad }) {
  const flaeche = useRef(null)
  const strich = useRef([])
  const [stand, setStand] = useState('leer') // leer | weiter | geschafft

  // Die Punkte, aus denen der Buchstabe besteht, auf einem groben Raster.
  const punkte = useMemo(() => {
    const ctx = document.createElement('canvas').getContext('2d')
    const form = new Path2D(pfad)
    const raus = []
    for (let x = 0; x < 1000; x += 25) {
      for (let y = 0; y < 1000; y += 25) {
        if (ctx.isPointInPath(form, x, y)) raus.push([x, y])
      }
    }
    return raus
  }, [pfad])

  function zeichne() {
    const c = flaeche.current
    if (!c) return
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, 1000, 1000)
    ctx.lineWidth = 46
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#7c3aed'
    for (const linie of strich.current) {
      ctx.beginPath()
      linie.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
      if (linie.length === 1) ctx.lineTo(linie[0][0] + 0.1, linie[0][1])
      ctx.stroke()
    }
  }

  function neu() {
    strich.current = []
    setStand('leer')
    zeichne()
  }
  useEffect(neu, [pfad])

  function ort(e) {
    const r = flaeche.current.getBoundingClientRect()
    return [((e.clientX - r.left) / r.width) * 1000, ((e.clientY - r.top) / r.height) * 1000]
  }
  function runter(e) {
    e.preventDefault()
    flaeche.current.setPointerCapture?.(e.pointerId)
    strich.current.push([ort(e)])
    zeichne()
  }
  function zieh(e) {
    if (!e.buttons && e.pointerType === 'mouse') return
    const linie = strich.current[strich.current.length - 1]
    if (!linie || !flaeche.current.hasPointerCapture?.(e.pointerId)) return
    linie.push(ort(e))
    zeichne()
  }
  function hoch() {
    const alle = strich.current.flat()
    if (!alle.length) return
    const nah = (a, b, r) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 < r * r
    const getroffen = punkte.filter((p) => alle.some((q) => nah(p, q, 70))).length / Math.max(1, punkte.length)
    const daneben = alle.filter((q) => !punkte.some((p) => nah(p, q, 85))).length / alle.length
    setStand(getroffen >= 0.62 && daneben < 0.35 ? 'geschafft' : 'weiter')
  }

  return (
    <div className="lk-spur">
      <div className="lk-spur-feld">
        <svg viewBox="0 0 1000 1000" aria-hidden="true"><path d={pfad} /></svg>
        <canvas
          ref={flaeche}
          width="1000"
          height="1000"
          aria-label={tr('Buchstaben nachspuren')}
          onPointerDown={runter}
          onPointerMove={zieh}
          onPointerUp={hoch}
          onPointerCancel={hoch}
        />
      </div>
      <div className="lk-spur-fuss">
        <span className={stand === 'geschafft' ? 'ist-gut' : ''}>
          {stand === 'leer' && tr('Fahr den Buchstaben mit dem Finger nach.')}
          {stand === 'weiter' && tr('Fahr den ganzen Buchstaben nach.')}
          {stand === 'geschafft' && tr('Geschafft! Sauber geschrieben.')}
        </span>
        <button className="btn-plain" onClick={neu}>{tr('Nochmal')}</button>
      </div>
    </div>
  )
}

/** Ein Buchstabe groß: Umriss zeichnet sich, dann füllt er sich. */
function BuchstabeGross({ zeichen, sp }) {
  const formen = [zeichen.g, zeichen.k].filter(Boolean)
  const [form, setForm] = useState(formen[0])
  const [schrift, setSchrift] = useState('druck')
  const [lauf, setLauf] = useState(0)
  const [spur, setSpur] = useState(false)
  const pfad = GLYPHEN[schrift][form]

  useEffect(() => {
    setForm(formen[0])
    setSpur(false)
    setLauf((n) => n + 1)
  }, [zeichen.g])

  function waehle(f, s) {
    setForm(f)
    setSchrift(s)
    setLauf((n) => n + 1)
  }

  return (
    <div className="lk-gross">
      {spur ? (
        <Nachspuren pfad={pfad} />
      ) : (
        <button
          className="lk-buehne"
          aria-label={tr('Nochmal zeichnen und anhören')}
          onClick={() => { setLauf((n) => n + 1); hoere(zeichen.t, form) }}
        >
          <svg key={lauf + form + schrift} viewBox="0 0 1000 1000" aria-hidden="true">
            <path className="lk-umriss" d={pfad} pathLength="1" />
            <path className="lk-fuellung" d={pfad} />
          </svg>
        </button>
      )}
      <div className="lk-gross-info">
        <b>{zeichen[sp].l}</b>
        <span>{zeichen[sp].w}</span>
      </div>
      <div className="lk-schalter">
        {formen.map((f) => (
          <button key={f} className={form === f ? 'ist-aktiv' : ''} onClick={() => waehle(f, schrift)}>{f}</button>
        ))}
        <button className={schrift === 'druck' ? 'ist-aktiv' : ''} onClick={() => waehle(form, 'druck')}>{tr('Druck')}</button>
        <button className={schrift === 'schrift' ? 'ist-aktiv' : ''} onClick={() => waehle(form, 'schrift')}>{tr('Handschrift')}</button>
        <button className={spur ? 'ist-aktiv' : ''} onClick={() => setSpur((x) => !x)}>{tr('Schreiben')}</button>
      </div>
    </div>
  )
}

function SpielKnopf() {
  return (
    <span className="lk-ton" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" /><path d="M15.5 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />
      </svg>
    </span>
  )
}

function Lektion({ lektion, fertig, onFertig, onWeiter, onZurueck }) {
  const sp = sprache() === 'en' ? 'en' : 'de'
  const [zugang, setZugang] = useState(null)
  const [fehler, setFehler] = useState('')
  const [zeichen, setZeichen] = useState(lektion.zeichen[0] ?? null)
  const versucht = useRef(false)

  async function hole() {
    setFehler('')
    try {
      const r = await fetch(`${API_URL}/api/lesekurs/zugang?nr=${lektion.nr}&sprache=${sp}`, { headers: await kiKopf() })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error)
      setZugang(d)
    } catch (f) {
      setFehler(f.message || tr('Das Video lässt sich gerade nicht laden.'))
    }
  }
  useEffect(() => {
    versucht.current = false
    setZugang(null)
    setZeichen(lektion.zeichen[0] ?? null)
    hole()
    window.scrollTo(0, 0)
  }, [lektion.nr])

  function zurKasse() {
    window.history.pushState({ kasse: true }, '', '/kasse')
    window.dispatchEvent(new PopStateEvent('popstate', { state: { kasse: true } }))
    window.scrollTo(0, 0)
  }

  const gesperrt = zugang?.gesperrt

  return (
    <div className="lk-lektion">
      <button className="btn-zurueck" onClick={onZurueck}>
        <span className="zurueck-pfeil" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg></span>{tr('Alle Lektionen')}
      </button>
      <p className="lk-nummer">{tr('Lektion {0}', lektion.nr)}</p>
      <h1>{lektion[sp].titel}</h1>
      <p className="lk-kurz">{lektion[sp].kurz}</p>

      <div className="lk-video">
        {zugang && !gesperrt && (
          <video
            key={zugang.pfad}
            src={API_URL + zugang.pfad}
            poster={poster(lektion.nr)}
            controls
            playsInline
            preload="metadata"
            controlsList="nodownload"
            onEnded={onFertig}
            onTimeUpdate={(e) => {
              if (!fertig && e.target.duration && e.target.currentTime / e.target.duration > 0.9) onFertig()
            }}
            onError={() => {
              // Abgelaufene Adresse: einmal neu holen, dann erst aufgeben.
              if (!versucht.current) { versucht.current = true; hole() } else setFehler(tr('Das Video lässt sich gerade nicht laden.'))
            }}
          />
        )}
        {(!zugang || gesperrt) && <img src={poster(lektion.nr)} alt="" />}
        {gesperrt && (
          <div className="lk-schloss">
            <b>{tr('Diese Lektion gehört zu Premium')}</b>
            {(!istApp || kaufMoeglich()) && !zugang.anmelden && <button className="btn" onClick={zurKasse}>{tr('Premium ansehen')}</button>}
            {zugang.anmelden && <span>{tr('Bitte melde dich zuerst an.')}</span>}
            {istApp && !kaufMoeglich() && !zugang.anmelden && <span>{tr('Ein bestehendes Premium-Abo wird nach der Anmeldung automatisch erkannt.')}</span>}
          </div>
        )}
      </div>
      {fehler && <p className="error">{fehler}</p>}

      {!gesperrt && lektion.zeichen.length > 0 && (
        <section className="lk-block">
          <h2>{tr('Die Buchstaben')}</h2>
          <div className="lk-chips">
            {lektion.zeichen.map((z) => (
              <button
                key={z.g}
                className={zeichen?.g === z.g ? 'ist-aktiv' : ''}
                onClick={() => { setZeichen(z); hoere(z.t, z.g) }}
              >{z.g}</button>
            ))}
          </div>
          {zeichen && <BuchstabeGross zeichen={zeichen} sp={sp} />}
        </section>
      )}

      {!gesperrt && lektion.woerter.length > 0 && (
        <section className="lk-block">
          <h2>{tr('Antippen und anhören')}</h2>
          <div className="lk-woerter">
            {lektion.woerter.map((w, i) => (
              <button key={i} onClick={() => hoere(w.t, w.ru)}>
                <SpielKnopf />
                <span className="lk-wort">
                  <b>{w.ru}</b>
                  <small>{w[sp].lat ? w[sp].lat + ' · ' : ''}{w[sp].b}</small>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {!gesperrt && zugang && (
        <div className="lk-abschluss">
          {fertig ? (
            onWeiter
              ? <button className="btn" onClick={onWeiter}>{tr('Weiter zur nächsten Lektion')}</button>
              : <p className="lk-glueckwunsch">{tr('Kurs geschafft. Du kannst jetzt Russisch lesen. Молодец!')}</p>
          ) : (
            <button className="btn" onClick={onFertig}>{tr('Lektion abschließen')}</button>
          )}
        </div>
      )}
    </div>
  )
}

export default function Lesekurs({ lessonProgress, addXp, onLessonComplete, onZurueck }) {
  const sp = sprache() === 'en' ? 'en' : 'de'
  const [nr, setNr] = useState(null)
  const offen = KURS.find((l) => l.nr === nr)
  const ist = (n) => Boolean(lessonProgress?.[lektionsId(n)]?.fertig)

  // Die Lernpfad-Seite ist oft schon gescrollt. Die Liste soll oben beginnen.
  useEffect(() => { window.scrollTo(0, 0) }, [nr])

  function schliesseAb(l) {
    if (ist(l.nr)) return
    onLessonComplete({ id: lektionsId(l.nr), titel: l[sp].titel, items: [] })
    addXp(XP.LEKTION)
  }

  if (offen) {
    const naechste = KURS.find((l) => l.nr === offen.nr + 1)
    return (
      <Lektion
        lektion={offen}
        fertig={ist(offen.nr)}
        onFertig={() => schliesseAb(offen)}
        onWeiter={naechste ? () => setNr(naechste.nr) : null}
        onZurueck={() => setNr(null)}
      />
    )
  }

  const fertig = fertigeZahl(lessonProgress)
  const weiter = KURS.find((l) => !ist(l.nr))?.nr

  return (
    <div className="lk-kurs">
      <button className="btn-zurueck" onClick={onZurueck}>
        <span className="zurueck-pfeil" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg></span>{tr('Zurück')}
      </button>
      <h1>{tr('Kyrillisch lesen in 16 Videos')}</h1>
      <p className="lk-kurz">{tr('Vom ersten Buchstaben bis zur ersten Geschichte, gedruckt und von Hand.')}</p>
      <div className="lk-stand">
        <span className="lk-balken" aria-hidden="true"><i style={{ width: (fertig / KURS.length) * 100 + '%' }} /></span>
        <small>{tr('{0} von {1} Lektionen geschafft', fertig, KURS.length)}</small>
      </div>
      <div className="lk-liste">
        {KURS.map((l) => (
          <button key={l.nr} className={'lk-zeile' + (l.nr === weiter ? ' ist-dran' : '')} onClick={() => setNr(l.nr)}>
            <img src={poster(l.nr)} alt="" loading="lazy" />
            <span className="lk-zeile-text">
              <small>{tr('Lektion {0}', l.nr)} · {tr('{0} Min.', minuten(l.dauer))}{l.frei ? ' · ' + tr('Gratis') : ''}</small>
              <b>{l[sp].titel}</b>
            </span>
            <span className={'lk-marke' + (ist(l.nr) ? ' ist-fertig' : '')} aria-hidden="true">
              {ist(l.nr) ? '✓' : l.frei ? '›' : '🔒'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
