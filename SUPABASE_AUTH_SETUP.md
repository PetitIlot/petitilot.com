# 🔐 Configuration Authentification Supabase - Petit Îlot

## 1. Exécuter le schéma SQL

1. Va sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionne ton projet
3. Va dans **SQL Editor**
4. Copie le contenu de `supabase/schema.sql`
5. Colle-le dans l'éditeur SQL
6. Clique sur **Run** pour exécuter

Cela créera :
- ✅ Table `profiles` (profils utilisateurs)
- ✅ Table `bookmarks` (favoris)
- ✅ Table `unlocks` (déblocages premium)
- ✅ Trigger automatique pour créer un profil à l'inscription
- ✅ Row Level Security (RLS)
- ✅ Fonctions utilitaires

## 2. Configurer l'authentification email

### Dans Supabase Dashboard

1. Va dans **Authentication** > **Providers**
2. Active **Email**
3. Configure les templates d'emails :

#### Template "Confirm signup"
```
Sujet : Bienvenue sur Petit Îlot !

Bonjour,

Merci de rejoindre notre communauté !

Clique sur ce lien pour confirmer ton email :
{{ .ConfirmationURL }}

À bientôt,
L'équipe Petit Îlot
```

#### Template "Magic Link"
```
Sujet : Connexion à Petit Îlot

Bonjour,

Clique sur ce lien pour te connecter :
{{ .ConfirmationURL }}

Ce lien est valide pendant 1 heure.

L'équipe Petit Îlot
```

#### Template "Reset Password"
```
Sujet : Réinitialisation de mot de passe

Bonjour,

Clique sur ce lien pour réinitialiser ton mot de passe :
{{ .ConfirmationURL }}

Ce lien est valide pendant 1 heure.

L'équipe Petit Îlot
```

## 3. Configuration des URLs de redirection

Dans **Authentication** > **URL Configuration** :

### Site URL
```
Production : https://petitilot.com
Dev : http://localhost:3000
```

### Redirect URLs (autoriser ces URLs)
```
http://localhost:3000/**
https://petitilot.com/**
```

## 4. Tester l'authentification

### En développement

1. Lance le serveur : `npm run dev`
2. Va sur `http://localhost:3000/fr`
3. Clique sur l'icône utilisateur dans le header
4. Inscris-toi avec un email
5. Vérifie que :
   - Un profil est créé automatiquement dans la table `profiles`
   - Tu peux te connecter
   - Tu peux accéder à `/fr/profil`

## 5. Vérifier les tables dans Supabase

Va dans **Table Editor** et vérifie que tu as :

### Table `profiles`
Colonnes : id, email, lang, newsletter_subscribed, created_at, updated_at, last_login

### Table `bookmarks`
Colonnes : id, user_id, ressource_id, created_at

### Table `unlocks`
Colonnes : id, user_id, ressource_id, unlock_method, transaction_id, created_at

## 6. Tester les Row Level Security Policies

Dans le **SQL Editor**, teste les policies :

```sql
-- En tant qu'utilisateur authentifié, tu dois pouvoir voir ton profil
SELECT * FROM profiles WHERE id = auth.uid();

-- Tu ne dois PAS pouvoir voir les profils des autres
SELECT * FROM profiles WHERE id != auth.uid();

-- Tu peux créer tes bookmarks
INSERT INTO bookmarks (user_id, ressource_id)
VALUES (auth.uid(), 'some-ressource-id');

-- Tu ne peux PAS créer des bookmarks pour d'autres utilisateurs
INSERT INTO bookmarks (user_id, ressource_id)
VALUES ('another-user-id', 'some-ressource-id');
-- ❌ Cette requête doit échouer
```

## 7. Variables d'environnement

Dans `.env.local` (ne JAMAIS commiter ce fichier) :
```
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ton_anon_key_ici
SUPABASE_SERVICE_ROLE_KEY=ton_service_role_key_ici
```

⚠️ **IMPORTANT** : Ces clés doivent rester dans `.env.local` uniquement (déjà dans .gitignore)

## 8. Fonctionnalités disponibles

Une fois configuré, les utilisateurs pourront :

- ✅ S'inscrire / Se connecter (email + password ou magic link)
- ✅ Voir leur profil sur `/fr/profil`
- ✅ Ajouter des favoris (activités, livres, jeux)
- ✅ Débloquer des ressources premium
- ✅ S'abonner/désabonner de la newsletter
- ✅ Voir leurs statistiques (nombre de favoris par type)

## 9. Prochaines étapes

Après avoir exécuté le schéma SQL :

1. Crée un compte de test
2. Ajoute quelques ressources dans la table `ressources`
3. Teste l'ajout de favoris
4. Vérifie que tout fonctionne dans `/fr/profil`
