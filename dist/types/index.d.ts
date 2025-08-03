/// <reference types="react" />
export interface Point {
    x: number;
    y: number;
}
export interface DragStartResult {
    draggableId: string;
    type: string;
    source: {
        droppableId: string;
        index: number;
    };
    data?: any;
}
export interface DragUpdateResult {
    draggableId: string;
    type: string;
    source: {
        droppableId: string;
        index: number;
    };
    destination?: {
        droppableId: string;
        index: number;
    };
    data?: any;
}
export interface DragResult {
    draggableId: string;
    type: string;
    source: {
        droppableId: string;
        index: number;
    };
    destination?: {
        droppableId: string;
        index: number;
    };
    reason: 'DROP' | 'CANCEL';
    data?: any;
}
export declare enum DragMode {
    REORDER = "reorder",
    NO_REORDER = "no-reorder",
    WORDBANK = "wordbank",
    CUSTOM = "custom"
}
export interface DragPreviewOptions {
    offsetX?: number;
    offsetY?: number;
    className?: string;
    style?: React.CSSProperties;
}
export interface DragDropConfig {
    draggableId: string;
    index: number;
    type?: string;
    data?: any;
    isDragDisabled?: boolean;
}
export interface DraggableProvided {
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: React.HTMLAttributes<HTMLElement>;
    dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}
export interface DraggableStateSnapshot {
    isDragging: boolean;
    draggingOver?: string;
    dragOffset?: Point;
}
export interface DroppableProvided {
    innerRef: (element: HTMLElement | null) => void;
    droppableProps: React.HTMLAttributes<HTMLElement>;
    placeholder?: React.ReactElement | null;
}
export interface DroppableStateSnapshot {
    isDraggingOver: boolean;
    draggingOverWith?: string;
    draggingFromThisWith?: string;
}
export interface DragDropContextValue {
    mode: DragMode;
    onDragStart?: (result: DragStartResult) => void;
    onDragUpdate?: (result: DragUpdateResult) => void;
    onDragEnd: (result: DragResult) => void;
    enableDragPreview: boolean;
    dragPreviewOptions: DragPreviewOptions;
    registerDraggable: (config: DragDropConfig) => void;
    unregisterDraggable: (draggableId: string) => void;
    registerDroppable: (droppableId: string, config: any) => void;
    unregisterDroppable: (droppableId: string) => void;
    getDraggable: (draggableId: string) => DragDropConfig | undefined;
    getDroppable: (droppableId: string) => any | undefined;
    permanentShadows: Record<string, any>;
    setPermanentShadows: (shadows: Record<string, any>) => void;
    addPermanentShadow: (id: string, shadow: any) => void;
    removePermanentShadow: (id: string) => void;
}
export type DragModeConfig = {
    [DragMode.REORDER]: {
        allowReorder: boolean;
    };
    [DragMode.NO_REORDER]: {
        allowReorder: false;
    };
    [DragMode.WORDBANK]: {
        allowMultiple: boolean;
    };
};
export interface ValidationError {
    field: string;
    message: string;
    code: string;
}
export interface DragDropPlugin {
    name: string;
    onDragStart?: (event: DragStartResult) => void;
    onDragUpdate?: (event: DragUpdateResult) => void;
    onDragEnd?: (event: DragResult) => void;
    onDrop?: (event: DragResult) => void;
}
export interface A11yProps {
    role: string;
    'aria-label': string;
    'aria-describedby'?: string;
    tabIndex?: number;
}
