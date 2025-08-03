import { useState, useCallback } from 'react';
import { PermanentShadow } from '../types/dragDrop';

export function usePermanentShadows() {
  const [permanentShadows, setPermanentShadows] = useState<Record<string, PermanentShadow>>({});

  const addShadow = useCallback((itemId: string, shadow: PermanentShadow) => {
    setPermanentShadows(prev => ({
      ...prev,
      [itemId]: shadow,
    }));
  }, []);

  const removeShadow = useCallback((itemId: string) => {
    setPermanentShadows(prev => {
      const newShadows = { ...prev };
      delete newShadows[itemId];
      return newShadows;
    });
  }, []);

  const updateShadow = useCallback((itemId: string, updates: Partial<PermanentShadow>) => {
    setPermanentShadows(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], ...updates },
    }));
  }, []);

  const clearShadows = useCallback(() => {
    setPermanentShadows({});
  }, []);

  const hasShadow = useCallback((itemId: string) => {
    return !!permanentShadows[itemId];
  }, [permanentShadows]);

  const getShadow = useCallback((itemId: string) => {
    return permanentShadows[itemId];
  }, [permanentShadows]);

  return {
    permanentShadows,
    addShadow,
    removeShadow,
    updateShadow,
    clearShadows,
    hasShadow,
    getShadow,
  };
} 