import React from 'react';
import { DragItem } from '../../types/dragDrop';
interface NoReorderRendererProps {
    listId: string;
    items: DragItem[];
    draggedItem: DragItem | null;
    insertIndex: number | null;
    isSourceList: boolean;
    onMouseDown: (e: React.MouseEvent, item: DragItem, listId: string) => void;
}
declare const _default: React.NamedExoticComponent<NoReorderRendererProps>;
export default _default;
