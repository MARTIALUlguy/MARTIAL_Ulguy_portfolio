import { useEffect, useRef, useCallback } from 'react';
import { useLang } from '../hooks/useLang';
import { useProgress } from '../hooks/useProgress';

/**
 * Composant Contact - Section de contact
 * id="contact", IntersectionObserver à 60% qui marque secteur "k" comme vu
 */
export default function Contact() {
  const { t, lang } = useLang();
  const { updateSeen } = useProgress();
  const contactRef = useRef(null);
  const observerRef = useRef(null);

  // IntersectionObserver à 60%
  useEffect(() => {
    if (!contactRef.current) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            updateSeen('k');
            // Désactiver l'observer une fois déclenché
            if (observerRef.current) {
              observerRef.current.disconnect();
            }
          }
        });
      },
      { threshold: 0.6 }
    );
    
    observerRef.current.observe(contactRef.current);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [updateSeen]);

  return (
    <section id="contact" ref={contactRef}>
      <h2 style={{ marginTop: '56px' }}>
        {t('On s’écrit ?')}
      </h2>
      <p className="sub">
        {t('Disponible pour un contrat d’apprentissage en développement.')}
      </p>
      
      <div className="row">
        {/* Email */}
        <a 
          className="btn" 
          data-contact 
          href="mailto:ulguym@gmail.com"
        >
          {t('Email')}
        </a>
        
        {/* LinkedIn */}
        <a 
          className="btn o" 
          data-contact 
          href="https://www.linkedin.com/in/ulguy-martial-550b06292/"
          target="_blank" 
          rel="noopener"
        >
          {t('LinkedIn')}
        </a>
        
        {/* GitHub */}
        <a 
          className="btn o" 
          data-contact 
          href="https://github.com/MARTIALUlguy"
          target="_blank" 
          rel="noopener"
        >
          {t('GitHub')}
        </a>
        
        {/* Boutons CV - aria-disabled + TODO */}
        <button 
          className="btn o" 
          data-contact 
          aria-disabled="true"
          aria-label="CV FR - TODO"
          style={{ pointerEvents: 'none', opacity: 0.5 }}
          disabled
        >
          {t('CV (FR) · PDF')}
        </button>
        <button 
          className="btn o" 
          data-contact 
          aria-disabled="true"
          aria-label="CV EN - TODO"
          style={{ pointerEvents: 'none', opacity: 0.5 }}
          disabled
        >
          {t('CV (EN) · PDF')}
        </button>
      </div>
      
      <p className="sub" style={{ marginTop: '14px' }}>
        {t('Maquette : les deux CV seront reliés à de vrais PDF.')}
      </p>
    </section>
  );
}
