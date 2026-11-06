import { useState, useEffect, useCallback } from 'react';

/**
 * Hook pour gérer le thème (clair/sombre)
 * Utilise l'attribut data-theme sur <html> et prefers-color-scheme
 * @returns {Object} { theme, setTheme, toggleTheme }
 */
export function useTheme() {
  // Vérifier si on est dans un environnement de test (jsdom)
  const isTestEnv = typeof window === 'undefined' || !window.matchMedia;

  // Lire le thème actuel depuis l'attribut data-theme ou prefers-color-scheme
  const getCurrentTheme = useCallback(() => {
    if (isTestEnv) {
      return 'light';
    }
    
    const root = document.documentElement;
    const dataTheme = root.dataset.theme;
    
    if (dataTheme === 'light' || dataTheme === 'dark') {
      return dataTheme;
    }
    
    // Pas d'attribut data-theme, utiliser prefers-color-scheme
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  }, []);

  const [theme, setThemeState] = useState(getCurrentTheme());

  // Synchroniser avec l'attribut data-theme
  useEffect(() => {
    if (!isTestEnv) {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme, isTestEnv]);

  // Mettre à jour l'état quand prefers-color-scheme change
  useEffect(() => {
    if (isTestEnv) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      // Ne mettre à jour que si aucun data-theme n'est défini
      if (!document.documentElement.dataset.theme) {
        setThemeState(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [isTestEnv]);

  // Fonction pour changer de thème
  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
  }, []);

  // Toggle entre light et dark
  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      if (!isTestEnv) {
        // Si on utilise prefers-color-scheme (pas de data-theme), forcer un thème
        if (!document.documentElement.dataset.theme) {
          return prev === 'light' ? 'dark' : 'light';
        }
      }
      return prev === 'light' ? 'dark' : 'light';
    });
  }, [isTestEnv]);

  return { theme, setTheme, toggleTheme };
}

export default useTheme;
