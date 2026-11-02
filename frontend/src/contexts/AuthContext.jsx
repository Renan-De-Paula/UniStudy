import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { applyThemeToApp } from '../utils/customizationStyles';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.equipped_items?.theme) {
      applyThemeToApp(currentUser.equipped_items.theme);
    }
  }, [currentUser?.equipped_items?.theme]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      api.get('/auth/me/')
        .then(response => {
          setCurrentUser({
            ...response.data,
            avatar: response.data.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
            level: response.data.level || Math.floor((response.data.xp || 0) / 100) + 1
          });
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setCurrentUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (identifier, password) => {
    try {
      const response = await api.post('/auth/login/', { 
        username: identifier.trim(), 
        password: password 
      });

      const { access, refresh, user } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      const userData = user || (await api.get('/auth/me/')).data;
      setCurrentUser({
        ...userData,
        avatar: userData.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
        level: userData.level || Math.floor((userData.xp || 0) / 100) + 1
      });
      
      try {
        const redirectRes = await api.get('/auth/redirecionamento_pos_login/');
        return { success: true, redirectTo: redirectRes.data.redirect_to || '/' };
      } catch (err) {
        return { success: true, redirectTo: '/' };
      }
    } catch (error) {
      let message = 'Falha ao conectar ao servidor.';
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'string') {
          message = data;
        } else if (data.detail) {
          message = data.detail;
        } else if (data.email) {
          message = Array.isArray(data.email) ? data.email[0] : data.email;
        } else if (data.non_field_errors) {
          message = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
        } else if (data.error) {
          message = data.error;
        }
      }
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData);
      return { success: true, data: response.data };
    } catch (error) {
      let message = 'Erro ao cadastrar usuário.';
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'string') {
          message = data;
        } else if (data.email) {
          message = `E-mail: ${Array.isArray(data.email) ? data.email[0] : data.email}`;
        } else if (data.username) {
          message = `Usuário: ${Array.isArray(data.username) ? data.username[0] : data.username}`;
        } else if (data.password) {
          message = `Senha: ${Array.isArray(data.password) ? data.password[0] : data.password}`;
        } else if (data.detail) {
          message = data.detail;
        }
      }
      return { success: false, error: message };
    }
  };

  const updateCurrentUser = (updatedData) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updatedData,
      avatar: updatedData.avatar || prev?.avatar,
      level: updatedData.level || Math.floor(((updatedData.xp !== undefined ? updatedData.xp : prev?.xp) || 0) / 100) + 1
    }));
  };

  const addXP = async (amount) => {
    if (!amount || amount <= 0) return;
    try {
      const res = await api.post('/auth/add_xp/', { amount });
      if (res.data?.xp !== undefined) {
        updateCurrentUser({ xp: res.data.xp, level: res.data.level });
      }
    } catch (err) {
      console.error("Erro ao sincronizar XP:", err);
      // Fallback local
      if (currentUser) {
        const nextXP = (currentUser.xp || 0) + amount;
        updateCurrentUser({ xp: nextXP });
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, updateCurrentUser, addXP, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );

}

export function useAuth() {
  return useContext(AuthContext);
}
