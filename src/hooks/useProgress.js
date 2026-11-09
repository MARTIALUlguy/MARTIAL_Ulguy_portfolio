import { useAppContext, useRevLightsContext } from '../state/AppContext';

/**
 * Hook pour gérer les secteurs de progression.
 * @returns {Object} { seen, updateSeen, sectors, allSectorsOn }
 */
export function useProgress() {
  const {
    seen,
    updateSeen,
    sectors,
    allSectorsOn
  } = useAppContext();
  return { seen, updateSeen, sectors, allSectorsOn };
}

export function useRevLights() {
  return useRevLightsContext();
}

export default useProgress;
