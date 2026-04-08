import { create } from 'zustand';
import API from '../utils/axios';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  loading: false,
  error: null,

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.post('api/auth/register', userData);
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Registration failed', loading: false });
      return { success: false, message: error.response?.data?.message };
    }
  },

  login: async (userData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.post('api/auth/login', {
  email: userData.email,
  password: userData.password
});
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, loading: false });
      return { success: true, role: data.role };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', loading: false });
      return { success: false, message: error.response?.data?.message };
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;