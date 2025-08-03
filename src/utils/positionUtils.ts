import { DragItem, Lists } from '../types/dragDrop';

interface ItemOnSameRow {
  element: Element;
  index: number;
  left: number;
  right: number;
  centerX: number;
}

export function findHoveredList(mouseX: number, mouseY: number, listRefs: Record<string, HTMLDivElement | null>): string | null {
  for (const [listId, listElement] of Object.entries(listRefs)) {
    if (listElement) {
      const rect = listElement.getBoundingClientRect();
      if (mouseX >= rect.left && mouseX <= rect.right && 
          mouseY >= rect.top && mouseY <= rect.bottom) {
        return listId;
      }
    }
  }
  return null;
}

export function calculateInsertionIndex(mouseX: number, mouseY: number, listElement: HTMLDivElement, items: DragItem[], styles: any): number {
  const rect = listElement.getBoundingClientRect();
  const mouseXRelative = mouseX - rect.left;
  const mouseYRelative = mouseY - rect.top;

  // Get all visible items
  const itemElements = Array.from(listElement.querySelectorAll(`.${styles.item}`));
  
  if (itemElements.length === 0) {
    return 0;
  }

  // Check if user is dragging to the end of the list (right side or bottom right)
  const listWidth = rect.width;
  const listHeight = rect.height;
  const rightThreshold = listWidth * 0.9; // Right 10% of the list
  const bottomThreshold = listHeight * 0.9; // Bottom 10% of the list
  
  const isDraggingToEnd = mouseXRelative > rightThreshold || mouseYRelative > bottomThreshold;

  if (isDraggingToEnd) {
    return items.length;
  }

  // Find the natural insertion point where the dragged word would fit
  const rowTolerance = 15; // Tight tolerance for row detection
  
  // First, find all items on the same row as the mouse cursor
  const itemsOnSameRow = findItemsOnSameRow(itemElements, mouseYRelative, rect);

  if (itemsOnSameRow.length > 0) {
    return calculateInsertionIndexFromRow(itemsOnSameRow, mouseXRelative, items.length);
  }

  // No items on this row and not dragging to end - maintain current position
  return 0;
}

function findItemsOnSameRow(itemElements: Element[], mouseY: number, listRect: DOMRect): ItemOnSameRow[] {
  const rowTolerance = 15;
  const itemsOnSameRow: ItemOnSameRow[] = [];
  
  itemElements.forEach((itemEl, index) => {
    const itemRect = itemEl.getBoundingClientRect();
    const itemTop = itemRect.top - listRect.top;
    const itemBottom = itemRect.bottom - listRect.top;
    const itemCenterY = (itemTop + itemBottom) / 2;
    
    if (Math.abs(mouseY - itemCenterY) <= rowTolerance) {
      itemsOnSameRow.push({ 
        element: itemEl, 
        index, 
        left: itemRect.left - listRect.left,
        right: itemRect.right - listRect.left,
        centerX: (itemRect.left + itemRect.right) / 2 - listRect.left
      });
    }
  });

  return itemsOnSameRow;
}

function calculateInsertionIndexFromRow(itemsOnSameRow: ItemOnSameRow[], mouseX: number, totalItems: number): number {
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
    insertionIndex = totalItems;
  }
  
  return insertionIndex;
}

export function isShadowModeAllowed(mode: string, sourceList: string, targetList: string): boolean {
  const isNoReorderMode = mode === 'noreorder';
  const isWordBankMode = mode === 'wordbank';
  const isShadowMode = isNoReorderMode || isWordBankMode;

  if (!isShadowMode) return true;

  // In shadow modes, don't allow dragging within the same list
  if (sourceList === targetList) {
    // Allow dragging back to word bank from sentence in word bank mode
    if (isWordBankMode && sourceList === 'sentence' && targetList === 'wordBank') {
      return true;
    } else if (isWordBankMode && sourceList === 'wordBank' && targetList === 'wordBank') {
      return false; // Don't allow reordering within word bank
    } else if (isWordBankMode && sourceList === 'sentence' && targetList === 'sentence') {
      return true; // Allow reordering within sentence area in word bank mode
    } else if (isNoReorderMode) {
      return false; // In no reorder mode, don't allow any same-list dragging
    }
  }

  return true;
} 