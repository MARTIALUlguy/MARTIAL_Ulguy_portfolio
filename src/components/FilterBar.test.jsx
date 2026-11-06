import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import FilterBar from './FilterBar';

// Mock useLang
vi.mock('../hooks/useLang', () => ({
  useLang: () => ({ t: (k) => k, lang: 'fr' })
}));

// Mock useSound
vi.mock('../hooks/useSound', () => ({
  useSound: () => ({ beep: vi.fn() })
}));

describe('FilterBar component', () => {
  const mockOnDeal = vi.fn();
  const mockOnReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without crashing', () => {
    render(<FilterBar filter={null} onDeal={mockOnDeal} onReset={mockOnReset} />);
    expect(screen.getByText('Familles')).toBeInTheDocument();
  });

  it('renders family filter buttons', () => {
    render(<FilterBar filter={null} onDeal={mockOnDeal} onReset={mockOnReset} />);
    expect(screen.getByText('Stages')).toBeInTheDocument();
    expect(screen.getByText('Scolaires')).toBeInTheDocument();
    expect(screen.getByText('Perso')).toBeInTheDocument();
    expect(screen.getByText('Tous')).toBeInTheDocument();
  });

  it('renders skill filter buttons', () => {
    render(<FilterBar filter={null} onDeal={mockOnDeal} onReset={mockOnReset} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Supabase')).toBeInTheDocument();
    expect(screen.getByText('Java')).toBeInTheDocument();
    expect(screen.getByText('Firebase')).toBeInTheDocument();
    expect(screen.getByText('Godot')).toBeInTheDocument();
    expect(screen.getByText('SQL')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('IA')).toBeInTheDocument();
  });

  it('does not render Reset button when no filter is active', () => {
    render(<FilterBar filter={null} onDeal={mockOnDeal} onReset={mockOnReset} />);
    expect(screen.queryByText('Réinitialiser')).not.toBeInTheDocument();
  });

  it('renders Reset button when a filter is active', () => {
    render(<FilterBar filter="test" onDeal={mockOnDeal} onReset={mockOnReset} />);
    expect(screen.getByText('Réinitialiser')).toBeInTheDocument();
  });

  it('calls onDeal when a family filter is clicked', () => {
    render(<FilterBar filter={null} onDeal={mockOnDeal} onReset={mockOnReset} />);
    fireEvent.click(screen.getByText('Stages'));
    expect(mockOnDeal).toHaveBeenCalled();
  });

  it('calls onDeal when a skill filter is clicked', () => {
    render(<FilterBar filter={null} onDeal={mockOnDeal} onReset={mockOnReset} />);
    fireEvent.click(screen.getByText('React'));
    expect(mockOnDeal).toHaveBeenCalled();
  });

  it('calls onReset when Reset button is clicked', () => {
    render(<FilterBar filter="test" onDeal={mockOnDeal} onReset={mockOnReset} />);
    fireEvent.click(screen.getByText('Réinitialiser'));
    expect(mockOnReset).toHaveBeenCalled();
  });

  it('calls onReset when active filter is clicked again', () => {
    render(<FilterBar filter="Stages" onDeal={mockOnDeal} onReset={mockOnReset} />);
    fireEvent.click(screen.getByText('Stages'));
    expect(mockOnReset).toHaveBeenCalled();
    expect(mockOnDeal).not.toHaveBeenCalled();
  });
});
