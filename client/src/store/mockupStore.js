import { create } from 'zustand';
import API from '../utils/axios';

const useMockupStore = create((set) => ({
  mockups: [],
  mockup: null,
  loading: false,
  error: null,

  getMockups: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.get('/mockups', { params });
      set({ mockups: data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch mockups', loading: false });
    }
  },

  getMockupById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.get(`/mockups/${id}`);
      set({ mockup: data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch mockup', loading: false });
    }
  },

  createMockup: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.post('/mockups', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      set((state) => ({
        mockups: [data, ...state.mockups],
        loading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create mockup', loading: false });
      return { success: false, message: error.response?.data?.message };
    }
  },

  updateMockup: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.put(`/mockups/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      set((state) => ({
        mockups: state.mockups.map((m) => (m._id === id ? data : m)),
        loading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update mockup', loading: false });
      return { success: false };
    }
  },

  deleteMockup: async (id) => {
    set({ loading: true, error: null });
    try {
      await API.delete(`/mockups/${id}`);
      set((state) => ({
        mockups: state.mockups.filter((m) => m._id !== id),
        loading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete mockup', loading: false });
      return { success: false };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useMockupStore;