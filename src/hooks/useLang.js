import { useState, useEffect, useCallback } from 'react';
import { t as translate } from '../data/i18n';

/**
 * Hook pour gérer la langue
 * @param {string} defaultLang - Langue par défaut ('fr' ou 'en')
 * @returns {Object} { lang, setLang, t }
 */
export function useLang(defaultLang = 'fr') {
  const [lang, setLangState] = useState(defaultLang);

  // Synchroniser avec l'attribut lang de <html>
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Fonction pour changer de langue
  const setLang = useCallback((newLang) => {
    setLangState(newLang);
  }, []);

  // Fonction de traduction
  const t = useCallback((key) => {
    return translate(key, lang);
  }, [lang]);

  // Toggle entre fr et en
  const toggleLang = useCallback(() => {
    setLangState(prev => prev === 'fr' ? 'en' : 'fr');
  }, []);

  return { lang, setLang, t, toggleLang };
}

export default useLang;
