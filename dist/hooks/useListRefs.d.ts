import { ListRefs } from '../types/dragDrop';
export declare function useListRefs(): {
    listRefs: ListRefs;
    setListRef: (listId: string, element: HTMLDivElement | null) => void;
    getListRef: (listId: string) => HTMLDivElement | null;
    getAllListRefs: () => ListRefs;
    clearListRefs: () => void;
};
