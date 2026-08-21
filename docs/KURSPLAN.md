# Davaigo-Kursplan: 180 Lektionen von A0 bis zur B2-Brücke

> Die Quelle der Wahrheit für den Kursaufbau. Jede neue Lektion in
> `src/lektionen.js` folgt diesem Plan; die Lektionsnummer (kursNr)
> entspricht der Nummer hier.

Für Russisch wird nicht der Spanischkurs übersetzt. Die Sprache braucht
am Anfang deutlich mehr Raum für Alphabet, Lesen, Aussprache, Fälle,
Verbaspekte und Bewegungsverben.

180 Lektionen in zehn Modulen. Die ersten 18 Lektionen vermitteln
systematisch das kyrillische Lesen. Trotzdem lernen die Nutzer von
Beginn an echte Wörter und kleine kommunikative Situationen.

Die 180 Lektionen decken die relevante Grammatik bis ungefähr B2 ab.
Bei konsequenter Hör-, Sprech- und Wiederholungspraxis ist ein solides
B1 bis B1+ realistisch; die letzten Module bilden die Brücke zu B2.

## Umsetzungsstand

**Vollständig umgesetzt (21.08.2026).** Alle 180 Lektionen liegen in
`src/lektionen.js` – zehn Module à 18 Lektionen, zusammen 1797 Vokabeln.
Jedes Modul schließt mit einer Prüfstation in `src/pruefstationen.js` ab.

Geprüft wird der Aufbau von drei Skripten, die bei jedem Build laufen:

| Skript | prüft |
| --- | --- |
| `pruefe-lektionen.mjs` | Nummerierung, Rückverweise, Feldformate |
| `pruefe-stationen.mjs` | eine Station je Modul, drei Rückblick-Karten |
| `pruefe-bausteine.mjs` | die acht Grammatik-Bausteine |

Ein Hinweis zu den Feldnamen: Die Vokabelfelder heißen weiterhin `es`
und `beispielEs` – ein Erbe des Spanischkurses. Sie tragen russischen
Text. Das bleibt absichtlich so, damit Engine, Prüfskripte und spätere
Übernahmen aus Habloo kompatibel bleiben.

## Gesamtstruktur

| Modul | Titel | Lektionen | Niveau |
|---|---|---|---|
| 1 | Kyrillisch lesen und richtig aussprechen | 1–18 | A0 |
| 2 | Erste russische Gespräche | 19–36 | A0–A1.1 |
| 3 | Alltag, Wohnung und Tagesablauf | 37–54 | A1.1 |
| 4 | Menschen, Beziehungen und die sechs Fälle | 55–72 | A1.1–A1.2 |
| 5 | Einkaufen, Gesundheit und Vergangenheit | 73–90 | A1.2–A2.1 |
| 6 | Stadt, Reisen und Bewegungsverben | 91–108 | A2.1 |
| 7 | Verbaspekt, Zukunft und Entscheidungen | 109–126 | A2.1–A2.2 |
| 8 | Erzählen, Meinungen und komplexere Sätze | 127–144 | B1.1 |
| 9 | Arbeit, Medien und fortgeschrittene Strukturen | 145–162 | B1.2 |
| 10 | Natürliches Russisch und B2-Transfer | 163–180 | B1.2–B2.1 |

## Aufbau einer normalen Lektion

Jede Lektion: ungefähr 20 bis 35 Minuten Kerninhalt plus optionale Wiederholung.

1. Kurzer Einstieg in eine reale Situation.
2. Zwei bis vier konkrete Lernziele.
3. Hörimpuls zunächst ohne Text.
4. Dialog oder kurzer Monolog.
5. Transkript in kyrillischer Schrift.
6. Optional einblendbare Betonungszeichen.
7. Acht bis vierzehn neue Wörter oder Wendungen.
8. Höchstens ein neuer grammatischer Schwerpunkt.
9. Kurzer Lesetext.
10. Verständnisfragen.
11. Formen-, Fall- oder Aspekttraining.
12. Diktat, Satzbau oder Zuordnungsübung.
13. Aussprache- beziehungsweise Shadowing-Aufgabe.
14. Freie Sprech- oder Schreibaufgabe.
15. Wiederholung von drei bis fünf älteren Inhalten.
16. Bestehensgrenze von ungefähr 80 Prozent.

