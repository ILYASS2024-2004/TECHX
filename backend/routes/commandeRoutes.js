const express = require('express');
const router = express.Router();

// 1. Importer le contrôleur
const { createOrder } = require('../controllers/commandeController');

// 2. Importer le middleware de protection
const authGuard = require('../middlewares/authGuard');

// 3. Définir la route
//
//    POST /api/orders/create
//
//    On place "authGuard" AVANT "createOrder".
//    Express va d'abord exécuter "authGuard". S'il réussit (token valide),
//    il exécute "next()" et passe à "createOrder".
//    Si "authGuard" échoue (pas de token), il renvoie une erreur 401
//    et "createOrder" n'est jamais appelé.
//
router.post('/create', authGuard, createOrder);

// Exporter le routeur
module.exports = router;