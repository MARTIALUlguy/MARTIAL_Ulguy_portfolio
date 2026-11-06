import { useState, useEffect, useCallback } from 'react';

/**
 * Hook pour gérer la progression de scroll et les secteurs
 * @returns {Object} { scrollProgress, seen, updateSeen, revLights, sectors }
 */
export function useProgress() {
  const isTestEnv = typeof window === 'undefined' || !window.scrollY;
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [seen, setSeen] = useState({ 0: 1, c: 0, k: 0 }); // 0: profil, 1: projets, c: deck complet, k: contact

  // Mettre à jour la progression de scroll
  useEffect(() => {
    if (isTestEnv) return;
    
    const handleScroll = () => {
      const root = document.documentElement;
      const scrollHeight = root.scrollHeight - window.innerHeight;
      
      if (scrollHeight > 0) {
        const progress = window.scrollY / scrollHeight;
        setScrollProgress(Math.max(0, Math.min(1, progress)));
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isTestEnv]);

  // Mettre à jour les secteurs vus
  const updateSeen = useCallback((key) => {
    setSeen(prev => ({ ...prev, [key]: 1 }));
  }, []);

  // Calculer les voyants de rev (10 LED : 4 vertes, 3 rouges, 3 bleues)
  const revLights = useCallback(() => {
    const n = 1 + Math.round(scrollProgress * 9);
    const lights = [];
    
    for (let i = 0; i < 10; i++) {
      const isOn = i < n;
      let className = '';
      if (isOn) {
        if (i < 4) className = 'g';
        else if (i < 7) className = 'r';
        else className = 'b';
      }
      lights.push({ on: isOn, class: className });
    }
    
    return lights;
  }, [scrollProgress]);

  // Calculer les secteurs (4 : profil, projets, deck complet, contact)
  const sectors = useCallback(() => {
    const keys = ['0', '1', 'c', 'k'];
    return keys.map(key => ({ on: !!seen[key] }));
  }, [seen]);

  // Vérifier si tous les secteurs sont allumés
  const allSectorsOn = useCallback(() => {
    return Object.values(seen).every(v => v);
  }, [seen]);

  // Initialiser l'observer pour la section contact
  useEffect(() => {
    if (isTestEnv) return;
    
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            updateSeen('k');
          }
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(contactSection);
    
    return () => {
      observer.disconnect();
    };
  }, [updateSeen, isTestEnv]);

  return {
    scrollProgress,
    seen,
    updateSeen,
    revLights,
    sectors,
    allSectorsOn
  };
}

export default useProgress;