**Wichtig:** Die Audios immer zuerst ohne Transkript abspielen. Danach
wahlweise kyrillischen Text, Betonungszeichen und deutsche Übersetzung
einblenden.

## Modul 1: Kyrillisch lesen und richtig aussprechen (1–18, A0)

Ziel: Alle 33 Buchstaben erkennen, einfache unbekannte Wörter
selbstständig lesen, russische Laute unterscheiden und erste kurze
Wörter schreiben. Lateinische Umschrift höchstens am Anfang als
einblendbare Hilfe – nie dauerhaft unter jedem Wort.

1. **So funktioniert die russische Sprache** — Überblick über kyrillische Schrift, Wortbetonung, Fälle und Verbaspekte, ohne diese bereits auswendig lernen zu müssen. Praxis: Erste russische Wörter anhand von Bild und Audio erkennen. Wichtig: Russisch ist nicht „Deutsch mit anderen Buchstaben".
2. **Die ersten Buchstaben: А, О, М, Т, К** — Groß- und Kleinbuchstaben, Lautwerte und erste Silben. Lesepraxis mit ма, то, кот, там und мама. Von Beginn an Laute verbinden, nicht Buchstaben einzeln aufsagen.
3. **Bekannte Formen, andere Laute: И, Н, Е, С, Р, В** — Die falschen Freunde des Alphabets. Praxis: метро, ресторан, мир. Das kyrillische Р klingt wie deutsches R, nicht wie P.
4. **Neue Zeichen: У, Х, Б, П, Д, Г, Л** — Buchstaben erkennen, hören und in Silben verbinden. Kurze Wörter aus bekannten Buchstaben lesen und nach Audio auswählen.
5. **Zisch- und Affrikatenlaute: З, Ф, Ц, Ч, Ш, Щ, Ж** — Unterschiede zwischen ш, щ, ж, ч und ц zunächst hörend wahrnehmen. Nicht alle Laute sofort perfekt produzieren müssen.
6. **Die letzten Vokal- und Sonderbuchstaben: Й, Ы, Э, Ю, Я, Ё** — Form, Laut und Position im Wort. Audio-Buchstaben-Zuordnung und erste Minimalpaare. Ё in Anfängertexten konsequent schreiben.
7. **Weiches und hartes Zeichen: Ь und Ъ** — Beide Zeichen haben keinen eigenen Laut; sie verändern die Aussprache bzw. trennen Laute. Unterschiede zwischen Wörtern mit und ohne ь hören.
8. **Silben flüssig verbinden** — Konsonant plus Vokal, offene und geschlossene Silben, kurze Konsonantengruppen. Wörter silbenweise dekodieren statt Buchstabe für Buchstabe.
9. **Erste internationale Wörter lesen** — банк, телефон, интернет, кафе, музыка, такси. Ähnliche Wörter können anders betont und ausgesprochen werden als im Deutschen.
10. **Harte und weiche Konsonanten** — Einführung in Palatalisierung. Hörübung mit Paaren wie ма/мя, лу/лю, ты/ти. Weichheit ist ein echter Lautunterschied.
11. **Е, Ё, Ю und Я richtig lesen** — Funktion am Wortanfang, nach Vokalen und nach Konsonanten. Hörend entscheiden, ob ein j-ähnlicher Laut vorkommt.
12. **И oder Ы?** — Mundposition und Höreindruck beider Laute. Aussprachetraining in kurzen Wörtern. ы nicht als deutsches ü vermitteln.
13. **Wortbetonung und Vokalreduktion** — Warum unbetontes о eher wie а klingt und sich unbetontes е verändert. Betonung hören und markieren. Wörter künftig immer mit Betonung lernen.
14. **Stimmhafte und stimmlose Konsonanten** — Auslautverhärtung und Lautanpassung. Warum die Schreibung nicht immer der Lautung entspricht.
15. **Schwierige Laute und Lautgruppen** — р, х, ж, ш, щ, ч, ц sowie Gruppen wie in здравствуйте. Ziel ist Verständlichkeit, nicht Perfektion.
16. **Kursivschrift, Handschrift und Tastatur** — Druckschrift, kursive Schrift, Handschrift; Schilder, Chats, Notizen. Kyrillische Tastatur aktivieren.
17. **Erste echte Leseseite und Minidiktat** — Kurzer Text mit Namen, Orten, Zahlen. Fünf bis acht gehörte Wörter kyrillisch eintippen.
18. **Modulabschluss: Ich kann Kyrillisch lesen** — Unbekannte lauttreue Wörter lesen, Betonungen erkennen, nach Diktat schreiben, Schilder verstehen. Keine neue Schriftregel.

