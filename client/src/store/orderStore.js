import { create } from 'zustand';
import API from '../utils/axios';

const useOrderStore = create((set) => ({
  orders: [],
  stats: null,
  loading: false,
  error: null,

  getOrders: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.get('/orders');
      set({ orders: data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch orders', loading: false });
    }
  },

  getStats: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.get('/orders/stats');
      set({ stats: data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch stats', loading: false });
    }
  },

  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.post('/orders', orderData);
      set((state) => ({
        orders: [data, ...state.orders],
        loading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create order', loading: false });
      return { success: false, message: error.response?.data?.message };
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.patch(`/orders/${id}/status`, { status });
      set((state) => ({
        orders: state.orders.map((o) => (o._id === id ? data : o)),
        loading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update order', loading: false });
      return { success: false };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useOrderStore;