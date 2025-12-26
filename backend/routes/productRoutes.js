const express = require('express');
const router = express.Router();

// 1. Importer les fonctions du contrôleur
const {
  getAllProducts,
  getProductBySku,
  getNewDrops,
  getBestSellers
} = require('../controllers/productController');

// 2. Définir les routes
// L'ORDRE EST TRÈS IMPORTANT ICI

// GET /api/products
// (Doit aussi gérer ?categorie=PHONES)
router.get('/', getAllProducts);

// GET /api/products/new
// (Doit être AVANT /:sku, sinon Express pensera que "new" est un SKU)
router.get('/new', getNewDrops);

// GET /api/products/bestsellers
// (Doit aussi être AVANT /:sku)
router.get('/bestsellers', getBestSellers);

// GET /api/products/:sku (ex: /api/products/TEC-PH-001)
// (C'est une route "dynamique", elle doit venir en dernier)
router.get('/:sku', getProductBySku);


// 3. Exporter le routeur
module.exports = router;