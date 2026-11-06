import { createContext, useContext, useReducer } from 'react';
import { cardsReducer, initialState } from './cards';

// Contexte pour le réducteur
export const CardsContext = createContext(null);

export function CardsProvider({ children }) {
  const [state, dispatch] = useReducer(cardsReducer, initialState);
  
  return (
    <CardsContext.Provider value={{ state, dispatch }}>
      {children}
    </CardsContext.Provider>
  );
}

export function useReducerContext() {
  const context = useContext(CardsContext);
  if (!context) {
    throw new Error('useReducerContext must be used within a CardsProvider');
  }
  return context;
}
