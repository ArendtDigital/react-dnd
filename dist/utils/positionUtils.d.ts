import { DragItem } from '../types/dragDrop';
export declare function findHoveredList(mouseX: number, mouseY: number, listRefs: Record<string, HTMLDivElement | null>): string | null;
export declare function calculateInsertionIndex(mouseX: number, mouseY: number, listElement: HTMLDivElement, items: DragItem[], styles: any): number;
export declare function isShadowModeAllowed(mode: string, sourceList: string, targetList: string): boolean;
