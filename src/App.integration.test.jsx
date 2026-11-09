import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { renderWithProviders } from './test/renderWithProviders';

const restoreProperties = [];

function setWindowProperty(name, value) {
  const descriptor = Object.getOwnPropertyDescriptor(window, name);
  Object.defineProperty(window, name, {
    configurable: true,
    writable: true,
    value
  });
  restoreProperties.push(() => {
    if (descriptor) {
      Object.defineProperty(window, name, descriptor);
    } else {
      delete window[name];
    }
  });
}

function renderPortfolio() {
  const view = renderWithProviders(<App />);
  act(() => vi.advanceTimersByTime(1100));
  return view;
}

function openProjects() {
  fireEvent.click(screen.getByRole('tab', { name: 'Projets & compétences' }));
}

function drawFrom(container, pileKey) {
  fireEvent.click(container.querySelector(`[data-testid="pile-${pileKey}"]`));
  act(() => vi.advanceTimersByTime(640));
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  document.body.classList.remove('calm');
  window.localStorage.clear();
  window.localStorage.setItem('um_seen', '1');
  window.AudioContext.instances.length = 0;
});

afterEach(() => {
  cleanup();
  document.body.classList.remove('calm');
  while (restoreProperties.length) {
    restoreProperties.pop()();
  }
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('portfolio integration', () => {
  it('switches Profile, Projects, FilterBar, Contact, and ticker between French and English', () => {
    const { container } = renderPortfolio();
    const profilePanel = container.querySelector('main > div');

    expect(profilePanel.textContent).toContain('Cycle ingénieur · EFREI · alternance 3 ans');
    fireEvent.click(container.querySelector('#lg'));
    expect(profilePanel.textContent).toContain('Engineering degree · EFREI · 3-year work-study');
    expect(container.querySelector('#contact h2').textContent).toBe('Get in touch');
    expect(container.querySelector('.tick').textContent).toContain('Seeking work-study');

    fireEvent.click(screen.getByRole('tab', { name: 'Projects & skills' }));
    expect(screen.getByRole('heading', { name: 'The project deck' })).toBeInTheDocument();
    expect(screen.getByText('Families')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Internships' })).toBeInTheDocument();

    fireEvent.click(container.querySelector('#lg'));
    expect(container.querySelector('.tick').textContent).toContain('Recherche alternance');
    expect(container.querySelector('#contact h2').textContent).toBe('On s’écrit ?');
    expect(container.querySelector('main > div').textContent).toContain('Cycle ingénieur · EFREI · alternance 3 ans');
    fireEvent.click(screen.getByRole('tab', { name: 'Projets & compétences' }));
    expect(screen.getByRole('heading', { name: 'Le deck de projets' })).toBeInTheDocument();
    expect(screen.getByText('Familles')).toBeInTheDocument();
  });

  it('stops Project sounds after the shared sound level is muted', () => {
    const createOscillator = vi.spyOn(window.AudioContext.prototype, 'createOscillator');
    const { container } = renderPortfolio();

    fireEvent.click(container.querySelector('#snd'));
    fireEvent.click(container.querySelector('#snd'));
    expect(container.querySelector('#snd')).toHaveTextContent('Son : coupé');
    expect(window.AudioContext.instances).toHaveLength(1);
    const oscillatorCountAfterMute = createOscillator.mock.calls.length;

    openProjects();
    fireEvent.click(screen.getByRole('button', { name: 'React' }));
    fireEvent.click(container.querySelector('.card.on'));

    expect(createOscillator).toHaveBeenCalledTimes(oscillatorCountAfterMute);
    expect(window.AudioContext.instances).toHaveLength(1);
  });

  it('lights the third HUD sector after drawing all six projects into the hand', () => {
    const { container } = renderPortfolio();
    openProjects();

    drawFrom(container, 'sco');
    drawFrom(container, 'sco');
    drawFrom(container, 'sco');
    drawFrom(container, 'perso');

    expect(container.querySelectorAll('.seg b')[2]).toHaveClass('on');
  });

  it('updates the rev lights after a scroll event', () => {
    setWindowProperty('scrollY', 0);
    setWindowProperty('innerHeight', 500);
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 1000
    });
    restoreProperties.push(() => {
      delete document.documentElement.scrollHeight;
    });

    const { container } = renderPortfolio();
    expect(container.querySelectorAll('.rev u.on')).toHaveLength(1);

    window.scrollY = 250;
    fireEvent.scroll(window);
    act(() => vi.advanceTimersByTime(16));

    expect(container.querySelectorAll('.rev u.on')).toHaveLength(6);
  });

  it('marks Contact seen through its observer and sets the all-sectors HUD state', () => {
    const observers = [];
    class TestIntersectionObserver {
      constructor(callback, options) {
        this.callback = callback;
        this.options = options;
        this.disconnected = false;
        observers.push(this);
      }

      observe(target) {
        this.target = target;
      }

      disconnect() {
        this.disconnected = true;
      }
    }
    setWindowProperty('IntersectionObserver', TestIntersectionObserver);

    const { container } = renderPortfolio();
    const observer = observers.find(item => item.target?.id === 'contact');
    expect(observer.options.threshold).toBe(0.6);
    openProjects();
    drawFrom(container, 'sco');
    drawFrom(container, 'sco');
    drawFrom(container, 'sco');
    drawFrom(container, 'perso');

    act(() => observer.callback([{
      target: observer.target,
      isIntersecting: true,
      intersectionRatio: 0.59
    }]));
    expect(container.querySelectorAll('.seg b')[3]).not.toHaveClass('on');

    act(() => observer.callback([{
      target: observer.target,
      isIntersecting: true,
      intersectionRatio: 0.6
    }]));
    expect(container.querySelectorAll('.seg b')[3]).toHaveClass('on');
    expect(container.querySelector('.seg')).toHaveClass('all');
    expect(observer.disconnected).toBe(true);
  });

  it('completes two independent discard animations', () => {
    const { container } = renderPortfolio();
    openProjects();

    fireEvent.click(container.querySelector('.card[data-i="0"] .dx'));
    fireEvent.click(container.querySelector('.card[data-i="1"]'));
    fireEvent.click(container.querySelector('.card[data-i="1"] .dx'));

    expect(container.querySelector('.card[data-i="0"]')).toHaveClass('out');
    expect(container.querySelector('.card[data-i="1"]')).toHaveClass('out');
    act(() => vi.advanceTimersByTime(480));

    expect(container.querySelector('.card[data-i="0"]')).toBeNull();
    expect(container.querySelector('.card[data-i="1"]')).toBeNull();
    expect(container.querySelector('.nav .m').textContent).toBe('Main : 0/6');
  });

  it('preserves the hand, discard, and filter after switching tabs', () => {
    const { container } = renderPortfolio();
    openProjects();

    fireEvent.click(screen.getByRole('button', { name: 'React' }));
    const activeCard = container.querySelector('.card.on');
    fireEvent.click(activeCard.querySelector('.dx'));
    act(() => vi.advanceTimersByTime(480));

    const handBefore = container.querySelector('.nav .m').textContent;
    const discardBefore = container.querySelector('.pl[data-k="disc"] > .m').textContent;
    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('tab', { name: 'Profil' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Projets & compétences' }));

    expect(container.querySelector('.nav .m').textContent).toBe(handBefore);
    expect(container.querySelector('.pl[data-k="disc"] > .m').textContent).toBe(discardBefore);
    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('returns focus to the card that opened the dialog', () => {
    const { container } = renderPortfolio();
    openProjects();
    const card = container.querySelector('.card.on');

    fireEvent.click(card);
    fireEvent.click(container.querySelector('dialog .close'));

    expect(document.activeElement).toBe(card);
  });

  it('draws after 640ms and does not change state when the top card is Coming soon', () => {
    const { container } = renderPortfolio();
    openProjects();

    fireEvent.click(container.querySelector('[data-testid="pile-sco"]'));
    expect(container.querySelector('[data-testid="pile-sco"] .pc.top')).toHaveClass('fly');
    expect(container.querySelector('.nav .m').textContent).toBe('Main : 2/6');
    act(() => vi.advanceTimersByTime(639));
    expect(container.querySelector('.nav .m').textContent).toBe('Main : 2/6');
    act(() => vi.advanceTimersByTime(1));
    expect(container.querySelector('.nav .m').textContent).toBe('Main : 3/6');

    drawFrom(container, 'sco');
    drawFrom(container, 'sco');
    drawFrom(container, 'perso');
    expect(container.querySelector('.nav .m').textContent).toBe('Main : 6/6');

    fireEvent.click(container.querySelector('[data-testid="pile-sco"]'));
    expect(container.querySelector('[data-testid="pile-sco"] .pc.top')).toHaveClass('fl');
    fireEvent.click(container.querySelector('[data-testid="pile-sco"]'));
    act(() => vi.advanceTimersByTime(1899));
    expect(container.querySelector('.nav .m').textContent).toBe('Main : 6/6');
    expect(container.querySelector('[data-testid="pile-sco"] .pc.top')).toHaveClass('fl');
    act(() => vi.advanceTimersByTime(1));
    expect(container.querySelector('.nav .m').textContent).toBe('Main : 6/6');
    expect(container.querySelector('[data-testid="pile-sco"] .pc.top')).not.toHaveClass('fl');
  });
});
