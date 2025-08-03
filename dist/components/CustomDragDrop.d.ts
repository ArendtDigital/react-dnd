import React from 'react';
interface DragItem {
    id: string;
    text: string;
    color: string;
}
interface Lists {
    [key: string]: DragItem[];
}
interface CustomDragDropProps {
    lists: Lists;
    onDragEnd: (result: any) => void;
    mode?: 'reorder' | 'noreorder' | 'wordbank';
    permanentShadows?: Record<string, any>;
    setPermanentShadows?: (shadows: Record<string, any>) => void;
}
declare const CustomDragDrop: React.FC<CustomDragDropProps>;
export default CustomDragDrop;
