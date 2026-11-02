import axios from 'axios';

const getApiBaseUrl = () => {
  let envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    let clean = envUrl.replace('unistudy-128o', 'unistudy-l28o').replace(/\/+$/, '');
    if (!clean.endsWith('/api')) {
      clean += '/api';
    }
    return clean;
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

// Interceptor de requisições: injeta o Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respostas: auto-refresh de token expirado
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se receber 401 e não for requisição de login/refresh
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url.includes('/auth/login/') &&
      !originalRequest.url.includes('/login/refresh/')
    ) {
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(`${getApiBaseUrl()}/auth/login/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem('access_token', newAccessToken);

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
