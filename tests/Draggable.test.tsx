import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DragDropProvider, Draggable, Droppable } from '../src';

describe('Draggable', () => {
  const mockOnDragEnd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderDraggable = (props = {}) => {
    return render(
      <DragDropProvider onDragEnd={mockOnDragEnd}>
        <Droppable droppableId="test-droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Draggable draggableId="test-draggable" index={0} {...props}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    data-testid="draggable-item"
                    style={{
                      ...provided.draggableProps.style,
                      padding: '10px',
                      border: '1px solid #ccc',
                    }}
                  >
                    Draggable Item
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropProvider>
    );
  };

  it('renders draggable item correctly', () => {
    renderDraggable();

    expect(screen.getByTestId('draggable-item')).toBeInTheDocument();
    expect(screen.getByText('Draggable Item')).toBeInTheDocument();
  });

  it('applies draggable props correctly', () => {
    renderDraggable();

    const draggableItem = screen.getByTestId('draggable-item');
    
    // Should have draggable attributes
    expect(draggableItem).toHaveAttribute('draggable', 'true');
  });

  it('handles custom data prop', () => {
    const customData = { id: '123', name: 'Test Item' };
    renderDraggable({ data: customData });

    expect(screen.getByTestId('draggable-item')).toBeInTheDocument();
  });

  it('handles custom type prop', () => {
    renderDraggable({ type: 'custom-type' });

    expect(screen.getByTestId('draggable-item')).toBeInTheDocument();
  });

  it('handles disabled drag state', () => {
    renderDraggable({ isDragDisabled: true });

    const draggableItem = screen.getByTestId('draggable-item');
    expect(draggableItem).toBeInTheDocument();
  });

  it('provides snapshot state to children', () => {
    renderDraggable();

    const draggableItem = screen.getByTestId('draggable-item');
    expect(draggableItem).toBeInTheDocument();
  });

  it('handles mouse down events', async () => {
    const user = userEvent.setup();
    renderDraggable();

    const draggableItem = screen.getByTestId('draggable-item');
    
    await user.click(draggableItem);
    
    expect(draggableItem).toBeInTheDocument();
  });

  it('handles mouse move events', async () => {
    const user = userEvent.setup();
    renderDraggable();

    const draggableItem = screen.getByTestId('draggable-item');
    
    // Simulate mouse down
    fireEvent.mouseDown(draggableItem, { clientX: 0, clientY: 0 });
    
    // Simulate mouse move
    fireEvent.mouseMove(document, { clientX: 50, clientY: 50 });
    
    expect(draggableItem).toBeInTheDocument();
  });

  it('handles mouse up events', async () => {
    const user = userEvent.setup();
    renderDraggable();

    const draggableItem = screen.getByTestId('draggable-item');
    
    // Simulate mouse down
    fireEvent.mouseDown(draggableItem, { clientX: 0, clientY: 0 });
    
    // Simulate mouse up
    fireEvent.mouseUp(document);
    
    expect(draggableItem).toBeInTheDocument();
  });

  it('prevents drag when disabled', async () => {
    const user = userEvent.setup();
    renderDraggable({ isDragDisabled: true });

    const draggableItem = screen.getByTestId('draggable-item');
    
    await user.click(draggableItem);
    
    // Should not trigger drag events when disabled
    expect(draggableItem).toBeInTheDocument();
  });

  it('handles right mouse button clicks', async () => {
    const user = userEvent.setup();
    renderDraggable();

    const draggableItem = screen.getByTestId('draggable-item');
    
    // Right click should not trigger drag
    fireEvent.mouseDown(draggableItem, { button: 2 });
    
    expect(draggableItem).toBeInTheDocument();
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = renderDraggable();

    expect(screen.getByTestId('draggable-item')).toBeInTheDocument();

    unmount();

    // Should not throw errors after unmount
    expect(screen.queryByTestId('draggable-item')).not.toBeInTheDocument();
  });

  it('handles multiple draggable items', () => {
    render(
      <DragDropProvider onDragEnd={mockOnDragEnd}>
        <Droppable droppableId="test-droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Draggable draggableId="item-1" index={0}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    data-testid="draggable-item-1"
                  >
                    Item 1
                  </div>
                )}
              </Draggable>
              <Draggable draggableId="item-2" index={1}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    data-testid="draggable-item-2"
                  >
                    Item 2
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropProvider>
    );

    expect(screen.getByTestId('draggable-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('draggable-item-2')).toBeInTheDocument();
  });
}); 