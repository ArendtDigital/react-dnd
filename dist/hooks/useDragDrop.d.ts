/// <reference types="react" />
import { Point } from '../types';
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
export declare const useDragDrop: (options: UseDragDropOptions) => UseDragDropReturn;
export {};
