import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import DetailDialog from './DetailDialog';
import { P } from '../data/projects';

// Mock useLang
vi.mock('../hooks/useLang', () => ({
  useLang: () => ({ t: (k) => k, lang: 'fr' })
}));

// Mock HTMLDialogElement.showModal
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('HTMLDialogElement', class {
    showModal = vi.fn();
    close = vi.fn();
    focus = vi.fn();
  });
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('DetailDialog component', () => {
  const mockOnClose = vi.fn();
  const mockOnDiscard = vi.fn();
  const mockFocusRef = { current: { focus: vi.fn() } };

  it('renders without crashing', () => {
    render(
      <DetailDialog 
        projectIndex={0} 
        onClose={mockOnClose} 
        onDiscard={mockOnDiscard} 
        focusRef={mockFocusRef}
      />
    );
    expect(screen.getByText(P[0].t)).toBeInTheDocument();
  });

  it('renders project monogram', () => {
    render(
      <DetailDialog 
        projectIndex={0} 
        onClose={mockOnClose} 
        onDiscard={mockOnDiscard} 
        focusRef={mockFocusRef}
      />
    );
    expect(screen.getByText(P[0].m)).toBeInTheDocument();
  });

  it('renders project summary', () => {
    render(
      <DetailDialog 
        projectIndex={0} 
        onClose={mockOnClose} 
        onDiscard={mockOnDiscard} 
        focusRef={mockFocusRef}
      />
    );
    expect(screen.getByText(P[0].s[0])).toBeInTheDocument();
  });

  it('renders project tags', () => {
    render(
      <DetailDialog 
        projectIndex={0} 
        onClose={mockOnClose} 
        onDiscard={mockOnDiscard} 
        focusRef={mockFocusRef}
      />
    );
    P[0].k.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('renders close button', () => {
    render(
      <DetailDialog 
        projectIndex={0} 
        onClose={mockOnClose} 
        onDiscard={mockOnDiscard} 
        focusRef={mockFocusRef}
      />
    );
    expect(screen.getByLabelText('Fermer')).toBeInTheDocument();
  });

  it('renders Discard button', () => {
    render(
      <DetailDialog 
        projectIndex={0} 
        onClose={mockOnClose} 
        onDiscard={mockOnDiscard} 
        focusRef={mockFocusRef}
      />
    );
    expect(screen.getByText('Défausser la carte')).toBeInTheDocument();
  });

  it('renders disabled buttons for category 2 projects', () => {
    render(
      <DetailDialog 
        projectIndex={5} 
        onClose={mockOnClose} 
        onDiscard={mockOnDiscard} 
        focusRef={mockFocusRef}
      />
    );
    expect(screen.getByText('Voir en ligne')).toBeInTheDocument();
    expect(screen.getByText('Code')).toBeInTheDocument();
    // Check that buttons are disabled
    const liveButton = screen.getByText('Voir en ligne').closest('button');
    const codeButton = screen.getByText('Code').closest('button');
    expect(liveButton).toBeDisabled();
    expect(codeButton).toBeDisabled();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <DetailDialog 
        projectIndex={0} 
        onClose={mockOnClose} 
        onDiscard={mockOnDiscard} 
        focusRef={mockFocusRef}
      />
    );
    fireEvent.click(screen.getByLabelText('Fermer'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onDiscard when Discard button is clicked', () => {
    render(
      <DetailDialog 
        projectIndex={0} 
        onClose={mockOnClose} 
        onDiscard={mockOnDiscard} 
        focusRef={mockFocusRef}
      />
    );
    fireEvent.click(screen.getByText('Défausser la carte'));
    // onDiscard is called after a small delay
    vi.advanceTimersByTime(50);
    expect(mockOnDiscard).toHaveBeenCalledWith(0);
  });

  it('does not render when projectIndex is null', () => {
    const { container } = render(
      <DetailDialog 
        projectIndex={null} 
        onClose={mockOnClose} 
        onDiscard={mockOnDiscard} 
        focusRef={mockFocusRef}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
