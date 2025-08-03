import { DragPreviewState, DragPreview, MousePosition } from '../types/dragDrop';
export declare function useDragPreview(): {
    state: DragPreviewState;
    updateMousePosition: (position: MousePosition) => void;
    updateDragPreview: (preview: DragPreview | null) => void;
    updatePreviewPosition: (x: number, y: number) => void;
    resetPreview: () => void;
};
