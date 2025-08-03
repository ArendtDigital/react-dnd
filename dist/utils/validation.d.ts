import { DragDropConfig, ValidationError } from '../types';
export declare const validateDragDropConfig: (config: DragDropConfig) => ValidationError[];
export declare const validateDroppableConfig: (droppableId: string, config: any) => ValidationError[];
export declare const validateDragResult: (result: any) => ValidationError[];
export declare const formatValidationErrors: (errors: ValidationError[]) => string;
export declare const throwValidationErrors: (errors: ValidationError[], context: string) => void;
export declare const withValidation: <T extends any[], R>(validator: (...args: T) => ValidationError[], fn: (...args: T) => R) => (...args: T) => R;
export declare const createValidationMiddleware: () => {
    validateDraggable: (config: DragDropConfig) => boolean;
    validateDroppable: (droppableId: string, config: any) => boolean;
    validateDragResult: (result: any) => boolean;
};
