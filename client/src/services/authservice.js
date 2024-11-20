import axios from 'axios';

const API_URL_AUTH = 'http://localhost:5000/api/auth';
const API_URL_USERS = 'http://localhost:5000/api/users';

const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL_AUTH}/register`, userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', JSON.stringify(response.data.token));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL_AUTH}/login`, { email, password });
    if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token); // Retiré JSON.stringify()
  }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const getProfile = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const response = await axios.get(`${API_URL_USERS}/profile`, config);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getProfile,
};

export default authService;