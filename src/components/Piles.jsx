import { useEffect, useRef, useState, useCallback } from 'react';
import { useLang } from '../hooks/useLang';
import { P, PN } from '../data/projects';

/**
 * Composant Piles - Pioches et défausse
 * Rangée centrée sous la main, gap 40px
 */
export default function Piles({ 
  piles,
  discard,
  onDraw,
  onDiscardFromDeck
}) {
  const { t, lang } = useLang();
  const pilesRef = useRef(null);
  const animationTimerRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const [animation, setAnimation] = useState(null);
  
  useEffect(() => {
    return () => {
      window.clearTimeout(animationTimerRef.current);
    };
  }, []);

  const handlePileClick = useCallback((pileKey) => {
    if (isAnimatingRef.current) return;

    const pile = pileKey === 'disc' ? discard : piles[pileKey];
    if (!pile || pile.length === 0) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const calmMode = document.body.classList.contains('calm');
    if (reducedMotion || calmMode) {
      onDraw(pileKey);
      return;
    }

    if (pile[0] === 'soon') {
      isAnimatingRef.current = true;
      setAnimation({ pileKey, type: 'flip' });
      animationTimerRef.current = window.setTimeout(() => {
        isAnimatingRef.current = false;
        animationTimerRef.current = null;
        setAnimation(null);
      }, 1900);
      return;
    }

    const card = pilesRef.current?.querySelector(`.pl[data-k="${pileKey}"] .pc.top`);
    const deck = document.querySelector('.deck');
    if (!card || !deck) {
      onDraw(pileKey);
      return;
    }

    const cardRect = card.getBoundingClientRect();
    const deckRect = deck.getBoundingClientRect();
    const dx = deckRect.left + deckRect.width / 2 - cardRect.left - cardRect.width / 2;
    const dy = deckRect.top + deckRect.height / 2 - cardRect.top - cardRect.height / 2;

    isAnimatingRef.current = true;
    setAnimation({ pileKey, type: 'draw', dx, dy });
    animationTimerRef.current = window.setTimeout(() => {
      isAnimatingRef.current = false;
      animationTimerRef.current = null;
      setAnimation(null);
      onDraw(pileKey);
    }, 640);
  }, [discard, onDraw, piles]);

  // Calculer les cartes réelles (hors 'soon')
  const getRealCardsCount = useCallback((pile) => {
    return pile.filter(card => card !== 'soon').length;
  }, []);

  // Rendu d'une pile (pro, sco, perso)
  const renderPile = (pileKey, pileData) => {
    if (pileKey === 'pro' && pileData.length === 0) {
      return null;
    }
    
    const realCount = getRealCardsCount(pileData);
    const hasSoon = pileData.includes('soon');
    const displayCount = realCount + (hasSoon ? '+' : '');
    
    // La carte du dessus
    const soonOnTop = pileData[0] === 'soon';
    const topCardIndex = soonOnTop ? undefined : pileData.find(c => c !== 'soon');
    const project = topCardIndex !== undefined ? P[topCardIndex] : null;
    const hasShot = project && project.shot !== null;
    
    return (
      <div 
        key={pileKey}
        className="pl"
        data-k={pileKey}
        data-testid={`pile-${pileKey}`}
        role="button"
        aria-label={t(PN[pileKey][lang === 'fr' ? 0 : 1])}
        onClick={() => handlePileClick(pileKey)}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handlePileClick(pileKey)}
        style={{ display: 'grid', justifyItems: 'center', gap: '12px', cursor: 'pointer', color: 'var(--mut)' }}
      >
        <div 
          className="stack"
          style={{
            position: 'relative',
            width: '92px',
            height: '128px',
            perspective: '600px',
            animation: 'pb 5s ease-in-out infinite'
          }}
        >
          {/* Cartes sous la carte du dessus (max 2) */}
          {pileData.slice(0, -1).filter(c => c !== 'soon').slice(0, 2).map((cardIndex, i) => {
            const style = {
              position: 'absolute',
              inset: '0',
              borderRadius: '12px',
              transform: i === 0 ? 'translate(-7px, 7px) rotate(-4deg)' : 'translate(-3px, 3px) rotate(2deg)',
              transition: 'transform .8s cubic-bezier(.2, .9, .25, 1)'
            };
            return (
              <div key={cardIndex} className="pc" style={style}>
                <span className="bk" style={{ borderRadius: '12px' }}></span>
              </div>
            );
          })}
          
          {/* Carte du dessus */}
          {topCardIndex !== undefined ? (
            <div 
              className={`pc top${animation?.pileKey === pileKey && animation.type === 'draw' ? ' fly' : ''}`}
              style={{
                position: 'absolute',
                inset: '0',
                borderRadius: '12px',
                transform: 'none',
                transition: 'transform .8s cubic-bezier(.2, .9, .25, 1)',
                ...(animation?.pileKey === pileKey && animation.type === 'draw' ? {
                  '--dx': `${animation.dx}px`,
                  '--dy': `${animation.dy}px`
                } : {})
              }}
            >
              <span 
                className={`bk${hasShot ? ' shot' : ''}`}
                style={{
                  borderRadius: '12px',
                  background: hasShot ? `url(${project.shot}) center/cover` : `linear-gradient(110deg, #1d2027 0 26%, ${project.ac || '#6b7280'} 26% 48%, #fff 48% 53%, var(--st2) 53% 72%, #1d2027 72%)`,
                  border: '2px solid var(--g)'
                }}
              >
                {!hasShot && (
                  <>
                    <b style={{ position: 'relative', font: '800 1.1rem Sora', background: '#1d2027', border: '2px solid var(--g)', borderRadius: '10px', padding: '2px 8px', zIndex: 1 }}>
                      {project.l}
                    </b>
                    <small style={{ position: 'absolute', bottom: '6px', left: '0', right: '0', font: '500 .48rem "JetBrains Mono"', opacity: 0.75, textAlign: 'center', color: '#F3EEE5' }}>
                      {t('capture à venir')}
                    </small>
                  </>
                )}
              </span>
              
              {/* Face avant (Bientôt) - masquée par défaut */}
              <span className="fr" style={{ background: 'var(--v)', color: '#fff', transform: 'rotateY(180deg)', fontSize: '.95rem', textAlign: 'center', padding: '10px', borderRadius: '12px' }}>
                {t('Bientôt')}
              </span>
            </div>
          ) : soonOnTop ? (
            <div
              className={`pc top${animation?.pileKey === pileKey && animation.type === 'flip' ? ' fl' : ''}`}
              style={{
                position: 'absolute',
                inset: '0',
                borderRadius: '12px',
                transformStyle: 'preserve-3d'
              }}
            >
              <span
                className="bk"
                style={{
                  position: 'absolute',
                  inset: '0',
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '12px',
                  background: 'repeating-linear-gradient(0deg, #fff 0, #fff 4px, #000 4px, #000 8px)',
                  backfaceVisibility: 'hidden'
                }}
              />
              <span
                className="fr"
                style={{
                  position: 'absolute',
                  inset: '0',
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '12px',
                  background: 'var(--v)',
                  color: '#fff',
                  transform: 'rotateY(180deg)',
                  backfaceVisibility: 'hidden'
                }}
              >
                {t('Bientôt')}
              </span>
            </div>
          ) : (
            // Si pas de carte réelle, afficher un cadre pointillé
            <div 
              className="pc top"
              style={{
                position: 'absolute',
                inset: '0',
                borderRadius: '12px',
                border: '2px dashed var(--line)',
                background: 'transparent'
              }}
            />
          )}
        </div>
        
        <span className="m">
          {t(PN[pileKey][lang === 'fr' ? 0 : 1])} · {displayCount}
        </span>
      </div>
    );
  };

  // Rendu de la défausse
  const renderDiscardPile = () => {
    const hasCards = discard.length > 0;
    const topCard = hasCards ? P[discard[discard.length - 1]] : null;
    
    return (
      <div 
        className="pl"
        data-k="disc"
        data-testid="pile-disc"
        role="button"
        aria-label={t(PN.disc[lang === 'fr' ? 0 : 1])}
        onClick={() => handlePileClick('disc')}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handlePileClick('disc')}
        style={{ display: 'grid', justifyItems: 'center', gap: '12px', cursor: 'pointer', color: 'var(--mut)' }}
      >
        <div 
          className="stack"
          style={{
            position: 'relative',
            width: '92px',
            height: '128px',
            perspective: '600px'
          }}
        >
          {hasCards ? (
            <>
              {/* Cartes sous la carte du dessus (max 2) */}
              {discard.slice(0, -1).slice(0, 2).map((cardIndex, i) => (
                <div key={cardIndex} className="pc" style={{
                  position: 'absolute',
                  inset: '0',
                  borderRadius: '12px',
                  transform: i === 0 ? 'translate(-7px, 7px) rotate(-4deg)' : 'translate(-3px, 3px) rotate(2deg)'
                }}>
                  <span className="fc" style={{ background: '#2a2f3a', borderRadius: '12px' }}></span>
                </div>
              ))}
              
              {/* Carte du dessus de la défausse */}
              <div 
                className="pc top"
                style={{
                  position: 'absolute',
                  inset: '0',
                  borderRadius: '12px'
                }}
              >
                <span 
                  className={`fc ${topCard.c}`}
                  style={{
                    background: `var(--${topCard.c === 'oc' ? 'bg' : topCard.c === 'lu' ? 'v' : topCard.c === 'br' ? 't' : topCard.c === 'gd' ? 'st1' : topCard.c === 'vt' ? 'st2' : topCard.c === 'an' ? 'g' : 'bg'})`,
                    borderRadius: '12px',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#fff',
                    font: '800 1.6rem Sora',
                    boxShadow: '0 14px 24px -14px #000a'
                  }}
                >
                  {topCard.m}
                </span>
              </div>
            </>
          ) : (
            // Défausse vide
            <div 
              className="stack"
              style={{
                border: '2px dashed var(--line)',
                borderRadius: '12px'
              }}
            />
          )}
        </div>
        
        <span className="m">
          {t(PN.disc[lang === 'fr' ? 0 : 1])} · {discard.length}
        </span>
      </div>
    );
  };

  // Déterminer quelles piles afficher
  const visiblePiles = [];
  if (piles.pro && piles.pro.length > 0) {
    visiblePiles.push('pro');
  }
  visiblePiles.push('sco', 'perso');
  
  return (
    <div 
      ref={pilesRef}
      className="piles"
      data-testid="piles"
      style={{
        display: 'flex',
        gap: '40px',
        justifyContent: 'center',
        margin: '6px 0 14px',
        flexWrap: 'wrap'
      }}
    >
      {visiblePiles.map(pileKey => renderPile(pileKey, piles[pileKey]))}
      {renderDiscardPile()}
    </div>
  );
}
