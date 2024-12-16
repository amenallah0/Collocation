import { secureApi } from '../config/api.config';

export const messageAPI = {
  sendMessage: async (messageData) => {
    try {
      const response = await secureApi.post('/messages/send', messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi du message');
    }
  },

  getUserMessages: async () => {
    try {
      const response = await secureApi.get('/messages/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user messages:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des messages');
    }
  },

  deleteMessage: async (messageId) => {
    try {
      const response = await secureApi.delete(`/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du message');
    }
  },

  deleteConversation: async (userId) => {
    try {
      const response = await secureApi.delete(`/messages/conversation/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting conversation:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de la conversation');
    }
  },

  getUnreadMessages: async () => {
    try {
      const response = await secureApi.get('/messages/unread');
      return response.data;
    } catch (error) {
      console.error('Error fetching unread messages:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des notifications');
    }
  },

  markMessagesAsRead: async () => {
    try {
      const response = await secureApi.put('/messages/markAsRead');
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur lors du marquage des messages');
    }
  }
}; 