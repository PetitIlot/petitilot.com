# Petit Îlot

Ressources éducatives 0-6 ans (No-screen / No-sugar)

## Stack Technique

- **Framework** : Next.js 14+ (App Router)
- **Base de données** : Supabase (PostgreSQL)
- **Styling** : Tailwind CSS
- **Authentification** : Supabase Auth

## Installation

```bash
npm install
```

## Configuration

1. Copier `.env.local.example` vers `.env.local`
2. Remplir les variables Supabase

```bash
cp .env.local.example .env.local
```

## Développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Structure

```
├── app/
│   ├── [lang]/          # Routes i18n (fr, en, es)
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/              # Composants UI réutilisables
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/
│   └── supabase.ts      # Client Supabase
└── middleware.ts        # Redirection i18n
```

## Navigation

- `/fr` - Page d'accueil (français)
- `/fr/activites` - Ressources (Activités, Motricité, Recettes)
- `/fr/livres` - Livres
- `/fr/jeux` - Jeux
- `/fr/a-propos` - À propos
- `/fr/contact` - Contact

## Couleurs

- Fond : `#F5E6D3` (Beige)
- Accent : `#A8B5A0` (Sauge)
- Détails : `#D4A59A` (Terracotta)
- Texte : `#5D5A4E` (Brun)

## Polices

- **Titres** : Quicksand
- **Corps** : Lato
