# 📊 Anypoint Usage Dashboard

Dashboard interactif moderne style Graylog pour visualiser les métriques de l'API Anypoint Usage.

## 🎯 Fonctionnalités

- **Visualisation en temps réel** des flux runtime
- **Métriques API Manager** avec graphiques interactifs
- **Analyse par environnement** et par application
- **Tableau de bord responsive** avec thème sombre moderne
- **Auto-refresh configurable** des données
- **Export des données** en format CSV/JSON
- **Filtrage et recherche avancée**

## 🛠 Architecture

### Backend - API Mulesoft 4
- Gestion automatique du token OAuth2
- Cache des tokens avec Object Store
- Endpoints RESTful pour les métriques
- Support CORS intégré
- Gestion des erreurs robuste

### Frontend - Dashboard React
- Interface moderne style Graylog
- Graphiques interactifs (Recharts)
- Design responsive
- Thème sombre optimisé
- Animations fluides

## 📋 Prérequis

- **Mule Runtime** 4.4.0 ou supérieur
- **Node.js** 16.x ou supérieur
- **npm** ou **yarn**
- **Anypoint Platform** compte avec accès Usage API

## 🚀 Installation

### 1. Backend - API Mulesoft

```bash
# Cloner le projet
git clone <votre-repo>
cd usage-metrics-api

# Configurer les credentials dans config.properties
vi src/main/resources/config.properties

# Déployer l'application Mule
mvn clean package
mvn mule:deploy
```

### 2. Frontend - Node.js

```bash
# Installer les dépendances
cd dashboard
npm install

# Configurer l'environnement
cp .env.example .env
vi .env

# Démarrer le serveur
npm start
```

## 🔧 Configuration

### Configuration Mulesoft (config.properties)

```properties
http.port=8081
anypoint.client.id=YOUR_CLIENT_ID
anypoint.client.secret=YOUR_CLIENT_SECRET
```

### Configuration Frontend (.env)

```bash
PORT=3000
MULE_API_BASE=http://localhost:8081/api
```

## 📡 Endpoints API

### Backend Mulesoft

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/meters` | Liste des meters disponibles |
| POST | `/api/dashboard` | Données agrégées du dashboard |
| POST | `/api/metrics/runtime-flows` | Métriques des flux runtime |
| POST | `/api/metrics/api-manager` | Métriques API Manager |
| POST | `/api/metrics/network-usage` | Utilisation réseau |

### Paramètres de requête

```json
{
  "startTime": 1704067200000,
  "endTime": 1706745599000,
  "timeSeries": "P1D",
  "orgId": "optional-org-id"
}
```

## 📊 Métriques disponibles

### Flux Runtime
- Nombre de flux par application
- Nombre de flux par environnement
- Total des flux sur une période

### API Manager
- APIs managées
- APIs gouvernées
- Transactions par API

### Réseau
- Utilisation bandwidth
- Données transférées

## 🎨 Personnalisation du Dashboard

### Thèmes
Modifier les variables CSS dans le fichier HTML :

```css
:root {
  --bg-primary: #1a1a1a;
  --accent-primary: #00d4ff;
  /* ... */
}
```

### Graphiques
Les graphiques utilisent Recharts et peuvent être personnalisés :

```javascript
const COLORS = {
  primary: '#00d4ff',
  secondary: '#0099cc',
  // Ajouter vos couleurs
};
```

## 🔍 Monitoring et Logs

### Logs Mulesoft
Les logs sont disponibles dans :
- Runtime Manager (CloudHub)
- `logs/` directory (On-Premise)

### Logs Frontend
```bash
# Voir les logs du serveur Node.js
npm run dev

# Logs en production
pm2 logs anypoint-dashboard
```

## 🚦 Déploiement Production

### Mulesoft - CloudHub

```bash
# Déployer sur CloudHub
mvn mule:deploy -DmuleDeploy.uri=https://anypoint.mulesoft.com \
  -DmuleDeploy.username=YOUR_USERNAME \
  -DmuleDeploy.password=YOUR_PASSWORD \
  -DmuleDeploy.environment=Production \
  -DmuleDeploy.applicationName=usage-metrics-api
```

### Frontend - PM2

```bash
# Installer PM2
npm install -g pm2

# Démarrer l'application
pm2 start server.js --name anypoint-dashboard

# Sauvegarder la configuration
pm2 save
pm2 startup
```

### Docker (Optionnel)

```dockerfile
# Dockerfile pour le frontend
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

## 🔒 Sécurité

- **Token Management** : Les tokens sont stockés de manière sécurisée dans Object Store
- **CORS** : Configuration stricte des origines autorisées
- **Rate Limiting** : Protection contre les abus
- **HTTPS** : Utiliser HTTPS en production
- **Secrets** : Ne jamais commiter les credentials

## 🐛 Troubleshooting

### Erreur d'authentification
```bash
# Vérifier les credentials
curl -X POST https://eu1.anypoint.mulesoft.com/accounts/api/v2/oauth2/token \
  -H "Content-Type: application/json" \
  -d '{"grant_type":"client_credentials","client_id":"YOUR_ID","client_secret":"YOUR_SECRET"}'
```

### Pas de données affichées
1. Vérifier la plage de dates (max 30 jours pour P1D)
2. Vérifier que les données existent (délai de 3 jours)
3. Consulter les logs de l'API Mule

### Performance
- Activer la compression gzip
- Implémenter le cache Redis
- Utiliser la pagination pour les grandes datasets

## 📚 Ressources

- [Anypoint Usage API Documentation](https://anypoint.mulesoft.com/exchange/portals/anypoint-platform/f1e97bc6-315a-4490-82a7-23abe036327a/usage-api/)
- [MuleSoft Documentation](https://docs.mulesoft.com)
- [React Documentation](https://reactjs.org)
- [Recharts Documentation](https://recharts.org)

## 🤝 Contribution

Les contributions sont les bienvenues ! Merci de :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de support MuleSoft
- Consulter la communauté MuleSoft

---

**Développé avec ❤️ pour la communauté MuleSoft**