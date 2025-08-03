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
  return (
    <div
      className={`drag-drop-item ${isSourceItem ? 'drag-drop-source-item' : ''}`}
      style={{
        backgroundColor: item.color,
        opacity: isSourceItem ? 0.6 : 1,
        cursor: isSourceItem ? 'not-allowed' : 'grab',
      }}
      onMouseDown={(e) => onMouseDown(e, item, listId)}
    >
      <span className="drag-drop-item-text">{item.text}</span>
    </div>
  );
};

export default React.memo(DragDropItem); 