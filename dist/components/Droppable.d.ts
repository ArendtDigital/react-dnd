import React from 'react';
import { DroppableProvided, DroppableStateSnapshot } from '../types';
interface DroppableProps {
    droppableId: string;
    children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactNode;
    type?: string;
    isDropDisabled?: boolean;
}
export declare const Droppable: React.FC<DroppableProps>;
export {};
