export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  subscription?: {
    type: 'monthly' | 'annual' | null;
    expiresAt: string | null;
  };
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateSubscription: (type: 'monthly' | 'annual') => Promise<void>;
}