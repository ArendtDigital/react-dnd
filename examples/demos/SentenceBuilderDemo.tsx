import React, { useState } from 'react';
import { CustomDragDrop, DragDropProvider } from '@/index';
import type { DragEndResult, Lists } from '@/types/dragDrop';

const SentenceBuilderDemo: React.FC = () => {
  const [lists, setLists] = useState<Lists>({
    wordBank: [
      { id: '1', text: 'I', color: '#4CAF50' },
      { id: '2', text: 'am', color: '#2196F3' },
      { id: '3', text: 'learning', color: '#FF9800' },
      { id: '4', text: 'to', color: '#9C27B0' },
      { id: '5', text: 'speak', color: '#F44336' },
      { id: '6', text: 'Spanish', color: '#795548' },
      { id: '7', text: 'every', color: '#607D8B' },
      { id: '8', text: 'day', color: '#E91E63' },
    ],
    sentence: []
  });

  const [permanentShadows, setPermanentShadows] = useState<Record<string, any>>({});

  const handleDragEnd = (result: DragEndResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    const sourceList = lists[source.droppableId];
    const destList = lists[destination.droppableId];
    const draggedItem = sourceList[source.index];

    // Create new lists
    const newLists = { ...lists };

    // Remove from source
    newLists[source.droppableId] = sourceList.filter((_, index) => index !== source.index);

    // Add to destination
    const newDestList = [...destList];
    newDestList.splice(destination.index, 0, draggedItem);
    newLists[destination.droppableId] = newDestList;

    setLists(newLists);
  };

  const getSentenceText = () => {
    return lists.sentence.map(item => item.text).join(' ');
  };

  const resetSentence = () => {
    setLists(prev => ({
      ...prev,
      sentence: []
    }));
    setPermanentShadows({});
  };

  return (
    <DragDropProvider>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          minHeight: '80px',
          border: '2px dashed #dee2e6'
        }}>
          <h3 style={{ marginBottom: '10px', color: '#495057' }}>Sentence Area</h3>
          <div style={{ 
            minHeight: '40px', 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '8px',
            alignItems: 'center'
          }}>
            {lists.sentence.length === 0 && (
              <span style={{ color: '#6c757d', fontStyle: 'italic' }}>
                Drag words here to build your sentence...
              </span>
            )}
            <CustomDragDrop
              lists={{ sentence: lists.sentence }}
              onDragEnd={handleDragEnd}
              mode="wordbank"
              permanentShadows={permanentShadows}
              setPermanentShadows={setPermanentShadows}
            />
          </div>
          {lists.sentence.length > 0 && (
            <div style={{ 
              marginTop: '15px', 
              padding: '10px', 
              background: '#e9ecef', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '16px'
            }}>
              <strong>Current sentence:</strong> {getSentenceText()}
            </div>
          )}
        </div>

        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '10px', color: '#495057' }}>Word Bank</h3>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '8px',
            minHeight: '60px'
          }}>
            <CustomDragDrop
              lists={{ wordBank: lists.wordBank }}
              onDragEnd={handleDragEnd}
              mode="reorder"
            />
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={resetSentence}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#c82333';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#dc3545';
            }}
          >
            Reset Sentence
          </button>
        </div>
      </div>
    </DragDropProvider>
  );
};

export default SentenceBuilderDemo; 