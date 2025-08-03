import React from 'react';
import { DragDropContextValue, DragResult, DragStartResult, DragUpdateResult, DragMode, DragPreviewOptions } from '../types';
declare const DragDropContext: React.Context<DragDropContextValue | null>;
interface DragDropProviderProps {
    children: React.ReactNode;
    onDragEnd: (result: DragResult) => void;
    onDragStart?: (result: DragStartResult) => void;
    onDragUpdate?: (result: DragUpdateResult) => void;
    mode?: DragMode;
    enableDragPreview?: boolean;
    dragPreviewOptions?: DragPreviewOptions;
}
export declare const DragDropProvider: React.FC<DragDropProviderProps>;
export declare const useDragDropContext: () => DragDropContextValue;
export { DragDropContext };
