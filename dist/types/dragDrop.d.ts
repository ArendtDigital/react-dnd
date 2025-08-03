/// <reference types="react" />
export interface DragItem {
    id: string;
    text: string;
    color: string;
    isClone?: boolean;
    sourceList?: string;
}
export interface DragPreview {
    text: string;
    color: string;
    x: number;
    y: number;
}
export interface MousePosition {
    x: number;
    y: number;
}
export interface ItemPosition {
    index: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
}
export interface ItemConnection {
    originalList: string;
    originalIndex: number;
}
export interface PermanentShadow {
    text: string;
    color: string;
    originalIndex: number;
}
export interface DragState {
    draggedItem: DragItem | null;
    dragOverList: string | null;
    placeholderIndex: number | null;
    draggedItemOriginalIndex: number | null;
    itemConnections: Record<string, ItemConnection>;
}
export interface DragPreviewState {
    mousePosition: MousePosition;
    dragPreview: DragPreview | null;
}
export type DragMode = 'reorder' | 'noreorder' | 'wordbank';
export interface DragEndResult {
    draggableId: string;
    type: string;
    source: {
        droppableId: string;
        index: number;
    };
    destination: {
        droppableId: string;
        index: number;
    };
}
export interface Lists {
    [listId: string]: DragItem[];
}
export interface ListRefs {
    [listId: string]: HTMLDivElement | null;
}
export type DragAction = {
    type: 'START_DRAG';
    payload: {
        item: DragItem;
        sourceList: string;
        originalIndex: number;
        preview: DragPreview;
    };
} | {
    type: 'UPDATE_POSITION';
    payload: {
        dragOverList: string | null;
        placeholderIndex: number | null;
    };
} | {
    type: 'UPDATE_MOUSE';
    payload: MousePosition;
} | {
    type: 'UPDATE_PREVIEW';
    payload: DragPreview | null;
} | {
    type: 'END_DRAG';
} | {
    type: 'ADD_CONNECTION';
    payload: {
        itemId: string;
        connection: ItemConnection;
    };
};
export interface DragDropItemProps {
    item: DragItem;
    listId: string;
    index: number;
    isDragging: boolean;
    isSourceItem: boolean;
    onMouseDown: (e: React.MouseEvent, item: DragItem, listId: string) => void;
}
export interface DragDropListProps {
    listId: string;
    items: DragItem[];
    isDraggingOver: boolean;
    isSourceList: boolean;
    children: React.ReactNode;
}
export interface DragPreviewProps {
    preview: DragPreview;
}
export interface PlaceholderProps {
    text: string;
    isShadowMode: boolean;
}
export interface ShadowItemProps {
    text: string;
    isDraggingBackToShadow: boolean;
}
export interface CustomDragDropProps {
    lists: Lists;
    onDragEnd: (result: DragEndResult) => void;
    mode?: DragMode;
    permanentShadows?: Record<string, PermanentShadow>;
    setPermanentShadows?: (shadows: Record<string, PermanentShadow>) => void;
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
}
export interface DragStartResult {
    draggableId: string;
    type: string;
    source: {
        droppableId: string;
        index: number;
    };
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
}
export interface DragPreviewOptions {
    offsetX?: number;
    offsetY?: number;
    captureDraggingState?: boolean;
}
export interface DragDropConfig {
    mode?: DragMode;
    enableDragPreview?: boolean;
    enablePermanentShadows?: boolean;
    shadowModeAllowed?: boolean;
}
export interface DraggableProvided {
    draggableProps: {
        ref: (element: HTMLElement | null) => void;
        style?: React.CSSProperties;
        onMouseDown?: (event: React.MouseEvent) => void;
    };
    dragHandleProps?: {
        onMouseDown?: (event: React.MouseEvent) => void;
    };
}
export interface DraggableStateSnapshot {
    isDragging: boolean;
    draggingOver?: string;
    dragOffset?: Point;
}
export interface DroppableProvided {
    droppableProps: {
        ref: (element: HTMLElement | null) => void;
    };
}
export interface DroppableStateSnapshot {
    isDraggingOver: boolean;
    draggingOverWith?: string;
}
export interface Point {
    x: number;
    y: number;
}
export interface ValidationError {
    code: string;
    message: string;
    field?: string;
}
export interface DragDropPlugin {
    name: string;
    version: string;
    hooks?: string[];
    components?: string[];
}
export interface A11yProps {
    'aria-label'?: string;
    'aria-describedby'?: string;
    role?: string;
    tabIndex?: number;
}
export declare enum DragModeEnum {
    REORDER = "reorder",
    NO_REORDER = "noreorder",
    WORDBANK = "wordbank"
}