## Modul 2: Erste russische Gespräche (19–36, A0–A1.1)

Ziel: Begrüßen, sich vorstellen, einfache Fragen beantworten, kurze Personenprofile lesen und verstehen.

19. **Begrüßen und verabschieden** — Привет, Здравствуйте, Доброе утро, Добрый день, Пока, До свидания. Informelles und höfliches Register.
20. **Den eigenen Namen nennen** — Меня зовут…, Я…, Как тебя зовут?, Как вас зовут?. Hörübung mit verschiedenen Namen.
21. **Кто? Что? Это…** — Personen und Dinge identifizieren. Кто это? Это Анна. Russische Substantive haben keine Artikel.
22. **Sätze ohne „sein" im Präsens** — Я студент, Она врач, Москва — город. быть wird im Präsens meist nicht ausgesprochen; есть nicht mechanisch einsetzen.
23. **Personalpronomen und ты oder вы** — я, ты, он, она, оно, мы, вы, они. Auch die höfliche Großschreibung Вы.
24. **Das Geschlecht russischer Substantive** — Typische Endungen m/f/n; Wörter auf ь mit Geschlecht lernen. Sortierübungen.
25. **Erste Adjektive im Nominativ** — новый, новая, новое, новые. Personen, Gegenstände, Orte beschreiben.
26. **Der Nominativ Plural** — -ы und -и, erste Ausnahmen, Rechtschreibregeln nach г, к, х, ж, ш, щ, ч.
27. **Einfache Fragen stellen** — кто, что, где, как, откуда, какой, сколько, Frageintonation. Kennenlerninterview.
28. **Präsens: erste Konjugationsgruppe** — работать, читать, знать, делать. Stamm und Endung erkennen.
29. **Präsens: zweite Konjugationsgruppe** — говорить, любить, учить. Die Gruppe ist nicht immer am Infinitiv erkennbar.
30. **Häufige Verben als ganze Muster** — жить, хотеть, мочь, есть, пить, писать. In Sätzen statt Tabellen.
31. **Verneinung und grundlegender Satzbau** — не, нет, neutrale Wortstellung.
32. **Possessivbegleiter** — мой, твой, наш, ваш, его, её, их. его/её/их sind unveränderlich.
33. **Zahlen von 0 bis 20** — Alter, Telefonnummern, Preise. Hörtraining in zufälliger Reihenfolge.
34. **Herkunft, Sprache und Beruf** — Я из Германии, Я говорю по-немецки, Я программист. Мне двадцать семь лет als feste Wendung.
35. **Lese- und Hörtraining: Vier Personenprofile** — Audios zu Bildern zuordnen, Texte vergleichen.
36. **Modulabschluss: Erstes Kennenlernen** — Begrüßen, vorstellen, Herkunft, fünf Fragen, kurzes Profil. Hören, Lesen, Schreiben, Sprechen.

## Modul 3: Alltag, Wohnung und Tagesablauf (37–54, A1.1)

