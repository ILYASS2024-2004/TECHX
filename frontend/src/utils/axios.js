import axios from 'axios';

// 1. Définir l'URL de base de votre API backend
// (Le port 8000 est celui que nous avons défini dans le backend/.env)
const BASE_URL = 'http://localhost:8000/api';

// 2. Créer l'instance Axios
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true // 👈 L'option la plus importante !
});


