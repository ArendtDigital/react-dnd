import React, { useState } from 'react';
import { DragDropProvider, Draggable, Droppable, DragResult } from '../src';

interface Item {
  id: string;
  content: string;
}

const BasicSortableList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { id: '1', content: 'Item 1' },
    { id: '2', content: 'Item 2' },
    { id: '3', content: 'Item 3' },
    { id: '4', content: 'Item 4' },
    { id: '5', content: 'Item 5' },
  ]);

  const handleDragEnd = (result: DragResult) => {
    if (!result.destination) return;
    
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    
    setItems(newItems);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Basic Sortable List</h2>
      <p>Drag items to reorder them:</p>
      
      <DragDropProvider onDragEnd={handleDragEnd}>
        <Droppable droppableId="sortable-list">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                padding: '10px',
                backgroundColor: snapshot.isDraggingOver ? '#f5f5f5' : 'white',
                transition: 'background-color 0.2s ease',
              }}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        padding: '12px',
                        margin: '8px 0',
                        backgroundColor: snapshot.isDragging ? '#e3f2fd' : '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '6px',
                        cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                        userSelect: 'none',
                        transform: snapshot.isDragging 
                          ? provided.draggableProps.style?.transform 
                          : 'none',
                        boxShadow: snapshot.isDragging 
                          ? '0 4px 8px rgba(0,0,0,0.1)' 
                          : 'none',
                        transition: 'all 0.2s ease',
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
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>Current order:</p>
        <ol>
          {items.map(item => (
            <li key={item.id}>{item.content}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default BasicSortableList; 