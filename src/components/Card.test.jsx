import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Card from './Card';
import { P } from '../data/projects';

// Mock useLang before imports
vi.mock('../hooks/useLang', () => ({
  useLang: () => ({ t: (k) => k, lang: 'fr' })
}));

describe('Card component', () => {
  const mockOnClick = vi.fn();
  const mockOnDiscard = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders card with title from project', () => {
    render(
      <Card 
        projectIndex={0} 
        index={0}
        isActive={false}
        onClick={mockOnClick}
        onDiscard={mockOnDiscard}
      />
    );
    expect(screen.getByText(P[0].t)).toBeInTheDocument();
  });

  it('renders card with monogram from project', () => {
    render(
      <Card 
        projectIndex={0} 
        index={0}
        isActive={false}
        onClick={mockOnClick}
        onDiscard={mockOnDiscard}
      />
    );
    expect(screen.getByText(P[0].m)).toBeInTheDocument();
  });

  it('renders card with summary from project', () => {
    render(
      <Card 
        projectIndex={0} 
        index={0}
        isActive={false}
        onClick={mockOnClick}
        onDiscard={mockOnDiscard}
      />
    );
    expect(screen.getByText(P[0].s[0])).toBeInTheDocument();
  });

  it('renders category from project', () => {
    render(
      <Card 
        projectIndex={0} 
        index={0}
        isActive={false}
        onClick={mockOnClick}
        onDiscard={mockOnDiscard}
      />
    );
    expect(screen.getByText('Stage')).toBeInTheDocument();
  });

  it('renders tags from project', () => {
    render(
      <Card 
        projectIndex={0} 
        index={0}
        isActive={false}
        onClick={mockOnClick}
        onDiscard={mockOnDiscard}
      />
    );
    P[0].k.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('applies correct theme class from project', () => {
    render(
      <Card 
        projectIndex={0} 
        index={0}
        isActive={false}
        onClick={mockOnClick}
        onDiscard={mockOnDiscard}
      />
    );
    const cardElement = screen.getByRole('button', { name: P[0].t });
    expect(cardElement).toHaveClass(P[0].c);
  });

  it('renders with correct z-index based on positionOffset', () => {
    render(
      <Card 
        projectIndex={0} 
        index={2}
        positionOffset={2}
        isActive={false}
        onClick={mockOnClick}
        onDiscard={mockOnDiscard}
      />
    );
    const cardElement = screen.getByRole('button', { name: P[0].t });
    // zIndex is calculated as 10 - a where a = Math.abs(positionOffset)
    // With positionOffset=2, a=2, so zIndex = 10 - 2 = 8
    expect(cardElement).toHaveStyle('z-index: 8');
  });

  it('calls onClick when clicked', () => {
    render(
      <Card 
        projectIndex={0} 
        index={0}
        isActive={false}
        onClick={mockOnClick}
        onDiscard={mockOnDiscard}
      />
    );
    const cardElement = screen.getByRole('button', { name: P[0].t });
    fireEvent.click(cardElement);
    expect(mockOnClick).toHaveBeenCalledWith(0, expect.any(Object));
  });

  it('renders discard button when active', () => {
    render(
      <Card 
        projectIndex={0} 
        index={0}
        isActive={true}
        onClick={mockOnClick}
        onDiscard={mockOnDiscard}
      />
    );
    expect(screen.getByText('Défausser')).toBeInTheDocument();
  });

  it('does not render discard button when inactive', () => {
    render(
      <Card 
        projectIndex={0} 
        index={0}
        isActive={false}
        onClick={mockOnClick}
        onDiscard={mockOnDiscard}
      />
    );
    expect(screen.queryByText('Défausser')).not.toBeInTheDocument();
  });

  it('calls onDiscard when discard button clicked', () => {
    render(
      <Card 
        projectIndex={0} 
        index={0}
        isActive={true}
        onClick={mockOnClick}
        onDiscard={mockOnDiscard}
      />
    );
    const discardButton = screen.getByText('Défausser');
    fireEvent.click(discardButton);
    expect(mockOnDiscard).toHaveBeenCalledWith(0);
  });
});
