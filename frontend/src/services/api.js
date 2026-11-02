import axios from 'axios';

const getApiBaseUrl = () => {
  let envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // Corrige automaticamente eventual confusão do caractere '1' (um) por 'l' (éle)
    return envUrl.replace('unistudy-128o', 'unistudy-l28o');
  }
  if (typeof window !== 'undefined' && window.location.hostname) {
    if (window.location.hostname.includes('vercel.app')) {
      return 'https://unistudy-l28o.onrender.com/api';
    }
    if (window.location.hostname !== 'localhost') {
      return `http://${window.location.hostname}:8001/api`;
    }
  }
  return 'http://localhost:8001/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
