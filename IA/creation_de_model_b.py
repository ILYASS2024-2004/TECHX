import pandas as pd
import numpy as np
from surprise import Reader, Dataset
from surprise.model_selection import train_test_split
from surprise import SVD
from surprise import accuracy
import pickle
import mysql.connector  
from mysql.connector import Error

print("Lancement du Plan B (v4 - Connecté, Filtré, Mélangé)...")

#  CONFIGURATION DE LA BASE DE DONNÉES 

config_db = {
    'host': '127.0.0.1',      
    'user': 'root',            
    'password': '',           
    'database': 'ecommerce_tech'
}

# CHARGER LES DONNÉES DEPUIS MYSQL (AVEC LE JOIN) 
print("Chargement des transactions depuis MySQL (JOIN)...")
transactions_liste = []
try:
    db = mysql.connector.connect(**config_db)
    cursor = db.cursor(dictionary=True)
    
    
    query = """
    SELECT
        c.id_client AS CustomerID,
        p.sku AS sku,
        ci.quantite AS Quantity
    FROM
        commande_items AS ci
    JOIN
        commandes AS c ON ci.id_commande = c.id_commande
    JOIN
        produit AS p ON ci.id_produit = p.id_prod;
    """
    cursor.execute(query)
    
    transactions_liste = cursor.fetchall()
    
    if not transactions_liste:
        print("ERREUR : Aucune transaction trouvée dans la base de données.")
        raise Exception("Aucune transaction trouvée.")

    # Convertir en DataFrame
    df_surprise = pd.DataFrame(transactions_liste)

except Error as e:
    print(f"ERREUR MySQL : {e}")
    raise
finally:
    # Fermer la connexion
    if 'db' in locals() and db.is_connected():
        cursor.close()
        db.close()
        print("Connexion MySQL fermée.")

print(f"Transactions brutes chargées : {df_surprise.shape[0]} lignes.")

#  NETTOYER ET PRÉPARER LES DONNÉES 


print(f"Filtrage des 'outliers' (Quantité > 5)...")
initial_rows = df_surprise.shape[0]
df_surprise = df_surprise[df_surprise['Quantity'] <= 5].copy()
removed_rows = initial_rows - df_surprise.shape[0]
print(f"-> {removed_rows} lignes (entreprises/outliers) supprimées.")



print("Mélange des données (shuffle)...")
df_surprise = df_surprise.sample(frac=1, random_state=42).reset_index(drop=True)


df_surprise.rename(columns={
    'CustomerID': 'user_id',
    'sku': 'item_id',
    'Quantity': 'rating_raw'
}, inplace=True)


# (Le client qui a fait 4 puis 3 aura un total de 7)

df_surprise = df_surprise.groupby(['user_id', 'item_id'], as_index=False)['rating_raw'].sum()
#  Transformation Logarithmique 
df_surprise['rating'] = np.log1p(df_surprise['rating_raw'])

print("Transformation Log(1+p) appliquée.")

print(f"Données finales prêtes pour l'entraînement : {df_surprise.shape[0]} lignes.")
print("\n---")

#  ENTRAÎNEMENT ET ÉVALUATION 
print("Étape 4 : Entraînement et Évaluation")

# Définir le "Reader"
min_rating = df_surprise['rating'].min()
max_rating = df_surprise['rating'].max()
print(f"Échelle des notes (Log-Quantity) : de {min_rating:.2f} à {max_rating:.2f}")

reader = Reader(rating_scale=(min_rating, max_rating))

# Charger le Dataset
data = Dataset.load_from_df(df_surprise[['user_id', 'item_id', 'rating']], reader)

# FAIRE LE TRAIN/TEST SPLIT
print("\nDivision des données (80% train, 20% test)...")
trainset, testset = train_test_split(data, test_size=0.2, random_state=42)
print("Données divisées.")

# Entraîner le modèle (SVD)
print("Entraînement du modèle SVD...")
algo = SVD(n_factors=10)
algo.fit(trainset)
print("Modèle entraîné.")

# Tester la performance
print("\nÉvaluation de la performance sur le 'testset'...")
predictions = algo.test(testset)
rmse = accuracy.rmse(predictions)
print(f"Performance (RMSE) : {rmse}")

# Ré-entraînement Final et Sauvegarde
print("\nRé-entraînement du modèle sur 100% des données...")
full_trainset = data.build_full_trainset()
algo_final = SVD(n_factors=10)
algo_final.fit(full_trainset)
print("Modèle final entraîné.")

# Sauvegarder le modèle
pickle.dump(algo_final, open('model_plan_B_TECH.pkl', 'wb'))

print("\n---")
print(" Phase 2  terminée !")
print("Le fichier 'model_plan_B_TECH.pkl' a été créé avec succès.")