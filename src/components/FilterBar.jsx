import { useCallback, useRef, useEffect } from 'react';
import { useLang } from '../hooks/useLang';
import { useSound } from '../hooks/useSound';
import { FAM, FS } from '../data/projects';

/**
 * Composant FilterBar - Barre de filtres pour les projets
 * Familles et compétences avec puces, bouton Réinitialiser conditionnel
 */
export default function FilterBar({ filter, onDeal, onReset }) {
  const { t, lang } = useLang();
  const { beep } = useSound();

  // Référence pour nettoyer les timers
  const timeoutRef = useRef(null);

  // Nettoyer les timers au démontage
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Gestion du clic sur un filtre
  const handleFilterClick = useCallback((key, predicate) => {
    // Bip son
    beep(340, 0.1);

    // Si c'est le filtre actif, réinitialiser
    if (filter === key) {
      onReset();
      return;
    }

    // Sinon appliquer le filtre
    onDeal(key, predicate);
  }, [filter, beep, onDeal, onReset]);

  // Vérifier si un filtre est actif
  const hasActiveFilter = filter !== null;

  return (
    <div className="flt" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
      {/* Familles */}
      <span className="m" style={{ fontSize: '.75rem' }}>
        {t('Familles')}
      </span>
      
      {FAM.map(([frLabel, enLabel, predicate], index) => {
        const label = lang === 'fr' ? frLabel : enLabel;
        const isActive = filter === FAM[index][2].toString() || (filter === null && index === 3);
        const key = ['Stages', 'Scolaires', 'Perso', 'Tous'][index];
        
        return (
          <button
            key={`fam-${index}`}
            type="button"
            className="ft"
            aria-pressed={filter === key || (filter === null && index === 3)}
            onClick={() => handleFilterClick(key, predicate)}
            style={{
              padding: '4px 12px',
              border: '1px solid var(--line)',
              borderRadius: '99px',
              background: filter === key ? 'var(--fg)' : 'transparent',
              color: filter === key ? 'var(--bg)' : 'var(--fg)',
              font: 'inherit',
              fontSize: '.85rem',
              cursor: 'pointer',
              transition: 'background .2s, color .2s, transform .1s',
              transform: filter === key ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            {label}
          </button>
        );
      })}

      {/* Compétences */}
      <span className="m" style={{ fontSize: '.75rem' }}>
        {t('Compétences')}
      </span>

      {FS.map((skill, index) => (
        <button
          key={`skill-${index}`}
          type="button"
          className="ft"
          aria-pressed={filter === `skill-${skill}`}
          onClick={() => handleFilterClick(`skill-${skill}`, (p) => 
            p.k && p.k.some(tag => tag.includes(skill))
          )}
          style={{
            padding: '4px 12px',
            border: '1px solid var(--line)',
            borderRadius: '99px',
            background: filter === `skill-${skill}` ? 'var(--fg)' : 'transparent',
            color: filter === `skill-${skill}` ? 'var(--bg)' : 'var(--fg)',
            font: 'inherit',
            fontSize: '.85rem',
            cursor: 'pointer',
            transition: 'background .2s, color .2s, transform .1s',
            transform: filter === `skill-${skill}` ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          {skill}
        </button>
      ))}

      {/* Bouton Réinitialiser - seulement si un filtre est actif */}
      {hasActiveFilter && (
        <button
          type="button"
          onClick={onReset}
          style={{
            padding: '4px 12px',
            border: '1px solid var(--line)',
            borderRadius: '99px',
            background: 'transparent',
            color: 'var(--mut)',
            font: 'inherit',
            fontSize: '.85rem',
            cursor: 'pointer',
            marginLeft: 'auto'
          }}
        >
          {t('Réinitialiser')}
        </button>
      )}
    </div>
  );
}
