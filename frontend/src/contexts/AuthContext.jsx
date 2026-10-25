import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      api.get('/auth/me/')
        .then(response => {
          // Temporariamente definindo avatar se não vier da API
          setCurrentUser({
            ...response.data,
            avatar: response.data.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
            level: response.data.level || Math.floor(response.data.xp / 100) + 1
          });
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      const meResponse = await api.get('/auth/me/');
      setCurrentUser({
        ...meResponse.data,
        avatar: meResponse.data.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
        level: meResponse.data.level || Math.floor(meResponse.data.xp / 100) + 1
      });
      
      try {
        const redirectRes = await api.get('/auth/redirecionamento_pos_login/');
        return redirectRes.data.redirect_to;
      } catch (err) {
        return '/';
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
