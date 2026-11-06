import { P } from '../data/projects';

// État initial
export const initialState = {
  hand: [0, 1],         // main : indices des projets
  piles: {
    pro: [],            // pioche stages
    sco: [2, 3, 4, 'soon'],  // pioche scolaires
    perso: [5, 'soon']  // pioche perso
  },
  discard: [],          // défausse
  active: 0,            // carte active dans la main
  filter: null          // filtre actif (null = aucun)
};

// Actions
export const ACTIONS = {
  DRAW: 'DRAW',
  DISCARD: 'DISCARD',
  SELECT: 'SELECT',
  NEXT: 'NEXT',
  PREV: 'PREV',
  DEAL: 'DEAL',
  RESET: 'RESET'
};

/**
 * Réducteur pur pour la gestion des cartes
 * @param {Object} state - État actuel
 * @param {Object} action - Action à appliquer
 * @returns {Object} Nouveau état
 */
export function cardsReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.DRAW: {
      // k='disc' → reprend la dernière carte défaussée
      if (action.payload === 'disc') {
        if (state.discard.length === 0) {
          return state;
        }
        const card = state.discard[state.discard.length - 1];
        return {
          ...state,
          hand: [...state.hand, card],
          discard: state.discard.slice(0, -1),
          active: state.hand.length
        };
      }
      
      // Sinon, prend la première carte de la pioche action.payload
      const pile = state.piles[action.payload];
      if (!pile || pile.length === 0) {
        return state;
      }
      
      const firstCard = pile[0];
      // Si c'est 'soon', ne change rien
      if (firstCard === 'soon') {
        return state;
      }
      
      return {
        ...state,
        hand: [...state.hand, firstCard],
        piles: {
          ...state.piles,
          [action.payload]: pile.slice(1)
        },
        active: state.hand.length
      };
    }

    case ACTIONS.DISCARD: {
      const cardIndex = action.payload;
      const handIndex = state.hand.indexOf(cardIndex);
      
      // Sans effet si la carte n'est pas en main
      if (handIndex === -1) {
        return state;
      }
      
      const newHand = state.hand.filter((_, i) => i !== handIndex);
      const newActive = Math.max(0, Math.min(state.active, newHand.length - 1));
      
      return {
        ...state,
        hand: newHand,
        discard: [...state.discard, cardIndex],
        active: newActive
      };
    }

    case ACTIONS.SELECT: {
      const index = action.payload;
      if (state.hand.length === 0) {
        return state;
      }
      return {
        ...state,
        active: Math.max(0, Math.min(index, state.hand.length - 1))
      };
    }

    case ACTIONS.NEXT: {
      if (state.hand.length === 0) {
        return state;
      }
      return {
        ...state,
        active: (state.active + 1) % state.hand.length
      };
    }

    case ACTIONS.PREV: {
      if (state.hand.length === 0) {
        return state;
      }
      return {
        ...state,
        active: (state.active + state.hand.length - 1) % state.hand.length
      };
    }

    case ACTIONS.DEAL: {
      const { key, predicate } = action.payload;
      
      // Trouver les projets qui satisfont le prédicat
      const matchingIndices = P.map((_, i) => i).filter(i => predicate(P[i]));
      
      // Construire les nouvelles pioches
      const newPiles = { pro: [], sco: [], perso: [] };
      P.forEach((p, i) => {
        if (!matchingIndices.includes(i)) {
          const pileKey = ['pro', 'sco', 'perso'][p.cat];
          newPiles[pileKey].push(i);
        }
      });
      
      // Ajouter 'soon' aux pioches scolaires et perso
      newPiles.sco.push('soon');
      newPiles.perso.push('soon');
      
      return {
        ...state,
        hand: matchingIndices,
        piles: newPiles,
        discard: [],
        active: 0,
        filter: key
      };
    }

    case ACTIONS.RESET: {
      return initialState;
    }

    default:
      return state;
  }
}

// Action creators
export const draw = (k) => ({ type: ACTIONS.DRAW, payload: k });
export const discard = (i) => ({ type: ACTIONS.DISCARD, payload: i });
export const select = (i) => ({ type: ACTIONS.SELECT, payload: i });
export const next = () => ({ type: ACTIONS.NEXT });
export const prev = () => ({ type: ACTIONS.PREV });
export const deal = (key, predicate) => ({ type: ACTIONS.DEAL, payload: { key, predicate } });
export const reset = () => ({ type: ACTIONS.RESET });
