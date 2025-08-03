## ✅ **Monorepo Setup Complete - Working Solution!**

This project is set up as a **true monorepo** where the `/examples/` directory imports **directly** from the library source code in `/src/`, enabling rapid development and testing.

### **🎯 Current Status: WORKING ✅**

- **✅ Direct Imports**: Examples import directly from `/src/` using relative paths
- **✅ Development Server**: Running successfully with react-app-rewired
- **✅ Hot Reload**: Changes to `/src/` are immediately visible
- **✅ Webpack Override**: config-overrides.js allows external imports
- **✅ No Copying**: Single source of truth in `/src/`

## Structure

```
react-dnd/
├── src/                    # Library source code (single source of truth)
├── examples/               # Example applications
│   ├── src/
│   │   ├── App.tsx        # Main demo (imports from ../components/CustomDragDrop)
│   │   └── ...
│   ├── config-overrides.js # Webpack override to allow external imports
│   └── package.json       # Uses react-app-rewired
├── dist/                   # Built library (generated)
└── package.json           # Root package.json with workspaces
```

## How It Works

1. **Library Code**: Located in `/src/` (single source of truth)
2. **Webpack Override**: `config-overrides.js` removes ModuleScopePlugin restriction
3. **Examples**: Import **directly** from `/src/` using relative paths
4. **Development**: Changes to `/src/` are **immediately** available in examples
5. **Publishing**: Built library can be published to GitHub for use in other projects

## Development Workflow

### Quick Start
```bash
# Install dependencies (if needed)
npm install

# Start examples development server
npm run examples:start
```

This will:
- Start the examples development server with hot reload
- Examples import **directly** from `/src/` (no copying needed)
- Changes to library code are **immediately** visible

### Manual Development
```bash
# Start examples only
npm run examples:dev

# Build library only
npm run build

# Run tests
npm test
```

## Examples

The `/examples/` directory contains several example applications:

- `basic-sortable-list.tsx` - Simple drag and drop list
- `kanban-board-example.tsx` - Kanban board implementation
- `word-bank-example.tsx` - Word bank drag and drop
- `useDragDrop-hook-example.tsx` - Custom hook usage
- `refactored-drag-drop-example.tsx` - Advanced implementation
- `src/App.tsx` - Main demo app (imports directly from ../components/CustomDragDrop)

## Import Pattern

Examples import **directly** from the source using clean relative paths:

```typescript
// For default exports (like CustomDragDrop)
import CustomDragDrop from '../../src/components/CustomDragDrop';

// For named exports (like DragDropProvider, Draggable, Droppable)
import { DragDropProvider } from '../../src/contexts/DragDropContext';
import { Draggable } from '../../src/components/Draggable';
import { Droppable } from '../../src/components/Droppable';

// For types
import { DragResult, DragMode } from '../../src/types/dragDrop';

// For hooks
import { useDragDrop } from '../../src/hooks/useDragDrop';
```

## Publishing

When ready to publish:

1. Build the library: `npm run build`
2. Test everything: `npm run validate`
3. Publish to GitHub (not npm, as per project preferences)

## Benefits

- **✅ True Monorepo**: Examples use source files directly (no copying)
- **✅ Clean Imports**: Simple relative paths to library components
- **✅ Immediate Feedback**: Changes to `/src/` are instantly visible in examples
- **✅ Single Source of Truth**: All code lives in `/src/`
- **✅ Easy Testing**: Multiple example apps test different use cases
- **✅ Documentation**: Examples serve as living documentation
- **✅ Production Ready**: Proper library structure for publishing

## Technical Details

### React App Rewired Configuration
The examples use **react-app-rewired** to override webpack configuration:
- Removes the `ModuleScopePlugin` that prevents imports outside `src/`
- Adds the parent `src/` directory to module resolution
- Allows direct imports from the library source

### Workspace Setup
- Root `package.json` has `"workspaces": ["examples"]`
- Examples can import directly from parent library
- No file copying or syncing needed

## Troubleshooting

If examples don't update when you change `/src/`:

1. Check that the development server is running: `npm run examples:start`
2. Verify imports use relative paths to `/src/`
3. Ensure react-app-rewired is properly configured
4. Restart the development server if needed

## Development Commands

```bash
# Start examples with hot reload
npm run examples:start

# Build library for publishing
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

This setup gives you the **best of both worlds**: a true monorepo where examples use the source directly, and a proper library structure ready for publishing to npm/GitHub. 