'use client'

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Trophy, BookOpen, Target, BarChart3, Clock, CheckCircle2, XCircle, 
  ArrowLeft, ArrowRight, Play, RotateCcw, Zap, Brain, TrendingUp,
  Award, AlertCircle, ChevronRight, Home, Settings, Star
} from "lucide-react"

// ============================================================================
// FRAGEN-DATENBANK
// ============================================================================
const ALLE_FRAGEN = [
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
{id:"M15",k:"Motivation",farbe:"#1E8449",q:"Was ist Sinnhaftigkeit (Purpose) als Motivationsfaktor?",a:["MA sind motivierter, wenn sie den Sinn ihrer Arbeit verstehen.","Purpose verbindet individuelle Arbeit mit dem größeren Ganzen.","Gehalt ist immer wichtiger als Sinnhaftigkeit.","FK kommunizieren aktiv Warum und Wozu von Aufgaben."],r:[0,1,3]},
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
]

const KATEGORIEN = [...new Set(ALLE_FRAGEN.map(f => f.k))]

function shuffle(arr: any[]) {
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
type Screen = "home" | "quiz" | "result" | "stats" | "kategorie"
type Mode = "pruefung" | "lern" | "schwach"

interface Frage {
  id: string
  k: string
  farbe: string
  q: string
  a: string[]
  r: number[]
}

interface Stats {
  [key: string]: { r: number; f: number }
}

interface Ergebnis {
  id: string
  korrekt: boolean
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function App() {
  const [screen, setScreen] = useState<Screen>("home")
  const [mode, setMode] = useState<Mode>("pruefung")
  const [kat, setKat] = useState<string>("Alle")
  const [fragen, setFragen] = useState<Frage[]>([])
  const [idx, setIdx] = useState(0)
  const [sel, setSel] = useState<number[]>([])
  const [best, setBest] = useState(false)
  const [erg, setErg] = useState<Ergebnis[]>([])
  const [t0, setT0] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  // Initialize stats from localStorage using lazy initializer
  const [stats, setStats] = useState<Stats>(() => {
    if (typeof window === 'undefined') return {}
    try {
      const saved = localStorage.getItem("cle-quiz-stats")
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // Save stats to localStorage
  useEffect(() => {
    if (Object.keys(stats).length > 0) {
      localStorage.setItem("cle-quiz-stats", JSON.stringify(stats))
    }
  }, [stats])

  // Timer
  useEffect(() => {
    let t: NodeJS.Timeout
    if (screen === "quiz" && t0) {
      t = setInterval(() => setElapsed(Math.floor((Date.now() - t0) / 1000)), 1000)
    }
    return () => clearInterval(t)
  }, [screen, t0])

  const start = useCallback(() => {
    let pool = kat === "Alle" ? ALLE_FRAGEN : ALLE_FRAGEN.filter(f => f.k === kat)
    
    if (mode === "schwach") {
      const bad = Object.entries(stats)
        .filter(([, s]) => s.f > 0)
        .map(([id]) => id)
      if (bad.length === 0) {
        pool = shuffle(pool).slice(0, 30)
      } else {
        pool = pool.filter(f => bad.includes(f.id))
        if (pool.length < 10) {
          pool = [...pool, ...shuffle(ALLE_FRAGEN.filter(f => !bad.includes(f.id))).slice(0, 20 - pool.length)]
        }
      }
    }
    
    const s = shuffle(pool)
    setFragen(s.slice(0, mode === "pruefung" ? Math.min(30, s.length) : s.length))
    setIdx(0)
    setSel([])
    setBest(false)
    setErg([])
    setT0(Date.now())
    setElapsed(0)
    setScreen("quiz")
  }, [mode, kat, stats])

  const toggle = (i: number) => {
    if (best) return
    setSel(p => (p.includes(i) ? p.filter(x => x !== i) : [...p, i]))
  }

  const confirm = () => {
    if (!sel.length) return
    const f = fragen[idx]
    const ok = new Set(f.r)
    const as = new Set(sel)
    const korrekt = [...ok].every(r => as.has(r)) && [...as].every(a => ok.has(a))
    setBest(true)
    setErg(e => [...e, { id: f.id, korrekt }])
    setStats(s => {
      const n = { ...s }
      if (!n[f.id]) n[f.id] = { r: 0, f: 0 }
      if (korrekt) n[f.id].r++
      else n[f.id].f++
      return n
    })
  }

  const next = () => {
    if (idx + 1 >= fragen.length) {
      setScreen("result")
    } else {
      setIdx(i => i + 1)
      setSel([])
      setBest(false)
    }
  }

  const frage = fragen[idx]

  // Calculate stats
  const totalAnswers = Object.values(stats).reduce((s, v) => s + v.r + v.f, 0)
  const correctAnswers = Object.values(stats).reduce((s, v) => s + v.r, 0)
  const percentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0

  const mm = Math.floor(elapsed / 60).toString().padStart(2, "0")
  const ss = (elapsed % 60).toString().padStart(2, "0")

  // Get status for answer
  const getAnswerStatus = (i: number): "correct" | "wrong" | "missed" | "neutral" | "selected" => {
    if (!best) return sel.includes(i) ? "selected" : "neutral"
    const isCorrect = frage.r.includes(i)
    const isSelected = sel.includes(i)
    if (isCorrect && isSelected) return "correct"
    if (!isCorrect && isSelected) return "wrong"
    if (isCorrect && !isSelected) return "missed"
    return "neutral"
  }

  // ==========================================================================
  // HOME SCREEN
  // ==========================================================================
  if (screen === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="max-w-md mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 mb-4 shadow-lg shadow-cyan-500/25">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">CLE Quiz</h1>
            <p className="text-slate-400 text-sm">Certified Leadership Expert · IHK</p>
            <Badge variant="secondary" className="mt-2 bg-slate-800 text-slate-300 border-slate-700">
              {ALLE_FRAGEN.length} Fragen
            </Badge>
          </div>

          {/* Stats Overview */}
          {totalAnswers > 0 && (
            <Card className="bg-slate-900/50 border-slate-800 mb-6 backdrop-blur">
              <CardContent className="pt-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">{totalAnswers}</div>
                    <div className="text-xs text-slate-500">Antworten</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${percentage >= 70 ? "text-emerald-400" : "text-amber-400"}`}>
                      {percentage}%
                    </div>
                    <div className="text-xs text-slate-500">Quote</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{ALLE_FRAGEN.length}</div>
                    <div className="text-xs text-slate-500">Fragen</div>
                  </div>
                </div>
                <Progress value={percentage} className="mt-4 h-2" />
              </CardContent>
            </Card>
          )}

          {/* Mode Selection */}
          <Card className="bg-slate-900/50 border-slate-800 mb-4 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">MODUS WÄHLEN</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { id: "pruefung" as Mode, icon: Clock, label: "Prüfungs-Simulation", desc: "30 Fragen · 60 Min · wie die echte IHK", color: "cyan" },
                { id: "lern" as Mode, icon: BookOpen, label: "Lern-Modus", desc: "Alle Fragen · sofortiges Feedback", color: "emerald" },
                { id: "schwach" as Mode, icon: Zap, label: "Schwächen-Training", desc: "Falsch beantwortete wiederholen", color: "amber" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`w-full p-4 rounded-xl border transition-all duration-200 text-left flex items-center gap-3 ${
                    mode === m.id
                      ? `bg-${m.color}-500/10 border-${m.color}-500/50 text-white`
                      : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800"
                  }`}
                  style={{
                    backgroundColor: mode === m.id ? (m.color === "cyan" ? "rgba(6, 182, 212, 0.1)" : m.color === "emerald" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)") : undefined,
                    borderColor: mode === m.id ? (m.color === "cyan" ? "rgba(6, 182, 212, 0.5)" : m.color === "emerald" ? "rgba(16, 185, 129, 0.5)" : "rgba(245, 158, 11, 0.5)") : undefined,
                  }}
                >
                  <m.icon className="w-5 h-5 flex-shrink-0" style={{ color: m.color === "cyan" ? "#06b6d4" : m.color === "emerald" ? "#10b981" : "#f59e0b" }} />
                  <div className="flex-1">
                    <div className="font-semibold">{m.label}</div>
                    <div className="text-xs text-slate-400">{m.desc}</div>
                  </div>
                  {mode === m.id && <CheckCircle2 className="w-5 h-5" style={{ color: m.color === "cyan" ? "#06b6d4" : m.color === "emerald" ? "#10b981" : "#f59e0b" }} />}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card className="bg-slate-900/50 border-slate-800 mb-6 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">THEMA (optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["Alle", ...KATEGORIEN].map((k) => {
                  const fc = ALLE_FRAGEN.find(f => f.k === k)?.farbe || "#06b6d4"
                  const count = k === "Alle" ? ALLE_FRAGEN.length : ALLE_FRAGEN.filter(f => f.k === k).length
                  const active = kat === k
                  return (
                    <button
                      key={k}
                      onClick={() => setKat(k)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                      style={{
                        backgroundColor: active ? `${fc}20` : "rgba(30, 41, 59, 0.5)",
                        border: `1px solid ${active ? fc : "rgba(71, 85, 105, 0.5)"}`,
                        color: active ? fc : "#94a3b8",
                      }}
                    >
                      {k} <span className="opacity-60">({count})</span>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={start}
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/25"
            >
              <Play className="w-5 h-5 mr-2" />
              Quiz starten
            </Button>
            
            {Object.keys(stats).length > 0 && (
              <Button
                onClick={() => setScreen("stats")}
                variant="outline"
                className="w-full py-5 border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Meine Statistik
              </Button>
            )}
          </div>

          {/* Category Overview */}
          <Card className="bg-slate-900/50 border-slate-800 mt-6 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">KATEGORIEN</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {KATEGORIEN.map((k) => {
                  const fc = ALLE_FRAGEN.find(f => f.k === k)?.farbe || "#06b6d4"
                  const count = ALLE_FRAGEN.filter(f => f.k === k).length
                  const catStats = Object.entries(stats)
                    .filter(([id]) => ALLE_FRAGEN.find(f => f.id === id)?.k === k)
                  const catCorrect = catStats.reduce((s, [, v]) => s + v.r, 0)
                  const catTotal = catStats.reduce((s, [, v]) => s + v.r + v.f, 0)
                  const catPct = catTotal > 0 ? Math.round((catCorrect / catTotal) * 100) : 0
                  
                  return (
                    <button
                      key={k}
                      onClick={() => { setKat(k); setScreen("kategorie") }}
                      className="w-full p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors text-left flex items-center gap-3"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: fc }}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{k}</div>
                        <div className="text-xs text-slate-500">{count} Fragen</div>
                      </div>
                      {catTotal > 0 && (
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: catPct >= 70 ? "#10b981" : "#f59e0b",
                            color: catPct >= 70 ? "#10b981" : "#f59e0b",
                          }}
                        >
                          {catPct}%
                        </Badge>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ==========================================================================
  // QUIZ SCREEN
  // ==========================================================================
  if (screen === "quiz" && frage) {
    const progress = ((idx + 1) / fragen.length) * 100
    const correctCount = erg.filter(e => e.korrekt).length

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
            <div className="px-4 py-3 flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setScreen("home")}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="text-center">
                <div className="font-bold">
                  {idx + 1} <span className="text-slate-500 font-normal">/ {fragen.length}</span>
                </div>
                {mode === "pruefung" && (
                  <div className="text-xs text-slate-500 flex items-center gap-1 justify-center">
                    <Clock className="w-3 h-3" />
                    {mm}:{ss}
                  </div>
                )}
              </div>
              
              <Badge
                style={{
                  backgroundColor: `${frage.farbe}20`,
                  color: frage.farbe,
                  borderColor: `${frage.farbe}50`,
                }}
                variant="outline"
              >
                {frage.k}
              </Badge>
            </div>
            
            <div className="px-4 pb-3">
              <Progress value={progress} className="h-1.5" />
              {erg.length > 0 && (
                <div className="text-xs text-slate-500 mt-1 text-center">
                  ✓ {correctCount} / {erg.length} richtig
                </div>
              )}
            </div>
          </div>

          {/* Question */}
          <div className="px-4 py-6">
            <Badge variant="outline" className="text-xs text-slate-500 border-slate-700 mb-3">
              [{frage.id}] · MEHRERE ANTWORTEN MÖGLICH
            </Badge>
            <h2 className="text-lg font-semibold leading-relaxed">{frage.q}</h2>
          </div>

          {/* Answers */}
          <div className="px-4 space-y-2">
            {frage.a.map((a, i) => {
              const status = getAnswerStatus(i)
              return (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  disabled={best}
                  className={`w-full p-4 rounded-xl border transition-all duration-200 text-left flex items-start gap-3 ${
                    status === "correct"
                      ? "bg-emerald-500/10 border-emerald-500/50"
                      : status === "wrong"
                      ? "bg-red-500/10 border-red-500/50"
                      : status === "missed"
                      ? "bg-emerald-500/5 border-emerald-500/30 border-dashed"
                      : status === "selected"
                      ? "bg-cyan-500/10 border-cyan-500/50"
                      : "bg-slate-800/50 border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      status === "correct"
                        ? "bg-emerald-500 border-emerald-500"
                        : status === "wrong"
                        ? "bg-red-500 border-red-500"
                        : status === "missed"
                        ? "border-emerald-500 bg-emerald-500/20"
                        : status === "selected"
                        ? "bg-cyan-500 border-cyan-500"
                        : "border-slate-600"
                    }`}
                  >
                    {status === "correct" && <CheckCircle2 className="w-3 h-3 text-white" />}
                    {status === "wrong" && <XCircle className="w-3 h-3 text-white" />}
                    {status === "missed" && <span className="text-emerald-500 text-xs">→</span>}
                    {status === "selected" && !best && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span
                    className={`text-sm leading-relaxed ${
                      status === "correct"
                        ? "text-emerald-300"
                        : status === "wrong"
                        ? "text-red-300"
                        : status === "missed"
                        ? "text-emerald-400/70"
                        : "text-slate-300"
                    }`}
                  >
                    {a}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Feedback (Lern-Modus) */}
          {best && mode === "lern" && (
            <div className="px-4 mt-4">
              <Card
                className={`${
                  erg[erg.length - 1]?.korrekt
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    {erg[erg.length - 1]?.korrekt ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="font-semibold text-emerald-400">Richtig!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="font-semibold text-red-400">Nicht vollständig</span>
                      </>
                    )}
                  </div>
                  {!erg[erg.length - 1]?.korrekt && (
                    <div className="text-sm text-slate-300">
                      Richtige Antworten:{" "}
                      <span className="text-emerald-400 font-semibold">
                        {frage.r.map(r => String.fromCharCode(65 + r)).join(", ")}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="px-4 py-6">
            {!best ? (
              <Button
                onClick={confirm}
                disabled={!sel.length}
                className={`w-full py-6 text-lg font-bold ${
                  sel.length
                    ? "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                Antwort bestätigen
              </Button>
            ) : (
              <Button
                onClick={next}
                className="w-full py-6 text-lg font-bold bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
              >
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
    const total = erg.length
    const correct = erg.filter(e => e.korrekt).length
    const pct = Math.round((correct / total) * 100)
    const passed = pct >= 70
    const wrong = fragen.filter(f => erg.find(e => e.id === f.id && !e.korrekt))

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="max-w-md mx-auto px-4 py-8">
          {/* Result Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4">
              {pct >= 85 ? (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
              ) : passed ? (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
            
            <div className={`text-6xl font-black ${passed ? "text-emerald-400" : "text-red-400"}`}>
              {pct}%
            </div>
            <div className="text-lg font-semibold mt-2">
              {correct} von {total} Fragen richtig
            </div>
            
            <Badge
              className={`mt-4 text-sm py-1.5 ${
                passed
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                  : "bg-red-500/20 text-red-400 border-red-500/50"
              }`}
              variant="outline"
            >
              {pct >= 85 ? "Exzellent — Note GUT! 🎯" : passed ? "Bestanden ✓" : "Noch nicht bestanden"}
            </Badge>
          </div>

          {/* Stats Card */}
          <Card className="bg-slate-900/50 border-slate-800 mb-6 backdrop-blur">
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold">{mm}:{ss}</div>
                  <div className="text-xs text-slate-500">Zeit</div>
                </div>
                <div>
                  <div className="text-xl font-bold">{correct}/{total}</div>
                  <div className="text-xs text-slate-500">Richtig</div>
                </div>
                <div>
                  <div className={`text-xl font-bold ${passed ? "text-emerald-400" : "text-red-400"}`}>{pct}%</div>
                  <div className="text-xs text-slate-500">Quote</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wrong Answers */}
          {wrong.length > 0 && (
            <Card className="bg-slate-900/50 border-slate-800 mb-6 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-sm text-red-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  {wrong.length} falsch beantwortet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {wrong.map((f) => (
                      <div
                        key={f.id}
                        className="border-l-2 pl-3"
                        style={{ borderColor: f.farbe }}
                      >
                        <div className="text-xs text-slate-500">[{f.id}] {f.k}</div>
                        <div className="text-sm font-medium mt-1">{f.q}</div>
                        <div className="text-xs text-emerald-400 mt-2">
                          ✓ {f.r.map(r => f.a[r]).join(" | ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => setScreen("home")}
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
            >
              <Home className="w-5 h-5 mr-2" />
              Zurück zum Start
            </Button>
            
            {wrong.length > 0 && (
              <Button
                onClick={() => {
                  setMode("schwach")
                  start()
                }}
                variant="outline"
                className="w-full py-5 border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Zap className="w-5 h-5 mr-2" />
                Schwächen nochmal üben
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ==========================================================================
  // STATS SCREEN
  // ==========================================================================
  if (screen === "stats") {
    const entries = Object.entries(stats)
      .map(([id, s]) => ({
        id,
        ...s,
        frage: ALLE_FRAGEN.find(q => q.id === id),
        tot: s.r + s.f,
        pct: Math.round((s.r / (s.r + s.f)) * 100),
      }))
      .sort((a, b) => a.pct - b.pct)

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
            <div className="px-4 py-3 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setScreen("home")}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="font-bold text-lg">Meine Statistik</h1>
            </div>
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Noch keine Fragen beantwortet.</p>
            </div>
          ) : (
            <>
              <div className="px-4 py-4 space-y-2">
                {entries.map((e) => (
                  <Card
                    key={e.id}
                    className={`bg-slate-900/50 backdrop-blur ${
                      e.pct >= 70 ? "border-emerald-500/30" : "border-red-500/30"
                    }`}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${
                            e.pct >= 70 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {e.pct}%
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium" style={{ color: e.frage?.farbe }}>
                            [{e.id}] {e.frage?.k}
                          </div>
                          <div className="text-sm truncate">{e.frage?.q || e.id}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            ✓ {e.r} · ✗ {e.f} · {e.tot}× beantwortet
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="px-4 pb-8">
                <Button
                  onClick={() => {
                    setStats({})
                    localStorage.removeItem("cle-quiz-stats")
                  }}
                  variant="outline"
                  className="w-full py-5 border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Statistik zurücksetzen
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // ==========================================================================
  // CATEGORY DETAIL SCREEN
  // ==========================================================================
  if (screen === "kategorie" && kat !== "Alle") {
    const catFragen = ALLE_FRAGEN.filter(f => f.k === kat)
    const catStats = Object.entries(stats)
      .filter(([id]) => ALLE_FRAGEN.find(f => f.id === id)?.k === kat)
    const catCorrect = catStats.reduce((s, [, v]) => s + v.r, 0)
    const catTotal = catStats.reduce((s, [, v]) => s + v.r + v.f, 0)
    const catPct = catTotal > 0 ? Math.round((catCorrect / catTotal) * 100) : 0
    const catColor = catFragen[0]?.farbe || "#06b6d4"

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
            <div className="px-4 py-3 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setScreen("home")}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-bold">{kat}</h1>
                <p className="text-xs text-slate-500">{catFragen.length} Fragen</p>
              </div>
            </div>
          </div>

          {/* Category Stats */}
          <div className="px-4 py-6">
            <Card className="bg-slate-900/50 border-slate-800 mb-6 backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="text-4xl font-black" style={{ color: catColor }}>
                    {catPct}%
                  </div>
                  <div className="text-sm text-slate-500">Fortschritt</div>
                </div>
                <Progress value={catPct} className="h-2" />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>✓ {catCorrect} richtig</span>
                  <span>✗ {catTotal - catCorrect} falsch</span>
                </div>
              </CardContent>
            </Card>

            {/* Questions List */}
            <div className="space-y-2">
              {catFragen.map((f) => {
                const qStats = stats[f.id]
                const qPct = qStats ? Math.round((qStats.r / (qStats.r + qStats.f)) * 100) : null
                
                return (
                  <Card
                    key={f.id}
                    className="bg-slate-900/50 border-slate-800 backdrop-blur"
                  >
                    <CardContent className="pt-3 pb-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            qPct === null
                              ? "bg-slate-800 text-slate-500"
                              : qPct >= 70
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {qPct === null ? "?" : `${qPct}%`}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-slate-500 mb-1">[{f.id}]</div>
                          <div className="text-sm leading-relaxed">{f.q}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Start Quiz Button */}
            <div className="mt-6">
              <Button
                onClick={() => {
                  setKat(kat)
                  start()
                }}
                className="w-full py-6 text-lg font-bold"
                style={{ backgroundColor: catColor }}
              >
                <Play className="w-5 h-5 mr-2" />
                {kat} üben
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
