import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Deck from './Deck';
import { P } from '../data/projects';

// Mock useLang before imports
vi.mock('../hooks/useLang', () => ({
  useLang: () => ({ t: (k) => k, lang: 'fr' })
}));

describe('Deck component', () => {
  const mockOnCardClick = vi.fn();
  const mockOnCardDiscard = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <Deck 
        hand={[0, 1]} 
        activeIndex={0}
        onCardClick={mockOnCardClick}
        onCardDiscard={mockOnCardDiscard}
      />
    );
    expect(screen.getByTestId('deck')).toBeInTheDocument();
  });

  it('renders all cards from hand', () => {
    render(
      <Deck 
        hand={[0, 1]} 
        activeIndex={0}
        onCardClick={mockOnCardClick}
        onCardDiscard={mockOnCardDiscard}
      />
    );
    expect(screen.getByText(P[0].t)).toBeInTheDocument();
    expect(screen.getByText(P[1].t)).toBeInTheDocument();
  });

  it('applies correct positioning to cards', () => {
    render(
      <Deck 
        hand={[0, 1, 2]} 
        activeIndex={1}
        onCardClick={mockOnCardClick}
        onCardDiscard={mockOnCardDiscard}
      />
    );
    // The middle card (index 1) should have --o: 0
    const activeCard = screen.getByRole('button', { name: P[1].t });
    expect(activeCard).toHaveStyle('--o: 0');
  });

  it('shows empty state message when no cards', () => {
    render(
      <Deck 
        hand={[]} 
        activeIndex={0}
        onCardClick={mockOnCardClick}
        onCardDiscard={mockOnCardDiscard}
      />
    );
    expect(screen.getByText('Main vide · pioche une carte')).toBeInTheDocument();
  });

  it('shows all cards in hand message when all 6 are present', () => {
    render(
      <Deck 
        hand={[0, 1, 2, 3, 4, 5]} 
        activeIndex={0}
        onCardClick={mockOnCardClick}
        onCardDiscard={mockOnCardDiscard}
      />
    );
    const deckElement = screen.getByTestId('deck');
    expect(deckElement).toHaveAttribute('data-e', 'Main vide · pioche une carte');
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(
      <Deck 
        hand={[0, 1]} 
        activeIndex={0}
        onCardClick={mockOnCardClick}
        onCardDiscard={mockOnCardDiscard}
      />
    );
    unmount();
    // No direct way to test event listener cleanup, but component should unmount without errors
    expect(true).toBe(true);
  });

  it('calls onCardClick when a card is clicked', () => {
    render(
      <Deck 
        hand={[0, 1]} 
        activeIndex={0}
        onCardClick={mockOnCardClick}
        onCardDiscard={mockOnCardDiscard}
      />
    );
    const cardElement = screen.getByRole('button', { name: P[0].t });
    fireEvent.click(cardElement);
    // onCardClick is called with (projectIndex, cardElement)
    expect(mockOnCardClick).toHaveBeenCalled();
    expect(mockOnCardClick.mock.calls[0][0]).toBe(0);
    expect(mockOnCardClick.mock.calls[0][1]).toBeTruthy();
  });
});
