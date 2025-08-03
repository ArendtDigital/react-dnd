import React from 'react';
import { DragDropListProps } from '../types/dragDrop';

const DragDropList: React.FC<DragDropListProps> = ({ 
  listId, 
  items, 
  isDraggingOver, 
  isSourceList, 
  children 
}) => {
  const getListTitle = (listId: string) => {
    switch (listId) {
      case 'list1': return 'Articles & Pronouns';
      case 'list2': return 'Nouns';
      case 'list3': return 'Verbs';
      case 'paragraph': return 'Sample Paragraph';
      case 'sentence': return 'Build Your Sentence';
      case 'wordBank': return 'Word Bank';
      default: return listId;
    }
  };

  return (
    <div className="drag-drop-list-container">
      <h3 className="drag-drop-list-title">
        {getListTitle(listId)}
        {isSourceList && (
          <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '0.5rem' }}>
            (Source - drag to other lists)
          </span>
        )}
      </h3>
      <div 
        className={`drag-drop-list ${isDraggingOver ? 'drag-drop-dragging-over' : ''} ${
          isSourceList ? 'drag-drop-source-list' : ''
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default React.memo(DragDropList); 