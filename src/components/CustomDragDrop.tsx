import React, { useState, useRef, useEffect } from 'react';
import DragPreview from './DragPreview';

interface DragItem {
  id: string;
  text: string;
  color: string;
}

interface Lists {
  [key: string]: DragItem[];
}

interface CustomDragDropProps {
  lists: Lists;
  onDragEnd: (result: any) => void;
  mode?: 'reorder' | 'noreorder' | 'wordbank';
  permanentShadows?: Record<string, any>;
  setPermanentShadows?: (shadows: Record<string, any>) => void;
}

const CustomDragDrop: React.FC<CustomDragDropProps> = ({ 
  lists, 
  onDragEnd, 
  mode = 'reorder', 
  permanentShadows = {}, 
  setPermanentShadows 
}) => {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOverList, setDragOverList] = useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dragPreview, setDragPreview] = useState<any>(null);
  const [draggedItemOriginalIndex, setDraggedItemOriginalIndex] = useState<number | null>(null);
  const [itemConnections, setItemConnections] = useState<Record<string, any>>({});
  const listRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastUpdateRef = useRef<{ listId: string | null; index: number | null }>({ listId: null, index: null });
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mode can be 'reorder' (current behavior), 'noreorder' (only between lists), or 'wordbank' (permanent shadows)
  const isNoReorderMode = mode === 'noreorder';
  const isWordBankMode = mode === 'wordbank';
  const isShadowMode = isNoReorderMode || isWordBankMode;

  const handleMouseDown = (e: React.MouseEvent, item: DragItem, listId: string) => {
    // Find the original index before starting drag
    const originalIndex = lists[listId].findIndex(listItem => listItem.id === item.id);
    
    console.log('Drag started:', { item: item.text, listId, originalIndex });
    
    // Start custom drag
    setDraggedItem({ ...item, sourceList: listId } as DragItem & { sourceList: string });
    setDraggedItemOriginalIndex(originalIndex);
    setDragPreview({
      text: item.text,
      color: item.color,
      x: e.clientX,
      y: e.clientY,
      sourceList: listId
    });
    
    // Add dragging class to body to prevent text selection
    document.body.classList.add('dragging');
    
    // Store original item positions
    const listElement = listRefs.current[listId];
    if (listElement) {
      const itemElements = Array.from(listElement.querySelectorAll('.item'));
      const positions = itemElements.map((el, index) => {
        const rect = el.getBoundingClientRect();
        const listRect = listElement.getBoundingClientRect();
        return {
          index,
          left: rect.left - listRect.left,
          right: rect.right - listRect.left,
          top: rect.top - listRect.top,
          bottom: rect.bottom - listRect.top,
        };
      });
    }
  };

  const updatePlaceholderPosition = (hoveredList: string | null, newIndex: number | null) => {
    // In shadow modes, don't allow dragging within the same list
    if (isShadowMode && hoveredList === (draggedItem as any)?.sourceList) {
      // Allow dragging back to word bank from sentence in word bank mode
      if (isWordBankMode && (draggedItem as any)?.sourceList === 'sentence' && hoveredList === 'wordBank') {
        // Allow this - user is dragging word back to word bank
      } else if (isWordBankMode && (draggedItem as any)?.sourceList === 'wordBank' && hoveredList === 'wordBank') {
        // Don't allow reordering within word bank
        return;
      } else if (isWordBankMode && (draggedItem as any)?.sourceList === 'sentence' && hoveredList === 'sentence') {
        // Allow reordering within sentence area in word bank mode
      } else if (isNoReorderMode) {
        // In no reorder mode, don't allow any same-list dragging
        return;
      }
    }

    // Only update if the position actually changed significantly
    const lastUpdate = lastUpdateRef.current;
    const hasChanged = lastUpdate.listId !== hoveredList || lastUpdate.index !== newIndex;
    
    if (hasChanged) {
      // Clear any pending timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      // Debounce the update to prevent rapid changes
      updateTimeoutRef.current = setTimeout(() => {
        setDragOverList(hoveredList);
        setPlaceholderIndex(newIndex);
        lastUpdateRef.current = { listId: hoveredList, index: newIndex };
      }, 16); // ~60fps
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggedItem) {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setDragPreview((prev: any) => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
      
      // Find which list we're hovering over
      let hoveredList: string | null = null;
      Object.entries(listRefs.current).forEach(([listId, listElement]) => {
        if (listElement) {
          const rect = listElement.getBoundingClientRect();
          if (e.clientX >= rect.left && e.clientX <= rect.right && 
              e.clientY >= rect.top && e.clientY <= rect.bottom) {
            hoveredList = listId;
          }
        }
      });

      // In shadow modes, don't allow hovering over the source list
      if (isShadowMode && hoveredList === (draggedItem as any).sourceList) {
        // Allow dragging back to word bank from sentence in word bank mode
        if (isWordBankMode && (draggedItem as any).sourceList === 'sentence' && hoveredList === 'wordBank') {
          // Allow this - user is dragging word back to word bank
        } else if (isWordBankMode && (draggedItem as any).sourceList === 'wordBank' && hoveredList === 'wordBank') {
          // Don't allow reordering within word bank
          hoveredList = null;
        } else if (isWordBankMode && (draggedItem as any).sourceList === 'sentence' && hoveredList === 'sentence') {
          // Allow reordering within sentence area in word bank mode
        } else if (isNoReorderMode) {
          // In no reorder mode, don't allow any same-list dragging
          hoveredList = null;
        }
      }

      if (hoveredList) {
        const listElement = listRefs.current[hoveredList];
        const rect = listElement!.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Get all visible items
        const itemElements = Array.from(listElement!.querySelectorAll('.item'));
        
        if (itemElements.length === 0) {
          updatePlaceholderPosition(hoveredList, 0);
          return;
        }

        // Find the item that the mouse is closest to
        let bestIndex = 0;

        // Find the natural insertion point where the dragged word would fit
        const rowTolerance = 15; // Tight tolerance for row detection
        
        // First, find all items on the same row as the mouse cursor
        const itemsOnSameRow: any[] = [];
        
        itemElements.forEach((itemEl, index) => {
          const itemRect = itemEl.getBoundingClientRect();
          const itemTop = itemRect.top - rect.top;
          const itemBottom = itemRect.bottom - rect.top;
          const itemCenterY = (itemTop + itemBottom) / 2;
          
          if (Math.abs(mouseY - itemCenterY) <= rowTolerance) {
            itemsOnSameRow.push({ 
              element: itemEl, 
              index, 
              left: itemRect.left - rect.left,
              right: itemRect.right - rect.left,
              centerX: (itemRect.left + itemRect.right) / 2 - rect.left
            });
          }
        });

        // Check if user is dragging to the end of the list (right side or bottom right)
        const listWidth = rect.width;
        const listHeight = rect.height;
        const rightThreshold = listWidth * 0.9; // Right 10% of the list (more precise)
        const bottomThreshold = listHeight * 0.9; // Bottom 10% of the list (more precise)
        
        const isDraggingToEnd = mouseX > rightThreshold || mouseY > bottomThreshold;

        if (isDraggingToEnd) {
          // User is dragging to the end of the list
          // Use the original items array length, not the filtered itemElements
          bestIndex = lists[hoveredList].length;
        } else if (itemsOnSameRow.length > 0) {
          // Sort items by their left position (X coordinate)
          itemsOnSameRow.sort((a, b) => a.left - b.left);
          
          // Find the insertion point based on mouse X position
          let insertionIndex = 0;
          
          for (let i = 0; i < itemsOnSameRow.length; i++) {
            const item = itemsOnSameRow[i];
            
            // If mouse is before this item, insert here
            if (mouseX < item.left) {
              insertionIndex = item.index;
              break;
            }
            // If mouse is after this item, continue to next item
            else if (mouseX > item.right) {
              insertionIndex = item.index + 1;
            }
            // If mouse is inside this item, determine which half
            else {
              if (mouseX < item.centerX) {
                insertionIndex = item.index;
              } else {
                insertionIndex = item.index + 1;
              }
              break;
            }
          }
          
          // Check if mouse is past the rightmost item on this row
          const rightmostItem = itemsOnSameRow[itemsOnSameRow.length - 1];
          if (mouseX > rightmostItem.right) {
            // Place at the end of the list
            insertionIndex = lists[hoveredList].length;
          }
          
          bestIndex = insertionIndex;
        } else {
          // No items on this row and not dragging to end - maintain current position
          // Only change if we're actually hovering over a different list
          if (dragOverList !== hoveredList) {
            bestIndex = 0; // Only reset to beginning when switching lists
          } else {
            // Keep the current placeholder position
            bestIndex = placeholderIndex !== null ? placeholderIndex : 0;
          }
        }

        updatePlaceholderPosition(hoveredList, bestIndex);
      } else {
        updatePlaceholderPosition(null, null);
      }
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (draggedItem && dragOverList !== null && placeholderIndex !== null) {
      // In shadow modes, handle returning to original position
      if (isShadowMode && dragOverList === (draggedItem as any).sourceList) {
        // Allow reordering within sentence area in word bank mode
        if (isWordBankMode && (draggedItem as any).sourceList === 'sentence' && dragOverList === 'sentence') {
          // Complete the drag to new location (reorder within sentence)
          const result = {
            draggableId: draggedItem.id,
            type: 'ITEM',
            source: {
              droppableId: (draggedItem as any).sourceList,
              index: lists[(draggedItem as any).sourceList].findIndex(item => item.id === draggedItem.id)
            },
            destination: {
              droppableId: dragOverList,
              index: placeholderIndex
            }
          };
          onDragEnd(result);
        } else {
          // Return to original position for other shadow mode operations
          const result = {
            draggableId: draggedItem.id,
            type: 'ITEM',
            source: {
              droppableId: (draggedItem as any).sourceList,
              index: lists[(draggedItem as any).sourceList].findIndex(item => item.id === draggedItem.id)
            },
            destination: {
              droppableId: dragOverList,
              index: draggedItemOriginalIndex
            }
          };
          onDragEnd(result);
        }
      } else {
        // Complete the drag to new location
        // If dragging back to word bank, force it to the original position
        let finalDestinationIndex = placeholderIndex;
        if (isWordBankMode && dragOverList === 'wordBank' && (draggedItem as any).sourceList !== 'wordBank') {
          // Check if this is a word being returned to word bank
          if (permanentShadows[draggedItem.id]) {
            // Force it to return to its original position
            finalDestinationIndex = permanentShadows[draggedItem.id].originalIndex;
          }
        }
        
        const result = {
          draggableId: draggedItem.id,
          type: 'ITEM',
          source: {
            droppableId: (draggedItem as any).sourceList,
            index: lists[(draggedItem as any).sourceList].findIndex(item => item.id === draggedItem.id)
          },
          destination: {
            droppableId: dragOverList,
            index: finalDestinationIndex
          }
        };

        // Store connection for shadow modes
        if (isShadowMode) {
          setItemConnections(prev => ({
            ...prev,
            [draggedItem.id]: {
              originalList: (draggedItem as any).sourceList,
              originalIndex: draggedItemOriginalIndex
            }
          }));
        }

        onDragEnd(result);
      }
    }
    
    // Clear any pending updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
            // Reset state
        setDraggedItem(null);
        setDraggedItemOriginalIndex(null);
        setDragOverList(null);
        setPlaceholderIndex(null);
        setDragPreview(null);
        lastUpdateRef.current = { listId: null, index: null };
        
        // Remove dragging class from body
        document.body.classList.remove('dragging');
  };

  const renderItemsWithPlaceholder = (listId: string, items: DragItem[]) => {
    const result: React.ReactNode[] = [];
    const insertIndex = dragOverList === listId ? placeholderIndex : null;
    const originalItemsLength = items.length;
    const isSourceList = (draggedItem as any)?.sourceList === listId;

    // Check if we should show a shadow for this list
    const shouldShowShadow = isShadowMode && isSourceList && draggedItem && draggedItemOriginalIndex !== null;
    
    if (shouldShowShadow) {
    }

    // In shadow modes, render all items but replace the dragged item with a shadow
    if (isShadowMode && isSourceList && !isWordBankMode) {
      items.forEach((item, index) => {
        // Check if this item has a permanent shadow (for wordbank mode)
        const hasPermanentShadow = isWordBankMode && permanentShadows[item.id];
        
        // If this is the dragged item, render shadow instead
        if (draggedItem?.id === item.id) {
          result.push(
            <div
              key={`shadow-${listId}-${index}`}
              className={`item-shadow ${isWordBankMode ? 'wordbank-mode' : 'regular-mode'}`}
            >
              {draggedItem?.text || 'Shadow'}
            </div>
          );
        } else if (hasPermanentShadow) {
          // Show permanent shadow for moved items
          result.push(
            <div
              key={`permanent-shadow-${listId}-${index}`}
              className="item-shadow permanent-shadow"
            >
              {permanentShadows[item.id]?.text || item.text}
            </div>
          );
        } else {
                  // Render normal item
        result.push(
          <div
            key={item.id}
            className="item source-item"
            style={{
              backgroundColor: item.color,
            }}
            onMouseDown={(e) => handleMouseDown(e, item, listId)}
          >
            <span className="item-text">{item.text}</span>
          </div>
        );
        }
      });
    } else if (isWordBankMode && listId === 'sentence') {
      // Sentence area in word bank mode should use normal reorder mode rendering
      
      // Regular reorder mode rendering for sentence area
      items.forEach((item, index) => {
        // Skip the dragged item entirely - don't render it at all
        if (draggedItem?.id === item.id) {
          return;
        }

        // Add placeholder before the insert position
        if (insertIndex === index) {
          result.push(
            <div
              key={`placeholder-${listId}-${index}`}
              className="placeholder wordbank-mode"
            >
              {draggedItem?.text || 'Drop'}
            </div>
          );
        }

        // Add the actual item (only if not being dragged)
        result.push(
          <div
            key={item.id}
            className="item"
            style={{
              backgroundColor: item.color,
              opacity: 1,
            }}
            onMouseDown={(e) => handleMouseDown(e, item, listId)}
          >
            <span className="item-text">{item.text}</span>
          </div>
        );
      });

      // Add placeholder at the end if needed
      if (insertIndex === originalItemsLength) {
        result.push(
          <div
            key={`placeholder-${listId}-end`}
            className="placeholder wordbank-mode"
          >
            {draggedItem?.text || 'Drop'}
          </div>
        );
      }
    } else if (isWordBankMode && listId === 'wordBank') {
      // For word bank mode, always check for permanent shadows in word bank
      
      // Render all items in the word bank, checking if each should be a shadow
      items.forEach((item, index) => {
        // Check if this item should be rendered as a shadow
        if (permanentShadows[item.id]) {
          // This item should be a shadow
          // If we're dragging back to word bank, make the shadow look like a drop target
          const isDraggingBackToShadow = draggedItem && 
            (draggedItem as any).sourceList !== 'wordBank' && 
            permanentShadows[draggedItem.id] && 
            permanentShadows[draggedItem.id].originalIndex === index;
          
          result.push(
            <div
              key={`permanent-shadow-${listId}-${index}`}
              className={`item-shadow ${isDraggingBackToShadow ? 'wordbank-mode' : 'permanent-shadow'}`}
            >
              {item.text}
            </div>
          );
        } else {
          // This item should be a normal draggable word
          // But if it's being dragged, show a shadow instead
          if (draggedItem?.id === item.id) {
            result.push(
              <div
                key={`shadow-${item.id}`}
                className="item-shadow permanent-shadow"
              >
                {item.text}
              </div>
            );
          } else {
            result.push(
              <div
                key={item.id}
                className="item"
                style={{
                  backgroundColor: item.color,
                }}
                onMouseDown={(e) => handleMouseDown(e, item, listId)}
              >
                <span className="item-text">{item.text}</span>
              </div>
            );
          }
        }
      });
      
      // Remove placeholder logic for word bank - words can only return to their original shadow position
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
            <div
              key={`placeholder-${listId}-${index}`}
              className={`placeholder ${isShadowMode ? 'wordbank-mode' : ''}`}
            >
              {draggedItem?.text || 'Drop'}
            </div>
          );
        }

        // Add the actual item (only if not being dragged)
        result.push(
          <div
            key={item.id}
            className="item"
            style={{
              backgroundColor: item.color,
              opacity: 1,
            }}
            onMouseDown={(e) => handleMouseDown(e, item, listId)}
          >
            <span className="item-text">{item.text}</span>
          </div>
        );
      });

      // Add placeholder at the end if needed
      if (insertIndex === originalItemsLength) {
        result.push(
          <div
            key={`placeholder-${listId}-end`}
            className={`placeholder ${isShadowMode ? 'wordbank-mode' : ''}`}
          >
            {draggedItem?.text || 'Drop'}
          </div>
        );
      }
    }

    return result;
  };

  useEffect(() => {
    if (draggedItem) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current);
        }
        // Remove dragging class when effect cleanup runs
        document.body.classList.remove('dragging');
      };
    }
  }, [draggedItem, dragOverList, placeholderIndex, draggedItemOriginalIndex]);

  return (
    <div className="container">
      {Object.entries(lists).map(([listId, items]) => (
        <div key={listId} className="list-container">
          <h3 className="list-title">
            {listId === 'list1' ? 'Articles & Pronouns' : 
             listId === 'list2' ? 'Nouns' : 
             listId === 'list3' ? 'Verbs' : 
             listId === 'paragraph' ? 'Sample Paragraph' :
             listId === 'sentence' ? 'Build Your Sentence' :
             listId === 'wordBank' ? 'Word Bank' : 'Unknown'}
            {isShadowMode && (draggedItem as any)?.sourceList === listId && (
              <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '0.5rem' }}>
                (Source - drag to other lists)
              </span>
            )}
          </h3>
          <div
            ref={(el) => listRefs.current[listId] = el}
            className={`list ${dragOverList === listId ? 'dragging-over' : ''} ${
              isShadowMode && (draggedItem as any)?.sourceList === listId ? 'source-list' : ''
            }`}
          >
            {renderItemsWithPlaceholder(listId, items)}
          </div>
        </div>
      ))}
      
      {/* Custom drag preview */}
      {dragPreview && (
        <DragPreview preview={dragPreview} />
      )}
    </div>
  );
};

export default CustomDragDrop; 