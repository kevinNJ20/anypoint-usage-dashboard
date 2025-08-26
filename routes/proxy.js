const express = require('express');
const axios = require('axios');
const router = express.Router();

const MULE_API_BASE = process.env.MULE_API_BASE || 'http://localhost:8081/api';

// Middleware pour logger les requêtes
router.use((req, res, next) => {
    console.log(`[PROXY] ${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('[PROXY] Body:', JSON.stringify(req.body, null, 2));
    next();
});

// Helper pour gérer les appels API
async function callMuleApi(endpoint, body, headers = {}) {
    try {
        console.log(`[PROXY] Calling Mule API: ${MULE_API_BASE}${endpoint}`);
        const response = await axios.post(`${MULE_API_BASE}${endpoint}`, body, {
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            timeout: 30000 // 30 secondes timeout
        });
        return response.data;
    } catch (error) {
        console.error(`[PROXY ERROR] ${endpoint}:`, error.message);
        if (error.response) {
            console.error('[PROXY ERROR] Response data:', error.response.data);
            console.error('[PROXY ERROR] Response status:', error.response.status);
        }
        throw error;
    }
}

// Proxy vers l'API Mulesoft pour récupérer les métriques du dashboard
router.post('/dashboard', async (req, res) => {
    try {
        console.log('[PROXY] Dashboard request with params:', req.body);
        
        // Valider et formater les paramètres
        const params = {
            startTime: req.body.startTime || Date.now() - (30 * 24 * 60 * 60 * 1000),
            endTime: req.body.endTime || Date.now(),
            timeSeries: req.body.timeSeries || 'P1D'
        };
        
        // Ajouter les filtres optionnels
        if (req.body.envType) {
            params.envType = req.body.envType;
            console.log(`[PROXY] Filtering by environment type: ${params.envType}`);
        }
        
        if (req.body.orgId) {
            params.orgId = req.body.orgId;
        }
        
        const data = await callMuleApi('/dashboard', params, req.headers);
        res.json(data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.message,
            details: error.response?.data
        });
    }
});

// Proxy pour les métriques de flux runtime
router.post('/metrics/runtime-flows', async (req, res) => {
    try {
        console.log('[PROXY] Runtime flows request');
        
        const params = {
            startTime: req.body.startTime || Date.now() - (30 * 24 * 60 * 60 * 1000),
            endTime: req.body.endTime || Date.now(),
            timeSeries: req.body.timeSeries || 'P1D'
        };
        
        if (req.body.envType) params.envType = req.body.envType;
        if (req.body.orgId) params.orgId = req.body.orgId;
        
        const data = await callMuleApi('/metrics/runtime-flows', params, req.headers);
        res.json(data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.message,
            details: error.response?.data
        });
    }
});

// Proxy pour les métriques API Manager
router.post('/metrics/api-manager', async (req, res) => {
    try {
        console.log('[PROXY] API Manager metrics request');
        
        const params = {
            startTime: req.body.startTime || Date.now() - (30 * 24 * 60 * 60 * 1000),
            endTime: req.body.endTime || Date.now(),
            timeSeries: req.body.timeSeries || 'P1D',
            envType: req.body.envType || 'unclassified' // Par défaut non-classifié
        };
        
        if (req.body.orgId) params.orgId = req.body.orgId;
        
        console.log(`[PROXY] API Manager - Environment type: ${params.envType}`);
        
        const data = await callMuleApi('/metrics/api-manager', params, req.headers);
        res.json(data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.message,
            details: error.response?.data
        });
    }
});

// Proxy pour les métriques d'APIs gouvernées
router.post('/metrics/governed-apis', async (req, res) => {
    try {
        console.log('[PROXY] Governed APIs metrics request');
        
        const params = {
            startTime: req.body.startTime || Date.now() - (30 * 24 * 60 * 60 * 1000),
            endTime: req.body.endTime || Date.now(),
            timeSeries: req.body.timeSeries || 'P1D'
        };
        
        if (req.body.orgId) params.orgId = req.body.orgId;
        
        const data = await callMuleApi('/metrics/governed-apis', params, req.headers);
        res.json(data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.message,
            details: error.response?.data
        });
    }
});

// Proxy pour les métriques d'utilisation réseau
router.post('/metrics/network-usage', async (req, res) => {
    try {
        console.log('[PROXY] Network usage metrics request');
        
        const params = {
            startTime: req.body.startTime || Date.now() - (30 * 24 * 60 * 60 * 1000),
            endTime: req.body.endTime || Date.now(),
            timeSeries: req.body.timeSeries || 'P1D'
        };
        
        if (req.body.envType) params.envType = req.body.envType;
        if (req.body.orgId) params.orgId = req.body.orgId;
        
        const data = await callMuleApi('/metrics/network-usage', params, req.headers);
        res.json(data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.message,
            details: error.response?.data
        });
    }
});

// Proxy pour récupérer les meters disponibles
router.get('/meters', async (req, res) => {
    try {
        console.log('[PROXY] Getting available meters');
        
        const response = await axios.get(`${MULE_API_BASE}/meters`, {
            headers: req.headers,
            timeout: 30000
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('[PROXY ERROR] Get meters:', error.message);
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.message,
            details: error.response?.data
        });
    }
});

// Proxy pour récupérer les détails d'un meter spécifique
router.get('/meters/:meterName', async (req, res) => {
    try {
        const meterName = req.params.meterName;
        console.log(`[PROXY] Getting details for meter: ${meterName}`);
        
        const response = await axios.get(`${MULE_API_BASE}/meters/${meterName}:describe`, {
            headers: req.headers,
            timeout: 30000
        });
        
        res.json(response.data);
    } catch (error) {
        console.error(`[PROXY ERROR] Get meter ${req.params.meterName}:`, error.message);
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.message,
            details: error.response?.data
        });
    }
});

// Route pour tester la connexion avec l'API Mulesoft
router.get('/test-connection', async (req, res) => {
    try {
        console.log('[PROXY] Testing connection to Mule API');
        
        // Essayer de récupérer les meters disponibles
        const response = await axios.get(`${MULE_API_BASE}/meters`, {
            timeout: 5000 // 5 secondes pour le test
        });
        
        res.json({
            success: true,
            message: 'Connection to Mule API successful',
            muleApiUrl: MULE_API_BASE,
            metersAvailable: response.data ? true : false
        });
    } catch (error) {
        console.error('[PROXY ERROR] Connection test failed:', error.message);
        res.status(503).json({
            success: false,
            message: 'Cannot connect to Mule API',
            muleApiUrl: MULE_API_BASE,
            error: error.message
        });
    }
});

// Health check pour le proxy
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
            proxy: 'operational',
            muleApi: MULE_API_BASE,
            routes: [
                'POST /api/proxy/dashboard',
                'POST /api/proxy/metrics/runtime-flows',
                'POST /api/proxy/metrics/api-manager',
                'POST /api/proxy/metrics/governed-apis',
                'POST /api/proxy/metrics/network-usage',
                'GET /api/proxy/meters',
                'GET /api/proxy/meters/:meterName',
                'GET /api/proxy/test-connection',
                'GET /api/proxy/health'
            ]
        }
    });
});

// Gestion des erreurs 404 pour les routes non trouvées
router.use((req, res) => {
    console.log(`[PROXY] 404 - Route not found: ${req.method} ${req.path}`);
    res.status(404).json({
        success: false,
        error: 'Route not found',
        message: `The route ${req.method} ${req.path} does not exist in the proxy`,
        availableRoutes: [
            'POST /api/proxy/dashboard',
            'POST /api/proxy/metrics/runtime-flows',
            'POST /api/proxy/metrics/api-manager',
            'POST /api/proxy/metrics/governed-apis',
            'POST /api/proxy/metrics/network-usage',
            'GET /api/proxy/meters',
            'GET /api/proxy/health'
        ]
    });
});

module.exports = router;