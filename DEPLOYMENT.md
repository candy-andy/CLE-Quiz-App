# CLE Quiz App - Deployment Guide

## Schnellstart: Kostenlos auf Vercel hosten

### Schritt 1: GitHub Repository erstellen

1. Gehen Sie zu [github.com](https://github.com) und loggen Sie sich ein
2. Klicken Sie auf "New Repository"
3. Name: `cle-quiz-app`
4. Wählen Sie "Private" oder "Public"
5. Klicken Sie "Create repository"

### Schritt 2: Code auf GitHub hochladen

In Ihrem lokalen Projektverzeichnis:

```bash
git init
git add .
git commit -m "Initial commit - CLE Quiz App"
git branch -M main
git remote add origin https://github.com/IHR-USERNAME/cle-quiz-app.git
git push -u origin main
```

### Schritt 3: Vercel Account erstellen

1. Gehen Sie zu [vercel.com](https://vercel.com)
2. Klicken Sie auf "Sign Up"
3. Wählen Sie "Continue with GitHub"
4. Autorisieren Sie Vercel

### Schritt 4: Projekt auf Vercel deployen

1. Klicken Sie auf "Add New..." → "Project"
2. Wählen Sie Ihr `cle-quiz-app` Repository
3. Klicken Sie "Import"
4. Framework Preset: Next.js (wird automatisch erkannt)
5. Klicken Sie "Deploy"

### Schritt 5: Kostenlose PostgreSQL Datenbank einrichten

**Option A: Vercel Postgres (Empfohlen)**

1. In Ihrem Vercel-Projekt: Klicken Sie auf "Storage" Tab
2. Klicken Sie "Create Database"
3. Wählen Sie "Postgres"
4. Name: `cle-quiz-db`
5. Region: Frankfurt (fra1) für beste Performance in Deutschland
6. Klicken Sie "Create"
7. Vercel fügt automatisch die Umgebungsvariablen hinzu

**Option B: Supabase (Alternative)**

1. Gehen Sie zu [supabase.com](https://supabase.com)
2. Erstellen Sie einen kostenlosen Account
3. Erstellen Sie ein neues Projekt
4. Gehen Sie zu Settings → Database
5. Kopieren Sie die Connection String (URI)
6. Fügen Sie in Vercel hinzu:
   - `DATABASE_URL`: Die Connection String
   - `DIRECT_URL`: Dieselbe Connection String

### Schritt 6: Datenbank initialisieren

Nach dem ersten Deploy:

1. Gehen Sie in Vercel zu "Settings" → "Environment Variables"
2. Stellen Sie sicher, dass `DATABASE_URL` und `DIRECT_URL` gesetzt sind

3. Führen Sie die Migration aus (lokal oder via Vercel CLI):

```bash
# Vercel CLI installieren
npm i -g vercel

# Einloggen
vercel login

# Projekt verlinken
vercel link

# Migration ausführen
vercel env pull .env.local
npx prisma migrate deploy
```

### Schritt 7: Admin-User erstellen

Nach erfolgreichem Deploy:

1. Gehen Sie zu Ihrer App-URL
2. Registrieren Sie einen neuen User mit:
   - Email: `admin@cle-quiz.de`
   - Passwort: `808080`
   - Name: `Admin`

2. Oder nutzen Sie das Script (lokal mit Production-Datenbank):
```bash
DATABASE_URL="Ihre-Production-URL" npx prisma db push
bun run create-admin
```

---

## Ihre App-URL

Nach erfolgreichem Deploy erhalten Sie eine URL wie:
- `https://cle-quiz-app.vercel.app`
- Oder eine eigene Domain (siehe unten)

---

## Eigene Domain einrichten (Optional)

1. In Vercel: Settings → Domains
2. Geben Sie Ihre Domain ein (z.B. `cle-quiz.de`)
3. Folgen Sie den DNS-Anweisungen
4. Warten Sie auf die Verifizierung

---

## Umgebungsvariablen

| Variable | Beschreibung | Beispiel |
|----------|--------------|----------|
| `DATABASE_URL` | PostgreSQL Connection (Pooler) | `postgres://...@xxx.pooler.supabase.com/postgres` |
| `DIRECT_URL` | PostgreSQL Connection (Direct) | `postgres://...@xxx.supabase.com/postgres` |

---

## Kostenübersicht (Kostenlos)

| Service | Kostenloses Limit |
|---------|-------------------|
| Vercel Hosting | 100GB Bandbreite/Monat |
| Vercel Postgres | 256MB Speicher |
| Supabase | 500MB Speicher |

Für eine kleine bis mittlere Nutzung völlig ausreichend!

---

## Probleme beheben

### "Prisma Client not found"
```bash
npx prisma generate
```

### "Database connection error"
- Prüfen Sie die DATABASE_URL
- Stellen Sie sicher, dass die IP-Whitelist bei Supabase deaktiviert ist

### Build fehlgeschlagen
```bash
# Lokal testen
bun run build
```

---

## Support

Bei Problemen: Erstellen Sie ein Issue im GitHub Repository.
