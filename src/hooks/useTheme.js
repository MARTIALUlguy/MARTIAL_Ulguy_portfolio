import { useAppContext } from '../state/AppContext';

/**
 * Hook pour gérer le thème (clair/sombre)
 * Utilise l'attribut data-theme sur <html> et prefers-color-scheme
 * @returns {Object} { theme, setTheme, toggleTheme }
 */
export function useTheme() {
  const { theme, setTheme, toggleTheme } = useAppContext();
  return { theme, setTheme, toggleTheme };
}

export default useTheme;