37. **Akkusativ für unbelebte Objekte** — Я читаю книгу; zunächst -а/-я-Feminina und unveränderte m/n-Formen.
38. **Persönliche Objektpronomen** — меня, тебя, его, её, нас, вас, их.
39. **Wollen, mögen und können** — хотеть, любить, мочь + Substantiv oder Infinitiv.
40. **Der Präpositiv für Aufenthaltsorte** — в школе, в Берлине, на работе.
41. **В oder на?** — Als feste Ortsverbindungen speichern, nicht über Übersetzungen.
42. **Existenz mit есть** — Здесь есть кафе; Abgrenzung zum ausgelassenen быть.
43. **Wohnung, Räume und Möbel** — Führung durch eine Wohnung mit есть, в, на, это.
44. **Adjektive im Präpositiv** — в новом доме, на большой кухне; anhand bekannter Ortsangaben.
45. **Über Themen sprechen: о ком? о чём?** — говорить о работе, читать о Москве.
46. **Wochentage, Monate und Datum** — als kommunikative Muster; Termine vergleichen.
47. **Der Tagesablauf** — Präsensformen in zeitlicher Abfolge.
48. **Reflexive Verben auf -ся** — учиться, встречаться, заниматься, просыпаться.
49. **Häufigkeit und Reihenfolge** — обычно, часто, иногда, редко, никогда, сначала, потом.
50. **Uhrzeit und Zeitplan** — volle Stunden, Minuten, в семь часов.
51. **Lesetraining: Ein Tag in Moskau** — Graded Reader; Überschriften zuordnen, Ablauf ordnen.
52. **Hörtraining: Wann macht sie was?** — Globale Zuordnung, Detailfragen, Minidiktat.
53. **Essen, Getränke und erste Café-Sprache** — Я хочу…, Мне, пожалуйста…, Можно кофе?.
54. **Modulabschluss: Mein typischer Tag** — Wohnung, Tagesablauf, Uhrzeiten, Café. Keine neue Grammatik.

## Modul 4: Menschen, Beziehungen und die sechs Fälle (55–72, A1.1–A1.2)

55. **Familie und Beziehungen** — Ein Familienfoto erklären.
56. **Besitz mit у + Genitiv** — У меня есть брат; als eigenes russisches Muster.
57. **Genitiv Singular und нет** — У меня нет машины; Existenz und Nichtexistenz kontrastiv.
58. **Genitiv nach Präpositionen** — из, от, до, без, для, около, после.
59. **Belebter Akkusativ** — Я вижу брата; bei belebten Maskulina wie Genitiv.
60. **Adjektive im Akkusativ** — unbelebt, belebt, feminine Endungen.
61. **Dativ für Empfänger** — Я пишу другу, Она даёт ребёнку книгу.
62. **Alter, Empfindungen und Zustände im Dativ** — Мне двадцать лет, Мне холодно, Нам пора.
63. **Нравиться und ähnliche Konstruktionen** — Мне нравится фильм / нравятся книги.
64. **Instrumental mit с** — с другом, с семьёй, с новым коллегой.
65. **Instrumental für Beruf, Rolle und Mittel** — быть/стать/работать + Instrumental; Werkzeuge.
66. **Personalpronomen in den Fällen** — у меня, со мной, к нему, о ней als Chunks.
67. **Demonstrativbegleiter этот und тот** — Geschlecht, Zahl, erste Fallformen.
68. **Adjektive in Genitiv, Dativ und Instrumental** — häufigste Endungsmuster.
69. **Die sechs Fälle als Funktionskarte** — Entscheidungstraining: Welche Funktion liegt vor?
70. **Lesetraining: Wer gehört zu wem?** — Profile, Chats; Fälle nach Funktion markieren.
71. **Hörtraining: Besuch bei Freunden** — Dativ, Genitiv, Instrumental im Kontext.
72. **Modulabschluss: Menschen in meinem Leben** — alle Fälle gemischt.

## Modul 5: Einkaufen, Gesundheit und Vergangenheit (73–90, A1.2–A2.1)

