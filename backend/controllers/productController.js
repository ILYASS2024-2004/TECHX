const dbPool = require('../config/db'); // Notre pool de connexions MySQL

/**
 * 1. Get ALL products, OR Get products by Category
 * @route   GET /api/products
 * @route   GET /api/products?categorie=PHONES
 */
exports.getAllProducts = async (req, res) => {
  // Votre demande : récupérer le paramètre ?categorie= de l'URL
  const { categorie } = req.query;
  const validCategories = ['PC', 'PHONES', 'CAMERA', 'GAMING']; // Depuis votre BDD

  try {
    let sql;
    let params = [];

    if (categorie) {
      // Si une catégorie est fournie, la valider
      if (!validCategories.includes(categorie.toUpperCase())) {
        return res.status(400).json({ message: 'Invalid category.' });
      }
      // Sélectionner les produits de cette catégorie
      sql = "SELECT * FROM produit WHERE categorie = ? ORDER BY nom ASC";
      params.push(categorie.toUpperCase());
    } else {
      // Si aucune catégorie n'est fournie, tout sélectionner
      sql = "SELECT * FROM produit ORDER BY nom ASC";
    }

    const [products] = await dbPool.query(sql, params);
    res.status(200).json(products);

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * 2. Get a SINGLE product by its SKU
 * (Fonction "Autre nécessaire" - pour les pages de détails produits)
 * @route   GET /api/products/:sku
 */
exports.getProductBySku = async (req, res) => {
  // Récupérer le 'sku' depuis le chemin de l'URL (ex: /api/products/TEC-PH-001)
  const { sku } = req.params;

  try {
    const [products] = await dbPool.query("SELECT * FROM produit WHERE sku = ?", [sku]);

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    
    // Renvoyer le premier (et unique) produit trouvé
    res.status(200).json(products[0]); 

  } catch (error) {
    console.error('Error fetching product by SKU:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};


/**
 * 3. Get New Drops (10 newest products)
 * @route   GET /api/products/new
 */
exports.getNewDrops = async (req, res) => {
  // Votre demande : les 10 derniers produits
  try {
    // Nous trions par "id_prod DESC" en supposant que l'ID le plus élevé
    // est le plus récent (car c'est un AUTO_INCREMENT)
    const sql = "SELECT * FROM produit ORDER BY id_prod DESC LIMIT 10"; 
    const [products] = await dbPool.query(sql);
    
    res.status(200).json(products);

  } catch (error) {
    console.error('Error fetching new drops:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * 4. Get Best Sellers (Top 10 most sold products)
 * @route   GET /api/products/bestsellers
 */
exports.getBestSellers = async (req, res) => {
  // Votre demande : les produits les plus vendus
  try {
    // Cette requête est la plus complexe :
    // 1. Elle joint 'produit' et 'commande_items'
    // 2. Elle regroupe par produit
    // 3. Elle additionne la 'quantite' pour chaque produit
    // 4. Elle trie par le total vendu (DESC)
    // 5. Elle prend le top 10
    const sql = `
      SELECT p.*, SUM(ci.quantite) as total_vendu
      FROM commande_items as ci
      JOIN produit as p ON ci.id_produit = p.id_prod
      GROUP BY p.id_prod
      ORDER BY total_vendu DESC
      LIMIT 10
    `;
    
    const [products] = await dbPool.query(sql);
    
    // Si la table 'commande_items' est vide, cela renverra un tableau vide,
    // ce qui est parfait pour le frontend.
    res.status(200).json(products);

  } catch (error) {
    console.error('Error fetching best-sellers:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};