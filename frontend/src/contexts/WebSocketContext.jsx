import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState(null);
  const [nãotifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    // Connect to global nãotifications
    const ws = new WebSocket(`ws://localhost:8001/ws/nãotifications/`);

    ws.onãopen = () => {
      console.log('Connected to global nãotifications');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('New nãotification:', data);
      
      setNotifications(prev => [data, ...prev]);
      
      // Optionally show a browser toast here if permitted
    };

    ws.onclose = () => {
      console.log('Disconnected from nãotifications');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [currentUser]);

  const clearNotifications = () => setNotifications([]);

  return (
    <WebSocketContext.Provider value={{ socket, nãotifications, clearNotifications }}>
      {children}
    </WebSocketContext.Provider>
  );
};
