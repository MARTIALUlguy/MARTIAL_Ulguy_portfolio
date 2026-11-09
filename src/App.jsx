import { useState, useCallback } from 'react';
import Background from './components/Background';
import Hud from './components/Hud';
import Ticker from './components/Ticker';
import Footer from './components/Footer';
import Door from './components/Door';
import Profile from './components/Profile';
import Contact from './components/Contact';
import Projects from './components/Projects';
import { useSound } from './hooks/useSound';
import { useProgress } from './hooks/useProgress';
import './styles.css';

function getInitialDoorState() {
  let firstVisit;
  try {
    firstVisit = !localStorage.getItem('um_seen');
  } catch {
    firstVisit = true;
  }

  const reducedMotion = typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return { firstVisit, showDoor: !reducedMotion };
}

/**
 * Composant App - Point d'entrée principal
 * Orchestre tous les composants
 */
export default function App() {
  const { beep } = useSound();
  const { updateSeen, revLights, sectors } = useProgress();
  
  const [activeTab, setActiveTab] = useState(0);
  const [doorState, setDoorState] = useState(getInitialDoorState);
  const { showDoor, firstVisit } = doorState;

  // Gestion de la fin de l'intro
  const handleIntroEnd = useCallback(() => {
    setDoorState(current => ({ ...current, showDoor: false }));
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
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setDoorState({ showDoor: !reducedMotion, firstVisit: true });
    
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
      {showDoor && (
        <Door 
          onIntroEnd={handleIntroEnd}
          firstVisit={firstVisit}
        />
      )}
      
      <Hud 
        onTabChange={handleTabChange}
        activeTab={activeTab}
        revLights={revLights()}
        sectors={sectors()}
      />
      
      <Ticker />
      
      <main id="app">
        <div hidden={activeTab !== 0} aria-hidden={activeTab !== 0}>
          <Profile onTabChange={handleTabChange} />
          <Contact />
        </div>
        <div hidden={activeTab !== 1} aria-hidden={activeTab !== 1}>
          <Projects />
        </div>
      </main>
      
      <Footer onReplayIntro={handleReplayIntro} />
    </>
  );
}
