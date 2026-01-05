export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  authProvider: 'google' | 'facebook';
  createdAt: Date;
  lastLogin: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
