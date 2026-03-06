'use client'

import { useState, useEffect, useCallback } from "react"

// ============================================================================
// FRAGENDATENBANK — 70 Fragen, keine Duplikate, korrekte Antworten, Erklärungen
// ============================================================================
const DB = [
  // ── FÜHRUNG (18) ──────────────────────────────────────────────────────────
  {id:"F01",k:"Führung",s:"leicht",q:"Was beschreibt situative Führung nach Hersey & Blanchard?",
   a:["Der Führungsstil wird an den Reifegrad (Kompetenz + Motivation) des MA angepasst.","Ein einheitlicher Stil ist für alle MA am effektivsten.","Es gibt 4 Reifegrade (R1–R4) und 4 Führungsstile (S1–S4).","R1 (niedrige Kompetenz, niedrige Motivation) → S1 Directing/Anweisen."],
   r:[0,2,3],e:"Hersey/Blanchard: R1→S1 (Anweisen), R2→S2 (Coaching), R3→S3 (Partizipieren), R4→S4 (Delegieren). Kein 'one size fits all'. Reifegrad = Kompetenz + Motivation."},

  {id:"F02",k:"Führung",s:"leicht",q:"Was kennzeichnet den kooperativen Führungsstil?",
   a:["MA werden aktiv in Entscheidungen einbezogen.","Die FK trifft alle Entscheidungen allein.","Offener Informationsaustausch und Transparenz sind Merkmale.","Eigenverantwortung der MA wird gezielt gefördert."],
   r:[0,2,3],e:"Kooperativ: MA-Beteiligung, Transparenz, Eigenverantwortung. Gegenteil: autoritär. Optimal für R3-MA (hohe Kompetenz, schwankende Motivation)."},

  {id:"F03",k:"Führung",s:"leicht",q:"Was beschreibt der autoritäre Führungsstil?",
   a:["FK entscheidet allein und gibt klare Anweisungen.","MA gestalten Prozesse aktiv mit.","Informationen werden selektiv weitergegeben.","Disziplin und enge Kontrolle stehen im Vordergrund."],
   r:[0,2,3],e:"Autoritär: FK-Entscheidung, selektive Info, Kontrolle. Sinnvoll bei R1-MA (Neueinsteiger) oder in Krisensituationen — nicht als Dauerstil."},

  {id:"F04",k:"Führung",s:"mittel",q:"Was ist das Leader-Leader-Modell nach David Marquet?",
   a:["FK gibt Kontrolle ab und schafft Führung auf allen Ebenen (Intent-Based Leadership).","MA werden befähigt, eigene Entscheidungen zu treffen.","Kompetenz und Klarheit sind Voraussetzungen für Delegation.","Zentralisierung aller Entscheidungen beim Top-Management."],
   r:[0,1,2],e:"Marquet ('Turn the Ship Around!'): Statt Leader-Follower → Leader-Leader. MA sagen 'Ich beabsichtige…' statt zu warten. Voraussetzung: Kompetenz + Klarheit (Ziele/Werte)."},

  {id:"F05",k:"Führung",s:"mittel",q:"Was sind Merkmale transformationaler Führung?",
   a:["FK inspiriert durch Vision und persönliche Vorbildfunktion.","MA werden intrinsisch motiviert (über reine Aufgabenerfüllung hinaus).","Fokus liegt auf kurzfristiger Aufgabenerfüllung und Kontrolle.","Individuelle Förderung und Entwicklung jedes MA."],
   r:[0,1,3],e:"Bass/Burns 4 I's: Idealisierter Einfluss (Charisma), Inspirierende Motivation (Vision), Intellektuelle Stimulierung, Individuelle Wertschätzung. Gegenteil: transaktionale Führung (Belohnung/Bestrafung)."},

  {id:"F06",k:"Führung",s:"mittel",q:"Was beschreibt psychologische Sicherheit nach Amy Edmondson?",
   a:["Teammitglieder können Fehler, Ideen und Bedenken ohne Angst vor Konsequenzen äußern.","Psychologische Sicherheit bedeutet: keine Konflikte im Team.","Voraussetzung für Innovation, Lernbereitschaft und Hochleistung.","FK schafft sie durch Offenheit und keine Schuldzuweisungen bei Fehlern."],
   r:[0,2,3],e:"Edmondson/Google Project Aristotle: Wichtigster Faktor für Teamleistung. FK: Fehler als Lernchance behandeln, Meinungen einfordern, keine Bloßstellung. ≠ Komfort oder Konfliktfreiheit."},

  {id:"F07",k:"Führung",s:"mittel",q:"Was beschreibt das Johari-Fenster?",
   a:["4 Felder: öffentlich bekannt, blinder Fleck, privat/verborgen, unbewusst.","Selbstbild und Fremdbild können erheblich voneinander abweichen.","Feedback von anderen verkleinert den blinden Fleck.","Das Johari-Fenster ist ein reines Konfliktlösungs-Tool."],
   r:[0,1,2],e:"Luft/Ingham: Öffentlich | Blinder Fleck (andere kennen, ich nicht) | Privat (ich kenne, andere nicht) | Unbewusst. Feedback → Blinder Fleck kleiner. Selbstoffenbarung → Privater Bereich kleiner."},

  {id:"F08",k:"Führung",s:"leicht",q:"Was sind SMART-Ziele?",
   a:["Spezifisch: klar und eindeutig formuliert, kein Interpretationsspielraum.","Messbar: Fortschritt und Zielerreichung sind überprüfbar.","Attraktiv/Achievable: für den MA bedeutsam und erreichbar.","Realistisch und Terminiert: erreichbar mit konkretem Zeitrahmen."],
   r:[0,1,2,3],e:"SMART = Spezifisch, Messbar, Attraktiv, Realistisch, Terminiert. Alle 5 Kriterien müssen erfüllt sein. Ziele ohne Termin sind Wünsche. OEE-Ziel mit Datum = SMART."},

  {id:"F09",k:"Führung",s:"schwer",q:"Was beschreibt Kotter's 8-Stufen-Modell des Change Managements?",
   a:["Dringlichkeit erzeugen und eine starke Führungskoalition aufbauen.","Eine klare Vision entwickeln und sie konsequent kommunizieren.","Kurzfristige Erfolge (Quick Wins) sichtbar machen.","Veränderung dauerhaft in der Unternehmenskultur verankern."],
   r:[0,1,2,3],e:"Kotter 8 Stufen: 1)Dringlichkeit 2)Koalition 3)Vision 4)Kommunikation 5)Hindernisse 6)Quick Wins 7)Konsolidieren 8)Verankern. Häufigster Fehler: Stufe 1 überspringen."},

  {id:"F10",k:"Führung",s:"schwer",q:"Was beschreibt das 3-Phasen-Modell nach Lewin?",
   a:["Auftauen (Unfreeze): Ist-Situation hinterfragen, Veränderungsdruck erzeugen.","Verändern (Change): neue Verhaltensweisen einüben, MA einbeziehen.","Einfrieren (Refreeze): neue Strukturen stabilisieren, Prozesse sichern.","Die drei Phasen können in beliebiger Reihenfolge durchlaufen werden."],
   r:[0,1,2],e:"Lewin: Unfreeze → Change → Refreeze. Reihenfolge ist zwingend. Häufiger Fehler: Einfrieren vergessen → Rückfall ins alte Verhalten. Neue KVP-Methode erst nach 'Einfrieren' stabil."},

  {id:"F11",k:"Führung",s:"leicht",q:"Was sind Aufgaben der Führungskraft im Change Management?",
   a:["Veränderungen klar kommunizieren und verständlich begründen.","Widerstände ernst nehmen und aktiv bearbeiten statt ignorieren.","MA in Veränderungsprozesse einbeziehen und Partizipation ermöglichen.","Veränderungen geheim halten bis zur vollständigen Implementierung."],
   r:[0,1,2],e:"FK im Change: Kommunizieren (Warum?), Widerstand als Signal (nicht bekämpfen), MA einbeziehen (20-60-20-Regel). Geheimhaltung zerstört Vertrauen."},

  {id:"F12",k:"Führung",s:"mittel",q:"Was beschreibt die 20-60-20-Regel bei Veränderungen?",
   a:["~20% Bewahrer: Widerstand, Status quo verteidigen.","~60% Unentschlossene: Abwarten, beobachten, dann folgen.","~20% Befürworter: Neugier, Chancen sehen, mitziehen.","Die Mehrheit begrüßt Veränderungen erfahrungsgemäß von Anfang an."],
   r:[0,1,2],e:"Strategie: Befürworter (20%) aktivieren, Unentschlossene (60%) gewinnen — nicht auf Bewahrer fokussieren. Im Shopfloor: neue Maschinenbedienung = gleiche Verteilung."},

  {id:"F13",k:"Führung",s:"mittel",q:"Was kennzeichnet gute Feedbackkultur?",
   a:["Feedback ist konkret, zeitnah und verhaltensorientiert (nicht persönlichkeitsbezogen).","Positives Feedback wird regelmäßig und spezifisch gegeben.","Feedback ist eine Einbahnstraße ausschließlich von oben nach unten.","Kritisches Feedback wird unter vier Augen und respektvoll übermittelt."],
   r:[0,1,3],e:"Gute Feedbackkultur: konkret ('Du hast X getan' ≠ 'Du bist X'), zeitnah (max. 48h), bidirektional, 4-Augen bei Kritik. SBI-Modell: Situation → Behavior → Impact."},

  {id:"F14",k:"Führung",s:"leicht",q:"Was ist das Ziel von Delegation?",
   a:["Aufgaben, Kompetenzen UND Verantwortung gemeinsam übertragen.","MA entlasten, entwickeln und Eigenverantwortung stärken.","Die FK behält bei echter Delegation alle Entscheidungsrechte.","Delegation schafft FK-Kapazität für strategische Führungsaufgaben."],
   r:[0,1,3],e:"Delegation = Aufgabe + Kompetenz + Verantwortung (alle drei!). Ohne Kompetenzübertragung = nur Aufgaben = Frustration. Marquet-Prinzip: Intent-Based = höchste Delegationsstufe."},

  {id:"F15",k:"Führung",s:"schwer",q:"Was sind Burnout-Warnsignale bei Mitarbeitenden?",
   a:["Chronische Erschöpfung trotz ausreichend Erholung.","Zunehmender Zynismus und emotionale Distanzierung von der Arbeit.","Nachlassende Leistungsfähigkeit und steigende Fehlerrate.","Plötzlich gesteigertes Engagement als mögliches Frühzeichen."],
   r:[0,1,2],e:"Freudenberger-Phasen: Enthusiasmus→Stagnation→Frustration→Apathie. FK muss spätestens bei Phase 2 (Zynismus, Distanz) eingreifen. Gesteigerte Produktivität = Phase 1 (Überengagement) = auch Warnsignal."},

  {id:"F16",k:"Führung",s:"mittel",q:"Was beschreibt MbWA (Management by Walking Around)?",
   a:["FK ist regelmäßig im direkten Arbeitsprozess präsent und ansprechbar.","Informeller Informationsaustausch und frühzeitige Problemerkennung.","Vertrauensaufbau durch sichtbare, physische Präsenz der FK.","MbWA ersetzt formale Mitarbeitergespräche vollständig."],
   r:[0,1,2],e:"MbWA (Peters/Waterman): FK geht zu den MA. Früherkennung, Vertrauen, Realitätsnähe. Ergänzt (ersetzt nicht!) formale Gespräche. Im Shopfloor = Gemba Walk."},

  {id:"F17",k:"Führung",s:"mittel",q:"Was unterscheidet fachliche von disziplinarischer Führung?",
   a:["Fachliche Führung: Steuerung der inhaltlichen Aufgaben und Methoden.","Disziplinarische Führung: Weisungsbefugnis in personellen Angelegenheiten (Urlaub, Abmahnung).","Beide Rollen können bei einer FK liegen oder aufgeteilt sein.","In Matrixorganisationen sind fachliche und disziplinarische Führung immer identisch."],
   r:[0,1,2],e:"Fachlich = WAS und WIE der Arbeit (auch ohne Personalverantwortung). Disziplinarisch = Personalverantwortung (Einstellung, Abmahnung, Kündigung). In Matrix-Orgs häufig getrennt."},

  {id:"F18",k:"Führung",s:"schwer",q:"Was beschreibt Hochleistungskultur in Organisationen?",
   a:["Klare, hohe Standards kombiniert mit echter Wertschätzung.","Fehlerkultur: Fehler als Lernchance nutzen, nicht bestrafen.","Ausschließlich externer Leistungsdruck erzeugt dauerhaft Hochleistung.","Intrinsische Motivation durch sinnstiftende Arbeit und Autonomie."],
   r:[0,1,3],e:"Hochleistungskultur: Hohe Standards + psychologische Sicherheit (kein Widerspruch!). Externe Drucksteuerung → kurzfristig Leistung, langfristig Burnout. SDT: Autonomie, Kompetenz, Eingebundenheit."},

  // ── KOMMUNIKATION (12) ────────────────────────────────────────────────────
  {id:"K01",k:"Kommunikation",s:"leicht",q:"Was besagen die Kommunikationsaxiome nach Watzlawick?",
   a:["Man kann nicht NICHT kommunizieren — auch Schweigen ist Kommunikation.","Kommunikation hat immer einen Inhalts- UND einen Beziehungsaspekt.","Kommunikation ist symmetrisch oder komplementär.","Kommunikation findet ausschließlich verbal statt."],
   r:[0,1,2],e:"Watzlawick 5 Axiome: 1)Nicht-Kommunikation unmöglich 2)Inhalts+Beziehungsaspekt 3)Interpunktion 4)Digital+analog 5)Symmetrisch/komplementär. Axiom 4 widerlegt D: auch nonverbal ist Kommunikation."},

  {id:"K02",k:"Kommunikation",s:"leicht",q:"Was beschreibt das 4-Ohren-Modell nach Schulz von Thun?",
   a:["Jede Nachricht hat vier Seiten: Sachinhalt, Selbstoffenbarung, Beziehung, Appell.","Sender sendet immer alle vier Seiten gleichzeitig — bewusst oder unbewusst.","Missverständnisse entstehen, wenn Sender und Empfänger verschiedene Seiten betonen.","Der Empfänger hört ausschließlich den Sachinhalt."],
   r:[0,1,2],e:"Schulz von Thun: 'Der Tank ist leer': Sach=kein Benzin, Selbst=ich sah's nicht, Beziehung=du fährst planlos, Appell=tank bitte. Empfänger wählt unbewusst das 'Ohr'."},

  {id:"K03",k:"Kommunikation",s:"mittel",q:"Was beschreibt Gewaltfreie Kommunikation (GFK) nach Rosenberg?",
   a:["4 Schritte: Beobachtung (ohne Bewertung), Gefühl, Bedürfnis, Bitte.","Trennung von Beobachtung und Bewertung ist ein Kernprinzip.","GFK zielt auf echte Verbindung und gegenseitiges Verständnis.","GFK-Bitten sind Forderungen und müssen erfüllt werden."],
   r:[0,1,2],e:"GFK: Beobachtung ('Du warst 3× zu spät') ≠ Bewertung ('Du bist unzuverlässig'). Gefühl → Bedürfnis → Bitte (≠ Forderung: Nein muss akzeptiert werden)."},

  {id:"K04",k:"Kommunikation",s:"leicht",q:"Was kennzeichnet eine wirksame Ich-Botschaft?",
   a:["Beschreibt eigene Wahrnehmung, Gefühl und Bedürfnis ohne Schuldzuweisung.","Vermeidet Du-Vorwürfe, die Abwehr beim Gegenüber auslösen.","Fördert Verständnis und öffnet einen konstruktiven Dialog.","Ich-Botschaften und Du-Vorwürfe haben die gleiche Wirkung."],
   r:[0,1,2],e:"Ich-Botschaft: 'Wenn ich sehe, dass X, fühle ich Y, weil Z wichtig ist.' Du-Vorwurf: 'Du machst immer…' → löst Verteidigung aus. Ich-Botschaft → öffnet Gespräch."},

  {id:"K05",k:"Kommunikation",s:"mittel",q:"Was ist das SBI-Modell für konstruktives Feedback?",
   a:["S = Situation: konkrete Situation beschreiben (wann, wo).","B = Behavior: beobachtetes Verhalten benennen (nicht interpretieren).","I = Impact: die konkrete Wirkung/Auswirkung schildern.","SBI = Subjektive Bewertung und Interpretation."],
   r:[0,1,2],e:"SBI (Center for Creative Leadership): Situation + Behavior + Impact. Kein Angriff auf Persönlichkeit. Beispiel: 'In der Besprechung gestern hast du 2 Kollegen unterbrochen → ihre Ideen wurden nicht gehört.'"},

  {id:"K06",k:"Kommunikation",s:"leicht",q:"Was kennzeichnet aktives Zuhören?",
   a:["Paraphrasieren: das Gehörte in eigenen Worten wiedergeben.","Nachfragen bei Unklarheiten ohne zu unterbrechen.","Nonverbale Signale des Gesprächspartners wahrnehmen.","Aktives Zuhören bedeutet: sofort Lösungsvorschläge machen."],
   r:[0,1,2],e:"Aktives Zuhören: Paraphrasieren ('Du meinst also…'), offene Fragen, nonverbale Signale (Augenkontakt, Nicken). Lösung erst NACH vollständigem Verstehen."},

  {id:"K07",k:"Kommunikation",s:"mittel",q:"Was beschreibt nonverbale Kommunikation?",
   a:["Körperhaltung, Gestik, Mimik und Blickkontakt sind Hauptelemente.","Macht ca. 55–65% der Kommunikationswirkung aus (Mehrabian).","Widerspruch zwischen verbal und nonverbal erzeugt Misstrauen.","Nonverbale Kommunikation ist stets bewusst kontrollierbar."],
   r:[0,1,2],e:"Mehrabian: 55% Körpersprache, 38% Stimme, 7% Worte (in emotionalen Situationen). Nonverbal ist oft unbewusst und schwer kontrollierbar — Kongruenz ist deshalb wichtig."},

  {id:"K08",k:"Kommunikation",s:"mittel",q:"Was sind Merkmale eines wirksamen Kritikgesprächs?",
   a:["Unter vier Augen — nie öffentlich vor dem Team.","Zeitnah nach dem Ereignis — nicht Wochen später.","Verhalten ansprechen, nicht Persönlichkeit.","Wertschätzungsrahmen setzen, dann konkretes Verhalten ansprechen."],
   r:[0,1,2,3],e:"Kritikgespräch: 4-Augen, zeitnah (max. 48-72h), verhaltensorientiert, Feedback-Sandwich. Öffentliche Kritik verletzt Würde und löst kollektive Abwehr aus."},

  {id:"K09",k:"Kommunikation",s:"schwer",q:"Was ist ein Elevator Pitch?",
   a:["Kurze, prägnante Selbst- oder Ideenpräsentation in ca. 30–90 Sekunden.","Kernelemente: Problem/Situation, Lösung/Wert, Handlungsaufforderung.","Soll Interesse wecken und zu weiterem Austausch einladen.","Je länger, desto überzeugender."],
   r:[0,1,2],e:"Elevator Pitch: Hook → Problem → Lösung → Alleinstellungsmerkmal → Call to Action. Max. 90 Sekunden. 'Erzählen Sie von sich' im Interview = Elevator Pitch-Moment."},

  {id:"K10",k:"Kommunikation",s:"mittel",q:"Was unterscheidet symmetrische von komplementärer Kommunikation?",
   a:["Symmetrisch: beide Partner verhalten sich spiegelbildlich ähnlich (Augenhöhe).","Komplementär: unterschiedliche, sich ergänzende Positionen (z.B. FK–MA).","Symmetrische Eskalation kann zu Konflikten führen (Rüstungsspirale).","Beide Formen sind immer dysfunktional."],
   r:[0,1,2],e:"Watzlawick Axiom 5: Symmetrisch = Gleichheit, Komplementär = Unterschiedlichkeit. Beide können funktional sein. Probleme: Symmetrisch → 'Wettstreit', Komplementär → Abhängigkeit."},

  {id:"K11",k:"Kommunikation",s:"leicht",q:"Was sind Ursachen für Kommunikationskonflikte?",
   a:["Unterschiedliche Bedeutung von Wörtern und Fachbegriffen.","Nonverbale Widersprüche und missverstandene Körpersprache.","Unterschiedliche Kommunikationsstile und kulturelle Hintergründe.","Zu viel direkte, offene Kommunikation führt zu Konflikten."],
   r:[0,1,2],e:"Kommunikationskonflikte: semantische Unterschiede, nonverbale Widersprüche, Stildifferenzen (direkt vs. indirekt), kulturelle Unterschiede. Direkte Kommunikation reduziert Konflikte!"},

  {id:"K12",k:"Kommunikation",s:"schwer",q:"Was beschreibt das AINAM-Modell für Präsentationen?",
   a:["Attention: Aufmerksamkeit durch starken Einstieg wecken.","Interest: Interesse durch relevante Informationen erzeugen.","Need: Bedarf oder Problem klar benennen.","Action/Message: klare Botschaft und Handlungsaufforderung am Ende."],
   r:[0,1,2,3],e:"AINAM: Strukturierter Aufbau für Pitches und Präsentationen. Attention = Hook. Interest = Relevanz. Need = Problem. Action = Was soll passieren? Message = Kernaussage."},

  // ── MOTIVATION (10) ───────────────────────────────────────────────────────
  {id:"M01",k:"Motivation",s:"leicht",q:"Was unterscheidet Hygienefaktoren von Motivatoren nach Herzberg?",
   a:["Hygienefaktoren (Gehalt, Arbeitsbedingungen) vermeiden Unzufriedenheit, erzeugen aber keine Motivation.","Motivatoren (Anerkennung, Verantwortung, Wachstum) erzeugen aktive Motivation.","Beide Faktoren haben die gleiche Wirkung auf Leistung.","Gehalt ist nach Herzberg der stärkste Motivator."],
   r:[0,1],e:"Herzberg Zwei-Faktoren: Hygienefaktoren (Kontext) → Fehlen = Unzufriedenheit, Vorhandensein = kein Schmerz aber keine Freude. Motivatoren (Inhalt: Leistung, Anerkennung, Verantwortung) → aktive Motivation."},

  {id:"M02",k:"Motivation",s:"leicht",q:"Welche Faktoren sind nach Herzberg Hygienefaktoren (keine Motivatoren)?",
   a:["Gehalt und finanzielle Vergütung.","Arbeitsbedingungen und Arbeitsplatzsicherheit.","Unternehmenspolitik und Führungsstil des Vorgesetzten.","Leistungserfolge und persönliches Wachstum."],
   r:[0,1,2],e:"Hygienefaktoren: Gehalt, Arbeitsbedingungen, Sicherheit, Unternehmenspolitik, Führungsstil, Beziehungen. Leistungserfolg und Wachstum = Motivatoren. Prüfungsklassiker: Gehalt ≠ Motivator!"},

  {id:"M03",k:"Motivation",s:"leicht",q:"Was beschreibt die Bedürfnispyramide nach Maslow?",
   a:["Fünf hierarchische Stufen: Physiologisch, Sicherheit, Sozial, Wertschätzung, Selbstverwirklichung.","Befriedigte Bedürfnisse verlieren ihre Wirkung — außer Selbstverwirklichung.","Unterste Stufe muss weitgehend befriedigt sein, bevor nächste Stufe wirkt.","Selbstverwirklichung ist vollständig erreichbar und verliert dann ihre Wirkung."],
   r:[0,1,2],e:"Maslow: Hierarchisch, Sättigungseffekt (außer Selbstverwirklichung). Kritik: empirisch nicht belegt. Herzberg ↔ Maslow: Physiologisch+Sicherheit = Hygienefaktoren."},

  {id:"M04",k:"Motivation",s:"mittel",q:"Was beschreibt die Equity Theory (Gerechtigkeitstheorie) nach Adams?",
   a:["Menschen vergleichen ihr Input/Output-Verhältnis mit anderen.","Wahrgenommene Ungerechtigkeit → Spannungszustand → Verhaltensänderung.","Unterbezahlung demotiviert, Überbezahlung kann Schuldgefühle erzeugen.","Das absolute Gehalt ist entscheidend — Vergleiche spielen keine Rolle."],
   r:[0,1,2],e:"Adams: Input (Arbeit, Zeit) / Output (Gehalt, Anerkennung) vs. Referenzpersonen. Ungleichgewicht → Ausgleich durch: Leistung reduzieren, mehr fordern, Referenz ändern, kündigen."},

  {id:"M05",k:"Motivation",s:"mittel",q:"Was sind die drei Grundbedürfnisse der Selbstbestimmungstheorie (SDT) nach Deci & Ryan?",
   a:["Autonomie: das Gefühl, Handlungen selbst zu bestimmen.","Kompetenz: das Erleben von Wirksamkeit und Meisterschaft.","Eingebundenheit: das Gefühl, zu einer Gemeinschaft zu gehören.","Materielle Belohnung ist der wichtigste Faktor für intrinsische Motivation."],
   r:[0,1,2],e:"SDT: Autonomie + Kompetenz + Eingebundenheit = intrinsische Motivation. Micro-Management untergräbt Autonomie. FK kann alle 3 fördern: Handlungsspielräume, Lernziele, Teamkultur."},

  {id:"M06",k:"Motivation",s:"schwer",q:"Was beschreibt Flow nach Csikszentmihalyi?",
   a:["Zustand völliger Aufmerksamkeit und Vertiefung in eine Tätigkeit.","Flow entsteht wenn Anforderung und Fähigkeit im Gleichgewicht sind.","Flow geht mit Zeitvergessenheit und intrinsischer Befriedigung einher.","Flow tritt nur bei einfachen, monotonen Routineaufgaben auf."],
   r:[0,1,2],e:"Flow: Anforderung zu hoch → Angst. Zu niedrig → Langeweile. Gleichgewicht → Flow. FK-Aufgabe: Aufgaben im Flow-Kanal halten (leicht über aktuellem Können). Monotone Arbeit verhindert Flow."},

  {id:"M07",k:"Motivation",s:"mittel",q:"Was unterscheidet intrinsische von extrinsischer Motivation?",
   a:["Intrinsisch: Motivation kommt aus dem Inneren (Interesse, Sinn, Freude).","Extrinsisch: Motivation durch äußere Anreize (Gehalt, Prämie, Status).","Übermäßige extrinsische Belohnung kann intrinsische Motivation untergraben.","Intrinsische Motivation ist immer stärker als extrinsische."],
   r:[0,1,2],e:"Korrumpierungseffekt (Deci): Wenn intrinsisch motivierte Tätigkeit extern belohnt wird, sinkt intrinsische Motivation. Beispiel: Kind malt gerne → bekommt Geld → malt nicht mehr ohne Geld."},

  {id:"M08",k:"Motivation",s:"schwer",q:"Was beschreibt die X-Y-Theorie nach McGregor?",
   a:["Theorie X: MA sind grundsätzlich träge, vermeiden Verantwortung, müssen kontrolliert werden.","Theorie Y: MA sind motiviert, suchen Verantwortung, wollen Ziele erreichen.","Beide Theorien sind bewiesene Tatsachen über menschliche Natur.","Theorie Y-Führung fördert Eigenverantwortung und intrinsische Motivation."],
   r:[0,1,3],e:"McGregor: Beide sind Annahmen/Menschenbilder, keine Fakten. Theorie X → autoritärer Stil. Selbsterfüllende Prophezeiung: X-Annahme → X-Verhalten beim MA."},

  {id:"M09",k:"Motivation",s:"leicht",q:"Was beschreibt Sinnhaftigkeit (Purpose) als Motivationsfaktor?",
   a:["MA sind langfristig motivierter, wenn sie den Sinn ihrer Arbeit verstehen.","Purpose verbindet individuelle Aufgaben mit dem größeren Organisationsziel.","FK kommunizieren aktiv das 'Warum' von Aufgaben.","Gehalt ist empirisch stets wichtiger als Sinnhaftigkeit."],
   r:[0,1,2],e:"Purpose: Stärkster Langzeit-Motivator (Seligman PERMA, Frankl, Sinek Golden Circle). FK: Warum → Wie → Was. 'Warum' motiviert, 'Was' nicht. Qualitätsziel mit Kundenbezug = mehr Sinn."},

  {id:"M10",k:"Motivation",s:"mittel",q:"Was ist Prokrastination und welche Maßnahmen helfen?",
   a:["Aufschieben von Aufgaben trotz negativer Konsequenzen.","Kleinstschritte: Aufgabe in sehr kleine Einheiten zerlegen.","Klare Prioritäten und Deadlines reduzieren Prokrastination.","Prokrastination ist immer ein Zeichen von Faulheit."],
   r:[0,1,2],e:"Prokrastination ≠ Faulheit. Ursachen: Überforderung, Angst vor Versagen, Perfektionismus, Unklarheit. Gegenmittel: Aufgabe konkretisieren, ersten Schritt winzig machen, Ablenkungen eliminieren."},

  // ── KONFLIKT (10) ─────────────────────────────────────────────────────────
  {id:"KO01",k:"Konflikt",s:"leicht",q:"Was sind die drei Eskalationsphasen nach Glasl?",
   a:["Phase 1 (Stufen 1–3): Win-Win möglich, Sachebene, intern lösbar.","Phase 2 (Stufen 4–6): Win-Lose, Beziehungsebene, externer Mediator empfohlen.","Phase 3 (Stufen 7–9): Lose-Lose, Zerstörungsebene, externe Machtinstanz nötig.","Alle Stufen können durch die FK allein intern gelöst werden."],
   r:[0,1,2],e:"Glasl 9 Stufen in 3 Phasen: 1-3 → Win-Win. 4-6 → Win-Lose. 7-9 → Lose-Lose. Ab Stufe 4: Mediator nötig. FK kann bis Stufe 3 moderieren."},

  {id:"KO02",k:"Konflikt",s:"mittel",q:"Was sind die vier Grundprinzipien des Harvard-Modells (Fisher/Ury)?",
   a:["Menschen und Probleme trennen: sachlich verhandeln, Beziehung schonen.","Interessen statt Positionen verhandeln: 'Warum' statt 'Was'.","Optionen zum beiderseitigen Vorteil entwickeln.","Objektive Beurteilungskriterien als Maßstab verwenden."],
   r:[0,1,2,3],e:"Harvard: Position = was jemand fordert. Interesse = warum. Beispiel: Beide wollen die Orange. Einer braucht Saft, einer die Schale → beide können gewinnen (Win-Win)."},

  {id:"KO03",k:"Konflikt",s:"leicht",q:"Was unterscheidet Konflikte von Mobbing nach Leymann?",
   a:["Mobbing: systematisch, wiederholt (mind. 1×/Woche), über längere Zeit (mind. 6 Monate).","Konflikt: kann einmalig oder situativ sein, kein systematisches Muster.","Mobbing beinhaltet immer ein Machtgefälle zwischen Täter und Opfer.","Mobbing und Konflikt sind rechtlich identisch zu behandeln."],
   r:[0,1,2],e:"Leymann-Definition: Mobbing = Systematik + Häufigkeit (≥1×/Woche) + Dauer (≥6 Monate) + Machtgefälle. FK-Pflicht: bei Mobbingverdacht sofort handeln (Dokumentation, HR)."},

  {id:"KO04",k:"Konflikt",s:"mittel",q:"Was kennzeichnet Mediation?",
   a:["Freiwilliges, strukturiertes Verfahren mit allparteilichem Dritten.","Der Mediator moderiert den Prozess, entscheidet aber NICHT für die Parteien.","Parteien erarbeiten gemeinsam eine selbstverantwortete Lösung.","Mediation ist nur bei gerichtlichen Streitigkeiten anwendbar."],
   r:[0,1,2],e:"Mediation: Freiwilligkeit + allparteilicher Mediator + Selbstverantwortung. Nachhaltiger als Urteil (eigene Lösung = mehr Commitment). Anwendbar in Betrieb, Familie, Nachbarschaft."},

  {id:"KO05",k:"Konflikt",s:"mittel",q:"Was sind Merkmale eines konstruktiven Konfliktgesprächs?",
   a:["Ich-Botschaften statt Du-Vorwürfe verwenden.","Konkrete Verhaltensweisen ansprechen, nicht Persönlichkeit.","Alle alten Konflikte sammeln und gemeinsam abarbeiten.","Gemeinsam nach Lösungen suchen statt Schuldige zu finden."],
   r:[0,1,3],e:"Konstruktives Gespräch: Ich-Botschaften, verhaltensorientiert, lösungsfokussiert. Fehler: Altlasten auflisten ('immer', 'nie'). Ein Thema pro Gespräch."},

  {id:"KO06",k:"Konflikt",s:"leicht",q:"Was sind typische Konfliktursachen in Organisationen?",
   a:["Kompetenzkonflikte: Unklarheit darüber, wer was entscheiden darf.","Sachkonflikte: unterschiedlicher Wissensstand oder Informationen.","Beziehungskonflikte: persönliche Abneigungen oder Vertrauensbrüche.","Konflikte sind immer auf persönliche Antipathie zurückzuführen."],
   r:[0,1,2],e:"Konfliktarten: Sach-, Werte-, Beziehungs-, Interessen-, Struktur-, Verteilungskonflikte. Nur ~20% sind 'echte' Beziehungskonflikte — die meisten sind Struktur- oder Sachkonflikte."},

  {id:"KO07",k:"Konflikt",s:"mittel",q:"Was beschreibt das Kaizen-Prinzip?",
   a:["KAI = Veränderung, ZEN = gut → permanenter Verbesserungsprozess.","Kaizen umfasst ALLE Unternehmensbereiche, nicht nur Produktion.","Qualität von Anfang an (Fehlervermeidung statt -korrektur) ist Kernziel.","Kaizen bezeichnet ausschließlich radikale Innovationssprünge."],
   r:[0,1,2],e:"Kaizen: Kein einmaliges Projekt, sondern Haltung. Gegenteil: Kaikaku = radikaler Wandel. Im Shopfloor = KVP. Jeder MA = Verbesserungssucher."},

  {id:"KO08",k:"Konflikt",s:"schwer",q:"Was sind wirksame Deeskalationsmaßnahmen?",
   a:["Pause einlegen und emotionalen Abstand gewinnen.","Gemeinsamkeiten betonen statt Unterschiede verstärken.","Neutral und ohne Verallgemeinerungen ('immer', 'nie') formulieren.","Vorwürfe und Schuldzuweisungen systematisch dokumentieren."],
   r:[0,1,2],e:"Deeskalation: Pause (Emotionen brauchen Zeit), Gemeinsamkeiten suchen ('Wir wollen beide, dass das Projekt gelingt'), neutrale Sprache ('Ich beobachte…'). Vorwürfe dokumentieren = Eskalation."},

  {id:"KO09",k:"Konflikt",s:"mittel",q:"Was ist der Unterschied zwischen Position und Interesse?",
   a:["Position = was jemand fordert (die sichtbare Oberfläche).","Interesse = warum jemand etwas fordert (tiefer liegende Motivation).","Das Harvard-Modell empfiehlt: Interessen verhandeln, nicht Positionen.","Positionen und Interessen sind in Verhandlungen identisch."],
   r:[0,1,2],e:"Orange-Beispiel: Beide wollen die ganze Orange (Position). Einer braucht Saft, der andere die Schale (Interessen). Wenn man Interessen kennt → Win-Win möglich."},

  {id:"KO10",k:"Konflikt",s:"leicht",q:"Was sind Anzeichen eines latenten (verdeckten) Konflikts?",
   a:["Zurückgehaltene Meinungen und nur oberflächliche Zustimmung.","Passiv-aggressives Verhalten und unterschwellige Sticheleien.","Sinkendes Engagement und innere Kündigung.","Offene, laute und täglich sichtbare Auseinandersetzungen."],
   r:[0,1,2],e:"Latenter Konflikt: 'false consensus' (alle nicken, keiner meint es ernst), passiv-aggressiv, Rückzug. Offene Konflikte sind leichter lösbar als latente."},

  // ── PERSONAL (10) ─────────────────────────────────────────────────────────
  {id:"P01",k:"Personal",s:"leicht",q:"Was umfasst der vollständige Personalmanagementprozess?",
   a:["Personalplanung, Beschaffung und Auswahl.","Einarbeitung (Onboarding), Entwicklung und Beurteilung.","Vergütung, Verwaltung und Freisetzung/Kündigung.","Personalmanagement ist ausschließlich Aufgabe der HR-Abteilung."],
   r:[0,1,2],e:"PM-Kreislauf: Planung → Beschaffung → Auswahl → Einarbeitung → Entwicklung → Beurteilung → Vergütung → Freisetzung. FK ist in fast allen Phasen beteiligt, HR ist Unterstützung."},

  {id:"P02",k:"Personal",s:"mittel",q:"Was sind Inhalte einer vollständigen Stellenbeschreibung?",
   a:["Stellenbezeichnung und Einordnung in die Organisationsstruktur.","Aufgaben, Kompetenzen (Befugnisse) und Verantwortung.","Fachliches und persönliches Anforderungsprofil.","Persönliche Meinung des Vorgesetzten über den idealen Kandidaten."],
   r:[0,1,2],e:"Stellenbeschreibung: Was (Aufgaben) + Wie (Kompetenzen) + Wofür (Verantwortung) + Womit (Anforderungen). AGG beachten: keine Alters-, Geschlechts-, Herkunftsmerkmale."},

  {id:"P03",k:"Personal",s:"mittel",q:"Was sind Beurteilungsfehler in der Personalbeurteilung?",
   a:["Halo-Effekt: eine herausragende Eigenschaft überstrahlt alle anderen.","Tendenz zur Mitte: alle MA werden durchschnittlich bewertet.","Recency-Effekt: nur kürzlich Erlebtes wird für die Beurteilung genutzt.","Objektive Beurteilung ist bei menschlichen Beurteilern automatisch gegeben."],
   r:[0,1,2],e:"Beurteilungsfehler: Halo, Milde/Strenge, Tendenz zur Mitte, Recency (jüngst Erlebtes), Primacy (erster Eindruck), Ähnlichkeit (wer ähnlich ist, wird besser bewertet). Gegenmittel: strukturierte Bögen."},

  {id:"P04",k:"Personal",s:"leicht",q:"Was ist Onboarding und warum ist es wichtig?",
   a:["Systematische Einarbeitung und Integration neuer Mitarbeitender.","Verkürzt die Zeit bis zur vollen Leistungsfähigkeit (Time-to-Productivity).","Reduziert Fluktuation in der Probezeit und erhöht Commitment.","Onboarding ist abgeschlossen, sobald der erste Arbeitstag beendet ist."],
   r:[0,1,2],e:"Gutes Onboarding: Preboarding, strukturierter Tag 1, erste 90 Tage geplant. Kosten einer Neubesetzung: 50–150% des Jahresgehalts. Onboarding endet frühestens nach 6–12 Monaten."},

  {id:"P05",k:"Personal",s:"mittel",q:"Was kennzeichnet ein strukturiertes Auswahlinterview?",
   a:["Einheitliche Fragen für alle Kandidaten sichern Vergleichbarkeit.","Verhaltensbasierte Fragen zeigen vergangenes Verhalten (bester Prädiktor).","Bauchgefühl des Interviewers ist die zuverlässigste Methode.","Strukturierte Interviews erhöhen Objektivität und rechtliche Sicherheit."],
   r:[0,1,3],e:"Strukturiertes Interview: Gleiche Fragen (Vergleichbarkeit), verhaltensbasiert (Vergangenheit = bester Prädiktor für Zukunft), Bewertungsbogen. Bauchgefühl = Sympathiefehler = rechtlich problematisch."},

  {id:"P06",k:"Personal",s:"mittel",q:"Was beschreibt Personalentwicklung als Führungsaufgabe?",
   a:["Training on the Job: Lernen direkt im Arbeitsprozess (Rotation, Unterweisung).","Coaching und Mentoring: individuelle Begleitung und Förderung.","Externe Seminare ergänzen die interne Entwicklung.","Personalentwicklung ist ausschließlich für Führungskräfte relevant."],
   r:[0,1,2],e:"PE: on the job (Training, Rotation) = günstig, transfersicher. Near the job (Qualitätszirkel, KVP). Off the job (Seminare). FK-Aufgabe: Entwicklungsgespräch, Lernziele, Transfersicherung."},

  {id:"P07",k:"Personal",s:"leicht",q:"Was sind Ziele des Mitarbeitergesprächs (MAG)?",
   a:["Regelmäßiger, strukturierter Austausch zwischen FK und MA.","Ziele vereinbaren, bewerten und Abweichungen besprechen.","Entwicklungsperspektiven und Förderbedarf ermitteln.","Im MAG spricht ausschließlich die FK, der MA hört zu."],
   r:[0,1,2],e:"MAG: Rückblick (Zielerreichung) + Vorschau (neue Ziele) + Entwicklung. MA-Anteil sollte 50%+ sein. Jahres-MAG ≠ ersetzt laufendes Feedback. Dokumentation = rechtliche Absicherung."},

  {id:"P08",k:"Personal",s:"schwer",q:"Was beschreibt das Betriebliche Eingliederungsmanagement (BEM)?",
   a:["Gesetzlich verpflichtendes Verfahren nach mehr als 6 Wochen Fehlzeit in 12 Monaten (§167 SGB IX).","Ziel: Arbeitsfähigkeit erhalten, Beschäftigung sichern, Fehlzeiten vorbeugen.","Für den Arbeitnehmer ist die Teilnahme freiwillig.","BEM ist eine reine Kontrollmaßnahme."],
   r:[0,1,2],e:"BEM: Pflicht des AG (ab 6 Wochen in 12 Monaten), freiwillig für AN. Betriebsrat hat Mitbestimmungsrecht. Ablehnung darf keine Nachteile haben. Wichtig: FK-Frühwarnsystem bei häufigen Fehlzeiten."},

  {id:"P09",k:"Personal",s:"mittel",q:"Was sind Maßnahmen zur Mitarbeiterbindung (Retention)?",
   a:["Entwicklungsperspektiven und sichtbare Karrieremöglichkeiten.","Faire Vergütung kombiniert mit echter Wertschätzung.","Sinnstiftung: Arbeit mit Bedeutung und Unternehmenskultur.","Gehalt ist der einzige und entscheidende Bindungsfaktor."],
   r:[0,1,2],e:"Gallup-Studie: Häufigster Kündigungsgrund = schlechte FK, nicht schlechtes Gehalt. Bindungsfaktoren: Entwicklung, Flexibilität, Führung, Kultur, Sinn. Gehalt = Hygienefaktor (Herzberg)."},

  {id:"P10",k:"Personal",s:"mittel",q:"Was ist Employer Branding?",
   a:["Systematischer Aufbau und Pflege einer attraktiven Arbeitgebermarke.","Zielt auf Gewinnung qualifizierter Bewerber und Bindung vorhandener MA.","Authentizität ist entscheidend: gelebte Kultur muss Versprechen entsprechen.","Employer Branding ist ausschließlich externe Werbung für Bewerber."],
   r:[0,1,2],e:"Employer Branding: interne UND externe Dimension. Intern: Kultur leben, MA zu Botschaftern machen. Falsches EB (verspricht mehr als gelebt) = Boomerang: hohe Fluktuation."},

  // ── BGM (10) ──────────────────────────────────────────────────────────────
  {id:"B01",k:"BGM",s:"leicht",q:"Was ist Betriebliches Gesundheitsmanagement (BGM)?",
   a:["Systematischer Ansatz zur Erhaltung und Förderung der MA-Gesundheit.","Maßnahmen auf Verhaltens- UND Verhältnisebene (nicht nur Einzelmaßnahmen).","BGM ist ausschließlich gesetzliche Pflicht ohne wirtschaftlichen Nutzen.","Reduziert nachweislich Fehlzeiten und steigert Produktivität."],
   r:[0,1,3],e:"BGM: Verhaltensebene (Sport, Ernährung) + Verhältnisebene (Ergonomie, Führungskultur). ROI: 1 Euro BGM → 2,70 Euro Einsparung. BGM ≈ TPM für Menschen: präventiv statt reaktiv."},

  {id:"B02",k:"BGM",s:"mittel",q:"Welche Lärmgrenzwerte gelten am Arbeitsplatz?",
   a:["55 dB(A): Richtwert für Tätigkeiten mit hohen Konzentrationsanforderungen.","Ab 80 dB(A): Gehörschutz muss bereitgestellt werden (unterer Auslösewert).","Ab 85 dB(A): Tragen von Gehörschutz ist Pflicht (oberer Auslösewert).","Lärm unter 100 dB(A) ist generell unbedenklich."],
   r:[0,1,2],e:"Lärm-Vibrations-ArbSchV: 80 dB(A) = Bereitstellen (freiwillig). 85 dB(A) = Pflicht. 87 dB(A) = nie überschreiten. Büro: 55 dB(A) Empfehlung. Ab 65 dB(A) = erhöhtes Herzkreislaufrisiko."},

  {id:"B03",k:"BGM",s:"leicht",q:"Was beschreibt Resilienz am Arbeitsplatz?",
   a:["Fähigkeit, mit Belastungen und Rückschlägen umzugehen und sich zu erholen.","Resilienz ist keine angeborene Eigenschaft — sie kann trainiert werden.","FK können Teamresilienz aktiv fördern.","Resiliente MA leiden nie unter Stress oder Erschöpfung."],
   r:[0,1,2],e:"Resilienz (7 Säulen: Emotionsregulation, Optimismus, Kausalanalyse, Empathie, Selbstwirksamkeit, Zielorientierung, Impulskontrolle): Trainierbar durch Achtsamkeit, Netzwerke, Routinen. Resiliente erholen sich SCHNELLER."},

  {id:"B04",k:"BGM",s:"mittel",q:"Was sind die Burnout-Phasen nach Freudenberger/Edelwich & Brodsky?",
   a:["Phase 1: Enthusiasmus und Überengagement — oft starkes Eingangszeichen.","Phase 2: Stagnation, Desillusionierung — erste Warnzeichen für FK.","Phase 3: Frustration, Zynismus und erste psychosomatische Symptome.","Burnout entsteht plötzlich und ohne jede Vorwarnung."],
   r:[0,1,2],e:"Phasen: Enthusiasmus → Stagnation → Frustration → Apathie. FK muss spätestens bei Phase 2 (Zynismus, Distanz) eingreifen. Burnout beginnt oft mit zu viel Engagement (Phase 1) — das Paradoxon."},

  {id:"B05",k:"BGM",s:"mittel",q:"Was ist der Unterschied zwischen Eustress und Distress?",
   a:["Eustress: positiver, leistungssteigernder Stress (Herausforderung, Motivation).","Distress: negativer, krankmachender chronischer Stress (Überforderung, Kontrollverlust).","Eustress fördert Leistungsbereitschaft und kann Flow auslösen.","Beide Stressformen haben identische Auswirkungen."],
   r:[0,1,2],e:"Selye: Stress ist nicht per se negativ. Eustress = Prüfung, sportliche Herausforderung. Distress = chronische Überforderung. Gleicher Stressor kann Eustress oder Distress sein — abhängig von Ressourcen."},

  {id:"B06",k:"BGM",s:"schwer",q:"Was ist Salutogenese nach Aaron Antonovsky?",
   a:["Fragt: Was hält Menschen gesund? (≠ Pathogenese: Was macht krank?).","Kohärenzgefühl = Verstehbarkeit + Handhabbarkeit + Bedeutsamkeit.","Starkes Kohärenzgefühl fördert Gesundheit und Resilienz.","Salutogenese und Pathogenese sind Synonyme."],
   r:[0,1,2],e:"Antonovsky: Kohärenzgefühl: Verstehe ich was passiert? (Verstehbarkeit) Kann ich damit umgehen? (Handhabbarkeit) Hat es Sinn, Energie zu investieren? (Bedeutsamkeit). FK: Sinn kommunizieren = Kohärenz stärken."},

  {id:"B07",k:"BGM",s:"mittel",q:"Was sind Rollen der Führungskraft im BGM?",
   a:["Frühzeitiges Erkennen von Überlastungszeichen bei MA.","Vorbildfunktion: eigenes Gesundheitsverhalten ist sichtbar.","Aktives Ansprechen von Belastungen ohne zu warten bis Fehlzeiten entstehen.","BGM liegt ausschließlich bei Betriebsarzt und HR."],
   r:[0,1,2],e:"FK im BGM: Beobachten (Verhaltensänderungen), Ansprechen (zeitnah, ohne Diagnose zu stellen), Weitervermitteln (Betriebsarzt, EAP). Fürsorgepflicht §618 BGB. Vorbildfunktion: Pausen machen!"},

  {id:"B08",k:"BGM",s:"leicht",q:"Was sind Belastungsfaktoren am Arbeitsplatz?",
   a:["Körperliche Faktoren: Heben, Tragen, Lärm, ungünstige Haltungen.","Psychische Faktoren: Zeitdruck, Monotonie, Verantwortungsdruck.","Umgebungsfaktoren: Beleuchtung, Temperatur, Vibration, Chemikalien.","Ergonomie ist ausschließlich für körperliche Tätigkeiten relevant."],
   r:[0,1,2],e:"Gefährdungsbeurteilung (§5 ArbSchG): Pflicht des AG. Psychische Belastungen seit 2013 ausdrücklich eingeschlossen. Büro-Belastungen (Homeoffice, Reizüberflutung) = genauso zu beurteilen wie Hebelasten."},

  {id:"B09",k:"BGM",s:"mittel",q:"Was sind Ziele von Gesundheitszirkeln im Betrieb?",
   a:["MA erkennen gemeinsam gesundheitliche Belastungen und entwickeln Lösungen.","Partizipation: Betroffene werden zu Beteiligten (Bottom-up).","Nachhaltige Verbesserung der Arbeitsbedingungen durch MA-Expertise.","Gesundheitszirkel ersetzen den Betriebsarzt."],
   r:[0,1,2],e:"Gesundheitszirkel: Moderierter Austausch von MA über Belastungen und Ideen. Vorteil: MA-Wissen nutzen, Commitment durch Beteiligung. Ergänzt Betriebsarzt und GBU — ersetzt sie nicht."},

  {id:"B10",k:"BGM",s:"schwer",q:"Was ist das PERMA-Modell nach Martin Seligman?",
   a:["Positive Emotions, Engagement (Flow), Relationships (tragende Beziehungen).","Meaning (Sinn/Bedeutung), Achievement (Leistungserfolge).","FK können durch Führungsverhalten alle 5 PERMA-Elemente fördern.","PERMA beschreibt ausschließlich Maßnahmen gegen körperliche Erkrankungen."],
   r:[0,1,2],e:"Seligman (Positive Psychologie): PERMA = Wohlbefinden. FK als 'Klima-Architekt': Wertschätzung (P), Flow-Aufgaben (E), Teamkultur (R), Sinn kommunizieren (M), Erfolge sichtbar machen (A)."},

  // ── FÜHRUNG ERWEITERT (F19–F30) ───────────────────────────────────────────
  {id:"F19",k:"Führung",s:"mittel",q:"Was beschreibt das Konzept der dienenden Führung (Servant Leadership)?",
   a:["FK versteht sich als Dienstleister für das Team, nicht als Befehlsgeber.","Bedürfnisse und Entwicklung der MA stehen im Mittelpunkt.","Servant Leader schaffen Rahmenbedingungen, damit MA erfolgreich sein können.","Servant Leadership bedeutet: FK erledigt alle Aufgaben selbst."],
   r:[0,1,2],e:"Greenleaf (1970): Servant Leader fragt 'Was braucht mein Team, um erfolgreich zu sein?' statt 'Was will ich durchsetzen?'. Sehr wirksam für R3/R4-MA. Gegenteil von Micro-Management."},

  {id:"F20",k:"Führung",s:"leicht",q:"Was sind Merkmale eines guten Leitbilds (Mission/Vision)?",
   a:["Vision: beschreibt den angestrebten Zukunftszustand ('Wohin wollen wir?').","Mission: beschreibt den Zweck und Daseinsberechtigung der Organisation ('Warum existieren wir?').","Ein gutes Leitbild ist konkret, inspirierend und handlungsleitend.","Leitbilder sind ausschließlich für große Konzerne relevant."],
   r:[0,1,2],e:"Vision = Nordstern (Zukunftsbild). Mission = Zweck (heutiger Auftrag). Werte = Spielregeln. Gutes Leitbild: kurz, merkbar, handlungsleitend — nicht Marketingphrase. Im Shopfloor: 'Zero Defects' als gelebte Vision."},

  {id:"F21",k:"Führung",s:"schwer",q:"Was beschreibt das VUCA-Modell und welche Führungsimplikationen hat es?",
   a:["VUCA = Volatility (Flüchtigkeit), Uncertainty (Unsicherheit), Complexity (Komplexität), Ambiguity (Mehrdeutigkeit).","VUCA-Welt erfordert agile, anpassungsfähige Führung statt starrer Strukturen.","Transparente Kommunikation und psychologische Sicherheit werden in VUCA wichtiger.","In VUCA-Umgebungen ist autoritäre Führung dauerhaft am effektivsten."],
   r:[0,1,2],e:"VUCA (US-Militär, 1990er): Beschreibt moderne Umweltbedingungen. Antwort auf VUCA: Vision (gegen V), Understanding (gegen U), Clarity (gegen C), Agility (gegen A). FK braucht höhere Ambiguitätstoleranz."},

  {id:"F22",k:"Führung",s:"mittel",q:"Was beschreibt das Prinzip 'Management by Objectives' (MbO)?",
   a:["Führung durch Zielvereinbarung statt durch Anweisung.","MA und FK vereinbaren gemeinsam messbare Ziele.","MA erhalten Handlungsspielraum bei der Wahl der Mittel zur Zielerreichung.","MbO funktioniert ausschließlich mit rein quantitativen Zielen."],
   r:[0,1,2],e:"MbO (Drucker, 1954): Ziele werden vereinbart (nicht verordnet). MA wählen selbst den Weg. Stärke: Eigenverantwortung. Schwäche: Kurzfristdenken wenn nur quantitative KPIs. Ergänzung: OKR (Objectives & Key Results)."},

  {id:"F23",k:"Führung",s:"mittel",q:"Was sind Anzeichen eines dysfunktionalen Teams nach Lencioni?",
   a:["Fehlendes Vertrauen: MA schützen sich statt offen zu sein.","Konfliktscheu: Themen werden nicht offen angesprochen.","Fehlende Verbindlichkeit: Entscheidungen werden nicht wirklich mitgetragen.","Zu viel Vertrauen und offene Kommunikation führen zu Teamdysfunktion."],
   r:[0,1,2],e:"Lencioni '5 Dysfunctions': Fehlendes Vertrauen → Konfliktscheu → fehlende Verbindlichkeit → Verantwortungslosigkeit → Gleichgültigkeit ggü. Ergebnissen. Basis ist immer Vertrauen — ohne es kollabiert alles andere."},

  {id:"F24",k:"Führung",s:"leicht",q:"Was ist der Unterschied zwischen Führung und Management?",
   a:["Management: Planung, Organisation, Kontrolle von Strukturen und Prozessen.","Führung: Motivation, Inspiration, Ausrichtung von Menschen auf Ziele.","Beide Fähigkeiten sind für eine FK notwendig.","Führung und Management sind identisch und austauschbar."],
   r:[0,1,2],e:"Kotter: Manager tun Dinge richtig (Effizienz), Leader tun die richtigen Dinge (Effektivität). Eine FK braucht beides: Management = Komplexität beherrschen, Leadership = Wandel gestalten."},

  {id:"F25",k:"Führung",s:"schwer",q:"Was beschreibt das Konzept der emotionalen Intelligenz nach Goleman?",
   a:["Selbstwahrnehmung: eigene Emotionen erkennen und verstehen.","Selbstregulation: Impulse kontrollieren und Emotionen steuern.","Empathie: Gefühle anderer wahrnehmen und darauf eingehen.","Soziale Kompetenz: Beziehungen gestalten und Netzwerke aufbauen."],
   r:[0,1,2,3],e:"Goleman 5 Dimensionen: Selbstwahrnehmung, Selbstregulation, Motivation (intrinsisch), Empathie, soziale Kompetenz. EQ ist stärker als IQ als Prädiktor für Führungserfolg. Gute Nachricht: EQ ist trainierbar."},

  {id:"F26",k:"Führung",s:"mittel",q:"Was beschreibt das Prinzip der Führung auf Distanz (Remote Leadership)?",
   a:["Vertrauen ist wichtiger als Kontrolle — Ergebnisse statt Anwesenheit zählen.","Regelmäßige, strukturierte Kommunikation (Check-ins) ist entscheidend.","Digitale Tools ersetzen keine Beziehungsarbeit — persönlicher Kontakt bleibt wichtig.","Remote Arbeit erfordert ausschließlich mehr Kontrolle und engeres Monitoring."],
   r:[0,1,2],e:"Remote Leadership: Output-Orientierung (Ergebnisse) statt Input-Kontrolle (Stunden). Kommunikationsfrequenz erhöhen (nicht verringern). Informelle Kanäle (Kaffee-Calls) gezielt schaffen. Psychologische Sicherheit über Distanz schwieriger — FK muss aktiver daran arbeiten."},

  {id:"F27",k:"Führung",s:"leicht",q:"Was ist Unternehmenskultur und wie entsteht sie?",
   a:["Summe der geteilten Werte, Überzeugungen und Verhaltensweisen einer Organisation.","Entsteht durch Vorbilder (besonders FK-Verhalten), Geschichte und Rituale.","Kulturwandel dauert lange — 3 bis 7 Jahre sind realistisch.","Unternehmenskultur kann durch ein einmaliges Workshop-Event grundlegend verändert werden."],
   r:[0,1,2],e:"Schein: Kultur = sichtbare Artefakte + proklamierte Werte + Grundannahmen (tiefste Ebene, schwerst veränderbar). FK-Verhalten ist das stärkste Kultursignal — was FK toleriert oder bestraft, formt Kultur."},

  {id:"F28",k:"Führung",s:"mittel",q:"Was beschreibt die Theorie U nach Otto Scharmer?",
   a:["Prozess des tiefgreifenden Lernens und Wandels in 5 Phasen (U-Bewegung).","Kernprinzip: Aus der Zukunft heraus führen statt aus der Vergangenheit heraus zu reagieren.","Presencing: Tiefes Zuhören und Wahrnehmen als Voraussetzung für Innovation.","Theorie U ist ausschließlich für Einzelpersonen, nicht für Organisationen relevant."],
   r:[0,1,2],e:"Scharmer (MIT): U-Bewegung: Downloading (Altes) → Seeing → Sensing → Presencing (Zukunft spüren) → Crystallizing → Prototyping → Performing. Relevant für komplexe Transformationsprozesse in Organisationen."},

  {id:"F29",k:"Führung",s:"mittel",q:"Was sind typische Führungsfehler in der Praxis?",
   a:["Micro-Management: zu enge Kontrolle untergräbt MA-Autonomie und Motivation.","Fehlende Wertschätzung: Leistungen werden nicht anerkannt.","Inkonsistenz: andere Maßstäbe für sich selbst als für das Team.","Zu viel Delegation und zu wenig Kontrolle ist der häufigste Führungsfehler."],
   r:[0,1,2],e:"Häufigste Führungsfehler (Gallup): Micro-Management, fehlende Anerkennung, Inkonsistenz, schlechte Kommunikation, Schuldverschiebung. Delegation mit Nachverfolgung (nicht Kontrolle) ist Stärke, nicht Fehler."},

  {id:"F30",k:"Führung",s:"schwer",q:"Was beschreibt agile Führung?",
   a:["Iteratives Vorgehen: kurze Zyklen mit schnellem Feedback statt langer Planung.","Selbstorganisation von Teams als Ziel: FK moderiert statt dirigiert.","Fehlerkultur: schnelles Scheitern und Lernen ist erwünscht ('Fail fast, learn fast').","Agile Führung funktioniert ausschließlich in der IT und Softwareentwicklung."],
   r:[0,1,2],e:"Agile Führung (Scrum, Kanban, OKR): Iterativ, inkrementell, selbstorganisiert. FK-Rolle wandelt sich: von Anweiser zu Enabler. Auch in Produktion anwendbar: Kanban-Boards, Sprint-Reviews für KVP-Teams."},

  // ── KOMMUNIKATION ERWEITERT (K13–K20) ─────────────────────────────────────
  {id:"K13",k:"Kommunikation",s:"mittel",q:"Was beschreibt das Konzept des Reframings in der Kommunikation?",
   a:["Umdeutung: einer Situation oder Aussage einen neuen Bedeutungsrahmen geben.","Reframing verändert nicht die Fakten, aber die Perspektive darauf.","Wird gezielt eingesetzt, um Blockaden aufzulösen und neue Lösungsräume zu öffnen.","Reframing ist manipulativ und sollte in der FK-Kommunikation vermieden werden."],
   r:[0,1,2],e:"Reframing (NLP, systemisches Coaching): 'Das Glas ist halb leer' → 'Das Glas ist halb voll.' Im Change Management: 'Problem' → 'Herausforderung' → 'Lernchance'. Wirksam bei Widerstand."},

  {id:"K14",k:"Kommunikation",s:"leicht",q:"Was sind offene vs. geschlossene Fragen im Führungsgespräch?",
   a:["Offene Fragen (W-Fragen) fördern Reflexion und ausführliche Antworten.","Geschlossene Fragen ermöglichen klare Ja/Nein-Entscheidungen.","Offene Fragen sind in der Diagnose und im Coaching vorzuziehen.","Geschlossene Fragen sind immer besser als offene Fragen."],
   r:[0,1,2],e:"Offene Fragen: Wer, Was, Wie, Warum, Wann, Wozu → Gespräch öffnen. Geschlossene Fragen: 'Bist du einverstanden?' → Entscheidung herbeiführen. Taktik: Exploration zuerst (offen), dann Bestätigung (geschlossen)."},

  {id:"K15",k:"Kommunikation",s:"mittel",q:"Was sind Störungen in der Kommunikation nach dem Sender-Empfänger-Modell?",
   a:["Enkodierungsfehler: Sender formuliert Botschaft unklar oder missverständlich.","Übertragungsstörungen: Lärm, schlechtes Medium, Informationsüberflutung.","Dekodierungsfehler: Empfänger interpretiert Botschaft falsch.","Sender und Empfänger können nie misseinander missverstehen wenn sie dieselbe Sprache sprechen."],
   r:[0,1,2],e:"Shannon/Weaver Modell: Sender → Kanal → Empfänger. Störquellen auf jeder Ebene. Lösung: Rückmeldung (Feedback-Schleife), klare Sprache, richtiges Medium wählen (Komplexes = persönlich, nicht E-Mail)."},

  {id:"K16",k:"Kommunikation",s:"schwer",q:"Was beschreibt das Konzept der Metakommunikation?",
   a:["Kommunikation über Kommunikation — Gespräch über den Gesprächsprozess selbst.","'Ich merke, wir reden aneinander vorbei — lass uns kurz innehalten.'","Metakommunikation hilft, festgefahrene Gespräche zu entsperren.","Metakommunikation ist nur in der Therapie, nicht im Führungsalltag anwendbar."],
   r:[0,1,2],e:"Watzlawick: Beziehungsaspekt überlagert Inhaltsaspekt → Metakommunikation als Werkzeug. Satz: 'Ich möchte kurz darüber sprechen, wie wir gerade miteinander kommunizieren.' Sehr wirksam bei eskalierten Gesprächen."},

  {id:"K17",k:"Kommunikation",s:"mittel",q:"Was sind Grundregeln für Meetings und Besprechungen?",
   a:["Klare Agenda vorab — Ziel und Zeitrahmen jedes Tagesordnungspunktes.","Richtige Teilnehmerzahl: nur wer entscheiden oder beitragen kann.","Ergebnisprotokoll mit Maßnahmen, Verantwortlichen und Terminen (WANN-WER-WAS).","Je mehr Teilnehmer in einem Meeting, desto produktiver ist es."],
   r:[0,1,2],e:"Meetings: Agenda = Pflicht. 'Two-Pizza-Rule' (Bezos): Team sollte von 2 Pizzen satt werden ≈ max 8 Personen. Protokoll: WANN-WER-WAS. Häufigster Fehler: Meeting ohne klares Ziel. Steh-Meetings verkürzen Dauer um ~34%."},

  {id:"K18",k:"Kommunikation",s:"leicht",q:"Was ist der Unterschied zwischen asynchroner und synchroner Kommunikation?",
   a:["Synchron: beide Parteien kommunizieren zeitgleich (Meeting, Telefon, Chat).","Asynchron: zeitversetzt (E-Mail, Nachricht, Video-Aufzeichnung).","Asynchrone Kommunikation ermöglicht durchdachtere Antworten und weniger Unterbrechungen.","Synchrone Kommunikation ist immer besser als asynchrone Kommunikation."],
   r:[0,1,2],e:"Remote-Work-Erkenntnis: Asynchron = tiefere Arbeit möglich, weltweite Zusammenarbeit. Synchron = schnelle Entscheidungen, emotionale Verbindung. Faustregel: Komplex und emotional = synchron. Einfach und informativ = asynchron."},

  {id:"K19",k:"Kommunikation",s:"mittel",q:"Was beschreibt Storytelling als Führungsinstrument?",
   a:["Botschaften in Geschichten verpacken erhöht Merkfähigkeit und emotionale Wirkung.","Gute Stories haben Struktur: Ausgangslage → Herausforderung → Wendepunkt → Lösung.","Authentische, persönliche Geschichten wirken stärker als abstrakte Daten.","Storytelling ist nur in der Werbung und nicht in der Führungskommunikation relevant."],
   r:[0,1,2],e:"Neurowissenschaft: Gehirn verarbeitet Geschichten 22× stärker als Fakten (Stanford-Studie). 'Daten informieren, Geschichten inspirieren.' FK-Anwendung: Veränderungen mit konkreten Beispielen erklären, nicht nur Folien zeigen."},

  {id:"K20",k:"Kommunikation",s:"schwer",q:"Was sind typische Gesprächsfallen in schwierigen Führungsgesprächen?",
   a:["Verallgemeinerungen: 'Immer', 'Nie', 'Alle' eskalieren Gespräche.","Ratschläge geben bevor das Problem vollständig verstanden ist.","Killerphrasen: 'Das haben wir noch nie so gemacht.' blockieren Entwicklung.","Direkte, konfrontative Gesprächsführung führt immer zu Konflikten."],
   r:[0,1,2],e:"Gesprächsfallen: Verallgemeinerungen (schwer zu widerlegen), vorschnelle Ratschläge (MA fühlt sich nicht gehört), Killerphrasen (Kreativität töten), Weglachen. Direktheit ≠ Konfrontation — direkt UND respektvoll ist möglich und nötig."},

  // ── MOTIVATION ERWEITERT (M11–M20) ────────────────────────────────────────
  {id:"M11",k:"Motivation",s:"mittel",q:"Was beschreibt das GROW-Modell im Coaching?",
   a:["G = Goal: Was ist das konkrete Ziel des Gesprächs?","R = Reality: Wie ist die aktuelle Situation realistisch?","O = Options: Welche Möglichkeiten gibt es?","W = Will/Way forward: Was wird konkret als nächstes getan?"],
   r:[0,1,2,3],e:"GROW (Whitmore): Strukturiertes Coaching-Gespräch. FK als Coach statt als Problemlöser. Wichtig: FK stellt Fragen, gibt nicht die Antwort vor. GROW erhöht Eigenverantwortung des MA deutlich."},

  {id:"M12",k:"Motivation",s:"leicht",q:"Was beschreibt Anerkennung als Motivationsinstrument?",
   a:["Spezifisches Lob ('Du hast X getan und damit Y erreicht') wirkt stärker als pauschales Lob.","Anerkennung muss zeitnah nach der Leistung gegeben werden.","Öffentliches Lob vor dem Team kann starke Motivationswirkung haben.","Anerkennung verliert ihre Wirkung wenn sie zu häufig gegeben wird."],
   r:[0,1,2],e:"Lob-Regeln: Spezifisch (nicht 'gut gemacht', sondern 'Du hast die Reklamation in 2h gelöst und den Kunden gehalten — das war ausgezeichnet.'), zeitnah, verhältnismäßig. Öffentliches Lob = Motivator für ganzes Team. Zu häufiges Lob ohne Substanz = Inflationierung."},

  {id:"M13",k:"Motivation",s:"mittel",q:"Was sind Unterschiede zwischen kurzfristiger und langfristiger Motivation?",
   a:["Kurzfristig: Prämien, Lob, Wettbewerbe — schnelle Wirkung, verpufft oft.","Langfristig: Sinn, Entwicklung, Autonomie — langsamer aufgebaut, nachhaltiger.","FK-Aufgabe: kurzfristige Impulse mit langfristigen Faktoren kombinieren.","Langfristige Motivation existiert nicht — Motivation ist immer kurzfristig."],
   r:[0,1,2],e:"Pink (Drive): Für Routineaufgaben = externe Belohnung. Für kreative/komplexe Aufgaben = intrinsische Motivation (Autonomie, Meisterschaft, Sinn). Fehler: Instrumente verwechseln (Prämie für kreative Arbeit = Korrumpierungseffekt)."},

  {id:"M14",k:"Motivation",s:"schwer",q:"Was beschreibt das Konzept 'Gamification' zur Motivationssteigerung?",
   a:["Spielelemente (Punkte, Level, Ranglisten) in nicht-spielerischen Kontexten einsetzen.","Gamification nutzt intrinsische Motivationsmechanismen: Fortschritt, Wettbewerb, Mastery.","Wirksam wenn die Grundaufgabe sinnvoll ist — ersetzt keinen Sinn.","Gamification ist nur für junge Mitarbeitende unter 30 Jahren wirksam."],
   r:[0,1,2],e:"Gamification: Fortschrittsbalken, Achievements, Bestenlisten. Wirkt weil Gehirn Belohnungssystem aktiviert wird. Risiko: Wenn Belohnung entfällt → Demotivation. Dauerhaft nur wirksam wenn Aufgabe selbst bedeutsam ist."},

  {id:"M15",k:"Motivation",s:"mittel",q:"Was sind Anzeichen von innerer Kündigung bei Mitarbeitenden?",
   a:["Dienst nach Vorschrift: minimale Leistung, keine Eigeninitiative mehr.","Rückzug aus informellen Gesprächen und Teamaktivitäten.","Keine Ideen mehr, keine Verbesserungsvorschläge, keine Kritik.","Vollständige Arbeitsverweigerung und offene Auseinandersetzung."],
   r:[0,1,2],e:"Innere Kündigung ≠ formale Kündigung. Gallup: ~15% der deutschen Beschäftigten haben innerlich gekündigt (2023). Kostet ca. 13.000 Euro/MA/Jahr. Frühzeichen: keine Ideen + keine Kritik = gefährlicher als offene Kritik."},

  {id:"M16",k:"Motivation",s:"leicht",q:"Was beschreibt das Konzept 'Job Crafting'?",
   a:["MA gestalten ihre Rolle aktiv mit — passen Aufgaben und Beziehungen an eigene Stärken an.","Erhöht Engagement und Sinnerleben ohne formale Stellenänderung.","FK können Job Crafting aktiv fördern und als Entwicklungsinstrument nutzen.","Job Crafting ist unerwünschte Eigenmächtigkeit und sollte verhindert werden."],
   r:[0,1,2],e:"Wrzesniewski/Dutton: MA die ihre Rolle aktiv gestalten (Task, Relationship, Cognitive Crafting) sind produktiver und zufriedener. FK: 'Was könntest du in deiner Rolle anders gestalten, um mehr Sinn zu erleben?' = starke Entwicklungsfrage."},

  {id:"M17",k:"Motivation",s:"mittel",q:"Was beschreibt das Konzept 'Psychological Contract'?",
   a:["Ungeschriebene gegenseitige Erwartungen zwischen MA und Arbeitgeber.","Verletzung des psychologischen Vertrags führt zu Vertrauensverlust und Demotivation.","Entsteht durch Versprechungen im Recruiting, Onboarding und alltägliches Führungsverhalten.","Der psychologische Vertrag ist rechtlich bindend und einklagbar."],
   r:[0,1,2],e:"Rousseau: 'Ich gebe mehr als vereinbart, wenn ich Vertrauen habe — und weniger wenn es gebrochen ist.' Typische Verletzungen: versprochene Beförderung kommt nicht, Arbeitsklima-Versprechen nicht gehalten. Nicht einklagbar, aber hochgradig verhaltensrelevant."},

  {id:"M18",k:"Motivation",s:"schwer",q:"Was ist der Zusammenhang zwischen Autonomie und Motivation?",
   a:["Höhere Autonomie → höhere intrinsische Motivation und Eigenverantwortung.","SDT: Autonomie ist eines der drei Grundbedürfnisse für intrinsische Motivation.","Autonomie braucht Kompetenz als Voraussetzung — unkompetente Autonomie erzeugt Stress.","Vollständige Autonomie ohne jede Struktur ist immer optimal für alle MA."],
   r:[0,1,2],e:"Deci/Ryan: Autonomy-Support = FK gibt Wahlmöglichkeiten, erklärt Warum, minimiert Druck. Aber: Autonomie ohne Kompetenz = Überforderung (R1-MA braucht Anweisung). Passend zu Hersey/Blanchard: Reifegrad bestimmt optimale Autonomiemenge."},

  {id:"M19",k:"Motivation",s:"mittel",q:"Was sind wirksame Maßnahmen gegen demotivierendes Micro-Management?",
   a:["Klare Ziele und Erwartungen kommunizieren statt Wege vorzuschreiben.","Regelmäßige, strukturierte Check-ins statt permanenter Kontrolle.","Vertrauen aufbauen durch kleine, schrittweise Delegation mit Erfolgserlebnissen.","Micro-Management ist in allen Situationen dysfunktional."],
   r:[0,1,2],e:"Micro-Management entsteht oft aus Kontrollbedürfnis oder Angst vor Fehlern. Lösung: SMART-Ziele + vereinbarte Meilensteine = Kontrolle ohne Kontrolle. Ausnahme: R1-MA brauchen enge Begleitung (kein Micro-Management, aber strukturiertes Directing)."},

  {id:"M20",k:"Motivation",s:"leicht",q:"Was sind die Grundlagen von Lob und Kritik als Führungsinstrumente?",
   a:["Lob muss spezifisch, zeitnah und aufrichtig sein — nicht formelhaft.","Kritik wird konstruktiv wenn sie Verhalten (nicht Person) adressiert und lösungsorientiert ist.","Das Verhältnis von positivem zu kritischem Feedback sollte ca. 5:1 betragen.","Kritik sollte immer öffentlich ausgesprochen werden damit das Team davon lernt."],
   r:[0,1,2],e:"Losada-Ratio (5:1): Hochleistungs-Teams haben ca. 5 positive auf 1 kritische Interaktion. Nicht nur Lob stapeln — Kritik ist wichtig aber im richtigen Rahmen. Öffentliche Kritik verletzt Würde und löst kollektive Abwehr aus."},

  // ── KONFLIKT ERWEITERT (KO11–KO20) ────────────────────────────────────────
  {id:"KO11",k:"Konflikt",s:"mittel",q:"Was sind die häufigsten Fehler im Umgang mit Konflikten als FK?",
   a:["Zu langes Wegschauen: Konflikte früh ansprechen verhindert Eskalation.","Partei ergreifen: FK verliert Vertrauen beider Seiten wenn sie sich positioniert.","Schnelle Lösung oktroyieren statt Ursachen zu klären.","Konflikte sofort und ohne Vorbereitung ansprechen um Dynamik zu stoppen."],
   r:[0,1,2],e:"FK-Fehler: Zuwarten (Konflikt eskaliert), Partei ergreifen (Vertrauensverlust), Pseudo-Lösung (symptomatisch statt kausal). Richtig: Früh ansprechen, allparteilich bleiben, Ursachen klären, dann gemeinsam lösen."},

  {id:"KO12",k:"Konflikt",s:"leicht",q:"Was ist der Unterschied zwischen Konflikt und Meinungsverschiedenheit?",
   a:["Meinungsverschiedenheit: sachliche Differenz ohne emotionale Eskalation.","Konflikt: emotionale Beteiligung, Beziehungsebene berührt, Verhalten ändert sich.","Meinungsverschiedenheiten können produktiv sein und zu besseren Entscheidungen führen.","Jede Meinungsverschiedenheit ist ein Konflikt und muss sofort gelöst werden."],
   r:[0,1,2],e:"Gesunde Teams haben Meinungsverschiedenheiten — das ist Zeichen von psychologischer Sicherheit. Konflikt entsteht wenn Beziehungsebene verletzt wird. FK-Aufgabe: Sachkonflikte produktiv halten, Beziehungskonflikte früh bearbeiten."},

  {id:"KO13",k:"Konflikt",s:"schwer",q:"Was beschreibt das Win-Win-Prinzip in der Konfliktlösung?",
   a:["Beide Parteien gewinnen etwas — Lösung ist besser als bloßer Kompromiss.","Voraussetzung: Interessen statt Positionen in den Fokus nehmen.","Kreative Optionen entwickeln, die vorher nicht sichtbar waren.","Win-Win ist in der Praxis nicht realisierbar — immer gibt es Gewinner und Verlierer."],
   r:[0,1,2],e:"Win-Win (Harvard-Modell): Kompromiss = beide geben etwas auf (50-50). Win-Win = beide gewinnen durch kreative Lösung. Voraussetzung: Vertrauen + Offenheit + Bereitschaft, Interessen zu teilen. Im Arbeitskontext möglich wenn Beziehung erhalten werden soll."},

  {id:"KO14",k:"Konflikt",s:"mittel",q:"Was sind Merkmale einer konstruktiven Streitkultur im Team?",
   a:["Sachkonflikte werden offen ausgetragen ohne persönliche Angriffe.","Unterschiedliche Meinungen werden als Bereicherung gesehen, nicht als Bedrohung.","Es gibt vereinbarte Spielregeln für Diskussionen (z.B. eine Person spricht).","In konstruktiven Teams gibt es keine Konflikte."],
   r:[0,1,2],e:"Edmondson: Konstruktive Streitkultur = Zeichen von Reife und psychologischer Sicherheit. Teams ohne sichtbare Konflikte haben oft latente Konflikte oder Groupthink. FK-Aufgabe: Diskussion moderieren, Spielregeln setzen, Ergebnisse festhalten."},

  {id:"KO15",k:"Konflikt",s:"leicht",q:"Was sind Phasen eines professionellen Konfliktgesprächs?",
   a:["Vorbereitung: eigene Position und Ziele klären, ruhige Situation wählen.","Eröffnung: Gesprächsziel und Wertschätzungsrahmen setzen.","Problemdarstellung beider Seiten ohne Unterbrechung.","Lösungsfindung und verbindliche Vereinbarung mit konkreten Schritten."],
   r:[0,1,2,3],e:"Konfliktgespräch-Ablauf: 1)Vorbereitung (Was will ich erreichen?) 2)Eröffnung (Rahmen setzen) 3)Zuhören (aktiv, ohne zu unterbrechen) 4)Problemanalyse 5)Lösungen entwickeln 6)Vereinbarung schriftlich fixieren 7)Nachfassen."},

  {id:"KO16",k:"Konflikt",s:"schwer",q:"Was sind Anzeichen für Mobbing am Arbeitsplatz?",
   a:["Systematisches Ausgrenzen: keine Informationen mehr erhalten, von Meetings ausgeschlossen.","Permanente ungerechtfertigte Kritik und Arbeitserschwernisse.","Gerüchte und Verleumdungen über die betroffene Person.","Einmalige harsche Kritik durch die FK ist bereits Mobbing."],
   r:[0,1,2],e:"Leymann-Handlungen: Angriffe auf Kommunikation (ignorieren, unterbrechen), soziale Beziehungen (isolieren), Reputation (lächerlich machen), Berufsausübung (sinnlose Aufgaben), Gesundheit (körperliche Bedrohung). Einmalig = kein Mobbing."},

  {id:"KO17",k:"Konflikt",s:"mittel",q:"Was sind FK-Pflichten bei Mobbingverdacht?",
   a:["Sofortiges Handeln: abwarten verschlimmert die Situation.","Dokumentation: Vorfälle schriftlich festhalten (Datum, Beteiligte, Vorfall).","HR und ggf. Betriebsrat einschalten — nicht alleine lösen.","FK darf bei Mobbing zwischen Kollegen nicht eingreifen."],
   r:[0,1,2],e:"Fürsorgepflicht (§618 BGB): FK muss bei Mobbingverdacht handeln. Schritte: Dokumentieren → Gespräch mit Betroffenen → HR/BR einschalten → ggf. externe Beratung. Nicht einzugreifen = Duldung = Haftungsrisiko für AG."},

  {id:"KO18",k:"Konflikt",s:"mittel",q:"Was beschreibt Transaktionsanalyse (TA) im Kontext von Konflikten?",
   a:["Drei Ich-Zustände: Eltern-Ich (normativ/fürsorglich), Erwachsenen-Ich (rational), Kind-Ich (spontan/rebellisch).","Konflikte entstehen oft durch 'überkreuzte Transaktionen' (Erwartetes Ich-Zustand wird nicht bedient).","Ziel in Führungsgesprächen: im Erwachsenen-Ich kommunizieren.","TA ist veraltet und hat keine praktische Relevanz mehr."],
   r:[0,1,2],e:"Berne: Erwachsenen-Ich = sachlich, faktenbasiert, respektvoll. Häufige FK-Falle: Eltern-Ich ('Du musst…', 'Du solltest…') → provoziert Kind-Ich beim MA (Trotz oder Anpassung). Ziel: Erwachsener spricht mit Erwachsenem."},

  {id:"KO19",k:"Konflikt",s:"leicht",q:"Was sind Merkmale eines fairen Verhandlungsprozesses?",
   a:["Beide Seiten kommen vollständig zu Wort ohne Unterbrechung.","Argumente werden sachlich bewertet, nicht nach Status des Sprechers.","Ergebnisse werden schriftlich festgehalten und von beiden Seiten bestätigt.","Faire Verhandlungen erfordern immer einen externen Schiedsrichter."],
   r:[0,1,2],e:"Faires Verfahren (Tyler): Prozessgerechtigkeit (fairer Prozess) oft wichtiger als Ergebnisgerechtigkeit. MA akzeptieren schlechte Entscheidungen leichter wenn der Prozess fair war. Dokumentation = Verbindlichkeit + Schutz."},

  {id:"KO20",k:"Konflikt",s:"schwer",q:"Was ist Konfliktkompetenz als Führungsfähigkeit?",
   a:["Fähigkeit, Konflikte frühzeitig zu erkennen und produktiv anzusprechen.","Allparteilichkeit: alle Perspektiven ernst nehmen ohne Partei zu ergreifen.","Deeskalations- und Moderationsfähigkeit in emotional aufgeladenen Situationen.","Konfliktkompetente FK haben selbst nie Konflikte."],
   r:[0,1,2],e:"Konfliktkompetenz = proaktiv (früh erkennen) + allparteilich (nicht urteilen) + deeskalierend (Temperatur senken) + lösungsfokussiert. Nicht: Konflikte vermeiden oder immer schlichten. Manchmal muss FK entscheiden wenn Einigung nicht möglich."},

  // ── PERSONAL ERWEITERT (P11–P20) ──────────────────────────────────────────
  {id:"P11",k:"Personal",s:"leicht",q:"Was sind Grundsätze des AGG (Allgemeines Gleichbehandlungsgesetz)?",
   a:["Verbot von Diskriminierung aufgrund von Geschlecht, Alter, Herkunft, Religion, Behinderung, sexueller Orientierung.","Gilt für Einstellung, Kündigung, Beförderung und Arbeitsbedingungen.","Arbeitgeber muss bei Verstößen Schadenersatz leisten.","AGG gilt ausschließlich für die Einstellungsphase, nicht für den laufenden Betrieb."],
   r:[0,1,2],e:"AGG (2006): 8 Merkmale. Gilt für gesamte Beschäftigung. Beweislastumkehr: AG muss beweisen, dass keine Diskriminierung vorlag wenn MA Indizien vorträgt. FK-Pflicht: diskriminierende Stellenausschreibungen vermeiden."},

  {id:"P12",k:"Personal",s:"mittel",q:"Was sind Aufgaben des Betriebsrats bei Personalentscheidungen?",
   a:["Mitbestimmung bei Einstellungen, Versetzungen, Umgruppierungen.","Anhörungsrecht bei ordentlichen Kündigungen.","Mitbestimmung bei betrieblichen Regelungen (Arbeitszeit, Urlaub, Leistungsbeurteilung).","Der Betriebsrat kann Personalentscheidungen des AG einseitig treffen."],
   r:[0,1,2],e:"BetrVG: Mitbestimmung (echtes Vetorecht) vs. Mitwirkung (Anhörung). Mitbestimmung: Einstellung, Versetzung, Kündigung (Anhörung), Arbeitszeit, Urlaub. FK muss BR frühzeitig einbinden — nachträgliche 'Beteiligung' ist rechtlich unwirksam."},

  {id:"P13",k:"Personal",s:"schwer",q:"Was sind Merkmale einer rechtssicheren Abmahnung?",
   a:["Konkreter Vorwurf: genau beschriebenes Fehlverhalten (Datum, Uhrzeit, Vorfall).","Rüge: klare Missbilligung des Verhaltens.","Androhung: bei Wiederholung wird das Arbeitsverhältnis gekündigt.","Abmahnungen dürfen nur mündlich ausgesprochen werden."],
   r:[0,1,2],e:"Abmahnung: 3 Elemente zwingend (Bezeichnung, Rüge, Androhung). Schriftlich empfohlen (Beweissicherung). Nur verhaltensbedingte Verstöße (nicht personenbedingt). Veraltete Abmahnungen (>2 Jahre) verlieren Wirkung. Gegendarstellung des MA ins Personalakt."},

  {id:"P14",k:"Personal",s:"mittel",q:"Was sind die Kündigungsarten im deutschen Arbeitsrecht?",
   a:["Ordentliche Kündigung: fristgerecht, Kündigungsschutzgesetz greift (>10 MA, >6 Monate Betriebszugehörigkeit).","Außerordentliche (fristlose) Kündigung: nur bei wichtigem Grund möglich (§626 BGB).","Änderungskündigung: Kündigung verbunden mit Angebot neuer Vertragsbedingungen.","Arbeitgeber kann jederzeit ohne Begründung kündigen."],
   r:[0,1,2],e:"Kündigungsschutz (KSchG): gilt ab 10 MA und 6 Monate. Kündigung braucht sozialen Rechtfertigungsgrund: personenbedingt (Krankheit), verhaltensbedingt (nach Abmahnung), betriebsbedingt (wirtschaftlich). Betriebsrat muss angehört werden (§102 BetrVG)."},

  {id:"P15",k:"Personal",s:"mittel",q:"Was ist das 360-Grad-Feedback?",
   a:["Feedback von FK, Kollegen, MA (Untergebenen) und ggf. Kunden gleichzeitig.","Liefert umfassendes Bild durch verschiedene Perspektiven.","Ziel: Entwicklung der beurteilten Person, nicht Sanktion.","360-Grad-Feedback eignet sich gut für Gehalts- und Beförderungsentscheidungen."],
   r:[0,1,2],e:"360-Grad: Multi-Source-Feedback. Stärke: blinde Flecken sichtbar machen (Johari). Schwäche: Anonymität kann Ehrlichkeit erhöhen aber auch Verzerrungen einladen. Für Entwicklung: sehr wirksam. Für Gehalts-/Beförderungsentscheidungen: ungeeignet (Interessenkonflikte)."},

  {id:"P16",k:"Personal",s:"leicht",q:"Was sind Ziele der Potenzialanalyse?",
   a:["Zukünftige Leistungs- und Entwicklungsfähigkeit eines MA einschätzen.","Grundlage für Nachfolgeplanung und Entwicklungsinvestitionen.","Unterscheidet sich von Leistungsbeurteilung (Vergangenheit) durch Zukunftsorientierung.","Potenzialanalysen sind ausschließlich für externe Bewerber relevant."],
   r:[0,1,2],e:"Potenzial ≠ Leistung. Leistungsbeurteilung: Was hat der MA bisher geleistet? Potenzialanalyse: Was kann der MA in Zukunft leisten? Tools: Assessment Center, strukturierte Interviews, psychometrische Tests. Basis für Talent Management."},

  {id:"P17",k:"Personal",s:"schwer",q:"Was sind Grundsätze der leistungsorientierten Vergütung?",
   a:["Variable Vergütungsanteile an messbare Ziele koppeln (MbO).","Transparenz: MA muss verstehen wie Vergütung berechnet wird.","Fairness: gleiche Leistung = gleiche Vergütung (Adams Equity Theory).","Leistungsorientierte Vergütung steigert immer die intrinsische Motivation."],
   r:[0,1,2],e:"Leistungsvergütung: wirksam für einfache, messbare Tätigkeiten. Für komplexe/kreative Arbeit: Korrumpierungseffekt möglich (Pink/Deci). Wichtig: klare Ziele, faire Messung, Nachvollziehbarkeit. Betriebsrat hat Mitbestimmungsrecht bei Vergütungssystemen."},

  {id:"P18",k:"Personal",s:"mittel",q:"Was beschreibt Talent Management in Organisationen?",
   a:["Systematische Identifikation, Entwicklung und Bindung von Leistungsträgern.","Nachfolgeplanung: wer übernimmt Schlüsselpositionen wenn FK ausscheidet?","Talente brauchen besondere Förderung UND besondere Anforderungen.","Talent Management ist nur für das Senior Management relevant."],
   r:[0,1,2],e:"Talent Management: High Potentials brauchen Herausforderung + Entwicklung + Perspektive. Fehler: Talente in Ruhe lassen weil sie gut laufen → innerliche Kündigung. Nachfolgeplanung: in Deutschland oft vernachlässigt → Wissensrisiko."},

  {id:"P19",k:"Personal",s:"leicht",q:"Was sind Aufgaben der Personalplanung?",
   a:["Bedarfsplanung: Wie viele MA mit welchen Qualifikationen werden künftig benötigt?","Deckungsplanung: Wie wird der Bedarf gedeckt (intern/extern)?","Maßnahmenplanung: Einstellung, Entwicklung, Freisetzung.","Personalplanung ist Aufgabe der Unternehmensführung und nicht der Linien-FK."],
   r:[0,1,2],e:"Personalplanung: quantitativ (Anzahl) + qualitativ (Kompetenzen) + zeitlich (wann). Instrumente: Altersstrukturanalyse, Qualifikationsmatrix, Fluktuationsanalyse. Linien-FK liefert Input (Bedarfsplanung), HR koordiniert."},

  {id:"P20",k:"Personal",s:"schwer",q:"Was sind Merkmale eines professionellen Trennungsgesprächs?",
   a:["Klare, direkte Kommunikation der Entscheidung — keine falschen Hoffnungen wecken.","Würdevolle Behandlung: Leistungen anerkennen, mit Respekt trennen.","Rechtlich korrekt: Kündigungsschutz, Fristen, Zeugnisanspruch beachten.","Trennungsgespräche sollen möglichst aufgeschoben werden bis der MA selbst kündigt."],
   r:[0,1,2],e:"Trennungsgespräch (Harvard-Prinzip): klar, kurz, korrekt, würdevoll. Fehler: Hinhaltetaktik (moralisch und rechtlich problematisch), falsche Freundlichkeit. 'Outplacement' als faire Unterstützung. Zeugnis: fristgerecht, wohlwollend."},

  // ── BGM ERWEITERT (B11–B20) ───────────────────────────────────────────────
  {id:"B11",k:"BGM",s:"mittel",q:"Was beschreibt das Konzept Work-Life-Balance?",
   a:["Ausgewogenes Verhältnis zwischen beruflichen Anforderungen und privater Erholung.","Grenzen zwischen Arbeit und Privatleben schützen (Abschalten ermöglichen).","FK-Vorbildfunktion: keine E-Mails nach Feierabend erwarten, Urlaub respektieren.","Work-Life-Balance ist ausschließlich ein privates Problem jedes MA."],
   r:[0,1,2],e:"Work-Life-Balance: AG-Verantwortung durch Arbeitszeitgesetz (ArbZG), betriebliche Regelungen. FK-Fehler: Erreichbarkeit 24/7 erwarten (implizit durch eigenes Verhalten). Neuerer Begriff: Work-Life-Integration (Grenzen flexibler, aber bewusst gesetzt)."},

  {id:"B12",k:"BGM",s:"leicht",q:"Was sind ergonomische Grundsätze am Arbeitsplatz?",
   a:["Bildschirmarbeit: Monitor auf Augenhöhe, 50–70 cm Abstand, kein Gegenlicht.","Sitzposition: 90° Hüftwinkel, Füße flach auf Boden, Unterarme auf Unterlage.","Regelmäßige Unterbrechungen: alle 45–60 Minuten Bewegungspausen.","Ergonomie ist ausschließlich für Büroarbeitsplätze relevant."],
   r:[0,1,2],e:"Ergonomie (ArbStättV): Bildschirmarbeitsplatzverordnung regelt Monitor, Beleuchtung, Klima. Produktionsergonomie: Hebelasten (max. 25 kg für Männer, 15 kg für Frauen gelegentlich), Griffhöhen, Wiederholbewegungen (Muskel-Skelett-Erkrankungen = häufigste Fehlzeitenursache)."},

  {id:"B13",k:"BGM",s:"mittel",q:"Was sind Symptome und Ursachen von chronischem Stress?",
   a:["Symptome: Schlafstörungen, Konzentrationsprobleme, erhöhte Reizbarkeit, Magen-Darm-Beschwerden.","Ursachen: Überforderung, Kontrollverlust, soziale Konflikte, Rollenunklarheit.","Chronischer Stress erhöht das Risiko für Herz-Kreislauf-Erkrankungen, Depression, Burnout.","Stress ist ausschließlich durch medikamentöse Behandlung reduzierbar."],
   r:[0,1,2],e:"Karasek-Modell: Stress entsteht wenn Anforderungen hoch UND Handlungsspielraum niedrig. Lösung: entweder Anforderungen reduzieren ODER Handlungsspielraum erhöhen. FK kann beides beeinflussen. Soziale Unterstützung puffert Stresswirkung."},

  {id:"B14",k:"BGM",s:"schwer",q:"Was sind evidenzbasierte Stressbewältigungsstrategien?",
   a:["Problemorientiertes Coping: Stressor direkt angehen und verändern.","Emotionsorientiertes Coping: eigene Reaktion auf Stressor regulieren.","Bewegung und Sport: nachweislich stressreduzierend durch Cortisolabbau.","Vermeidungscoping (Stressor ignorieren) ist langfristig die effektivste Strategie."],
   r:[0,1,2],e:"Lazarus Coping: Problemorientiert wenn Stressor veränderbar, emotionsorientiert wenn nicht. Vermeidung = kurzfristig entlastend, langfristig problematisch. Bewegung: 30 Min/Tag moderate Aktivität reduziert Cortisol signifikant. Achtsamkeit (MBSR) = evidenzbasiert."},

  {id:"B15",k:"BGM",s:"mittel",q:"Was beschreibt das Konzept 'Präsentismus'?",
   a:["Krank oder eingeschränkt arbeitsfähig trotzdem zur Arbeit erscheinen.","Präsentismus kostet Unternehmen mehr als Absentismus (Fehlzeiten).","Ursachen: Arbeitsdruck, Angst vor Konsequenzen, fehlende Vertretungsregelungen.","Präsentismus ist ein positives Zeichen von hohem Engagement."],
   r:[0,1,2],e:"Johns (2010): Präsentismus kostet ca. 2-3× mehr als Absentismus (Fehler, langsame Genesung, Ansteckung). FK-Signale die Präsentismus fördern: 'Du fehlst schon wieder', Lob für Kommen trotz Krankheit. BGM-Aufgabe: Präsentismus-Kultur abbauen."},

  {id:"B16",k:"BGM",s:"leicht",q:"Was sind Aufgaben des Betriebsarztes?",
   a:["Arbeitsmedizinische Vorsorgeuntersuchungen durchführen und bewerten.","Bei der Gefährdungsbeurteilung beraten und unterstützen.","Betriebsbegehungen zur Identifikation von Gesundheitsrisiken.","Der Betriebsarzt entscheidet ob ein MA arbeitsfähig ist oder nicht."],
   r:[0,1,2],e:"Betriebsarzt (ASiG): beratende Funktion — trifft keine Entscheidungen über Arbeitsfähigkeit (das ist Aufgabe des behandelnden Arztes). Schweigepflicht gegenüber AG. FK darf Betriebsarzt nicht auffordern, MA-Diagnosen mitzuteilen."},

  {id:"B17",k:"BGM",s:"mittel",q:"Was sind Faktoren einer gesundheitsförderlichen Führung?",
   a:["Klare Kommunikation: Erwartungen, Ziele und Rahmenbedingungen transparent machen.","Wertschätzung: regelmäßige, echte Anerkennung von Leistungen.","Handlungsspielräume geben: MA Einfluss auf ihre Arbeit ermöglichen.","Gesunde Führung bedeutet: MA niemals kritisieren oder fordern."],
   r:[0,1,2],e:"Gesundheitsförderliche Führung (Stadler/Spieß): Klarheit + Wertschätzung + Autonomie. Karasek: Handlungsspielraum puffert Stresswirkung. BGM-Studie: FK-Verhalten erklärt 30-40% der MA-Gesundheit im Betrieb."},

  {id:"B18",k:"BGM",s:"schwer",q:"Was beschreibt das Demand-Control-Support-Modell nach Karasek/Johnson?",
   a:["Hohe Anforderungen + niedriger Handlungsspielraum = höchstes Stress-/Erkrankungsrisiko.","Soziale Unterstützung durch FK und Kollegen puffert die Stresswirkung.","Aktive Arbeit (hohe Anforderungen + hoher Handlungsspielraum) = motivierend, Lernchance.","Stress entsteht ausschließlich durch zu viel Arbeit, nicht durch Handlungsspielraum."],
   r:[0,1,2],e:"Karasek/Johnson-Modell: 4 Quadranten. High Strain (hohe Anforderung, niedrig Kontrolle) = höchstes Herzinfarktrisiko. Active Job (hoch/hoch) = motivierend. FK kann Kontrolle erhöhen durch Delegation + klare Ziele statt Micromanagement."},

  {id:"B19",k:"BGM",s:"mittel",q:"Was sind Ziele einer Gefährdungsbeurteilung psychischer Belastungen?",
   a:["Psychische Belastungen systematisch identifizieren (Arbeitsintensität, Emotionsarbeit, soziale Beziehungen).","Maßnahmen zur Reduzierung entwickeln und dokumentieren.","Wirksamkeit der Maßnahmen überprüfen (PDCA-Zyklus).","Psychische Gefährdungsbeurteilungen sind in Deutschland freiwillig."],
   r:[0,1,2],e:"§5 ArbSchG: Pflicht des AG seit 2013 auch für psychische Belastungen. GBU-Psyche: Arbeitsintensität, Handlungsspielraum, soziale Unterstützung, Arbeitszeit, emotionale Anforderungen. Häufiger Fehler: GBU wird durchgeführt, Maßnahmen aber nicht umgesetzt."},

  {id:"B20",k:"BGM",s:"leicht",q:"Was sind Angebote eines umfassenden BGM-Programms?",
   a:["Verhaltensebene: Gesundheitskurse, Raucherentwöhnung, Ernährungsberatung.","Verhältnisebene: Ergonomie, Arbeitszeitgestaltung, Führungskräfteentwicklung.","Employee Assistance Program (EAP): externe Beratung für private und berufliche Probleme.","BGM-Programme sind ausschließlich für MA unter 40 Jahren wirksam."],
   r:[0,1,2],e:"Ganzheitliches BGM: Verhalten (individuelle Maßnahmen) + Verhältnisse (strukturelle Maßnahmen) + Führung (FK als Gesundheitsarchitekt). EAP: externe, anonyme Beratung — niedrigschwellig und wirksam. ROI BGM: 1:2,70 bis 1:10 je nach Studie."},

  // ── DIGITAL LEADERSHIP (D01–D15) — neue Kategorie ─────────────────────────
  {id:"D01",k:"Digital Leadership",s:"leicht",q:"Was sind Kernkompetenzen eines Chief Digital Officers (CDO)?",
   a:["Digitale Strategie entwickeln und implementieren.","Change Management: digitale Transformation mit Mitarbeitenden gestalten.","Technologie-Know-how kombiniert mit Führungs- und Kommunikationskompetenz.","CDO-Aufgabe ist ausschließlich die Beschaffung von IT-Hardware."],
   r:[0,1,2],e:"CDO: 3 Kernkompetenzen = Digital Strategy (Was digitalisieren? Warum?) + Change (Wie Menschen mitnehmen?) + Technology Literacy (Möglichkeiten kennen ohne selbst programmieren zu müssen). FK-Rolle: Brücke zwischen Business und IT."},

  {id:"D02",k:"Digital Leadership",s:"mittel",q:"Was beschreibt der Reifegrad-Ansatz der digitalen Transformation?",
   a:["Unternehmen durchlaufen Stufen: Digitalisierung → Digitale Optimierung → Digitale Transformation.","Digitalisierung: analoge Prozesse digital abbilden (z.B. Papier → PDF).","Digitale Transformation: Geschäftsmodelle und Wertschöpfung grundlegend verändern.","Digitalisierung und digitale Transformation sind identisch."],
   r:[0,1,2],e:"Reifegrade: 1)Digitization (analog → digital) 2)Digitalization (Prozesse optimieren mit digitalen Mitteln) 3)Digital Transformation (neues Geschäftsmodell, neue Wertschöpfung). Viele Unternehmen verwechseln Stufe 1 mit Stufe 3."},

  {id:"D03",k:"Digital Leadership",s:"mittel",q:"Was sind typische Widerstände gegen Digitalisierung in Unternehmen?",
   a:["Angst vor Jobverlust durch Automatisierung.","Komfortzonen: bewährte Prozesse aufzugeben kostet Überwindung.","Fehlende digitale Kompetenz erzeugt Unsicherheit und Abwehr.","Widerstand gegen Digitalisierung ist ausschließlich auf ältere MA über 50 beschränkt."],
   r:[0,1,2],e:"Digitalisierungswiderstände sind altersunabhängig — viele Digital Natives zeigen Widerstand wenn ihr Arbeitsbereich betroffen ist. Strategie: Kompetenzaufbau (Schulung), Beteiligung (Co-Design), Kommunikation (Warum? Was ändert sich nicht?)."},

  {id:"D04",k:"Digital Leadership",s:"leicht",q:"Was beschreibt OKR (Objectives & Key Results)?",
   a:["Zielrahmenwerk: Objectives = ambitionierte qualitative Ziele, Key Results = messbare Ergebnisse.","Transparenz: OKRs sind für alle sichtbar (keine Silos).","Kurze Zyklen: OKRs werden quartalsweise (nicht jährlich) gesetzt.","OKR ersetzt vollständig die klassische Personalbeurteilung."],
   r:[0,1,2],e:"OKR (Doerr/Google): Objective = inspirierende Richtung ('Wir werden der qualitativ beste Lieferant in Europa'). Key Result = messbar, zeitgebunden. 3–5 KRs pro Objective. 70% Zielerreichung = Erfolg (zu leichte Ziele sind falsch). OKR ergänzt MA-Gespräche."},

  {id:"D05",k:"Digital Leadership",s:"mittel",q:"Was ist künstliche Intelligenz (KI) und welche Arten gibt es?",
   a:["KI: Systeme die menschenähnliche kognitive Fähigkeiten simulieren (Lernen, Schlussfolgern).","Narrow AI: auf eine spezifische Aufgabe spezialisiert (z.B. Bilderkennung, Empfehlung).","Generative AI (z.B. ChatGPT): erzeugt neue Inhalte (Text, Bild, Code) basierend auf Training.","Aktuelle KI-Systeme haben allgemeines Bewusstsein und können jede menschliche Aufgabe erledigen."],
   r:[0,1,2],e:"Narrow AI = heute verfügbar und weit verbreitet. General AI (AGI) = theoretisch, noch nicht realisiert. Generative KI: große Sprachmodelle (LLMs) wie GPT, Claude — erzeugen Texte durch Mustererkennung. Keine echte 'Intelligenz' oder Bewusstsein."},

  {id:"D06",k:"Digital Leadership",s:"mittel",q:"Was sind Einsatzbereiche von KI in der Produktion (Industrie 4.0)?",
   a:["Predictive Maintenance: Maschinenausfälle vorhersagen bevor sie eintreten.","Qualitätskontrolle: Bildverarbeitung erkennt Fehler schneller und zuverlässiger als Menschen.","Prozessoptimierung: KI optimiert Taktzeiten, Durchlaufzeiten, Rüstzeiten.","KI kann in der Produktion ausschließlich administrative Aufgaben übernehmen."],
   r:[0,1,2],e:"Industrie 4.0 KI-Anwendungen: Predictive Maintenance (senkt ungeplante Stillstände um 30-50%), Qualitätskontrolle (Defect Detection >99% Genauigkeit), Prozessoptimierung (OEE-Steigerung). Shopfloor + KI = Andi's Kernkompetenz-Kombination."},

  {id:"D07",k:"Digital Leadership",s:"leicht",q:"Was beschreibt Datenkompetenz (Data Literacy) als Führungsfähigkeit?",
   a:["Fähigkeit, Daten zu lesen, zu interpretieren und für Entscheidungen zu nutzen.","Kritische Bewertung: Daten können manipuliert oder fehlinterpretiert sein.","Kommunikation von Daten: Erkenntnisse verständlich für nicht-technische Stakeholder.","Data Literacy erfordert, selbst programmieren zu können (Python, SQL)."],
   r:[0,1,2],e:"Data Literacy ≠ Data Science. FK muss keine Algorithmen schreiben können, aber: KPIs verstehen, Diagramme interpretieren, Fehlschlüsse erkennen (Korrelation ≠ Kausalität). Im Shopfloor: OEE-Dashboard verstehen = bereits Data Literacy."},

  {id:"D08",k:"Digital Leadership",s:"mittel",q:"Was sind Prinzipien agiler Methoden (Scrum, Kanban)?",
   a:["Scrum: iterative Sprints (1–4 Wochen), Daily Standups, klare Rollen (PO, SM, Team).","Kanban: kontinuierlicher Fluss, WIP-Limits (Work in Progress), Engpässe sichtbar machen.","Beide Methoden: Transparenz über den Arbeitsstand für alle Beteiligten.","Agile Methoden sind ausschließlich für Softwareentwicklung geeignet."],
   r:[0,1,2],e:"Scrum = strukturiert, iterativ (gut für neue Produkte). Kanban = fließend, kontinuierlich (gut für Support und Betrieb). Beide in Produktion: Kanban-Boards für KVP-Teams, Scrum für Digitalisierungsprojekte. Shopfloor-Management = analoges Kanban."},

  {id:"D09",k:"Digital Leadership",s:"schwer",q:"Was beschreibt Design Thinking als Innovationsmethode?",
   a:["Menschenzentrierter Ansatz: Nutzerbedürfnisse zuerst verstehen, dann lösen.","5 Phasen: Empathize → Define → Ideate → Prototype → Test.","Fehler früh und günstig machen (Prototyping) statt erst bei Markteinführung.","Design Thinking ist ausschließlich für Produktdesigner relevant."],
   r:[0,1,2],e:"Design Thinking (IDEO/Stanford d.school): Empathy = Nutzer verstehen. Define = Problem präzise fassen. Ideate = divergent denken (Quantität vor Qualität). Prototype = schnell bauen. Test = validieren. Anwendbar auf Prozessprobleme im Shopfloor."},

  {id:"D10",k:"Digital Leadership",s:"mittel",q:"Was sind Erfolgsfaktoren für digitale Transformationsprojekte?",
   a:["Top-Management-Commitment: ohne Rückhalt von oben scheitern 70% aller Projekte.","MA-Einbindung: Betroffene zu Beteiligten machen (Co-Design statt Top-Down).","Quick Wins: frühe sichtbare Erfolge sichern Akzeptanz und Momentum.","Digitale Transformation kann vollständig an externe Berater delegiert werden."],
   r:[0,1,2],e:"McKinsey: 70% digitaler Transformationen scheitern. Hauptursachen: fehlende Führung, Widerstand MA, unklare Strategie. Erfolgsfaktoren: Vision + Commitment + Kompetenz + Quick Wins + Kommunikation. Externe Berater können unterstützen, aber nicht führen."},

  {id:"D11",k:"Digital Leadership",s:"leicht",q:"Was ist ein MVP (Minimum Viable Product) im agilen Kontext?",
   a:["Kleinstmögliche Version eines Produkts/Prozesses mit der wichtigsten Funktionalität.","Ziel: schnell echtes Nutzer-Feedback erhalten bevor mehr investiert wird.","'Build-Measure-Learn'-Zyklus: bauen → messen → lernen → iteration.","MVP bedeutet: ein möglichst vollständiges, perfektes Produkt auf den Markt bringen."],
   r:[0,1,2],e:"Ries (Lean Startup): MVP ≠ billiges Produkt. MVP = kleinste Einheit um wichtigste Hypothese zu testen. Im Shopfloor: Pilot-Linie für neue Digitallösung = MVP. Fehler vermeiden: zu lange entwickeln bevor getestet wird (Wasserfall-Falle)."},

  {id:"D12",k:"Digital Leadership",s:"schwer",q:"Was sind ethische Herausforderungen beim KI-Einsatz in Unternehmen?",
   a:["Bias: KI-Systeme können Diskriminierung aus Trainingsdaten reproduzieren und verstärken.","Transparenz: 'Black Box'-Entscheidungen sind für Betroffene nicht nachvollziehbar.","Datenschutz (DSGVO): personenbezogene Daten dürfen nicht ohne Rechtsgrundlage verarbeitet werden.","KI-Systeme sind immer objektiv und frei von Diskriminierung."],
   r:[0,1,2],e:"KI-Ethik (EU AI Act): Hochrisiko-KI (z.B. in HR: Einstellungs-KI) = strenge Anforderungen. Bias-Beispiel: Amazon-Einstellungs-KI diskriminierte Frauen weil Trainingsdaten von historisch männlich dominierter Belegschaft stammten. DSGVO: Betriebsrat bei MA-Monitoring einbinden."},

  {id:"D13",k:"Digital Leadership",s:"mittel",q:"Was beschreibt Lean Management in Verbindung mit Digitalisierung?",
   a:["Digitalisierung schlechter Prozesse macht schlechte Prozesse schneller — zuerst optimieren.","Lean-Prinzipien (Verschwendung eliminieren) sind Grundlage für erfolgreiche Digitalisierung.","Digitale Tools (MES, ERP) unterstützen Lean-Prinzipien: Transparenz, Flussprinzip, Pull.","Lean und Digitalisierung widersprechen sich grundsätzlich."],
   r:[0,1,2],e:"'Digitize, don't Leanize later' — häufiger Fehler. Lean first, then digital: Toyota-Prinzip. MES (Manufacturing Execution System) = digitales Shopfloor-Management. OEE-Monitoring in Echtzeit = Lean-Kennzahl + digitales Tool. Andi's Kernthema."},

  {id:"D14",k:"Digital Leadership",s:"leicht",q:"Was beschreibt Cybersecurity als Führungsaufgabe?",
   a:["MA-Sensibilisierung: Phishing, Social Engineering, Passwort-Hygiene.","Prozesse für Datensicherheit etablieren (wer darf auf was zugreifen).","Incident Response: klare Eskalationswege wenn Sicherheitsvorfälle auftreten.","Cybersecurity ist ausschließlich Aufgabe der IT-Abteilung."],
   r:[0,1,2],e:"80% der Cyberangriffe nutzen menschliche Schwachstellen (Social Engineering, Phishing). FK-Aufgabe: Bewusstsein schaffen, Prozesse etablieren, Meldewege klären. 'Security by Design': Sicherheit von Anfang an mitdenken, nicht nachträglich."},

  {id:"D15",k:"Digital Leadership",s:"schwer",q:"Was sind Kennzahlen (KPIs) für digitale Transformationen?",
   a:["Prozess-KPIs: Durchlaufzeit-Reduktion, Fehlerquote, Automatisierungsgrad.","Mitarbeiter-KPIs: digitale Kompetenz-Score, Akzeptanzrate neuer Tools.","Business Impact KPIs: ROI der Digitalisierung, Umsatz durch neue digitale Kanäle.","Digitale Transformation kann nicht gemessen werden — nur qualitativ bewertet."],
   r:[0,1,2],e:"KPI-Systematik für Digitalisierung: Input (Investition), Output (Automatisierungsgrad, Fehlerquote), Outcome (Kundenzufriedenheit, Durchlaufzeit) und Impact (ROI, strategischer Wettbewerbsvorteil). OEE = perfekter KPI für Produktionsdigitalisierung."},

  // ── FÜHRUNG BONUS (F33–F37) ────────────────────────────────────────────────
  {id:"F33",k:"Führung",s:"mittel",q:"Was beschreibt das Konzept der kollegialen Führung (Shared Leadership)?",
   a:["Führungsaufgaben werden auf mehrere Schultern im Team verteilt.","Nicht eine Person führt — das Team übernimmt Führungsfunktionen situativ.","Voraussetzung: hoher Reifegrad aller Teammitglieder (R4 nach Hersey/Blanchard).","Shared Leadership ersetzt immer die formale Führungskraft vollständig."],
   r:[0,1,2],e:"Shared Leadership: Teammitglied mit höchster Kompetenz für ein Thema übernimmt temporär die Führung. Selbstorganisierte Teams (Scrum, Holakratie). Voraussetzung: Vertrauen, Kompetenz, psychologische Sicherheit. FK-Rolle wandelt sich zum Coach/Enabler."},

  {id:"F34",k:"Führung",s:"leicht",q:"Was sind Merkmale einer wirksamen Teambesprechung (Shopfloor-Meeting)?",
   a:["Regelmäßig und zur festen Zeit (Ritualcharakter schafft Verbindlichkeit).","Kurz und fokussiert: stehend, Agenda, max. 15-20 Minuten.","Kennzahlen sichtbar machen: OEE, Fehler, Fehlzeiten — Fakten statt Meinungen.","Teamgespräche ohne Agenda und ohne Zeitlimit sind am effektivsten."],
   r:[0,1,2],e:"Shopfloor Management: Tägliche Stand-ups vor Ort, Kennzahlen-Boards (visuelles Management), Probleme sofort ansprechen. Toyota-Prinzip: 'Geh hin, sieh selbst' (Gemba). MbWA auf Systemebene. Direkter Transfer zur täglichen Führungspraxis."},

  {id:"F35",k:"Führung",s:"schwer",q:"Was beschreibt das Modell der 4 Disziplinen der Umsetzung (4DX)?",
   a:["Fokus auf das Wichtigste (Wildly Important Goal, WIG): weniger ist mehr.","Handeln auf die Vorlaufindikatoren (Lead Measures), nicht die Ergebnisse (Lag Measures).","Führen eines verbindlichen Scoreboards: Fortschritt für alle sichtbar machen.","Gegenseitige Rechenschaft (Accountability): regelmäßige Commitments im Team."],
   r:[0,1,2,3],e:"McChesney/Covey (4DX): 1)WIG (ein klares Hauptziel) 2)Lead Measures (was kann ich heute tun?) 3)Scoreboard (visuell, motivierend) 4)Accountability-Meeting (weekly, 20 Min.: Was habe ich letzte Woche getan? Was tue ich diese Woche?). Direkte Verbindung zu KVP und OKR."},

  {id:"F36",k:"Führung",s:"mittel",q:"Was beschreibt Empowerment als Führungskonzept?",
   a:["MA erhalten Befugnisse, Ressourcen und Informationen, um eigenständig zu entscheiden.","Empowerment steigert Motivation, Eigenverantwortung und Reaktionsgeschwindigkeit.","Voraussetzungen: klare Ziele, ausreichende Kompetenz, Fehlertoleranz der FK.","Empowerment ist nur für hochqualifizierte Wissensarbeiter geeignet."],
   r:[0,1,2],e:"Empowerment ≠ Kontrollverlust. Rahmen setzen (Ziele, Grenzen) + Freiheit geben (wie) = Empowerment. Marquet: 'Move the authority to the information, not the information to the authority.' Im Shopfloor: Schichtführer ermächtigen, Produktionsprobleme direkt zu lösen."},

  {id:"F37",k:"Führung",s:"leicht",q:"Was ist der Unterschied zwischen operativer und strategischer Führung?",
   a:["Operative Führung: kurzfristig, Tagesgeschäft, konkrete Aufgaben und Probleme.","Strategische Führung: langfristig, Richtungsentscheidungen, Zukunftssicherung.","FK auf allen Ebenen müssen beide Perspektiven verbinden können.","Strategische Führung ist ausschließlich Aufgabe des Top-Managements."],
   r:[0,1,2],e:"Operative FK (Meister, Schichtführer): dominiert operativ, aber kennt strategischen Kontext. Middle Management: Verbindungsglied = übersetzt Strategie in operative Maßnahmen. Fehler: FK nur im Tagesgeschäft → keine Entwicklung, kein Wandel möglich."},
]

