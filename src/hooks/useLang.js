import { useAppContext } from '../state/AppContext';

/**
 * Hook pour gérer la langue
 * @param {string} defaultLang - Langue par défaut ('fr' ou 'en')
 * @returns {Object} { lang, setLang, t }
 */
export function useLang() {
  const { lang, setLang, t, toggleLang } = useAppContext();
  return { lang, setLang, t, toggleLang };
}

export default useLang;
