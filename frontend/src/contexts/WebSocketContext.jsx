import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    try {
      const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
      const wsProto = isHttps ? 'wss:' : 'ws:';
      let wsHost = 'localhost:8001';
      if (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost') {
        if (window.location.hostname.includes('vercel.app')) {
          wsHost = 'unistudy-l28o.onrender.com';
        } else {
          wsHost = `${window.location.hostname}:8001`;
        }
      }

      // Connect to global notifications
      const ws = new WebSocket(`${wsProto}//${wsHost}/ws/notifications/`);

      ws.onopen = () => {
        console.log('Connected to global notifications');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setNotifications(prev => [data, ...prev]);
        } catch (e) {
          console.warn('Notification parse error:', e);
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from notifications');
      };

      ws.onerror = () => {
        // Silencioso em caso de indisponibilidade
      };

      setSocket(ws);

      return () => {
        ws.close();
      };
    } catch (err) {
      console.warn('WebSocket init skipped:', err);
    }
  }, [currentUser]);

  const clearNotifications = () => setNotifications([]);

  return (
    <WebSocketContext.Provider value={{ socket, notifications, clearNotifications }}>
      {children}
    </WebSocketContext.Provider>
  );
};
