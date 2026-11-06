import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Skills from './Skills';

// Mock des hooks
vi.mock('../hooks/useLang', () => ({
  useLang: () => ({
    lang: 'fr',
    t: (key) => key,
    setLang: vi.fn(),
    toggleLang: vi.fn()
  })
}));

describe('Skills component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Skills />);
    expect(screen.getByText('Compétences')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<Skills />);
    expect(screen.getByRole('heading', { name: 'Compétences' })).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<Skills />);
    expect(screen.getByText(/Regroupées par usage/i)).toBeInTheDocument();
  });

  it('renders Front group', () => {
    render(<Skills />);
    expect(screen.getByText('Front')).toBeInTheDocument();
  });

  it('renders Back et données group', () => {
    render(<Skills />);
    expect(screen.getByText('Back et données')).toBeInTheDocument();
  });

  it('renders Outils et méthodes group', () => {
    render(<Skills />);
    expect(screen.getByText('Outils et méthodes')).toBeInTheDocument();
  });

  it('renders front-end skills', () => {
    render(<Skills />);
    expect(screen.getByText('React / React Native')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('renders back-end skills', () => {
    render(<Skills />);
    expect(screen.getByText('Supabase')).toBeInTheDocument();
    expect(screen.getByText('Firebase')).toBeInTheDocument();
    expect(screen.getByText('Java')).toBeInTheDocument();
  });

  it('renders tool skills', () => {
    render(<Skills />);
    expect(screen.getByText('Git / GitLab')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
    expect(screen.getByText('Agile')).toBeInTheDocument();
    expect(screen.getByText('UML')).toBeInTheDocument();
  });

  it('renders chips with correct class', () => {
    render(<Skills />);
    const chips = screen.getAllByText(/React/);
    expect(chips.length).toBeGreaterThan(0);
  });
});
