import { create } from 'zustand';
import { authApi } from '../api/authApi';

const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (identifier, password) => {
    const { data } = await authApi.login({ identifier, password });
    localStorage.setItem('accessToken', data.data.accessToken);
    set({ user: data.data.user, accessToken: data.data.accessToken, isAuthenticated: true });
    return data.data.user;
  },

  register: async (payload) => {
    const { data } = await authApi.register(payload);
    return data.data;
  },

  verifyEmail: async (payload) => {
    const { data } = await authApi.verifyEmail(payload);
    return data.data;
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('accessToken');
      set({ user: null, accessToken: null, isAuthenticated: false });
    }
  },

  fetchCurrentUser: async () => {
    try {
      const { data } = await authApi.getMe();
      const token = localStorage.getItem('accessToken');
      set({ user: data.data, accessToken: token, isAuthenticated: true, isLoading: false });
      return data.data;
    } catch {
      localStorage.removeItem('accessToken');
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
      return null;
    }
  },

  initialize: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return set({ isLoading: false });
    set({ accessToken: token });
    await get().fetchCurrentUser();
  },
}));

export default useAuthStore;