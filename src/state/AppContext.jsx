import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { t as translate } from '../data/i18n';

const AppContext = createContext(null);

function getSystemTheme() {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export function AppProvider({ children }) {
  const [lang, setLangState] = useState('fr');
  const [theme, setThemeState] = useState(getSystemTheme);
  const [soundLevel, setSoundLevel] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [seen, setSeen] = useState({ 0: 1, 1: 0, c: 0, k: 0 });
  const audioContextRef = useRef(null);
  const audioUnlockedRef = useRef(false);
  const audioUnavailableRef = useRef(false);
  const doorTimerRef = useRef(null);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setLang = useCallback((nextLang) => {
    setLangState(nextLang);
  }, []);

  const t = useCallback((key) => translate(key, lang), [lang]);

  const toggleLang = useCallback(() => {
    setLangState(current => current === 'fr' ? 'en' : 'fr');
  }, []);

  const setTheme = useCallback((nextTheme) => {
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(current => current === 'light' ? 'dark' : 'light');
  }, []);

  const toggleSound = useCallback(() => {
    setSoundLevel(current => (current + 1) % 3);
  }, []);

  const handleUserGesture = useCallback(() => {
    if (audioContextRef.current) {
      audioUnlockedRef.current = true;
      return;
    }

    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (typeof AudioContextConstructor !== 'function') {
      if (!audioUnavailableRef.current) {
        console.warn('Web Audio API is not supported; sounds are unavailable.');
        audioUnavailableRef.current = true;
      }
      return;
    }

    const audioContext = new AudioContextConstructor();
    audioContextRef.current = audioContext;
    audioUnlockedRef.current = true;

    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(error => {
        console.error('Unable to resume the audio context.', error);
      });
    }
  }, []);

  const beep = useCallback((frequency = 520, duration = 0.08) => {
    if (soundLevel === 0) return;
    if (!audioUnlockedRef.current) {
      handleUserGesture();
    }

    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.frequency.value = frequency;
    gainNode.gain.value = soundLevel === 1 ? 0.03 : 0.09;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.stop(now + duration);
  }, [handleUserGesture, soundLevel]);

  const door = useCallback(() => {
    if (soundLevel === 0 || !audioUnlockedRef.current) return;

    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const now = audioContext.currentTime;
    const volume = soundLevel === 1 ? 0.05 : 0.14;
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 1.3, audioContext.sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < channelData.length; i++) {
      channelData[i] = Math.random() * 2 - 1;
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;

    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, now);
    filter.frequency.exponentialRampToValueAtTime(1600, now + 1.1);

    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    noise.start(now);
    noise.stop(now + 1.25);

    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(55, now);
    oscillator.frequency.linearRampToValueAtTime(95, now + 1.1);

    const oscillatorGain = audioContext.createGain();
    oscillatorGain.gain.setValueAtTime(volume / 4, now);
    oscillatorGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    oscillator.connect(oscillatorGain);
    oscillatorGain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 1.25);

    window.clearTimeout(doorTimerRef.current);
    doorTimerRef.current = window.setTimeout(() => beep(140, 0.12), 1150);
  }, [beep, soundLevel]);

  const getSoundLabel = useCallback((labelLang = 'fr') => {
    const labels = {
      fr: ['coupé', 'doux', 'fort'],
      en: ['off', 'soft', 'loud']
    };
    return labels[labelLang][soundLevel];
  }, [soundLevel]);

  const updateSeen = useCallback((key) => {
    setSeen(current => ({ ...current, [key]: 1 }));
  }, []);

  const updateScrollProgress = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
    setScrollProgress(Math.max(0, Math.min(1, progress)));
  }, []);

  useEffect(() => {
    let frameId;
    let framePending = false;

    const handleScroll = () => {
      if (framePending) return;
      framePending = true;
      frameId = window.requestAnimationFrame(() => {
        framePending = false;
        updateScrollProgress();
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (framePending) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [updateScrollProgress]);

  useEffect(() => () => {
    window.clearTimeout(doorTimerRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
  }, []);

  const revLights = useCallback(() => {
    const litCount = 1 + Math.round(scrollProgress * 9);
    return Array.from({ length: 10 }, (_, index) => {
      const on = index < litCount;
      const color = index < 4 ? 'g' : index < 7 ? 'r' : 'b';
      return { on, class: on ? color : '' };
    });
  }, [scrollProgress]);

  const sectors = useCallback(() => (
    ['0', '1', 'c', 'k'].map(key => ({ on: !!seen[key] }))
  ), [seen]);

  const allSectorsOn = useCallback(() => (
    ['0', '1', 'c', 'k'].every(key => !!seen[key])
  ), [seen]);

  const value = useMemo(() => ({
    lang,
    setLang,
    t,
    toggleLang,
    theme,
    setTheme,
    toggleTheme,
    soundLevel,
    setSoundLevel,
    toggleSound,
    getSoundLabel,
    handleUserGesture,
    beep,
    door,
    scrollProgress,
    seen,
    updateSeen,
    revLights,
    sectors,
    allSectorsOn
  }), [
    lang, setLang, t, toggleLang, theme, setTheme, toggleTheme,
    soundLevel, toggleSound, getSoundLabel, handleUserGesture, beep, door,
    scrollProgress, seen, updateSeen, revLights, sectors, allSectorsOn
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('App hooks must be used within an AppProvider.');
  }
  return context;
}
