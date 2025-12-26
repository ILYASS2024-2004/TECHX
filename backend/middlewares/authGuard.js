const jwt = require('jsonwebtoken');
require('dotenv').config();

const authGuard = (req, res, next) => {
  // 1. Lire le token depuis le COOKIE, pas le header
  const token = req.cookies.token;

  // 2. Vérifier si le cookie existe
  if (!token) {
    // Note : 401 Unauthorized est plus précis ici
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // 3. Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attacher les infos utilisateur à l'objet "req"
    // (Note : j'attache decoded.user, car c'est ce que nous avons mis dans le payload)
    req.user = decoded.user;
    
    // 5. Passer au prochain middleware ou au contrôleur
    next();
  } catch (err) {
    // Si le token est invalide (expiré, etc.)
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = authGuard;