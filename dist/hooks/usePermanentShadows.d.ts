import { PermanentShadow } from '../types/dragDrop';
export declare function usePermanentShadows(): {
    permanentShadows: Record<string, PermanentShadow>;
    addShadow: (itemId: string, shadow: PermanentShadow) => void;
    removeShadow: (itemId: string) => void;
    updateShadow: (itemId: string, updates: Partial<PermanentShadow>) => void;
    clearShadows: () => void;
    hasShadow: (itemId: string) => true;
    getShadow: (itemId: string) => PermanentShadow;
};
