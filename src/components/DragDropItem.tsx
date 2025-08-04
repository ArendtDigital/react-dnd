import React from 'react';
import { DragDropItemProps } from '../types/dragDrop';

const DragDropItem: React.FC<DragDropItemProps> = ({ 
  item, 
  listId, 
  index, 
  isDragging, 
  isSourceItem, 
  onMouseDown 
}) => {
  // Check if this is a word bank mode item (source item being dragged)
  const isWordBankDragging = isSourceItem && isDragging;
  
  return (
    <div
      className={`drag-drop-item ${isSourceItem ? 'drag-drop-source-item' : ''} ${isWordBankDragging ? 'wordbank-dragging' : ''}`}
      style={{
        backgroundColor: isWordBankDragging ? undefined : item.color,
        opacity: isWordBankDragging ? 1 : (isSourceItem ? 0.6 : 1),
        cursor: isSourceItem ? 'not-allowed' : 'grab',
      }}
      onMouseDown={(e) => onMouseDown(e, item, listId)}
    >
      <span className="drag-drop-item-text">{item.text}</span>
    </div>
  );
};

export default React.memo(DragDropItem); 