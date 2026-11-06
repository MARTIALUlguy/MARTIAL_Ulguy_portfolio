import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Contact from './Contact';

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

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Contact component', () => {
  it('renders without crashing', () => {
    render(<Contact />);
    // Vérifier par le texte exact
    expect(screen.getByText('On s’écrit ?')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<Contact />);
    expect(screen.getByRole('heading', { name: 'On s’écrit ?' })).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<Contact />);
    expect(screen.getByText(/Disponible pour un contrat/i)).toBeInTheDocument();
  });

  it('renders email button', () => {
    render(<Contact />);
    const emailLink = screen.getByText('Email');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:ulguym@gmail.com');
  });

  it('renders LinkedIn button', () => {
    render(<Contact />);
    const linkedinLink = screen.getByText('LinkedIn');
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/ulguy-martial-550b06292/');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener');
  });

  it('renders GitHub button', () => {
    render(<Contact />);
    const githubLink = screen.getByText('GitHub');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/MARTIALUlguy');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener');
  });

  it('renders CV buttons as disabled', () => {
    render(<Contact />);
    const cvFr = screen.getByText('CV (FR) · PDF');
    const cvEn = screen.getByText('CV (EN) · PDF');
    
    expect(cvFr).toBeInTheDocument();
    expect(cvEn).toBeInTheDocument();
    
    // Les boutons CV sont des boutons avec aria-disabled
    const cvButtons = screen.getAllByText(/CV \(.*\) · PDF/);
    cvButtons.forEach(button => {
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  it('renders mockup note', () => {
    render(<Contact />);
    expect(screen.getByText(/Maquette : les deux CV/i)).toBeInTheDocument();
  });

  it('has correct id', () => {
    const { container } = render(<Contact />);
    expect(container.querySelector('#contact')).toBeInTheDocument();
  });
});
