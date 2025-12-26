import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import mysql.connector 
from mysql.connector import Error

print("Lancement du Plan A (v3 - Connecté à MySQL)...")

#  CONFIGURATION DE LA BASE DE DONNÉES 

config_db = {
    'host': '127.0.0.1',       
    'user': 'root',            
    'password': '',            
    'database': 'ecommerce_tech'
}

#  CHARGER LES DONNÉES DEPUIS MYSQL
print("Chargement des données tech depuis MySQL...")
produits_liste = []
try:
    db = mysql.connector.connect(**config_db)
    cursor = db.cursor(dictionary=True)
    
    # La requête SQL pour obtenir nos données
    query = "SELECT sku, description, categorie FROM produit"
    cursor.execute(query)
    
    produits_liste = cursor.fetchall()
    
    if not produits_liste:
        print("ERREUR : La table 'produit' est vide ou n'a pas pu être lue.")
        raise Exception("Aucun produit trouvé dans la base de données.")

    # Convertir la liste de dictionnaires en DataFrame
    produits = pd.DataFrame(produits_liste)

except Error as e:
    print(f"ERREUR MySQL : {e}")
    raise
finally:
    # Fermer la connexion
    if 'db' in locals() and db.is_connected():
        cursor.close()
        db.close()
        print("Connexion MySQL fermée.")

print(f"Catalogue de {produits.shape[0]} produits chargé depuis MySQL.")

#  NETTOYER LES DONNÉES 
produits['description'] = produits['description'].fillna('')
produits['categorie'] = produits['categorie'].fillna('')
produits.reset_index(drop=True, inplace=True) 
print("Données nettoyées.")

#  CRÉER LE "SUPER-TEXTE" 
produits['super_texte'] = produits['description'] + (" " + produits['categorie']) * 5

print("\n'Super-texte' créé. Aperçu :")
print(produits[['sku', 'super_texte']].head())

#  CRÉER LE "MODÈLE" 

print("\nCréation de la matrice TF-IDF...")
french_stop_words = [
    "le","la","les","un","une","et","ou","mais","de","des","du","en","à","pour","dans","avec"
]

tfidf = TfidfVectorizer(stop_words=french_stop_words)
tfidf_matrix = tfidf.fit_transform(produits['super_texte'])
print("Matrice TF-IDF créée.")

print("Calcul de la similarité cosinus...")
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
print("Matrice de similarité calculée.")

#  SAUVEGARDER LE MODÈLE

print("\nSauvegarde des fichiers .pkl...")
pickle.dump(cosine_sim, open('similarity_matrix_TECH.pkl', 'wb'))
pickle.dump(produits, open('products_list_TECH.pkl', 'wb'))

print(" Modèles 'similarity_matrix_TECH.pkl' et 'products_list_TECH.pkl' sauvegardés !")