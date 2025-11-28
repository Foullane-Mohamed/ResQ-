import { authService, type LoginCredentials, type RegisterCredentials } from '@/services/authService';
import api from '@/services/api';
import { mockApiResponse } from '@/test/utils';

// Mock the api module
jest.mock('@/services/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    const loginCredentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    it('should login successfully and store token', async () => {
      const mockResponse = {
        accessToken: 'mock-token',
        user: {
          id: 1,
          name: 'John Doe',
          email: 'test@example.com',
          role: 'ADMIN' as const
        }
      };

      mockedApi.post.mockResolvedValueOnce(mockApiResponse(mockResponse));

      const result = await authService.login(loginCredentials);

      expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', loginCredentials);
      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('mock-token');
    });

    it('should throw error on failed login', async () => {
      const errorMessage = 'Invalid credentials';
      mockedApi.post.mockRejectedValueOnce(new Error(errorMessage));

      await expect(authService.login(loginCredentials)).rejects.toThrow(errorMessage);
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('register', () => {
    const registerCredentials: RegisterCredentials = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
      role: 'REGULATEUR'
    };

    it('should register successfully', async () => {
      const mockResponse = {
        accessToken: 'mock-token',
        user: {
          id: 2,
          name: 'New User',
          email: 'newuser@example.com',
          role: 'REGULATEUR' as const
        }
      };

      mockedApi.post.mockResolvedValueOnce(mockApiResponse(mockResponse));

      const result = await authService.register(registerCredentials);

      expect(mockedApi.post).toHaveBeenCalledWith('/auth/register', registerCredentials);
      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('mock-token');
    });

    it('should throw error on failed registration', async () => {
      const errorMessage = 'Email already exists';
      mockedApi.post.mockRejectedValueOnce(new Error(errorMessage));

      await expect(authService.register(registerCredentials)).rejects.toThrow(errorMessage);
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear token from localStorage', () => {
      localStorage.setItem('token', 'mock-token');

      authService.logout();

      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when token exists', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'test@example.com',
        role: 'ADMIN' as const
      };

      localStorage.setItem('token', 'mock-token');
      mockedApi.get.mockResolvedValueOnce(mockApiResponse(mockUser));

      const result = await authService.getCurrentUser();

      expect(mockedApi.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser);
    });

    it('should throw error when no token exists', async () => {
      await expect(authService.getCurrentUser()).rejects.toThrow('No authentication token found');
    });

    it('should throw error on API failure', async () => {
      localStorage.setItem('token', 'invalid-token');
      mockedApi.get.mockRejectedValueOnce(new Error('Unauthorized'));

      await expect(authService.getCurrentUser()).rejects.toThrow('Unauthorized');
    });
  });

  describe('getStoredToken', () => {
    it('should return stored token', () => {
      localStorage.setItem('token', 'stored-token');

      const token = authService.getStoredToken();

      expect(token).toBe('stored-token');
    });

    it('should return null when no token stored', () => {
      const token = authService.getStoredToken();

      expect(token).toBeNull();
    });
  });
});
