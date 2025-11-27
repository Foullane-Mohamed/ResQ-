export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'REGULATEUR' | 'CHEF_DE_PARC';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  role?: 'ADMIN' | 'REGULATEUR' | 'CHEF_DE_PARC';
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
