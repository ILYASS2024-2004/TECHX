import pandas as pd
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS

#  Initialisation de l'application Flask 
app = Flask(__name__)
CORS(app) 

print("Chargement des modèles TECH (Plan A), veuillez patienter...")

# Chargement des NOUVEAUX fichiers .pkl 

try:
    matrix = pickle.load(open('similarity_matrix_TECH.pkl', 'rb'))
    # 'products' est maintenant un DataFrame complet
    products_df = pickle.load(open('products_list_TECH.pkl', 'rb')) 
except FileNotFoundError:
    print("ERREUR : Fichiers '..._TECH.pkl' introuvables.")
    print("Veuillez d'abord exécuter le script 'train_plan_A_v2.py'.")
    exit()

# Création de l'index de correspondance (avec 'sku') 
# Créer un index pour trouver un produit par son 'sku'
# (Ex: indices['TEC-PH-001'] -> 0)
indices = pd.Series(products_df.index, index=products_df['sku'])

print("Serveur (Plan A - Tech) prêt !")


# Définition de la route API 
@app.route('/recommend/content', methods=['GET'])
def recommend_content():
    
    # Obtenir le 'sku' depuis l'URL (au lieu de 'stock_code')
 
    sku_code = request.args.get('sku')
    
    # Validation de l'entrée 
    if not sku_code:
        return jsonify({'error': 'Le paramètre sku est manquant.'}), 400
        
    if sku_code not in indices:
        return jsonify({'error': f'SKU {sku_code} non trouvé.'}), 404
        
    try:
        #Logique de recommandation
      
        
        # Trouver l'index du produit (ex: 0)
        idx = indices[sku_code]
        
        # Obtenir les scores de similarité
        sim_scores = list(enumerate(matrix[idx]))
        
        # Trier les produits par score
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Obtenir les 10 meilleurs 7 (ignorer le 1er, c'est lui-même)
        sim_scores = sim_scores[1:7]
        
        #Récupérer les index de ces 10 produits
        product_indices = [i[0] for i in sim_scores]
        
        # Récupérer les 'sku' correspondants
        recommendations = products_df['sku'].iloc[product_indices].tolist()
        
        #Renvoyer la réponse en JSON
        return jsonify({'recommendations': recommendations})

    except Exception as e:
        return jsonify({'error': f'Erreur interne du serveur: {str(e)}'}), 500

# ancement du serveur 
if __name__ == '__main__':
    #le port 5000
    app.run(port=5000, debug=True)