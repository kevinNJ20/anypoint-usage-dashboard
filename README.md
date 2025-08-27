# 📊 Anypoint Usage Dashboard - Frontend

Dashboard moderne style Graylog pour visualiser les métriques de consommation de l'API Anypoint Platform de MuleSoft.

## 📋 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Structure du projet](#-structure-du-projet)
- [Fonctionnalités](#-fonctionnalités)
- [API Endpoints](#-api-endpoints)
- [Développement](#-développement)
- [Déploiement](#-déploiement)
- [Dépannage](#-dépannage)
- [Contribution](#-contribution)

## 🎯 Vue d'ensemble

Ce dashboard permet de visualiser en temps réel les métriques d'utilisation d'Anypoint Platform, incluant :
- **Flux Runtime** : Nombre de flux Mule déployés par application et environnement
- **APIs Managées** : APIs gérées via API Manager
- **APIs Gouvernées** : APIs sous gouvernance Anypoint
- **Utilisation Réseau** : Bande passante consommée
- **Analyse par Environnement** : Production, Sandbox, Non-classifié

### Captures d'écran

Le dashboard présente :
- 🎨 **Interface Sénégal Edition** : Thème inspiré des couleurs du drapeau sénégalais (vert, jaune, rouge)
- 📈 **Graphiques interactifs** : Visualisations temporelles et par environnement
- 📊 **Tableaux de données** : Détails triables et filtrables
- 🔄 **Temps réel** : Auto-refresh configurable

## 🏗 Architecture

```
Frontend (Node.js + Express)
    │
    ├── Server Express (port 3000)
    │   ├── Serveur de fichiers statiques (public/)
    │   └── Routes proxy (/api/proxy/*)
    │
    ├── Dashboard HTML/CSS/JS (public/index.html)
    │   ├── Vanilla JavaScript (pas de framework)
    │   ├── Canvas API pour les graphiques
    │   └── Fetch API pour les appels REST
    │
    └── Communication avec Backend Mule
        └── API Mulesoft (port 8081)
```

### Stack Technique

- **Backend Node.js** : Express 4.x pour le serveur et proxy
- **Frontend** : HTML5, CSS3, JavaScript ES6+ (vanilla)
- **Visualisation** : Canvas API native pour les graphiques
- **Communication** : Fetch API avec CORS
- **Sécurité** : Helmet, Rate limiting, CORS configuré

## 📦 Prérequis

- **Node.js** : Version 16.x ou supérieure
- **npm** : Version 7.x ou supérieure
- **Navigateur** : Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **API Mulesoft** : Instance déployée et accessible (port 8081)
- **Anypoint Account** : Credentials valides avec accès Usage API

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd anypoint-usage-dashboard
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer avec vos valeurs
nano .env
```

### 4. Structure des dossiers requise

```
anypoint-usage-dashboard/
├── public/
│   └── index.html      # Dashboard UI
├── routes/
│   └── proxy.js        # Routes proxy vers Mule API
├── server.js           # Serveur Express
├── package.json        # Dépendances
├── .env               # Configuration
└── README.md          # Documentation
```

### 5. Démarrer le serveur

```bash
# Mode développement avec hot-reload
npm run dev

# Mode production
npm start
```

## ⚙️ Configuration

### Variables d'environnement (.env)

```bash
# Serveur Node.js
PORT=3000                           # Port du serveur frontend
NODE_ENV=development               # Environment (development/production)

# API Mulesoft
MULE_API_BASE=http://localhost:8081/api  # URL de l'API Mule

# Anypoint Platform (pour accès direct si nécessaire)
ANYPOINT_CLIENT_ID=65dbfe82af0b4e3eb7c745f1d6d8e3db
ANYPOINT_CLIENT_SECRET=E1cD10e3895C4e37a24261d850faD91F

# Logs
LOG_LEVEL=info                     # Niveau de log (debug/info/warn/error)
LOG_FILE=./logs/app.log           # Fichier de log

# Sécurité
JWT_SECRET=your-secret-key-here    # Secret pour JWT (si utilisé)
SESSION_SECRET=your-session-secret # Secret de session

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000       # Fenêtre de 15 minutes
RATE_LIMIT_MAX_REQUESTS=100       # Max 100 requêtes par fenêtre

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:8081

# Cache (optionnel)
CACHE_TTL=3600                    # TTL du cache en secondes
REDIS_HOST=localhost               # Host Redis si utilisé
REDIS_PORT=6379                    # Port Redis
```

### Configuration du Dashboard (dans index.html)

```javascript
// Configuration dans public/index.html
const ORG_ID = 'f22cd53d-c1ea-482e-a6e6-2d367ba7e48e';  // Votre Organization ID
const API_BASE_URL = '/api/proxy';                       // URL du proxy
const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000;            // 5 minutes
```

## 📁 Structure du projet

```
.
├── public/
│   └── index.html          # Interface du dashboard (tout-en-un)
├── routes/
│   └── proxy.js           # Routes proxy vers l'API Mulesoft
├── server.js              # Point d'entrée du serveur Express
├── package.json           # Dépendances et scripts npm
├── package-lock.json      # Lock file des dépendances
├── .env                   # Variables d'environnement (non versionné)
├── .env.example           # Exemple de configuration
├── .gitignore            # Fichiers ignorés par git
└── README.md             # Cette documentation
```

### Description des fichiers

- **public/index.html** : Interface complète du dashboard (HTML, CSS, JS intégré)
- **routes/proxy.js** : Middleware proxy pour router les requêtes vers l'API Mule
- **server.js** : Serveur Express configurant les middlewares et routes

## 🎨 Fonctionnalités

### Interface Utilisateur

1. **Header Sénégalais** 🇸🇳
   - Logo avec icône lion (symbole national)
   - Gradient aux couleurs du drapeau
   - Contrôles de filtrage et actions

2. **Filtres et Contrôles**
   - Sélecteur de dates (datetime-local)
   - Filtre par type d'environnement
   - Boutons d'action (Appliquer, Actualiser, Exporter)

3. **Sélecteur de Métriques**
   - Cases à cocher pour activer/désactiver les métriques
   - Mise à jour dynamique du dashboard

4. **Cartes de Statistiques**
   - Affichage des totaux avec icônes
   - Indicateurs de changement (positif/négatif)
   - Animation au survol

5. **Graphiques**
   - **Ligne temporelle** : Évolution des métriques
   - **Barres** : Répartition par environnement
   - Rendus avec Canvas API natif

6. **Tableau de Données**
   - Tri par colonne
   - Recherche en temps réel
   - Pagination implicite (50 lignes max)
   - Badges de statut

### Fonctionnalités Techniques

- **Auto-refresh** : Actualisation automatique toutes les 5 minutes
- **Export** : CSV, JSON, Excel (CSV formaté)
- **Responsive** : Adaptation mobile/tablette/desktop
- **Thème sombre** : Optimisé pour une utilisation prolongée
- **Gestion d'erreurs** : Toasts de notification
- **Cache** : Stockage temporaire des données

## 📡 API Endpoints

### Routes du Proxy (`/api/proxy/*`)

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| GET | `/api/proxy/health` | Vérification santé du proxy | - |
| GET | `/api/proxy/test-connection` | Test connexion API Mule | - |
| GET | `/api/proxy/meters` | Liste des meters disponibles | - |
| GET | `/api/proxy/meters/:name` | Détails d'un meter | `name`: nom du meter |
| POST | `/api/proxy/dashboard` | Données agrégées | Body: `{startTime, endTime, timeSeries, orgId, envType?}` |
| POST | `/api/proxy/metrics/runtime-flows` | Flux runtime | Idem dashboard |
| POST | `/api/proxy/metrics/api-manager` | APIs managées | Idem dashboard |
| POST | `/api/proxy/metrics/governed-apis` | APIs gouvernées | Idem dashboard |
| POST | `/api/proxy/metrics/network-usage` | Utilisation réseau | Idem dashboard |

### Format des Requêtes

```javascript
// Exemple de requête au dashboard
POST /api/proxy/dashboard
{
  "startTime": 1704067200000,     // Timestamp epoch (1er janvier 2024)
  "endTime": 1706745599000,       // Timestamp epoch (31 janvier 2024)
  "timeSeries": "P1D",             // P1D (jour) ou P1M (mois)
  "orgId": "f22cd53d-...",        // Organization ID
  "envType": "production"          // Optionnel: production/sandbox/unclassified
}
```

### Format des Réponses

```javascript
// Réponse succès
{
  "success": true,
  "timestamp": "2024-01-31T12:00:00Z",
  "data": {
    "runtimeFlows": { /* données */ },
    "apiManager": { /* données */ },
    "governedApis": { /* données */ },
    "summary": {
      "totalFlows": 1250,
      "totalManagedApis": 45,
      "totalGovernedApis": 38,
      "environments": ["Production", "Sandbox"],
      "applications": ["App1", "App2", ...]
    }
  }
}

// Réponse erreur
{
  "success": false,
  "error": "Authentication failed",
  "message": "Token expired",
  "details": { /* détails additionnels */ }
}
```

## 💻 Développement

### Scripts npm

```bash
# Développement avec hot-reload
npm run dev

# Production
npm start

# Tests (si configurés)
npm test

# Build (si webpack configuré)
npm run build
```

### Debugging

1. **Logs serveur** : Vérifier la console Node.js
2. **Logs navigateur** : Ouvrir la console (F12)
3. **Network** : Inspecter les requêtes dans l'onglet Network
4. **Test API** : `curl http://localhost:3000/api/proxy/health`

### Personnalisation du Thème

Modifier les variables CSS dans `public/index.html` :

```css
:root {
    /* Couleurs principales */
    --senegal-green: #00853F;
    --senegal-yellow: #FDEF42;
    --senegal-red: #E31E24;
    
    /* Backgrounds */
    --bg-primary: #0a0a0a;
    --bg-secondary: #1a1a1a;
    
    /* Personnaliser selon vos besoins */
}
```

## 🚀 Déploiement

### Option 1: PM2 (Recommandé pour production)

```bash
# Installer PM2
npm install -g pm2

# Démarrer l'application
pm2 start server.js --name anypoint-dashboard

# Configuration auto-démarrage
pm2 save
pm2 startup

# Monitoring
pm2 monit
```

### Option 2: Docker

```dockerfile
# Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# Build et run
docker build -t anypoint-dashboard .
docker run -p 3000:3000 -d anypoint-dashboard
```

### Option 3: Systemd (Linux)

```ini
# /etc/systemd/system/anypoint-dashboard.service
[Unit]
Description=Anypoint Usage Dashboard
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/opt/anypoint-dashboard
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

## 🔧 Dépannage

### Problèmes Courants

#### 1. Erreur de connexion à l'API Mule

```bash
# Vérifier que l'API Mule est accessible
curl http://localhost:8081/api/meters

# Vérifier les logs
tail -f logs/app.log
```

#### 2. CORS bloqué

```javascript
// Vérifier la configuration CORS dans server.js
app.use(cors({
    origin: process.env.CORS_ORIGINS?.split(',') || '*'
}));
```

#### 3. Pas de données affichées

- Vérifier la plage de dates (max 30 jours pour P1D)
- Confirmer l'Organization ID
- Vérifier les credentials Anypoint

#### 4. Performance lente

- Activer la compression : `app.use(compression())`
- Implémenter le cache Redis
- Limiter la période de requête

### Logs et Monitoring

```bash
# Logs en temps réel
tail -f logs/app.log

# Avec PM2
pm2 logs anypoint-dashboard

# Docker logs
docker logs -f <container-id>
```

## 🤝 Contribution

### Guidelines

1. **Fork** le projet
2. **Créer** une branche (`git checkout -b feature/AmazingFeature`)
3. **Commit** les changements (`git commit -m 'Add AmazingFeature'`)
4. **Push** la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Standards de Code

- **JavaScript** : ES6+, pas de var, utiliser const/let
- **Indentation** : 4 espaces
- **Commentaires** : En français pour la logique métier
- **Commits** : Messages descriptifs en français

### Tests

```bash
# Lancer les tests
npm test

# Coverage
npm run test:coverage
```

## 📚 Ressources

- [Anypoint Usage API](https://anypoint.mulesoft.com/exchange/portals/anypoint-platform/f1e97bc6-315a-4490-82a7-23abe036327a/usage-api/)
- [Express.js Documentation](https://expressjs.com/)
- [Canvas API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [MuleSoft Documentation](https://docs.mulesoft.com)

## 📄 Licence

MIT License - Voir LICENSE pour plus de détails

## 👥 Support

- **Issues GitHub** : Pour les bugs et demandes de fonctionnalités
- **Email** : knjundja@jasmineconseil.com

---

**Développé avec ❤️ 🇸🇳 pour la BNDE**
