import { useCallback, useRef, useState, useEffect } from 'react';
import { useDragDropContext } from '../contexts/DragDropContext';
import { DragDropConfig, Point } from '../types';
import { validateDragDropConfig } from '../utils/validation';

interface UseDragDropOptions {
  type: string;
  item: any;
  canDrag?: boolean | (() => boolean);
  canDrop?: boolean | ((item: any) => boolean);
  collect?: (monitor: DragDropMonitor) => any;
  preview?: boolean;
  previewOptions?: {
    offsetX?: number;
    offsetY?: number;
    className?: string;
  };
}

interface DragDropMonitor {
  isDragging: boolean;
  canDrag: boolean;
  canDrop: boolean;
  item: any;
  itemType: string;
  dragOffset: Point | null;
}

interface UseDragDropReturn {
  isDragging: boolean;
  canDrag: boolean;
  canDrop: boolean;
  dragRef: (element: HTMLElement | null) => void;
  dropRef: (element: HTMLElement | null) => void;
  dragHandleProps: React.HTMLAttributes<HTMLElement>;
  dropProps: React.HTMLAttributes<HTMLElement>;
  collectedProps: any;
}

export const useDragDrop = (options: UseDragDropOptions): UseDragDropReturn => {
  const context = useDragDropContext();
  const dragRef = useRef<HTMLElement | null>(null);
  const dropRef = useRef<HTMLElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Point | null>(null);
  const [isOverDropZone, setIsOverDropZone] = useState(false);

  // Memoized configuration
  const config = useCallback((): DragDropConfig => ({
    draggableId: `drag-${Math.random().toString(36).substr(2, 9)}`,
    index: 0,
    type: options.type,
    data: options.item,
    isDragDisabled: typeof options.canDrag === 'function' ? !options.canDrag() : !options.canDrag,
  }), [options.type, options.item, options.canDrag]);

  // Auto-register with validation
  useEffect(() => {
    const dragConfig = config();
    
    if (process.env.NODE_ENV === 'development') {
      const errors = validateDragDropConfig(dragConfig);
      if (errors.length > 0) {
        console.error('useDragDrop validation errors:', errors);
        return;
      }
    }

    context.registerDraggable(dragConfig);

    return () => {
      context.unregisterDraggable(dragConfig.draggableId);
    };
  }, [config, context]);

  // Drag event handlers
  const handleDragStart = useCallback((event: React.MouseEvent) => {
    const canDrag = typeof options.canDrag === 'function' ? options.canDrag() : options.canDrag;
    if (!canDrag || event.button !== 0) return;

    const element = dragRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);

    if (context.onDragStart) {
      context.onDragStart({
        draggableId: config().draggableId,
        type: options.type,
        source: { droppableId: 'unknown', index: 0 },
        data: options.item,
      });
    }
  }, [options, context, config]);

  const handleDragMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !dragOffset) return;

    // Check if over drop zone
    const dropElement = dropRef.current;
    if (dropElement) {
      const rect = dropElement.getBoundingClientRect();
      const isOver = (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      );
      setIsOverDropZone(isOver);
    }

    if (context.onDragUpdate) {
      context.onDragUpdate({
        draggableId: config().draggableId,
        type: options.type,
        source: { droppableId: 'unknown', index: 0 },
        data: options.item,
      });
    }
  }, [isDragging, dragOffset, context, config, options]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    setDragOffset(null);
    setIsOverDropZone(false);

    context.onDragEnd({
      draggableId: config().draggableId,
      type: options.type,
      source: { droppableId: 'unknown', index: 0 },
      destination: isOverDropZone ? { droppableId: 'drop-zone', index: 0 } : undefined,
      reason: isOverDropZone ? 'DROP' : 'CANCEL',
      data: options.item,
    });
  }, [isDragging, context, config, options, isOverDropZone]);

  // Global event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Monitor for collect function
  const monitor: DragDropMonitor = {
    isDragging,
    canDrag: typeof options.canDrag === 'function' ? options.canDrag() : !!options.canDrag,
    canDrop: typeof options.canDrop === 'function' ? options.canDrop(options.item) : !!options.canDrop,
    item: options.item,
    itemType: options.type,
    dragOffset,
  };

  // Collected props from collect function
  const collectedProps = options.collect ? options.collect(monitor) : {};

  // Memoized return values
  const dragRefCallback = useCallback((element: HTMLElement | null) => {
    dragRef.current = element;
  }, []);

  const dropRefCallback = useCallback((element: HTMLElement | null) => {
    dropRef.current = element;
  }, []);

  const dragHandleProps = useCallback((): React.HTMLAttributes<HTMLElement> => ({
    onMouseDown: handleDragStart,
    style: {
      cursor: monitor.canDrag ? 'grab' : 'default',
      userSelect: 'none',
    },
  }), [handleDragStart, monitor.canDrag]);

  const dropProps = useCallback((): React.HTMLAttributes<HTMLElement> => ({
    style: {
      minHeight: '50px',
      border: isOverDropZone ? '2px dashed #4caf50' : '2px dashed transparent',
      transition: 'border-color 0.2s ease',
    },
  }), [isOverDropZone]);

  return {
    isDragging,
    canDrag: monitor.canDrag,
    canDrop: monitor.canDrop,
    dragRef: dragRefCallback,
    dropRef: dropRefCallback,
    dragHandleProps: dragHandleProps(),
    dropProps: dropProps(),
    collectedProps,
  };
}; 