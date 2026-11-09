import { useState, useEffect, useRef, useCallback } from 'react';
import { useLang } from '../hooks/useLang';
import { useSound } from '../hooks/useSound';
import { useTheme } from '../hooks/useTheme';

// Photo servie depuis public/profil.jpg
const photoDataURI = '/profil.jpg';

/**
 * Composant Door - Intro "porte de garage"
 * Plein écran, z-index:100, fond #1b1d23 avec lamelles
 */
export default function Door({ onIntroEnd, firstVisit }) {
  const { t } = useLang();
  const { door: playDoorSound, handleUserGesture } = useSound();
  const { theme } = useTheme();
  const [isUp, setIsUp] = useState(false);
  const timeoutRef = useRef(null);

  // Texte pour la première visite vs visites suivantes
  const getDoorText = useCallback(() => {
    if (firstVisit) {
      return t('Prendre le temps, c’est apprécier. Apprécier, c’est s’investir.');
    }
    return t('Re-bonjour.');
  }, [firstVisit, t]);

  // Animation des mots (premier visite uniquement)
  const renderAnimatedText = useCallback(() => {
    const text = getDoorText();
    if (!firstVisit) {
      return <p id="ph">{text}</p>;
    }
    
    const words = text.split(' ');
    return (
      <p id="ph">
        {words.map((word, i) => (
          <span 
            key={i} 
            style={{ 
              animationDelay: `${0.3 + i * 0.14}s`
            }}
          >
            {word + ' '}
          </span>
        ))}
      </p>
    );
  }, [firstVisit, getDoorText]);

  // Montée de la porte
  const raiseDoor = useCallback(() => {
    if (isUp) return;
    setIsUp(true);
    playDoorSound();
    
    // Appliquer l'animation zoom au main
    const main = document.querySelector('main');
    if (main) {
      main.classList.add('in');
    }
    
    // Notifier la fin de l'intro
    if (onIntroEnd) {
      onIntroEnd();
    }
    
    // Écrire um_seen dans localStorage
    try {
      localStorage.setItem('um_seen', '1');
    } catch {
      // Ignorer
    }
  }, [isUp, playDoorSound, onIntroEnd]);

  // Gestion du timeout automatique
  useEffect(() => {
    if (firstVisit) {
      // 9 secondes pour la première visite
      timeoutRef.current = setTimeout(() => {
        raiseDoor();
      }, 9000);
    } else {
      // 1.1 secondes pour les visites suivantes
      timeoutRef.current = setTimeout(() => {
        raiseDoor();
      }, 1100);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [firstVisit, raiseDoor]);

  // Gestion du clic sur le bouton
  const handleButtonClick = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    handleUserGesture();
    raiseDoor();
  }, [handleUserGesture, raiseDoor]);

  // Ne pas afficher si prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      if (onIntroEnd) {
        onIntroEnd();
      }
    }
  }, [onIntroEnd]);

  if (isUp) {
    return null;
  }

  return (
    <div id="door" className={theme === 'dark' ? 'dark' : ''}>
      <div className="dc">
        <img 
          src={photoDataURI} 
          alt={t('Départ')} 
          style={{ animation: 'fl 4s ease-in-out infinite alternate' }}
        />
        {renderAnimatedText()}
        {firstVisit && (
          <button className="btn" id="go" onClick={handleButtonClick}>
            {t('Lever la porte')}
          </button>
        )}
      </div>
    </div>
  );
}
