'use client'

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Trophy, BookOpen, Target, BarChart3, Clock, CheckCircle2, XCircle, 
  ArrowLeft, ArrowRight, Play, RotateCcw, Zap, Brain, TrendingUp,
  Award, AlertCircle, ChevronRight, Home, Settings, Star, Users,
  LogOut, LogIn, UserPlus, Shield, Activity, Calendar
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
// Neue Fragen aus CSV importiert
{id:"F100",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: du remote führst und Missverständnisse zunehmen. Was ist der sinnvollste erste Schritt?",a:["Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Sofort eine Entscheidung allein treffen und kommunizieren","Beteiligte einbeziehen, Ziele klären, dann entscheiden."],r:[3]},
{id:"F101",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: die Leistung im Team seit Wochen sinkt. Was ist der sinnvollste erste Schritt?",a:["Die Verantwortung vollständig an eine andere Person abgeben","Impact/Dringlichkeit, Engpass zuerst.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[1]},
{id:"F102",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: zwei Teammitglieder unterschiedliche Prioritäten setzen. Was ist der sinnvollste erste Schritt?",a:["Sofort eine Entscheidung allein treffen und kommunizieren","Das Thema vertagen, bis es sich von selbst beruhigt","Die Verantwortung vollständig an eine andere Person abgeben","konkret, zeitnah, verhaltensbezogen."],r:[3]},
{id:"F103",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: eine erfahrene Fachkraft die Prozesse ignoriert. Was ist der sinnvollste erste Schritt?",a:["Einzelne Schuldige benennen, um ein Exempel zu statuieren","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Reifegrad einschätzen und Führungsstil anpassen.","Die Verantwortung vollständig an eine andere Person abgeben"],r:[2]},
{id:"F104",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: ein neues Team übernimmt und die Rollen unklar sind. Was ist der sinnvollste erste Schritt?",a:["Die Verantwortung vollständig an eine andere Person abgeben","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Das Thema vertagen, bis es sich von selbst beruhigt","konkret, zeitnah, verhaltensbezogen."],r:[3]},
{id:"F105",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: ein High Performer toxisches Verhalten zeigt. Was ist der sinnvollste erste Schritt?",a:["Beteiligte einbeziehen, Ziele klären, dann entscheiden.","Das Thema vertagen, bis es sich von selbst beruhigt","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[0]},
{id:"F106",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: du remote führst und Missverständnisse zunehmen. Was ist der sinnvollste erste Schritt? (Variante 7)",a:["Einzelne Schuldige benennen, um ein Exempel zu statuieren","Das Thema vertagen, bis es sich von selbst beruhigt","Reifegrad einschätzen und Führungsstil anpassen.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[2]},
{id:"F107",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: ein Projekt in Verzug gerät und der Sponsor Druck macht. Was ist der sinnvollste erste Schritt?",a:["Sofort eine Entscheidung allein treffen und kommunizieren","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","konkret, zeitnah, verhaltensbezogen.","Die Verantwortung vollständig an eine andere Person abgeben"],r:[2]},
{id:"F108",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: du remote führst und Missverständnisse zunehmen. Was ist der sinnvollste erste Schritt? (Variante 9)",a:["konkret, zeitnah, verhaltensbezogen.","Die Verantwortung vollständig an eine andere Person abgeben","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[0]},
{id:"F109",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: zwei Teammitglieder unterschiedliche Prioritäten setzen. Was ist der sinnvollste erste Schritt? (Variante 10)",a:["Reifegrad einschätzen und Führungsstil anpassen.","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Die Verantwortung vollständig an eine andere Person abgeben","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[0]},
{id:"F110",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: ein wichtiger Kunde kurzfristig Änderungen verlangt. Was ist der sinnvollste erste Schritt?",a:["Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Reifegrad einschätzen und Führungsstil anpassen.","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären"],r:[1]},
{id:"F111",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: die Leistung im Team seit Wochen sinkt. Was ist der sinnvollste erste Schritt? (Variante 12)",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Reifegrad einschätzen und Führungsstil anpassen."],r:[3]},
{id:"F112",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: eine erfahrene Fachkraft die Prozesse ignoriert. Was ist der sinnvollste erste Schritt? (Variante 13)",a:["Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Das Thema vertagen, bis es sich von selbst beruhigt","SMART Erwartungen, Verantwortlichkeiten, Deadlines."],r:[3]},
{id:"F113",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: ein neues Team übernimmt und die Rollen unklar sind. Was ist der sinnvollste erste Schritt? (Variante 14)",a:["Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Die Verantwortung vollständig an eine andere Person abgeben","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Impact/Dringlichkeit, Engpass zuerst."],r:[3]},
{id:"F114",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: ein Teammitglied ständig zusagt, aber nicht liefert. Was ist der sinnvollste erste Schritt?",a:["Die Verantwortung vollständig an eine andere Person abgeben","Einzelne Schuldige benennen, um ein Exempel zu statuieren","konkret, zeitnah, verhaltensbezogen.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[2]},
{id:"F115",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: ein Teammitglied ständig zusagt, aber nicht liefert. Was ist der sinnvollste erste Schritt? (Variante 16)",a:["Einzelne Schuldige benennen, um ein Exempel zu statuieren","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Thema vertagen, bis es sich von selbst beruhigt","Impact/Dringlichkeit, Engpass zuerst."],r:[3]},
{id:"F116",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: eine erfahrene Fachkraft die Prozesse ignoriert. Was ist der sinnvollste erste Schritt? (Variante 17)",a:["Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Beteiligte einbeziehen, Ziele klären, dann entscheiden.","Sofort eine Entscheidung allein treffen und kommunizieren","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[1]},
{id:"F117",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: die Leistung im Team seit Wochen sinkt. Was ist der sinnvollste erste Schritt? (Variante 18)",a:["Einzelne Schuldige benennen, um ein Exempel zu statuieren","Das Thema vertagen, bis es sich von selbst beruhigt","Die Verantwortung vollständig an eine andere Person abgeben","konkret, zeitnah, verhaltensbezogen."],r:[3]},
{id:"F118",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: ein Teammitglied ständig zusagt, aber nicht liefert. Was ist der sinnvollste erste Schritt? (Variante 19)",a:["Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Beteiligte einbeziehen, Ziele klären, dann entscheiden.","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Sofort eine Entscheidung allein treffen und kommunizieren"],r:[1]},
{id:"F119",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: ein neues Team übernimmt und die Rollen unklar sind. Was ist der sinnvollste erste Schritt? (Variante 20)",a:["Einzelne Schuldige benennen, um ein Exempel zu statuieren","Sofort eine Entscheidung allein treffen und kommunizieren","Das Thema vertagen, bis es sich von selbst beruhigt","Beteiligte einbeziehen, Ziele klären, dann entscheiden."],r:[3]},
{id:"F120",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: du eine Veränderung (Change) einführen musst. Was ist der sinnvollste erste Schritt?",a:["Impact/Dringlichkeit, Engpass zuerst.","Das Thema vertagen, bis es sich von selbst beruhigt","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Sofort eine Entscheidung allein treffen und kommunizieren"],r:[0]},
{id:"F121",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: zwei Teammitglieder unterschiedliche Prioritäten setzen. Was ist der sinnvollste erste Schritt? (Variante 22)",a:["Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Das Thema vertagen, bis es sich von selbst beruhigt","Impact/Dringlichkeit, Engpass zuerst.","Die Verantwortung vollständig an eine andere Person abgeben"],r:[2]},
{id:"F122",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: ein wichtiger Kunde kurzfristig Änderungen verlangt. Was ist der sinnvollste erste Schritt? (Variante 23)",a:["Impact/Dringlichkeit, Engpass zuerst.","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Die Verantwortung vollständig an eine andere Person abgeben"],r:[0]},
{id:"F123",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: ein High Performer toxisches Verhalten zeigt. Was ist der sinnvollste erste Schritt? (Variante 24)",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Sofort eine Entscheidung allein treffen und kommunizieren","Impact/Dringlichkeit, Engpass zuerst."],r:[3]},
{id:"F124",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: du eine Veränderung (Change) einführen musst. Was ist der sinnvollste erste Schritt? (Variante 25)",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Reifegrad einschätzen und Führungsstil anpassen.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[2]},
{id:"F125",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: ein wichtiger Kunde kurzfristig Änderungen verlangt. Was ist der sinnvollste erste Schritt? (Variante 26)",a:["Sofort eine Entscheidung allein treffen und kommunizieren","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Das Thema vertagen, bis es sich von selbst beruhigt","Beteiligte einbeziehen, Ziele klären, dann entscheiden."],r:[3]},
{id:"F126",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: du remote führst und Missverständnisse zunehmen. Was ist der sinnvollste erste Schritt? (Variante 27)",a:["Impact/Dringlichkeit, Engpass zuerst.","Sofort eine Entscheidung allein treffen und kommunizieren","Das Thema vertagen, bis es sich von selbst beruhigt","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[0]},
{id:"F127",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: die Leistung im Team seit Wochen sinkt. Was ist der sinnvollste erste Schritt? (Variante 28)",a:["Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Das Thema vertagen, bis es sich von selbst beruhigt","Beteiligte einbeziehen, Ziele klären, dann entscheiden.","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[2]},
{id:"F128",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: die Leistung im Team seit Wochen sinkt. Was ist der sinnvollste erste Schritt? (Variante 29)",a:["Sofort eine Entscheidung allein treffen und kommunizieren","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Thema vertagen, bis es sich von selbst beruhigt","SMART Erwartungen, Verantwortlichkeiten, Deadlines."],r:[3]},
{id:"F129",k:"Führung",farbe:"#2471A3",q:"In deiner Rolle als Führungskraft: du eine Veränderung (Change) einführen musst. Was ist der sinnvollste erste Schritt? (Variante 30)",a:["Die Verantwortung vollständig an eine andere Person abgeben","SMART Erwartungen, Verantwortlichkeiten, Deadlines.","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[1]},
{id:"K130",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: ein Teammitglied passiv-aggressiv reagiert. Was ist der sinnvollste erste Schritt?",a:["Die Verantwortung vollständig an eine andere Person abgeben","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Rahmen setzen, Regeln, nacheinander sprechen.","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[2]},
{id:"K131",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: Gerüchte im Team die Stimmung kippen lassen. Was ist der sinnvollste erste Schritt?",a:["Sofort eine Entscheidung allein treffen und kommunizieren","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Die Verantwortung vollständig an eine andere Person abgeben","RACI/Zuständigkeiten fixieren."],r:[3]},
{id:"K132",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: zwei Abteilungen sich gegenseitig blockieren. Was ist der sinnvollste erste Schritt?",a:["Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Das Thema vertagen, bis es sich von selbst beruhigt","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Ich-Botschaften, konkrete Beispiele, Vereinbarung."],r:[3]},
{id:"K133",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: ein Konflikt um Ressourcen entsteht. Was ist der sinnvollste erste Schritt?",a:["Sofort eine Entscheidung allein treffen und kommunizieren","Ich-Botschaften, konkrete Beispiele, Vereinbarung.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[1]},
{id:"K134",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: ein Kunde sich über Tonfall beschwert. Was ist der sinnvollste erste Schritt?",a:["Sofort eine Entscheidung allein treffen und kommunizieren","Das Thema vertagen, bis es sich von selbst beruhigt","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Bedürfnisse klären, gemeinsame Ziele definieren."],r:[3]},
{id:"K135",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: über Zuständigkeiten gestritten wird. Was ist der sinnvollste erste Schritt?",a:["Rahmen setzen, Regeln, nacheinander sprechen.","Das Thema vertagen, bis es sich von selbst beruhigt","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Die Verantwortung vollständig an eine andere Person abgeben"],r:[0]},
{id:"K136",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: ein Mitarbeiter sich unfair behandelt fühlt. Was ist der sinnvollste erste Schritt?",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Bedürfnisse klären, gemeinsame Ziele definieren.","Die Verantwortung vollständig an eine andere Person abgeben"],r:[2]},
{id:"K137",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: ein Streit in einem Meeting eskaliert. Was ist der sinnvollste erste Schritt?",a:["Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Sofort eine Entscheidung allein treffen und kommunizieren","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Ich-Botschaften, konkrete Beispiele, Vereinbarung."],r:[3]},
{id:"K138",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: ein Teammitglied passiv-aggressiv reagiert. Was ist der sinnvollste erste Schritt? (Variante 9)",a:["Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Das Thema vertagen, bis es sich von selbst beruhigt","RACI/Zuständigkeiten fixieren.","Die Verantwortung vollständig an eine andere Person abgeben"],r:[2]},
{id:"K139",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: ein Teammitglied passiv-aggressiv reagiert. Was ist der sinnvollste erste Schritt? (Variante 10)",a:["Ich-Botschaften, konkrete Beispiele, Vereinbarung.","Die Verantwortung vollständig an eine andere Person abgeben","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[0]},
{id:"K140",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: über Zuständigkeiten gestritten wird. Was ist der sinnvollste erste Schritt? (Variante 11)",a:["Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Ich-Botschaften, konkrete Beispiele, Vereinbarung.","Sofort eine Entscheidung allein treffen und kommunizieren","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[1]},
{id:"K141",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: Gerüchte im Team die Stimmung kippen lassen. Was ist der sinnvollste erste Schritt? (Variante 12)",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Sofort eine Entscheidung allein treffen und kommunizieren","Die Verantwortung vollständig an eine andere Person abgeben","Pause, Emotionen benennen, Sachebene herstellen."],r:[3]},
{id:"K142",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: es wiederholt zu Missverständnissen kommt. Was ist der sinnvollste erste Schritt?",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Die Verantwortung vollständig an eine andere Person abgeben","Pause, Emotionen benennen, Sachebene herstellen.","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[2]},
{id:"K143",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: Gerüchte im Team die Stimmung kippen lassen. Was ist der sinnvollste erste Schritt? (Variante 14)",a:["Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Die Verantwortung vollständig an eine andere Person abgeben","Ich-Botschaften, konkrete Beispiele, Vereinbarung."],r:[3]},
{id:"K144",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: über Zuständigkeiten gestritten wird. Was ist der sinnvollste erste Schritt? (Variante 15)",a:["Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Die Verantwortung vollständig an eine andere Person abgeben","RACI/Zuständigkeiten fixieren.","Sofort eine Entscheidung allein treffen und kommunizieren"],r:[2]},
{id:"K145",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: ein Kunde sich über Tonfall beschwert. Was ist der sinnvollste erste Schritt? (Variante 16)",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Rahmen setzen, Regeln, nacheinander sprechen."],r:[3]},
{id:"K146",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: ein Mitarbeiter sich unfair behandelt fühlt. Was ist der sinnvollste erste Schritt? (Variante 17)",a:["Einzelne Schuldige benennen, um ein Exempel zu statuieren","RACI/Zuständigkeiten fixieren.","Sofort eine Entscheidung allein treffen und kommunizieren","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[1]},
{id:"K147",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: ein Streit in einem Meeting eskaliert. Was ist der sinnvollste erste Schritt? (Variante 18)",a:["Sofort eine Entscheidung allein treffen und kommunizieren","Bedürfnisse klären, gemeinsame Ziele definieren.","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[1]},
{id:"K148",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: ein Streit in einem Meeting eskaliert. Was ist der sinnvollste erste Schritt? (Variante 19)",a:["Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Das Thema vertagen, bis es sich von selbst beruhigt","Die Verantwortung vollständig an eine andere Person abgeben","Pause, Emotionen benennen, Sachebene herstellen."],r:[3]},
{id:"K149",k:"Konflikt",farbe:"#E74C3C",q:"In deiner Rolle als Führungskraft: ein Teammitglied passiv-aggressiv reagiert. Was ist der sinnvollste erste Schritt? (Variante 20)",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Pause, Emotionen benennen, Sachebene herstellen.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[2]},
{id:"M150",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: das Team zu wenig Anerkennung bekommt. Was ist der sinnvollste erste Schritt?",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","konkret loben, Erfolge sichtbar machen.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[2]},
{id:"M151",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: ein neuer Kollege nicht integriert wird. Was ist der sinnvollste erste Schritt?",a:["Das Thema vertagen, bis es sich von selbst beruhigt","konkret loben, Erfolge sichtbar machen.","Sofort eine Entscheidung allein treffen und kommunizieren","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[1]},
{id:"M152",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: das Team zu wenig Anerkennung bekommt. Was ist der sinnvollste erste Schritt? (Variante 3)",a:["Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Die Verantwortung vollständig an eine andere Person abgeben","Beitrag zum Ganzen sichtbar machen."],r:[3]},
{id:"M153",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: die Zielerreichung nur noch über Druck funktioniert. Was ist der sinnvollste erste Schritt?",a:["konkret loben, Erfolge sichtbar machen.","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Die Verantwortung vollständig an eine andere Person abgeben"],r:[0]},
{id:"M154",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: Mikromanagement die Eigeninitiative tötet. Was ist der sinnvollste erste Schritt?",a:["Beitrag zum Ganzen sichtbar machen.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Das Thema vertagen, bis es sich von selbst beruhigt","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[0]},
{id:"M155",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: ein Teammitglied innerlich gekündigt wirkt. Was ist der sinnvollste erste Schritt?",a:["Einzelne Schuldige benennen, um ein Exempel zu statuieren","Handlungsspielräume geben, Verantwortung übertragen.","Das Thema vertagen, bis es sich von selbst beruhigt","Die Verantwortung vollständig an eine andere Person abgeben"],r:[1]},
{id:"M156",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: nach einer Umstrukturierung Unsicherheit herrscht. Was ist der sinnvollste erste Schritt?",a:["konkret loben, Erfolge sichtbar machen.","Die Verantwortung vollständig an eine andere Person abgeben","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[0]},
{id:"M157",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: ein neuer Kollege nicht integriert wird. Was ist der sinnvollste erste Schritt? (Variante 8)",a:["Beitrag zum Ganzen sichtbar machen.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären"],r:[0]},
{id:"M158",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: das Team zu wenig Anerkennung bekommt. Was ist der sinnvollste erste Schritt? (Variante 9)",a:["Training/Coaching, klare Lernziele, Feedback.","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Sofort eine Entscheidung allein treffen und kommunizieren","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[0]},
{id:"M159",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: zu viele parallele Aufgaben Überforderung erzeugen. Was ist der sinnvollste erste Schritt?",a:["Die Verantwortung vollständig an eine andere Person abgeben","Das Thema vertagen, bis es sich von selbst beruhigt","konkret loben, Erfolge sichtbar machen.","Sofort eine Entscheidung allein treffen und kommunizieren"],r:[2]},
{id:"M160",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: die Arbeit monoton ist und Fehler steigen. Was ist der sinnvollste erste Schritt?",a:["Sofort eine Entscheidung allein treffen und kommunizieren","konkret loben, Erfolge sichtbar machen.","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[1]},
{id:"M161",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: ein Teammitglied innerlich gekündigt wirkt. Was ist der sinnvollste erste Schritt? (Variante 12)",a:["realistische Ziele, Prioritäten, Fokus.","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[0]},
{id:"M162",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: ein Bonus gestrichen wurde und Frust entsteht. Was ist der sinnvollste erste Schritt?",a:["Einzelne Schuldige benennen, um ein Exempel zu statuieren","Sofort eine Entscheidung allein treffen und kommunizieren","Das Thema vertagen, bis es sich von selbst beruhigt","konkret loben, Erfolge sichtbar machen."],r:[3]},
{id:"M163",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: die Zielerreichung nur noch über Druck funktioniert. Was ist der sinnvollste erste Schritt? (Variante 14)",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","realistische Ziele, Prioritäten, Fokus."],r:[3]},
{id:"M164",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: ein sinnvoller Zweck (Purpose) fehlt. Was ist der sinnvollste erste Schritt?",a:["realistische Ziele, Prioritäten, Fokus.","Sofort eine Entscheidung allein treffen und kommunizieren","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[0]},
{id:"M165",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: das Team zu wenig Anerkennung bekommt. Was ist der sinnvollste erste Schritt? (Variante 16)",a:["Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","realistische Ziele, Prioritäten, Fokus.","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[2]},
{id:"M166",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: ein neuer Kollege nicht integriert wird. Was ist der sinnvollste erste Schritt? (Variante 17)",a:["Handlungsspielräume geben, Verantwortung übertragen.","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Thema vertagen, bis es sich von selbst beruhigt","Die Verantwortung vollständig an eine andere Person abgeben"],r:[0]},
{id:"M167",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: zu viele parallele Aufgaben Überforderung erzeugen. Was ist der sinnvollste erste Schritt? (Variante 18)",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Einzelne Schuldige benennen, um ein Exempel zu statuieren","realistische Ziele, Prioritäten, Fokus.","Die Verantwortung vollständig an eine andere Person abgeben"],r:[2]},
{id:"M168",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: ein sinnvoller Zweck (Purpose) fehlt. Was ist der sinnvollste erste Schritt? (Variante 19)",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Handlungsspielräume geben, Verantwortung übertragen.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Die Verantwortung vollständig an eine andere Person abgeben"],r:[1]},
{id:"M169",k:"Motivation",farbe:"#1E8449",q:"In deiner Rolle als Führungskraft: nach einer Umstrukturierung Unsicherheit herrscht. Was ist der sinnvollste erste Schritt? (Variante 20)",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Training/Coaching, klare Lernziele, Feedback.","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[1]},
{id:"KO170",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: ein Missverständnis per Chat eskaliert. Was ist der sinnvollste erste Schritt?",a:["Sofort eine Entscheidung allein treffen und kommunizieren","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Wirkung schildern statt Vorwurf.","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[2]},
{id:"KO171",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: du zwischen zwei Parteien vermitteln musst. Was ist der sinnvollste erste Schritt?",a:["kurz, faktenbasiert, freundlich, klar.","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Die Verantwortung vollständig an eine andere Person abgeben"],r:[0]},
{id:"KO172",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: du negatives Feedback geben musst. Was ist der sinnvollste erste Schritt?",a:["Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","offene Fragen, Verständnis sichern.","Die Verantwortung vollständig an eine andere Person abgeben","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[1]},
{id:"KO173",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: ein Stakeholder-Meeting mit Widerstand ansteht. Was ist der sinnvollste erste Schritt?",a:["Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","offene Fragen, Verständnis sichern.","Sofort eine Entscheidung allein treffen und kommunizieren"],r:[2]},
{id:"KO174",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: du zwischen zwei Parteien vermitteln musst. Was ist der sinnvollste erste Schritt? (Variante 5)",a:["Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Sofort eine Entscheidung allein treffen und kommunizieren","Wirkung schildern statt Vorwurf.","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[2]},
{id:"KO175",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: du eine Präsentation für Führungsebene hältst. Was ist der sinnvollste erste Schritt?",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Wirkung schildern statt Vorwurf.","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[1]},
{id:"KO176",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: du Erwartungen an Qualität kommunizieren musst. Was ist der sinnvollste erste Schritt?",a:["Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","paraphrasieren, nachfragen, bestätigen.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[1]},
{id:"KO177",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: ein Teammitglied kaum spricht und Infos fehlen. Was ist der sinnvollste erste Schritt?",a:["Einzelne Schuldige benennen, um ein Exempel zu statuieren","Kernaussage, Gründe, nächste Schritte.","Sofort eine Entscheidung allein treffen und kommunizieren","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[1]},
{id:"KO178",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: ein wichtiges Change-Update kommuniziert werden muss. Was ist der sinnvollste erste Schritt?",a:["Sofort eine Entscheidung allein treffen und kommunizieren","Wirkung schildern statt Vorwurf.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Die Verantwortung vollständig an eine andere Person abgeben"],r:[1]},
{id:"KO179",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: ein Teammitglied kaum spricht und Infos fehlen. Was ist der sinnvollste erste Schritt? (Variante 10)",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Sofort eine Entscheidung allein treffen und kommunizieren","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","paraphrasieren, nachfragen, bestätigen."],r:[3]},
{id:"KO180",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: ein Stakeholder-Meeting mit Widerstand ansteht. Was ist der sinnvollste erste Schritt? (Variante 11)",a:["Sofort eine Entscheidung allein treffen und kommunizieren","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Einzelne Schuldige benennen, um ein Exempel zu statuieren","paraphrasieren, nachfragen, bestätigen."],r:[3]},
{id:"KO181",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: ein Stakeholder-Meeting mit Widerstand ansteht. Was ist der sinnvollste erste Schritt? (Variante 12)",a:["Sofort eine Entscheidung allein treffen und kommunizieren","Einzelne Schuldige benennen, um ein Exempel zu statuieren","kurz, faktenbasiert, freundlich, klar.","Die Verantwortung vollständig an eine andere Person abgeben"],r:[2]},
{id:"KO182",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: du negatives Feedback geben musst. Was ist der sinnvollste erste Schritt? (Variante 13)",a:["kurz, faktenbasiert, freundlich, klar.","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Sofort eine Entscheidung allein treffen und kommunizieren"],r:[0]},
{id:"KO183",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: du negatives Feedback geben musst. Was ist der sinnvollste erste Schritt? (Variante 14)",a:["paraphrasieren, nachfragen, bestätigen.","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Thema vertagen, bis es sich von selbst beruhigt","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[0]},
{id:"KO184",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: ein Missverständnis per Chat eskaliert. Was ist der sinnvollste erste Schritt? (Variante 15)",a:["Kernaussage, Gründe, nächste Schritte.","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären"],r:[0]},
{id:"KO185",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: du zwischen zwei Parteien vermitteln musst. Was ist der sinnvollste erste Schritt? (Variante 16)",a:["Sofort eine Entscheidung allein treffen und kommunizieren","offene Fragen, Verständnis sichern.","Die Verantwortung vollständig an eine andere Person abgeben","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[1]},
{id:"KO186",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: remote Meetings ineffektiv sind. Was ist der sinnvollste erste Schritt?",a:["Einzelne Schuldige benennen, um ein Exempel zu statuieren","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Kernaussage, Gründe, nächste Schritte.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[2]},
{id:"KO187",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: du negatives Feedback geben musst. Was ist der sinnvollste erste Schritt? (Variante 18)",a:["Kernaussage, Gründe, nächste Schritte.","Das Thema vertagen, bis es sich von selbst beruhigt","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Die Verantwortung vollständig an eine andere Person abgeben"],r:[0]},
{id:"KO188",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: du eine Entscheidung transparent erklären musst. Was ist der sinnvollste erste Schritt?",a:["Die Verantwortung vollständig an eine andere Person abgeben","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Einzelne Schuldige benennen, um ein Exempel zu statuieren","kurz, faktenbasiert, freundlich, klar."],r:[3]},
{id:"KO189",k:"Kommunikation",farbe:"#117A65",q:"In deiner Rolle als Führungskraft: ein Teammitglied kaum spricht und Infos fehlen. Was ist der sinnvollste erste Schritt? (Variante 20)",a:["Sofort eine Entscheidung allein treffen und kommunizieren","kurz, faktenbasiert, freundlich, klar.","Das Thema vertagen, bis es sich von selbst beruhigt","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären"],r:[1]},
{id:"P190",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: Schichtplanung zu Unzufriedenheit führt. Was ist der sinnvollste erste Schritt?",a:["Einzelne Schuldige benennen, um ein Exempel zu statuieren","Das Thema vertagen, bis es sich von selbst beruhigt","Kriterien offenlegen, Gleichbehandlung.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[2]},
{id:"P191",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: eine Abmahnung im Raum steht. Was ist der sinnvollste erste Schritt?",a:["Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Die Verantwortung vollständig an eine andere Person abgeben","Fakten sammeln, sauber dokumentieren.","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[2]},
{id:"P192",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: eine Probezeitentscheidung getroffen werden muss. Was ist der sinnvollste erste Schritt?",a:["klar, respektvoll, lösungsorientiert.","Die Verantwortung vollständig an eine andere Person abgeben","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären"],r:[0]},
{id:"P193",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: Schichtplanung zu Unzufriedenheit führt. Was ist der sinnvollste erste Schritt? (Variante 4)",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Sofort eine Entscheidung allein treffen und kommunizieren","Maßnahmenplan, Meilensteine, Follow-up.","Die Verantwortung vollständig an eine andere Person abgeben"],r:[2]},
{id:"P194",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: du ein Bewerbungsgespräch führst. Was ist der sinnvollste erste Schritt?",a:["Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Sofort eine Entscheidung allein treffen und kommunizieren","Kriterien offenlegen, Gleichbehandlung."],r:[3]},
{id:"P195",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: eine Leistungsbeurteilung ansteht. Was ist der sinnvollste erste Schritt?",a:["Die Verantwortung vollständig an eine andere Person abgeben","Sofort eine Entscheidung allein treffen und kommunizieren","HR einbinden, Regeln einhalten.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[2]},
{id:"P196",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: eine Abmahnung im Raum steht. Was ist der sinnvollste erste Schritt? (Variante 7)",a:["Maßnahmenplan, Meilensteine, Follow-up.","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[0]},
{id:"P197",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: eine Probezeitentscheidung getroffen werden muss. Was ist der sinnvollste erste Schritt? (Variante 8)",a:["Die Verantwortung vollständig an eine andere Person abgeben","Fakten sammeln, sauber dokumentieren.","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[1]},
{id:"P198",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: ein Konflikt mit Betriebsrat absehbar ist. Was ist der sinnvollste erste Schritt?",a:["Sofort eine Entscheidung allein treffen und kommunizieren","HR einbinden, Regeln einhalten.","Das Thema vertagen, bis es sich von selbst beruhigt","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[1]},
{id:"P199",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: Schichtplanung zu Unzufriedenheit führt. Was ist der sinnvollste erste Schritt? (Variante 10)",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","klar, respektvoll, lösungsorientiert."],r:[3]},
{id:"P200",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: eine Leistungsbeurteilung ansteht. Was ist der sinnvollste erste Schritt? (Variante 11)",a:["Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Maßnahmenplan, Meilensteine, Follow-up.","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[2]},
{id:"P201",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: eine Weiterbildung geplant werden soll. Was ist der sinnvollste erste Schritt?",a:["Die Verantwortung vollständig an eine andere Person abgeben","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Einzelne Schuldige benennen, um ein Exempel zu statuieren","klar, respektvoll, lösungsorientiert."],r:[3]},
{id:"P202",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: ein Teammitglied Versetzungswunsch äußert. Was ist der sinnvollste erste Schritt?",a:["Die Verantwortung vollständig an eine andere Person abgeben","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Kriterien offenlegen, Gleichbehandlung.","Das Thema vertagen, bis es sich von selbst beruhigt"],r:[2]},
{id:"P203",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: eine Weiterbildung geplant werden soll. Was ist der sinnvollste erste Schritt? (Variante 14)",a:["Die Verantwortung vollständig an eine andere Person abgeben","Das Thema vertagen, bis es sich von selbst beruhigt","Fakten sammeln, sauber dokumentieren.","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[2]},
{id:"P204",k:"Personal",farbe:"#7D3C98",q:"In deiner Rolle als Führungskraft: eine Abmahnung im Raum steht. Was ist der sinnvollste erste Schritt? (Variante 15)",a:["Die Verantwortung vollständig an eine andere Person abgeben","Das Thema vertagen, bis es sich von selbst beruhigt","klar, respektvoll, lösungsorientiert.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[2]},
{id:"B205",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: die Fehlzeiten im Team stark steigen. Was ist der sinnvollste erste Schritt?",a:["Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Sofort eine Entscheidung allein treffen und kommunizieren","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Belastungen identifizieren und Ursachen reduzieren."],r:[3]},
{id:"B206",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: ein BGM-Programm eingeführt werden soll. Was ist der sinnvollste erste Schritt?",a:["Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Die Verantwortung vollständig an eine andere Person abgeben","Sofort eine Entscheidung allein treffen und kommunizieren","Arbeitsbedingungen + individuelles Verhalten."],r:[3]},
{id:"B207",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: die Fehlzeiten im Team stark steigen. Was ist der sinnvollste erste Schritt? (Variante 3)",a:["frühzeitig ansprechen, Angebote vermitteln.","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Thema vertagen, bis es sich von selbst beruhigt","Sofort eine Entscheidung allein treffen und kommunizieren"],r:[0]},
{id:"B208",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: Ergonomie am Arbeitsplatz schlecht ist. Was ist der sinnvollste erste Schritt?",a:["Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Arbeitsbedingungen + individuelles Verhalten.","Sofort eine Entscheidung allein treffen und kommunizieren","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[1]},
{id:"B209",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: psychische Belastung durch Dauerstress sichtbar wird. Was ist der sinnvollste erste Schritt?",a:["Die Verantwortung vollständig an eine andere Person abgeben","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","frühzeitig ansprechen, Angebote vermitteln."],r:[3]},
{id:"B210",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: die Fehlzeiten im Team stark steigen. Was ist der sinnvollste erste Schritt? (Variante 6)",a:["Die Verantwortung vollständig an eine andere Person abgeben","Einzelne Schuldige benennen, um ein Exempel zu statuieren","Das Thema vertagen, bis es sich von selbst beruhigt","Pausen, Prioritäten, Ressourcenausgleich."],r:[3]},
{id:"B211",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: eine Gefährdungsbeurteilung ansteht. Was ist der sinnvollste erste Schritt?",a:["Sofort eine Entscheidung allein treffen und kommunizieren","Das Thema vertagen, bis es sich von selbst beruhigt","frühzeitig ansprechen, Angebote vermitteln.","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[2]},
{id:"B212",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: viele Überstunden anfallen. Was ist der sinnvollste erste Schritt?",a:["frühzeitig ansprechen, Angebote vermitteln.","Die Verantwortung vollständig an eine andere Person abgeben","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[0]},
{id:"B213",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: Rückkehrgespräche nach Krankheit geführt werden müssen. Was ist der sinnvollste erste Schritt?",a:["Das Thema vertagen, bis es sich von selbst beruhigt","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Pausen, Prioritäten, Ressourcenausgleich.","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[2]},
{id:"B214",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: Ergonomie am Arbeitsplatz schlecht ist. Was ist der sinnvollste erste Schritt? (Variante 10)",a:["Belastungen identifizieren und Ursachen reduzieren.","Sofort eine Entscheidung allein treffen und kommunizieren","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Die Verantwortung vollständig an eine andere Person abgeben"],r:[0]},
{id:"B215",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: Ergonomie am Arbeitsplatz schlecht ist. Was ist der sinnvollste erste Schritt? (Variante 11)",a:["Die Verantwortung vollständig an eine andere Person abgeben","Sofort eine Entscheidung allein treffen und kommunizieren","Plan, Abstimmung, Schonung.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen"],r:[2]},
{id:"B216",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: psychische Belastung durch Dauerstress sichtbar wird. Was ist der sinnvollste erste Schritt? (Variante 12)",a:["Arbeitsbedingungen + individuelles Verhalten.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Die Verantwortung vollständig an eine andere Person abgeben","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären"],r:[0]},
{id:"B217",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: Rückkehrgespräche nach Krankheit geführt werden müssen. Was ist der sinnvollste erste Schritt? (Variante 13)",a:["Belastungen identifizieren und Ursachen reduzieren.","Das Thema vertagen, bis es sich von selbst beruhigt","Die Verantwortung vollständig an eine andere Person abgeben","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären"],r:[0]},
{id:"B218",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: psychische Belastung durch Dauerstress sichtbar wird. Was ist der sinnvollste erste Schritt? (Variante 14)",a:["Plan, Abstimmung, Schonung.","Das Thema vertagen, bis es sich von selbst beruhigt","Sofort eine Entscheidung allein treffen und kommunizieren","Mit Druck/Deadline arbeiten, ohne Ursachen zu klären"],r:[0]},
{id:"B219",k:"BGM",farbe:"#D68910",q:"In deiner Rolle als Führungskraft: Rückkehrgespräche nach Krankheit geführt werden müssen. Was ist der sinnvollste erste Schritt? (Variante 15)",a:["Mit Druck/Deadline arbeiten, ohne Ursachen zu klären","Arbeitsbedingungen + individuelles Verhalten.","Das Problem primär per E-Mail/Chat klären, um Zeit zu sparen","Einzelne Schuldige benennen, um ein Exempel zu statuieren"],r:[1]},
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
type Screen = "login" | "register" | "home" | "quiz" | "result" | "stats" | "kategorie" | "admin"
type Mode = "pruefung" | "lern" | "schwach"

interface User {
  id: string
  email: string
  name: string
  role: string
  questionsAnswered?: number
}

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
}

interface UserStats {
  totalCorrect: number
  totalWrong: number
  totalAnswers: number
  percentage: number
  categoryStats: Record<string, { correct: number; wrong: number; total: number }>
  recentSessions: any[]
  questionCount: number
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function App() {
  const [screen, setScreen] = useState<Screen>("login")
  const [mode, setMode] = useState<Mode>("pruefung")
  const [kat, setKat] = useState<string>("Alle")
  const [fragen, setFragen] = useState<Frage[]>([])
  const [idx, setIdx] = useState(0)
  const [sel, setSel] = useState<number[]>([])
  const [best, setBest] = useState(false)
  const [erg, setErg] = useState<Ergebnis[]>([])
  const [t0, setT0] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  
  // Auth state
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  
  // Stats state
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [adminStats, setAdminStats] = useState<any>(null)
  
  // Premium state (für später)
  const [premiumUsers, setPremiumUsers] = useState<any[]>([])

  // Check session on mount
  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
          setScreen("home")
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Timer
  useEffect(() => {
    let t: NodeJS.Timeout
    if (screen === "quiz" && t0) {
      t = setInterval(() => setElapsed(Math.floor((Date.now() - t0) / 1000)), 1000)
    }
    return () => clearInterval(t)
  }, [screen, t0])

  // Load user stats when user changes
  useEffect(() => {
    if (user && screen === "home") {
      fetch('/api/quiz/stats')
        .then(res => res.json())
        .then(data => setUserStats(data))
        .catch(console.error)
    }
  }, [user, screen])

  // Auth functions
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Fehler beim Anmelden')
        return
      }
      
      setUser(data.user)
      setScreen("home")
      setEmail("")
      setPassword("")
    } catch (err) {
      setError('Ein Fehler ist aufgetreten')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen haben')
      return
    }
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Fehler beim Registrieren')
        return
      }
      
      setUser(data.user)
      setScreen("home")
      setEmail("")
      setPassword("")
      setName("")
    } catch (err) {
      setError('Ein Fehler ist aufgetreten')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setUserStats(null)
    setScreen("login")
  }

  const start = useCallback(() => {
    let pool = kat === "Alle" ? ALLE_FRAGEN : ALLE_FRAGEN.filter(f => f.k === kat)
    
    if (mode === "schwach" && userStats) {
      // Get questions that were answered wrong
      const wrongQuestions = Object.entries(userStats.categoryStats)
        .flatMap(([cat, stats]) => {
          if (stats.wrong > 0) {
            return ALLE_FRAGEN.filter(f => 
              f.k === cat || 
              (cat === 'Konflikt' && f.k === 'Konflikt') ||
              (cat === 'Kommunikation' && f.k === 'Kommunikation')
            )
          }
          return []
        })
      
      if (wrongQuestions.length > 0) {
        pool = wrongQuestions
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
  }, [mode, kat, userStats, user])

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
  }

  const saveQuizResults = async () => {
    const total = erg.length
    const correct = erg.filter(e => e.korrekt).length
    
    await fetch('/api/quiz/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode,
        category: kat,
        totalQuestions: total,
        correctAnswers: correct,
        duration: elapsed,
        questionResults: erg.map(e => ({
          questionId: e.id,
          correct: e.korrekt
        }))
      })
    })
  }

  const next = () => {
    if (idx + 1 >= fragen.length) {
      saveQuizResults()
      setScreen("result")
    } else {
      setIdx(i => i + 1)
      setSel([])
      setBest(false)
    }
  }

  const loadAdminStats = async () => {
    const res = await fetch('/api/admin/stats')
    if (res.ok) {
      const data = await res.json()
      setAdminStats(data)
    }
  }
  
  const loadPremiumUsers = async () => {
    const res = await fetch('/api/admin/premium')
    if (res.ok) {
      const data = await res.json()
      setPremiumUsers(data.users || [])
    }
  }
  
  const togglePremium = async (targetUserId: string, isPremium: boolean) => {
    const res = await fetch('/api/admin/premium', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId, isPremium })
    })
    if (res.ok) {
      loadPremiumUsers()
      loadAdminStats()
    }
  }
  
  

  const frage = fragen[idx]
  const mm = Math.floor(elapsed / 60).toString().padStart(2, "0")
  const ss = (elapsed % 60).toString().padStart(2, "0")

  const getAnswerStatus = (i: number): "correct" | "wrong" | "missed" | "neutral" | "selected" => {
    if (!best) return sel.includes(i) ? "selected" : "neutral"
    const isCorrect = frage.r.includes(i)
    const isSelected = sel.includes(i)
    if (isCorrect && isSelected) return "correct"
    if (!isCorrect && isSelected) return "wrong"
    if (isCorrect && !isSelected) return "missed"
    return "neutral"
  }

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 animate-pulse">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <p className="mt-4 text-slate-300">Wird geladen...</p>
        </div>
      </div>
    )
  }

  // ==========================================================================
  // LOGIN SCREEN
  // ==========================================================================
  if (screen === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/80 border-slate-800 backdrop-blur">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">CLE Quiz</CardTitle>
            <CardDescription>Bitte melde dich an, um fortzufahren</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@beispiel.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <Button type="submit" className="w-full py-6 bg-gradient-to-r from-cyan-500 to-teal-500">
                <LogIn className="w-4 h-4 mr-2" />
                Anmelden
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-slate-300 text-sm">
                Noch kein Konto?{' '}
                <button
                  onClick={() => { setScreen("register"); setError("") }}
                  className="text-cyan-400 hover:underline"
                >
                  Registrieren
                </button>
              </p>
            </div>
          </CardContent>
          <div className="text-center pb-4 text-xs text-slate-400">
            Ersteller: A.Neu
          </div>
        </Card>
      </div>
    )
  }

  // ==========================================================================
  // REGISTER SCREEN
  // ==========================================================================
  if (screen === "register") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/80 border-slate-800 backdrop-blur">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Konto erstellen</CardTitle>
            <CardDescription>Registriere dich, um deine Statistiken zu speichern</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Dein Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="name@beispiel.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Passwort</Label>
                <Input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-800 border-slate-700"
                />
                <p className="text-xs text-slate-300">Mindestens 6 Zeichen</p>
              </div>
              <Button type="submit" className="w-full py-6 bg-gradient-to-r from-cyan-500 to-teal-500">
                <UserPlus className="w-4 h-4 mr-2" />
                Registrieren
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-slate-300 text-sm">
                Bereits registriert?{' '}
                <button
                  onClick={() => { setScreen("login"); setError("") }}
                  className="text-cyan-400 hover:underline"
                >
                  Anmelden
                </button>
              </p>
            </div>
          </CardContent>
          <div className="text-center pb-4 text-xs text-slate-400">
            Ersteller: A.Neu
          </div>
        </Card>
      </div>
    )
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
            <p className="text-slate-300 text-sm">Certified Leadership Expert · IHK</p>
            
            {/* User info */}
            <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
              <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-slate-700">
                {user?.name || user?.email}
              </Badge>
              {user?.role === 'admin' && (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
          </div>

          {/* Stats Overview */}
          {userStats && userStats.totalAnswers > 0 && (
            <Card className="bg-slate-800/80 border-slate-800 mb-6 backdrop-blur">
              <CardContent className="pt-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">{userStats.totalAnswers}</div>
                    <div className="text-xs text-slate-300">Antworten</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${userStats.percentage >= 70 ? "text-emerald-400" : "text-amber-400"}`}>
                      {userStats.percentage}%
                    </div>
                    <div className="text-xs text-slate-300">Quote</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{userStats.questionCount}</div>
                    <div className="text-xs text-slate-300">Fragen</div>
                  </div>
                </div>
                <Progress value={userStats.percentage} className="mt-4 h-2" />
              </CardContent>
            </Card>
          )}

          {/* Mode Selection */}
          <Card className="bg-slate-800/80 border-slate-800 mb-4 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">MODUS WÄHLEN</CardTitle>
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
                  className="w-full p-4 rounded-xl border transition-all duration-200 text-left flex items-center gap-3"
                  style={{
                    backgroundColor: mode === m.id 
                      ? (m.color === "cyan" ? "rgba(6, 182, 212, 0.1)" : m.color === "emerald" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)")
                      : "rgba(30, 41, 59, 0.5)",
                    borderColor: mode === m.id 
                      ? (m.color === "cyan" ? "rgba(6, 182, 212, 0.5)" : m.color === "emerald" ? "rgba(16, 185, 129, 0.5)" : "rgba(245, 158, 11, 0.5)")
                      : "rgba(71, 85, 105, 0.5)",
                    color: mode === m.id ? "white" : "#94a3b8"
                  }}
                >
                  <m.icon className="w-5 h-5 flex-shrink-0" style={{ color: m.color === "cyan" ? "#06b6d4" : m.color === "emerald" ? "#10b981" : "#f59e0b" }} />
                  <div className="flex-1">
                    <div className="font-semibold">{m.label}</div>
                    <div className="text-xs text-slate-300">{m.desc}</div>
                  </div>
                  {mode === m.id && <CheckCircle2 className="w-5 h-5" style={{ color: m.color === "cyan" ? "#06b6d4" : m.color === "emerald" ? "#10b981" : "#f59e0b" }} />}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card className="bg-slate-800/80 border-slate-800 mb-6 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">THEMA (optional)</CardTitle>
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
            
            <Button
              onClick={() => setScreen("stats")}
              variant="outline"
              className="w-full py-5 border-slate-700 bg-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Meine Statistik
            </Button>

            {user?.role === 'admin' && (
              <Button
                onClick={() => { loadAdminStats(); setScreen("admin") }}
                variant="outline"
                className="w-full py-5 border-amber-500/50 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
              >
                <Shield className="w-5 h-5 mr-2" />
                Admin Dashboard
              </Button>
            )}

            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full py-4 text-slate-300 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Abmelden
            </Button>
          </div>
          
          {/* Ersteller-Hinweis */}
          <div className="text-center mt-8 text-xs text-slate-400">
            Ersteller: A.Neu
          </div>
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
                className="text-slate-300 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="text-center">
                <div className="font-bold">
                  {idx + 1} <span className="text-slate-300 font-normal">/ {fragen.length}</span>
                </div>
                {mode === "pruefung" && (
                  <div className="text-xs text-slate-300 flex items-center gap-1 justify-center">
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
                <div className="text-xs text-slate-300 mt-1 text-center">
                  ✓ {correctCount} / {erg.length} richtig
                </div>
              )}
            </div>
          </div>

          {/* Question */}
          <div className="px-4 py-6">
            <Badge variant="outline" className="text-xs text-slate-300 border-slate-700 mb-3">
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
                      : "bg-slate-700/80 border-slate-700 hover:bg-slate-800"
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
                    : "bg-slate-800 text-slate-300"
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
          <Card className="bg-slate-800/80 border-slate-800 mb-6 backdrop-blur">
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold">{mm}:{ss}</div>
                  <div className="text-xs text-slate-300">Zeit</div>
                </div>
                <div>
                  <div className="text-xl font-bold">{correct}/{total}</div>
                  <div className="text-xs text-slate-300">Richtig</div>
                </div>
                <div>
                  <div className={`text-xl font-bold ${passed ? "text-emerald-400" : "text-red-400"}`}>{pct}%</div>
                  <div className="text-xs text-slate-300">Quote</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wrong Answers */}
          {wrong.length > 0 && (
            <Card className="bg-slate-800/80 border-slate-800 mb-6 backdrop-blur">
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
                        <div className="text-xs text-slate-300">[{f.id}] {f.k}</div>
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
                className="w-full py-5 border-slate-700 bg-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white"
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
                className="text-slate-300 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="font-bold text-lg">Meine Statistik</h1>
            </div>
          </div>

          {userStats && userStats.totalAnswers > 0 ? (
            <>
              {/* Overview */}
              <div className="px-4 py-6">
                <Card className="bg-slate-800/80 border-slate-800 mb-4">
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="text-5xl font-black text-cyan-400">{userStats.percentage}%</div>
                      <div className="text-sm text-slate-300">Gesamtergebnis</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-emerald-400">{userStats.totalCorrect}</div>
                        <div className="text-xs text-slate-300">Richtig</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-red-400">{userStats.totalWrong}</div>
                        <div className="text-xs text-slate-300">Falsch</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold">{userStats.questionCount}</div>
                        <div className="text-xs text-slate-300">Fragen</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Stats */}
                <Card className="bg-slate-800/80 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-sm text-slate-300">Nach Kategorie</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(userStats.categoryStats).map(([cat, stats]) => {
                      const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
                      const fc = ALLE_FRAGEN.find(f => f.k === cat)?.farbe || "#06b6d4"
                      
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span style={{ color: fc }}>{cat}</span>
                            <span className={pct >= 70 ? "text-emerald-400" : "text-amber-400"}>{pct}%</span>
                          </div>
                          <Progress value={pct} className="h-1.5" />
                          <div className="text-xs text-slate-300">
                            ✓ {stats.correct} · ✗ {stats.wrong}
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-300">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Noch keine Fragen beantwortet.</p>
              <Button
                onClick={() => setScreen("home")}
                className="mt-4"
                variant="outline"
              >
                Quiz starten
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ==========================================================================
  // ADMIN SCREEN
  // ==========================================================================
  if (screen === "admin" && adminStats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
            <div className="px-4 py-3 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setScreen("home")}
                className="text-slate-300 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="font-bold text-lg">Admin Dashboard</h1>
              <Badge className="ml-auto bg-amber-500/20 text-amber-400 border-amber-500/50">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            </div>
          </div>

          <div className="px-4 py-6 space-y-4">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="bg-slate-800/80 border-slate-800">
                <CardContent className="pt-4 text-center">
                  <Users className="w-6 h-6 mx-auto text-cyan-400 mb-2" />
                  <div className="text-2xl font-bold">{adminStats.totalUsers}</div>
                  <div className="text-xs text-slate-300">Benutzer</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/80 border-slate-800">
                <CardContent className="pt-4 text-center">
                  <Activity className="w-6 h-6 mx-auto text-emerald-400 mb-2" />
                  <div className="text-2xl font-bold">{adminStats.dailyActiveUsers}</div>
                  <div className="text-xs text-slate-300">Heute aktiv</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/80 border-slate-800">
                <CardContent className="pt-4 text-center">
                  <Target className="w-6 h-6 mx-auto text-amber-400 mb-2" />
                  <div className="text-2xl font-bold">{adminStats.totalSessions}</div>
                  <div className="text-xs text-slate-300">Sessions</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/80 border-slate-800">
                <CardContent className="pt-4 text-center">
                  <BarChart3 className="w-6 h-6 mx-auto text-purple-400 mb-2" />
                  <div className="text-2xl font-bold">{adminStats.weeklySessions}</div>
                  <div className="text-xs text-slate-300">Diese Woche</div>
                </CardContent>
              </Card>
            </div>

            {/* Total Answers */}
            <Card className="bg-slate-800/80 border-slate-800">
              <CardContent className="pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-slate-300">Insgesamt beantwortet</div>
                    <div className="text-2xl font-bold">
                      {adminStats.totalCorrect + adminStats.totalWrong} Fragen
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400">✓ {adminStats.totalCorrect}</div>
                    <div className="text-red-400">✗ {adminStats.totalWrong}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card className="bg-slate-800/80 border-slate-800">
              <CardHeader>
                <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Benutzer ({adminStats.users.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-2">
                    {adminStats.users.map((u: any) => (
                      <div
                        key={u.id}
                        className="p-3 rounded-lg bg-slate-700/80 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold">
                          {(u.name || u.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {u.name || u.email}
                          </div>
                          <div className="text-xs text-slate-300">{u.email}</div>
                          <div className="text-xs text-slate-300">
                            {u.questionsAnswered || 0} Fragen beantwortet
                          </div>
                        </div>
                        <div className="text-right text-xs">
                          <div className="text-slate-300">{u.sessionCount} Sessions</div>
                          <div className={u.percentage >= 70 ? "text-emerald-400" : "text-amber-400"}>
                            {u.percentage}% richtig
                          </div>
                        </div>
                        {u.role === 'admin' && (
                          <Badge className="bg-purple-500/20 text-purple-400">Admin</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-slate-800/80 border-slate-800">
              <CardHeader>
                <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Letzte Aktivität
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-60">
                  <div className="space-y-2">
                    {adminStats.recentActivity.map((a: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-800 last:border-0">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs">
                          {a.action === 'login' && <LogIn className="w-4 h-4 text-emerald-400" />}
                          {a.action === 'register' && <UserPlus className="w-4 h-4 text-cyan-400" />}
                          {a.action === 'quiz_complete' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                          {a.action === 'logout' && <LogOut className="w-4 h-4 text-slate-300" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm">{a.userName}</div>
                          <div className="text-xs text-slate-300">{a.action}</div>
                        </div>
                        <div className="text-xs text-slate-300">
                          {new Date(a.createdAt).toLocaleString('de-DE')}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return null
}
