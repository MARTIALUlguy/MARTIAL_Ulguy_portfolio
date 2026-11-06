import { useState, useEffect, useCallback, useRef } from 'react';
import Background from './components/Background';
import Hud from './components/Hud';
import Ticker from './components/Ticker';
import Footer from './components/Footer';
import Door from './components/Door';
import Profile from './components/Profile';
import Contact from './components/Contact';
import Projects from './components/Projects';
import { useLang } from './hooks/useLang';
import { useTheme } from './hooks/useTheme';
import { useSound } from './hooks/useSound';
import { useProgress } from './hooks/useProgress';
import './styles.css';

/**
 * Composant App - Point d'entrée principal
 * Orchestre tous les composants
 */
export default function App() {
  const { lang, t, setLang, toggleLang } = useLang('fr');
  const { theme, toggleTheme } = useTheme();
  const { soundLevel, toggleSound, getSoundLabel, handleUserGesture, beep } = useSound();
  const { scrollProgress, seen, updateSeen, revLights, sectors, allSectorsOn } = useProgress();
  
  const [activeTab, setActiveTab] = useState(0);
  const [showDoor, setShowDoor] = useState(true);
  const [firstVisit, setFirstVisit] = useState(false);
  const doorEndedRef = useRef(false);

  // Vérifier si c'est la première visite
  useEffect(() => {
    try {
      const seen = localStorage.getItem('um_seen');
      setFirstVisit(!seen);
      setShowDoor(!seen);
    } catch {
      setFirstVisit(true);
      setShowDoor(true);
    }
  }, []);

  // Gestion de la fin de l'intro
  const handleIntroEnd = useCallback(() => {
    setShowDoor(false);
    doorEndedRef.current = true;
    // Déverrouiller l'audio après le geste (clic sur le bouton ou timeout)
    handleUserGesture();
  }, [handleUserGesture]);

  // Vérifier prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setShowDoor(false);
    }
  }, []);

  // Gestion du changement d'onglet
  const handleTabChange = useCallback((tabIndex) => {
    setActiveTab(tabIndex);
    updateSeen(tabIndex.toString());
    beep(380 + 90 * tabIndex);
    // Scroll en haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [updateSeen, beep]);

  // Gestion du replay de l'intro
  const handleReplayIntro = useCallback(() => {
    // Réinitialiser le state
    setShowDoor(true);
    setFirstVisit(true);
    doorEndedRef.current = false;
    
    // Scroll en haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Supprimer um_seen pour simuler une première visite
    try {
      localStorage.removeItem('um_seen');
    } catch {
      // Ignorer
    }
  }, []);

  return (
    <>
      <Background />
      
      {/* Door - Intro */}
      {showDoor && !doorEndedRef.current && (
        <Door 
          onIntroEnd={handleIntroEnd}
          firstVisit={firstVisit}
        />
      )}
      
      <Hud 
        onTabChange={handleTabChange}
        activeTab={activeTab}
        lang={lang}
        toggleLang={toggleLang}
        theme={theme}
        toggleTheme={toggleTheme}
        soundLevel={soundLevel}
        toggleSound={toggleSound}
        getSoundLabel={getSoundLabel}
        scrollProgress={scrollProgress}
        seen={seen}
        revLights={revLights()}
        sectors={sectors()}
        allSectorsOn={allSectorsOn()}
        beep={beep}
      />
      
      <Ticker lang={lang} t={t} />
      
      <main id="app">
        {/* Onglet 0 : Profil */}
        {activeTab === 0 && (
          <>
            <Profile onTabChange={handleTabChange} />
            <Contact />
          </>
        )}
        
        {/* Onglet 1 : Projets & compétences */}
        {activeTab === 1 && (
          <Projects />
        )}
      </main>
      
      <Footer 
        lang={lang}
        t={t}
        onReplayIntro={handleReplayIntro}
      />
    </>
  );
}
