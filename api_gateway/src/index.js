const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 8080;

// Middleware de sécurité
app.use(helmet());
app.use(cors({ origin: '*' })); // Autoriser toutes les origines (à restreindre en production)

// Limitation de requêtes (Rate-limiting)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limiter chaque IP à 100 requêtes par "window" (15 minutes)
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});
app.use(limiter);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'API Gateway is running' });
});

// Root route
app.get('/', (req, res) => {
    res.status(200).send('API Gateway Collector.shop - Use /api/catalogue or /health');
});

// Proxy vers service_catalogue
// Le service catalogue sera accessible sur le port interne 3001 dans docker
app.use('/api/catalogue', createProxyMiddleware({
    target: process.env.CATALOGUE_URL || 'http://service-catalogue:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/catalogue': '', // Réécrit /api/catalogue/products en /products par exemple
    },
}));

// Proxy vers service_utilisateur
app.use('/api/users', createProxyMiddleware({
    target: process.env.UTILISATEUR_URL || 'http://service-utilisateur:3002',
    changeOrigin: true,
    pathRewrite: {
        '^/api/users': '',
    },
}));

app.listen(PORT, () => {
    console.log(`API Gateway en écoute sur le port ${PORT}`);
});
