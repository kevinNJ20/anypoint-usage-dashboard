const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger simple
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// IMPORTANT: Servir les fichiers statiques du dossier public
app.use(express.static(path.join(__dirname, 'public')));

// Routes API proxy (commenté pour le moment si le fichier n'existe pas)
try {
    const proxyRoutes = require('./routes/proxy');
    app.use('/api/proxy', proxyRoutes);
} catch (err) {
    console.log('Routes proxy non trouvées, utilisation directe de l\'API Mulesoft');
}

// Route principale - IMPORTANT
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'Server is running'
    });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not Found',
        message: 'La ressource demandée n\'existe pas',
        path: req.path
    });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Démarrage du serveur
const server = app.listen(PORT, () => {
    console.log(`
    ========================================
    🚀 Serveur démarré avec succès!
    ========================================
    📊 Dashboard: http://localhost:${PORT}
    🔌 API Mulesoft: http://localhost:8081
    📁 Dossier public: ${path.join(__dirname, 'public')}
    🌍 Environnement: ${process.env.NODE_ENV || 'development'}
    ========================================
    `);
    
    // Vérifier que le fichier index.html existe
    const fs = require('fs');
    const indexPath = path.join(__dirname, 'public', 'index.html');
    if (!fs.existsSync(indexPath)) {
        console.error('⚠️  ATTENTION: index.html non trouvé dans public/');
        console.error('    Chemin attendu:', indexPath);
    } else {
        console.log('✅ index.html trouvé');
    }
});

// Gestion propre de l'arrêt
process.on('SIGTERM', () => {
    console.log('SIGTERM reçu. Fermeture du serveur...');
    server.close(() => {
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\nSIGINT reçu. Fermeture du serveur...');
    server.close(() => {
        process.exit(0);
    });
});