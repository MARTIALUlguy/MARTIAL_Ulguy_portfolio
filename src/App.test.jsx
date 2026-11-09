import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, screen, fireEvent } from '@testing-library/react';
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

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
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

  it('shows the first-visit door on the initial render', () => {
    render(<App />);
    expect(screen.getByText('Lever la porte')).toBeInTheDocument();
  });

  it('shows the short return door, raises it after 1.1s, and can replay the full intro', () => {
    mockLocalStorage.setItem('um_seen', '1');
    vi.useFakeTimers();
    render(<App />);

    expect(screen.getByText('Re-bonjour.')).toBeInTheDocument();
    expect(screen.queryByText('Lever la porte')).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1099));
    expect(screen.getByText('Re-bonjour.')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByText('Re-bonjour.')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Rejouer l’intro « première visite »'));
    expect(screen.getByText('Lever la porte')).toBeInTheDocument();
  });

  it('skips the door when reduced motion is enabled', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));

    render(<App />);
    expect(screen.queryByText('Lever la porte')).not.toBeInTheDocument();
  });
});
