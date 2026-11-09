import { useAppContext } from '../state/AppContext';

/**
 * Hook pour gérer le son
 * Crée AudioContext au premier appel (après un geste)
 * Niveau 0 = muet, 1 = gain .03 (bip), 2 = gain .09
 * @returns {Object} { soundLevel, setSoundLevel, toggleSound, beep, door }
 */
export function useSound() {
  const {
    soundLevel,
    setSoundLevel,
    toggleSound,
    beep,
    door,
    getSoundLabel,
    handleUserGesture
  } = useAppContext();
  return { soundLevel, setSoundLevel, toggleSound, beep, door, getSoundLabel, handleUserGesture };
}

export default useSound;
