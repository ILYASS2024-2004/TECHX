import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../utils/axios';

const useCartStore = create(
  persist(
    (set, get) => ({
      // --- ÉTAT ---
      cart: [],
      isCartOpen: false,
      isCheckingOut: false,

      // --- ACTIONS DE BASE ---

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      // C'EST LA FONCTION QUI VOUS MANQUAIT :
      addToCart: (product) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.id_prod === product.id_prod);

        if (existingItem) {
          // Le produit existe, on incrémente la quantité
          set({
            cart: cart.map((item) =>
              item.id_prod === product.id_prod
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            //isCartOpen: true,
          });
          toast.success("Quantity updated");
        } else {
          // Nouveau produit, on l'ajoute
          set({
            cart: [...cart, { ...product, quantity: 1 }],
            //isCartOpen: true,
          });
          toast.success("Added to cart");
        }
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id_prod !== productId),
        }));
        toast.success("Product removed");
      },

      updateQuantity: (productId, delta) => {
        const { cart } = get();
        const newCart = cart.map((item) => {
          if (item.id_prod === productId) {
            const newQuantity = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        set({ cart: newCart });
      },

      clearCart: () => set({ cart: [] }),

      // --- ACTION CHECKOUT (Connectée au Backend) ---
      checkout: async () => {
        const { cart } = get();
        
        if (cart.length === 0) {
          toast.error("Votre panier est vide");
          return;
        }

        set({ isCheckingOut: true });

        try {
          // 1. Préparer les données
          const cartItems = cart.map(item => ({
            id_prod: item.id_prod,
            quantite: item.quantity
          }));

          // 2. Appeler l'API
          await axiosInstance.post('/orders/create', { cartItems });

          // 3. Succès
          toast.success("Order confirmed successfully!");
          set({ cart: [], isCartOpen: false, isCheckingOut: false });

        } catch (error) {
          console.error("Checkout error:", error);
          set({ isCheckingOut: false });

          if (error.response?.status === 401) {
            toast.error("Veuillez vous connecter pour commander.");
          } else {
            toast.error(error.response?.data?.message || "Erreur lors de la commande");
          }
        }
      },
    }),
    {
      name: 'tech-cart-storage',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);

export default useCartStore;