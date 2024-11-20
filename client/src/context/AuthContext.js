import { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authservice';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null, // Retiré JSON.parse()
    loading: false,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.user && state.token) {
      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('token', JSON.stringify(state.token));
    }
  }, [state.user, state.token]);

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: response.user, token: response.token }
      });
      return response;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAIL', payload: error.message });
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authService.login(email, password);
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: response.user, token: response.token }
      });
      return response;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAIL', payload: error.message });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const updateUser = (userData) => {
    dispatch({ 
      type: 'LOGIN_SUCCESS', 
      payload: { user: userData, token: state.token }
    });
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      register, 
      login, 
      logout,
      updateUser,
      dispatch 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);