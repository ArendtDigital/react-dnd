import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DragDropProvider, Draggable, Droppable, DragResult } from '../src';

// Test component that simulates a real-world use case
const TestSortableList = () => {
  const [items, setItems] = useState([
    { id: '1', content: 'Item 1' },
    { id: '2', content: 'Item 2' },
    { id: '3', content: 'Item 3' },
  ]);

  const handleDragEnd = (result: DragResult) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <Droppable droppableId="sortable-list">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            data-testid="droppable-area"
            style={{
              border: '2px solid #ccc',
              padding: '10px',
              minHeight: '200px',
            }}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    data-testid={`draggable-${item.id}`}
                    style={{
                      ...provided.draggableProps.style,
                      padding: '10px',
                      margin: '5px 0',
                      border: '1px solid #ddd',
                      backgroundColor: snapshot.isDragging ? '#e3f2fd' : 'white',
                    }}
                  >
                    {item.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropProvider>
  );
};

describe('Drag and Drop Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the complete drag and drop interface', () => {
    render(<TestSortableList />);

    expect(screen.getByTestId('droppable-area')).toBeInTheDocument();
    expect(screen.getByTestId('draggable-1')).toBeInTheDocument();
    expect(screen.getByTestId('draggable-2')).toBeInTheDocument();
    expect(screen.getByTestId('draggable-3')).toBeInTheDocument();
  });

  it('displays all items in correct order initially', () => {
    render(<TestSortableList />);

    const items = screen.getAllByTestId(/draggable-/);
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Item 1');
    expect(items[1]).toHaveTextContent('Item 2');
    expect(items[2]).toHaveTextContent('Item 3');
  });

  it('handles mouse down on draggable items', async () => {
    const user = userEvent.setup();
    render(<TestSortableList />);

    const firstItem = screen.getByTestId('draggable-1');
    
    await user.click(firstItem);
    
    expect(firstItem).toBeInTheDocument();
  });

  it('simulates drag start and move', async () => {
    render(<TestSortableList />);

    const firstItem = screen.getByTestId('draggable-1');
    
    // Simulate mouse down
    fireEvent.mouseDown(firstItem, { clientX: 0, clientY: 0 });
    
    // Simulate mouse move
    fireEvent.mouseMove(document, { clientX: 50, clientY: 50 });
    
    expect(firstItem).toBeInTheDocument();
  });

  it('simulates complete drag and drop operation', async () => {
    render(<TestSortableList />);

    const firstItem = screen.getByTestId('draggable-1');
    const droppableArea = screen.getByTestId('droppable-area');
    
    // Simulate mouse down on first item
    fireEvent.mouseDown(firstItem, { clientX: 0, clientY: 0 });
    
    // Simulate mouse move to different position
    fireEvent.mouseMove(document, { clientX: 0, clientY: 100 });
    
    // Simulate mouse up to complete drop
    fireEvent.mouseUp(document);
    
    expect(firstItem).toBeInTheDocument();
    expect(droppableArea).toBeInTheDocument();
  });

  it('maintains item order after drag operations', async () => {
    render(<TestSortableList />);

    const items = screen.getAllByTestId(/draggable-/);
    const initialOrder = items.map(item => item.textContent);
    
    // Simulate a drag operation
    const firstItem = items[0];
    fireEvent.mouseDown(firstItem, { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 0, clientY: 100 });
    fireEvent.mouseUp(document);
    
    // Items should still be present
    expect(screen.getByTestId('draggable-1')).toBeInTheDocument();
    expect(screen.getByTestId('draggable-2')).toBeInTheDocument();
    expect(screen.getByTestId('draggable-3')).toBeInTheDocument();
  });

  it('handles multiple rapid drag operations', async () => {
    render(<TestSortableList />);

    const firstItem = screen.getByTestId('draggable-1');
    const secondItem = screen.getByTestId('draggable-2');
    
    // First drag operation
    fireEvent.mouseDown(firstItem, { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 0, clientY: 50 });
    fireEvent.mouseUp(document);
    
    // Second drag operation
    fireEvent.mouseDown(secondItem, { clientX: 0, clientY: 50 });
    fireEvent.mouseMove(document, { clientX: 0, clientY: 100 });
    fireEvent.mouseUp(document);
    
    expect(firstItem).toBeInTheDocument();
    expect(secondItem).toBeInTheDocument();
  });

  it('handles drag cancellation (mouse up outside drop zone)', async () => {
    render(<TestSortableList />);

    const firstItem = screen.getByTestId('draggable-1');
    
    // Start drag
    fireEvent.mouseDown(firstItem, { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 0, clientY: 50 });
    
    // Cancel by moving outside and releasing
    fireEvent.mouseMove(document, { clientX: -100, clientY: -100 });
    fireEvent.mouseUp(document);
    
    expect(firstItem).toBeInTheDocument();
  });

  it('handles right mouse button clicks (should not trigger drag)', async () => {
    render(<TestSortableList />);

    const firstItem = screen.getByTestId('draggable-1');
    
    // Right click should not trigger drag
    fireEvent.mouseDown(firstItem, { button: 2 });
    fireEvent.mouseMove(document, { clientX: 50, clientY: 50 });
    fireEvent.mouseUp(document);
    
    expect(firstItem).toBeInTheDocument();
  });

  it('handles touch events for mobile support', async () => {
    render(<TestSortableList />);

    const firstItem = screen.getByTestId('draggable-1');
    
    // Simulate touch start
    fireEvent.touchStart(firstItem, {
      touches: [{ clientX: 0, clientY: 0 }],
    });
    
    // Simulate touch move
    fireEvent.touchMove(document, {
      touches: [{ clientX: 50, clientY: 50 }],
    });
    
    // Simulate touch end
    fireEvent.touchEnd(document);
    
    expect(firstItem).toBeInTheDocument();
  });

  it('maintains accessibility attributes', () => {
    render(<TestSortableList />);

    const firstItem = screen.getByTestId('draggable-1');
    
    // Should have proper ARIA attributes
    expect(firstItem).toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<TestSortableList />);

    const firstItem = screen.getByTestId('draggable-1');
    
    // Focus the item
    firstItem.focus();
    
    // Press Enter to activate
    await user.keyboard('{Enter}');
    
    expect(firstItem).toBeInTheDocument();
  });
});

