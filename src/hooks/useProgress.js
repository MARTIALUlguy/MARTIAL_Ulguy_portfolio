import { useAppContext } from '../state/AppContext';

/**
 * Hook pour gérer la progression de scroll et les secteurs
 * @returns {Object} { scrollProgress, seen, updateSeen, revLights, sectors }
 */
export function useProgress() {
  const {
    scrollProgress,
    seen,
    updateSeen,
    revLights,
    sectors,
    allSectorsOn
  } = useAppContext();
  return { scrollProgress, seen, updateSeen, revLights, sectors, allSectorsOn };
}

export default useProgress;
