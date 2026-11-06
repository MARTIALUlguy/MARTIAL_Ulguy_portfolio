import { describe, it, expect } from 'vitest';
import { cardsReducer, initialState, ACTIONS, draw, discard, reset, deal, next, prev, select } from './cards';
import { P, FAM } from '../data/projects';

// Helper pour comparer les tableaux (order matters for hand, order doesn't matter for discard)
const sameArray = (a, b) => {
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
};

// Helper pour comparer les objets profondément
const sameState = (state, expected) => {
  return (
    sameArray(state.hand, expected.hand) &&
    sameArray(state.discard, expected.discard) &&
    state.active === expected.active &&
    state.filter === expected.filter &&
    sameArray(state.piles.pro, expected.piles?.pro || []) &&
    sameArray(state.piles.sco, expected.piles?.sco || []) &&
    sameArray(state.piles.perso, expected.piles?.perso || [])
  );
};

describe('cardsReducer', () => {
  describe('1. État initial et départ', () => {
    it('départ : main = stages', () => {
      const state = cardsReducer(initialState, {});
      expect(sameArray(state.hand, [0, 1])).toBe(true);
      expect(sameArray(state.piles.sco, [2, 3, 4, 'soon'])).toBe(true);
      expect(state.discard.length).toBe(0);
      expect(state.filter).toBe(null);
    });
  });

  describe('2. Filtre React → Open Cowork + AudioNote', () => {
    it('filtre React → main [0,5] avec pro=[1], perso=["soon"]', () => {
      const predicate = p => p.k.some(k => k.includes('React'));
      const state = cardsReducer(initialState, deal('sReact', predicate));
      
      expect(sameArray(state.hand, [0, 5])).toBe(true);
      expect(sameArray(state.piles.pro, [1])).toBe(true);
      expect(sameArray(state.piles.perso, ['soon'])).toBe(true);
      expect(state.filter).toBe('sReact');
    });
  });

  describe('3. Famille Scolaires', () => {
    it('famille Scolaires → 3 cartes, stages dans la pioche Stages', () => {
      const state1 = cardsReducer(initialState, deal('f1', p => p.cat === 1));
      
      expect(sameArray(state1.hand, [2, 3, 4])).toBe(true);
      expect(sameArray(state1.piles.pro, [0, 1])).toBe(true);
    });
  });

  describe('4. Reset', () => {
    it('reset → état initial', () => {
      const predicate = p => p.k.some(k => k.includes('React'));
      const state1 = cardsReducer(initialState, deal('sReact', predicate));
      const state2 = cardsReducer(state1, reset());
      
      expect(sameState(state2, initialState)).toBe(true);
    });
  });

  describe('5. Pioche scolaire → main [0,1,2] et active=2', () => {
    it('pioche scolaire → main [0,1,2] et active=2', () => {
      const state1 = cardsReducer(initialState, deal('f1', p => p.cat === 1));
      const state2 = cardsReducer(state1, draw('sco'));
      
      expect(sameArray(state2.hand, [2, 3, 4, 2])).toBe(false); // Attendons, il faut d'abord revenir à l'état initial
      // Reprenons le test correctement
      const stateReset = cardsReducer(state1, reset());
      const stateDraw = cardsReducer(stateReset, draw('sco'));
      
      expect(sameArray(stateDraw.hand, [0, 1, 2])).toBe(true);
      expect(stateDraw.active).toBe(2);
      expect(sameArray(stateDraw.piles.sco, [3, 4, 'soon'])).toBe(true);
    });
  });

  describe('6. Défausse de Lunio', () => {
    it('défausse de Lunio (index 1)', () => {
      const state1 = cardsReducer(initialState, deal('f1', p => p.cat === 1));
      const stateReset = cardsReducer(state1, reset());
      const stateDraw = cardsReducer(stateReset, draw('sco'));
      const stateDiscard = cardsReducer(stateDraw, discard(1));
      
      expect(sameArray(stateDiscard.hand, [0, 2])).toBe(true);
      expect(sameArray(stateDiscard.discard, [1])).toBe(true);
    });
  });

  describe('7. Reprise depuis la défausse', () => {
    it('reprise depuis la défausse', () => {
      const state1 = cardsReducer(initialState, deal('f1', p => p.cat === 1));
      const stateReset = cardsReducer(state1, reset());
      const stateDraw = cardsReducer(stateReset, draw('sco'));
      const stateDiscard = cardsReducer(stateDraw, discard(1));
      const stateDrawDisc = cardsReducer(stateDiscard, draw('disc'));
      
      expect(sameArray(stateDrawDisc.hand, [0, 2, 1])).toBe(true);
      expect(stateDrawDisc.discard.length).toBe(0);
    });
  });

  describe('8. Tous → 6 cartes', () => {
    it('Tous → 6 cartes en main', () => {
      const state1 = cardsReducer(initialState, deal('f1', p => p.cat === 1));
      const stateAll = cardsReducer(state1, deal('f3', () => true));
      
      expect(stateAll.hand.length).toBe(6);
    });
  });

  describe('9. Défausses multiples avec active borné', () => {
    it('défausse multiple + active borné', () => {
      const state1 = cardsReducer(initialState, deal('f3', () => true));
      const state2 = cardsReducer(state1, discard(0));
      const state3 = cardsReducer(state2, discard(1));
      
      expect(state3.hand.length).toBe(4);
      expect(state3.discard.length).toBe(2);
      expect(state3.active).toBeLessThanOrEqual(3);
    });
  });

  describe('10. Pioche "Bientôt" ne change pas l\'état', () => {
    it('DRAW ne change pas l\'état quand la carte est "soon"', () => {
      const state1 = cardsReducer(initialState, deal('f1', p => p.cat === 1));
      // Après le deal, sco a [2,3,4], donc 'soon' n'est plus au sommet
      // Il faut un état où 'soon' est au sommet
      const state2 = cardsReducer(initialState, { type: ACTIONS.DEAL, payload: { key: 'f1', predicate: p => p.cat === 2 } });
      // Après ce deal, perso devrait avoir 'soon' au sommet
      // Mais recréons manuellement un état avec 'soon' au sommet
      const stateWithSoon = {
        ...initialState,
        piles: {
          pro: [],
          sco: ['soon'],
          perso: []
        }
      };
      
      const state3 = cardsReducer(stateWithSoon, draw('sco'));
      // L'état ne devrait pas changer car 'soon' est au sommet
      expect(sameState(state3, stateWithSoon)).toBe(true);
    });
  });

  describe('11. Aucune carte n\'est dupliquée ni perdue', () => {
    it('hand ∪ piles ∪ discard contient toujours les 6 projets exactement une fois (hors "soon")', () => {
      // Tester avec plusieurs séquences aléatoires
      const allProjectIndices = [0, 1, 2, 3, 4, 5];
      
      // Fonction pour vérifier l'invariance
      const checkInvariant = (state) => {
        const allCards = [
          ...state.hand,
          ...state.piles.pro.filter(c => c !== 'soon'),
          ...state.piles.sco.filter(c => c !== 'soon'),
          ...state.piles.perso.filter(c => c !== 'soon'),
          ...state.discard
        ];
        
        // Vérifier qu'on a exactement 6 cartes
        expect(allCards.length).toBe(6);
        
        // Vérifier qu'il n'y a pas de doublons
        const uniqueCards = new Set(allCards);
        expect(uniqueCards.size).toBe(6);
        
        // Vérifier que toutes les cartes sont présentes
        expect(allProjectIndices.every(idx => allCards.includes(idx))).toBe(true);
      };

      // Test avec plusieurs séquences
      let state = initialState;
      
      // Séquence 1: pioche, défausse, filtre, reset
      state = cardsReducer(state, draw('sco'));
      checkInvariant(state);
      
      state = cardsReducer(state, discard(2));
      checkInvariant(state);
      
      state = cardsReducer(state, deal('sReact', p => p.k.some(k => k.includes('React'))));
      checkInvariant(state);
      
      state = cardsReducer(state, reset());
      checkInvariant(state);
      
      // Séquence 2: filtre, pioche, défausse multiple
      state = cardsReducer(state, deal('f1', p => p.cat === 1));
      checkInvariant(state);
      
      state = cardsReducer(state, draw('sco'));
      checkInvariant(state);
      
      state = cardsReducer(state, discard(2));
      state = cardsReducer(state, discard(3));
      checkInvariant(state);
      
      // Séquence 3: tous, défausse, reprise
      state = cardsReducer(state, reset());
      state = cardsReducer(state, deal('f3', () => true));
      checkInvariant(state);
      
      state = cardsReducer(state, discard(0));
      state = cardsReducer(state, discard(1));
      checkInvariant(state);
      
      state = cardsReducer(state, draw('disc'));
      checkInvariant(state);
    });
  });

  describe('12. Test par propriété avec 500 séquences aléatoires', () => {
    it('500 séquences aléatoires ne cassent pas l\'invariant', { timeout: 10000 }, () => {
      const actions = [
        () => draw('sco'),
        () => draw('perso'),
        () => draw('disc'),
        () => discard(0),
        () => discard(1),
        () => discard(2),
        () => select(0),
        () => next(),
        () => prev(),
        () => deal('f0', p => p.cat === 0),
        () => deal('f1', p => p.cat === 1),
        () => deal('f2', p => p.cat === 2),
        () => deal('f3', () => true),
        () => deal('sReact', p => p.k.some(k => k.includes('React'))),
        () => reset()
      ];

      const allProjectIndices = [0, 1, 2, 3, 4, 5];
      
      for (let i = 0; i < 500; i++) {
        let state = initialState;
        const sequenceLength = Math.floor(Math.random() * 10) + 1;
        
        for (let j = 0; j < sequenceLength; j++) {
          const randomAction = actions[Math.floor(Math.random() * actions.length)];
          state = cardsReducer(state, randomAction());
          
          // Vérifier l'invariant
          const allCards = [
            ...state.hand,
            ...state.piles.pro.filter(c => c !== 'soon'),
            ...state.piles.sco.filter(c => c !== 'soon'),
            ...state.piles.perso.filter(c => c !== 'soon'),
            ...state.discard
          ];
          
          expect(allCards.length).toBe(6);
          expect(new Set(allCards).size).toBe(6);
          expect(allProjectIndices.every(idx => allCards.includes(idx))).toBe(true);
        }
      }
    }, { timeout: 10000 });
  });
});
