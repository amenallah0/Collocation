import { publicApi, secureApi } from '../config/api.config';

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
  getHousingById: (id) => secureApi.get(`/housings/${id}`),
  create: async (data, images) => {
    const formData = new FormData();
    
    if (images?.length > 0) {
      images.forEach(image => {
        formData.append('images', image.file);
      });
    }
    
    Object.keys(data).forEach(key => {
      if (key === 'coordinates') {
        formData.append(key, JSON.stringify(data[key]));
      } else if (key !== 'images') {
        formData.append(key, data[key]);
      }
    });

    return secureApi.post('/housings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  },
  update: async (id, data, images) => {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (key !== 'images') {
        formData.append(key, data[key]);
      }
    });
    
    if (images?.length > 0) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }

    return secureApi.put(`/housings/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
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