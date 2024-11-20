import axios from 'axios';

// Configuration de base
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API publique
export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API sécurisée
export const secureApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour les requêtes sécurisées
secureApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur global pour la gestion des erreurs
const errorInterceptor = (error) => {
  console.error('Erreur API:', {
    status: error.response?.status,
    data: error.response?.data,
    message: error.message,
    url: error.config?.url,
    method: error.config?.method
  });

  // Gestion des erreurs d'authentification
  if (error.response?.status === 401) {
    if (!error.config.url.includes('/data')) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
  }

  return Promise.reject(error);
};

publicApi.interceptors.response.use(response => response, errorInterceptor);
secureApi.interceptors.response.use(response => response, errorInterceptor);