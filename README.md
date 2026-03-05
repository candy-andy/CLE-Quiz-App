# CLE Quiz App

Eine professionelle Lern-App für die CLE (Certified Leadership Expert) Prüfungsvorbereitung.

![CLE Quiz App](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Prisma](https://img.shields.io/badge/Prisma-6-green)

## Features

- **207 Prüfungsfragen** in 6 Kategorien
- **3 Lernmodi**: Prüfungssimulation, Lernmodus, Schwächen-Training
- **Multi-User-Support** mit individuellen Statistiken
- **Admin-Dashboard** zur Benutzerverwaltung
- **Responsive Design** für Desktop & Mobile
- **Kostenloses Hosting** auf Vercel möglich

## Kategorien

| Kategorie | Fragen |
|-----------|--------|
| Führung | 48 |
| Konflikt | 40 |
| Motivation | 35 |
| Kommunikation | 27 |
| Personal | 30 |
| BGM | 27 |

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui Components
- **Datenbank**: PostgreSQL (Vercel Postgres / Supabase)
- **ORM**: Prisma
- **Auth**: bcrypt Passwort-Hashing, Cookie Sessions

## Schnellstart

```bash
# Repository klonen
git clone https://github.com/USERNAME/cle-quiz-app.git
cd cle-quiz-app

# Dependencies installieren
bun install

# Datenbank einrichten
cp .env.example .env
bun run db:push

# Entwicklungsserver starten
bun run dev
```

App öffnen: http://localhost:3000

## Deployment

Siehe [DEPLOYMENT.md](./DEPLOYMENT.md) für ausführliche Anleitung.

### Quick Deploy auf Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/USERNAME/cle-quiz-app)

## Admin-Zugang

- **Email**: admin@cle-quiz.de
- **Passwort**: 808080

## Ersteller

A.Neu

## Lizenz

Private / All Rights Reserved
