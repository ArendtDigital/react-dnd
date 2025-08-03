import { useRef, useCallback } from 'react';
import { ListRefs } from '../types/dragDrop';

export function useListRefs() {
  const listRefs = useRef<ListRefs>({});

  const setListRef = useCallback((listId: string, element: HTMLDivElement | null) => {
    listRefs.current[listId] = element;
  }, []);

  const getListRef = useCallback((listId: string) => {
    return listRefs.current[listId];
  }, []);

  const getAllListRefs = useCallback(() => {
    return listRefs.current;
  }, []);

  const clearListRefs = useCallback(() => {
    listRefs.current = {};
  }, []);

  return {
    listRefs: listRefs.current,
    setListRef,
    getListRef,
    getAllListRefs,
    clearListRefs,
  };
} 