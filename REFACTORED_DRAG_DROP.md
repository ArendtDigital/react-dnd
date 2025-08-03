# Refactored Drag & Drop System

This document describes the comprehensive refactor of the drag and drop functionality, which has been extracted from the ad-wordsense project and made available as a reusable npm package component.

## 🚀 Features

### Multiple Drag Modes
- **Reorder Mode**: Standard drag and drop with full reordering capabilities
- **No Reorder Mode**: Items can only be moved between lists, not reordered within the same list
- **Word Bank Mode**: Advanced mode with permanent shadows and cloning functionality

### Advanced Features
- **Permanent Shadows**: Items remember their original positions with visual shadows
- **Smart Position Detection**: Intelligent insertion point calculation based on mouse position
- **Debounced Updates**: Optimized performance with 60fps updates
- **TypeScript Support**: Full type safety with comprehensive interfaces
- **Modular Architecture**: Separated concerns with custom hooks and renderers

## 📦 Installation

```bash
npm install react-dnd
```

## 🎯 Quick Start

```tsx
import React, { useState } from 'react';
import { CustomDragDrop, DragItem, DragEndResult, DragMode } from 'react-dnd';

const MyComponent = () => {
  const [lists, setLists] = useState<Record<string, DragItem[]>>({
    wordBank: [
      { id: '1', text: 'The', color: 'hsl(200, 70%, 50%)' },
      { id: '2', text: 'cat', color: 'hsl(120, 70%, 50%)' },
      { id: '3', text: 'runs', color: 'hsl(40, 70%, 50%)' },
    ],
    sentence: []
  });

  const [permanentShadows, setPermanentShadows] = useState({});

  const handleDragEnd = (result: DragEndResult) => {
    // Handle drag end logic here
    console.log('Drag ended:', result);
  };

  return (
    <CustomDragDrop
      lists={lists}
      onDragEnd={handleDragEnd}
      mode="wordbank"
      permanentShadows={permanentShadows}
      setPermanentShadows={setPermanentShadows}
    />
  );
};
```

## 🏗️ Architecture

### Core Components

#### `CustomDragDrop`
The main component that orchestrates the entire drag and drop system.

```tsx
interface CustomDragDropProps {
  lists: Record<string, DragItem[]>;
  onDragEnd: (result: DragEndResult) => void;
  mode?: DragMode;
  permanentShadows?: Record<string, PermanentShadow>;
  setPermanentShadows?: (shadows: Record<string, PermanentShadow>) => void;
}
```

#### Supporting Components
- `DragDropList`: Container for individual lists
- `DragDropItem`: Individual draggable items
- `DragPreview`: Floating preview during drag
- `Placeholder`: Visual indicator for drop zones
- `ShadowItem`: Permanent shadow representation

### Custom Hooks

#### `useDragState`
Manages the core drag state using `useReducer` for predictable state transitions.

```tsx
const { state, startDrag, updatePosition, endDrag, addConnection } = useDragState();
```

#### `useDragPreview`
Manages the floating drag preview state.

```tsx
const { state, updateMousePosition, updateDragPreview, resetPreview } = useDragPreview();
```

#### `useListRefs`
Manages DOM references for position calculations.

```tsx
const { listRefs, setListRef, getListRef } = useListRefs();
```

#### `usePermanentShadows`
Manages permanent shadows for word bank mode.

```tsx
const { permanentShadows, addShadow, removeShadow, clearShadows } = usePermanentShadows();
```

### Mode-Specific Renderers

#### `ReorderRenderer`
Handles standard reorder mode rendering with placeholders and item hiding.

#### `WordBankRenderer`
Handles word bank mode with permanent shadows and cloning logic.

#### `NoReorderRenderer`
Handles no-reorder mode with source list shadows.

## 🎨 Styling

The component includes default CSS classes that can be customized:

```css
.drag-drop-container     /* Main container */
.drag-drop-list         /* Individual list container */
.drag-drop-item         /* Draggable items */
.drag-drop-placeholder  /* Drop zone indicators */
.drag-drop-shadow       /* Permanent shadows */
.drag-drop-preview      /* Floating drag preview */
```

## 📋 Data Structures

### DragItem
```tsx
interface DragItem {
  id: string;
  text: string;
  color: string;
  isClone?: boolean;
  sourceList?: string;
}
```

### DragEndResult
```tsx
interface DragEndResult {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination: {
    droppableId: string;
    index: number;
  };
}
```

### PermanentShadow
```tsx
interface PermanentShadow {
  text: string;
  color: string;
  originalIndex: number;
}
```

## 🔧 Advanced Usage

### Word Bank Mode with Cloning

```tsx
const handleWordBankDragEnd = (result: DragEndResult) => {
  const { source, destination } = result;
  
  if (source.droppableId === 'wordBank') {
    // Create clone for destination
    const originalWord = sourceItems[source.index];
    const clonedWord = {
      ...originalWord,
      id: `${originalWord.id}-clone-${Date.now()}`,
      isClone: true
    };
    
    // Add clone to destination
    destItems.splice(destination.index, 0, clonedWord);
    
    // Mark original as shadow
    setPermanentShadows(prev => ({
      ...prev,
      [originalWord.id]: {
        text: originalWord.text,
        color: originalWord.color,
        originalIndex: source.index
      }
    }));
  }
};
```

### Custom Position Calculations

```tsx
import { findHoveredList, calculateInsertionIndex } from 'react-dnd';

const hoveredList = findHoveredList(mouseX, mouseY, listRefs);
const insertionIndex = calculateInsertionIndex(mouseX, mouseY, listElement, items, styles);
```

## 🧪 Testing

The component is fully testable with isolated functionality:

```tsx
import { render, fireEvent } from '@testing-library/react';
import { CustomDragDrop } from 'react-dnd';

test('should handle drag start', () => {
  const onDragEnd = jest.fn();
  const { getByText } = render(
    <CustomDragDrop
      lists={{ list1: [{ id: '1', text: 'Test', color: 'red' }] }}
      onDragEnd={onDragEnd}
    />
  );
  
  fireEvent.mouseDown(getByText('Test'));
  // Test drag behavior
});
```

## 🚀 Performance Optimizations

- **Debounced Updates**: Position updates are debounced to 60fps
- **React.memo**: All components are memoized for optimal re-rendering
- **useCallback**: Event handlers are memoized to prevent unnecessary re-renders
- **useReducer**: Complex state is managed with predictable reducers
- **DOM Queries**: Optimized DOM queries with refs and caching

## 🔄 Migration from Legacy

The new system maintains backward compatibility while providing enhanced functionality:

```tsx
// Legacy usage still works
import { DragDropProvider, Draggable, Droppable } from 'react-dnd';

// New refactored usage
import { CustomDragDrop } from 'react-dnd';
```

## 📚 Examples

See the `examples/refactored-drag-drop-example.tsx` file for a complete implementation demonstrating all three modes with the exact functionality from the ad-wordsense project.

## 🤝 Contributing

The refactored system is designed to be extensible. Key areas for extension:

- **New Renderers**: Add mode-specific rendering logic
- **Custom Hooks**: Extend state management for new features
- **Position Algorithms**: Implement custom insertion point calculations
- **Styling**: Create theme systems and custom styles

## 📄 License

MIT License - see LICENSE file for details. 