73. **Mengen und Zahlen mit Substantiven** — nach один, два/три/четыре, ab fünf.
74. **Zahlen bis 1.000 und Preise** — Rubelbeträge, Etagen, Entfernungen.
75. **Lebensmittel und Verpackungen** — килограмм яблок, бутылка воды, чашка чая.
76. **Kleidung, Farben und Größen** — auswählen, anprobieren, bezahlen.
77. **Vergleiche** — более, менее, чем; лучше, хуже, больше, меньше.
78. **Superlativ und Verstärkung** — самый, наиболее, очень, слишком, довольно.
79. **Körperteile** — Wortschatz und typische Verbindungen.
80. **Schmerzen und Beschwerden** — У меня болит голова / болят ноги, Мне плохо.
81. **Beim Arzt und in der Apotheke** — Symptome, Termin, Medikamente. (Sprachtraining, keine medizinische Beratung.)
82. **Möglichkeit und Notwendigkeit** — можно, нельзя, нужно, надо + Infinitiv.
83. **Vergangenheit: Bildung und Geschlecht** — -л-Formen; был, была, было, были.
84. **Reflexive Verben in der Vergangenheit** — встретился, училась, занимались.
85. **Vergangene Fragen und Verneinungen** — Что ты делал?, Я не работал. Kein Hilfsverb.
86. **Eine vergangene Handlung zeitlich ordnen** — вчера, сначала, потом, на прошлой неделе.
87. **Lesetraining: Tagebuch und Chatverlauf** — Informationen vergleichen.
88. **Hörtraining: Was ist gestern passiert?** — Hauptinfos, Reihenfolge, Zeitangaben.
89. **Einladen, zusagen und absagen** — Vorschläge, Gründe, Alternativen, Telefon.
90. **Modulabschluss: Ein unerwarteter Tag** — vier Fertigkeiten getrennt bewertet.

## Modul 6: Stadt, Reisen und Bewegungsverben (91–108, A2.1)

91. **Orte in der Stadt und Wegbeschreibung** — Einrichtungen, Richtungen, Entfernungen.
92. **Ort oder Ziel: в/на + Präpositiv oder Akkusativ** — Я в школе vs. Я иду в школу.
93. **Bewegung mit к, от, из und с** — к врачу, от друга, из магазина, с работы.
94. **Идти oder ходить** — gerichtete vs. regelmäßige Bewegung; nicht auf „einmal/mehrmals" reduzieren.
95. **Ехать oder ездить** — dasselbe Prinzip mit Verkehrsmittel.
96. **Туда, сюда, там, здесь und домой** — Richtung und Aufenthaltsort.
97. **Hörtraining: Am Bahnhof und in der Metro** — erst langsam, dann natürliches Tempo.
98. **Пойти und поехать** — Beginn einer gerichteten Bewegung.
99. **Нести oder носить** — Gegenstände zu Fuß tragen.
100. **Везти, возить, вести und водить** — transportieren, führen, fahren; erst rezeptiv.
101. **Ankommen und weggehen: при-, у-, в- und вы-** — прийти, уйти, войти, выйти, приехать, уехать.
102. **Öffentliche Verkehrsmittel** — Fahrkarten, Umsteigen, Zeitdruck-Training.
103. **Eine Unterkunft buchen** — Zimmerarten, Zeitraum, Check-in, Sonderwünsche.
104. **Probleme auf Reisen lösen** — Buchung, Gepäck, Verspätung, Bitte um Hilfe.
105. **Was ist ein Verbaspekt?** — imperfektiv/perfektiv als Perspektive: Verlauf vs. Ergebnis.
106. **Aspekt in der Vergangenheit** — Я читал vs. Я прочитал; nicht „lang vs. kurz".
107. **Lese- und Hörgeschichte: Eine chaotische Reise** — hören, lesen, nacherzählen.
108. **Modulabschluss: Von der Buchung bis zur Ankunft.**

## Modul 7: Verbaspekt, Zukunft und Entscheidungen (109–126, A2.1–A2.2)

