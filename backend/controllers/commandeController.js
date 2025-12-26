const dbPool = require('../config/db');

exports.createOrder = async (req, res) => {
  // 1. Récupérer le panier (ce que le client VEUT acheter)
  const { cartItems } = req.body;
  // 2. Récupérer l'ID du client (grâce au middleware authGuard)
  const id_client = req.user.id;

  // 3. Valider le panier
  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: 'Cart is empty.' });
  }

  let connection; // Nous déclarons la connexion ici pour y accéder dans le 'finally'
  
  try {
    // ---- DÉBUT DE LA TRANSACTION SÉCURISÉE ----
    // C'est le "try" de MySQL
    connection = await dbPool.getConnection();
    await connection.beginTransaction();

    // 4. (SÉCURITÉ) Récupérer les vrais prix depuis la BDD
    
    // Obtenir tous les ID de produits du panier
    const productIds = cartItems.map(item => item.id_prod);
    const placeholders = productIds.map(() => '?').join(',');

    // Demander à MySQL les vrais prix
    const [productsInDB] = await connection.query(
      `SELECT id_prod, prix FROM produit WHERE id_prod IN (${placeholders})`,
      productIds
    );

    // Créer une "carte" pour trouver les prix facilement
    const priceMap = new Map(productsInDB.map(p => [p.id_prod, parseFloat(p.prix)]));

    // 5. (SÉCURITÉ) Calculer le prix total sur le SERVEUR
    let prix_total_commande = 0;
    for (const item of cartItems) {
      const prix = priceMap.get(item.id_prod);
      if (!prix) {
        // Si un produit n'existe pas, annuler toute la commande
        throw new Error(`Product ID ${item.id_prod} not found.`);
      }
      prix_total_commande += prix * item.quantite;
    }

    // 6. Insérer la commande principale (la "facture")
    const [orderResult] = await connection.query(
      'INSERT INTO commandes (id_client, prix_total_commande) VALUES (?, ?)',
      [id_client, prix_total_commande]
    );
    const newOrderId = orderResult.insertId;

    // 7. Insérer les articles de la commande (les "lignes de la facture")
    const itemInsertQueries = cartItems.map(item => {
      const prix_unitaire = priceMap.get(item.id_prod);
      return connection.query(
        'INSERT INTO commande_items (id_commande, id_produit, quantite, prix_unitaire) VALUES (?, ?, ?, ?)',
        [newOrderId, item.id_prod, item.quantite, prix_unitaire]
      );
    });
    
    // Attendre que TOUS les articles soient insérés
    await Promise.all(itemInsertQueries);

    // 8. Si tout a réussi, valider la transaction
    await connection.commit();
    // ---- FIN DE LA TRANSACTION SÉCURISÉE ----

    res.status(201).json({ 
      message: 'Order created successfully!', 
      orderId: newOrderId 
    });

  } catch (error) {
    // ---- GESTION DE L'ERREUR ----
    // Si une seule étape a échoué, annuler TOUTES les étapes
    if (connection) {
      await connection.rollback();
    }
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Server error during order creation.' });
  
  } finally {
    // Libérer la connexion à la BDD dans tous les cas
    if (connection) {
      connection.release();
    }
  }
};