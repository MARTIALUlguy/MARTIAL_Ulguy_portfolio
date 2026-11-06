import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Profile from './Profile';

// Mock des hooks
vi.mock('../hooks/useLang', () => ({
  useLang: () => ({
    lang: 'fr',
    t: (key) => key,
    setLang: vi.fn(),
    toggleLang: vi.fn()
  })
}));

vi.mock('../hooks/useProgress', () => ({
  useProgress: () => ({
    updateSeen: vi.fn()
  })
}));

describe('Profile component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Profile onTabChange={() => {}} />);
    expect(screen.getByText(/Cycle ingénieur · EFREI/i)).toBeInTheDocument();
  });

  it('renders hero section with title', () => {
    render(<Profile onTabChange={() => {}} />);
    expect(screen.getByText('Ulguy')).toBeInTheDocument();
    expect(screen.getByText('Martial')).toBeInTheDocument();
  });

  it('renders role typing animation container', () => {
    render(<Profile onTabChange={() => {}} />);
    expect(screen.getByText('>')).toBeInTheDocument();
  });

  it('renders bio text', () => {
    render(<Profile onTabChange={() => {}} />);
    expect(screen.getByText(/Étudiant en cycle ingénieur/i)).toBeInTheDocument();
  });

  it('renders buttons', () => {
    render(<Profile onTabChange={() => {}} />);
    expect(screen.getByText('Me contacter')).toBeInTheDocument();
    expect(screen.getByText('Voir mes projets')).toBeInTheDocument();
  });

  it('renders quote', () => {
    render(<Profile onTabChange={() => {}} />);
    // La citation contient des guillemets français - vérifier une partie
    expect(screen.getByText(/Prendre le temps/)).toBeInTheDocument();
  });

  it('renders photo container', () => {
    render(<Profile onTabChange={() => {}} />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'Départ');
  });

  it('renders gauges', () => {
    render(<Profile onTabChange={() => {}} />);
    expect(screen.getByText('Adaptabilité')).toBeInTheDocument();
    expect(screen.getByText('Implication')).toBeInTheDocument();
    expect(screen.getByText('Sang-froid')).toBeInTheDocument();
  });

  it('renders timeline', () => {
    render(<Profile onTabChange={() => {}} />);
    expect(screen.getByText('2026 →')).toBeInTheDocument();
    expect(screen.getByText('Cycle ingénieur EFREI, Villejuif')).toBeInTheDocument();
  });

  it('renders chessboard', () => {
    render(<Profile onTabChange={() => {}} />);
    // Utiliser getAllByText avec findAllByText pour éviter les problèmes
    const chessPieces = screen.getAllByText(/♜|♞|♝|♛|♚/);
    expect(chessPieces.length).toBeGreaterThan(0);
  });
});
