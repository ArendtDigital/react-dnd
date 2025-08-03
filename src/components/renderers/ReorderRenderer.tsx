import React from 'react';
import { DragItem } from '../../types/dragDrop';
import DragDropItem from '../DragDropItem';
import Placeholder from '../Placeholder';

interface ReorderRendererProps {
  listId: string;
  items: DragItem[];
  draggedItem: DragItem | null;
  insertIndex: number | null;
  onMouseDown: (e: React.MouseEvent, item: DragItem, listId: string) => void;
}

const ReorderRenderer: React.FC<ReorderRendererProps> = ({ 
  listId, 
  items, 
  draggedItem, 
  insertIndex, 
  onMouseDown 
}) => {
  const result = [];
  const originalItemsLength = items.length;

  items.forEach((item, index) => {
    // Skip the dragged item entirely - don't render it at all
    if (draggedItem?.id === item.id) {
      return;
    }

    // Add placeholder before the insert position
    if (insertIndex === index) {
      result.push(
        <Placeholder
          key={`placeholder-${listId}-${index}`}
          text={draggedItem?.text || 'Drop'}
          isShadowMode={false}
        />
      );
    }

    // Add the actual item (only if not being dragged)
    result.push(
      <DragDropItem
        key={item.id}
        item={item}
        listId={listId}
        index={index}
        isDragging={false}
        isSourceItem={false}
        onMouseDown={onMouseDown}
      />
    );
  });

  // Add placeholder at the end if needed
  if (insertIndex === originalItemsLength) {
    result.push(
      <Placeholder
        key={`placeholder-${listId}-end`}
        text={draggedItem?.text || 'Drop'}
        isShadowMode={false}
      />
    );
  }

  return <>{result}</>;
};

export default React.memo(ReorderRenderer); 