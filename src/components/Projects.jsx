import { useReducer, useEffect, useCallback, useRef, useState } from 'react';
import { useLang } from '../hooks/useLang';
import { useProgress } from '../hooks/useProgress';
import { useSound } from '../hooks/useSound';
import { cardsReducer, initialState, draw, discard, next, prev } from '../state/cards';
import Deck from './Deck';
import Piles from './Piles';
import FilterBar from './FilterBar';
import DetailDialog from './DetailDialog';
import Skills from './Skills';
import { P } from '../data/projects';

/**
 * Composant Projects - Onglet Projets & compétences
 * Gère le state des cartes avec useReducer
 */
export default function Projects() {
  const { t, lang } = useLang();
  const { updateSeen } = useProgress();
  const { beep } = useSound();
  
  const [state, dispatch] = useReducer(cardsReducer, initialState);
  const timeoutRefs = useRef([]);
  const [dialogProjectIndex, setDialogProjectIndex] = useState(null);
  const [activeCardRef, setActiveCardRef] = useState(null);
  
  // Nettoyer les timeouts au démontage
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
    };
  }, []);

  // Vérifier si toutes les cartes sont en main (6 projets)
  useEffect(() => {
    if (state.hand.length === P.length) {
      updateSeen('c');
    }
  }, [state.hand.length, updateSeen]);

  // Gestion du draw (pioche)
  const handleDraw = useCallback((pileKey) => {
    dispatch(draw(pileKey));
  }, []);

  // Gestion du discard depuis la main
  const handleDiscard = useCallback((projectIndex) => {
    // Annuler les timeouts existants
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    
    const cardElement = document.querySelector(`.card[data-i="${projectIndex}"]`);
    const discardStack = document.querySelector('.pl[data-k="disc"] .stack');
    
    // Vérifier si on peut animer
    const canAnimate = cardElement && discardStack && 
                      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
                      !document.body.classList.contains('calm');
    
    if (canAnimate) {
      const cardRect = cardElement.getBoundingClientRect();
      const stackRect = discardStack.getBoundingClientRect();
      
      const dx = stackRect.left + stackRect.width / 2 - cardRect.left - cardRect.width / 2;
      const dy = stackRect.top + stackRect.height / 2 - cardRect.top - cardRect.height / 2;
      
      cardElement.style.setProperty('--dx', `${dx}px`);
      cardElement.style.setProperty('--dy', `${dy}px`);
      cardElement.classList.add('out');
      
      // Envoyer DISCARD après 480ms
      const timeoutId = setTimeout(() => {
        dispatch(discard(projectIndex));
      }, 480);
      
      timeoutRefs.current.push(timeoutId);
    } else {
      // Envoi immédiat si reduced-motion ou mode calme
      dispatch(discard(projectIndex));
    }
  }, [dispatch]);

  // Gestion de l'ouverture/fermeture du dialog
  const openDialog = useCallback((projectIndex, cardRef) => {
    setActiveCardRef(cardRef);
    setDialogProjectIndex(projectIndex);
    beep(420, 0.08);
  }, [beep]);

  const closeDialog = useCallback(() => {
    setDialogProjectIndex(null);
    setActiveCardRef(null);
  }, []);

  // Gestion du discard depuis le dialog
  const handleDialogDiscard = useCallback((projectIndex) => {
    closeDialog();
    // Appeler handleDiscard après un petit délai pour laisser le dialog se fermer
    const timeoutId = setTimeout(() => {
      handleDiscard(projectIndex);
    }, 50);
    timeoutRefs.current.push(timeoutId);
  }, [closeDialog, handleDiscard]);

  // Gestion du clic sur une carte
  const handleCardClick = useCallback((projectIndex, cardElement = null) => {
    const indexInHand = state.hand.indexOf(projectIndex);
    
    if (indexInHand === -1) {
      // La carte n'est pas dans la main, ne rien faire
      return;
    }
    
    if (indexInHand === state.active) {
      // Carte active : ouvrir les détails
      if (cardElement) {
        setActiveCardRef({ current: cardElement });
      }
      openDialog(projectIndex);
    } else {
      // Carte non active : la rendre active
      dispatch({ type: 'SELECT', payload: indexInHand });
    }
  }, [state.hand, state.active, openDialog]);

  // Bouton Previous
  const handlePrev = useCallback(() => {
    dispatch(prev());
  }, []);

  // Bouton Next
  const handleNext = useCallback(() => {
    dispatch(next());
  }, []);

  // Passer le dispatch et state à FilterBar via props
  const handleDeal = useCallback((key, predicate) => {
    beep(340, 0.1);
    dispatch({ type: 'DEAL', payload: { key, predicate } });
  }, [beep, dispatch]);

  const handleResetFilter = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  return (
    <section>
      <h2>{t('Le deck de projets')}</h2>
      <p className="sub">{t('Ma main contient mes stages. Pioche, filtre par famille ou compétence, et clique une carte pour ses détails.')}</p>
      
      {/* FilterBar */}
      <FilterBar
        filter={state.filter}
        onDeal={handleDeal}
        onReset={handleResetFilter}
      />
      
      {/* Deck */}
      <Deck
        hand={state.hand}
        activeIndex={state.active}
        onCardClick={handleCardClick}
        onCardDiscard={handleDiscard}
      />
      
      {/* Piles */}
      <Piles
        piles={state.piles}
        discard={state.discard}
        onDraw={handleDraw}
      />
      
      {/* Navigation */}
      <div 
        className="nav"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          alignItems: 'center'
        }}
      >
        <button 
          className="btn o"
          onClick={handlePrev}
          disabled={state.hand.length === 0}
        >
          ←
        </button>
        <span className="m">
          {t('Main : ')}{state.hand.length}/{P.length}
        </span>
        <button 
          className="btn o"
          onClick={handleNext}
          disabled={state.hand.length === 0}
        >
          →
        </button>
      </div>
      
      {/* Skills */}
      <Skills />
      
      {/* DetailDialog */}
      {dialogProjectIndex !== null && (
        <DetailDialog
          projectIndex={dialogProjectIndex}
          onClose={closeDialog}
          onDiscard={handleDialogDiscard}
          focusRef={activeCardRef}
        />
      )}
    </section>
  );
}
