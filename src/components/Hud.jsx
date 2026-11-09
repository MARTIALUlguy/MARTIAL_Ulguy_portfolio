import { useEffect, useRef } from 'react';
import { useLang } from '../hooks/useLang';
import { useTheme } from '../hooks/useTheme';
import { useSound } from '../hooks/useSound';
import { useProgress, useRevLights } from '../hooks/useProgress';

/**
 * Composant Hud - Barre sticky avec logo, onglets, contrôles
 * Utilise les hooks pour son, langue, thème, progression
 */
export default function Hud({
  onTabChange,
  activeTab,
  sectors
}) {
  const { lang, toggleLang } = useLang();
  const { toggleTheme } = useTheme();
  const { toggleSound, getSoundLabel, beep } = useSound();
  const { allSectorsOn } = useProgress();
  const revLights = useRevLights();
  const lapsRef = useRef(null);

  // Chrono
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      if (lapsRef.current) {
        lapsRef.current.textContent = timeString;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Gestion des onglets
  const handleTabClick = (tabIndex) => {
    onTabChange(tabIndex);
  };

  // Gestion du mode calme
  const handleCalmClick = () => {
    const isCalm = document.body.classList.toggle('calm');
  };

  // Gestion du son
  const handleSoundClick = () => {
    toggleSound();
    beep(600);
  };

  // Gestion de la langue
  const handleLangClick = () => {
    toggleLang();
  };

  // Gestion du thème
  const handleThemeClick = () => {
    toggleTheme();
    beep(440);
  };

  return (
    <header className="hud">
      <span className="logo">UM</span>
      
      <div className="tabs" role="tablist">
        <button 
          className="tab m" 
          role="tab" 
          aria-selected={activeTab === 0}
          onClick={() => handleTabClick(0)}
        >
          {lang === 'fr' ? 'Profil' : 'Profile'}
        </button>
        <button 
          className="tab m" 
          role="tab" 
          aria-selected={activeTab === 1}
          onClick={() => handleTabClick(1)}
        >
          {lang === 'fr' ? 'Projets & compétences' : 'Projects & skills'}
        </button>
      </div>
      
      <div className="ctl">
        {/* Voyants de rev */}
        <span className="rev m" aria-hidden="true">
          {revLights.map((light, i) => (
            <u key={i} className={light.on ? `on ${light.class}` : ''}></u>
          ))}
        </span>
        
        {/* Secteurs */}
        <span 
          className={`seg ${allSectorsOn() ? 'all' : ''}`}
          title={lang === 'fr' ? 'Secteurs : profil, projets, deck, contact' : 'Sectors: profile, projects, deck, contact'}
        >
          {sectors.map((sector, i) => (
            <b key={i} className={sector.on ? 'on' : ''}></b>
          ))}
        </span>
        
        {/* Chrono */}
        <span className="lap m" ref={lapsRef}>00:00</span>
        
        {/* Son */}
        <button 
          id="snd" 
          aria-label={lang === 'fr' ? 'Son' : 'Sound'} 
          onClick={handleSoundClick}
        >
          {lang === 'fr' ? 'Son : ' : 'Sound: '}{getSoundLabel(lang)}
        </button>
        
        {/* Mode calme */}
        <button 
          id="calm" 
          aria-pressed={document.body.classList.contains('calm')}
          title={lang === 'fr' ? 'Désactive les animations' : 'Disable animations'}
          onClick={handleCalmClick}
        >
          {lang === 'fr' ? 'Mode calme' : 'Calm mode'}
        </button>
        
        {/* Langue */}
        <button id="lg" aria-label={lang === 'fr' ? 'Langue' : 'Language'} onClick={handleLangClick}>
          {lang === 'fr' ? 'EN' : 'FR'}
        </button>
        
        {/* Thème */}
        <button id="th" aria-label={lang === 'fr' ? 'Thème' : 'Theme'} onClick={handleThemeClick}>
          ◐
        </button>
      </div>
    </header>
  );
}
