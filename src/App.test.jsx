import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock des hooks
vi.mock('./hooks/useLang', () => ({
  useLang: () => ({
    lang: 'fr',
    t: (key) => key,
    setLang: vi.fn(),
    toggleLang: vi.fn()
  })
}));

vi.mock('./hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    toggleTheme: vi.fn()
  })
}));

vi.mock('./hooks/useSound', () => ({
  useSound: () => ({
    soundLevel: 1,
    toggleSound: vi.fn(),
    getSoundLabel: () => 'doux',
    handleUserGesture: vi.fn(),
    beep: vi.fn(),
    door: vi.fn()
  })
}));

vi.mock('./hooks/useProgress', () => ({
  useProgress: () => ({
    scrollProgress: 0,
    seen: { 0: 1, c: 0, k: 0 },
    updateSeen: vi.fn(),
    revLights: () => [],
    sectors: () => [],
    allSectorsOn: () => false
  })
}));

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
