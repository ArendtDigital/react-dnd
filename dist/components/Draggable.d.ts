import React from 'react';
import { DraggableProvided, DraggableStateSnapshot } from '../types';
interface DraggableProps {
    draggableId: string;
    index: number;
    children: (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => React.ReactNode;
    type?: string;
    data?: any;
    isDragDisabled?: boolean;
    isShadow?: boolean;
    listId?: string;
    permanentShadows?: Record<string, any>;
}
export declare const Draggable: React.FC<DraggableProps>;
export {};
