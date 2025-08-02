// Main exports for the React-DND library

// Core components
export { DragDropProvider } from './contexts/DragDropContext';
export { Draggable } from './components/Draggable';
export { Droppable } from './components/Droppable';

// Hooks
export { useDragDrop } from './hooks/useDragDrop';
export { useDragDropContext } from './contexts/DragDropContext';

// Types
export type {
  DragResult,
  DragStartResult,
  DragUpdateResult,
  DragMode,
  DragPreviewOptions,
  DragDropConfig,
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DroppableStateSnapshot,
  Point,
  ValidationError,
  DragDropPlugin,
  A11yProps,
} from './types';

// Enums
export { DragMode } from './types';

// Utilities
export { validateDragDropConfig, validateDroppableConfig, validateDragResult } from './utils/validation';
export { createValidationMiddleware } from './utils/validation'; 