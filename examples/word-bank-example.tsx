import React, { useState } from 'react';
import { DragDropProvider, Draggable, Droppable, DragResult, DragMode } from '../src';

interface Word {
  id: string;
  text: string;
  category: string;
}

const WordBankExample: React.FC = () => {
  const [wordBank, setWordBank] = useState<Word[]>([
    { id: 'word1', text: 'React', category: 'library' },
    { id: 'word2', text: 'TypeScript', category: 'language' },
    { id: 'word3', text: 'Vue', category: 'library' },
    { id: 'word4', text: 'JavaScript', category: 'language' },
    { id: 'word5', text: 'Angular', category: 'library' },
    { id: 'word6', text: 'Python', category: 'language' },
  ]);

  const [selectedWords, setSelectedWords] = useState<Word[]>([]);

  const handleDragEnd = (result: DragResult) => {
    if (!result.destination) return;

    const draggedWord = wordBank.find(word => word.id === result.draggableId);
    if (!draggedWord) return;

    if (result.destination.droppableId === 'target-area') {
      // Add to selected words if not already there
      if (!selectedWords.find(word => word.id === draggedWord.id)) {
        setSelectedWords(prev => [...prev, draggedWord]);
      }
    } else if (result.destination.droppableId === 'word-bank') {
      // Remove from selected words
      setSelectedWords(prev => prev.filter(word => word.id !== draggedWord.id));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Word Bank Example</h2>
      <p>Drag words from the word bank to the target area:</p>
      
      <DragDropProvider 
        mode={DragMode.WORDBANK}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          {/* Word Bank */}
          <div style={{ flex: 1 }}>
            <h3>Word Bank</h3>
            <Droppable droppableId="word-bank">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    padding: '15px',
                    minHeight: '200px',
                    backgroundColor: snapshot.isDraggingOver ? '#f0f8ff' : '#fafafa',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  {wordBank.map((word, index) => (
                    <Draggable key={word.id} draggableId={word.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            padding: '8px 12px',
                            margin: '4px',
                            backgroundColor: snapshot.isDragging ? '#e3f2fd' : '#f5f5f5',
                            border: '1px solid #ddd',
                            borderRadius: '20px',
                            display: 'inline-block',
                            cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                            userSelect: 'none',
                            fontSize: '14px',
                            boxShadow: snapshot.isDragging ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                            transition: 'all 0.2s ease',
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

          {/* Target Area */}
          <div style={{ flex: 1 }}>
            <h3>Target Area</h3>
            <Droppable droppableId="target-area">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    border: '2px solid #4caf50',
                    borderRadius: '8px',
                    padding: '15px',
                    minHeight: '200px',
                    backgroundColor: snapshot.isDraggingOver ? '#e8f5e8' : '#f8fff8',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  {selectedWords.map((word, index) => (
                    <Draggable key={word.id} draggableId={word.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            padding: '8px 12px',
                            margin: '4px',
                            backgroundColor: snapshot.isDragging ? '#e3f2fd' : '#4caf50',
                            color: 'white',
                            border: '1px solid #45a049',
                            borderRadius: '20px',
                            display: 'inline-block',
                            cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                            userSelect: 'none',
                            fontSize: '14px',
                            boxShadow: snapshot.isDragging ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {word.text}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {selectedWords.length === 0 && (
                    <div style={{ 
                      textAlign: 'center', 
                      color: '#999', 
                      fontStyle: 'italic',
                      marginTop: '60px'
                    }}>
                      Drop words here
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropProvider>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Selected words:</strong> {selectedWords.length}</p>
        <p><strong>Available words:</strong> {wordBank.length}</p>
      </div>
    </div>
  );
};

export default WordBankExample; 