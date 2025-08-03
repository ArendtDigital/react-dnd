import { useReducer, useCallback, useRef } from 'react';
import { DragState, DragAction, DragItem, DragPreview, ItemConnection } from '../types/dragDrop';

const initialDragState: DragState = {
  draggedItem: null,
  dragOverList: null,
  placeholderIndex: null,
  draggedItemOriginalIndex: null,
  itemConnections: {},
};

function dragReducer(state: DragState, action: DragAction): DragState {
  switch (action.type) {
    case 'START_DRAG':
      return {
        ...state,
        draggedItem: { ...action.payload.item, sourceList: action.payload.sourceList },
        draggedItemOriginalIndex: action.payload.originalIndex,
      };
    
    case 'UPDATE_POSITION':
      return {
        ...state,
        dragOverList: action.payload.dragOverList,
        placeholderIndex: action.payload.placeholderIndex,
      };
    
    case 'END_DRAG':
      return {
        ...initialDragState,
        itemConnections: state.itemConnections, // Preserve connections
      };
    
    case 'ADD_CONNECTION':
      return {
        ...state,
        itemConnections: {
          ...state.itemConnections,
          [action.payload.itemId]: action.payload.connection,
        },
      };
    
    default:
      return state;
  }
}

export function useDragState() {
  const [state, dispatch] = useReducer(dragReducer, initialDragState);
  const lastUpdateRef = useRef({ listId: null as string | null, index: null as number | null });
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startDrag = useCallback((item: DragItem, sourceList: string, originalIndex: number, preview: DragPreview) => {
    dispatch({
      type: 'START_DRAG',
      payload: { item, sourceList, originalIndex, preview },
    });
  }, []);

  const updatePosition = useCallback((dragOverList: string | null, placeholderIndex: number | null) => {
    // Only update if the position actually changed significantly
    const lastUpdate = lastUpdateRef.current;
    const hasChanged = lastUpdate.listId !== dragOverList || lastUpdate.index !== placeholderIndex;
    
    if (hasChanged) {
      // Clear any pending timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      // Debounce the update to prevent rapid changes
      updateTimeoutRef.current = setTimeout(() => {
        dispatch({
          type: 'UPDATE_POSITION',
          payload: { dragOverList, placeholderIndex },
        });
        lastUpdateRef.current = { listId: dragOverList, index: placeholderIndex };
      }, 16); // ~60fps
    }
  }, []);

  const endDrag = useCallback(() => {
    // Clear any pending updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    dispatch({ type: 'END_DRAG' });
    lastUpdateRef.current = { listId: null, index: null };
  }, []);

  const addConnection = useCallback((itemId: string, connection: ItemConnection) => {
    dispatch({
      type: 'ADD_CONNECTION',
      payload: { itemId, connection },
    });
  }, []);

  return {
    state,
    startDrag,
    updatePosition,
    endDrag,
    addConnection,
  };
} 