// ── UTILS ──────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const KATEGORIEN = [...new Set(DB.map(f => f.k))]
const FARBEN: Record<string, string> = {
  "Führung": "#3B82F6", "Kommunikation": "#10B981", "Motivation": "#F59E0B",
  "Konflikt": "#EF4444", "Personal": "#8B5CF6", "BGM": "#EC4899", "Digital Leadership": "#06B6D4",
}
const SCHWFARBE: Record<string, string> = { leicht: "#10B981", mittel: "#F59E0B", schwer: "#EF4444" }

// ── TYPES ──────────────────────────────────────────────────────────────────
type Screen = "home" | "quiz" | "result" | "stats"
type Mode = "pruefung" | "lern" | "schwach"

interface Frage {
  id: string; k: string; s: string; q: string; a: string[]; r: number[]; e: string
}
interface ShuffledFrage extends Frage {
  sa: string[]; // shuffled answers
  im: number[]; // index map: sa[i] = original a[im[i]]
}
interface Ergebnis { id: string; korrekt: boolean }
interface CatStat { correct: number; wrong: number }
interface LocalStats {
  totalCorrect: number; totalWrong: number
  byQuestion: Record<string, { correct: number; wrong: number }>
  byCat: Record<string, CatStat>
}

function prepFrage(f: Frage): ShuffledFrage {
  const indices = f.a.map((_, i) => i)
  const shuffled = shuffle(indices)
  return { ...f, sa: shuffled.map(i => f.a[i]), im: shuffled }
}

