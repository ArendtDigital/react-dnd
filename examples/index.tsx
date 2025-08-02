// Examples index file - exports all available examples

export { default as BasicSortableList } from './basic-sortable-list';
export { default as WordBankExample } from './word-bank-example';
export { default as KanbanBoardExample } from './kanban-board-example';
export { default as UseDragDropHookExample } from './useDragDrop-hook-example';

// Example metadata for documentation
export const examples = {
  basicSortableList: {
    title: 'Basic Sortable List',
    description: 'Simple list reordering with drag and drop',
    component: 'BasicSortableList',
    difficulty: 'beginner',
    features: ['reorder', 'basic-drag-drop', 'list-management']
  },
  wordBank: {
    title: 'Word Bank',
    description: 'Drag words from a bank to a target area',
    component: 'WordBankExample',
    difficulty: 'intermediate',
    features: ['wordbank-mode', 'multi-zone', 'selection']
  },
  kanbanBoard: {
    title: 'Kanban Board',
    description: 'Multi-column task management board',
    component: 'KanbanBoardExample',
    difficulty: 'intermediate',
    features: ['multi-column', 'task-management', 'priority-indicators']
  },
  useDragDropHook: {
    title: 'useDragDrop Hook',
    description: 'Advanced drag and drop using the custom hook',
    component: 'UseDragDropHookExample',
    difficulty: 'advanced',
    features: ['custom-hook', 'file-organization', 'type-filtering']
  }
}; 