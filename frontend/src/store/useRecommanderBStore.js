import { create } from 'zustand';
import { axiosInstance } from '../utils/axios'; 
import { toast } from 'react-hot-toast';

/**
 * Store pour gérer les recommandations collaboratives (Plan B - SVD).
 * * @property {boolean} isTrained - Vrai si le modèle IA connait cet utilisateur (pas de Cold Start).
 * @property {Array} recommendations - La liste des produits recommandés.
 * @property {boolean} isLoadingStatus - Chargement de la vérification du statut.
 * @property {boolean} isLoadingRecs - Chargement des recommandations.
 * * @property {function} checkStatus - Vérifie si l'utilisateur peut avoir des recos personnalisées.
 * @property {function} fetchRecommendations - Récupère les produits recommandés.
 */
const useRecommanderBStore = create((set) => ({
  // --- ÉTAT ---
  isTrained: false,
  recommendations: [],
  isLoadingStatus: false,
  isLoadingRecs: false,

  // --- ACTIONS ---

  /**
   * Étape 1 : Vérifie si l'utilisateur existe dans le modèle IA 
   * (Route: /api/recommend/b/status)
   * Cette fonction doit être appelée dès que l'utilisateur se connecte ou arrive sur la page.
   */
  checkStatus: async () => {
    set({ isLoadingStatus: true });
    try {
      // Appel au backend qui appelle l'API Python (route /check_user)
      const response = await axiosInstance.get('/recommend/b/status');
      
      // La réponse est { isTrained: true/false }
      set({ isTrained: response.data.isTrained, isLoadingStatus: false });
      
    } catch (error) {
      // Si l'API plante ou renvoie une erreur, on considère que le client n'est pas entraîné
      // pour éviter d'afficher une section vide ou cassée.
      console.error("Plan B Status Check Failed:", error);
      set({ isTrained: false, isLoadingStatus: false });
    }
  },

  /**
   * Étape 2 : Récupère les recommandations
   * (Route: /api/recommend/b)
   * À appeler uniquement si isTrained est true.
   */
  fetchRecommendations: async () => {
    set({ isLoadingRecs: true });
    try {
      const response = await axiosInstance.get('/recommend/b');
      
      // La réponse est une liste de produits hydratés (avec images, prix, etc.)
      set({ recommendations: response.data, isLoadingRecs: false });

    } catch (error) {
      console.error("Plan B Fetch Failed:", error);
      toast.error("Impossible de charger vos recommandations personnalisées.");
      set({ recommendations: [], isLoadingRecs: false });
    }
  }
}));

export default useRecommanderBStore;