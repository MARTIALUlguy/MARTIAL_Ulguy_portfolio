import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders as render } from './test/renderWithProviders';
import App from './App';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

beforeEach(() => {
  vi.clearAllMocks();
  mockLocalStorage.clear();
  
  // Mock localStorage global
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
  });
});

describe('App component', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Vérifier que l'app est rendue
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders Background component', () => {
    render(<App />);
    // Background est un composant visuel
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders Footer with copyright text', () => {
    render(<App />);
    expect(screen.getByText((content, element) => {
      return content.includes('© 2026 Ulguy Martial');
    })).toBeInTheDocument();
  });
});
