import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import {
  DragDropContextValue,
  DragResult,
  DragStartResult,
  DragUpdateResult,
  DragMode,
  DragDropConfig,
  DragPreviewOptions,
} from '../types';

// Internal state interface
interface DragDropState {
  draggables: Map<string, DragDropConfig>;
  droppables: Map<string, any>;
  currentDrag: {
    draggableId: string;
    source: { droppableId: string; index: number };
    data?: any;
  } | null;
  dragPreview: {
    element: HTMLElement | null;
    offset: { x: number; y: number };
  } | null;
}

// Action types for the reducer
type DragDropAction =
  | { type: 'REGISTER_DRAGGABLE'; payload: DragDropConfig }
  | { type: 'UNREGISTER_DRAGGABLE'; payload: string }
  | { type: 'REGISTER_DROPPABLE'; payload: { id: string; config: any } }
  | { type: 'UNREGISTER_DROPPABLE'; payload: string }
  | { type: 'START_DRAG'; payload: { draggableId: string; source: { droppableId: string; index: number }; data?: any } }
  | { type: 'END_DRAG' }
  | { type: 'SET_DRAG_PREVIEW'; payload: { element: HTMLElement | null; offset: { x: number; y: number } } };

// Reducer for managing drag-and-drop state
const dragDropReducer = (state: DragDropState, action: DragDropAction): DragDropState => {
  switch (action.type) {
    case 'REGISTER_DRAGGABLE':
      return {
        ...state,
        draggables: new Map(state.draggables).set(action.payload.draggableId, action.payload),
      };
    
    case 'UNREGISTER_DRAGGABLE':
      const newDraggables = new Map(state.draggables);
      newDraggables.delete(action.payload);
      return {
        ...state,
        draggables: newDraggables,
      };
    
    case 'REGISTER_DROPPABLE':
      return {
        ...state,
        droppables: new Map(state.droppables).set(action.payload.id, action.payload.config),
      };
    
    case 'UNREGISTER_DROPPABLE':
      const newDroppables = new Map(state.droppables);
      newDroppables.delete(action.payload);
      return {
        ...state,
        droppables: newDroppables,
      };
    
    case 'START_DRAG':
      return {
        ...state,
        currentDrag: {
          draggableId: action.payload.draggableId,
          source: action.payload.source,
          data: action.payload.data,
        },
      };
    
    case 'END_DRAG':
      return {
        ...state,
        currentDrag: null,
        dragPreview: null,
      };
    
    case 'SET_DRAG_PREVIEW':
      return {
        ...state,
        dragPreview: {
          element: action.payload.element,
          offset: action.payload.offset,
        },
      };
    
    default:
      return state;
  }
};

// Create the context
const DragDropContext = createContext<DragDropContextValue | null>(null);

// Provider component
interface DragDropProviderProps {
  children: React.ReactNode;
  onDragEnd: (result: DragResult) => void;
  onDragStart?: (result: DragStartResult) => void;
  onDragUpdate?: (result: DragUpdateResult) => void;
  mode?: DragMode;
  enableDragPreview?: boolean;
  dragPreviewOptions?: DragPreviewOptions;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({
  children,
  onDragEnd,
  onDragStart,
  onDragUpdate,
  mode = DragMode.REORDER,
  enableDragPreview = true,
  dragPreviewOptions = {},
}) => {
  const [state, dispatch] = useReducer(dragDropReducer, {
    draggables: new Map(),
    droppables: new Map(),
    currentDrag: null,
    dragPreview: null,
  });

  // Memoized callbacks to prevent unnecessary re-renders
  const registerDraggable = useCallback((config: DragDropConfig) => {
    dispatch({ type: 'REGISTER_DRAGGABLE', payload: config });
  }, []);

  const unregisterDraggable = useCallback((draggableId: string) => {
    dispatch({ type: 'UNREGISTER_DRAGGABLE', payload: draggableId });
  }, []);

  const registerDroppable = useCallback((droppableId: string, config: any) => {
    dispatch({ type: 'REGISTER_DROPPABLE', payload: { id: droppableId, config } });
  }, []);

  const unregisterDroppable = useCallback((droppableId: string) => {
    dispatch({ type: 'UNREGISTER_DROPPABLE', payload: droppableId });
  }, []);

  const getDraggable = useCallback((draggableId: string) => {
    return state.draggables.get(draggableId);
  }, [state.draggables]);

  const getDroppable = useCallback((droppableId: string) => {
    return state.droppables.get(droppableId);
  }, [state.droppables]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo<DragDropContextValue>(() => ({
    mode,
    onDragStart,
    onDragUpdate,
    onDragEnd,
    enableDragPreview,
    dragPreviewOptions,
    registerDraggable,
    unregisterDraggable,
    registerDroppable,
    unregisterDroppable,
    getDraggable,
    getDroppable,
  }), [
    mode,
    onDragStart,
    onDragUpdate,
    onDragEnd,
    enableDragPreview,
    dragPreviewOptions,
    registerDraggable,
    unregisterDraggable,
    registerDroppable,
    unregisterDroppable,
    getDraggable,
    getDroppable,
  ]);

  return (
    <DragDropContext.Provider value={contextValue}>
      {children}
    </DragDropContext.Provider>
  );
};

// Custom hook to use the drag-and-drop context
export const useDragDropContext = (): DragDropContextValue => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDropContext must be used within a DragDropProvider');
  }
  return context;
};

// Export the context for advanced usage
export { DragDropContext }; 