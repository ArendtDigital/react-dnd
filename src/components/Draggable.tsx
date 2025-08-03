import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useDragDropContext } from '../contexts/DragDropContext';
import { 
  DraggableProvided, 
  DraggableStateSnapshot, 
  DragDropConfig,
  Point
} from '../types';
import { validateDragDropConfig } from '../utils/validation';

interface DraggableProps {
  draggableId: string;
  index: number;
  children: (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => React.ReactNode;
  type?: string;
  data?: any;
  isDragDisabled?: boolean;
  isShadow?: boolean;
  listId?: string;
  permanentShadows?: Record<string, any>;
}

export const Draggable: React.FC<DraggableProps> = React.memo(({
  draggableId,
  index,
  children,
  type = 'default',
  data,
  isDragDisabled = false,
  isShadow = false,
  listId,
  permanentShadows,
}) => {
  const context = useDragDropContext();
  const elementRef = useRef<HTMLElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState<{ x: number; y: number } | null>(null);

  // Memoized configuration to prevent unnecessary re-registrations
  const config = useMemo<DragDropConfig>(() => ({
    draggableId,
    index,
    type,
    data,
    isDragDisabled,
  }), [draggableId, index, type, data, isDragDisabled]);

  // Auto-register and unregister with validation
  useEffect(() => {
    // Validate configuration in development
    if (process.env.NODE_ENV === 'development') {
      const errors = validateDragDropConfig(config);
      if (errors.length > 0) {
        console.error('Draggable validation errors:', errors);
        return;
      }
    }

    context.registerDraggable(config);

    // Auto-cleanup on unmount
    return () => {
      context.unregisterDraggable(draggableId);
    };
  }, [config, context, draggableId]);

  // Drag event handlers
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (isDragDisabled || event.button !== 0) return; // Only left mouse button

    const element = elementRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);

    // Call onDragStart if provided
    if (context.onDragStart) {
      context.onDragStart({
        draggableId,
        type,
        source: { droppableId: 'unknown', index }, // Will be updated by droppable
        data,
      });
    }
  }, [isDragDisabled, context, draggableId, type, index, data]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !dragOffset) return;

    // Update drag preview position
    const newX = event.clientX - dragOffset.x;
    const newY = event.clientY - dragOffset.y;

    // Call onDragUpdate if provided
    if (context.onDragUpdate) {
      context.onDragUpdate({
        draggableId,
        type,
        source: { droppableId: 'unknown', index },
        destination: undefined, // Will be calculated by droppable
        data,
      });
    }
  }, [isDragging, dragOffset, context, draggableId, type, index, data]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    setDragOffset(null);

    // Call onDragEnd
    context.onDragEnd({
      draggableId,
      type,
      source: { droppableId: 'unknown', index },
      reason: 'DROP',
      data,
    });
  }, [isDragging, context, draggableId, type, index, data]);

  // Global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Memoized provided props to prevent unnecessary re-renders
  const provided = useMemo<DraggableProvided>(() => ({
    innerRef: (element: HTMLElement | null) => {
      elementRef.current = element;
    },
    draggableProps: {
      onMouseDown: handleMouseDown,
      style: isDragging ? {
        opacity: 0.5,
        transform: dragOffset ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` : undefined,
        pointerEvents: 'none',
      } : undefined,
    },
    dragHandleProps: {
      onMouseDown: handleMouseDown,
      style: { cursor: isDragDisabled ? 'default' : 'grab' },
    },
  }), [handleMouseDown, isDragging, dragOffset, isDragDisabled]);

  // Memoized snapshot to prevent unnecessary re-renders
  const snapshot = useMemo<DraggableStateSnapshot>(() => ({
    isDragging,
    draggingOver: undefined, // Will be updated by droppable
    dragOffset: dragOffset || undefined,
  }), [isDragging, dragOffset]);

  // Render shadow if this is a shadow item in word bank mode
  if (isShadow && listId === 'wordBank' && permanentShadows && permanentShadows[draggableId]) {
    const shadowData = permanentShadows[draggableId];
    
    return (
      <div
        style={{
          backgroundColor: 'hsl(0, 0%, 10%)',
          border: 'none',
          borderRadius: '6px',
          padding: '0.25rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          color: 'hsl(0, 0%, 10%)',
          pointerEvents: 'none',
          minWidth: 'fit-content',
          height: '40px',
          whiteSpace: 'nowrap',
          margin: '0 0.25rem',
          position: 'relative',
          flexShrink: 0,
          boxSizing: 'border-box',
        }}
      >
        <span style={{
          fontWeight: '600',
          fontSize: '0.85rem',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}>
          {shadowData.text || data?.text}
        </span>
      </div>
    );
  }

  return <>{children(provided, snapshot)}</>;
});

// Add display name for better debugging
Draggable.displayName = 'Draggable'; 