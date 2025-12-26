const dbPool = require('../config/db'); // Notre pool de connexions MySQL
const axios = require('axios'); // L'outil pour appeler vos API IA

// L'URL de votre microservice IA Plan A
const PLAN_A_API_URL = 'http://localhost:5000/recommend/content';

/**
 * Get Plan A Recommendations (Content-Based)
 * @route   GET /api/recommend/a?sku=TEC-PH-001
 */
exports.getPlanARecommendations = async (req, res) => {
  // 1. Obtenir le SKU du produit de base depuis l'URL
  const { sku } = req.query;

  if (!sku) {
    return res.status(400).json({ message: 'SKU parameter is required.' });
  }

  let recommendedSkus = [];

  // --- Étape 1 : Appeler l'API IA (Flask) ---
  try {
    const aiResponse = await axios.get(PLAN_A_API_URL, {
      params: { sku }
    });
    
    recommendedSkus = aiResponse.data.recommendations; // C'est une liste de SKUs

    // Si l'IA ne renvoie rien, on renvoie un tableau vide.
    if (!recommendedSkus || recommendedSkus.length === 0) {
      return res.status(200).json([]);
    }

  } catch (error) {
    // Gérer le cas où l'API IA est en panne
    console.error('Error calling Plan A AI API:', error.message);
    // On ne renvoie pas une erreur 500 ici, on renvoie juste une liste vide
    // pour ne pas planter le frontend.
    return res.status(200).json([]); 
  }

  // --- Étape 2 : "Hydrater" les SKUs avec la BDD MySQL ---
  try {
    // Créer des placeholders (?) pour la requête SQL
    const placeholders = recommendedSkus.map(() => '?').join(',');

    // Préparer la requête SQL pour récupérer les produits
    // IMPORTANT : Nous utilisons FIND_IN_SET pour trier les résultats
    // dans le MÊME ORDRE que la liste de l'IA.
    const sql = `
      SELECT * FROM produit 
      WHERE sku IN (${placeholders})
      ORDER BY FIND_IN_SET(sku, ?)
    `;

    // Les paramètres de la requête
    // 1. La liste des SKUs pour le "IN"
    // 2. La liste des SKUs (en chaîne) pour le "FIND_IN_SET"
    const params = [...recommendedSkus, recommendedSkus.join(',')];

    // Exécuter la requête
    const [products] = await dbPool.query(sql, params);
    
    // Renvoyer la liste complète des produits (nom, prix, img_url...)
    res.status(200).json(products);

  } catch (error) {
    console.error('Error fetching recommended products from DB:', error);
    res.status(500).json({ message: 'Server error while fetching product details.' });
  }
};