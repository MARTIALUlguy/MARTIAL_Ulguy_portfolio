import { useEffect, useRef, useCallback } from 'react';
import { useLang } from '../hooks/useLang';
import { P, CAT, PN } from '../data/projects';

/**
 * Composant Card - Carte de projet
 * Contenu : monogramme, titre, date, résumé, puces (avec catégorie en premier), hint, bouton Défausser
 * Styles : éventail avec --o, --a, animations dw, out
 */
export default function Card({ 
  index, 
  projectIndex, 
  isActive, 
  onClick,
  onDiscard,
  positionOffset = 0,
  isFresh = false,
  isOut = false
}) {
  const { t, lang } = useLang();
  const cardRef = useRef(null);
  
  const project = P[projectIndex];
  const o = positionOffset;
  const a = Math.abs(o);
  
  // Annuler les animations au démontage
  useEffect(() => {
    const card = cardRef.current;
    return () => {
      if (card) {
        // Annuler toute animation en cours
        card.style.animation = 'none';
      }
    };
  }, []);

  // Gestion du clic - ne pas avaler les clics des boutons internes
  const handleClick = useCallback((e) => {
    if (e.target.closest('.dx')) {
      // Ne pas déclencher onClick, le bouton Défausser gère ça
      return;
    }
    onClick(projectIndex, cardRef.current);
  }, [onClick, projectIndex]);

  // Gestion du clic sur Défausser
  const handleDiscard = useCallback((e) => {
    e.stopPropagation();
    onDiscard(projectIndex);
  }, [onDiscard, projectIndex]);

  // Gestion du keydown
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      onClick(projectIndex, cardRef.current);
    }
  }, [onClick, projectIndex]);

  // Rendu du contenu de la carte
  const renderCardContent = () => {
    return (
      <>
        {/* Monogramme */}
        <span className="mono" style={{ position: 'absolute', top: '18px', right: '20px', font: '800 3.2rem/1', opacity: 0.9 }}>
          {project.m}
        </span>
        
        {/* Titre */}
        <h3 style={{ font: '800 1.5rem/1.1', margin: 'auto 0 6px' }}>
          {project.t}
        </h3>
        
        {/* Date */}
        <span className="m" style={{ opacity: 0.8 }}>
          {t(project.d[lang === 'fr' ? 0 : 1])}
        </span>
        
        {/* Résumé */}
        <p style={{ fontSize: '.85rem', opacity: 0.92, marginTop: '10px' }}>
          {t(project.s[lang === 'fr' ? 0 : 1])}
        </p>
        
        {/* Puces avec catégorie en premier */}
        <div className="k" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
          <span className="cat" style={{ background: '#fff', color: '#14161B', borderRadius: '99px', padding: '3px 10px', fontSize: '.7rem' }}>
            {t(CAT[project.cat][lang === 'fr' ? 0 : 1])}
          </span>
          {project.k.map((tag, i) => (
            <span key={i} style={{ background: '#fff2', borderRadius: '99px', padding: '3px 10px', fontSize: '.7rem' }}>
              {tag}
            </span>
          ))}
        </div>
        
        {/* Hint et bouton Défausser - visibles seulement sur la carte active */}
        {isActive && (
          <>
            <span className="hint m" style={{ position: 'absolute', left: '22px', bottom: '16px', opacity: 1, transition: 'opacity .3s' }}>
              {t('Détails →')}
            </span>
            <button 
              className="dx m" 
              onClick={handleDiscard}
              style={{
                position: 'absolute', 
                right: '16px', 
                bottom: '12px', 
                background: '#0005', 
                color: '#fff', 
                border: '1px solid #fff5', 
                borderRadius: '8px', 
                padding: '3px 10px', 
                font: 'inherit', 
                fontSize: '.7rem', 
                cursor: 'pointer'
              }}
            >
              {t('Défausser')}
            </button>
          </>
        )}
      </>
    );
  };

  // Style de la carte basé sur la position et l'état
  const cardStyle = {
    position: 'absolute',
    left: '50%',
    top: '10px',
    width: 'min(300px, 70vw)',
    height: '380px',
    borderRadius: '22px',
    padding: '22px',
    paddingBottom: '46px',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    overflow: 'hidden',
    color: '#fff',
    boxShadow: '0 24px 40px -22px #000a',
    zIndex: 10 - a,
    transform: `translateX(calc(-50% + ${o} * 64px)) translateY(${a} * 8px) rotate(${o} * 5deg) scale(${1 - a * 0.05})`,
    transition: 'transform .7s cubic-bezier(.2, .9, .25, 1), filter .5s',
    willChange: isActive ? 'transform' : 'auto'
  };

  // Classes CSS
  const cardClassName = `card ${project.c} ${isActive ? 'on' : ''} ${isFresh ? 'fresh' : ''} ${isOut ? 'out' : ''}`;

  return (
    <article
      ref={cardRef}
      className={cardClassName}
      style={cardStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      data-index={index}
      data-i={projectIndex}
      role="button"
      aria-label={project.t}
    >
      {renderCardContent()}
    </article>
  );
}
