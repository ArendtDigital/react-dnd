import React, { useState } from 'react';
import { CustomDragDrop, DragDropProvider } from '@/index';
import type { DragEndResult, Lists } from '@/types/dragDrop';

const BasicSortableDemo: React.FC = () => {
  const [lists, setLists] = useState<Lists>({
    tasks: [
      { id: '1', text: 'Learn React', color: '#4CAF50' },
      { id: '2', text: 'Build a drag and drop library', color: '#2196F3' },
      { id: '3', text: 'Create examples', color: '#FF9800' },
      { id: '4', text: 'Write documentation', color: '#9C27B0' },
      { id: '5', text: 'Publish to npm', color: '#F44336' },
    ]
  });

  const handleDragEnd = (result: DragEndResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sourceList = lists[source.droppableId];
    const draggedItem = sourceList[source.index];

    // Create new list
    const newList = [...sourceList];
    newList.splice(source.index, 1);
    newList.splice(destination.index, 0, draggedItem);

    setLists({
      ...lists,
      [source.droppableId]: newList
    });
  };

  return (
    <DragDropProvider>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px',
          minHeight: '200px'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#495057' }}>
            Drag to reorder tasks:
          </h3>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px'
          }}>
            <CustomDragDrop
              lists={{ tasks: lists.tasks }}
              onDragEnd={handleDragEnd}
              mode="reorder"
            />
          </div>
        </div>
      </div>
    </DragDropProvider>
  );
};

export default BasicSortableDemo; 