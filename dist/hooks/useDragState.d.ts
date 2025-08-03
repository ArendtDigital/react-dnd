import { DragState, DragItem, DragPreview, ItemConnection } from '../types/dragDrop';
export declare function useDragState(): {
    state: DragState;
    startDrag: (item: DragItem, sourceList: string, originalIndex: number, preview: DragPreview) => void;
    updatePosition: (dragOverList: string | null, placeholderIndex: number | null) => void;
    endDrag: () => void;
    addConnection: (itemId: string, connection: ItemConnection) => void;
};
