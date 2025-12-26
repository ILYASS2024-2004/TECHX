import { create } from 'zustand';
import {axiosInstance} from '../utils/axios'; // Notre instance Axios
import { toast } from 'react-hot-toast'; // Pour les notifications

/**
 * Le store Zustand pour gérer l'état des produits.
 *
 * @property {Array} products - La liste principale des produits (pour la page /products).
 * @property {Object | null} selectedProduct - Le produit actuellement consulté (pour la page /product/:sku).
 * @property {Array} newDrops - Les 10 produits les plus récents (pour la HomePage).
 * @property {Array} bestSellers - Les 10 produits les plus vendus (pour la HomePage).
 * @property {Array} recommendationsA - Les produits recommandés (Plan A) pour le produit sélectionné.
 *
 * @property {boolean} isLoadingProducts - Chargement de la liste principale.
 * @property {boolean} isLoadingSelected - Chargement du produit unique.
 * @property {boolean} isLoadingNewDrops - Chargement des nouveaux produits.
 * @property {boolean} isLoadingBestSellers - Chargement des best-sellers.
 * @property {boolean} isLoadingRecsA - Chargement des recommandations Plan A.
 *
 * @property {function} fetchProducts - Récupère tous les produits (ou par catégorie).
 * @property {function} fetchProductBySku - Récupère un seul produit par son SKU.
 * @property {function} fetchNewDrops - Récupère les 10 produits les plus récents.
 * @property {function} fetchBestSellers - Récupère les 10 produits les plus vendus.
 * @property {function} fetchRecommendationsA - Récupère les recommandations du Plan A.
 */
const useProductStore = create((set) => ({
  // --- 1. L'ÉTAT (State) ---
  products: [],
  selectedProduct: null,
  newDrops: [],
  bestSellers: [],
  recommendationsA: [],

  // États de chargement séparés
  isLoadingProducts: false,
  isLoadingSelected: false,
  isLoadingNewDrops: false,
  isLoadingBestSellers: false,
  isLoadingRecsA: false,

  // --- 2. LES ACTIONS (Actions) ---

  /**
   * Récupère la liste principale des produits.
   * Si 'categorie' est fournie, filtre par cette catégorie.
   * @param {string | null} categorie - La catégorie à filtrer (ex: 'PHONES')
   */
  fetchProducts: async (categorie = null) => {
    set({ isLoadingProducts: true });
    try {
      // Construit dynamiquement l'endpoint
      const endpoint = categorie
        ? `/products?categorie=${categorie}`
        : '/products';
        
      const response = await axiosInstance.get(endpoint);
      set({ products: response.data, isLoadingProducts: false });

    } catch (error) {
      toast.error('Failed to fetch products.');
      set({ isLoadingProducts: false });
    }
  },

  /**
   * Récupère les détails d'un seul produit par son SKU.
   * @param {string} sku - Le SKU du produit à récupérer.
   */
  fetchProductBySku: async (sku) => {
    set({ isLoadingSelected: true, selectedProduct: null }); // Vider l'ancien produit
    try {
      const response = await axiosInstance.get(`/products/${sku}`);
      set({ selectedProduct: response.data, isLoadingSelected: false });

    } catch (error) {
      toast.error('Failed to fetch product details.');
      set({ isLoadingSelected: false });
    }
  },

  /**
   * Récupère les 10 produits les plus récents ("New Drops").
   */
  fetchNewDrops: async () => {
    set({ isLoadingNewDrops: true });
    try {
      const response = await axiosInstance.get('/products/new');
      set({ newDrops: response.data, isLoadingNewDrops: false });

    } catch (error) {
      toast.error('Failed to fetch new drops.');
      set({ isLoadingNewDrops: false });
    }
  },

  /**
   * Récupère les 10 produits les plus vendus ("Best Sellers").
   */
  fetchBestSellers: async () => {
    set({ isLoadingBestSellers: true });
    try {
      const response = await axiosInstance.get('/products/bestsellers');
      set({ bestSellers: response.data, isLoadingBestSellers: false });

    } catch (error) {
      toast.error('Failed to fetch best sellers.');
      set({ isLoadingBestSellers: false });
    }
  },
  
  /**
   * (Plan A) Récupère les produits similaires basés sur le contenu.
   * @param {string} sku - Le SKU du produit de base.
   */
  fetchRecommendationsA: async (sku) => {
    set({ isLoadingRecsA: true, recommendationsA: [] }); // Vider les anciennes recos
    try {
      const response = await axiosInstance.get(`/recommend/a?sku=${sku}`);
      // L'API renvoie une liste vide en cas d'erreur (ex: API IA en panne),
      // donc nous pouvons la définir directement.
      set({ recommendationsA: response.data, isLoadingRecsA: false });

    } catch (error) {
      // Cette erreur ne devrait se produire qu'en cas de panne du backend (500)
      toast.error('Failed to fetch recommendations.');
      set({ isLoadingRecsA: false });
    }
  },

}));

export default useProductStore;