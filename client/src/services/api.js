import { publicApi, secureApi } from '../config/api.config';
import axios from 'axios';

const baseURL = 'http://localhost:5000/api';

// Service API pour les logements
export const housingAPI = {
  getAll: async () => {
    try {
      const response = await secureApi.get('/housings');
      console.log('API Response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching housings:', error);
      throw error;
    }
  },
  getHousingById: async (id) => {
    try {
      console.log('API call - Getting housing with ID:', id);
      const response = await publicApi.get(`/housings/${id}`);
      console.log('API call - Response received:', response);
      return response;
    } catch (error) {
      console.error('API call - Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },
  create: async (data, images) => {
    try {
      const formData = new FormData();
      
      // Ajouter les images au formData
      if (images?.length > 0) {
        images.forEach(image => {
          formData.append('images', image);
        });
      }
      
      // Ajouter les autres données
      Object.keys(data).forEach(key => {
        if (key === 'coordinates') {
          formData.append(key, JSON.stringify(data[key]));
        } else if (key !== 'images') {
          formData.append(key, data[key]);
        }
      });

      const response = await secureApi.post('/housings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      return response;
    } catch (error) {
      console.error('Error creating housing:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      console.log('Sending update request with data:', data);
      const response = await secureApi.put(`/housings/${id}`, data);
      console.log('Update response:', response);
      return response.data;
    } catch (error) {
      console.error('Error updating housing:', error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await axios.get(`${baseURL}/housings/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching housing:', error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await secureApi.delete(`/housings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting housing:', error);
      throw error;
    }
  }

};

// Service API pour les messages
export const messageAPI = {
  getAll: () => secureApi.get('/messages'),
  getConversation: (id) => secureApi.get(`/messages/conversation/${id}`),
  send: (data) => secureApi.post('/messages', data),
  markAsRead: (id) => secureApi.put(`/messages/${id}/read`),
  delete: (id) => secureApi.delete(`/messages/${id}`)
};

// Service API pour les utilisateurs
export const userAPI = {
  getProfile: (id) => secureApi.get(`/users/${id}`),
  updateProfile: (id, data) => secureApi.put(`/users/${id}`, data),
  deleteAccount: (id) => secureApi.delete(`/users/${id}`)
};