function loadStats(): LocalStats {
  if (typeof window === 'undefined') return { totalCorrect: 0, totalWrong: 0, byQuestion: {}, byCat: {} }
  try {
    const raw = localStorage.getItem('cle_stats')
    if (raw) return JSON.parse(raw)
  } catch {}
  return { totalCorrect: 0, totalWrong: 0, byQuestion: {}, byCat: {} }
}

function saveStats(stats: LocalStats) {
  try { localStorage.setItem('cle_stats', JSON.stringify(stats)) } catch {}
}

// ── ICONS (inline SVG to avoid import issues) ─────────────────────────────
const Icon = {
  brain: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  play: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>,
  x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  back: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="15 18 9 12 15 6"/></svg>,
  next: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="9 18 15 12 9 6"/></svg>,
  home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  zap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  book: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  bulb: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>,
  trophy: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><polyline points="8 21 12 21 12 11"/><path d="M20 3H4v10c0 4.418 3.582 8 8 8s8-3.582 8-8V3z"/><path d="M20 3c0 0 1 2 1 5s-1 5-1 5"/><path d="M4 3c0 0-1 2-1 5s1 5 1 5"/></svg>,
  filter: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  trash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
}

// ── MAIN ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("home")
  const [mode, setMode] = useState<Mode>("pruefung")
  const [katFilter, setKatFilter] = useState("Alle")
  const [schwFilter, setSchwFilter] = useState("Alle")
  const [fragen, setFragen] = useState<ShuffledFrage[]>([])
  const [idx, setIdx] = useState(0)
  const [sel, setSel] = useState<number[]>([])
  const [confirmed, setConfirmed] = useState(false)
  const [erg, setErg] = useState<Ergebnis[]>([])
  const [t0, setT0] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [showExpl, setShowExpl] = useState(false)
  const [stats, setStats] = useState<LocalStats>({ totalCorrect: 0, totalWrong: 0, byQuestion: {}, byCat: {} })

  useEffect(() => { setStats(loadStats()) }, [])

  useEffect(() => {
    let t: ReturnType<typeof setInterval>
    if (screen === "quiz" && t0) {
      t = setInterval(() => setElapsed(Math.floor((Date.now() - t0!) / 1000)), 1000)
    }
    return () => clearInterval(t)
  }, [screen, t0])

  const wrongIds = Object.entries(stats.byQuestion)
    .filter(([, v]) => (v as {correct:number;wrong:number}).wrong > (v as {correct:number;wrong:number}).correct)
    .map(([k]) => k)

  const start = useCallback(() => {
    let pool = DB as Frage[]
    if (katFilter !== "Alle") pool = pool.filter(f => f.k === katFilter)
    if (schwFilter !== "Alle") pool = pool.filter(f => f.s === schwFilter)
    if (mode === "schwach" && wrongIds.length > 0) {
      const wp = pool.filter(f => wrongIds.includes(f.id))
      if (wp.length > 0) pool = wp
    }
    const s = shuffle(pool)
    const count = mode === "pruefung" ? Math.min(30, s.length) : s.length
    setFragen(s.slice(0, count).map(prepFrage))
    setIdx(0); setSel([]); setConfirmed(false); setErg([])
    setT0(Date.now()); setElapsed(0); setShowExpl(false)
    setScreen("quiz")
  }, [mode, katFilter, schwFilter, wrongIds])

  const toggle = (i: number) => { if (confirmed) return; setSel(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]) }

  const confirm = () => {
    if (!sel.length || confirmed) return
    const f = fragen[idx]
    const origSel = sel.map(si => f.im[si])
    const ok = new Set(f.r)
    const as = new Set(origSel)
    const korrekt = [...ok].every(r => as.has(r)) && [...as].every(a => ok.has(a))
    setConfirmed(true)
    setErg(e => [...e, { id: f.id, korrekt }])
    // Update stats immediately
    setStats(prev => {
      const bq = { ...prev.byQuestion }
      const entry = bq[f.id] || { correct: 0, wrong: 0 }
      bq[f.id] = { correct: entry.correct + (korrekt ? 1 : 0), wrong: entry.wrong + (korrekt ? 0 : 1) }
      const bc = { ...prev.byCat }
      const cat = bc[f.k] || { correct: 0, wrong: 0 }
      bc[f.k] = { correct: cat.correct + (korrekt ? 1 : 0), wrong: cat.wrong + (korrekt ? 0 : 1) }
      const next = {
        totalCorrect: prev.totalCorrect + (korrekt ? 1 : 0),
        totalWrong: prev.totalWrong + (korrekt ? 0 : 1),
        byQuestion: bq, byCat: bc
      }
      saveStats(next)
      return next
    })
  }

  const next = () => {
    if (idx + 1 >= fragen.length) { setScreen("result") }
    else { setIdx(i => i + 1); setSel([]); setConfirmed(false); setShowExpl(false) }
  }

  const frage = fragen[idx]
  const mm = Math.floor(elapsed / 60).toString().padStart(2, "0")
  const ss = (elapsed % 60).toString().padStart(2, "0")

  const getStatus = (si: number) => {
    if (!confirmed) return sel.includes(si) ? "sel" : "neu"
    const oi = frage.im[si]
    const isC = frage.r.includes(oi)
    const isS = sel.includes(si)
    if (isC && isS) return "ok"
    if (!isC && isS) return "bad"
    if (isC && !isS) return "miss"
    return "neu"
  }

  const totalAnswered = stats.totalCorrect + stats.totalWrong
  const pctGlobal = totalAnswered > 0 ? Math.round((stats.totalCorrect / totalAnswered) * 100) : 0

  // ── HOME ─────────────────────────────────────────────────────────────────
  if (screen === "home") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", color: "white", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "32px 16px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg, #3B82F6, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", boxShadow: "0 0 40px #3B82F630" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" style={{ width: 40, height: 40 }}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1 }}>CLE Quiz</div>
          <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Certified Leadership Expert · IHK · {DB.length} Fragen</div>
        </div>

        {/* Stats bar */}
        {totalAnswered > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
            {[
              { v: totalAnswered, l: "Beantwortet", c: "#3B82F6" },
              { v: `${pctGlobal}%`, l: "Quote", c: pctGlobal >= 70 ? "#10B981" : "#F59E0B" },
              { v: wrongIds.length, l: "Schwächen", c: "#EF4444" },
            ].map(s => (
              <div key={s.l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "10px 0", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: 11, color: "#475569" }}>{s.l}</div>
              </div>
            ))}
          </div>
        )}

        {/* Mode */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Modus</div>
          {([
            { id: "pruefung" as Mode, icon: Icon.clock, label: "Prüfungs-Simulation", desc: "30 Fragen · IHK-Format · 70% zum Bestehen", c: "#3B82F6" },
            { id: "lern" as Mode, icon: Icon.book, label: "Lern-Modus", desc: "Alle Fragen mit Erklärung nach jeder Antwort", c: "#10B981" },
            { id: "schwach" as Mode, icon: Icon.zap, label: "Schwächen-Training", desc: `${wrongIds.length} falsch beantwortete Fragen wiederholen`, c: "#F59E0B" },
          ] as const).map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              style={{ width: "100%", padding: "12px 14px", borderRadius: 14, border: `1px solid ${mode === m.id ? m.c + "60" : "rgba(255,255,255,0.06)"}`, background: mode === m.id ? m.c + "15" : "rgba(255,255,255,0.02)", color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, marginBottom: 6, textAlign: "left" }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: m.c + "20", display: "flex", alignItems: "center", justifyContent: "center", color: m.c, flexShrink: 0 }}>{m.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{m.label}</div>
                <div style={{ fontSize: 11, color: "#64748B" }}>{m.desc}</div>
              </div>
              {mode === m.id && <div style={{ color: m.c }}>{Icon.check}</div>}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>{Icon.filter} Filter (optional)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
            {["Alle", ...KATEGORIEN].map(k => {
              const c = FARBEN[k] || "#3B82F6"
              const active = katFilter === k
              return (
                <button key={k} onClick={() => setKatFilter(k)}
                  style={{ padding: "5px 10px", borderRadius: 8, border: `1px solid ${active ? c + "70" : "rgba(255,255,255,0.08)"}`, background: active ? c + "20" : "rgba(255,255,255,0.03)", color: active ? c : "#64748B", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                  {k} {k !== "Alle" && `(${DB.filter(f => f.k === k).length})`}
                </button>
              )
            })}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["Alle", "leicht", "mittel", "schwer"].map(s => {
              const c = SCHWFARBE[s] || "#3B82F6"
              const active = schwFilter === s
              return (
                <button key={s} onClick={() => setSchwFilter(s)}
                  style={{ flex: 1, padding: "5px 0", borderRadius: 8, border: `1px solid ${active ? c + "70" : "rgba(255,255,255,0.08)"}`, background: active ? c + "20" : "rgba(255,255,255,0.03)", color: active ? c : "#64748B", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                  {s === "leicht" ? "🟢 leicht" : s === "mittel" ? "🟡 mittel" : s === "schwer" ? "🔴 schwer" : "Alle"}
                </button>
              )
            })}
          </div>
        </div>

        {/* Buttons */}
        <button onClick={start}
          style={{ width: "100%", padding: "16px 0", borderRadius: 16, background: "linear-gradient(135deg, #3B82F6, #06B6D4)", color: "white", fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 8px 30px #3B82F630", marginBottom: 8 }}>
          {Icon.play} Quiz starten
        </button>
        <button onClick={() => setScreen("stats")}
          style={{ width: "100%", padding: "13px 0", borderRadius: 16, background: "rgba(255,255,255,0.04)", color: "#94A3B8", fontSize: 13, fontWeight: 600, border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {Icon.chart} Statistik
        </button>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "#1E293B" }}>Ersteller: A.Neu</div>
      </div>
    </div>
  )

  // ── QUIZ ─────────────────────────────────────────────────────────────────
  if (screen === "quiz" && frage) {
    const progress = ((idx + 1) / fragen.length) * 100
    const fc = FARBEN[frage.k] || "#3B82F6"
    const correctSoFar = erg.filter(e => e.korrekt).length
    const lastKorrekt = erg[erg.length - 1]?.korrekt

    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "white", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>

          {/* Top bar */}
          <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(15,23,42,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <button onClick={() => setScreen("home")} style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "none", color: "#94A3B8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{Icon.back}</button>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 800 }}>{idx + 1} <span style={{ color: "#475569", fontWeight: 400 }}>/ {fragen.length}</span></div>
                {mode === "pruefung" && <div style={{ fontSize: 11, color: "#475569" }}>{mm}:{ss}</div>}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>
                <span style={{ color: "#10B981" }}>{correctSoFar}</span>
                <span style={{ color: "#475569" }}> /{erg.length}</span>
              </div>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${fc}, ${fc}88)`, width: `${progress}%`, transition: "width 0.3s" }} />
            </div>
          </div>

          <div style={{ padding: "20px 16px" }}>
            {/* Meta badges */}
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              <span style={{ padding: "3px 10px", borderRadius: 7, fontSize: 11, fontWeight: 700, background: fc + "20", color: fc, border: `1px solid ${fc}40` }}>{frage.k}</span>
              <span style={{ padding: "3px 8px", borderRadius: 7, fontSize: 11, fontWeight: 600, background: SCHWFARBE[frage.s] + "15", color: SCHWFARBE[frage.s], border: `1px solid ${SCHWFARBE[frage.s]}30` }}>
                {frage.s === "leicht" ? "🟢" : frage.s === "mittel" ? "🟡" : "🔴"} {frage.s}
              </span>
              <span style={{ fontSize: 11, color: "#334155", marginLeft: "auto", alignSelf: "center" }}>[{frage.id}]</span>
            </div>

            {/* Question */}
            <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.5, marginBottom: 6 }}>{frage.q}</div>
            <div style={{ fontSize: 11, color: "#475569", marginBottom: 18 }}>
              {frage.r.length === 1 ? "Eine richtige Antwort" : `${frage.r.length} richtige Antworten möglich`}
            </div>

            {/* Answers */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {frage.sa.map((a, i) => {
                const st = getStatus(i)
                const bc = st === "ok" ? "#10B981" : st === "bad" ? "#EF4444" : st === "miss" ? "#F59E0B" : st === "sel" ? fc : "rgba(255,255,255,0.08)"
                const bg = st === "ok" ? "#10B98112" : st === "bad" ? "#EF444412" : st === "miss" ? "#F59E0B10" : st === "sel" ? fc + "15" : "rgba(255,255,255,0.02)"
                const tc = st === "ok" ? "#6EE7B7" : st === "bad" ? "#FCA5A5" : st === "miss" ? "#FCD34D" : "#CBD5E1"
                return (
                  <button key={i} onClick={() => toggle(i)} disabled={confirmed}
                    style={{ padding: "14px", borderRadius: 14, border: `1.5px solid ${bc}`, background: bg, color: tc, cursor: confirmed ? "default" : "pointer", display: "flex", alignItems: "flex-start", gap: 12, textAlign: "left", transition: "all 0.15s" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${bc}`, background: (st === "ok" || st === "bad" || st === "sel") ? bc : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, color: "white" }}>
                      {st === "ok" && Icon.check}
                      {st === "bad" && Icon.x}
                      {st === "miss" && <span style={{ fontSize: 10, fontWeight: 900 }}>!</span>}
                      {st === "sel" && !confirmed && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />}
                    </div>
                    <span style={{ fontSize: 13, lineHeight: 1.5 }}>{a}</span>
                  </button>
                )
              })}
            </div>

            {/* Feedback */}
            {confirmed && (
              <div style={{ borderRadius: 14, border: `1px solid ${lastKorrekt ? "#10B98140" : "#EF444440"}`, background: lastKorrekt ? "#10B98110" : "#EF444410", padding: "14px", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: showExpl ? 10 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: lastKorrekt ? "#10B981" : "#EF4444", fontSize: 16 }}>{lastKorrekt ? "✓" : "✗"}</span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: lastKorrekt ? "#10B981" : "#EF4444" }}>{lastKorrekt ? "Richtig!" : "Nicht vollständig korrekt"}</span>
                  </div>
                  <button onClick={() => setShowExpl(p => !p)}
                    style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#F59E0B", background: "#F59E0B15", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 6 }}>
                    {Icon.bulb} {showExpl ? "Schließen" : "Erklärung"}
                  </button>
                </div>
                {showExpl && (
                  <div style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.6, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10 }}>
                    {frage.e}
                    {!lastKorrekt && (
                      <div style={{ marginTop: 8, fontSize: 11, color: "#FCD34D" }}>
                        ✓ Richtig: {frage.r.map(ri => frage.sa[frage.im.indexOf(ri)]).join(" | ")}
                      </div>
                    )}
                  </div>
                )}
                {mode === "lern" && !showExpl && (
                  <div style={{ marginTop: 8, fontSize: 11, color: "#CBD5E1", lineHeight: 1.6 }}>{frage.e}</div>
                )}
              </div>
            )}

            {/* Action button */}
            {!confirmed
              ? <button onClick={confirm} disabled={!sel.length}
                  style={{ width: "100%", padding: "15px 0", borderRadius: 16, background: sel.length ? `linear-gradient(135deg, ${fc}, ${fc}88)` : "rgba(255,255,255,0.04)", color: sel.length ? "white" : "#475569", fontSize: 14, fontWeight: 800, border: "none", cursor: sel.length ? "pointer" : "default", boxShadow: sel.length ? `0 6px 20px ${fc}30` : "none" }}>
                  Antwort bestätigen
                </button>
              : <button onClick={next}
                  style={{ width: "100%", padding: "15px 0", borderRadius: 16, background: "linear-gradient(135deg, #3B82F6, #06B6D4)", color: "white", fontSize: 14, fontWeight: 800, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 6px 20px #3B82F630" }}>
                  {idx + 1 >= fragen.length ? "Ergebnis anzeigen" : "Nächste Frage"} {Icon.next}
                </button>
            }
          </div>
        </div>
      </div>
    )
  }

  // ── RESULT ────────────────────────────────────────────────────────────────
  if (screen === "result") {
    const total = erg.length
    const correct = erg.filter(e => e.korrekt).length
    const pct = Math.round((correct / total) * 100)
    const passed = pct >= 70
    const wrongFragen = fragen.filter(f => erg.find(e => e.id === f.id && !e.korrekt))

    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "white", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div style={{ maxWidth: 420, margin: "0 auto", padding: "32px 16px" }}>

          {/* Score header */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 100, height: 100, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", background: pct >= 85 ? "linear-gradient(135deg, #F59E0B, #D97706)" : passed ? "linear-gradient(135deg, #10B981, #059669)" : "linear-gradient(135deg, #334155, #1E293B)", boxShadow: pct >= 85 ? "0 0 40px #F59E0B40" : passed ? "0 0 40px #10B98140" : "none" }}>
              {pct >= 85 ? Icon.trophy : passed
                ? <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ width: 48, height: 48 }}><polyline points="20 6 9 17 4 12"/></svg>
                : <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ width: 48, height: 48 }}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>}
            </div>
            <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1, color: passed ? "#10B981" : "#EF4444" }}>{pct}%</div>
            <div style={{ color: "#64748B", marginTop: 4, fontSize: 14 }}>{correct} von {total} richtig · {mm}:{ss}</div>
            <div style={{ display: "inline-block", marginTop: 10, padding: "6px 16px", borderRadius: 99, fontSize: 13, fontWeight: 700, background: pct >= 85 ? "#F59E0B20" : passed ? "#10B98120" : "#EF444420", color: pct >= 85 ? "#F59E0B" : passed ? "#10B981" : "#EF4444", border: `1px solid ${pct >= 85 ? "#F59E0B40" : passed ? "#10B98140" : "#EF444440"}` }}>
              {pct >= 85 ? "🎯 Exzellent — Note GUT!" : passed ? "✓ Bestanden" : "📖 Noch nicht bestanden — weiter üben!"}
            </div>
          </div>

          {/* Thresholds */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
            {[{ l: "70% Bestehen", v: 70 }, { l: "85% Ziel 'Gut'", v: 85 }].map(({ l, v }) => (
              <div key={v} style={{ background: pct >= v ? "#10B98110" : "rgba(255,255,255,0.03)", border: `1px solid ${pct >= v ? "#10B98140" : "rgba(255,255,255,0.06)"}`, borderRadius: 12, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: pct >= v ? "#10B981" : "#475569" }}>{pct >= v ? "✓" : "✗"}</div>
                <div style={{ fontSize: 11, color: "#64748B" }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Wrong answers */}
          {wrongFragen.length > 0 && (
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12, fontWeight: 700, color: "#EF4444", display: "flex", alignItems: "center", gap: 6 }}>
                ✗ {wrongFragen.length} falsch beantwortet
              </div>
              <div style={{ maxHeight: 220, overflowY: "auto" }}>
                {wrongFragen.map(f => (
                  <div key={f.id} style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ fontSize: 10, color: FARBEN[f.k] || "#3B82F6", fontWeight: 700, marginBottom: 3 }}>{f.k} [{f.id}]</div>
                    <div style={{ fontSize: 12, color: "#CBD5E1", marginBottom: 4 }}>{f.q}</div>
                    <div style={{ fontSize: 11, color: "#10B981" }}>✓ {f.r.map(ri => f.a[ri]).join(" | ")}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <button onClick={() => setScreen("home")}
            style={{ width: "100%", padding: "15px 0", borderRadius: 16, background: "linear-gradient(135deg, #3B82F6, #06B6D4)", color: "white", fontSize: 14, fontWeight: 800, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8, boxShadow: "0 6px 20px #3B82F630" }}>
            {Icon.home} Zurück zum Start
          </button>
          {wrongFragen.length > 0 && (
            <button onClick={() => { setMode("schwach"); start() }}
              style={{ width: "100%", padding: "13px 0", borderRadius: 16, background: "rgba(255,255,255,0.04)", color: "#F59E0B", fontSize: 13, fontWeight: 700, border: "1px solid #F59E0B30", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {Icon.zap} Falsche nochmal üben
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── STATS ─────────────────────────────────────────────────────────────────
  if (screen === "stats") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "white", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div style={{ position: "sticky", top: 0, background: "rgba(15,23,42,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setScreen("home")} style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "none", color: "#94A3B8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{Icon.back}</button>
          <span style={{ fontWeight: 800, fontSize: 15 }}>Meine Statistik</span>
          <button onClick={() => { if (window.confirm("Statistik wirklich zurücksetzen?")) { const empty: LocalStats = { totalCorrect: 0, totalWrong: 0, byQuestion: {}, byCat: {} }; saveStats(empty); setStats(empty) } }}
            style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#EF4444", background: "#EF444415", border: "1px solid #EF444430", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>
            {Icon.trash} Reset
          </button>
        </div>
        <div style={{ padding: "20px 16px" }}>
          {totalAnswered > 0 ? (
            <>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 18, border: "1px solid rgba(255,255,255,0.06)", padding: "20px", marginBottom: 16, textAlign: "center" }}>
                <div style={{ fontSize: 52, fontWeight: 900, color: "#3B82F6" }}>{pctGlobal}%</div>
                <div style={{ fontSize: 12, color: "#475569" }}>Gesamtergebnis</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16 }}>
                  {[["✓", "#10B981", stats.totalCorrect, "Richtig"], ["✗", "#EF4444", stats.totalWrong, "Falsch"], ["∑", "#3B82F6", totalAnswered, "Gesamt"]].map(([ic, cl, v, lb]) => (
                    <div key={lb as string}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: cl as string }}>{v}</div>
                      <div style={{ fontSize: 11, color: "#475569" }}>{lb}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 18, border: "1px solid rgba(255,255,255,0.06)", padding: "16px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Nach Kategorie</div>
                {KATEGORIEN.map(cat => {
                  const bc = stats.byCat[cat] || { correct: 0, wrong: 0 }
                  const total = bc.correct + bc.wrong
                  const p = total > 0 ? Math.round((bc.correct / total) * 100) : 0
                  const c = FARBEN[cat] || "#3B82F6"
                  return (
                    <div key={cat} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                        <span style={{ color: c, fontWeight: 700 }}>{cat}</span>
                        <span style={{ color: p >= 70 ? "#10B981" : "#F59E0B", fontWeight: 800 }}>{total > 0 ? `${p}%` : "—"}</span>
                      </div>
                      <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                        {total > 0 && <div style={{ height: "100%", width: `${p}%`, background: c, borderRadius: 99 }} />}
                      </div>
                      <div style={{ fontSize: 10, color: "#334155", marginTop: 3 }}>✓ {bc.correct} · ✗ {bc.wrong} · {DB.filter(f => f.k === cat).length} Fragen gesamt</div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#334155" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
              <div style={{ fontSize: 14 }}>Noch keine Statistik vorhanden.</div>
              <button onClick={() => setScreen("home")} style={{ marginTop: 16, padding: "10px 24px", borderRadius: 12, background: "#3B82F6", color: "white", border: "none", cursor: "pointer", fontWeight: 700 }}>Quiz starten</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return null
}
