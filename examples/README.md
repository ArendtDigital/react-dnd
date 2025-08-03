# React DND Examples

This folder contains examples demonstrating how to use the React DND library.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3001`

## Examples

### Sentence Builder Demo
A Duolingo-style sentence building game that demonstrates:
- **Word Bank Mode**: Words can be dragged from the word bank to the sentence area
- **Reordering**: Words can be reordered within the sentence area
- **Return to Source**: Words can be dragged back to the word bank
- **Permanent Shadows**: Visual feedback showing where words originated from

### Basic Sortable List
A simple example showing basic drag and drop reordering functionality.

## Key Features Demonstrated

- **Multiple Drag Modes**: `reorder`, `noreorder`, and `wordbank` modes
- **Cross-List Dragging**: Moving items between different lists
- **Visual Feedback**: Drag previews, placeholders, and shadows
- **State Management**: Proper handling of drag and drop state
- **TypeScript Support**: Full type safety with the library

## Library Usage

The examples import directly from the `src/` folder using the `@` alias:

```typescript
import { CustomDragDrop, DragDropProvider } from '@/index';
import type { DragEndResult, Lists } from '@/types/dragDrop';
```

This demonstrates how the library would be used when published as an npm package. 