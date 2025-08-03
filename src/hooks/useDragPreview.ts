import { useState, useCallback } from 'react';
import { DragPreviewState, DragPreview, MousePosition } from '../types/dragDrop';

const initialPreviewState: DragPreviewState = {
  mousePosition: { x: 0, y: 0 },
  dragPreview: null,
};

export function useDragPreview() {
  const [state, setState] = useState<DragPreviewState>(initialPreviewState);

  const updateMousePosition = useCallback((position: MousePosition) => {
    setState(prev => ({
      ...prev,
      mousePosition: position,
    }));
  }, []);

  const updateDragPreview = useCallback((preview: DragPreview | null) => {
    setState(prev => ({
      ...prev,
      dragPreview: preview,
    }));
  }, []);

  const updatePreviewPosition = useCallback((x: number, y: number) => {
    setState(prev => ({
      ...prev,
      mousePosition: { x, y },
      dragPreview: prev.dragPreview ? { ...prev.dragPreview, x, y } : null,
    }));
  }, []);

  const resetPreview = useCallback(() => {
    setState(initialPreviewState);
  }, []);

  return {
    state,
    updateMousePosition,
    updateDragPreview,
    updatePreviewPosition,
    resetPreview,
  };
} 