import { useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

/**
 * Hook que persiste arrays en localStorage.
 * Similar a useState pero con persistencia automática.
 */
export function usePersistentState<T>(key: string, initialValue: T) {
  const [persisted, setPersisted] = useLocalStorage<T>(key, initialValue);
  const [state, setState] = useState<T>(persisted);

  // Sincronizar cambios de state al localStorage
  useEffect(() => {
    setPersisted(state);
  }, [state, setPersisted]);

  return [state, setState] as const;
}
