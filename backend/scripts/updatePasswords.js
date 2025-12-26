// scripts/updatePasswords.js

const bcrypt = require('bcryptjs');
const db = require('../config/db'); // <-- ton fichier dbPool
require('dotenv').config();

async function updateAllPasswords() {
  try {
    console.log("🔄 Génération du hash pour 'aaaa1111'...");
    const newPassword = "aaaa1111";
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log("🔍 Récupération des utilisateurs...");
    const [users] = await db.query("SELECT id FROM user");

    if (users.length === 0) {
      console.log("❌ Aucun utilisateur trouvé !");
      return;
    }

    console.log(`📌 ${users.length} utilisateurs trouvés.`);
    console.log("🔄 Mise à jour des mots de passe...");

    for (const user of users) {
      await db.query(
        "UPDATE user SET motdepass = ? WHERE id = ?",
        [hashedPassword, user.id]
      );
      console.log(`✔ Mot de passe mis à jour pour ID: ${user.id}`);
    }

    console.log("✅ Tous les mots de passe ont été mis à jour avec succès !");
    process.exit();
  } catch (error) {
    console.error("❌ Erreur :", error);
    process.exit(1);
  }
}

updateAllPasswords();
