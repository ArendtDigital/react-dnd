import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useDragDropContext } from '../contexts/DragDropContext';
import { 
  DroppableProvided, 
  DroppableStateSnapshot 
} from '../types';
import { validateDroppableConfig } from '../utils/validation';

interface DroppableProps {
  droppableId: string;
  children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactNode;
  type?: string;
  isDropDisabled?: boolean;
}

export const Droppable: React.FC<DroppableProps> = React.memo(({
  droppableId,
  children,
  type = 'default',
  isDropDisabled = false,
}) => {
  const context = useDragDropContext();
  const elementRef = useRef<HTMLElement | null>(null);
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);
  const [draggingOverWith, setDraggingOverWith] = React.useState<string | undefined>(undefined);
  const [draggingFromThisWith, setDraggingFromThisWith] = React.useState<string | undefined>(undefined);

  // Memoized configuration to prevent unnecessary re-registrations
  const config = useMemo(() => ({
    type,
    isDropDisabled,
  }), [type, isDropDisabled]);

  // Auto-register and unregister with validation
  useEffect(() => {
    // Validate configuration in development
    if (process.env.NODE_ENV === 'development') {
      const errors = validateDroppableConfig(droppableId, config);
      if (errors.length > 0) {
        console.error('Droppable validation errors:', errors);
        return;
      }
    }

    context.registerDroppable(droppableId, config);

    // Auto-cleanup on unmount
    return () => {
      context.unregisterDroppable(droppableId);
    };
  }, [droppableId, config, context]);

  // Drop zone detection
  const isPointInDropZone = useCallback((point: { x: number; y: number }) => {
    const element = elementRef.current;
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return (
      point.x >= rect.left &&
      point.x <= rect.right &&
      point.y >= rect.top &&
      point.y <= rect.bottom
    );
  }, []);

  // Calculate drop index
  const calculateDropIndex = useCallback((point: { x: number; y: number }) => {
    const element = elementRef.current;
    if (!element) return 0;

    const rect = element.getBoundingClientRect();
    const relativeY = point.y - rect.top;
    
    // Simple vertical index calculation
    // In a real implementation, you'd want to calculate based on child elements
    const childHeight = 50; // Default child height
    return Math.floor(relativeY / childHeight);
  }, []);

  // Global mouse move handler for drop detection
  const handleGlobalMouseMove = useCallback((event: MouseEvent) => {
    const point = { x: event.clientX, y: event.clientY };
    
    if (isPointInDropZone(point)) {
      if (!isDraggingOver) {
        setIsDraggingOver(true);
        // You would set draggingOverWith based on the current drag
        setDraggingOverWith('current-drag-id');
      }
    } else {
      if (isDraggingOver) {
        setIsDraggingOver(false);
        setDraggingOverWith(undefined);
      }
    }
  }, [isPointInDropZone, isDraggingOver]);

  // Global mouse up handler for drop
  const handleGlobalMouseUp = useCallback((event: MouseEvent) => {
    if (isDraggingOver && !isDropDisabled) {
      const point = { x: event.clientX, y: event.clientY };
      const dropIndex = calculateDropIndex(point);
      
      // Call onDragEnd with proper destination
      context.onDragEnd({
        draggableId: 'current-drag-id', // This should come from context
        type,
        source: { droppableId: 'source-droppable', index: 0 }, // This should come from context
        destination: { droppableId, index: dropIndex },
        reason: 'DROP',
      });
    }
    
    setIsDraggingOver(false);
    setDraggingOverWith(undefined);
  }, [isDraggingOver, isDropDisabled, calculateDropIndex, context, droppableId, type]);

  // Global event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleGlobalMouseMove, handleGlobalMouseUp]);

  // Memoized provided props to prevent unnecessary re-renders
  const provided = useMemo<DroppableProvided>(() => ({
    innerRef: (element: HTMLElement | null) => {
      elementRef.current = element;
    },
    droppableProps: {
      style: {
        minHeight: '50px',
        border: isDraggingOver ? '2px dashed #4caf50' : '2px dashed transparent',
        transition: 'border-color 0.2s ease',
      },
    },
    placeholder: isDraggingOver ? (
      <div style={{ 
        height: '50px', 
        border: '2px dashed #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
      }}>
        Drop here
      </div>
    ) : null,
  }), [isDraggingOver]);

  // Memoized snapshot to prevent unnecessary re-renders
  const snapshot = useMemo<DroppableStateSnapshot>(() => ({
    isDraggingOver,
    draggingOverWith,
    draggingFromThisWith,
  }), [isDraggingOver, draggingOverWith, draggingFromThisWith]);

  return <>{children(provided, snapshot)}</>;
});

// Add display name for better debugging
Droppable.displayName = 'Droppable'; 