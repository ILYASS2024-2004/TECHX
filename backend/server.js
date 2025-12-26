const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
// --- Importer les routes ---
const authRoutes = require('./routes/authRoutes');
const commandeRoutes = require('./routes/commandeRoutes');
const productRoutes = require('./routes/productRoutes');
const recommenderRoutes = require('./routes/recommenderRoutes');
// ✅ autoriser les requêtes cross-origin
app.use(cors({
  origin: 'http://localhost:5173', // ou ton vrai frontend (Netlify, etc.)
  credentials: true, // si tu utilises des cookies
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/orders', commandeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/recommend', recommenderRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur lancé sur le port ${PORT}`));
