import { secureApi } from '../config/api.config';

export const userService = {
  getUserData: async (userId) => {
    try {
      const response = await secureApi.get(`/api/users/${userId}/data`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Session expirée');
      }
      throw new Error(error.response?.data?.message || 'Impossible de charger les données');
    }
  },

  updateProfile: async (userId, profileData) => {
    try {
      console.log('Sending update request for user:', userId, profileData);
      const response = await secureApi.put(`/users/${userId}`, profileData);
      console.log('Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update error:', error.response || error);
      if (error.response?.status === 401) {
        throw new Error('Session expirée');
      }
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  }
};