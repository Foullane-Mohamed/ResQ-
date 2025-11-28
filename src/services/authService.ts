import api from './api';
import type { LoginFormValues } from '../lib/validations/authValidation';

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

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/login', credentials);

      localStorage.setItem('resq_token', response.data.accessToken);
      localStorage.setItem('resq_user', JSON.stringify(response.data.user));

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Email ou mot de passe incorrect');
    }
  }

  async register(userData: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/register', {
        ...userData,
        role: userData.role || 'DISPATCHER'
      });

      localStorage.setItem('resq_token', response.data.accessToken);
      localStorage.setItem('resq_user', JSON.stringify(response.data.user));

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du compte');
    }
  }
  async logout(): Promise<void> {
    localStorage.removeItem('resq_user');
    localStorage.removeItem('resq_token');
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('resq_token');
    const userStr = localStorage.getItem('resq_user');

    if (!token || !userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();

export const loginUser = async (data: LoginFormValues) => {
  return authService.login(data);
};