import React from 'react';
import { DragItem, PermanentShadow } from '../../types/dragDrop';
interface WordBankRendererProps {
    listId: string;
    items: DragItem[];
    draggedItem: any;
    insertIndex: number;
    permanentShadows: Record<string, PermanentShadow>;
    setPermanentShadows: (shadows: Record<string, PermanentShadow>) => void;
    onMouseDown: (e: React.MouseEvent, item: DragItem, index: number) => void;
}
declare const _default: React.NamedExoticComponent<WordBankRendererProps>;
export default _default;
