import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureStore } from '@reduxjs/toolkit';

import authSlice from '@/store/authSlice';
import filterSlice from '@/store/filterSlice';

// Mock store setup
export const createMockStore = (initialState: any = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice,
      filter: filterSlice,
    },
    preloadedState: initialState,
  });
};

// Test wrapper component
interface TestWrapperProps {
  children: ReactNode;
  initialState?: any;
  queryClient?: QueryClient;
}

const TestWrapper = ({ 
  children, 
  initialState = {}, 
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}: TestWrapperProps) => {
  const store = createMockStore(initialState);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

// Custom render function
export const renderWithProviders = (
  ui: ReactElement,
  options: RenderOptions & {
    initialState?: any;
    queryClient?: QueryClient;
  } = {}
) => {
  const { initialState, queryClient, ...renderOptions } = options;

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <TestWrapper initialState={initialState} queryClient={queryClient}>
      {children}
    </TestWrapper>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock user for tests
export const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'ADMIN' as const,
};

// Mock authenticated state
export const mockAuthenticatedState = {
  auth: {
    user: mockUser,
    token: 'mock-token',
    isAuthenticated: true,
    isLoading: false,
  },
};

// Mock incidents
export const mockIncidents = [
  {
    id: 1,
    type: 'Accident de la route',
    severity: 'HIGH' as const,
    lat: 48.8566,
    lng: 2.3522,
    status: 'PENDING' as const,
    address: '123 Rue de la Paix, Paris',
    createdAt: '2023-11-28T10:00:00Z',
  },
  {
    id: 2,
    type: 'Malaise cardiaque',
    severity: 'CRITICAL' as const,
    lat: 48.8606,
    lng: 2.3376,
    status: 'IN_PROGRESS' as const,
    address: '456 Avenue des Champs-Élysées, Paris',
    assignedAmbulanceId: 1,
    createdAt: '2023-11-28T09:30:00Z',
  },
];

// Mock ambulances
export const mockAmbulances = [
  {
    id: 1,
    name: 'AMB-001',
    status: 'BUSY' as const,
    lat: 48.8566,
    lng: 2.3522,
    type: 'Type A',
    crew: ['Dr. Smith', 'Nurse Jane'],
  },
  {
    id: 2,
    name: 'AMB-002',
    status: 'AVAILABLE' as const,
    lat: 48.8606,
    lng: 2.3376,
    type: 'Type B',
    crew: ['Dr. Brown', 'Paramedic Mike'],
  },
];

// Mock API responses
export const mockApiResponse = <T>(data: T) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
});

// Create a clean query client for each test
export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
  logger: {
    log: () => {},
    warn: () => {},
    error: () => {},
  },
});

export * from '@testing-library/react';
export { renderWithProviders as render };
