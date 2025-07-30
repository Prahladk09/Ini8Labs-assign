import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const data = await apiService.login(credentials);
          set({
            user: { id: data.user_id, username: data.username },
            token: data.access_token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
          return data;
        } catch (error) {
          set({
            loading: false,
            error: error.message,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      signup: async (userData) => {
        set({ loading: true, error: null });
        try {
          const data = await apiService.signup(userData);
          set({
            user: { id: data.user_id, username: data.username },
            token: data.access_token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
          return data;
        } catch (error) {
          set({
            loading: false,
            error: error.message,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore; 