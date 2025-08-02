# React-DND Examples

This directory contains interactive examples demonstrating the React-DND library functionality.

## 🚀 Quick Start

### Option 1: Simple HTML File (Recommended)
The easiest way to run examples is to open `index.html` directly in your browser:

```bash
# Navigate to the examples directory
cd examples

# Open the HTML file in your default browser
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### Option 2: Development Server
For a better development experience, use a local server:

```bash
# Navigate to the examples directory
cd examples

# Install dependencies (optional)
npm install

# Start development server
npm start
# or
npm run dev
```

Then open your browser to `http://localhost:3000`

### Option 3: Using Python (if available)
```bash
cd examples
python -m http.server 3000
# or
python3 -m http.server 3000
```

## 📁 Available Examples

### 1. Basic Sortable List
- **Difficulty**: Beginner
- **Features**: Simple list reordering, basic drag and drop
- **Use Case**: Todo lists, simple item ordering

### 2. Word Bank
- **Difficulty**: Intermediate  
- **Features**: Wordbank mode, multi-zone selection
- **Use Case**: Educational apps, word selection games

### 3. Kanban Board
- **Difficulty**: Intermediate
- **Features**: Multi-column task management, priority indicators
- **Use Case**: Project management, workflow organization

### 4. useDragDrop Hook
- **Difficulty**: Advanced
- **Features**: Custom hook, file organization, type filtering
- **Use Case**: File managers, advanced drag scenarios

## 🛠️ Development

### File Structure
```
examples/
├── index.html              # Main demo application
├── package.json            # Development dependencies
├── README.md              # This file
├── demo-app.tsx           # Full demo app component
├── index.tsx              # Example exports and metadata
├── basic-sortable-list.tsx
├── word-bank-example.tsx
├── kanban-board-example.tsx
└── useDragDrop-hook-example.tsx
```

### Adding New Examples

1. Create a new example component in a `.tsx` file
2. Export it from `index.tsx`
3. Add metadata to the `examples` object
4. Import and add to `demo-app.tsx` if needed

### Example Component Template
```tsx
import React, { useState } from 'react';
import { DragDropProvider, Draggable, Droppable, DragResult } from '../src';

const MyExample: React.FC = () => {
  // Your example implementation
  return (
    <div>
      {/* Your example content */}
    </div>
  );
};

export default MyExample;
```

## 🌐 Browser Compatibility

The examples work in all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 Mobile Support

The examples include basic touch support for mobile devices, though the experience is optimized for desktop use.

## 🔧 Troubleshooting

### Common Issues

1. **Examples not loading**: Make sure you're running from a web server, not opening the file directly
2. **Drag not working**: Check browser console for errors
3. **Styling issues**: Ensure all CSS is loading properly

### Debug Mode
Open browser developer tools (F12) to see:
- Console logs for drag events
- Validation errors in development mode
- Performance metrics

## 📚 Next Steps

After exploring the examples:
1. Check out the main library documentation
2. Try integrating React-DND into your own project
3. Explore the source code to understand the implementation
4. Contribute by creating new examples or improving existing ones

## 🤝 Contributing

We welcome contributions! To add new examples:
1. Fork the repository
2. Create your example
3. Add tests if applicable
4. Submit a pull request

## 📄 License

MIT License - see the main project license for details. 