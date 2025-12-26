const dbPool = require('../config/db'); // Notre pool de connexions MySQL
const axios = require('axios'); // L'outil pour appeler vos API IA

// L'URL de votre microservice IA Plan B
const PLAN_B_API_URL = 'http://localhost:5001/recommend/behavior';

/**
 * Get Plan B Recommendations (Behavior-Based)
 * @route   GET /api/recommend/b
 * @access  Private (Requires authGuard)
 */
exports.getPlanBRecommendations = async (req, res) => {
  // 1. Obtenir l'ID de l'utilisateur (fourni par le middleware authGuard)
  const id_client = req.user.id;

  if (!id_client) {
    // Cette erreur ne devrait jamais se produire si authGuard est en place
    return res.status(401).json({ message: 'User not authenticated.' });
  }

  let recommendedSkus = [];

  // --- Étape 1 : Appeler l'API IA (Flask) ---
  try {
    const aiResponse = await axios.get(PLAN_B_API_URL, {
      params: { user_id: id_client } // L'API Plan B attend un 'user_id'
    });
    
    recommendedSkus = aiResponse.data.recommendations; // C'est une liste de SKUs

    // Si l'IA ne renvoie rien, on renvoie un tableau vide.
    if (!recommendedSkus || recommendedSkus.length === 0) {
      return res.status(200).json([]);
    }

  } catch (error) {
    // GESTION DES ERREURS IA :
    // Cela se produit si :
    // 1. L'API Flask est en panne.
    // 2. L'API Flask renvoie un 404 (ex: "user_id not found" pour un NOUVEAU client)
    //
    // Dans tous les cas, nous renvoyons une liste vide pour ne pas planter le frontend.
    console.warn(`Plan B AI Warning for user ${id_client}: ${error.message}`);
    return res.status(200).json([]); // Renvoyer une liste vide
  }

  // --- Étape 2 : "Hydrater" les SKUs avec la BDD MySQL ---
  try {
    // Créer des placeholders (?) pour la requête SQL
    const placeholders = recommendedSkus.map(() => '?').join(',');

    // Utiliser FIND_IN_SET pour garder le même ordre que l'IA
    const sql = `
      SELECT * FROM produit 
      WHERE sku IN (${placeholders})
      ORDER BY FIND_IN_SET(sku, ?)
    `;
    
    const params = [...recommendedSkus, recommendedSkus.join(',')];
    const [products] = await dbPool.query(sql, params);
    
    // Renvoyer la liste complète des produits (nom, prix, img_url...)
    res.status(200).json(products);

  } catch (error) {
    console.error('Error fetching recommended products from DB:', error);
    res.status(500).json({ message: 'Server error while fetching product details.' });
  }
};

const PLAN_B_CHECK_URL = 'http://localhost:5001/recommend/check_user';

// ... (Code existant getPlanBRecommendations) ...

/**
 * Check if user exists in Plan B Model (Is Trained?)
 * @route   GET /api/recommend/b/status
 * @access  Private
 */
exports.checkPlanBStatus = async (req, res) => {
  const id_client = req.user.id;

  try {
    // Appeler l'API Python
    const response = await axios.get(PLAN_B_CHECK_URL, {
      params: { user_id: id_client }
    });

    // Renvoyer true/false au frontend
    res.status(200).json({ 
      isTrained: response.data.exists 
    });

  } catch (error) {
    console.error('Error checking Plan B status:', error.message);
    // En cas d'erreur (API Python éteinte), on dit false par sécurité
    res.status(200).json({ isTrained: false });
  }
};