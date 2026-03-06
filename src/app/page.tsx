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
  "Konflikt": "#EF4444", "Personal": "#8B5CF6", "BGM": "#EC4899",
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
