import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { messageAPI } from '../services/messageAPI';
import io from 'socket.io-client';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Connexion au socket
    const socket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    // Charger les messages non lus au démarrage
    const loadUnreadMessages = async () => {
      try {
        const messages = await messageAPI.getUserMessages();
        const unreadCount = messages.filter(msg => 
          msg.to._id === user._id && !msg.read
        ).length;
        setUnreadMessages(unreadCount);
      } catch (error) {
        console.error('Error loading unread messages:', error);
      }
    };

    loadUnreadMessages();

    // Écouter les nouveaux messages
    socket.on('newMessage', (message) => {
      if (message.to._id === user._id) {
        setUnreadMessages(prev => prev + 1);
      }
    });

    return () => {
      socket.off('newMessage');
      socket.disconnect();
    };
  }, [user]);

  const markAsRead = () => {
    setUnreadMessages(0);
  };

  return (
    <NotificationContext.Provider value={{ unreadMessages, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};