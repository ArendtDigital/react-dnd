import React from 'react';
import { DragItem } from '../../types/dragDrop';
import DragDropItem from '../DragDropItem';
import Placeholder from '../Placeholder';

interface NoReorderRendererProps {
  listId: string;
  items: DragItem[];
  draggedItem: DragItem | null;
  insertIndex: number | null;
  isSourceList: boolean;
  onMouseDown: (e: React.MouseEvent, item: DragItem, listId: string) => void;
}

const NoReorderRenderer: React.FC<NoReorderRendererProps> = ({ 
  listId, 
  items, 
  draggedItem, 
  insertIndex, 
  isSourceList, 
  onMouseDown 
}) => {
  const result = [];
  const originalItemsLength = items.length;

  // In shadow modes, render all items but replace the dragged item with a shadow
  if (isSourceList) {
    items.forEach((item, index) => {
      // If this is the dragged item, render shadow instead
      if (draggedItem?.id === item.id) {
        result.push(
          <div
            key={`shadow-${listId}-${index}`}
            className="drag-drop-shadow"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              border: '2px dashed rgba(0, 0, 0, 0.7)',
              borderRadius: '6px',
              margin: '0 0.25rem',
              padding: '0.25rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: 'rgba(0, 0, 0, 0.8)',
              pointerEvents: 'none',
              minWidth: 'fit-content',
              height: '40px',
              whiteSpace: 'nowrap',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            {draggedItem?.text || 'Shadow'}
          </div>
        );
      } else {
        // Render normal item
        result.push(
          <DragDropItem
            key={item.id}
            item={item}
            listId={listId}
            index={index}
            isDragging={false}
            isSourceItem={true}
            onMouseDown={onMouseDown}
          />
        );
      }
    });
  } else {
    // Regular reorder mode or target lists in shadow modes
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
            isShadowMode={true}
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
          isShadowMode={true}
        />
      );
    }
  }

  return <>{result}</>;
};

export default React.memo(NoReorderRenderer); 