# ARISOFT — Site Vitrine & Plateforme de Conversion

Site vitrine officiel de l'entreprise **ARISOFT** (Assistance informatique & gestion d'entreprise).

## Stack Technique
- **Framework** : Next.js 15 (App Router) + TypeScript
- **Style** : Tailwind CSS (tokens personnalisés : `#0B1F3A`, `#071528`, `#15803D`, etc.)
- **Typographie** : Plus Jakarta Sans (Google Fonts via `next/font`)
- **Icônes** : Lucide React (SVG traits légers)
- **Export** : 100% Statique (`output: 'export'`), dossier de build `out/`

## Pages incluses
- `/` : Page d'accueil (8 sections orientées conversion et devis rapide)
- `/services/` : Détail des 6 expertises informatiques et gestion
- `/logiciel-de-gestion/` : Présentation des 5 modules métiers (Commerce, RH, ONG, Restaurant, Hôtellerie)
- `/realisations/` : Références projets, démarche de livraison et logos partenaires
- `/contact/` : Formulaire avec passerelle WhatsApp, appel direct et localisation

## Commandes utiles

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancer le serveur de développement local
```bash
npm run dev
```
Rendez-vous ensuite sur `http://localhost:3000`.

### 3. Générer le site statique prêt pour la production
```bash
npm run build
```
Le résultat statique complet (HTML, CSS, JS) est généré dans le dossier `out/`.
Vous pouvez déployer ce dossier directement sur n'importe quel hébergeur : Vercel, Netlify, Cloudflare Pages, Firebase Hosting, Apache ou Nginx.

## Modification des contenus
L'ensemble des textes, téléphones, coordonnées, descriptions de services et modules se configurent en un seul endroit :
[`src/data/content.ts`](file:///d:/Flutter%20WebSite/arisoft/src/data/content.ts).

## Espace administration (`/admin/`)
Permet de publier, modifier et supprimer les **réalisations** affichées sur l'accueil et la page Réalisations, sans rebuild.
Les données sont stockées dans Firebase (Firestore + Authentication, offre gratuite suffisante).

### Mise en place (une seule fois)
1. Créer un projet sur https://console.firebase.google.com puis ajouter une **application Web** (`</>`).
2. Copier `.env.local.example` en `.env.local` et y coller les valeurs `apiKey`, `authDomain`, `projectId`, `appId`.
3. **Firestore Database** → Créer une base (mode production) → onglet **Règles** → coller le contenu de `firestore.rules` → Publier.
4. **Authentication** → Commencer → activer **Adresse e-mail/Mot de passe** → onglet **Utilisateurs** → Ajouter un utilisateur (email + mot de passe de l'admin). Copier son **UID**.
5. **Firestore** → Démarrer une collection `admins` → ID du document = l'UID copié (ajouter un champ quelconque, ex. `role: "admin"`).
6. Relancer `npm run dev` (ou `npm run build` avant mise en ligne). Se connecter sur `/admin/`.

Pour ajouter un autre administrateur : répéter les étapes 4 et 5.
Tant qu'aucune réalisation n'est publiée, le site affiche les exemples de `src/data/content.ts`.

## Hébergement gratuit sur GitHub Pages
Le workflow `.github/workflows/deploy.yml` construit et publie le site à chaque `git push` sur `main`.
Adresse : `https://<compte>.github.io/<nom-du-depot>/`

1. Créer un dépôt **public** vide sur https://github.com/new (sans README).
2. `git remote add origin https://github.com/<compte>/<nom-du-depot>.git` puis `git push -u origin main`.
3. Sur GitHub : **Settings → Pages → Source : GitHub Actions**. Relancer le workflow si besoin (onglet **Actions**).
4. Firebase (optionnel) : **Settings → Secrets and variables → Actions → Variables** : ajouter les 4 variables `NEXT_PUBLIC_FIREBASE_*` de `.env.local`,
   puis dans Firebase **Authentication → Paramètres → Domaines autorisés** : ajouter `<compte>.github.io`.
