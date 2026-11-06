import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Piles from './Piles';

// Mock useLang before imports
vi.mock('../hooks/useLang', () => ({
  useLang: () => ({ t: (k) => k, lang: 'fr' })
}));

// Mock window.matchMedia
vi.stubGlobal('matchMedia', () => ({
  matches: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
}));

// Mock MutationObserver
vi.stubGlobal('MutationObserver', class {
  constructor() {}
  observe() {}
  disconnect() {}
});

describe('Piles component', () => {
  const mockPiles = {
    pro: [0, 1],
    sco: [2, 3],
    perso: [4, 5],
  };

  const mockDiscard = [];
  const mockOnDraw = vi.fn();
  const mockOnDiscardFromDeck = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <Piles 
        piles={mockPiles} 
        discard={mockDiscard}
        onDraw={mockOnDraw}
        onDiscardFromDeck={mockOnDiscardFromDeck}
      />
    );
    expect(screen.getByTestId('piles')).toBeInTheDocument();
  });

  it('renders project pile', () => {
    render(
      <Piles 
        piles={mockPiles} 
        discard={mockDiscard}
        onDraw={mockOnDraw}
        onDiscardFromDeck={mockOnDiscardFromDeck}
      />
    );
    expect(screen.getByTestId('pile-pro')).toBeInTheDocument();
  });

  it('renders school pile', () => {
    render(
      <Piles 
        piles={mockPiles} 
        discard={mockDiscard}
        onDraw={mockOnDraw}
        onDiscardFromDeck={mockOnDiscardFromDeck}
      />
    );
    expect(screen.getByTestId('pile-sco')).toBeInTheDocument();
  });

  it('renders perso pile', () => {
    render(
      <Piles 
        piles={mockPiles} 
        discard={mockDiscard}
        onDraw={mockOnDraw}
        onDiscardFromDeck={mockOnDiscardFromDeck}
      />
    );
    expect(screen.getByTestId('pile-perso')).toBeInTheDocument();
  });

  it('does not render empty project pile', () => {
    const emptyPiles = { pro: [], sco: [], perso: [] };
    render(
      <Piles 
        piles={emptyPiles} 
        discard={mockDiscard}
        onDraw={mockOnDraw}
        onDiscardFromDeck={mockOnDiscardFromDeck}
      />
    );
    expect(screen.queryByTestId('pile-pro')).not.toBeInTheDocument();
  });

  it('renders discard pile', () => {
    render(
      <Piles 
        piles={mockPiles} 
        discard={[0, 1]} 
        onDraw={mockOnDraw}
        onDiscardFromDeck={mockOnDiscardFromDeck}
      />
    );
    expect(screen.getByTestId('pile-disc')).toBeInTheDocument();
  });

  it('renders project pile with correct data-k', () => {
    render(
      <Piles 
        piles={mockPiles} 
        discard={mockDiscard}
        onDraw={mockOnDraw}
        onDiscardFromDeck={mockOnDiscardFromDeck}
      />
    );
    const proPile = screen.getByTestId('pile-pro');
    expect(proPile).toHaveAttribute('data-k', 'pro');
  });

  it('calls onDraw when pile is clicked', () => {
    render(
      <Piles 
        piles={mockPiles} 
        discard={mockDiscard}
        onDraw={mockOnDraw}
        onDiscardFromDeck={mockOnDiscardFromDeck}
      />
    );
    const proPile = screen.getByTestId('pile-pro');
    fireEvent.click(proPile);
    expect(mockOnDraw).toHaveBeenCalledWith('pro');
  });

  it('cleans up on unmount', () => {
    const { unmount } = render(
      <Piles 
        piles={mockPiles} 
        discard={mockDiscard}
        onDraw={mockOnDraw}
        onDiscardFromDeck={mockOnDiscardFromDeck}
      />
    );
    vi.advanceTimersByTime(100);
    unmount();
    const activeTimers = vi.getTimerCount();
    expect(activeTimers).toBe(0);
  });
});