109. **Häufige Aspektpaare lernen** — делать/сделать, читать/прочитать, покупать/купить, открывать/открыть.
110. **Zusammengesetzte Zukunft mit буду** — буду + imperfektiver Infinitiv.
111. **Einfache Zukunft perfektiver Verben** — сделаю, прочитаю, куплю; sehen aus wie Präsens.
112. **Zukunftsaspekt auswählen** — Tätigkeit, Prozess, Wiederholung, Ergebnis.
113. **Aspekt nach хотеть, мочь und любить** — hängt von der Bedeutung ab.
114. **Anfangen, fortsetzen, aufhören** — начать, продолжать, перестать, закончить, снова.
115. **Der Imperativ: Grundformen** — говори, скажите, дай, идите, сядьте.
116. **Imperativ und Verbaspekt** — imperfektiv für Tätigkeit/Einladung, perfektiv für Ergebnis.
117. **Höflich bitten und reagieren** — Пожалуйста, Будьте добры, Не могли бы вы…, Можно…?.
118. **Der Konditional mit бы** — Я бы поехал, Она бы купила.
119. **Reale und irreale Bedingungen mit если** — Если будет время… / Если бы у меня было время….
120. **Zweck und Wünsche mit чтобы** — gleiches und unterschiedliches Subjekt.
121. **Verpflichtung und Notwendigkeit** — должен, надо, нужно, приходится.
122. **Unbestimmte und negative Pronomen** — кто-то, кто-нибудь, что-то, никто, ничего.
123. **Aspekt und Verneinung** — не делал, не сделал, не надо делать, не забудь сделать.
124. **Weitere Bewegungspräfixe** — под-, от-, до-, пере-, про-, за-; visuell animiert.
125. **Lese- und Hörtraining: Pläne ändern sich** — Zukunft, Konditional, Aspekt im Zusammenhang.
126. **Modulabschluss: Eine Entscheidung mit Folgen.**

## Modul 8: Erzählen, Meinungen und komplexere Sätze (127–144, B1.1)

127. **Relativsätze mit который** — Nominativ und Akkusativ.
128. **Который in weiteren Fällen** — с которым, о которой, у которого, которому.
129. **Ergänzungssätze mit что, кто, где, как** — Я знаю, что…; Abgrenzung zu Relativsätzen.
130. **Ursache und Folge** — потому что, так как, поэтому, из-за, благодаря.
131. **Gegensatz und Einräumung** — но, а, зато, однако, хотя, несмотря на.
132. **Zeitliche Nebensätze** — когда, пока, после того как, перед тем как, как только.
133. **Direkte und indirekte Rede** — Pronomen und Perspektive anpassen; keine mechanische Zeitenfolge.
134. **Indirekte Fragen und die Partikel ли** — Он спросил, буду ли я дома.
135. **Unpersönliche Konstruktionen** — мне кажется, мне удалось, мне пришлось, стало холодно.
136. **Lage und Platzierung** — стоять, лежать, сидеть, висеть / поставить, положить, посадить, повесить.
137. **Kurzformen von Adjektiven** — готов, занят, должен, важен, известен.
138. **Fortgeschrittene Vergleiche** — чем…, тем…; такой же, как; в два раза больше.
139. **Aspekt beim Erzählen** — Hintergrund, Ereigniskette, Ergebnis, erfolgloser Versuch.
140. **Bedeutungsnuancen durch Partikeln** — уже, ещё, же, ведь, даже, только, именно.
141. **Wortstellung und Informationsfokus** — bekannte vs. neue Information, Betonung.
142. **Eine Meinung strukturiert äußern** — Position, Begründung, Beispiel, Gegenargument, Schluss.
143. **Lese-/Hörtraining: Leben in der Großstadt** — Positionen vergleichen.
144. **Modulabschluss: Geschichte und Diskussion.**

## Modul 9: Arbeit, Medien und fortgeschrittene Strukturen (145–162, B1.2)

