import { create } from 'zustand';
// Votre chemin '../utils/axios' est correct pour votre structure
import { axiosInstance } from '../utils/axios'; 

// --- LA CORRECTION EST ICI ---
// (J'ai ajouté les accolades { } autour de toast)
import { toast } from 'react-hot-toast'; 
// -----------------------------

const useAuthStore = create((set) => ({
  // --- 1. L'ÉTAT (State) ---
  user: null,
  isLoading: false,
  authChecked: false,

  // --- 2. LES ACTIONS (Actions) ---
  login: async (email, motdepass) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post('/auth/login', { email, motdepass });
      set({ user: response.data.user, isLoading: false, authChecked: true });
      toast.success(response.data.message);
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed.';
      toast.error(message);
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (nom, email, motdepass) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post('/auth/signup', { nom, email, motdepass });
      set({ user: response.data.user, isLoading: false, authChecked: true });
      toast.success(response.data.message);
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed.';
      toast.error(message);
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ user: null });
      toast.success('Logout successful.');
    } catch (error) {
      const message = error.response?.data?.message || 'Logout failed.';
      toast.error(message);
    }
  },

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/auth/check');
      set({ user: response.data.user, authChecked: true });
    } catch (error) {
      // Ce n'est pas une "erreur", c'est normal si on n'est pas connecté
      set({ user: null, authChecked: true });
    }
  },
}));

export default useAuthStore;