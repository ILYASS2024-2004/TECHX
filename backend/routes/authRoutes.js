const express = require('express');
const router = express.Router();

// 1. Importer les fonctions du contrôleur d'authentification
const {
  signup,
  login,
  logout,
  checkAuth,
} = require('../controllers/authController');

// 2. Définir les routes
// Chaque route appelle une fonction spécifique du contrôleur

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', signup);

// @route   POST /api/auth/login
// @desc    Authenticate a user
router.post('/login', login);

// @route   POST /api/auth/logout
// @desc    Log a user out
router.post('/logout', logout);

// @route   GET /api/auth/check
// @desc    Check if user is authenticated (via cookie)
router.get('/check', checkAuth);

// 3. Exporter le routeur
module.exports = router;