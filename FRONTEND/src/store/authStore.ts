import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState } from '../types/user';

const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      signIn: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const user = MOCK_USERS.find(
            (u) => u.email === email && u.password === password
          );
          if (!user) {
            throw new Error('Invalid credentials');
          }
          const { password: _, ...userData } = user;
          set({ user: userData as User });
        } finally {
          set({ loading: false });
        }
      },
      signUp: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const newUser = {
            id: Math.random().toString(36).slice(2),
            email,
            role: 'user' as const,
            createdAt: new Date().toISOString(),
          };
          MOCK_USERS.push({ ...newUser, password });
          set({ user: newUser });
        } finally {
          set({ loading: false });
        }
      },
      signOut: async () => {
        set({ user: null });
      },
      updateSubscription: async (type) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                subscription: {
                  type,
                  expiresAt: new Date(
                    Date.now() + (type === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000
                  ).toISOString(),
                },
              }
            : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);