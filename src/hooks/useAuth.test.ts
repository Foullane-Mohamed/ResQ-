import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import { renderWithProviders, createTestQueryClient, mockUser } from '@/test/utils';
import * as router from 'react-router-dom';

// Mock the authService
jest.mock('@/services/authService');
const mockAuthService = authService as jest.Mocked<typeof authService>;

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockReset();
  });

  const renderUseAuth = (initialState = {}) => {
    const queryClient = createTestQueryClient();

    return renderHook(() => useAuth(), {
      wrapper: ({ children }) =>
        renderWithProviders(<div>{ children } </div>, { 
          initialState,
          queryClient 
        }).container,
    });
  };

describe('login', () => {
  it('should login successfully and navigate to dashboard', async () => {
    const loginCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    const authResponse = {
      accessToken: 'mock-token',
      user: mockUser,
    };

    mockAuthService.login.mockResolvedValueOnce(authResponse);

    const { result } = renderUseAuth();

    expect(result.current.isLoginLoading).toBe(false);

    // Call login
    result.current.login(loginCredentials);

    // Should be loading
    expect(result.current.isLoginLoading).toBe(true);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isLoginLoading).toBe(false);
    });

    expect(mockAuthService.login).toHaveBeenCalledWith(loginCredentials);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should handle login error', async () => {
    const loginCredentials = {
      email: 'test@example.com',
      password: 'wrong-password',
    };

    const errorMessage = 'Invalid credentials';
    mockAuthService.login.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderUseAuth();

    result.current.login(loginCredentials);

    await waitFor(() => {
      expect(result.current.loginError).toBeTruthy();
    });

    expect(result.current.isLoginLoading).toBe(false);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe('register', () => {
  it('should register successfully and navigate to dashboard', async () => {
    const registerCredentials = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
      role: 'REGULATEUR' as const,
    };

    const authResponse = {
      accessToken: 'mock-token',
      user: { ...mockUser, email: 'newuser@example.com', name: 'New User' },
    };

    mockAuthService.register.mockResolvedValueOnce(authResponse);

    const { result } = renderUseAuth();

    result.current.register(registerCredentials);

    await waitFor(() => {
      expect(result.current.isRegisterLoading).toBe(false);
    });

    expect(mockAuthService.register).toHaveBeenCalledWith(registerCredentials);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should handle register error', async () => {
    const registerCredentials = {
      email: 'existing@example.com',
      password: 'password123',
      name: 'User',
      role: 'REGULATEUR' as const,
    };

    const errorMessage = 'Email already exists';
    mockAuthService.register.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderUseAuth();

    result.current.register(registerCredentials);

    await waitFor(() => {
      expect(result.current.registerError).toBeTruthy();
    });

    expect(result.current.isRegisterLoading).toBe(false);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe('logout', () => {
  it('should logout and navigate to login', async () => {
    const authenticatedState = {
      auth: {
        user: mockUser,
        token: 'mock-token',
        isAuthenticated: true,
        isLoading: false,
      },
    };

    const { result } = renderUseAuth(authenticatedState);

    expect(result.current.isAuthenticated).toBe(true);

    result.current.logout();

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/auth');
  });
});

describe('auth state', () => {
  it('should return correct auth state when not authenticated', () => {
    const { result } = renderUseAuth();

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoginLoading).toBe(false);
    expect(result.current.isRegisterLoading).toBe(false);
  });

  it('should return correct auth state when authenticated', () => {
    const authenticatedState = {
      auth: {
        user: mockUser,
        token: 'mock-token',
        isAuthenticated: true,
        isLoading: false,
      },
    };

    const { result } = renderUseAuth(authenticatedState);

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('mock-token');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle loading state', () => {
    const loadingState = {
      auth: {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
      },
    };

    const { result } = renderUseAuth(loadingState);

    expect(result.current.isAuthenticated).toBe(false);
  });
});

describe('error handling', () => {
  it('should expose login error', async () => {
    const loginCredentials = {
      email: 'test@example.com',
      password: 'wrong',
    };

    mockAuthService.login.mockRejectedValueOnce(new Error('Login failed'));

    const { result } = renderUseAuth();

    result.current.login(loginCredentials);

    await waitFor(() => {
      expect(result.current.loginError).toBeTruthy();
    });
  });

  it('should expose register error', async () => {
    const registerCredentials = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'REGULATEUR' as const,
    };

    mockAuthService.register.mockRejectedValueOnce(new Error('Register failed'));

    const { result } = renderUseAuth();

    result.current.register(registerCredentials);

    await waitFor(() => {
      expect(result.current.registerError).toBeTruthy();
    });
  });
});
});
