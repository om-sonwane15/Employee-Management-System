import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/authorize/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  register: async (email, password, role) => {
    const response = await api.post('/authorize/register', { email, password, role });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/authorize/profile');
    return response.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/authorize/changepass', { oldPassword, newPassword });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/authorize/forgot', { email });
    return response.data;
  },

  resetPassword: async (email, token, newPassword) => {
    const response = await api.post('/authorize/reset', { email, token, newPassword });
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
