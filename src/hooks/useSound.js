import { useState, useCallback, useRef } from 'react';

/**
 * Hook pour gérer le son
 * Crée AudioContext au premier appel (après un geste)
 * Niveau 0 = muet, 1 = gain .03 (bip), 2 = gain .09
 * @returns {Object} { soundLevel, setSoundLevel, toggleSound, beep, door }
 */
export function useSound() {
  const isTestEnv = typeof window === 'undefined' || !window.AudioContext;
  
  const [soundLevel, setSoundLevel] = useState(1); // 0 = coupé, 1 = doux, 2 = fort
  const audioContextRef = useRef(null);
  const isUnlockedRef = useRef(false);

  // Vérifier si AudioContext est disponible
  const unlockAudio = useCallback(() => {
    if (isTestEnv || isUnlockedRef.current) return;
    
    try {
      // Créer AudioContext uniquement après un geste utilisateur
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        // Débloquer l'audio context (nécessaire sur certains navigateurs)
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
      }
      isUnlockedRef.current = true;
    } catch {
      // AudioContext non disponible
      isUnlockedRef.current = false;
    }
  }, [isTestEnv]);

  // Bip simple
  const beep = useCallback((freq = 520, dur = 0.08) => {
    if (isTestEnv || soundLevel === 0 || !isUnlockedRef.current) return;
    
    try {
      if (!audioContextRef.current) {
        // Si AudioContext n'existe pas encore, essayer de le créer
        unlockAudio();
        if (!audioContextRef.current) return;
      }
      
      const ac = audioContextRef.current;
      const now = ac.currentTime;
      
      const oscillator = ac.createOscillator();
      const gainNode = ac.createGain();
      
      oscillator.frequency.value = freq;
      gainNode.gain.value = soundLevel === 1 ? 0.03 : 0.09;
      
      oscillator.connect(gainNode);
      gainNode.connect(ac.destination);
      
      oscillator.start(now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      oscillator.stop(now + dur);
    } catch {
      // Ignorer les erreurs (AudioContext peut être bloqué)
    }
  }, [soundLevel, isTestEnv, unlockAudio]);

  // Bruit de porte (intro)
  const door = useCallback(() => {
    if (isTestEnv || soundLevel === 0 || !isUnlockedRef.current) return;
    
    try {
      if (!audioContextRef.current) {
        unlockAudio();
        if (!audioContextRef.current) return;
      }
      
      const ac = audioContextRef.current;
      const now = ac.currentTime;
      const v = soundLevel === 1 ? 0.05 : 0.14;
      
      // 1. Bruit blanc filtré passe-bas
      const buffer = ac.createBuffer(1, ac.sampleRate * 1.3, ac.sampleRate);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < channelData.length; i++) {
        channelData[i] = Math.random() * 2 - 1;
      }
      
      const noise = ac.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ac.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + 1.1);
      
      const gain = ac.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(v, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);
      
      noise.start(now);
      noise.stop(now + 1.25);
      
      // 2. Oscillateur dent-de-scie
      const oscillator = ac.createOscillator();
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(55, now);
      oscillator.frequency.linearRampToValueAtTime(95, now + 1.1);
      
      const gain2 = ac.createGain();
      gain2.gain.setValueAtTime(v / 4, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      
      oscillator.connect(gain2);
      gain2.connect(ac.destination);
      
      oscillator.start(now);
      oscillator.stop(now + 1.25);
      
      // 3. Bip final à 1.15s
      setTimeout(() => {
        beep(140, 0.12);
      }, 1150);
      
    } catch {
      // Ignorer les erreurs
    }
  }, [soundLevel, isTestEnv, beep, unlockAudio]);

  // Toggle entre les niveaux de son
  const toggleSound = useCallback(() => {
    setSoundLevel(prev => (prev + 1) % 3);
  }, []);

  // Label pour afficher le niveau de son
  const getSoundLabel = useCallback((lang = 'fr') => {
    const labels = {
      fr: ['coupé', 'doux', 'fort'],
      en: ['off', 'soft', 'loud']
    };
    return labels[lang][soundLevel];
  }, [soundLevel]);

  // Déverrouiller l'audio (à appeler après un clic/gest)
  const handleUserGesture = useCallback(() => {
    unlockAudio();
  }, [unlockAudio]);

  return {
    soundLevel,
    setSoundLevel,
    toggleSound,
    beep,
    door,
    getSoundLabel,
    handleUserGesture
  };
}

export default useSound;
