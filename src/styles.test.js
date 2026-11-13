import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createElement } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, screen } from '@testing-library/react';
import { renderWithProviders } from './test/renderWithProviders';
import Door from './components/Door';
import Profile from './components/Profile';

const styles = readFileSync(resolve(process.cwd(), 'src/styles.css'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '');
const rules = [...styles.matchAll(/([^{}]+)\{([^{}]*)\}/g)];

function getLastRule(selector) {
  const declarations = rules
    .filter(([ , ruleSelector]) => ruleSelector.split(',').some(part => part.trim() === selector))
    .map(([ , , block]) => block);
  return declarations.at(-1) ?? '';
}

afterEach(cleanup);

describe('CSS regression guards', () => {
  it.each(['.oc', '.lu', '.br', '.an', '.gd', '.vt'])(
    '%s defines a card background',
    selector => {
      expect(getLastRule(selector)).toMatch(/\bbackground\s*:/);
    }
  );

  it('keeps the background bands unmasked', () => {
    const bg2Rules = rules
      .filter(([ , ruleSelector]) => ruleSelector.trim() === '.bg2')
      .map(([ , , block]) => block)
      .join('\n');
    expect(bg2Rules).not.toMatch(/-webkit-mask-image\s*:|(?<!webkit-)mask-image\s*:/);
  });

  it('hides the reverse side of pile cards by default', () => {
    expect(getLastRule('.pc span')).toMatch(/backface-visibility\s*:/);
  });

  it('sizes the main heading responsively', () => {
    expect(getLastRule('h1')).toMatch(/clamp\s*\(/);
  });

  it.each(['.btn', '.logo'])('%s declares its font', selector => {
    expect(getLastRule(selector)).toMatch(/(?:^|;)\s*font(?:-family)?\s*:/);
  });

  it('fills skill gauges from their configured width', () => {
    expect(getLastRule('.st b')).toMatch(
      /width\s*:\s*var\(\s*--w\s*\)|animation\s*:[^;]*fillg/
    );
  });

  it('renders descriptive alt text for Door and Profile portraits', () => {
    const doorView = renderWithProviders(createElement(Door, {
      onIntroEnd: () => {},
      firstVisit: true
    }));
    const doorAlt = screen.getByRole('img').getAttribute('alt');
    expect(doorAlt).toBeTruthy();
    expect(doorAlt).not.toBe('Départ');
    doorView.unmount();

    renderWithProviders(createElement(Profile, { onTabChange: () => {} }));
    const profileAlt = screen.getByRole('img').getAttribute('alt');
    expect(profileAlt).toBeTruthy();
    expect(profileAlt).not.toBe('Départ');
  });
});
