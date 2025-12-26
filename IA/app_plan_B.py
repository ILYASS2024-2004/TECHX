import pandas as pd
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector  
from mysql.connector import Error

# Configuration de la Base de Données 

config_db = {
    'host': '127.0.0.1',      
    'user': 'root',            
    'password': '',            
    'database': 'ecommerce_tech'
}

#Chargement du "Cerveau" IA (Modèle) 
print("Chargement des modèles TECH (Plan B), veuillez patienter...")
try:
    algo = pickle.load(open('model_plan_B_TECH.pkl', 'rb'))
except FileNotFoundError:
    print("ERREUR : 'model_plan_B_TECH.pkl' introuvable.")
    print("Veuillez d'abord exécuter le script 'train_plan_B_v4.py'.")
    exit()

#Chargement des Listes de Validation (depuis MySQL)
# Ces listes sont chargées une seule fois au démarrage de l'API
print("Chargement des listes de validation (SKUs et Clients) depuis MySQL...")
all_items = []
all_users_set = set()

try:
    db = mysql.connector.connect(**config_db)
    cursor = db.cursor(dictionary=True)
    
    #Récupérer tous les SKUs possibles
    cursor.execute("SELECT sku FROM produit")
    all_items = [row['sku'] for row in cursor.fetchall()]
    
    #Récupérer tous les clients qui ont DÉJÀ acheté
    # (Ce sont les seuls que notre modèle "connaît")
    cursor.execute("SELECT DISTINCT id_client FROM commandes")
    all_users_set = set(row['id_client'] for row in cursor.fetchall())
    
    print(f"{len(all_items)} produits et {len(all_users_set)} clients chargés en mémoire.")

except Error as e:
    print(f"ERREUR MySQL lors du chargement initial : {e}")
    exit()
finally:
    if 'db' in locals() and db.is_connected():
        cursor.close()
        db.close()

#  Fonction pour récupérer l'historique d'un client
def get_user_purchase_history(user_id):
    """
    Interroge la base de données "live" pour l'historique D'UN SEUL client.
    """
    history_skus = set()
    try:
        db = mysql.connector.connect(**config_db)
        cursor = db.cursor(dictionary=True)
        
        # La requête JOIN ciblée
        query = """
        SELECT DISTINCT p.sku
        FROM commande_items AS ci
        JOIN commandes AS c ON ci.id_commande = c.id_commande
        JOIN produit AS p ON ci.id_produit = p.id_prod
        WHERE c.id_client = %s;
        """
        cursor.execute(query, (user_id,))
        
        history_skus = set(row['sku'] for row in cursor.fetchall())
        
    except Error as e:
        print(f"ERREUR MySQL lors de la récupération de l'historique : {e}")
    finally:
        if 'db' in locals() and db.is_connected():
            cursor.close()
            db.close()
            
    return history_skus

# Initialisation de l'API Flask
app = Flask(__name__)
CORS(app) 
print("Serveur (Plan B - Tech) prêt !")


# Définition de la route API

# ROUTE 1 : Vérifier si le client est connu (NOUVEAU)
@app.route('/recommend/check_user', methods=['GET'])
def check_user_exists():
    try:
        user_id = int(request.args.get('user_id'))
    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid user_id'}), 400
    
    # LOGIQUE STRICTE (Via le Modèle SVD) 
    try:
        # On essaie de convertir l'ID réel en ID interne du modèle
        algo.trainset.to_inner_uid(user_id)
        
        # Si ça ne plante pas, c'est que le modèle CONNAÎT ce client
        exists = True
        
    except ValueError:
        # Si ça plante (ValueError), le client n'était pas là lors de l'entraînement
        exists = False
    
    return jsonify({'exists': exists})

#Route 2

@app.route('/recommend/behavior', methods=['GET'])
def recommend_behavior():
    
    try:
        user_id = int(request.args.get('user_id'))
    except (TypeError, ValueError):
        return jsonify({'error': 'Le paramètre user_id est manquant ou invalide.'}), 400
        
    # Validation de l'entrée 
    # Le modèle connaît-il cet utilisateur ?
    if user_id not in all_users_set:
        # C'est un nouveau client (Cold Start) ou un client inconnu
        return jsonify({'error': f'user_id {user_id} non trouvé dans les données d\'entraînement.'}), 404
        
    try:
        # ogique de recommandation (le cœur du Plan B)
        
        # Obtenir l'historique d'achat "live" de ce client
        # (Cette ligne ne lit plus un CSV, elle appelle notre fonction SQL)
        items_purchased = get_user_purchase_history(user_id)
        
        print(f"User {user_id} a déjà acheté {len(items_purchased)} produits (lu depuis MySQL).")

        # Créer la liste des produits à prédire
      
        items_to_predict = [item for item in all_items if item not in items_purchased]
        
        print(f"Calcul des scores pour {len(items_to_predict)} produits non achetés...")

        #Prédire le score pour chaque produit
        
        predictions = []
        for item_id in items_to_predict:
            pred = algo.predict(uid=user_id, iid=item_id)
            predictions.append((item_id, pred.est))
            
        #Trier les prédictions
     
        predictions.sort(key=lambda x: x[1], reverse=True)
        
        #Obtenir les 10 meilleurs 'sku'
      
        top_10_recommendations = [item_id for item_id, score in predictions[:10]]
        
        print(f"Top 10 pour User {user_id} : {top_10_recommendations}")

        #Renvoyer la réponse en JSON
        return jsonify({'recommendations': top_10_recommendations})

    except Exception as e:
        return jsonify({'error': f'Erreur interne du serveur: {str(e)}'}), 500

# Lancement du serveur
if __name__ == '__main__':
    app.run(port=5001, debug=True)