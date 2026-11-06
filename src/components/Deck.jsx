import { useEffect, useRef, useCallback } from 'react';
import { useLang } from '../hooks/useLang';
import Card from './Card';
import { P } from '../data/projects';

/**
 * Composant Deck - Conteneur pour les cartes en éventail
 * Height 440px, position relative
 */
export default function Deck({ 
  hand, 
  activeIndex,
  onCardClick,
  onCardDiscard
}) {
  const { t, lang } = useLang();
  const deckRef = useRef(null);

  // Mettre à jour les positions des cartes quand hand ou activeIndex change
  useEffect(() => {
    const cards = deckRef.current?.querySelectorAll('.card');
    if (!cards) return;

    cards.forEach((card, i) => {
      const projectIndex = parseInt(card.dataset.i, 10);
      const o = i - activeIndex;
      const a = Math.abs(o);
      
      card.style.setProperty('--o', o);
      card.style.setProperty('--a', a);
      card.style.zIndex = 10 - a;
      card.classList.toggle('on', i === activeIndex);
      
      // Animation fresh pour les nouvelles cartes
      if (hand.includes(projectIndex)) {
        const freshIndex = hand.indexOf(projectIndex);
        card.style.setProperty('--k', freshIndex);
        card.classList.add('fresh');
        
        // Retirer la classe fresh à la fin de l'animation
        const handleAnimationEnd = () => {
          card.classList.remove('fresh');
        };
        card.addEventListener('animationend', handleAnimationEnd, { once: true });
        
        // Nettoyer l'écouteur au démontage
        return () => {
          card.removeEventListener('animationend', handleAnimationEnd);
        };
      }
    });
  }, [hand, activeIndex]);

  // Gestion du clic sur une carte
  const handleCardClick = useCallback((projectIndex, cardElement) => {
    onCardClick(projectIndex, cardElement);
  }, [onCardClick]);

  // Gestion du discard
  const handleCardDiscard = useCallback((projectIndex) => {
    onCardDiscard(projectIndex);
  }, [onCardDiscard]);

  // Vérifier si toutes les cartes sont en main (6 projets)
  const allCardsInHand = hand.length === P.length;

  return (
    <div 
      ref={deckRef}
      className="deck"
      data-testid="deck"
      style={{ position: 'relative', height: '440px', margin: '20px 0' }}
      data-e={allCardsInHand ? (lang === 'fr' ? 'Main vide · pioche une carte' : 'Empty hand · draw a card') : ''}
    >
      {hand.length === 0 ? (
        <div 
          style={{
            position: 'absolute',
            left: '50%',
            top: '10px',
            width: 'min(320px, 80vw)',
            height: '380px',
            transform: 'translateX(-50%)',
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            padding: '20px',
            color: 'var(--mut)',
            border: '2px dashed var(--line)',
            borderRadius: '22px'
          }}
        >
          {t('Main vide · pioche une carte')}
        </div>
      ) : (
        hand.map((projectIndex, i) => (
          <Card
            key={projectIndex}
            index={i}
            projectIndex={projectIndex}
            isActive={i === activeIndex}
            onClick={handleCardClick}
            onDiscard={handleCardDiscard}
            positionOffset={i - activeIndex}
            isFresh={true}
          />
        ))
      )}
    </div>
  );
}
