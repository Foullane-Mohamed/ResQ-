import api from '../../../services/api';
import type { LoginCredentials, AuthResponse, User, RegisterCredentials } from '../types';

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/login', credentials);

      // Store auth data
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
        role: userData.role || 'DISPATCHER' // Default role
      });

      // Store auth data
      localStorage.setItem('resq_token', response.data.accessToken);
      localStorage.setItem('resq_user', JSON.stringify(response.data.user));

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du compte');
    }
  }

  async logout(): Promise<void> {
    // Clear any server-side sessions if needed
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
