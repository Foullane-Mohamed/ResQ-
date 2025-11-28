import { configureStore } from '@reduxjs/toolkit';
import authSlice, { setCredentials, logout, setLoading } from '@/store/authSlice';
import type { AuthState } from '@/services/authService';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('authSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);

    store = configureStore({
      reducer: {
        auth: authSlice,
      },
    });
  });

  it('should have initial state', () => {
    const state = store.getState().auth;

    expect(state).toEqual({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('should load stored user and token from localStorage', () => {
    const storedUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'ADMIN' as const,
    };
    const storedToken = 'stored-token';

    mockLocalStorage.getItem.mockImplementation((key: string) => {
      if (key === 'resq_user') return JSON.stringify(storedUser);
      if (key === 'resq_token') return storedToken;
      return null;
    });

    const storeWithStoredData = configureStore({
      reducer: {
        auth: authSlice,
      },
    });

    const state = storeWithStoredData.getState().auth;

    expect(state.user).toEqual(storedUser);
    expect(state.token).toBe(storedToken);
    expect(state.isAuthenticated).toBe(true);
  });

  describe('setCredentials', () => {
    it('should set user credentials and update localStorage', () => {
      const authResponse = {
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'ADMIN' as const,
        },
        accessToken: 'new-token',
      };

      store.dispatch(setCredentials(authResponse));

      const state = store.getState().auth;
      expect(state.user).toEqual(authResponse.user);
      expect(state.token).toBe(authResponse.accessToken);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'resq_user',
        JSON.stringify(authResponse.user)
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'resq_token',
        authResponse.accessToken
      );
    });
  });

  describe('logout', () => {
    it('should clear user credentials and localStorage', () => {
      // First set some credentials
      const authResponse = {
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'ADMIN' as const,
        },
        accessToken: 'token',
      };
      store.dispatch(setCredentials(authResponse));

      // Then logout
      store.dispatch(logout());

      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('resq_user');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('resq_token');
    });
  });

  describe('setLoading', () => {
    it('should set loading state to true', () => {
      store.dispatch(setLoading(true));

      const state = store.getState().auth;
      expect(state.isLoading).toBe(true);
    });

    it('should set loading state to false', () => {
      // First set loading to true
      store.dispatch(setLoading(true));
      expect(store.getState().auth.isLoading).toBe(true);

      // Then set to false
      store.dispatch(setLoading(false));
      expect(store.getState().auth.isLoading).toBe(false);
    });
  });

  describe('state persistence', () => {
    it('should maintain state consistency across actions', () => {
      const authResponse = {
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'ADMIN' as const,
        },
        accessToken: 'token',
      };

      // Set credentials
      store.dispatch(setCredentials(authResponse));
      let state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(authResponse.user);

      // Set loading
      store.dispatch(setLoading(true));
      state = store.getState().auth;
      expect(state.isLoading).toBe(true);
      expect(state.isAuthenticated).toBe(true); // Should remain authenticated
      expect(state.user).toEqual(authResponse.user); // User should remain

      // Logout
      store.dispatch(logout());
      state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });
});
