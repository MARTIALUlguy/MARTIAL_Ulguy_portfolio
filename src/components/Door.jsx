import { useState, useEffect, useRef, useCallback } from 'react';
import { useLang } from '../hooks/useLang';
import { useSound } from '../hooks/useSound';
import { useTheme } from '../hooks/useTheme';

// Photo en data URI (à remplacer par l'image réelle plus tard)
const photoDataURI = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTlZYXV5dOEVmbWVabFNbXVn/2wBDAQ8QEBYTFioXFypZOzI7WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCACWAJYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+7rWijUqA6lkZ5hbaCVhc+lKscxHs0QdT0+1v4nXfFScYWH/9k=';

/**
 * Composant Door - Intro "porte de garage"
 * Plein écran, z-index:100, fond #1b1d23 avec lamelles
 */
export default function Door({ onIntroEnd, firstVisit }) {
  const { t, lang } = useLang();
  const { door: playDoorSound } = useSound();
  const { theme } = useTheme();
  const [isUp, setIsUp] = useState(false);
  const timeoutRef = useRef(null);

  // Texte pour la première visite vs visites suivantes
  const getDoorText = useCallback(() => {
    if (firstVisit) {
      return t('Prendre le temps, c’est apprécier. Apprécier, c’est s’investir.');
    }
    return lang === 'fr' ? 'Re-bonjour.' : 'Welcome back.';
  }, [firstVisit, t, lang]);

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
    raiseDoor();
  }, [raiseDoor]);

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
