import '@testing-library/jest-dom';
import * as React from 'react';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock Leaflet for map components
jest.mock('leaflet', () => ({
  map: jest.fn(() => ({
    setView: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    remove: jest.fn(),
  })),
  tileLayer: jest.fn(() => ({
    addTo: jest.fn(),
  })),
  marker: jest.fn(() => ({
    addTo: jest.fn(),
    bindPopup: jest.fn(),
    setLatLng: jest.fn(),
    remove: jest.fn(),
  })),
  icon: jest.fn(),
}));

// Mock react-leaflet components
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'map-container' }, children),
  TileLayer: () =>
    React.createElement('div', { 'data-testid': 'tile-layer' }),
  Marker: ({ children }: { children?: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'marker' }, children),
  Popup: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'popup' }, children),
}));

// Location mocking will be handled in individual tests if needed

// Suppress console warnings in tests
const originalConsoleWarn = console.warn;
console.warn = (...args: any[]) => {
  if (
    args[0]?.includes?.('validateDOMNesting') ||
    args[0]?.includes?.('React Router Future Flag Warning')
  ) {
    return;
  }
  originalConsoleWarn.call(console, ...args);
};
