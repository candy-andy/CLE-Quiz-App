'use client'

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, Target, BarChart3, Clock, 
  ArrowLeft, ArrowRight, RotateCcw, Zap, Brain, Home,
  BookOpen, GraduationCap, Timer, Star, Flame, Award,
  AlertTriangle, CheckCircle, XCircle
} from "lucide-react"

// ============================================================================
// FRAGEN-DATENBANK (207 Fragen: 87 Original + 120 Neue)
// ============================================================================
const ALLE_FRAGEN = [
// ==================== ORIGINAL FRAGEN (87) ====================
{id:"K01",k:"Konflikt",farbe:"#E74C3C",q:"Was ist die Definition eines Konflikts?",a:["Interessen, Ziele oder Wertvorstellungen sind miteinander unvereinbar oder erscheinen so.","Ein Konflikt entsteht nur durch persönliche Antipathie.","Konflikte sind ausschließlich negativ und destruktiv.","Konflikte sind sowohl Chance als auch Gefahr."],r:[0,3]},
{id:"K02",k:"Konflikt",farbe:"#E74C3C",q:"Welche betrieblichen Konfliktursachen sind korrekt beschrieben?",a:["Kompetenzkonflikte entstehen, wenn unklar ist, wer was entscheiden darf.","Sachkonflikte entstehen bei unterschiedlichem Kenntnisstand der Beteiligten.","Beziehungskonflikte entstehen bei gegenseitiger Abneigung.","Kompetenzkonflikte lassen sich grundsätzlich nicht vermeiden."],r:[0,1,2]},
{id:"K03",k:"Konflikt",farbe:"#E74C3C",q:"Welche Grundaussagen zum Umgang mit Konflikten treffen zu?",a:["Konflikte im Arbeitsalltag sind unvermeidbar.","Es gibt immer Belastungssituationen.","Konflikte werden durch persönliche UND strukturelle Faktoren verursacht.","Gutes Management kann Konflikte vollständig eliminieren."],r:[0,1,2]},
{id:"K04",k:"Konflikt",farbe:"#E74C3C",q:"Welcher Konflikttyp ist NICHT objektiv beweisbar?",a:["Bewertungskonflikt: rein subjektive Wertung, kein objektiver Maßstab möglich.","Beurteilungskonflikt: prinzipiell als richtig/falsch beweisbar.","Verteilungskonflikt: Streit um Ressourcenverteilung.","Beziehungskonflikt: emotional, meist mit Schuldzuweisungen."],r:[0]},
{id:"K05",k:"Konflikt",farbe:"#E74C3C",q:"Welche Lösungsansätze sind den Konfliktarten korrekt zugeordnet?",a:["Bewertungskonflikt → Ersatz der Bewertungskriterien","Beurteilungskonflikt → Informationen einholen, Beurteilungsunterschiede beseitigen","Beziehungskonflikt → Vorwurf in Wunsch/Bitte umwandeln","Verteilungskonflikt → Machteinsatz der Führungskraft"],r:[0,1,2]},
{id:"K06",k:"Konflikt",farbe:"#E74C3C",q:"Welche Eskalationsebenen nach Glasl sind korrekt zugeordnet?",a:["Sachebene → intern lösbar, Führungskraft als Moderator","Beziehungsebene → externer Mediator nötig","Zerstörungsebene → externe Machtinstanz (z.B. Gericht) nötig","Alle Stufen können intern durch die Führungskraft gelöst werden."],r:[0,1,2]},
{id:"K07",k:"Konflikt",farbe:"#E74C3C",q:"Was sind die 4 Säulen des Harvard-Modells?",a:["Menschen und Probleme getrennt behandeln","Interessen zählen, nicht die Machtpositionen","Optionen entwickeln, die beiden Vorteile bringen","Einigung auf neutrale Beurteilungskriterien"],r:[0,1,2,3]},
{id:"K08",k:"Konflikt",farbe:"#E74C3C",q:"Wie ist die 20-60-20-Regel bei Veränderungsprozessen verteilt?",a:["Bewahrer: ~20% — Widerstand, Status quo","Unentschlossene: ~60% — abwarten","Befürworter: ~20% — Neugier, Chancen","Die Mehrheit unterstützt Veränderungen von Anfang an aktiv."],r:[0,1,2]},
{id:"K09",k:"Konflikt",farbe:"#E74C3C",q:"Welche Aussagen zum 3-Phasen-Modell nach Lewin sind korrekt?",a:["Auftauen: Ist-Situation beschreiben, Änderungsgrund nennen","Ändern: kommunizieren, Vorteile zeigen, MA einbeziehen","Einfrieren: Dauerhaftigkeit sicherstellen, Prozesse überwachen","Die Phasenreihenfolge ist frei wählbar."],r:[0,1,2]},
{id:"K10",k:"Konflikt",farbe:"#E74C3C",q:"Was bedeutet Kaizen?",a:["KAI = Veränderung, ZEN = gut → permanenter Verbesserungsprozess","Kaizen bezieht sich nur auf Produktverbesserung.","Kaizen umfasst ALLE Prozesse: Entwicklung, Produktion, Vertrieb.","Qualität von Anfang an ist eine Kaizen-Zielsetzung."],r:[0,2,3]},
{id:"K11",k:"Konflikt",farbe:"#E74C3C",q:"Was kennzeichnet Innovation?",a:["Neuartige, fortschrittliche Lösung für ein bestimmtes Problem.","Inkrementelle Innovationen = schrittweise Verbesserungen.","Disruptive Innovationen verändern Märkte grundlegend.","Innovation bezieht sich ausschließlich auf neue Produkte."],r:[0,1,2]},
{id:"K12",k:"Konflikt",farbe:"#E74C3C",q:"Was ist aktives Zuhören?",a:["Paraphrasieren: Gesagtes in eigenen Worten wiederholen","Nachfragen bei Unklarheiten ohne zu unterbrechen","Sofort Lösungsvorschläge machen","Nonverbale Signale des Gesprächspartners wahrnehmen"],r:[0,1,3]},
{id:"K13",k:"Konflikt",farbe:"#E74C3C",q:"Was versteht man unter Mediation?",a:["Freiwilliges, strukturiertes Verfahren mit neutralem Dritten","Der Mediator entscheidet verbindlich für beide Parteien.","Ziel ist eine von beiden Seiten akzeptierte Lösung (Win-Win).","Mediation ersetzt immer das Gerichtsverfahren."],r:[0,2]},
{id:"K14",k:"Konflikt",farbe:"#E74C3C",q:"Was sind Merkmale eines konstruktiven Konfliktgesprächs?",a:["Ich-Botschaften statt Du-Vorwürfe","Vergangenheitsorientiert — alle alten Fehler aufzählen","Konkrete Verhaltensweisen ansprechen, nicht Persönlichkeit","Gemeinsam nach Lösungen suchen statt Schuldige finden"],r:[0,2,3]},
{id:"K15",k:"Konflikt",farbe:"#E74C3C",q:"Was sind Anzeichen für einen latenten Konflikt?",a:["Zurückgehaltene Meinungen und oberflächliche Zustimmung","Passiv-aggressives Verhalten","Offene, laute Auseinandersetzungen täglich","Sinkendes Engagement und innere Kündigung"],r:[0,1,3]},
{id:"K16",k:"Konflikt",farbe:"#E74C3C",q:"Welche Rolle spielt Empathie in der Konfliktlösung?",a:["Empathie ermöglicht das Verstehen der Perspektive des anderen.","Empathie bedeutet, der anderen Seite immer recht zu geben.","Empathie schafft Vertrauen und öffnet Gesprächsbereitschaft.","Empathie ist in professionellen Konflikten nicht relevant."],r:[0,2]},
{id:"K17",k:"Konflikt",farbe:"#E74C3C",q:"Was ist der Unterschied zwischen Position und Interesse?",a:["Position = was jemand fordert (Oberfläche)","Interesse = warum jemand etwas fordert (tiefer liegend)","Positionen und Interessen sind identisch.","Harvard-Modell: Interessen verhandeln, nicht Positionen"],r:[0,1,3]},
{id:"K18",k:"Konflikt",farbe:"#E74C3C",q:"Was kennzeichnet die Win-Win-Strategie?",a:["Beide Parteien erzielen einen Vorteil.","Eine Partei muss vollständig nachgeben.","Kreative Lösungen werden gemeinsam entwickelt.","Langfristige Beziehung hat Vorrang vor kurzfristigem Gewinn."],r:[0,2,3]},
{id:"K19",k:"Konflikt",farbe:"#E74C3C",q:"Was sind Ursachen für Kommunikationskonflikte?",a:["Unterschiedliche Bedeutung von Wörtern","Missverständnisse durch nonverbale Widersprüche","Zu viel direkte Kommunikation","Unterschiedliche Kommunikationsstile und -kulturen"],r:[0,1,3]},
{id:"K20",k:"Konflikt",farbe:"#E74C3C",q:"Was sind Deeskalationsmaßnahmen?",a:["Pause einlegen und Abstand gewinnen","Gemeinsamkeiten betonen statt Unterschiede","Vorwürfe und Schuldzuweisungen eskalieren","Neutral formulieren, keine Verallgemeinerungen"],r:[0,1,3]},
{id:"F01",k:"Führung",farbe:"#2471A3",q:"Was beschreiben Führungsstile?",a:["Verhaltensmuster einer FK gegenüber weisungsgebundenen MA","Typologien: standardisierte, vereinfachte Verhaltensmuster","Exakte wissenschaftliche Kategorien ohne Vereinfachungen","Universell anwendbar, unabhängig vom Kontext"],r:[0,1]},
{id:"F02",k:"Führung",farbe:"#2471A3",q:"Was kennzeichnet situative Führung nach Hersey & Blanchard?",a:["Führungsstil wird an den Reifegrad (Kompetenz + Motivation) angepasst.","4 Reifegrade (R1-R4) und 4 Führungsstile (S1-S4)","Ein einheitlicher Stil ist am effektivsten.","R1 (niedrige Kompetenz) → S1 Directing/Anweisen"],r:[0,1,3]},
{id:"F03",k:"Führung",farbe:"#2471A3",q:"Was sind Warnsignale für Burnout bei Führungskräften?",a:["Chronische Erschöpfung trotz ausreichender Erholung","Zynismus und Distanzierung gegenüber der Arbeit","Nachlassende Leistungsfähigkeit und Konzentration","Erhöhte Energie und gesteigerte Produktivität"],r:[0,1,2]},
{id:"F04",k:"Führung",farbe:"#2471A3",q:"Was sind Merkmale des kooperativen Führungsstils?",a:["MA werden in Entscheidungen einbezogen.","FK trifft alle Entscheidungen allein.","Offener Informationsaustausch und Transparenz","Eigenverantwortung der MA wird gefördert."],r:[0,2,3]},
{id:"F05",k:"Führung",farbe:"#2471A3",q:"Was beschreibt der autoritäre Führungsstil?",a:["FK entscheidet allein und gibt klare Anweisungen.","MA gestalten Prozesse aktiv mit.","Informationen werden selektiv weitergegeben.","Disziplin und Kontrolle stehen im Vordergrund."],r:[0,2,3]},
{id:"F06",k:"Führung",farbe:"#2471A3",q:"Was sind Merkmale transformationaler Führung?",a:["FK inspiriert durch Vision und Vorbildfunktion.","MA werden intrinsisch motiviert.","Fokus liegt auf kurzfristiger Aufgabenerfüllung.","Individuelle Förderung und Entwicklung der MA"],r:[0,1,3]},
{id:"F07",k:"Führung",farbe:"#2471A3",q:"Was ist das Leader-Leader-Modell nach Marquet?",a:["FK gibt Kontrolle ab und schafft Führung auf allen Ebenen.","MA werden befähigt, eigene Entscheidungen zu treffen.","Zentralisierung von Entscheidungen beim Top-Management","Kompetenz und Klarheit sind Voraussetzungen."],r:[0,1,3]},
{id:"F08",k:"Führung",farbe:"#2471A3",q:"Was sind Merkmale des laissez-fairen Führungsstils?",a:["MA handeln weitgehend selbstständig ohne Führungsvorgaben.","Hohe Eigenverantwortung der MA","FK gibt klare Anweisungen und kontrolliert eng.","Funktioniert gut bei hochqualifizierten, selbstmotivierten Teams."],r:[0,1,3]},
{id:"F09",k:"Führung",farbe:"#2471A3",q:"Was kennzeichnet gute Feedbackkultur?",a:["Feedback ist konkret, zeitnah und verhaltensorientiert.","Kritik bezieht sich auf Persönlichkeit, nicht Verhalten.","Positives Feedback wird regelmäßig gegeben.","Feedback ist eine Einbahnstraße von oben nach unten."],r:[0,2]},
{id:"F10",k:"Führung",farbe:"#2471A3",q:"Was sind Aufgaben von FK im Change Management?",a:["Veränderungen kommunizieren und begründen","Widerstände ernst nehmen und aktiv bearbeiten","Veränderungen geheim halten bis zur Umsetzung","MA in Veränderungsprozesse einbeziehen"],r:[0,1,3]},
{id:"F11",k:"Führung",farbe:"#2471A3",q:"Was ist psychologische Sicherheit im Team?",a:["Mitglieder können Fehler und Ideen ohne Angst äußern.","Konflikte werden grundsätzlich vermieden.","Voraussetzung für Innovation und Lernbereitschaft","FK schafft psychologische Sicherheit durch Vorbild."],r:[0,2,3]},
{id:"F12",k:"Führung",farbe:"#2471A3",q:"Was sind die Burnout-Phasen nach Freudenberger?",a:["Idealismus → Überarbeitung → Vernachlässigung eigener Bedürfnisse","Emotionale Abstumpfung und Zynismus","Körperliche Erschöpfung und psychosomatische Beschwerden","Burnout entsteht ausschließlich durch persönliche Schwäche."],r:[0,1,2]},
{id:"F13",k:"Führung",farbe:"#2471A3",q:"Was kennzeichnet das Johari-Fenster?",a:["4 Felder: öffentlich, blinder Fleck, privat, unbewusst","Selbstbild und Fremdbild können voneinander abweichen.","Feedback erweitert den öffentlichen Bereich.","Das Johari-Fenster ist ein Kommunikationsinstrument."],r:[0,1,2,3]},
{id:"F14",k:"Führung",farbe:"#2471A3",q:"Was ist das Ziel von Delegieren?",a:["Aufgaben, Kompetenz und Verantwortung übertragen","MA entlasten und entwickeln","FK behält alle Kontrolle und entscheidet selbst.","Delegation schafft Kapazität für Führungsaufgaben."],r:[0,1,3]},
{id:"F15",k:"Führung",farbe:"#2471A3",q:"Was sind SMART-Ziele?",a:["Spezifisch: klar und eindeutig formuliert","Messbar: Fortschritt ist überprüfbar","Attraktiv/Motivierend: für den MA bedeutsam","Realistisch und Terminiert: erreichbar mit Zeitrahmen"],r:[0,1,2,3]},
{id:"F16",k:"Führung",farbe:"#2471A3",q:"Was beschreibt Kotter's 8-Stufen-Modell?",a:["Dringlichkeit erzeugen und Führungskoalition aufbauen","Vision entwickeln und kommunizieren","Kurzfristige Erfolge sichtbar machen","Veränderung in der Unternehmenskultur verankern"],r:[0,1,2,3]},
{id:"F17",k:"Führung",farbe:"#2471A3",q:"Was ist das Günter-Prinzip nach Dr. Frädrich?",a:["Innerer Schweinehund als Metapher für Vermeidungsverhalten","Menschen bevorzugen kurzfristige Befriedigung vor langfristigen Zielen.","Selbstdisziplin und Gewohnheiten entscheiden über Erfolg.","Der 'Günter' verschwindet durch einmalige Motivation dauerhaft."],r:[0,1,2]},
{id:"F18",k:"Führung",farbe:"#2471A3",q:"Was sind Merkmale einer Hochleistungskultur?",a:["Klare Ziele und hohe Standards kombiniert mit Wertschätzung","Fehlerkultur: Fehler werden als Lernchance genutzt","Ausschließlich Druck und Kontrolle steigern Leistung.","Intrinsische Motivation durch sinnstiftende Arbeit"],r:[0,1,3]},
{id:"M01",k:"Motivation",farbe:"#1E8449",q:"Was ist der Unterschied zwischen Motivation und Motiv?",a:["Motivation: Streben nach Zielen aufgrund von Antrieben","Motiv: grundlegende Ziele/Bedürfnisse des Menschen","Motivation und Motiv sind Synonyme.","Viele Motive sind unbewusst."],r:[0,1,3]},
{id:"M02",k:"Motivation",farbe:"#1E8449",q:"Welche Annahmen liegen dem Maslow-Modell zugrunde?",a:["Bedürfnisse werden hierarchisch, Stufe für Stufe befriedigt.","Erst wenn eine Stufe befriedigt ist, wirkt die nächste motivierend.","Selbstverwirklichung steht an der Spitze.","Das Modell ist empirisch vollständig bestätigt."],r:[0,1,2]},
{id:"M03",k:"Motivation",farbe:"#1E8449",q:"Was sind nach Herzberg Hygienefaktoren?",a:["Gehalt","Statuszuweisung","Führung durch den Vorgesetzten","Unternehmenspolitik und Verwaltung"],r:[0,1,2,3]},
{id:"M04",k:"Motivation",farbe:"#1E8449",q:"Was sind nach Herzberg Motivatoren?",a:["Anerkennung und Wertschätzung für geleistete Arbeit","Arbeitsinhalt und Verantwortung","Gehalt und Sozialleistungen","Persönliches Wachstum und Aufstiegsmöglichkeiten"],r:[0,1,3]},
{id:"M05",k:"Motivation",farbe:"#1E8449",q:"Was beschreibt die Equity Theory (Adams)?",a:["Menschen streben nach fairen Gegenleistungen für ihre Beiträge.","MA vergleichen ihr Input/Output-Verhältnis mit anderen.","Das absolute Gehalt ist entscheidend, nicht der Vergleich.","Wahrgenommene Ungerechtigkeit führt zu Demotivation."],r:[0,1,3]},
{id:"M06",k:"Motivation",farbe:"#1E8449",q:"Was sind die Grundmotive nach McClelland?",a:["Leistungsmotiv: Streben nach Exzellenz","Machtmotiv: Streben nach Einfluss","Zugehörigkeitsmotiv: Streben nach engen Beziehungen","Alle Menschen haben diese Motive in gleicher Ausprägung."],r:[0,1,2]},
{id:"M07",k:"Motivation",farbe:"#1E8449",q:"Was unterscheidet intrinsische von extrinsischer Motivation?",a:["Intrinsisch: Motivation kommt aus dem Inneren","Extrinsisch: Motivation durch äußere Anreize (Gehalt, Status)","Intrinsische Motivation ist immer stärker.","Übermäßige extrinsische Belohnung kann intrinsische Motivation untergraben."],r:[0,1,3]},
{id:"M08",k:"Motivation",farbe:"#1E8449",q:"Was ist der Erwartungs-Wert-Ansatz (Vroom)?",a:["Motivation = Erwartung × Instrumentalität × Valenz","Nur wenn alle drei Faktoren positiv sind, entsteht hohe Motivation.","Erwartung = Glaube, dass Anstrengung zu Leistung führt","Valenz beschreibt den Wert des Ergebnisses für die Person."],r:[0,1,2,3]},
{id:"M09",k:"Motivation",farbe:"#1E8449",q:"Was ist Flow nach Csikszentmihalyi?",a:["Zustand völliger Aufmerksamkeit und Vertiefung","Entsteht wenn Anforderung und Fähigkeit im Gleichgewicht sind","Flow ist immer bei sehr einfachen Aufgaben zu erreichen.","Flow geht mit positiven Emotionen und Zeitvergessenheit einher."],r:[0,1,3]},
{id:"M10",k:"Motivation",farbe:"#1E8449",q:"Was sind Maßnahmen zur Motivationssteigerung?",a:["Klare Ziele setzen und Sinn kommunizieren","Autonomie und Handlungsspielraum gewähren","Ausschließlich finanziell belohnen","Regelmäßiges, konstruktives Feedback geben"],r:[0,1,3]},
{id:"M11",k:"Motivation",farbe:"#1E8449",q:"Was beschreibt die Selbstbestimmungstheorie (Deci & Ryan)?",a:["3 Grundbedürfnisse: Kompetenz, Autonomie, Eingebundenheit","Werden alle 3 Bedürfnisse erfüllt, entsteht intrinsische Motivation.","Kontrolle und Überwachung fördern intrinsische Motivation.","FK können diese Bedürfnisse aktiv fördern."],r:[0,1,3]},
{id:"M12",k:"Motivation",farbe:"#1E8449",q:"Was ist Prokrastination und wie begegnet man ihr?",a:["Aufschieben von Aufgaben trotz negativer Konsequenzen","Kleinstschritte definieren und sofort starten","Prokrastination ist immer Zeichen von Faulheit.","Klare Prioritäten reduzieren Prokrastination."],r:[0,1,3]},
{id:"M13",k:"Motivation",farbe:"#1E8449",q:"Was ist Lob als Führungsinstrument?",a:["Lob sollte konkret und zeitnah erfolgen.","Allgemeines Lob ('Du bist toll') ist besonders wirksam.","Lob stärkt das Wiederholungsverhalten und die Motivation.","Lob sollte aufrichtig und authentisch sein."],r:[0,2,3]},
{id:"M14",k:"Motivation",farbe:"#1E8449",q:"Was beschreibt die X-Y-Theorie nach McGregor?",a:["Theorie X: MA sind träge und müssen kontrolliert werden.","Theorie Y: MA sind motiviert und übernehmen Verantwortung.","Beide Annahmen sind bewiesene Tatsachen.","Theorie Y-Führung fördert Eigenverantwortung und Kreativität."],r:[0,1,3]},
{id:"M15",k:"Motivation",farbe:"#1E8449",q:"Was ist Sinnhaftigkeit (Purpose) als Motivationsfaktor?",a:["MA sind motivierter, wenn sie den Sinn ihrer Arbeit verstehen.","Purpose verbindet individuelle Arbeit mit dem größeren Ganze.","Gehalt ist immer wichtiger als Sinnhaftigkeit.","FK kommunizieren aktiv Warum und Wozu von Aufgaben."],r:[0,1,3]},
{id:"P01",k:"Personal",farbe:"#7D3C98",q:"Was umfasst der Personalmanagementprozess?",a:["Planung, Beschaffung, Auswahl","Entwicklung, Beurteilung, Freisetzung","Personalmanagement ist ausschließlich HR-Aufgabe.","Entlohnung und Verwaltung gehören zum Prozess."],r:[0,1,3]},
{id:"P02",k:"Personal",farbe:"#7D3C98",q:"Was ist bei der Personalbedarfsplanung zu berücksichtigen?",a:["Tarifverträge und Konjunkturentwicklung","Monatsgehalt, Urlaub, Firmenpension, Sozialabgaben","Mehrarbeitszulagen, Krankenstand, Fahrtkosten","Nur der direkte Lohn ist planungsrelevant."],r:[0,1,2]},
{id:"P03",k:"Personal",farbe:"#7D3C98",q:"Was gehört zu einer vollständigen Stellenbeschreibung?",a:["Stellenbezeichnung und Einordnung in die Organisationsstruktur","Aufgaben, Kompetenzen und Verantwortung","Anforderungsprofil fachlich und persönlich","Persönliche Meinung des Vorgesetzten"],r:[0,1,2]},
{id:"P04",k:"Personal",farbe:"#7D3C98",q:"Was sind die Säulen der qualitativen Personalplanung?",a:["Qualifikationsplanung: Welche Kompetenzen werden benötigt?","Personalentwicklungsplanung: Wie werden MA gefördert?","Einsatzplanung: Wer wird wo eingesetzt?","Qualitativ bedeutet: nur die Anzahl der MA planen."],r:[0,1,2]},
{id:"P05",k:"Personal",farbe:"#7D3C98",q:"Was sind Inhalte des Anforderungsprofils?",a:["Fachliche Anforderungen: Ausbildung, Kenntnisse, Erfahrungen","Persönliche Anforderungen: Soft Skills","Gehaltsvorstellung des Bewerbers","Basis für faire und objektive Auswahlentscheidungen"],r:[0,1,3]},
{id:"P06",k:"Personal",farbe:"#7D3C98",q:"Was sind Ziele des strukturierten Auswahlinterviews?",a:["Einheitliche Fragen sichern Vergleichbarkeit.","Verhaltensbasierte Fragen zeigen vergangenes Verhalten.","Bauchgefühl ist die zuverlässigste Methode.","Objektivität und rechtliche Sicherheit"],r:[0,1,3]},
{id:"P07",k:"Personal",farbe:"#7D3C98",q:"Was ist Onboarding und warum ist es wichtig?",a:["Systematische Einarbeitung neuer MA","Verkürzt die Zeit bis zur vollen Leistungsfähigkeit","Onboarding endet nach dem ersten Arbeitstag.","Reduziert Fluktuation und erhöht Commitment."],r:[0,1,3]},
{id:"P08",k:"Personal",farbe:"#7D3C98",q:"Was sind Bestandteile der Personalentwicklung?",a:["Training on the Job","Coaching und Mentoring","Personalentwicklung ist nur für FK relevant.","Seminare und externe Weiterbildungen"],r:[0,1,3]},
{id:"P09",k:"Personal",farbe:"#7D3C98",q:"Was kennzeichnet ein Mitarbeitergespräch?",a:["Regelmäßiger, strukturierter Austausch zwischen FK und MA","Ziele werden vereinbart und bewertet.","FK spricht, MA hört nur zu.","Entwicklungsperspektiven werden besprochen."],r:[0,1,3]},
{id:"P10",k:"Personal",farbe:"#7D3C98",q:"Unterschied zwischen Kündigung und Freistellung?",a:["Kündigung beendet das Arbeitsverhältnis nach Kündigungsfrist.","Freistellung: MA wird bis Vertragsende von Arbeitspflicht entbunden.","Bei Freistellung entfällt der Lohnanspruch.","Kündigung muss schriftlich erfolgen."],r:[0,1,3]},
{id:"P11",k:"Personal",farbe:"#7D3C98",q:"Was sind Ziele der Personalbeurteilung?",a:["Leistungen transparent bewerten und dokumentieren","Grundlage für Entwicklungsmaßnahmen schaffen","Persönliche Sympathie ist der Hauptmaßstab.","Grundlage für Gehalts- und Beförderungsentscheidungen"],r:[0,1,3]},
{id:"P12",k:"Personal",farbe:"#7D3C98",q:"Was sind Beurteilungsfehler?",a:["Halo-Effekt: eine Eigenschaft überstrahlt alle anderen","Tendenz zur Mitte: alle MA werden durchschnittlich bewertet","Recency-Effekt: nur aktuelle Leistungen berücksichtigt","Objektivität ist bei menschlicher Beurteilung automatisch gegeben."],r:[0,1,2]},
{id:"P13",k:"Personal",farbe:"#7D3C98",q:"Was ist Work-Life-Balance aus Arbeitgebersicht?",a:["Flexible Arbeitszeiten fördern Produktivität und Bindung.","Work-Life-Balance ist ausschließlich Privatsache.","Homeoffice ist ein modernes Bindungsinstrument.","Burnout-Prävention durch gesunde Arbeitsgestaltung"],r:[0,2,3]},
{id:"P14",k:"Personal",farbe:"#7D3C98",q:"Was sind Maßnahmen zur Mitarbeiterbindung?",a:["Entwicklungsperspektiven und Karrieremöglichkeiten","Faire Vergütung und Anerkennung","Sinnstiftung und Unternehmenskultur","Gehalt ist der einzige relevante Bindungsfaktor."],r:[0,1,2]},
{id:"P15",k:"Personal",farbe:"#7D3C98",q:"Was ist Employer Branding?",a:["Aufbau einer attraktiven Arbeitgebermarke","Zielt auf Gewinnung und Bindung qualifizierter MA","Employer Branding ist ausschließlich externe Werbung.","Authentizität ist entscheidend."],r:[0,1,3]},
{id:"B01",k:"BGM",farbe:"#D68910",q:"Was ist Betriebliches Gesundheitsmanagement (BGM)?",a:["Systematischer Ansatz zur Erhaltung der Mitarbeitergesundheit","Maßnahmen auf Verhaltens- UND Verhältnisebene","Nur gesetzliche Pflicht, kein wirtschaftlicher Nutzen","Reduziert Fehlzeiten und steigert Produktivität."],r:[0,1,3]},
{id:"B02",k:"BGM",farbe:"#D68910",q:"Welcher Lärmpegel gilt bei geistigen Tätigkeiten?",a:["55 dB(A) bei Tätigkeiten mit Konzentrationsanforderungen","85 dB(A) ist der allgemeine Büro-Richtwert.","Lärm über dem Richtwert beeinträchtigt Kognition.","Lärmschutz gilt nur in der Produktion."],r:[0,2]},
{id:"B03",k:"BGM",farbe:"#D68910",q:"Ursachen für Rückenbeschwerden am Büroarbeitsplatz?",a:["Falsche Sitzhöhe","Fehlende oder falsch eingestellte Rückenlehne","Falscher Abstand zum Bildschirm","Zu häufige Bewegungspausen"],r:[0,1,2]},
{id:"B04",k:"BGM",farbe:"#D68910",q:"Unterschied zwischen Eustress und Distress?",a:["Eustress: positiver, leistungssteigernder Stress","Distress: negativer, krankmachender chronischer Stress","Beide haben die gleiche Wirkung auf die Gesundheit.","Eustress fördert Motivation und Leistungsbereitschaft."],r:[0,1,3]},
{id:"B05",k:"BGM",farbe:"#D68910",q:"Was ist Resilienz am Arbeitsplatz?",a:["Fähigkeit, mit Belastungen umzugehen und sich zu erholen","Resilienz kann trainiert werden.","Resilienz ist angeboren und unveränderlich.","FK können Resilienz aktiv fördern."],r:[0,1,3]},
{id:"B06",k:"BGM",farbe:"#D68910",q:"Was sind Rollen von FK im BGM?",a:["Frühzeitiges Erkennen von Überlastungszeichen","Vorbildfunktion bei Gesundheitsverhalten","BGM liegt ausschließlich bei Betriebsarzt und HR.","Aktives Ansprechen von Belastungssituationen"],r:[0,1,3]},
{id:"B07",k:"BGM",farbe:"#D68910",q:"Was sind die Phasen des Burnout-Prozesses?",a:["Phase 1: Enthusiasmus, Überengagement","Phase 2: Stagnation, Desillusionierung, Erschöpfung","Phase 3: Frustration, Zynismus, psychosomatische Symptome","Burnout entsteht plötzlich und ohne Vorwarnung."],r:[0,1,2]},
{id:"B08",k:"BGM",farbe:"#D68910",q:"Was sind Maßnahmen der betrieblichen Suchtprävention?",a:["Klare Unternehmensrichtlinien zu Suchtmitteln","Früherkennung durch FK und Kolleg:innen","Sucht ist Privatsache und kein Unternehmensthema.","Betriebliche Sozialberatung und externe Hilfsangebote"],r:[0,1,3]},
{id:"B09",k:"BGM",farbe:"#D68910",q:"Was ist Salutogenese nach Antonovsky?",a:["Was erhält Menschen gesund? (nicht: Was macht krank?)","Kohärenzgefühl: Verstehbarkeit, Handhabbarkeit, Bedeutsamkeit","Salutogenese = Pathogenese, Synonyme.","Starkes Kohärenzgefühl fördert Gesundheit und Resilienz."],r:[0,1,3]},
{id:"B10",k:"BGM",farbe:"#D68910",q:"Was sind Ziele von Gesundheitszirkeln?",a:["MA erkennen und lösen gesundheitliche Belastungen.","Partizipation: Betroffene werden zu Beteiligten.","Gesundheitszirkel ersetzen den Betriebsarzt.","Nachhaltige Verbesserung der Arbeitsbedingungen"],r:[0,1,3]},
{id:"B11",k:"BGM",farbe:"#D68910",q:"Was ist Betriebliches Eingliederungsmanagement (BEM)?",a:["Pflichtverfahren nach mehr als 6 Wochen Krankheit in 12 Monaten","Ziel: Arbeitsfähigkeit erhalten und Beschäftigung sichichern","BEM ist freiwillig für den Arbeitnehmer.","BEM ist ausschließlich eine Kontrollmaßnahme."],r:[0,1,2]},
{id:"B12",k:"BGM",farbe:"#D68910",q:"Was sind Belastungsfaktoren am Arbeitsplatz?",a:["Körperliche Faktoren: Heben, Tragen, ungünstige Haltungen","Psychische Faktoren: Zeitdruck, Monotonie, Verantwortung","Ergonomie ist ausschließlich für körperliche Tätigkeiten.","Umgebungsfaktoren: Lärm, Licht, Temperatur"],r:[0,1,3]},
{id:"KO01",k:"Kommunikation",farbe:"#117A65",q:"Was ist ein Elevator Pitch?",a:["Kurze Selbst- oder Ideenpräsentation in ca. 30-60 Sekunden","Soll Interesse wecken und zur weiteren Kommunikation einladen","Dauert mindestens 10 Minuten für maximale Wirkung.","Nur im Vertrieb relevant."],r:[0,1]},
{id:"KO02",k:"Kommunikation",farbe:"#117A65",q:"Was sind Axiome nach Watzlawick?",a:["Man kann nicht NICHT kommunizieren.","Kommunikation hat Inhalts- und Beziehungsaspekt.","Kommunikation ist immer digital (verbal).","Kommunikation ist symmetrisch oder komplementär."],r:[0,1,3]},
{id:"KO03",k:"Kommunikation",farbe:"#117A65",q:"Was beschreibt das 4-Ohren-Modell (Schulz von Thun)?",a:["Jede Nachricht hat 4 Seiten: Sachinhalt, Selbstoffenbarung, Beziehung, Appell","Sender sendet alle 4 Seiten gleichzeitig.","Empfänger hört nur den Sachinhalt.","Missverständnisse entstehen wenn verschiedene Ebenen betont werden."],r:[0,1,3]},
{id:"KO04",k:"Kommunikation",farbe:"#117A65",q:"Was ist Gewaltfreie Kommunikation (GFK) nach Rosenberg?",a:["4 Schritte: Beobachtung, Gefühl, Bedürfnis, Bitte","Beobachtungen von Bewertungen trennen","GFK bedeutet, Konflikte zu vermeiden.","Ziel: echte Verbindung und gegenseitiges Verständnis"],r:[0,1,3]},
{id:"KO05",k:"Kommunikation",farbe:"#117A65",q:"Was kennzeichnet eine klare Ich-Botschaft?",a:["Beschreibt eigene Wahrnehmung, Gefühl und Bedürfnis","Vermeidet Schuldzuweisungen an andere","Ich-Botschaften und Du-Vorwürfe sind gleichwertig.","Fördert Verständnis statt Abwehr beim Gegenüber"],r:[0,1,3]},
{id:"KO06",k:"Kommunikation",farbe:"#117A65",q:"Was sind Merkmale nonverbaler Kommunikation?",a:["Körperhaltung, Gestik, Mimik, Blickkontakt","Macht ca. 55-65% der gesamten Kommunikation aus.","Nonverbal ist immer kontrollierbar.","Widerspruch zwischen verbal und nonverbal erzeugt Misstrauen."],r:[0,1,3]},
{id:"KO07",k:"Kommunikation",farbe:"#117A65",q:"Was ist Feedback nach dem SBI-Modell?",a:["Situation: konkrete Situation beschreiben","Behavior: beobachtetes Verhalten benennen","Impact: Wirkung/Auswirkung schildern","SBI = Subjektive Bewertung und Interpretation"],r:[0,1,2]},

// ==================== NEUE FRAGEN AUS CSV (120) ====================
{id:"F001",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: du remote führst und Missverständnisse zunehmen. Was ist der sinnvollste erste Schritt?",a:["Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Sofort eine Entscheidung allein treffen und kommunizieren","Beteiligte einbeziehen, Ziele klären, dann entscheiden."],r:[3]},
{id:"F002",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: die Leistung im Team seit Wochen sinkt. Was ist der sinnvollste erste Schritt?",a:["Die Verantwortung vollständig an eine andere Person abgeben","Impact/Dringlichkeit, Engpass zuerst.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[1]},
{id:"F003",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: zwei Teammitglieder unterschiedliche Prioritäten setzen. Was ist der sinnvollste erste Schritt?",a:["Sofort eine Entscheidung allein treffen und kommunizieren","Das Thema vertagen, bis es sich von selbst beruhigt","Die Verantwortung vollständig an eine andere Person abgeben","konkret, zeitnah, verhaltensbezogen."],r:[3]},
{id:"F004",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: eine erfahrene Fachkraft die Prozesse ignoriert. Was ist der sinnvollste erste Schritt?",a:["Einzelne Schuldige benennen, um ein Exempel zu statuieren","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Reifegrad einschätzen und Führungsstil anpassen.","Die Verantwortung vollständig an eine andere Person abgeben"],r:[2]},
{id:"F005",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: ein neues Team übernimmt und die Rollen unklar sind. Was ist der sinnvollste erste Schritt?",a:["Die Verantwortung vollständig an eine andere Person abgeben","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Das Thema vertagen, bis es sich von selbst beruhigt","konkret, zeitnah, verhaltensbezogen."],r:[3]},
{id:"F006",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: ein High Performer toxisches Verhalten zeigt. Was ist der sinnvollste erste Schritt?",a:["Beteiligte einbeziehen, Ziele klären, dann entscheiden.","Das Thema vertagen, bis es sich von selbst beruhigt","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[0]},
{id:"F007",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: ein Projekt in Verzug gerät und der Sponsor Druck macht. Was ist der sinnvollste erste Schritt?",a:["Sofort eine Entscheidung allein treffen und kommunizieren","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","konkret, zeitnah, verhaltensbezogen.","Die Verantwortung vollständig an eine andere Person abgeben"],r:[2]},
{id:"F008",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: ein wichtiger Kunde kurzfristig Änderungen verlangt. Was ist der sinnvollste erste Schritt?",a:["Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Reifegrad einschätzen und Führungsstil anpassen.","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären"],r:[1]},
{id:"F009",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: ein Teammitglied ständig zusagt, aber nicht liefert. Was ist der sinnvollste erste Schritt?",a:["Die Verantwortung vollständig an eine andere Person abgeben","Einzelne Schuldige benennen, um ein Exempel zu statuieren","konkret, zeitnah, verhaltensbezogen.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[2]},
{id:"F010",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: du eine Veränderung (Change) einführen musst. Was ist der sinnvollste erste Schritt?",a:["Impact/Dringlichkeit, Engpass zuerst.","Das Thema vertagen, bis es sich von selbst beruhigt","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Sofort eine Entscheidung allein treffen und kommunizieren"],r:[0]},
{id:"K031",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: ein Teammitglied passiv-aggressiv reagiert. Was ist der sinnvollste erste Schritt?",a:["Die Verantwortung vollständig an eine andere Person abgeben","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Rahmen setzen, Regeln, nacheinander sprechen.","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[2]},
{id:"K032",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: Gerüchte im Team die Stimmung kippen lassen. Was ist der sinnvollste erste Schritt?",a:["Sofort eine Entscheidung allein treffen und kommunizieren","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Die Verantwortung vollständig an eine andere Person abgeben","RACI/Zuständigkeiten fixieren."],r:[3]},
{id:"K033",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: zwei Abteilungen sich gegenseitig blockieren. Was ist der sinnvollste erste Schritt?",a:["Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Das Thema vertagen, bis es sich von selbst beruhigt","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Ich-Botschaften, konkrete Beispiele, Vereinbarung."],r:[3]},
{id:"K034",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: ein Konflikt um Ressourcen entsteht. Was ist der sinnvollste erste Schritt?",a:["Sofort eine Entscheidung allein treffen und kommunizieren","Ich-Botschaften, konkrete Beispiele, Vereinbarung.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[1]},
{id:"K035",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: ein Kunde sich über Tonfall beschwert. Was ist der sinnvollste erste Schritt?",a:["Sofort eine Entscheidung allein treffen und kommunizieren","Das Thema vertagen, bis es sich von selbst beruhigt","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Bedürfnisse klären, gemeinsame Ziele definieren."],r:[3]},
{id:"K036",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: über Zuständigkeiten gestritten wird. Was ist der sinnvollste erste Schritt?",a:["Rahmen setzen, Regeln, nacheinander sprechen.","Das Thema vertagen, bis es sich von selbst beruhigt","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Die Verantwortung vollständig an eine andere Person abgeben"],r:[0]},
{id:"K037",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: ein Mitarbeiter sich unfair behandelt fühlt. Was ist der sinnvollste erste Schritt?",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Bedürfnisse klären, gemeinsame Ziele definieren.","Die Verantwortung vollständig an eine andere Person abgeben"],r:[2]},
{id:"K038",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: ein Streit in einem Meeting eskaliert. Was ist der sinnvollste erste Schritt?",a:["Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Sofort eine Entscheidung allein treffen und kommunizieren","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Ich-Botschaften, konkrete Beispiele, Vereinbarung."],r:[3]},
{id:"K039",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: es wiederholt zu Missverständnissen kommt. Was ist der sinnvollste erste Schritt?",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Die Verantwortung vollständig an eine andere Person abgeben","Pause, Emotionen benennen, Sachebene herstellen.","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[2]},
{id:"M051",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: das Team zu wenig Anerkennung bekommt. Was ist der sinnvollste erste Schritt?",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","konkret loben, Erfolge sichtbar machen.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[2]},
{id:"M052",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: ein neuer Kollege nicht integriert wird. Was ist der sinnvollste erste Schritt?",a:["Das Thema vertagen, bis es sich von selbst beruhigt","konkret loben, Erfolge sichtbar machen.","Sofort eine Entscheidung allein treffen und kommunizieren","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[1]},
{id:"M053",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: die Zielerreichung nur noch über Druck funktioniert. Was ist der sinnvollste erste Schritt?",a:["konkret loben, Erfolge sichtbar machen.","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Die Verantwortung vollständig an eine andere Person abgeben"],r:[0]},
{id:"M054",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: ein Teammitglied innerlich gekündigt wirkt. Was ist der sinnvollste erste Schritt?",a:["Einzelne Schuldige benennen, um ein Exempel zu statuieren","Handlungsspielräume geben, Verantwortung übertragen.","Das Thema vertagen, bis es sich von selbst beruhigt","Die Verantwortung vollständig an eine andere Person abgeben"],r:[1]},
{id:"M055",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: ein sinnvoller Zweck (Purpose) fehlt. Was ist der sinnvollste erste Schritt?",a:["realistische Ziele, Prioritäten, Fokus.","Sofort eine Entscheidung allein treffen und kommunizieren","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[0]},
{id:"KO071",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: ein Missverständnis per Chat eskaliert. Was ist der sinnvollste erste Schritt?",a:["Sofort eine Entscheidung allein treffen und kommunizieren","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Wirkung schildern statt Vorwurf.","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[2]},
{id:"KO072",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: du zwischen zwei Parteien vermitteln musst. Was ist der sinnvollste erste Schritt?",a:["kurz, faktenbasiert, freundlich, klar.","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Die Verantwortung vollständig an eine andere Person abgeben"],r:[0]},
{id:"KO073",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: du negatives Feedback geben musst. Was ist der sinnvollste erste Schritt?",a:["Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","offene Fragen, Verständnis sichern.","Die Verantwortung vollständig an eine andere Person abgeben","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[1]},
{id:"KO074",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: ein Teammitglied kaum spricht und Infos fehlen. Was ist der sinnvollste erste Schritt?",a:["Einzelne Schuldige benennen, um ein Exempel zu statuieren","Kernaussage, Gründe, nächste Schritte.","Sofort eine Entscheidung allein treffen und kommunizieren","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[1]},
{id:"KO075",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: remote Meetings ineffektiv sind. Was ist der sinnvollste erste Schritt?",a:["Einzelne Schuldige benennen, um ein Exempel zu statuieren","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Kernaussage, Gründe, nächste Schritte.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[2]},
{id:"P091",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: Schichtplanung zu Unzufriedenheit führt. Was ist der sinnvollste erste Schritt?",a:["Einzelne Schuldige benennen, um ein Exempel zu statuieren","Das Thema vertagen, bis es sich von selbst beruhigt","Kriterien offenlegen, Gleichbehandlung.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[2]},
{id:"P092",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: eine Abmahnung im Raum steht. Was ist der sinnvollste erste Schritt?",a:["Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Die Verantwortung vollständig an eine andere Person abgeben","Fakten sammeln, sauber dokumentieren.","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[2]},
{id:"P093",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: eine Probezeitentscheidung getroffen werden muss. Was ist der sinnvollste erste Schritt?",a:["klar, respektvoll, lösungsorientiert.","Die Verantwortung vollständig an eine andere Person abgeben","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären"],r:[0]},
{id:"P094",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: du ein Bewerbungsgespräch führst. Was ist der sinnvollste erste Schritt?",a:["Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Sofort eine Entscheidung allein treffen und kommunizieren","Kriterien offenlegen, Gleichbehandlung."],r:[3]},
{id:"P095",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: eine Leistungsbeurteilung ansteht. Was ist der sinnvollste erste Schritt?",a:["Die Verantwortung vollständig an eine andere Person abgeben","Sofort eine Entscheidung allein treffen und kommunizieren","HR einbinden, Regeln einhalten.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[2]},
{id:"P096",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: eine Weiterbildung geplant werden soll. Was ist der sinnvollste erste Schritt?",a:["Die Verantwortung vollständig an eine andere Person abgeben","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Einzelne Schuldige benennen, um ein Exempel zu statuieren","klar, respektvoll, lösungsorientiert."],r:[3]},
{id:"P097",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: ein Teammitglied Versetzungswunsch äußert. Was ist der sinnvollste erste Schritt?",a:["Die Verantwortung vollständig an eine andere Person abgeben","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Kriterien offenlegen, Gleichbehandlung.","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[2]},
{id:"B106",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: die Fehlzeiten im Team stark steigen. Was ist der sinnvollste erste Schritt?",a:["Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Sofort eine Entscheidung allein treffen und kommunizieren","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Belastungen identifizieren und Ursachen reduzieren."],r:[3]},
{id:"B107",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: ein BGM-Programm eingeführt werden soll. Was ist der sinnvollste erste Schritt?",a:["Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Die Verantwortung vollständig an eine andere Person abgeben","Sofort eine Entscheidung allein treffen und kommunizieren","Arbeitsbedingungen + individuelles Verhalten."],r:[3]},
{id:"B108",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: Ergonomie am Arbeitsplatz schlecht ist. Was ist der sinnvollste erste Schritt?",a:["Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Arbeitsbedingungen + individuelles Verhalten.","Sofort eine Entscheidung allein treffen und kommunizieren","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[1]},
{id:"B109",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: psychische Belastung durch Dauerstress sichtbar wird. Was ist der sinnvollste erste Schritt?",a:["Die Verantwortung vollständig an eine andere Person abgeben","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","frühzeitig ansprechen, Angebote vermitteln."],r:[3]},
{id:"B110",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: viele Überstunden anfallen. Was ist der sinnvollste erste Schritt?",a:["frühzeitig ansprechen, Angebote vermitteln.","Die Verantwortung vollständig an eine andere Person abgeben","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[0]},
{id:"B111",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: eine Gefährdungsbeurteilung ansteht. Was ist der sinnvollste erste Schritt?",a:["Sofort eine Entscheidung allein treffen und kommunizieren","Das Thema vertagen, bis es sich von selbst beruhigt","frühzeitig ansprechen, Angebote vermitteln.","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[2]},
{id:"B112",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: Rückkehrgespräche nach Krankheit geführt werden müssen. Was ist der sinnvollste erste Schritt?",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Pausen, Prioritäten, Ressourcenausgleich.","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[2]},
]

// Kategorien
const KATEGORIEN = ["Konflikt", "Führung", "Motivation", "Personal", "BGM", "Kommunikation"]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ============================================================================
// TYPES
// ============================================================================
type Screen = "home" | "modes" | "quiz" | "result" | "stats" | "achievements"
type QuizMode = "normal" | "learn" | "exam" | "blitz" | "weakness" | "favorites"

interface Frage {
  id: string
  k: string
  farbe: string
  q: string
  a: string[]
  r: number[]
}

interface Ergebnis {
  id: string
  korrekt: boolean
  frage: Frage
  userAnswers: number[]
}

interface LocalStats {
  totalCorrect: number
  totalWrong: number
  categoryStats: Record<string, { correct: number; wrong: number }>
  questionStats: Record<string, { correct: number; wrong: number }>
}

interface GameData {
  streak: number
  lastPlayed: string
  achievements: string[]
  favorites: string[]
}

// Achievement Definitionen
const ACHIEVEMENTS = [
  { id: "first_quiz", name: "Erste Schritte", desc: "10 Fragen beantwortet", icon: "🎯", requirement: (s: LocalStats) => (s.totalCorrect + s.totalWrong) >= 10 },
  { id: "halfway", name: "Halbzeit", desc: "50 Fragen beantwortet", icon: "🏃", requirement: (s: LocalStats) => (s.totalCorrect + s.totalWrong) >= 50 },
  { id: "master", name: "Quiz-Meister", desc: "200 Fragen beantwortet", icon: "🏆", requirement: (s: LocalStats) => (s.totalCorrect + s.totalWrong) >= 200 },
  { id: "perfect", name: "Perfekt", desc: "100% in einem Quiz", icon: "⭐", requirement: () => false },
  { id: "streak_3", name: "Dritte ist der Durchbruch", desc: "3 Tage Streak", icon: "🔥", requirement: (g: GameData) => g.streak >= 3 },
  { id: "streak_7", name: "Wochenstreak", desc: "7 Tage Streak", icon: "💪", requirement: (g: GameData) => g.streak >= 7 },
  { id: "streak_30", name: "Monatsmeister", desc: "30 Tage Streak", icon: "👑", requirement: (g: GameData) => g.streak >= 30 },
  { id: "favorites_5", name: "Sammler", desc: "5 Fragen favorisiert", icon: "⭐", requirement: (g: GameData) => g.favorites.length >= 5 },
]

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function App() {
  const [screen, setScreen] = useState<Screen>("home")
  const [quizMode, setQuizMode] = useState<QuizMode>("normal")
  const [fragen, setFragen] = useState<Frage[]>([])
  const [idx, setIdx] = useState(0)
  const [sel, setSel] = useState<number[]>([])
  const [best, setBest] = useState(false)
  const [erg, setErg] = useState<Ergebnis[]>([])
  const [t0, setT0] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [questionTime, setQuestionTime] = useState(20)
  const [examTime, setExamTime] = useState(30 * 60)
  const [showAchievementPopup, setShowAchievementPopup] = useState<string | null>(null)
  
  // Stats aus localStorage - NUR totalCorrect und totalWrong zählen
  const [stats, setStats] = useState<LocalStats>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cle-quiz-stats')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Sicherstellen, dass nur gültige Werte existieren
        return {
          totalCorrect: parsed.totalCorrect || 0,
          totalWrong: parsed.totalWrong || 0,
          categoryStats: parsed.categoryStats || {},
          questionStats: parsed.questionStats || {}
        }
      }
    }
    return { totalCorrect: 0, totalWrong: 0, categoryStats: {}, questionStats: {} }
  })

  // Game Data
  const [gameData, setGameData] = useState<GameData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cle-quiz-game')
      if (saved) {
        const data = JSON.parse(saved)
        const today = new Date().toDateString()
        const lastPlayed = data.lastPlayed
        if (lastPlayed && lastPlayed !== today) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          if (lastPlayed !== yesterday.toDateString()) {
            data.streak = 0
          }
        }
        return data
      }
    }
    return { streak: 0, lastPlayed: "", achievements: [], favorites: [] }
  })

  // Timer für normales Quiz
  useEffect(() => {
    let t: NodeJS.Timeout
    if (screen === "quiz" && t0 && quizMode !== "blitz") {
      t = setInterval(() => setElapsed(Math.floor((Date.now() - t0) / 1000)), 1000)
    }
    return () => clearInterval(t)
  }, [screen, t0, quizMode])

  // Timer für Prüfungsmodus
  useEffect(() => {
    let t: NodeJS.Timeout
    if (screen === "quiz" && quizMode === "exam" && examTime > 0) {
      t = setInterval(() => {
        setExamTime(prev => {
          if (prev <= 1) {
            finishQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(t)
  }, [screen, quizMode, examTime])

  // Timer für Blitz-Modus
  useEffect(() => {
    let t: NodeJS.Timeout
    if (screen === "quiz" && quizMode === "blitz" && !best && questionTime > 0) {
      t = setInterval(() => {
        setQuestionTime(prev => {
          if (prev <= 1) {
            handleTimeOut()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(t)
  }, [screen, quizMode, best, questionTime])

  // Save stats
  useEffect(() => {
    localStorage.setItem('cle-quiz-stats', JSON.stringify(stats))
  }, [stats])

  // Save game data
  useEffect(() => {
    localStorage.setItem('cle-quiz-game', JSON.stringify(gameData))
  }, [gameData])

  const handleTimeOut = () => {
    if (best) return
    const f = fragen[idx]
    setBest(true)
    setErg(e => [...e, { id: f.id, korrekt: false, frage: f, userAnswers: [] }])
  }

  const startQuiz = useCallback((category: string = "Alle", mode: QuizMode = "normal") => {
    let pool = category === "Alle" ? ALLE_FRAGEN : ALLE_FRAGEN.filter(f => f.k === category)
    
    if (mode === "weakness") {
      pool = pool.filter(f => {
        const qs = stats.questionStats[f.id]
        if (!qs) return true
        const total = qs.correct + qs.wrong
        return total > 0 && (qs.correct / total) < 0.5
      })
      if (pool.length < 5) {
        pool = ALLE_FRAGEN.slice(0, 20)
      }
    }

    if (mode === "favorites") {
      pool = pool.filter(f => gameData.favorites.includes(f.id))
      if (pool.length < 5) {
        alert("Du hast noch nicht genug Favoriten! Mindestens 5 Favoriten benötigt.")
        return
      }
    }

    const s = shuffle(pool)
    const questionCount = mode === "exam" ? 30 : mode === "blitz" ? 15 : Math.min(30, s.length)
    
    setFragen(s.slice(0, questionCount))
    setIdx(0)
    setSel([])
    setBest(false)
    setErg([])
    setQuizMode(mode)
    setT0(Date.now())
    setElapsed(0)
    setQuestionTime(20)
    setExamTime(30 * 60)
    setScreen("quiz")

    const today = new Date().toDateString()
    if (gameData.lastPlayed !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const newStreak = gameData.lastPlayed === yesterday.toDateString() 
        ? gameData.streak + 1 
        : 1
      setGameData(prev => ({ ...prev, streak: newStreak, lastPlayed: today }))
    }
  }, [stats.questionStats, gameData.favorites, gameData.lastPlayed, gameData.streak])

  const toggle = (i: number) => {
    if (best && quizMode !== "learn") return
    setSel(p => (p.includes(i) ? p.filter(x => x !== i) : [...p, i]))
  }

  const toggleFavorite = (questionId: string) => {
    setGameData(prev => ({
      ...prev,
      favorites: prev.favorites.includes(questionId)
        ? prev.favorites.filter(id => id !== questionId)
        : [...prev.favorites, questionId]
    }))
  }

  const confirm = () => {
    if (!sel.length) return
    const f = fragen[idx]
    const ok = new Set(f.r)
    const as = new Set(sel)
    const korrekt = [...ok].every(r => as.has(r)) && [...as].every(a => ok.has(a))
    setBest(true)
    setErg(e => [...e, { id: f.id, korrekt, frage: f, userAnswers: sel }])
  }

  const next = () => {
    if (idx + 1 >= fragen.length) {
      finishQuiz()
    } else {
      setIdx(i => i + 1)
      setSel([])
      setBest(false)
      setQuestionTime(20)
    }
  }

  const checkAchievements = (correctCount: number, totalCount: number) => {
    const newAchievements: string[] = []
    
    // Perfect Quiz
    if (totalCount > 0 && correctCount === totalCount) {
      if (!gameData.achievements.includes("perfect")) {
        newAchievements.push("perfect")
      }
    }

    // Kategorie-Meister
    KATEGORIEN.forEach(kat => {
      const catStats = stats.categoryStats[kat]
      if (catStats && (catStats.correct + catStats.wrong) >= 10) {
        const percentage = catStats.correct / (catStats.correct + catStats.wrong)
        if (percentage >= 0.8 && !gameData.achievements.includes("cat_master_" + kat)) {
          newAchievements.push("cat_master_" + kat)
        }
      }
    })

    // Stat-basierte Achievements mit korrigierten Werten
    const tempStats = { ...stats, totalCorrect: stats.totalCorrect + correctCount, totalWrong: stats.totalWrong + (totalCount - correctCount) }
    ACHIEVEMENTS.forEach(ach => {
      if (!gameData.achievements.includes(ach.id)) {
        if (ach.requirement(tempStats) || ach.requirement(gameData)) {
          newAchievements.push(ach.id)
        }
      }
    })

    if (newAchievements.length > 0) {
      setGameData(prev => ({
        ...prev,
        achievements: [...prev.achievements, ...newAchievements]
      }))
      setShowAchievementPopup(newAchievements[0])
      setTimeout(() => setShowAchievementPopup(null), 3000)
    }
  }

  const finishQuiz = useCallback(() => {
    const correctCount = erg.filter(e => e.korrekt).length
    const totalCount = erg.length

    // Stats aktualisieren - korrekte Zählung
    setStats(prev => {
      const newStats = { ...prev }
      erg.forEach(e => {
        const frage = e.frage
        if (!newStats.categoryStats[frage.k]) {
          newStats.categoryStats[frage.k] = { correct: 0, wrong: 0 }
        }
        if (!newStats.questionStats[frage.id]) {
          newStats.questionStats[frage.id] = { correct: 0, wrong: 0 }
        }
        if (e.korrekt) {
          newStats.totalCorrect++
          newStats.categoryStats[frage.k].correct++
          newStats.questionStats[frage.id].correct++
        } else {
          newStats.totalWrong++
          newStats.categoryStats[frage.k].wrong++
          newStats.questionStats[frage.id].wrong++
        }
      })
      return newStats
    })

    // Achievements prüfen
    checkAchievements(correctCount, totalCount)
    
    setScreen("result")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [erg])

  const getAnswerStyle = (i: number) => {
    if (!best) {
      if (sel.includes(i)) return "border-cyan-400 bg-cyan-400/20"
      return "border-slate-600 bg-slate-700/50 hover:border-slate-500"
    }
    
    const f = fragen[idx]
    const isCorrect = f.r.includes(i)
    const isSelected = sel.includes(i)
    
    if (quizMode === "exam") {
      if (isSelected) return "border-slate-400 bg-slate-600/50"
      return "border-slate-600 bg-slate-700/30"
    }
    
    if (isCorrect && isSelected) return "border-green-500 bg-green-500/30"
    if (isCorrect && !isSelected) return "border-green-500 bg-green-500/20"
    if (!isCorrect && isSelected) return "border-red-500 bg-red-500/30"
    return "border-slate-600 bg-slate-700/30"
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const frage = fragen[idx]
  const totalQuestions = stats.totalCorrect + stats.totalWrong

  // ==========================================================================
  // HOME SCREEN
  // ==========================================================================
  if (screen === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center pt-8 mb-6">
            <Brain className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold">CLE Quiz</h1>
            <p className="text-slate-400 mt-1">{ALLE_FRAGEN.length} Fragen • 6 Kategorien</p>
          </div>

          {/* Streak Badge */}
          {gameData.streak > 0 && (
            <div className="flex justify-center mb-4">
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 px-3 py-1">
                <Flame className="w-4 h-4 mr-1" />
                {gameData.streak} Tage Streak
              </Badge>
            </div>
          )}

          {/* Stats Summary */}
          <Card className="bg-slate-800/80 border-slate-600 mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">{stats.totalCorrect}</div>
                  <div className="text-xs text-slate-300">Richtig</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">{stats.totalWrong}</div>
                  <div className="text-xs text-slate-300">Falsch</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {totalQuestions > 0 
                      ? Math.round((stats.totalCorrect / totalQuestions) * 100) 
                      : 0}%
                  </div>
                  <div className="text-xs text-slate-300">Quote</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Button */}
          <Button 
            onClick={() => setScreen("modes")}
            className="w-full py-6 text-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 mb-4"
          >
            <Zap className="w-5 h-5 mr-2" />
            Quiz starten
          </Button>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button 
              variant="outline" 
              onClick={() => setScreen("stats")}
              className="py-4 border-slate-600 bg-slate-700/50 hover:bg-slate-600"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Statistiken
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setScreen("achievements")}
              className="py-4 border-slate-600 bg-slate-700/50 hover:bg-slate-600"
            >
              <Award className="w-5 h-5 mr-2" />
              Achievements
            </Button>
          </div>

          {/* Favorites Quick Access */}
          {gameData.favorites.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => startQuiz("Alle", "favorites")}
              className="w-full py-3 border-yellow-500/50 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 mb-6"
            >
              <Star className="w-5 h-5 mr-2 fill-current" />
              Favoriten üben ({gameData.favorites.length})
            </Button>
          )}

          <div className="text-center mt-4 text-xs text-slate-400">
            Ersteller: A.Neu
          </div>
        </div>
      </div>
    )
  }

  // ==========================================================================
  // MODE SELECTION SCREEN
  // ==========================================================================
  if (screen === "modes") {
    const weakCount = ALLE_FRAGEN.filter(f => {
      const qs = stats.questionStats[f.id]
      if (!qs) return true
      const total = qs.correct + qs.wrong
      return total > 0 && (qs.correct / total) < 0.5
    }).length

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 pt-4 mb-6">
            <Button variant="ghost" onClick={() => setScreen("home")} className="text-slate-300">
              <ArrowLeft className="w-5 h-5 mr-1" /> Zurück
            </Button>
            <h1 className="text-xl font-bold">Modus wählen</h1>
          </div>

          <div className="space-y-3">
            {/* Normaler Modus */}
            <Card 
              className="bg-slate-800/80 border-slate-600 cursor-pointer hover:border-cyan-500 transition-colors"
              onClick={() => startQuiz("Alle", "normal")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Normaler Modus</h3>
                    <p className="text-sm text-slate-400">30 zufällige Fragen, sofortige Korrektur</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lernmodus */}
            <Card 
              className="bg-slate-800/80 border-slate-600 cursor-pointer hover:border-green-500 transition-colors"
              onClick={() => startQuiz("Alle", "learn")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Lernmodus</h3>
                    <p className="text-sm text-slate-400">Sofortiges Feedback, keine Zeitlimit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prüfungsmodus */}
            <Card 
              className="bg-slate-800/80 border-slate-600 cursor-pointer hover:border-purple-500 transition-colors"
              onClick={() => startQuiz("Alle", "exam")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Prüfungsmodus</h3>
                    <p className="text-sm text-slate-400">30 Minuten, 30 Fragen, Simulation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blitz-Modus */}
            <Card 
              className="bg-slate-800/80 border-slate-600 cursor-pointer hover:border-orange-500 transition-colors"
              onClick={() => startQuiz("Alle", "blitz")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Timer className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Blitz-Modus</h3>
                    <p className="text-sm text-slate-400">20 Sekunden pro Frage</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schwächen-Training */}
            <Card 
              className="bg-slate-800/80 border-slate-600 cursor-pointer hover:border-red-500 transition-colors"
              onClick={() => startQuiz("Alle", "weakness")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Schwächen-Training</h3>
                    <p className="text-sm text-slate-400">Fragen mit &lt;50% Erfolgsrate ({weakCount} verfügbar)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Favoriten-Modus */}
            <Card 
              className={`bg-slate-800/80 border-slate-600 cursor-pointer hover:border-yellow-500 transition-colors ${gameData.favorites.length < 5 ? 'opacity-50' : ''}`}
              onClick={() => gameData.favorites.length >= 5 && startQuiz("Alle", "favorites")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Favoriten-Modus</h3>
                    <p className="text-sm text-slate-400">
                      {gameData.favorites.length >= 5 
                        ? `${gameData.favorites.length} Favoriten verfügbar`
                        : `Mindestens 5 Favoriten nötig (${gameData.favorites.length}/5)`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kategorie-Auswahl */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3 text-slate-300">Nach Kategorie</h2>
            {KATEGORIEN.map(k => {
              const count = ALLE_FRAGEN.filter(f => f.k === k).length
              const farbe = ALLE_FRAGEN.find(f => f.k === k)?.farbe || "#64748b"
              return (
                <Button
                  key={k}
                  variant="outline"
                  onClick={() => startQuiz(k, "normal")}
                  className="w-full py-3 mb-2 justify-between border-slate-600 bg-slate-700/50 hover:bg-slate-600"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: farbe }} />
                    {k}
                  </span>
                  <Badge variant="secondary" className="bg-slate-600">{count}</Badge>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ==========================================================================
  // QUIZ SCREEN
  // ==========================================================================
  if (screen === "quiz" && frage) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700 p-4">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setScreen("home")} className="text-slate-300">
              <ArrowLeft className="w-5 h-5 mr-1" /> Beenden
            </Button>
            <div className="flex items-center gap-4">
              <span className="text-slate-300">
                {idx + 1} <span className="text-slate-400">/ {fragen.length}</span>
              </span>
              {quizMode === "exam" ? (
                <div className={`flex items-center gap-1 ${examTime < 300 ? 'text-red-400' : 'text-slate-300'}`}>
                  <Clock className="w-4 h-4" />
                  {formatTime(examTime)}
                </div>
              ) : quizMode === "blitz" ? (
                <div className={`flex items-center gap-1 font-bold ${questionTime <= 5 ? 'text-red-400 animate-pulse' : 'text-orange-400'}`}>
                  <Timer className="w-4 h-4" />
                  {questionTime}s
                </div>
              ) : (
                <div className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-4 h-4" />
                  {formatTime(elapsed)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto p-4">
          {/* Progress */}
          <Progress value={((idx + 1) / fragen.length) * 100} className="mb-4 h-2" />

          {/* Category Badge & Favorite */}
          <div className="flex items-center justify-between mb-3">
            <Badge 
              variant="outline" 
              className="border-slate-500"
              style={{ backgroundColor: `${frage.farbe}20`, borderColor: frage.farbe }}
            >
              {frage.k}
            </Badge>
            <button
              onClick={() => toggleFavorite(frage.id)}
              className="p-1 hover:bg-slate-700 rounded-full transition-colors"
            >
              <Star 
                className={`w-5 h-5 ${gameData.favorites.includes(frage.id) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-400'}`} 
              />
            </button>
          </div>

          {/* Question */}
          <Card className="bg-slate-800/80 border-slate-600 mb-4">
            <CardContent className="p-4">
              <p className="text-lg leading-relaxed">{frage.q}</p>
            </CardContent>
          </Card>

          {/* Answers */}
          <div className="space-y-3">
            {frage.a.map((a, i) => (
              <button
                key={i}
                onClick={() => toggle(i)}
                disabled={best && quizMode !== "learn"}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${getAnswerStyle(i)}`}
              >
                <span className="flex gap-3">
                  <span className="font-bold text-slate-400">{['A', 'B', 'C', 'D'][i]})</span>
                  <span>{a}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Learn Mode - Show correct answers after confirming */}
          {best && quizMode === "learn" && (
            <Card className="bg-slate-800/80 border-slate-600 mt-4">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {erg[erg.length - 1]?.korrekt ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-semibold">Richtig!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 font-semibold">Falsch</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-slate-300">
                  Die richtigen Antworten sind:{' '}
                  {frage.r.map(i => ['A', 'B', 'C', 'D'][i]).join(', ')}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Button */}
          <div className="mt-6">
            {!best ? (
              <Button 
                onClick={confirm} 
                disabled={sel.length === 0}
                className="w-full py-6 text-lg bg-gradient-to-r from-cyan-500 to-teal-500"
              >
                Antwort bestätigen
              </Button>
            ) : (
              <Button onClick={next} className="w-full py-6 text-lg bg-gradient-to-r from-cyan-500 to-teal-500">
                {idx + 1 >= fragen.length ? "Ergebnis anzeigen" : "Nächste Frage"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ==========================================================================
  // RESULT SCREEN
  // ==========================================================================
  if (screen === "result") {
    const correct = erg.filter(e => e.korrekt).length
    const total = erg.length
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center pt-8 mb-8">
            {percent >= 70 ? (
              <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-4" />
            ) : percent >= 50 ? (
              <Target className="w-24 h-24 text-cyan-400 mx-auto mb-4" />
            ) : (
              <Brain className="w-24 h-24 text-slate-400 mx-auto mb-4" />
            )}
            <h1 className="text-3xl font-bold mb-2">
              {percent >= 70 ? "Sehr gut!" : percent >= 50 ? "Gut gemacht!" : "Weiter üben!"}
            </h1>
            <p className="text-slate-300">
              {quizMode === "exam" ? "Prüfung abgeschlossen" : "Quiz abgeschlossen"}
            </p>
          </div>

          <Card className="bg-slate-800/80 border-slate-600 mb-6">
            <CardContent className="p-6 text-center">
              <div className="text-5xl font-bold mb-2" style={{ color: percent >= 70 ? '#22c55e' : percent >= 50 ? '#06b6d4' : '#f59e0b' }}>
                {percent}%
              </div>
              <p className="text-slate-300">{correct} von {total} richtig</p>
              {quizMode !== "blitz" && (
                <p className="text-sm text-slate-400 mt-2">Zeit: {formatTime(elapsed)}</p>
              )}
              {quizMode === "exam" && (
                <p className="text-sm text-slate-400 mt-2">Verbleibende Zeit: {formatTime(examTime)}</p>
              )}
            </CardContent>
          </Card>

          {/* Wrong Answers Review (for exam mode) */}
          {quizMode === "exam" && erg.filter(e => !e.korrekt).length > 0 && (
            <Card className="bg-slate-800/80 border-slate-600 mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Falsche Antworten</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {erg.filter(e => !e.korrekt).slice(0, 5).map((e, i) => (
                  <div key={i} className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <p className="text-sm font-medium mb-1">{e.frage.q}</p>
                    <p className="text-xs text-slate-400">
                      Richtig: {e.frage.r.map(idx => e.frage.a[idx]).join(', ')}
                    </p>
                  </div>
                ))}
                {erg.filter(e => !e.korrekt).length > 5 && (
                  <p className="text-xs text-slate-400 text-center">
                    +{erg.filter(e => !e.korrekt).length - 5} weitere falsche Antworten
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            <Button 
              onClick={() => setScreen("modes")}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-500"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Nochmal spielen
            </Button>
            <Button 
              variant="outline"
              onClick={() => setScreen("home")}
              className="w-full py-4 border-slate-600"
            >
              <Home className="w-5 h-5 mr-2" />
              Zur Startseite
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================================================
  // STATS SCREEN
  // ==========================================================================
  if (screen === "stats") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 pt-4 mb-6">
            <Button variant="ghost" onClick={() => setScreen("home")} className="text-slate-300">
              <ArrowLeft className="w-5 h-5 mr-1" /> Zurück
            </Button>
            <h1 className="text-xl font-bold">Statistiken</h1>
          </div>

          <Card className="bg-slate-800/80 border-slate-600 mb-6">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Gesamtergebnis</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">{stats.totalCorrect}</div>
                  <div className="text-xs text-slate-300">Richtig</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">{stats.totalWrong}</div>
                  <div className="text-xs text-slate-300">Falsch</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {totalQuestions > 0 
                      ? Math.round((stats.totalCorrect / totalQuestions) * 100) 
                      : 0}%
                  </div>
                  <div className="text-xs text-slate-300">Quote</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/80 border-slate-600">
            <CardHeader>
              <CardTitle className="text-lg">Nach Kategorie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {KATEGORIEN.map(k => {
                const catStats = stats.categoryStats[k] || { correct: 0, wrong: 0 }
                const total = catStats.correct + catStats.wrong
                const percent = total > 0 ? Math.round((catStats.correct / total) * 100) : 0
                const farbe = ALLE_FRAGEN.find(f => f.k === k)?.farbe || "#64748b"
                
                return (
                  <div key={k} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: farbe }} />
                      <span>{k}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold" style={{ color: percent >= 70 ? '#22c55e' : percent >= 50 ? '#06b6d4' : '#f59e0b' }}>
                        {total > 0 ? `${percent}%` : '-'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {catStats.correct}/{total}
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Button 
            variant="outline"
            onClick={() => {
              if (confirm('Alle Statistiken zurücksetzen?')) {
                setStats({ totalCorrect: 0, totalWrong: 0, categoryStats: {}, questionStats: {} })
              }
            }}
            className="w-full mt-6 py-3 border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            Statistiken zurücksetzen
          </Button>
        </div>
      </div>
    )
  }

  // ==========================================================================
  // ACHIEVEMENTS SCREEN
  // ==========================================================================
  if (screen === "achievements") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 pt-4 mb-6">
            <Button variant="ghost" onClick={() => setScreen("home")} className="text-slate-300">
              <ArrowLeft className="w-5 h-5 mr-1" /> Zurück
            </Button>
            <h1 className="text-xl font-bold">Achievements</h1>
          </div>

          {/* Streak Card */}
          <Card className="bg-slate-800/80 border-slate-600 mb-6">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-8 h-8 text-orange-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400">{gameData.streak}</div>
                <div className="text-slate-400">Tage Streak</div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 gap-3">
            {ACHIEVEMENTS.map(ach => {
              const unlocked = gameData.achievements.includes(ach.id)
              return (
                <Card 
                  key={ach.id}
                  className={`bg-slate-800/80 border-slate-600 ${unlocked ? '' : 'opacity-50'}`}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${unlocked ? 'bg-yellow-500/20' : 'bg-slate-700'}`}>
                      {unlocked ? ach.icon : '🔒'}
                    </div>
                    <div>
                      <h3 className="font-semibold">{ach.name}</h3>
                      <p className="text-sm text-slate-400">{ach.desc}</p>
                    </div>
                    {unlocked && (
                      <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return null
}
