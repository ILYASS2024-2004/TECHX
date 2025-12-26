// 1. Importer dotenv (syntaxe CommonJS)
const dotenv = require('dotenv');

// 2. Importer mysql2 (syntaxe CommonJS)
const mysql = require('mysql2/promise'); // Nous utilisons la version "promise"

// 3. Charger les variables d'environnement du fichier .env
// (Assurez-vous que le fichier .env est à la racine de /backend)
dotenv.config();

// 4. Créer le "Pool" de connexions à la base de données
const dbPool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_tech',
  waitForConnections: true,
  connectionLimit: 10, // Ajustez selon vos besoins
  queueLimit: 0
});

// 5. Exporter le pool pour l'utiliser dans d'autres fichiers (syntaxe CommonJS)
module.exports = dbPool;