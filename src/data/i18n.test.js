import { describe, it, expect } from 'vitest';
import { i18n, verifyI18n } from './i18n';

describe('i18n translations', () => {
  it('toutes les clés FR existent en EN', () => {
    const { missingInEn } = verifyI18n();
    expect(missingInEn).toHaveLength(0);
  });

  it('toutes les clés EN existent en FR', () => {
    const { missingInFr } = verifyI18n();
    expect(missingInFr).toHaveLength(0);
  });

  it('les textes des jauges sont présents', () => {
    expect(i18n.fr['Adaptabilité']).toBe('Adaptabilité');
    expect(i18n.en['Adaptabilité']).toBe('Adaptability');
    expect(i18n.fr['Implication']).toBe('Implication');
    expect(i18n.en['Implication']).toBe('Commitment');
    expect(i18n.fr['Sang-froid']).toBe('Sang-froid');
    expect(i18n.en['Sang-froid']).toBe('Composure');
  });

  it('les textes de contact sont présents', () => {
    expect(i18n.fr['On s’écrit ?']).toBe('On s’écrit ?');
    expect(i18n.en['On s’écrit ?']).toBe('Get in touch');
    expect(i18n.fr['Disponible pour un contrat d’apprentissage en développement.']).toBeDefined();
    expect(i18n.en['Disponible pour un contrat d’apprentissage en développement.']).toBeDefined();
  });

  it('les textes des compétences sont présents', () => {
    expect(i18n.fr['Front']).toBe('Front');
    expect(i18n.en['Front']).toBe('Front-end');
    expect(i18n.fr['Back et données']).toBe('Back et données');
    expect(i18n.en['Back et données']).toBe('Back-end and data');
    expect(i18n.fr['Outils et méthodes']).toBe('Outils et méthodes');
    expect(i18n.en['Outils et méthodes']).toBe('Tools and methods');
  });
});
