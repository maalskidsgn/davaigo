import { useState } from 'react'
import { tr } from './sprache.js'

// Ein Fragezeichen, das den Bereich erklärt, in dem es steht.
//
// Warum an Ort und Stelle statt in einer Hilfe: Die Frage "warum
// kommt genau dieses Wort jetzt?" stellt sich beim Üben. Die Frage
// "was holt ihr euch da eigentlich von Spotify?" stellt sich vor dem
// Verbinden. Beide Antworten gehören dorthin, wo die Frage entsteht.
//
// Und warum alle Texte in EINER Datei: Vokabeln und Grammatik laufen
// durch denselben Karteikasten. Stünde die Erklärung zweimal da,
// würde eine davon irgendwann etwas anderes behaupten.

const TEXTE = {
  woerter: {
    titel: tr('Wie der Vokabeltrainer arbeitet'),
    absaetze: [
      [
        tr('Woher die Wörter kommen: '),
        tr('Jedes Wort aus einer Lektion landet hier. Dazu alles, was du beim Video-Schauen oder in einem Ebook antippst.'),
      ],
      [
        tr('Warum gerade jetzt: '),
        tr('Der Trainer merkt sich, wann du ein Wort zuletzt konntest, und legt es dir vor, bevor du es vergisst – nach einem Tag, nach dreien, nach einer Woche, nach einem Monat. Wie du eine Karte bewertest, entscheidet über den nächsten Termin: „Nochmal" holt sie in 15 Minuten zurück, „Einfach" schiebt sie weit nach hinten.'),
      ],
      [
        tr('Was die KI dabei tut: '),
        tr('Der Listengenerator stellt dir zu jedem Thema zwölf Wörter zusammen – ohne die, die du längst hast. Mit KI-Gen wählt sie das Thema selbst, passend zu dem, was du schon gesammelt hast.'),
      ],
    ],
  },
  spotify: {
    titel: tr('Was passiert beim Verbinden?'),
    absaetze: [
      [
        tr('Wozu das gut ist: '),
        tr('Aus deiner Spotify-Bibliothek suchen wir die russischsprachigen Künstler heraus. Du bekommst dann Songs zum Mitlesen, die du ohnehin hörst – das ist der Unterschied zwischen Lernstoff und Musik.'),
      ],
      [
        tr('Was wir lesen: '),
        tr('Deine gespeicherten Titel, deine Playlists und deine meistgehörten Künstler und Songs. Mehr fragt die App nicht an.'),
      ],
      [
        tr('Was wir NICHT tun: '),
        tr('Nichts abspielen, nichts ändern, niemandem folgen, nichts posten. Die Rechte, die angefordert werden, erlauben ausschließlich Lesen – abspielen oder speichern könnte die App gar nicht.'),
      ],
      [
        tr('Wieder lösen: '),
        tr('Ein Knopf hier trennt die Verbindung. Zusätzlich kannst du den Zugang jederzeit in deinem Spotify-Konto unter „Apps" entziehen.'),
      ],
    ],
  },
  grammatik: {
    titel: tr('Wie die Bausteine arbeiten'),
    absaetze: [
      [
        tr('Was ein Baustein ist: '),
        tr('Eine Regel mit fünf Aufgaben – „Das schwache o", „Ohne der, die, das", „из und в". Acht Stück, jede erklärt von der Lektion, aus der sie stammt.'),
      ],
      [
        tr('Derselbe Karteikasten: '),
        tr('Bausteine laufen durch dieselbe Rechnung wie die Vokabeln. Fünf von fünf richtig, und die Regel kommt lange nicht wieder; unter drei, und sie ist gleich wieder dran. Jeden Tag steht eine andere oben – die, die am längsten überfällig ist.'),
      ],
      [
        tr('Warum von Hand geschrieben: '),
        tr('Die vierzig Aufgaben sind alle selbst gesetzt, nicht erzeugt. Bei einer Grammatikregel ist eine Aufgabe entweder richtig oder wertlos – und ob „в" oder „на" stimmt, entscheidet sich an Feinheiten, bei denen eine KI gern danebengreift.'),
      ],
    ],
  },
}

export default function InfoKnopf({ thema }) {
  const [offen, setOffen] = useState(false)
  const inhalt = TEXTE[thema] ?? TEXTE.woerter

  return (
    <>
      <button
        className="wieder-info"
        onClick={() => setOffen(!offen)}
        aria-expanded={offen}
        title={inhalt.titel}
      >
        {offen ? '×' : '?'}
      </button>

      {offen && (
        <div className="wieder-erklaerung">
          <h3>{inhalt.titel}</h3>
          {inhalt.absaetze.map(([kopf, text]) => (
            <p key={kopf}>
              <b>{kopf}</b>
              {text}
            </p>
          ))}
        </div>
      )}
    </>
  )
}
