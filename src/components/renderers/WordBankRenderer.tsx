import React from 'react';
import { DragItem, PermanentShadow } from '../../types/dragDrop';
import DragDropItem from '../DragDropItem';
import Placeholder from '../Placeholder';
import ShadowItem from '../ShadowItem';

interface WordBankRendererProps {
  listId: string;
  items: DragItem[];
  draggedItem: any;
  insertIndex: number;
  permanentShadows: Record<string, PermanentShadow>;
  setPermanentShadows: (shadows: Record<string, PermanentShadow>) => void;
  onMouseDown: (e: React.MouseEvent, item: DragItem, index: number) => void;
}

const WordBankRenderer: React.FC<WordBankRendererProps> = ({ 
  listId, 
  items, 
  draggedItem, 
  insertIndex, 
  permanentShadows, 
  setPermanentShadows,
  onMouseDown 
}) => {
  const renderItems = () => {
    const result = [];
    
    for (let i = 0; i <= items.length; i++) {
      // Add placeholder at insert position
      if (i === insertIndex && insertIndex !== -1) {
        result.push(
          <Placeholder 
            key={`placeholder-${i}`} 
            text="Drop here" 
            isShadowMode={true}
          />
        );
      }
      
      // Add item at current position
      if (i < items.length) {
        const item = items[i];
        const isShadow = permanentShadows[item.id];
        
        if (isShadow || (draggedItem?.id === item.id && listId === 'wordBank')) {
          // Render shadow item (either permanent shadow or when item is being dragged from word bank)
          result.push(
            <ShadowItem 
              key={`shadow-${item.id}`} 
              text={isShadow ? isShadow.text : item.text} 
              isDraggingBackToShadow={draggedItem?.id === item.id}
            />
          );
        } else {
          // Render normal item
          result.push(
            <DragDropItem
              key={item.id}
              item={item}
              listId={listId}
              index={i}
              isDragging={draggedItem?.id === item.id}
              isSourceItem={draggedItem?.id === item.id}
              onMouseDown={(e) => onMouseDown(e, item, i)}
            />
          );
        }
      }
    }
    
    return result;
  };

  return <>{renderItems()}</>;
};

export default React.memo(WordBankRenderer); 