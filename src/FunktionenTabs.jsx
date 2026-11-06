import { useEffect, useRef, useState } from 'react'
import { sprache } from './sprache.js'

// "So funktioniert Davaigo": 11 Reiter mit Erklärvideos (HyperFrames, Quelle ~/habloo-social/funktionen,
// SPRACHE=dv für Deutsch, SPRACHE=ru für Englisch). Videos in public/funktionen/de|en/.
const DE = [
  ['videokurs', 'Videokurs', 'Kyrillisch lesen in 16 Videos', ['Jeder Buchstabe mit Aussprache und Eselsbrücke', 'Gleich danach die ersten echten Wörter lesen', 'Lektion 1 ist gratis']],
  ['lektionen', 'Lektionen', 'Schritt für Schritt', ['Dein Lernweg als Reiseroute – Etappe für Etappe', 'Neue Wörter mit Aussprache, kleine Dialoge und Übungen', 'Ist eine Etappe geschafft, geht die nächste auf']],
  ['vokabeltrainer', 'Vokabeltrainer', 'Wörter, die bleiben', ['Karteikarten mit Wort, Übersetzung und Aussprache', 'Du bewertest selbst: Nochmal, Schwer, Gut oder Einfach', 'Jedes Wort kommt nach 1, 3, 7, 14, 30 und 90 Tagen wieder']],
  ['spiele', 'Spiele', 'Lernen wie beim Spielen', ['Memory, Wortpaare, Wortsuche, Blitzrunde und mehr', 'Immer mit den Wörtern, die du gerade lernst', 'Jede richtige Antwort bringt XP']],
  ['duell', 'Duell & Freunde', 'Lernen mit Freunden', ['Am grünen Punkt siehst du, wer online ist', 'Duell mit sieben gleichen Fragen für beide', 'Wer mehr richtig hat, gewinnt']],
  ['saetze', 'Sätze', 'Ganze Sätze statt einzelner Wörter', ['Thema wählen, zum Beispiel Reisen oder Restaurant', 'Davaigo erstellt passende Sätze für dich', 'Die besten landen mit einem Tipp im Karteikasten']],
  ['texte', 'Texte', 'Lesen und Hören', ['Jeden Tag kurze Texte über Land und Leute', 'Sprache wechseln oder vorlesen lassen', 'Unbekannte Wörter direkt in den Vokabeltrainer']],
  ['videos', 'Videos', 'Lernen mit echten Videos', ['Musik, Kochen, Reisen – ganz wie du magst', 'Die Untertitel laufen mit, die aktuelle Zeile leuchtet', 'Wort antippen – und es ist im Vokabeltrainer']],
  ['tutor', 'KI-Tutor', 'Russisch sprechen mit KI', ['Aufs Mikrofon tippen und einfach Russisch sprechen', 'Antwort mit echter Stimme – wie ein Telefonat', 'Mitschrift mit Übersetzung, merkt sich deine schweren Wörter']],
  ['rangliste', 'Rangliste', 'Ein kleiner Wettbewerb', ['Für jedes richtige Wort gibt es XP', 'Mit jedem Punkt kletterst du nach oben', 'Eigener Benutzername – darüber finden dich Freunde']],
  ['statistik', 'Statistik', 'Sieh, was du geschafft hast', ['Der Kalender zeigt deine Lerntage', 'XP sammeln und Level für Level aufsteigen', 'Deine Tagesserie zeigt, wie lange du dranbleibst']],
]
const EN = [
  ['videokurs', 'Video course', 'Read Cyrillic in 16 videos', ['Every letter with its sound and a memory trick', 'Read your first real words right away', 'Lesson 1 is free']],
  ['lektionen', 'Lessons', 'Step by step', ['Your learning path is a travel route – stage by stage', 'New words with audio, short dialogues and exercises', 'Finish a stage and the next one opens up']],
  ['vokabeltrainer', 'Vocabulary trainer', 'Words that stick', ['Flashcards with word, translation and pronunciation', 'You rate yourself: Again, Hard, Good or Easy', 'Every word returns after 1, 3, 7, 14, 30 and 90 days']],
  ['spiele', 'Games', 'Learning that feels like play', ['Memory, word pairs, word search, speed round and more', 'Always with the words you are learning right now', 'Every right answer earns XP']],
  ['duell', 'Duels & friends', 'Learning with friends', ['A green dot shows who is online', 'Duels with the same seven questions for both players', 'Most right answers wins']],
  ['saetze', 'Sentences', 'Whole sentences, not single words', ['Pick a topic like travel or restaurant', 'Davaigo creates matching sentences for you', 'Save the best ones with one tap']],
  ['texte', 'Texts', 'Reading and listening', ['Short daily texts about Russian culture', 'Switch languages or have the text read aloud', 'New words go straight into your trainer']],
  ['videos', 'Videos', 'Learn with real videos', ['Music, cooking, travel – whatever you like', 'Subtitles follow along, the current line lights up', 'Tap a word and it lands in your trainer']],
  ['tutor', 'AI tutor', 'Speak Russian with AI', ['Tap the microphone and just speak Russian', 'Answers with a real voice – like a phone call', 'Transcript with translation, remembers your tricky words']],
  ['rangliste', 'Leaderboard', 'A little competition', ['Every right word earns XP', 'With every point you climb higher', 'Your own username – that’s how friends find you']],
  ['statistik', 'Stats', 'See what you’ve achieved', ['The calendar shows your study days', 'Collect XP and level up', 'Your streak shows how long you’ve kept going']],
]

export default function FunktionenTabs() {
  const en = sprache() === 'en'
  const R = en ? EN : DE
  const [akt, setAkt] = useState(R[0][0])
  const [ton, setTon] = useState(false)
  const v = useRef(null)
  const r = R.find((x) => x[0] === akt) || R[0]
  const ordner = `/funktionen/${en ? 'en' : 'de'}/`

  useEffect(() => {
    const el = v.current
    if (!el) return
    el.muted = !ton
    el.currentTime = 0
    el.play().catch(() => {})
  }, [akt, ton, en])

  return (
    <section className="ft-sektion lp-zeig">
      <span className="ft-label">{en ? 'How Davaigo works' : 'So funktioniert Davaigo'}</span>
      <h2>{en ? 'Everything you need to learn Russian' : 'Alles, was du zum Russischlernen brauchst'}</h2>
      <p className="ft-unter">{en ? 'Tap an area – the video shows you how it works.' : 'Tippe auf einen Bereich – das Video zeigt, wie es funktioniert.'}</p>
      <div className="ft-tabs" role="tablist">
        {R.map(([k, n]) => (
          <button key={k} role="tab" aria-selected={k === r[0]} className={'ft-tab' + (k === r[0] ? ' an' : '')}
            onClick={() => { setAkt(k); setTon(false) }}>{n}</button>
        ))}
      </div>
      <div className="ft-buehne">
        <div className="ft-video">
          <video ref={v} key={ordner + r[0] + ton} src={`${ordner}${r[0]}${ton ? '-ton' : ''}.mp4`} poster={`${ordner}${r[0]}.jpg`}
            autoPlay muted={!ton} loop={!ton} playsInline preload="metadata" />
          <button className="ft-ton" onClick={() => setTon(!ton)}>
            {ton ? (en ? '🔇 Mute' : '🔇 Ohne Ton') : (en ? '🔊 With narration' : '🔊 Mit Erklärung')}
          </button>
        </div>
        <div className="ft-text">
          <h3>{r[2]}</h3>
          <ul>{r[3].map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      </div>
    </section>
  )
}