145. **Berufliches Profil** — Ausbildung, Kenntnisse, Erfahrung; Instrumental im Berufskontext.
146. **Unternehmen und Arbeitsalltag** — Abteilungen, Hierarchien, erster Arbeitstag.
147. **Stellenanzeigen und Lebenslauf** — Pflicht- vs. Wunschqualifikationen.
148. **Formelle E-Mails** — russische Konventionen statt wörtlicher Übertragung.
149. **Das Bewerbungsgespräch** — Motivation, Stärken, situative Fragen.
150. **Meetings und Gesprächssteuerung** — eröffnen, unterbrechen, zusammenfassen.
151. **Projekte und Verhandlungen** — Fristen, Risiken, Budget, Kompromisse.
152. **Formelles und informelles Register** — auch Anrede mit Vor- und Vatersnamen.
153. **Passiv/unpersönlich mit -ся** — Дом строится, Здесь продаются книги.
154. **Kurze passive Partizipien** — проект закончен, документы подписаны, решение принято.
155. **Vollständige passive Partizipien** — построенный, написанный; erkennen und auflösen.
156. **Aktive Partizipien** — работающий, живущий, сделавший; vor allem rezeptiv.
157. **Adverbialpartizipien** — читая, обсуждая, закончив; gleiches Subjekt beachten.
158. **Wortbildung mit Präfixen und Suffixen** — verwandte Wörter erschließen.
159. **Fortgeschrittenes Zahlentraining** — Jahreszahlen, Prozente, flektierte Zahlwörter.
160. **Lesetraining: Zwei Berichte über dasselbe Ereignis** — Quelle, Tonfall, Fakten.
161. **Hörtraining: Nachricht und Podcastausschnitt** — ein Abschnitt in natürlichem Tempo.
162. **Modulabschluss: Berufliches Projekt.**

## Modul 10: Natürliches Russisch und B2-Transfer (163–180, B1.2–B2.1)

163. **Verbaspekt: Tatsache, Prozess und Resultat** — B2-Kontexte mit mehreren vertretbaren Entscheidungen.
164. **Präfixverben und Bedeutungsverschiebung** — писать, написать, записать, подписать, переписать.
165. **Bewegungsverben in übertragener Bedeutung** — время идёт, речь идёт о, перевести деньги.
166. **Fallrektion häufiger Verben** — помогать кому, бояться чего, зависеть от чего.
167. **Feste Präpositionsverbindungen** — в зависимости от, по сравнению с, в отличие от.
168. **Wortstellung, Fokus und Intonation** — Kontrast, emotionale Markierung, Selbstkorrektur.
169. **Partizipialkonstruktion oder Nebensatz?** — verdichtete Strukturen umformen; Lesekompetenz.
170. **Aktiv, Passiv oder unpersönlich?** — Struktur nach Fokus, Register, Informationsquelle.
171. **Komplexe Bedingungen und Einräumungen** — даже если, при условии что, несмотря на то что.
172. **Wahrscheinlichkeit und vorsichtige Aussagen** — возможно, вероятно, вряд ли, якобы.
173. **Gesprochene Partikeln und Füllwörter** — ну, вот, же, ведь, как бы, в общем, короче.
174. **Natürliches Hörverstehen** — Reduktionen, Selbstkorrekturen; что, сегодня, -ого, -ться.
175. **Russisch in unterschiedlichen Kontexten** — Standard, regional, Generationen, Communities.
176. **Langes Lesetraining** — adaptierter Text über mehrere Seiten; Struktur und Stil.
177. **Langes Hörtraining** — Podcast/Interview in natürlichem Tempo; zusammenfassen.
178. **Einen formellen Text schreiben** — Aufbau plus sprachliche Überarbeitung.
179. **Präsentieren und diskutieren** — 3–5 Minuten mit Rückfragen; getrennt bewerten.
180. **Finales Projekt** — verstehen, diskutieren, aushandeln, präsentieren. Danach individueller Wiederholungsplan.

## Grammatik sinnvoll staffeln

| Bereich | Einführung | Systematisierung | Vertiefung |
|---|---|---|---|
| Kyrillisch | 1 | 2–17 | durchgehend |
| Nominativ | 21 | 24–26 | durchgehend |
| Akkusativ | 37 | 59–60 | 69 und später |
| Präpositiv | 40 | 44–45 | 69 und später |
| Genitiv | 56 | 57–58 | 69, 73–75 |
| Dativ | 61 | 62–63 | 66–69 |
| Instrumental | 64 | 65 | 68–69 |
| Pluralformen der Fälle | 69 | 73–75 | durchgehend |
| Vergangenheit | 83 | 84–88 | 105–107 |
| Verbaspekt | 105 | 106, 109–116 | 123, 139, 163 |
| Bewegungsverben | 94 | 95–101 | 124, 165 |
| Konditional | 118 | 119–120 | 171 |
| Partizipien | 154 | 155–157 | 169 |
| Wortstellung und Fokus | 31 | 141 | 168 |

