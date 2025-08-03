import React, { useState } from 'react';
import { CustomDragDrop } from '../../src/index';
import type { DragEndResult, Lists, DragMode } from '../../src/types/dragDrop';

const SentenceBuilderDemo: React.FC = () => {
  const [mode, setMode] = useState<DragMode>('wordbank');
  const [lists, setLists] = useState<Lists>({
    list1: [
      { id: '1', text: 'The', color: 'hsl(0, 0%, 20%)' },
      { id: '2', text: 'A', color: 'hsl(0, 0%, 25%)' },
      { id: '3', text: 'An', color: 'hsl(0, 0%, 30%)' },
      { id: '4', text: 'My', color: 'hsl(0, 0%, 35%)' },
      { id: '5', text: 'Your', color: 'hsl(0, 0%, 40%)' },
      { id: '6', text: 'His', color: 'hsl(0, 0%, 45%)' },
      { id: '7', text: 'Her', color: 'hsl(0, 0%, 50%)' },
    ],
    list2: [
      { id: '8', text: 'cat', color: 'hsl(0, 0%, 25%)' },
      { id: '9', text: 'dog', color: 'hsl(0, 0%, 30%)' },
      { id: '10', text: 'bird', color: 'hsl(0, 0%, 35%)' },
      { id: '11', text: 'fish', color: 'hsl(0, 0%, 40%)' },
      { id: '12', text: 'rabbit', color: 'hsl(0, 0%, 45%)' },
      { id: '13', text: 'hamster', color: 'hsl(0, 0%, 50%)' },
      { id: '14', text: 'turtle', color: 'hsl(0, 0%, 55%)' },
    ],
    list3: [
      { id: '15', text: 'runs', color: 'hsl(0, 0%, 30%)' },
      { id: '16', text: 'jumps', color: 'hsl(0, 0%, 35%)' },
      { id: '17', text: 'sleeps', color: 'hsl(0, 0%, 40%)' },
      { id: '18', text: 'eats', color: 'hsl(0, 0%, 45%)' },
      { id: '19', text: 'plays', color: 'hsl(0, 0%, 50%)' },
      { id: '20', text: 'swims', color: 'hsl(0, 0%, 55%)' },
      { id: '21', text: 'flies', color: 'hsl(0, 0%, 60%)' },
    ],
    paragraph: [
      { id: 'p1', text: 'The', color: 'hsl(0, 0%, 20%)' },
      { id: 'p2', text: 'quick', color: 'hsl(0, 0%, 25%)' },
      { id: 'p3', text: 'brown', color: 'hsl(0, 0%, 30%)' },
      { id: 'p4', text: 'fox', color: 'hsl(0, 0%, 35%)' },
      { id: 'p5', text: 'jumps', color: 'hsl(0, 0%, 40%)' },
      { id: 'p6', text: 'over', color: 'hsl(0, 0%, 45%)' },
      { id: 'p7', text: 'the', color: 'hsl(0, 0%, 50%)' },
      { id: 'p8', text: 'lazy', color: 'hsl(0, 0%, 55%)' },
      { id: 'p9', text: 'dog', color: 'hsl(0, 0%, 60%)' },
      { id: 'p10', text: '.', color: 'hsl(0, 0%, 65%)' },
      { id: 'p11', text: 'Birds', color: 'hsl(0, 0%, 70%)' },
      { id: 'p12', text: 'sing', color: 'hsl(0, 0%, 75%)' },
      { id: 'p13', text: 'sweetly', color: 'hsl(0, 0%, 80%)' },
      { id: 'p14', text: 'in', color: 'hsl(0, 0%, 85%)' },
      { id: 'p15', text: 'the', color: 'hsl(0, 0%, 90%)' },
      { id: 'p16', text: 'trees', color: 'hsl(0, 0%, 95%)' },
      { id: 'p17', text: '.', color: 'hsl(0, 0%, 100%)' },
      { id: 'p18', text: 'Children', color: 'hsl(0, 0%, 15%)' },
      { id: 'p19', text: 'play', color: 'hsl(0, 0%, 20%)' },
      { id: 'p20', text: 'happily', color: 'hsl(0, 0%, 25%)' },
      { id: 'p21', text: 'in', color: 'hsl(0, 0%, 30%)' },
      { id: 'p22', text: 'the', color: 'hsl(0, 0%, 35%)' },
      { id: 'p23', text: 'park', color: 'hsl(0, 0%, 40%)' },
      { id: 'p24', text: '.', color: 'hsl(0, 0%, 45%)' },
      { id: 'p25', text: 'Flowers', color: 'hsl(0, 0%, 50%)' },
      { id: 'p26', text: 'bloom', color: 'hsl(0, 0%, 55%)' },
      { id: 'p27', text: 'brightly', color: 'hsl(0, 0%, 60%)' },
      { id: 'p28', text: 'in', color: 'hsl(0, 0%, 65%)' },
      { id: 'p29', text: 'spring', color: 'hsl(0, 0%, 70%)' },
      { id: 'p30', text: '.', color: 'hsl(0, 0%, 75%)' },
      { id: 'p31', text: 'Stars', color: 'hsl(0, 0%, 80%)' },
      { id: 'p32', text: 'twinkle', color: 'hsl(0, 0%, 85%)' },
      { id: 'p33', text: 'gently', color: 'hsl(0, 0%, 90%)' },
      { id: 'p34', text: 'at', color: 'hsl(0, 0%, 95%)' },
      { id: 'p35', text: 'night', color: 'hsl(0, 0%, 100%)' },
      { id: 'p36', text: '.', color: 'hsl(0, 0%, 5%)' },
    ]
  });

  const [noReorderLists, setNoReorderLists] = useState<Lists>({
    sentence: [], // Empty sentence area
    wordBank: [
      { id: 'w1', text: 'The', color: 'hsl(200, 70%, 50%)' },
      { id: 'w2', text: 'A', color: 'hsl(200, 70%, 55%)' },
      { id: 'w3', text: 'My', color: 'hsl(200, 70%, 60%)' },
      { id: 'w4', text: 'cat', color: 'hsl(120, 70%, 50%)' },
      { id: 'w5', text: 'dog', color: 'hsl(120, 70%, 55%)' },
      { id: 'w6', text: 'bird', color: 'hsl(120, 70%, 60%)' },
      { id: 'w7', text: 'runs', color: 'hsl(40, 70%, 50%)' },
      { id: 'w8', text: 'jumps', color: 'hsl(40, 70%, 55%)' },
      { id: 'w9', text: 'sleeps', color: 'hsl(40, 70%, 60%)' },
      { id: 'w10', text: 'quickly', color: 'hsl(280, 70%, 50%)' },
      { id: 'w11', text: 'slowly', color: 'hsl(280, 70%, 55%)' },
      { id: 'w12', text: 'happily', color: 'hsl(280, 70%, 60%)' },
    ]
  });

  // New word bank mode with permanent shadows
  const [wordBankModeLists, setWordBankModeLists] = useState<Lists>({
    sentence: [], // Empty sentence area (reorder mode)
    wordBank: [
      { id: 'wb1', text: 'The', color: 'hsl(200, 70%, 50%)' },
      { id: 'wb2', text: 'A', color: 'hsl(200, 70%, 55%)' },
      { id: 'wb3', text: 'My', color: 'hsl(200, 70%, 60%)' },
      { id: 'wb4', text: 'cat', color: 'hsl(120, 70%, 50%)' },
      { id: 'wb5', text: 'dog', color: 'hsl(120, 70%, 55%)' },
      { id: 'wb6', text: 'bird', color: 'hsl(120, 70%, 60%)' },
      { id: 'wb7', text: 'runs', color: 'hsl(40, 70%, 50%)' },
      { id: 'wb8', text: 'jumps', color: 'hsl(40, 70%, 55%)' },
      { id: 'wb9', text: 'sleeps', color: 'hsl(40, 70%, 60%)' },
      { id: 'wb10', text: 'quickly', color: 'hsl(280, 70%, 50%)' },
      { id: 'wb11', text: 'slowly', color: 'hsl(280, 70%, 55%)' },
      { id: 'wb12', text: 'happily', color: 'hsl(280, 70%, 60%)' },
    ]
  });

  const [permanentShadows, setPermanentShadows] = useState<Record<string, any>>({});

  const handleModeChange = (event: React.MouseEvent<HTMLElement>, newMode: DragMode | null) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handleDragEnd = (result: DragEndResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceList = source.droppableId;
    const destList = destination.droppableId;

    // Create copies of the lists
    const newLists = { ...lists };
    const sourceItems = [...newLists[sourceList]];
    const destItems = sourceList === destList ? sourceItems : [...newLists[destList]];

    // Remove from source
    const [removed] = sourceItems.splice(source.index, 1);

    // Add to destination
    destItems.splice(destination.index, 0, removed);

    // Update the lists
    if (sourceList === destList) {
      // Reordering within the same list - only update that list
      newLists[sourceList] = sourceItems;
    } else {
      // Moving between different lists - update both
      newLists[sourceList] = sourceItems;
      newLists[destList] = destItems;
    }

    setLists(newLists);
  };

  const handleNoReorderDragEnd = (result: DragEndResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceList = source.droppableId;
    const destList = destination.droppableId;

    // Create copies of the lists
    const newLists = { ...noReorderLists };
    const sourceItems = [...newLists[sourceList]];
    const destItems = [...newLists[destList]];

    // Remove from source
    const [removed] = sourceItems.splice(source.index, 1);

    // Add to destination
    destItems.splice(destination.index, 0, removed);

    // Update the lists
    newLists[sourceList] = sourceItems;
    newLists[destList] = destItems;

    // Update the no reorder lists state
    setNoReorderLists(newLists);
  };

  const handleWordBankModeDragEnd = (result: DragEndResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceList = source.droppableId;
    const destList = destination.droppableId;

    // Create copies of the lists
    const newLists = { ...wordBankModeLists };
    const sourceItems = [...newLists[sourceList]];
    const destItems = [...newLists[destList]];

    if (sourceList === 'wordBank') {
      // Word is being dragged FROM word bank
      const originalWord = sourceItems[source.index];
      
      // Create a clone for the destination (sentence area)
      const clonedWord = {
        ...originalWord,
        id: `${originalWord.id}-clone-${Date.now()}`, // Unique ID for the clone
        isClone: true
      };
      
      // Add clone to destination
      destItems.splice(destination.index, 0, clonedWord);
      
      // Mark the original word as a shadow in the word bank
      setPermanentShadows(prev => ({
      ...prev,
        [originalWord.id]: {
          text: originalWord.text,
          color: originalWord.color,
          originalIndex: source.index
        }
      }));
      
    } else if (destList === 'wordBank') {
      // Word is being dragged TO word bank (returning a word)
      const returnedWord = sourceItems[source.index];
      
      // Remove from source
      sourceItems.splice(source.index, 1);
      
      // Find the original word in the word bank and remove its shadow
      if (returnedWord.isClone) {
        // This is a clone being returned, find the original word ID
        const originalWordId = returnedWord.id.split('-clone-')[0];
        if (permanentShadows[originalWordId]) {
          setPermanentShadows(prev => {
            const newShadows = { ...prev };
            delete newShadows[originalWordId];
            return newShadows;
          });
        }
      }
      
    } else {
      // Moving between non-word-bank lists (e.g., reordering in sentence)
      if (sourceList === destList) {
        // Reordering within the same list
        const [removed] = sourceItems.splice(source.index, 1);
        // Adjust destination index if we removed an item before it
        const adjustedDestIndex = source.index < destination.index ? destination.index - 1 : destination.index;
        sourceItems.splice(adjustedDestIndex, 0, removed);
        console.log('Reordered:', removed.text, 'from', source.index, 'to', adjustedDestIndex);
        console.log('Source index:', source.index, 'Destination index:', destination.index, 'Adjusted:', adjustedDestIndex);
        console.log('Modified sourceItems:', sourceItems.map(item => item.text));
        // No need to update destItems since it's the same array
      } else {
        // Moving between different lists
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
      }
    }

    // Update the lists
    if (sourceList === destList) {
      // Reordering within the same list - only update that list
      newLists[sourceList] = [...sourceItems]; // Create a new array copy
    } else {
      // Moving between different lists - update both
      newLists[sourceList] = [...sourceItems];
      newLists[destList] = [...destItems];
    }

    console.log('Before update - sentence items:', wordBankModeLists.sentence.map(item => item.text));
    setWordBankModeLists(newLists);
    console.log('After update - new sentence items:', newLists.sentence.map(item => item.text));
  };

  const resetLists = () => {
    if (mode === 'reorder') {
      setLists({
        list1: [
          { id: '1', text: 'The', color: 'hsl(0, 0%, 20%)' },
          { id: '2', text: 'A', color: 'hsl(0, 0%, 25%)' },
          { id: '3', text: 'An', color: 'hsl(0, 0%, 30%)' },
          { id: '4', text: 'My', color: 'hsl(0, 0%, 35%)' },
          { id: '5', text: 'Your', color: 'hsl(0, 0%, 40%)' },
          { id: '6', text: 'His', color: 'hsl(0, 0%, 45%)' },
          { id: '7', text: 'Her', color: 'hsl(0, 0%, 50%)' },
        ],
        list2: [
          { id: '8', text: 'cat', color: 'hsl(0, 0%, 25%)' },
          { id: '9', text: 'dog', color: 'hsl(0, 0%, 30%)' },
          { id: '10', text: 'bird', color: 'hsl(0, 0%, 35%)' },
          { id: '11', text: 'fish', color: 'hsl(0, 0%, 40%)' },
          { id: '12', text: 'rabbit', color: 'hsl(0, 0%, 45%)' },
          { id: '13', text: 'hamster', color: 'hsl(0, 0%, 50%)' },
          { id: '14', text: 'turtle', color: 'hsl(0, 0%, 55%)' },
        ],
        list3: [
          { id: '15', text: 'runs', color: 'hsl(0, 0%, 30%)' },
          { id: '16', text: 'jumps', color: 'hsl(0, 0%, 35%)' },
          { id: '17', text: 'sleeps', color: 'hsl(0, 0%, 40%)' },
          { id: '18', text: 'eats', color: 'hsl(0, 0%, 45%)' },
          { id: '19', text: 'plays', color: 'hsl(0, 0%, 50%)' },
          { id: '20', text: 'swims', color: 'hsl(0, 0%, 55%)' },
          { id: '21', text: 'flies', color: 'hsl(0, 0%, 60%)' },
        ],
        paragraph: [
          { id: 'p1', text: 'The', color: 'hsl(0, 0%, 20%)' },
          { id: 'p2', text: 'quick', color: 'hsl(0, 0%, 25%)' },
          { id: 'p3', text: 'brown', color: 'hsl(0, 0%, 30%)' },
          { id: 'p4', text: 'fox', color: 'hsl(0, 0%, 35%)' },
          { id: 'p5', text: 'jumps', color: 'hsl(0, 0%, 40%)' },
          { id: 'p6', text: 'over', color: 'hsl(0, 0%, 45%)' },
          { id: 'p7', text: 'the', color: 'hsl(0, 0%, 50%)' },
          { id: 'p8', text: 'lazy', color: 'hsl(0, 0%, 55%)' },
          { id: 'p9', text: 'dog', color: 'hsl(0, 0%, 60%)' },
          { id: 'p10', text: '.', color: 'hsl(0, 0%, 65%)' },
          { id: 'p11', text: 'Birds', color: 'hsl(0, 0%, 70%)' },
          { id: 'p12', text: 'sing', color: 'hsl(0, 0%, 75%)' },
          { id: 'p13', text: 'sweetly', color: 'hsl(0, 0%, 80%)' },
          { id: 'p14', text: 'in', color: 'hsl(0, 0%, 85%)' },
          { id: 'p15', text: 'the', color: 'hsl(0, 0%, 90%)' },
          { id: 'p16', text: 'trees', color: 'hsl(0, 0%, 95%)' },
          { id: 'p17', text: '.', color: 'hsl(0, 0%, 100%)' },
          { id: 'p18', text: 'Children', color: 'hsl(0, 0%, 15%)' },
          { id: 'p19', text: 'play', color: 'hsl(0, 0%, 20%)' },
          { id: 'p20', text: 'happily', color: 'hsl(0, 0%, 25%)' },
          { id: 'p21', text: 'in', color: 'hsl(0, 0%, 30%)' },
          { id: 'p22', text: 'the', color: 'hsl(0, 0%, 35%)' },
          { id: 'p23', text: 'park', color: 'hsl(0, 0%, 40%)' },
          { id: 'p24', text: '.', color: 'hsl(0, 0%, 45%)' },
          { id: 'p25', text: 'Flowers', color: 'hsl(0, 0%, 50%)' },
          { id: 'p26', text: 'bloom', color: 'hsl(0, 0%, 55%)' },
          { id: 'p27', text: 'brightly', color: 'hsl(0, 0%, 60%)' },
          { id: 'p28', text: 'in', color: 'hsl(0, 0%, 65%)' },
          { id: 'p29', text: 'spring', color: 'hsl(0, 0%, 70%)' },
          { id: 'p30', text: '.', color: 'hsl(0, 0%, 75%)' },
          { id: 'p31', text: 'Stars', color: 'hsl(0, 0%, 80%)' },
          { id: 'p32', text: 'twinkle', color: 'hsl(0, 0%, 85%)' },
          { id: 'p33', text: 'gently', color: 'hsl(0, 0%, 90%)' },
          { id: 'p34', text: 'at', color: 'hsl(0, 0%, 95%)' },
          { id: 'p35', text: 'night', color: 'hsl(0, 0%, 100%)' },
          { id: 'p36', text: '.', color: 'hsl(0, 0%, 5%)' },
        ]
      });
    } else if (mode === 'noreorder') {
      // Reset no reorder lists
      setNoReorderLists({
        sentence: [], // Empty sentence area
        wordBank: [
          { id: 'w1', text: 'The', color: 'hsl(200, 70%, 50%)' },
          { id: 'w2', text: 'A', color: 'hsl(200, 70%, 55%)' },
          { id: 'w3', text: 'My', color: 'hsl(200, 70%, 60%)' },
          { id: 'w4', text: 'cat', color: 'hsl(120, 70%, 50%)' },
          { id: 'w5', text: 'dog', color: 'hsl(120, 70%, 55%)' },
          { id: 'w6', text: 'bird', color: 'hsl(120, 70%, 60%)' },
          { id: 'w7', text: 'runs', color: 'hsl(40, 70%, 50%)' },
          { id: 'w8', text: 'jumps', color: 'hsl(40, 70%, 55%)' },
          { id: 'w9', text: 'sleeps', color: 'hsl(40, 70%, 60%)' },
          { id: 'w10', text: 'quickly', color: 'hsl(280, 70%, 50%)' },
          { id: 'w11', text: 'slowly', color: 'hsl(280, 70%, 55%)' },
          { id: 'w12', text: 'happily', color: 'hsl(280, 70%, 60%)' },
        ]
      });
    } else if (mode === 'wordbank') {
      // Reset word bank mode lists
      setWordBankModeLists({
        sentence: [], // Empty sentence area
        wordBank: [
          { id: 'wb1', text: 'The', color: 'hsl(200, 70%, 50%)' },
          { id: 'wb2', text: 'A', color: 'hsl(200, 70%, 55%)' },
          { id: 'wb3', text: 'My', color: 'hsl(200, 70%, 60%)' },
          { id: 'wb4', text: 'cat', color: 'hsl(120, 70%, 50%)' },
          { id: 'wb5', text: 'dog', color: 'hsl(120, 70%, 55%)' },
          { id: 'wb6', text: 'bird', color: 'hsl(120, 70%, 60%)' },
          { id: 'wb7', text: 'runs', color: 'hsl(40, 70%, 50%)' },
          { id: 'wb8', text: 'jumps', color: 'hsl(40, 70%, 55%)' },
          { id: 'wb9', text: 'sleeps', color: 'hsl(40, 70%, 60%)' },
          { id: 'wb10', text: 'quickly', color: 'hsl(280, 70%, 50%)' },
          { id: 'wb11', text: 'slowly', color: 'hsl(280, 70%, 55%)' },
          { id: 'wb12', text: 'happily', color: 'hsl(280, 70%, 60%)' },
        ]
      });
    setPermanentShadows({});
    }
  };

  const currentLists = mode === 'wordbank' ? wordBankModeLists : 
                      mode === 'noreorder' ? noReorderLists : lists;
  const currentDragEnd = mode === 'wordbank' ? handleWordBankModeDragEnd :
                        mode === 'noreorder' ? handleNoReorderDragEnd : handleDragEnd;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '16px', color: '#333' }}>
          Custom Drag & Drop Demo
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
          {mode === 'reorder' 
            ? 'Build sentences by dragging words between the lists below. Create sentences like "The cat runs quickly" or "My dog sleeps quietly".'
            : mode === 'noreorder'
            ? 'Drag words from the word bank to build your sentence. Words can only be moved from the word bank to the sentence area.'
            : 'Word Bank Mode: Drag words from the word bank to build your sentence. Words remember their original positions with permanent shadows.'
          }
        </p>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => setMode('wordbank')}
              style={{
                background: mode === 'wordbank' ? '#1976d2' : '#f5f5f5',
                color: mode === 'wordbank' ? 'white' : '#333',
                border: '1px solid #ddd',
                padding: '8px 16px',
                margin: '0 4px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Word Bank Mode
            </button>
            <button
              onClick={() => setMode('reorder')}
              style={{
                background: mode === 'reorder' ? '#1976d2' : '#f5f5f5',
                color: mode === 'reorder' ? 'white' : '#333',
                border: '1px solid #ddd',
                padding: '8px 16px',
                margin: '0 4px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Reorder Mode
            </button>
            <button
              onClick={() => setMode('noreorder')}
              style={{
                background: mode === 'noreorder' ? '#1976d2' : '#f5f5f5',
                color: mode === 'noreorder' ? 'white' : '#333',
                border: '1px solid #ddd',
                padding: '8px 16px',
                margin: '0 4px',
              borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              No Reorder Mode
            </button>
        </div>

          <button
            onClick={resetLists}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Reset Lists
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <CustomDragDrop 
          lists={currentLists}
          onDragEnd={currentDragEnd}
          mode={mode}
          permanentShadows={permanentShadows}
          setPermanentShadows={setPermanentShadows}
        />
      </div>

      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ marginBottom: '16px', color: '#495057' }}>How to Use</h3>
        {mode === 'reorder' ? (
          <div>
            <p style={{ marginBottom: '8px' }}>• Click and drag any colored item to move it</p>
            <p style={{ marginBottom: '8px' }}>• Drop items in the same list to reorder them</p>
            <p style={{ marginBottom: '8px' }}>• Drop items in different lists to move them between lists</p>
            <p style={{ marginBottom: '8px' }}>• Use the "Reset Lists" button to restore the original order</p>
          </div>
        ) : mode === 'noreorder' ? (
          <div>
            <p style={{ marginBottom: '8px' }}>• Drag words from the Word Bank to the Sentence area</p>
            <p style={{ marginBottom: '8px' }}>• Words can only be moved from the word bank to the sentence</p>
            <p style={{ marginBottom: '8px' }}>• The source list becomes dimmed when dragging</p>
            <p style={{ marginBottom: '8px' }}>• Blue drop zones indicate valid drop areas</p>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: '8px' }}>• Drag words from the Word Bank to build your sentence</p>
            <p style={{ marginBottom: '8px' }}>• Words remember their original positions with permanent shadows</p>
            <p style={{ marginBottom: '8px' }}>• You can drag words back to replace their shadows</p>
            <p style={{ marginBottom: '8px' }}>• The sentence area allows reordering of words</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SentenceBuilderDemo; 