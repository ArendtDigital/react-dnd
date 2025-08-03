import React from 'react';
import { DragItem } from '../../types/dragDrop';
interface ReorderRendererProps {
    listId: string;
    items: DragItem[];
    draggedItem: DragItem | null;
    insertIndex: number | null;
    onMouseDown: (e: React.MouseEvent, item: DragItem, listId: string) => void;
}
declare const _default: React.NamedExoticComponent<ReorderRendererProps>;
export default _default;