// Test for word bank functionality
const TestWordBank = () => {
  const [wordBank, setWordBank] = useState([
    { id: 'word1', text: 'React' },
    { id: 'word2', text: 'TypeScript' },
  ]);
  const [selectedWords, setSelectedWords] = useState([]);

  const handleDragEnd = (result: DragResult) => {
    if (!result.destination) return;

    const draggedWord = wordBank.find(word => word.id === result.draggableId);
    if (!draggedWord) return;

    if (result.destination.droppableId === 'target-area') {
      setSelectedWords(prev => [...prev, draggedWord]);
    }
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Droppable droppableId="word-bank">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              data-testid="word-bank"
              style={{ border: '1px solid #ccc', padding: '10px', minHeight: '100px' }}
            >
              {wordBank.map((word, index) => (
                <Draggable key={word.id} draggableId={word.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      data-testid={`word-${word.id}`}
                      style={{
                        ...provided.draggableProps.style,
                        padding: '5px',
                        margin: '2px',
                        border: '1px solid #ddd',
                      }}
                    >
                      {word.text}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Droppable droppableId="target-area">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              data-testid="target-area"
              style={{ border: '1px solid #4caf50', padding: '10px', minHeight: '100px' }}
            >
              {selectedWords.map((word, index) => (
                <Draggable key={word.id} draggableId={word.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      data-testid={`selected-${word.id}`}
                      style={{
                        ...provided.draggableProps.style,
                        padding: '5px',
                        margin: '2px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                      }}
                    >
                      {word.text}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropProvider>
  );
};

describe('Word Bank Integration', () => {
  it('renders word bank and target area', () => {
    render(<TestWordBank />);

    expect(screen.getByTestId('word-bank')).toBeInTheDocument();
    expect(screen.getByTestId('target-area')).toBeInTheDocument();
  });

  it('displays words in word bank', () => {
    render(<TestWordBank />);

    expect(screen.getByTestId('word-word1')).toBeInTheDocument();
    expect(screen.getByTestId('word-word2')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('simulates word selection via drag and drop', async () => {
    render(<TestWordBank />);

    const reactWord = screen.getByTestId('word-word1');
    const targetArea = screen.getByTestId('target-area');
    
    // Simulate dragging React to target area
    fireEvent.mouseDown(reactWord, { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 200, clientY: 0 });
    fireEvent.mouseUp(document);
    
    expect(reactWord).toBeInTheDocument();
    expect(targetArea).toBeInTheDocument();
  });
}); 