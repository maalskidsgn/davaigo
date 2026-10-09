// Die Ratgebertexte von davaigo.de.
//
// Hier steht nur der Inhalt, kein HTML. Das Aussehen macht
// scripts/baue-ratgeber.mjs – so lässt sich ein Text ändern, ohne
// an Markup vorbeizuschreiben, und ein neues Aussehen gilt sofort
// für alle Seiten.
//
// Ein Beitrag besteht aus:
//   slug          Teil der Adresse, /ratgeber/<slug>/
//   seitentitel   steht im Browser-Tab und bei Google (unter 60 Zeichen)
//   titel         die Überschrift auf der Seite
//   beschreibung  der Text unter dem Google-Treffer (unter 160 Zeichen)
//   anreisser     der erste fette Satz über dem Artikel
//   abschnitte    [{ h2, inhalt: [...] }]
//   faq           Fragen und Antworten, auch als strukturierte Daten
//
// Ein Baustein in `inhalt` ist entweder ein String (Absatz) oder
// { liste }, { nummern }, { h3 }, { zitat }, { kasten, titel } oder
// { kopf, tabelle }.
//
// Im Text funktionieren **fett**, *kursiv* und [Text](Adresse).

export const SEITE = {
  basis: 'https://davaigo.de',
}

export const BEITRAEGE = [
  // ============================================================
  {
    slug: 'russisch-lernen-app',
    emoji: '📱',
    datum: '2026-10-09',
    lesezeit: 7,
    seitentitel: 'Russisch lernen App: Woran du eine gute erkennst',
    titel: 'Russisch lernen mit einer App – woran du eine gute erkennst',
    beschreibung:
      'Nicht jede Lern-App taugt für Russisch. Sechs Dinge, die eine App können muss, damit du nach drei Monaten wirklich etwas sagen kannst.',
    anreisser:
      'Russisch ist keine Sprache, die man nebenbei aufschnappt. Eine App kann dir trotzdem sehr weit helfen – wenn sie die richtigen Dinge tut.',
    abschnitte: [
      {
        h2: 'Warum Russisch andere Anforderungen stellt als Spanisch',
        inhalt: [
          'Wer Spanisch lernt, kann am ersten Tag lesen. Die Buchstaben kennt er schon, viele Wörter erkennt er wieder, und *hotel* heißt *hotel*. Bei Russisch ist das anders: Vor dem ersten Wort steht ein fremdes Alphabet mit 33 Buchstaben, von denen sechs aussehen wie lateinische und etwas völlig anderes bedeuten. Das **В** ist ein W, das **Р** ein R, das **С** ein S.',
          'Danach kommen sechs Fälle, bei denen sich nicht nur der Artikel ändert, sondern das Wort selbst. Dann der Verbaspekt, für den es im Deutschen keine Entsprechung gibt. Und die Bewegungsverben, bei denen „gehen" je nach Richtung und Gewohnheit ein anderes Wort ist.',
          'Das klingt abschreckend, ist es aber nicht – vorausgesetzt, diese Dinge kommen in der richtigen Reihenfolge und mit genug Wiederholung. Genau daran scheitern die meisten Apps: Sie sind für Sprachen gebaut, bei denen man sofort loslegen kann, und reichen diesen Aufbau an Russisch durch.',
          {
            kasten: [
              'Ein einfacher Test für jede App: Wie lange dauert es, bis du das kyrillische Alphabet wirklich lesen kannst – nicht erkennst, sondern liest? Wenn eine App dir in Lektion drei schon ganze Sätze vorsetzt, die du nur über die Umschrift entziffern kannst, lernst du die Umschrift, nicht die Sprache.',
            ],
            titel: 'Der Alphabet-Test',
          },
        ],
      },
      {
        h2: 'Sechs Dinge, die eine Russisch-App können muss',
        inhalt: [
          { h3: '1. Das Alphabet systematisch beibringen' },
          'Nicht als Tabelle zum Auswendiglernen, sondern über Wochen verteilt, Buchstabe für Buchstabe, immer mit echten Wörtern. Die falschen Freunde gehören dabei getrennt behandelt: Wer **Р** einmal als P gelesen hat, liest es Monate später wieder falsch.',
          { h3: '2. Echte Stimmen statt Computerstimme' },
          'Russisch hat eine Eigenheit, die auf dem Papier unsichtbar ist: Jedes Wort hat genau eine betonte Silbe, und nur dort klingt ein **о** wie o. Überall sonst wird es zum a. *молоко* schreibt sich mit drei o und spricht sich „malakó". Eine synthetische Stimme bekommt das oft hin, aber den Rhythmus eines echten Satzes nicht. Wer von Anfang an Muttersprachler hört, nimmt die Melodie nebenbei mit.',
          { h3: '3. Einen Vokabeltrainer mit Gedächtnis' },
          'Wörter, die du sicher kannst, sollen seltener kommen. Wörter, bei denen du gezögert hast, öfter. Das klingt banal, ist aber der Unterschied zwischen zwanzig Minuten Lernen und zwanzig Minuten Beschäftigung. Mehr dazu im Beitrag über das [Vokabellernen mit wachsenden Abständen](/ratgeber/russische-vokabeln-lernen/).',
          { h3: '4. Grammatik erklären, nicht nur abfragen' },
          'Bei den sechs Fällen reicht es nicht, Endungen zu üben. Du musst verstehen, *wofür* ein Fall da ist – dass der Instrumental sagt „womit" und gleichzeitig „als was" (*работаю инженером*, ich arbeite als Ingenieur). Wer das Prinzip hat, braucht die Tabelle nicht mehr.',
          { h3: '5. Echtes Material, nicht nur Lehrbuchsätze' },
          'Irgendwann sind die Lektionssätze zu brav. Dann brauchst du Material, das nicht für Lernende gemacht wurde: Videos, Lieder, Nachrichten. Eine App, die dort weiterführt, trägt dich über den Punkt hinaus, an dem die meisten aufhören.',
          { h3: '6. Dich am Ball halten, ohne zu nerven' },
          'Eine Serie, ein Tagesziel, ein sichtbarer Fortschritt – das hilft. Aber nur, solange es dir dient. Wenn du nach drei Wochen nur noch übst, um eine Zahl nicht zu verlieren, arbeitet die App gegen dich.',
        ],
      },
      {
        h2: 'Woran du eine schwache App erkennst',
        inhalt: [
          {
            liste: [
              '**Umschrift statt Kyrillisch.** Wenn *spassiba* dasteht statt *спасибо*, sparst du dir zwei Wochen und zahlst sie später doppelt.',
              '**Nur Übersetzungsaufgaben.** Wer immer nur zwischen zwei Sprachen hin- und herschaltet, denkt am Ende in Übersetzungen und nicht in der Sprache.',
              '**Kein Hören.** Russisch, das man nur gelesen hat, versteht man nicht, wenn es jemand sagt – siehe das verschluckte *здравствуйте*, das wie „sdrasste" klingt.',
              '**Alles gleich wichtig.** Eine gute Reihenfolge ist das halbe Lernen. Wer in Lektion fünf den Konjunktiv bekommt, aber in Lektion fünfzig noch keine Uhrzeit, lernt nach Zufall.',
              '**Keine Wiederholung aus früheren Lektionen.** Was nicht wiederkommt, ist in drei Wochen weg.',
            ],
          },
        ],
      },
      {
        h2: 'Was eine App nicht ersetzen kann',
        inhalt: [
          'Ehrlich bleiben gehört dazu: Keine App bringt dir bei, ein Gespräch zu führen, in dem dein Gegenüber ungeduldig wird, dich unterbricht oder etwas sagt, das du nicht erwartet hast. Sprechen lernt man beim Sprechen.',
          'Was eine App sehr gut kann, ist alles davor – und das ist der größere Teil: Wortschatz aufbauen, das Ohr trainieren, Strukturen verstehen, täglich dranbleiben. Wer mit 1.500 Wörtern und einem Gefühl für den Satzbau in sein erstes echtes Gespräch geht, hat es ungleich leichter als jemand, der bei null anfängt.',
          'Der sinnvolle Weg ist deshalb: App als Grundlage und als tägliche Gewohnheit, und sobald es geht, echte Gespräche dazu – ein Sprachpartner, ein Tandem, ein Kurs.',
        ],
      },
      {
        h2: 'Wie Davaigo das löst',
        inhalt: [
          'Davaigo ist genau an diesen Punkten entlang gebaut worden. Der Kurs umfasst **180 Lektionen in zehn Modulen**, vom ersten Buchstaben bis zur Schwelle zu B2. Die ersten 18 Lektionen drehen sich nur um das Lesen des kyrillischen Alphabets – mit echten Wörtern von der ersten Minute an, nie mit Umschrift.',
          'Gesprochen wird alles von russischen Muttersprachlern: **4.178 Aufnahmen**, jedes Wort, jeder Beispielsatz, jede Dialogzeile. Der Vokabeltrainer rechnet für jedes Wort einen eigenen Abstand aus, statt stur eine Liste durchzugehen. Und in der Mediathek holst du dir echte YouTube-Videos mit mitlaufenden Untertiteln, bei denen du jedes unbekannte Wort antippen und in deinen Trainer übernehmen kannst.',
          'Der Einstieg kostet nichts, und du brauchst für die ersten Lektionen kein Konto.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Kann man Russisch wirklich nur mit einer App lernen?',
        antwort:
          'Bis zu einem soliden Mittelstufenniveau beim Lesen, Hören und Verstehen: ja. Für flüssiges Sprechen brauchst du zusätzlich echte Gespräche – eine App baut aber genau das Fundament auf, das solche Gespräche überhaupt erst möglich macht.',
      },
      {
        frage: 'Wie lange dauert es, bis ich das kyrillische Alphabet lesen kann?',
        antwort:
          'Erkennen kannst du alle 33 Buchstaben nach ein bis zwei Wochen. Flüssig lesen, ohne jeden Buchstaben einzeln zu entziffern, dauert eher vier bis sechs Wochen täglicher Übung – und genau deshalb sollte eine App sich dafür Zeit nehmen.',
      },
      {
        frage: 'Reichen zehn Minuten am Tag?',
        antwort:
          'Für stetigen Fortschritt ja, wenn sie wirklich täglich stattfinden. Zehn Minuten an sieben Tagen bringen mehr als eine Stunde am Sonntag, weil Wiederholung in kurzen Abständen der entscheidende Faktor ist.',
      },
      {
        frage: 'Brauche ich Vorkenntnisse?',
        antwort:
          'Nein. Ein guter Kurs fängt beim Alphabet an und setzt nichts voraus – auch keine Erfahrung mit anderen Fremdsprachen.',
      },
    ],
  },

  // ============================================================
  {
    slug: 'russisch-kostenlos-lernen',
    emoji: '🆓',
    datum: '2026-10-09',
    lesezeit: 6,
    seitentitel: 'Russisch kostenlos lernen – was wirklich geht',
    titel: 'Russisch kostenlos lernen – was wirklich geht und wo die Grenzen liegen',
    beschreibung:
      'Kostenlos Russisch lernen funktioniert besser, als viele denken – aber nicht mit jedem Material. Was taugt, was Zeit frisst und woran gute Angebote verdienen.',
    anreisser:
      'Man kann Russisch ohne einen Cent lernen. Die Frage ist nicht, ob es geht, sondern wie viel Zeit man dabei verliert.',
    abschnitte: [
      {
        h2: 'Das eigentliche Problem ist nicht das Geld',
        inhalt: [
          'Kostenloses Material gibt es im Überfluss: Videos, Wortlisten, Foren, Arbeitsblätter, ganze Lehrbücher als PDF. Wer damit scheitert, scheitert selten an fehlenden Inhalten. Er scheitert an der Reihenfolge.',
          'Ein Kurs ist mehr als eine Sammlung von Lektionen. Er entscheidet, was wann kommt, was wiederholt wird und was man noch weglässt. Wer sich seinen Weg selbst zusammensucht, macht genau diese Arbeit nebenbei mit – in einer Sprache, die er noch nicht kann. Das ist der teure Teil, und er wird in Stunden bezahlt, nicht in Euro.',
          {
            kasten: [
              'Rechne einmal ehrlich: Wenn du pro Woche zwei Stunden damit zubringst, das nächste Material zu suchen und zu sortieren, sind das im Jahr rund hundert Stunden. In hundert Stunden strukturiertem Lernen kommt man bei Russisch sehr weit.',
            ],
            titel: 'Die versteckte Rechnung',
          },
        ],
      },
      {
        h2: 'Was kostenlos wirklich gut funktioniert',
        inhalt: [
          { h3: 'Das Alphabet' },
          'Hier ist kostenloses Material völlig ausreichend. Die 33 Buchstaben ändern sich nicht, und es gibt gute Erklärvideos dazu. Wichtig ist nur, dass du dabei von Anfang an echte Wörter liest und nicht bei der Umschrift hängen bleibst.',
          { h3: 'Hören' },
          'YouTube ist für Russisch eine Goldgrube: Nachrichten in einfachem Russisch, Vlogs, Podcasts, Lieder mit eingeblendetem Text. Nichts davon kostet etwas, und nichts ersetzt es. Wie du Videos vom Berieseln zum Lernen bringst, steht im Beitrag über das [Lernen mit YouTube-Videos](/ratgeber/russisch-lernen-mit-videos/).',
          { h3: 'Vokabeln' },
          'Ein Karteikasten muss nichts kosten. Entscheidend ist nicht das Werkzeug, sondern dass die Abstände zwischen den Wiederholungen wachsen. Selbst Papierkarten in fünf Schachteln funktionieren, wenn man das Prinzip einhält.',
          { h3: 'Lesen' },
          'Russische Kindergeschichten, vereinfachte Nachrichten und zweisprachige Texte gibt es frei. Ab A2 ist das der schnellste Weg, Wortschatz aufzubauen.',
        ],
      },
      {
        h2: 'Wo kostenlos teuer wird',
        inhalt: [
          {
            liste: [
              '**Aussprache.** Niemand korrigiert dich. Fehler, die man sich am Anfang angewöhnt, bleiben jahrelang – besonders bei der Betonung, die im Russischen die Bedeutung ändern kann.',
              '**Grammatik in der richtigen Reihenfolge.** Die sechs Fälle auf einmal zu lernen ist der klassische Abbruchgrund. Ein Kurs verteilt sie über Monate und führt sie einzeln ein.',
              '**Wiederholung.** Das ist die unspektakulärste und wichtigste Funktion überhaupt – und die, die beim Selbstzusammenstellen am ehesten wegfällt.',
              '**Dranbleiben.** Ohne sichtbaren Fortschritt hört man auf. Nicht aus Faulheit, sondern weil man nicht merkt, dass man besser wird.',
            ],
          },
        ],
      },
      {
        h2: 'Woran kostenlose Angebote verdienen – und warum das wichtig ist',
        inhalt: [
          'Niemand baut jahrelang an einem Kurs, ohne irgendwann Geld zu sehen. Es lohnt sich zu wissen, wie: Manche Angebote finanzieren sich über Werbung, manche verkaufen deine Daten, manche sind eine Vorstufe zu einem teuren Abo, und manche verlangen für den kostenlosen Teil nichts und bieten daneben etwas an, das wirklich Geld kostet in der Herstellung.',
          'Das ist keine moralische Frage, sondern eine praktische: Ein werbefinanziertes Angebot wird dich möglichst lange beschäftigen wollen. Ein Angebot, das von zufriedenen Nutzern lebt, will dich möglichst schnell weiterbringen. Die Anreize sind entgegengesetzt, und man merkt es am Produkt.',
        ],
      },
      {
        h2: 'Ein kostenloser Weg, der funktioniert',
        inhalt: [
          {
            nummern: [
              '**Woche 1–4: Alphabet.** Jeden Tag fünfzehn Minuten, immer mit echten Wörtern. Am Ende liest du *метро*, *борщ* und *яблоко*, ohne nachzudenken.',
              '**Ab Woche 2: Karteikasten anlegen.** Jeden Tag fünf neue Wörter, und – wichtiger – jeden Tag die fälligen wiederholen.',
              '**Ab Woche 4: täglich hören.** Zehn Minuten, auch wenn du fast nichts verstehst. Das Ohr braucht Zeit, und diese Zeit läuft nebenbei.',
              '**Ab Monat 2: einen festen Kursweg wählen** und ihn durchziehen, statt zwischen Quellen zu springen. Welcher, ist weniger wichtig als dass du dabei bleibst.',
              '**Ab Monat 4: lesen.** Vereinfachte Texte, dann echte. Jedes unbekannte Wort in den Karteikasten.',
              '**Ab Monat 6: sprechen.** Tandem, Sprachpartner, Gesprächsgruppe. Ab hier gibt es keinen Ersatz mehr.',
            ],
          },
        ],
      },
      {
        h2: 'Was Davaigo kostenlos bietet',
        inhalt: [
          'Alle 180 Lektionen sind kostenlos nutzbar, mit echten Aufnahmen von Muttersprachlern und dem vollen Vokabeltrainer. Auch die Mediathek mit Videos und Liedern ist offen. Es gibt keine Werbung und keinen Weiterverkauf von Daten – das steht auch so in der [Datenschutzerklärung](/?recht=datenschutz).',
          'Geld kostet nur Premium, und zwar für die Dinge, die bei uns echte Rechenkosten verursachen: unbegrenzte KI-Vokabellisten zu eigenen Themen und selbst erzeugte zweisprachige E-Books. Wer das nicht braucht, lernt kostenlos weiter.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Kann man Russisch komplett kostenlos lernen?',
        antwort:
          'Ja, bis zu einem guten Mittelstufenniveau. Du zahlst dann aber mit Zeit: für das Suchen, Sortieren und Beurteilen von Material. Ein strukturierter Kurs nimmt dir genau diese Arbeit ab.',
      },
      {
        frage: 'Was sollte ich auf keinen Fall kostenlos machen?',
        antwort:
          'Ungeprüft Aussprache üben. Wer sich falsche Betonungen angewöhnt, bekommt sie schwer wieder weg – hier helfen Aufnahmen von Muttersprachlern mehr als jede Erklärung.',
      },
      {
        frage: 'Wie viel Zeit brauche ich pro Tag?',
        antwort:
          'Fünfzehn bis zwanzig Minuten täglich reichen für stetigen Fortschritt. Entscheidend ist die Regelmäßigkeit, nicht die Dauer der einzelnen Sitzung.',
      },
    ],
  },

  // ============================================================
  {
    slug: 'russische-vokabeln-lernen',
    emoji: '🧠',
    datum: '2026-10-09',
    lesezeit: 7,
    seitentitel: 'Russische Vokabeln lernen, die auch hängen bleiben',
    titel: 'Russische Vokabeln lernen – warum dein Gedächtnis Abstände braucht',
    beschreibung:
      'Warum Vokabellisten nicht funktionieren, wie wachsende Wiederholungsabstände das ändern und wie du russische Wörter lernst, die nach Monaten noch da sind.',
    anreisser:
      'Die meisten lernen Vokabeln genau falsch herum: viel auf einmal, kurz vor knapp, und dann nie wieder. Dabei ist seit über hundert Jahren bekannt, wie es besser geht.',
    abschnitte: [
      {
        h2: 'Das Problem heißt Vergessenskurve',
        inhalt: [
          'Der Psychologe Hermann Ebbinghaus hat Ende des 19. Jahrhunderts an sich selbst untersucht, wie schnell man Gelerntes verliert. Das Ergebnis ist unangenehm deutlich: Ein frisch gelerntes Wort ist nach einem Tag zu großen Teilen weg, nach einer Woche fast vollständig – **wenn es dazwischen nicht wieder auftaucht**.',
          'Das Entscheidende ist der zweite Teil des Befunds: Jede Wiederholung macht die Kurve flacher. Nach der ersten hält das Wort einen Tag, nach der zweiten drei, nach der dritten eine Woche, dann einen Monat. Der Abstand darf also nicht gleich bleiben – er muss wachsen.',
          {
            zitat:
              'Nicht die Menge der Wiederholungen entscheidet, sondern wann sie stattfinden: kurz bevor du das Wort vergessen hättest.',
          },
        ],
      },
      {
        h2: 'Warum Listen und Apps mit festem Takt scheitern',
        inhalt: [
          'Eine Vokabelliste behandelt alle Wörter gleich. *Кофе* (Kaffee), das du nach zwei Tagen sitzen hast, kommt genauso oft wie *осуществлять* (verwirklichen), über das du jedes Mal stolperst. Die Hälfte deiner Zeit geht für Wörter drauf, die du längst kannst.',
          'Dasselbe gilt für Apps, die stur in Zehnerblöcken abfragen. Sie fühlen sich produktiv an – du hast schließlich etwas getan –, aber der Lerneffekt steckt in den Wörtern, bei denen du zögerst, und die kommen zu selten.',
          'Ein Karteikasten mit wachsenden Abständen dreht das um: Jedes Wort hat seinen eigenen Takt. Was sitzt, verschwindet für Wochen aus dem Stapel. Was wackelt, kommt morgen wieder.',
        ],
      },
      {
        h2: 'So sieht das in Zahlen aus',
        inhalt: [
          'Ein Wort, das du jedes Mal mit „gut" bewertest, wandert ungefähr so durch den Kasten:',
          {
            kopf: ['Wiederholung', 'nächster Abstand'],
            tabelle: [
              ['1.', '1 Tag'],
              ['2.', '2,5 Tage'],
              ['3.', '6 Tage'],
              ['4.', '16 Tage'],
              ['5.', '40 Tage'],
              ['6.', '99 Tage'],
              ['7.', 'rund 8 Monate'],
            ],
          },
          'Nach sieben kurzen Begegnungen – zusammen vielleicht zwei Minuten – ist ein Wort für Monate gesichert. Deshalb schafft man mit zwanzig Minuten am Tag einen Wortschatz, der mit stumpfem Pauken Stunden kosten würde.',
          'Bewertest du ein Wort mit „schwer", wird der Abstand nicht zurückgesetzt, sondern nur langsamer vergrößert. Und bei „nochmal" kommt es in derselben Sitzung wieder.',
        ],
      },
      {
        h2: 'Fünf Regeln speziell fürs Russische',
        inhalt: [
          { h3: 'Betonung von Anfang an mitlernen' },
          'Ein russisches Wort ohne Betonung ist halb gelernt. *Замо́к* ist das Schloss zum Zusperren, *за́мок* das Schloss, in dem ein Graf wohnt – gleiche Buchstaben, andere Bedeutung. Lern das Wort immer so, wie du es gehört hast.',
          { h3: 'Nie einzeln, immer im Satz' },
          'Ein Wort allein ist eine Vokabel, ein Wort im Satz ist Sprache. Gerade im Russischen, wo jedes Substantiv sechs Fälle hat, nützt dir die Grundform wenig, wenn du nie gesehen hast, wie sie sich verändert.',
          { h3: 'Verb und Fall zusammen lernen' },
          'Lern nie nur *помогать*, sondern *помогать кому* – helfen plus Dativ. Nicht *гордиться*, sondern *гордиться кем* – stolz sein plus Instrumental. Das Fragewort gehört zum Verb wie im Deutschen der Artikel zum Substantiv.',
          { h3: 'Aspektpaare gemeinsam aufnehmen' },
          'Russische Verben kommen fast immer zu zweit: *делать* und *сделать*, *читать* und *прочитать*. Wer nur eine Hälfte lernt, kann den Satz später nicht bilden.',
          { h3: 'Wortfamilien nutzen' },
          'Aus *писать* (schreiben) werden mit Vorsilben *записать* (aufschreiben), *подписать* (unterschreiben), *переписать* (neu schreiben), *выписать* (ausstellen). Wer das Prinzip versteht, lernt zehn Wörter statt einem.',
        ],
      },
      {
        h2: 'Wie viele Wörter brauche ich eigentlich?',
        inhalt: [
          'Grobe, aber brauchbare Orientierung:',
          {
            kopf: ['Wortschatz', 'was damit geht'],
            tabelle: [
              ['300–600', 'Einkaufen, bestellen, sich vorstellen, nach dem Weg fragen'],
              ['1.000–1.500', 'Alltagsgespräche führen, einfache Texte lesen'],
              ['3.000', 'Zeitungsartikel verstehen, Filmen folgen, über Abstraktes reden'],
              ['5.000+', 'Fast alles verstehen, auch Literatur'],
            ],
          },
          'Die gute Nachricht: Die ersten tausend Wörter decken einen überraschend großen Teil der Alltagssprache ab, weil wenige Wörter sehr häufig vorkommen. Die schlechte: Von 3.000 auf 5.000 dauert länger als von null auf 1.000.',
        ],
      },
      {
        h2: 'Wie Davaigo das umsetzt',
        inhalt: [
          'Der Kurs bringt **1.797 Vokabeln** mit, jede in einem Beispielsatz und von Muttersprachlern gesprochen. Der Trainer rechnet für jedes Wort einen eigenen Abstand aus, genau nach dem Prinzip oben – vier Bewertungsknöpfe, und das Wort verschwindet so lange aus dem Stapel, wie es sitzt.',
          'Wörter kommen nicht nur aus den Lektionen: Jedes Wort, das du in einem Video oder Lesetext antippst, landet mit einem Tipp im selben Kasten – samt Übersetzung und der Stelle, an der du es gefunden hast.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Wie viele neue Vokabeln pro Tag sind sinnvoll?',
        antwort:
          'Fünf bis zehn neue Wörter täglich sind für die meisten gut machbar. Entscheidend ist aber nicht die Zahl der neuen, sondern dass du die fälligen Wiederholungen jeden Tag erledigst – sonst staut sich der Kasten.',
      },
      {
        frage: 'Soll ich mit Karteikarten aus Papier oder digital lernen?',
        antwort:
          'Das Prinzip ist wichtiger als das Werkzeug. Digital hat zwei Vorteile: Die Abstände werden automatisch berechnet, und du bekommst den Klang des Wortes dazu – gerade im Russischen mit seiner beweglichen Betonung ist das viel wert.',
      },
      {
        frage: 'Muss ich die Betonungszeichen mitlernen?',
        antwort:
          'Die Zeichen selbst stehen in echten russischen Texten nicht. Die Betonung musst du trotzdem kennen – am besten über das Hören, nicht über das Auswendiglernen von Strichen.',
      },
      {
        frage: 'Was mache ich mit Wörtern, die einfach nicht hängen bleiben?',
        antwort:
          'Solche Wörter brauchen einen Haken: eine Eselsbrücke, ein Bild, einen Satz aus deinem eigenen Leben. Ein Wort, das mit etwas Persönlichem verknüpft ist, bleibt deutlich besser als eines, das nur eine Übersetzung hat.',
      },
    ],
  },
  // ============================================================
  {
    slug: 'duolingo-russisch-alternative',
    emoji: '🦉',
    datum: '2026-10-09',
    lesezeit: 6,
    seitentitel: 'Duolingo für Russisch – reicht das wirklich?',
    titel: 'Duolingo für Russisch – was es gut kann und wo du weitermachen musst',
    beschreibung:
      'Duolingo ist die bekannteste Lern-App. Für Russisch hat sie Stärken und zwei handfeste Grenzen. Eine ehrliche Einordnung – und was danach kommt.',
    anreisser:
      'Fast jeder fängt mit der grünen Eule an. Das ist kein Fehler – man sollte nur wissen, wofür sie gut ist und wann man etwas anderes braucht.',
    abschnitte: [
      {
        h2: 'Was Duolingo richtig gut macht',
        inhalt: [
          'Duolingo hat ein Problem gelöst, an dem die meisten Lernenden scheitern: dranbleiben. Kurze Einheiten, eine Serie, die man ungern reißen lässt, sichtbarer Fortschritt, und alles in Häppchen, die auch in eine Busfahrt passen. Das ist psychologisch klug gebaut, und es funktioniert.',
          'Dazu kommt eine sehr niedrige Hürde: kostenlos, sofort loslegen, keine Entscheidung nötig. Wer noch nie eine Fremdsprache allein gelernt hat, kommt hier am leichtesten rein.',
          'Für die ersten Wochen Russisch ist das wertvoll. Du gewöhnst dich an das Alphabet, sammelst erste Wörter und baust vor allem die Gewohnheit auf, jeden Tag etwas zu tun. Diese Gewohnheit ist später mehr wert als alles, was du in den ersten Wochen inhaltlich lernst.',
        ],
      },
      {
        h2: 'Grenze 1: Übersetzen ist nicht Sprechen',
        inhalt: [
          'Der Kern von Duolingo sind Übersetzungsaufgaben – Satz anzeigen, Satz übertragen, Häkchen. Das trainiert eine sehr spezielle Fähigkeit: zwischen zwei Sprachen umschalten. Nur ist genau das nicht, was man beim Sprechen tut.',
          'Wer flüssig spricht, übersetzt nicht. Er greift direkt auf das Wort zu. Wer monatelang nur übersetzt, baut sich eine Zwischenstation ein, die später mühsam wieder abzutrainieren ist – man merkt es daran, dass man im Gespräch den deutschen Satz denkt und ihn dann stockend überträgt.',
          {
            kasten: [
              'Ein Gegenmittel, das nichts kostet: Sprich jeden Satz, den du richtig hattest, einmal laut nach. Das klingt albern und ist der wirksamste Zusatz zu jeder Übersetzungs-App.',
            ],
            titel: 'Was du sofort dagegen tun kannst',
          },
        ],
      },
      {
        h2: 'Grenze 2: Erklärt wird wenig',
        inhalt: [
          'Duolingo setzt darauf, dass man Muster durch Wiederholung aufschnappt. Bei Spanisch oder Italienisch geht das erstaunlich weit. Bei Russisch stößt es an eine Wand, und zwar an drei Stellen:',
          {
            liste: [
              '**Die sechs Fälle.** Dass *книга* mal *книгу*, mal *книги*, mal *книге* heißt, kann man sich anhören. *Warum* – also wofür jeder Fall da ist – erschließt sich aus Beispielsätzen kaum.',
              '**Der Verbaspekt.** Es gibt im Deutschen nichts Vergleichbares. Ohne Erklärung bleibt *делать* gegen *сделать* ein Rätsel, das man rät statt entscheidet.',
              '**Die Bewegungsverben.** *идти* gegen *ходить*, *ехать* gegen *ездить* – hier braucht es wirklich jemanden, der einmal den Unterschied erklärt.',
            ],
          },
          'Das ist kein Vorwurf an die App, sondern eine Folge ihres Bauprinzips. Es heißt nur, dass du dir diese Erklärungen woanders holen musst.',
        ],
      },
      {
        h2: 'Was du vor dem Start prüfen solltest',
        inhalt: [
          'Eine praktische Sache, die viele überrascht: Das Kursangebot hängt davon ab, in welcher Sprache die Oberfläche eingestellt ist. Aus dem Englischen gibt es deutlich mehr Kurse als aus dem Deutschen. Prüf also zuerst, ob der Russischkurs für deine Einstellung überhaupt angeboten wird – und wenn du ihn über die englische Oberfläche nimmst, lernst du nebenbei über eine Zwischensprache. Das geht, kostet aber Aufmerksamkeit, die beim Russischen besser aufgehoben wäre.',
        ],
      },
      {
        h2: 'Der sinnvolle Weg danach',
        inhalt: [
          'Die Frage ist selten „Duolingo oder etwas anderes", sondern „was kommt danach". Ein Aufbau, der sich bewährt:',
          {
            nummern: [
              '**Gewohnheit aufbauen** – mit dem, was dir am leichtesten fällt. Vier Wochen jeden Tag, egal wie kurz.',
              '**Auf einen Kurs mit Erklärungen wechseln**, sobald die Fälle anfangen. Das ist der Punkt, an dem reines Aufschnappen nicht mehr trägt.',
              '**Echtes Material dazunehmen** – Videos, Lieder, Texte. Alles, was nicht für Lernende gemacht wurde.',
              '**Sprechen anfangen**, sobald du ungefähr tausend Wörter hast. Nicht später.',
            ],
          },
        ],
      },
      {
        h2: 'Was Davaigo anders macht',
        inhalt: [
          'Davaigo ist für genau den zweiten Schritt gebaut – und deckt den ersten gleich mit ab. Die **180 Lektionen** sind nach einem festen Lehrplan geordnet, und jede bringt neben den Übungen Erklärkarten mit: nicht nur *dass* der Instrumental hier steht, sondern wofür er da ist.',
          'Dazu Dinge, die eine reine Übersetzungs-App nicht hat: Alles ist von **russischen Muttersprachlern** gesprochen, es gibt Hör- und Diktatübungen, und in der Mediathek arbeitest du mit echten YouTube-Videos und Liedern statt mit Lehrbuchsätzen.',
          'Und beim Dranbleiben hat Davaigo sich bei den guten Ideen bedient: Tagesziel, Serie, Punkte – aber ohne dich dafür zu bestrafen, dass du einen Tag ausgelassen hast.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Ist Duolingo für Russisch schlecht?',
        antwort:
          'Nein. Es ist gut darin, dich täglich zum Üben zu bringen und dir die ersten Wörter beizubringen. Es ist schwach bei Grammatikerklärungen und beim freien Sprechen – dafür brauchst du etwas anderes dazu.',
      },
      {
        frage: 'Wie weit komme ich allein mit Duolingo?',
        antwort:
          'Erfahrungsgemäß bis zu einem guten Anfängerniveau beim Erkennen und Übersetzen. Für freies Sprechen und für das Verstehen echter Texte reicht es bei Russisch in der Regel nicht.',
      },
      {
        frage: 'Soll ich wechseln oder parallel nutzen?',
        antwort:
          'Parallel ist völlig in Ordnung, solange du nicht doppelt dasselbe machst. Sinnvoll ist, das eine für die tägliche Gewohnheit zu nutzen und das andere für Grammatik, Hören und echtes Material.',
      },
    ],
  },

  // ============================================================
  {
    slug: 'russisch-lernen-mit-videos',
    emoji: '🎬',
    datum: '2026-10-09',
    lesezeit: 6,
    seitentitel: 'Russisch lernen mit YouTube-Videos – so geht es richtig',
    titel: 'Russisch lernen mit YouTube-Videos – vom Berieseln zum Unterricht',
    beschreibung:
      'Videos sind das beste kostenlose Material für Russisch – wenn du sie richtig benutzt. Welche Videos taugen, wie du sie bearbeitest und was dabei hängen bleibt.',
    anreisser:
      'Stundenlang russische Videos ansehen und nichts lernen: Das ist erstaunlich leicht. Mit einer kleinen Änderung der Arbeitsweise wird daraus die wirksamste Übung überhaupt.',
    abschnitte: [
      {
        h2: 'Warum passives Zuschauen fast nichts bringt',
        inhalt: [
          'Der verbreitetste Irrtum beim Sprachenlernen lautet: Wenn ich mich nur lange genug berieseln lasse, sickert es schon ein. Bei Kleinkindern stimmt das ungefähr. Bei Erwachsenen, die nebenbei kochen, nicht.',
          'Verständlich wird Material erst, wenn du den allergrößten Teil schon kennst und nur wenig Neues dazukommt. Ein Video, von dem du zehn Prozent verstehst, ist für dein Gehirn Rauschen – es gibt nichts, woran sich das Neue festmachen könnte.',
          'Das heißt nicht, dass du warten musst, bis du alles verstehst. Es heißt, dass du mit dem Video **arbeiten** musst, statt es laufen zu lassen.',
        ],
      },
      {
        h2: 'Welche Videos sich eignen',
        inhalt: [
          {
            kopf: ['Niveau', 'was du suchen solltest'],
            tabelle: [
              ['Anfang (A1)', 'Lernkanäle mit langsamem, deutlichem Russisch und eingeblendeter Schrift'],
              ['A2', 'Kurze Vlogs über Alltägliches: Einkaufen, Wohnung, Kochen'],
              ['B1', 'Interviews, Erklärvideos, Nachrichten in einfachem Russisch'],
              ['B2 und darüber', 'Podcasts, Talkshows, alles für Muttersprachler Gemachte'],
            ],
          },
          'Zwei Dinge sind wichtiger als das Thema: **Untertitel auf Russisch** müssen vorhanden sein, und das Video sollte nicht länger als zehn Minuten sein. Lange Videos verführen zum Berieseln.',
          {
            kasten: [
              'Achte darauf, dass die Untertitel auf **Russisch** sind, nicht nur eine deutsche Übersetzung. Wer nur die Übersetzung mitliest, trainiert Lesen auf Deutsch. Der Lerneffekt steckt darin, den russischen Text zu hören und gleichzeitig zu sehen.',
            ],
            titel: 'Der wichtigste Filter',
          },
        ],
      },
      {
        h2: 'Die Arbeitsweise in vier Durchgängen',
        inhalt: [
          {
            nummern: [
              '**Einmal ohne alles ansehen.** Keine Untertitel, kein Nachschlagen. Nur: Worum geht es ungefähr? Das trainiert genau die Fähigkeit, die du im echten Gespräch brauchst – aus Bruchstücken einen Sinn bauen.',
              '**Mit russischen Untertiteln ansehen.** Jetzt verbindet sich das Gehörte mit dem Geschriebenen. Hier fallen dir die Verschleifungen auf: dass *что* wie „schto" klingt und *сегодня* mit einem w.',
              '**Unbekannte Wörter sammeln.** Nicht alle – die fünf bis zehn, die mehrfach vorkommen oder ohne die ein ganzer Satz unklar bleibt. Alles andere kannst du getrost stehen lassen.',
              '**Ein letztes Mal ohne Untertitel.** Jetzt verstehst du deutlich mehr als beim ersten Mal, und dieses Erfolgserlebnis ist der Grund, warum man die Methode durchhält.',
            ],
          },
          'Das dauert bei einem Fünf-Minuten-Video etwa zwanzig Minuten. Diese zwanzig Minuten sind mehr wert als zwei Stunden Berieseln.',
        ],
      },
      {
        h2: 'Lieder sind ein Sonderfall – ein guter',
        inhalt: [
          'Musik hat zwei Vorteile, die kein Video hat: Man hört sie freiwillig mehrfach, und die Melodie trägt den Text mit. Wendungen aus Liedern sitzen oft nach wenigen Durchgängen und kommen beim Sprechen von allein wieder hoch.',
          'Der Haken: Liedtexte nehmen sich Freiheiten. Wortstellung, Auslassungen, veraltete Formen. Als zusätzliche Quelle sind Lieder hervorragend, als einzige Grundlage nicht.',
          'Praktischer Tipp: Such nach Fassungen mit eingeblendetem Text. Bei russischen Liedern ist das oft als *текст* oder *караоке* gekennzeichnet.',
        ],
      },
      {
        h2: 'Was sich dabei automatisch mitlernt',
        inhalt: [
          {
            liste: [
              '**Das Tempo echter Rede.** Lehrbuch-Audio ist langsam und sauber. Menschen reden schnell und verschlucken Silben – *здравствуйте* wird zu „sdrasste", *сейчас* zu „schtschas".',
              '**Satzmelodie.** Ob ein russischer Satz eine Frage ist, hört man oft nur an der Stimme.',
              '**Wortschatz im Zusammenhang.** Ein Wort, das du in einer Szene gehört hast, bleibt besser als eines aus einer Liste.',
              '**Füllwörter.** *ну*, *вот*, *короче*, *да ладно* – die stehen in keinem Lehrbuch und in jedem echten Gespräch.',
            ],
          },
        ],
      },
      {
        h2: 'Wie Davaigo diese Arbeit abnimmt',
        inhalt: [
          'Der mühsame Teil der Methode ist Schritt drei: Wörter heraussuchen, nachschlagen, notieren. Genau dafür ist die Mediathek in Davaigo gebaut.',
          'Du suchst ein Thema auf Deutsch, Davaigo übersetzt es ins Russische und findet passende Videos dazu. Im Abspieler laufen die Untertitel mit – und jedes Wort ist antippbar. Ein Tipp zeigt dir die Übersetzung, ein zweiter legt das Wort in deinen Karteikasten, samt dem Video, aus dem es stammt. Das Nachschlagen findet also im Video statt und nicht in einem zweiten Fenster.',
          'Für Lieder funktioniert es genauso, und wer sein Spotify-Konto verbindet, bekommt russischsprachige Vorschläge, die zu seinem Geschmack passen.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Ab wann lohnen sich Videos für Muttersprachler?',
        antwort:
          'Mit Untertiteln und der Vier-Schritte-Methode kannst du schon ab A2 damit arbeiten. Ohne Untertitel wird es meist erst ab B1 wirklich ergiebig.',
      },
      {
        frage: 'Soll ich deutsche oder russische Untertitel nehmen?',
        antwort:
          'Russische. Deutsche Untertitel ziehen die Aufmerksamkeit komplett auf sich – du liest dann einen deutschen Text und hörst nebenbei Musik. Die Übersetzung hilft nur für einzelne Wörter, die du nicht erschließen kannst.',
      },
      {
        frage: 'Wie oft sollte ich dasselbe Video ansehen?',
        antwort:
          'Drei bis vier Durchgänge in einer Sitzung, dann nach ein paar Tagen noch einmal. Wiederholung desselben Materials bringt mehr als ständig neues – das ist derselbe Effekt wie beim Vokabellernen.',
      },
      {
        frage: 'Was, wenn ich fast nichts verstehe?',
        antwort:
          'Dann ist das Video zu schwer. Such etwas Einfacheres statt dich durchzuquälen. Material, bei dem du etwa 70 bis 80 Prozent verstehst, bringt den größten Fortschritt.',
      },
    ],
  },
]
