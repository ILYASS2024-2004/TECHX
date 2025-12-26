const express = require('express');
const router = express.Router();

// 1. Importer les contrôleurs
const { getPlanARecommendations } = require('../controllers/recommenderAController');
const { getPlanBRecommendations,checkPlanBStatus  } = require('../controllers/recommenderBController'); // <-- NOUVEAU

// 2. Importer le middleware de protection
const authGuard = require('../middlewares/authGuard'); // <-- NOUVEAU

// 3. Définir les routes

//    GET /api/recommend/a?sku=...
//    (Route publique, tout le monde peut la voir)
router.get('/a', getPlanARecommendations);

//    GET /api/recommend/b
//    (Route privée, nécessite d'être connecté)
router.get('/b', authGuard, getPlanBRecommendations); // <-- NOUVEAU

// Le frontend appellera ça pour savoir s'il doit afficher la section B
router.get('/b/status', authGuard, checkPlanBStatus);

// 4. Exporter le routeur
module.exports = router;