**Entscheidend:** Fälle, Aspekte und Bewegungsverben nicht als einmalige
Blöcke behandeln – nach der Einführung in fast jeder späteren Lektion
wieder aufgreifen.

## Besondere Übungstypen für Russisch

- Kyrillische Buchstaben nach Audio auswählen.
- Silben zu Wörtern verbinden.
- Betonung im Wort markieren.
- Harte und weiche Konsonanten unterscheiden.
- Ein Wort nach Diktat kyrillisch eingeben.
- Fallfunktion anhand eines Szenarios bestimmen.
- Passende Endung an Substantiv und Adjektiv ziehen.
- Einen Satz in Plural oder einen anderen Fall umformen.
- Lemma und flektierte Form zuordnen.
- Aspekt anhand der beabsichtigten Bedeutung auswählen.
- Bewegung in einer Animation mit идти/ходить/ехать/ездить beschreiben.
- Bewegungspräfixe anhand einer Karte auswählen.
- Dialoge per Shadowing nachsprechen.
- Bilder einer Hörgeschichte ordnen.
- Einen gelesenen Text ohne Vorlage mündlich zusammenfassen.
- Offene Sprechaufgaben mit inhaltlichem Feedback.

## Regeln für Schrift und Audio

- Neue russische Wörter immer mit Audio speichern.
- Die Lernansicht darf Betonungszeichen anzeigen: молоко́.
- In authentischen Lesetexten Betonungszeichen später ausblenden.
- ё mindestens bis B1 konsequent als ё schreiben.
- Lateinische Transliteration spätestens nach 6–8 Lektionen ausblenden.
- Jedes Dialogaudio braucht eine Lernversion und später eine natürliche Version.
- Regionale Aussprache nicht automatisch als Fehler bewerten.
- Aussprachefeedback prüft Verständlichkeit und Betonung, nicht „Akzentfreiheit".

## Dialoglängen

- Lektionen 1–18: Wörter, Minidialoge, Audios von 5–25 Sekunden.
- A0–A1: 6–10 Sprecherwechsel, ca. 35–90 Wörter.
- A2: 8–14 Sprecherwechsel, ca. 80–160 Wörter.
- B1: 10–18 Sprecherwechsel, ca. 150–260 Wörter.
- B2-Brücke: zusätzlich Interviews/Monologe von 2–6 Minuten.
- 75–85 % der Wörter und FORMEN eines Dialogs sollten bekannt sein
  (брат, брата, брату und с братом sind unterschiedlich schwierig).

## Datenstruktur (Ziel-Schema für Lektionen)

id, module_id, lesson_number, cefr_level, title_de, lesson_type,
scenario, communicative_goal, learning_objectives[], new_letters[],
script_support_level, stress_display_mode, phonetics_focus[],
grammar_focus[], case_focus[], aspect_focus[], motion_verb_focus[],
syntax_focus[], target_lemmas[], target_surface_forms[],
target_phrases[], case_government[], aspect_pairs[], dialogue_brief,
dialogue_characters[], dialogue_register, dialogue_word_count,
dialogue_known_lemma_ratio, dialogue_known_form_ratio, listening_task,
listening_speed, listening_without_transcript, reading_text_brief,
reading_word_count, exercise_types[], pronunciation_task,
dictation_task, speaking_task, writing_task, prerequisite_lessons[],
review_targets[], common_errors[], cultural_note, completion_criteria

Je Vokabelelement zusätzlich: lemma, surface_form, form_with_stress,
translation_de, part_of_speech, gender, animacy, number, case, aspect,
aspect_pair, conjugation, government, audio_id, example_sentence

## Wiederholungslogik

Jede Lektion greift drei bis fünf ältere Inhalte aktiv auf. Neue Wörter
erscheinen ungefähr nach 1, 3, 7, 14 und 30 Lektionen erneut. So
entstehen 180 miteinander verbundene Lektionen statt 180 isolierter
Grammatikartikel.
