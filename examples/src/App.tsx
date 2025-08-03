import React, { useState, useCallback } from 'react';
import CustomDragDrop from './CustomDragDrop';
import './App.css';

interface DragItem {
  id: string;
  text: string;
  color: string;
  isClone?: boolean;
}

interface Lists {
  [key: string]: DragItem[];
}

interface NoReorderLists extends Lists {
  sentence: DragItem[];
  wordBank: DragItem[];
}

interface WordBankModeLists extends Lists {
  sentence: DragItem[];
  wordBank: DragItem[];
}

function App() {
  const [mode, setMode] = useState<'wordbank' | 'reorder' | 'noreorder'>('wordbank');
  const [lists, setLists] = useState<Lists>({
    list1: [
      { id: '1', text: 'The', color: 'hsl(200, 70%, 50%)' },
      { id: '2', text: 'A', color: 'hsl(200, 70%, 55%)' },
      { id: '3', text: 'An', color: 'hsl(200, 70%, 60%)' },
      { id: '4', text: 'My', color: 'hsl(200, 70%, 65%)' },
      { id: '5', text: 'Your', color: 'hsl(200, 70%, 70%)' },
      { id: '6', text: 'His', color: 'hsl(200, 70%, 75%)' },
      { id: '7', text: 'Her', color: 'hsl(200, 70%, 80%)' },
      { id: '8', text: 'Our', color: 'hsl(200, 70%, 85%)' },
      { id: '9', text: 'Their', color: 'hsl(200, 70%, 90%)' },
      { id: '10', text: 'This', color: 'hsl(200, 70%, 95%)' },
      { id: '11', text: 'That', color: 'hsl(210, 70%, 50%)' },
      { id: '12', text: 'These', color: 'hsl(210, 70%, 55%)' },
      { id: '13', text: 'Those', color: 'hsl(210, 70%, 60%)' },
      { id: '14', text: 'Some', color: 'hsl(210, 70%, 65%)' },
      { id: '15', text: 'Any', color: 'hsl(210, 70%, 70%)' },
      { id: '16', text: 'Many', color: 'hsl(210, 70%, 75%)' },
      { id: '17', text: 'Few', color: 'hsl(210, 70%, 80%)' },
      { id: '18', text: 'Several', color: 'hsl(210, 70%, 85%)' },
      { id: '19', text: 'All', color: 'hsl(210, 70%, 90%)' },
      { id: '20', text: 'Every', color: 'hsl(210, 70%, 95%)' },
      { id: '21', text: 'Each', color: 'hsl(220, 70%, 50%)' },
      { id: '22', text: 'Both', color: 'hsl(220, 70%, 55%)' },
      { id: '23', text: 'Either', color: 'hsl(220, 70%, 60%)' },
      { id: '24', text: 'Neither', color: 'hsl(220, 70%, 65%)' },
      { id: '25', text: 'No', color: 'hsl(220, 70%, 70%)' },
      { id: '26', text: 'Such', color: 'hsl(220, 70%, 75%)' },
      { id: '27', text: 'What', color: 'hsl(220, 70%, 80%)' },
      { id: '28', text: 'Which', color: 'hsl(220, 70%, 85%)' },
      { id: '29', text: 'Whose', color: 'hsl(220, 70%, 90%)' },
      { id: '30', text: 'Whatever', color: 'hsl(220, 70%, 95%)' },
    ],
    list2: [
      { id: '31', text: 'cat', color: 'hsl(120, 70%, 50%)' },
      { id: '32', text: 'dog', color: 'hsl(120, 70%, 55%)' },
      { id: '33', text: 'bird', color: 'hsl(120, 70%, 60%)' },
      { id: '34', text: 'fish', color: 'hsl(120, 70%, 65%)' },
      { id: '35', text: 'horse', color: 'hsl(120, 70%, 70%)' },
      { id: '36', text: 'cow', color: 'hsl(120, 70%, 75%)' },
      { id: '37', text: 'pig', color: 'hsl(120, 70%, 80%)' },
      { id: '38', text: 'sheep', color: 'hsl(120, 70%, 85%)' },
      { id: '39', text: 'goat', color: 'hsl(120, 70%, 90%)' },
      { id: '40', text: 'rabbit', color: 'hsl(120, 70%, 95%)' },
      { id: '41', text: 'mouse', color: 'hsl(130, 70%, 50%)' },
      { id: '42', text: 'rat', color: 'hsl(130, 70%, 55%)' },
      { id: '43', text: 'hamster', color: 'hsl(130, 70%, 60%)' },
      { id: '44', text: 'guinea pig', color: 'hsl(130, 70%, 65%)' },
      { id: '45', text: 'ferret', color: 'hsl(130, 70%, 70%)' },
      { id: '46', text: 'snake', color: 'hsl(130, 70%, 75%)' },
      { id: '47', text: 'lizard', color: 'hsl(130, 70%, 80%)' },
      { id: '48', text: 'turtle', color: 'hsl(130, 70%, 85%)' },
      { id: '49', text: 'frog', color: 'hsl(130, 70%, 90%)' },
      { id: '50', text: 'toad', color: 'hsl(130, 70%, 95%)' },
      { id: '51', text: 'elephant', color: 'hsl(140, 70%, 50%)' },
      { id: '52', text: 'giraffe', color: 'hsl(140, 70%, 55%)' },
      { id: '53', text: 'zebra', color: 'hsl(140, 70%, 60%)' },
      { id: '54', text: 'lion', color: 'hsl(140, 70%, 65%)' },
      { id: '55', text: 'tiger', color: 'hsl(140, 70%, 70%)' },
      { id: '56', text: 'bear', color: 'hsl(140, 70%, 75%)' },
      { id: '57', text: 'wolf', color: 'hsl(140, 70%, 80%)' },
      { id: '58', text: 'fox', color: 'hsl(140, 70%, 85%)' },
      { id: '59', text: 'deer', color: 'hsl(140, 70%, 90%)' },
      { id: '60', text: 'moose', color: 'hsl(140, 70%, 95%)' },
      { id: '61', text: 'dolphin', color: 'hsl(150, 70%, 50%)' },
      { id: '62', text: 'whale', color: 'hsl(150, 70%, 55%)' },
      { id: '63', text: 'shark', color: 'hsl(150, 70%, 60%)' },
      { id: '64', text: 'octopus', color: 'hsl(150, 70%, 65%)' },
      { id: '65', text: 'squid', color: 'hsl(150, 70%, 70%)' },
      { id: '66', text: 'crab', color: 'hsl(150, 70%, 75%)' },
      { id: '67', text: 'lobster', color: 'hsl(150, 70%, 80%)' },
      { id: '68', text: 'shrimp', color: 'hsl(150, 70%, 85%)' },
      { id: '69', text: 'clam', color: 'hsl(150, 70%, 90%)' },
      { id: '70', text: 'oyster', color: 'hsl(150, 70%, 95%)' },
    ],
    list3: [
      { id: '71', text: 'runs', color: 'hsl(40, 70%, 50%)' },
      { id: '72', text: 'jumps', color: 'hsl(40, 70%, 55%)' },
      { id: '73', text: 'sleeps', color: 'hsl(40, 70%, 60%)' },
      { id: '74', text: 'eats', color: 'hsl(40, 70%, 65%)' },
      { id: '75', text: 'drinks', color: 'hsl(40, 70%, 70%)' },
      { id: '76', text: 'walks', color: 'hsl(40, 70%, 75%)' },
      { id: '77', text: 'swims', color: 'hsl(40, 70%, 80%)' },
      { id: '78', text: 'flies', color: 'hsl(40, 70%, 85%)' },
      { id: '79', text: 'crawls', color: 'hsl(40, 70%, 90%)' },
      { id: '80', text: 'climbs', color: 'hsl(40, 70%, 95%)' },
      { id: '81', text: 'plays', color: 'hsl(50, 70%, 50%)' },
      { id: '82', text: 'works', color: 'hsl(50, 70%, 55%)' },
      { id: '83', text: 'studies', color: 'hsl(50, 70%, 60%)' },
      { id: '84', text: 'reads', color: 'hsl(50, 70%, 65%)' },
      { id: '85', text: 'writes', color: 'hsl(50, 70%, 70%)' },
      { id: '86', text: 'speaks', color: 'hsl(50, 70%, 75%)' },
      { id: '87', text: 'listens', color: 'hsl(50, 70%, 80%)' },
      { id: '88', text: 'watches', color: 'hsl(50, 70%, 85%)' },
      { id: '89', text: 'sees', color: 'hsl(50, 70%, 90%)' },
      { id: '90', text: 'hears', color: 'hsl(50, 70%, 95%)' },
      { id: '91', text: 'smells', color: 'hsl(60, 70%, 50%)' },
      { id: '92', text: 'tastes', color: 'hsl(60, 70%, 55%)' },
      { id: '93', text: 'touches', color: 'hsl(60, 70%, 60%)' },
      { id: '94', text: 'feels', color: 'hsl(60, 70%, 65%)' },
      { id: '95', text: 'thinks', color: 'hsl(60, 70%, 70%)' },
      { id: '96', text: 'knows', color: 'hsl(60, 70%, 75%)' },
      { id: '97', text: 'understands', color: 'hsl(60, 70%, 80%)' },
      { id: '98', text: 'remembers', color: 'hsl(60, 70%, 85%)' },
      { id: '99', text: 'forgets', color: 'hsl(60, 70%, 90%)' },
      { id: '100', text: 'learns', color: 'hsl(60, 70%, 95%)' },
      { id: '101', text: 'teaches', color: 'hsl(70, 70%, 50%)' },
      { id: '102', text: 'helps', color: 'hsl(70, 70%, 55%)' },
      { id: '103', text: 'saves', color: 'hsl(70, 70%, 60%)' },
      { id: '104', text: 'protects', color: 'hsl(70, 70%, 65%)' },
      { id: '105', text: 'guards', color: 'hsl(70, 70%, 70%)' },
      { id: '106', text: 'follows', color: 'hsl(70, 70%, 75%)' },
      { id: '107', text: 'leads', color: 'hsl(70, 70%, 80%)' },
      { id: '108', text: 'chases', color: 'hsl(70, 70%, 85%)' },
      { id: '109', text: 'catches', color: 'hsl(70, 70%, 90%)' },
      { id: '110', text: 'hunts', color: 'hsl(70, 70%, 95%)' },
      { id: '111', text: 'fishes', color: 'hsl(80, 70%, 50%)' },
      { id: '112', text: 'gathers', color: 'hsl(80, 70%, 55%)' },
      { id: '113', text: 'collects', color: 'hsl(80, 70%, 60%)' },
      { id: '114', text: 'builds', color: 'hsl(80, 70%, 65%)' },
      { id: '115', text: 'creates', color: 'hsl(80, 70%, 70%)' },
      { id: '116', text: 'makes', color: 'hsl(80, 70%, 75%)' },
      { id: '117', text: 'fixes', color: 'hsl(80, 70%, 80%)' },
      { id: '118', text: 'repairs', color: 'hsl(80, 70%, 85%)' },
      { id: '119', text: 'cleans', color: 'hsl(80, 70%, 90%)' },
      { id: '120', text: 'washes', color: 'hsl(80, 70%, 95%)' },
    ]
  });

  const [noReorderLists, setNoReorderLists] = useState<NoReorderLists>({
    sentence: [],
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

  const [wordBankModeLists, setWordBankModeLists] = useState<WordBankModeLists>({
    sentence: [],
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

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceList = source.droppableId as string;
    const destList = destination.droppableId as string;

    if (mode === 'reorder') {
      const newLists = { ...lists };
      const sourceItems = [...newLists[sourceList as keyof typeof lists]];
      const destItems = sourceList === destList ? sourceItems : [...newLists[destList as keyof typeof lists]];

      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      if (sourceList === destList) {
        newLists[sourceList as keyof typeof lists] = sourceItems;
      } else {
        newLists[sourceList as keyof typeof lists] = sourceItems;
        newLists[destList as keyof typeof lists] = destItems;
      }

      setLists(newLists);
    } else if (mode === 'noreorder') {
      const newLists = { ...noReorderLists };
      const sourceItems = [...newLists[sourceList as keyof typeof noReorderLists]];
      const destItems = [...newLists[destList as keyof typeof noReorderLists]];

      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      newLists[sourceList as keyof typeof noReorderLists] = sourceItems;
      newLists[destList as keyof typeof noReorderLists] = destItems;

      setNoReorderLists(newLists);
    } else if (mode === 'wordbank') {
      const newLists = { ...wordBankModeLists };
      const sourceItems = [...newLists[sourceList as keyof typeof wordBankModeLists]];
      const destItems = [...newLists[destList as keyof typeof wordBankModeLists]];

      if (sourceList === 'wordBank') {
        const originalWord = sourceItems[source.index];
        
        const clonedWord: DragItem = {
          ...originalWord,
          id: `${originalWord.id}-clone-${Date.now()}`,
          isClone: true
        };
        
        destItems.splice(destination.index, 0, clonedWord);
        
        setPermanentShadows(prev => ({
          ...prev,
          [originalWord.id]: {
            text: originalWord.text,
            color: originalWord.color,
            originalIndex: source.index
          }
        }));
        
      } else if (destList === 'wordBank') {
        const returnedWord = sourceItems[source.index];
        
        sourceItems.splice(source.index, 1);
        
        if (returnedWord.isClone) {
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
        if (sourceList === destList) {
          const [removed] = sourceItems.splice(source.index, 1);
          const adjustedDestIndex = source.index < destination.index ? destination.index - 1 : destination.index;
          sourceItems.splice(adjustedDestIndex, 0, removed);
        } else {
          const [removed] = sourceItems.splice(source.index, 1);
          destItems.splice(destination.index, 0, removed);
        }
      }

      if (sourceList === destList) {
        newLists[sourceList as keyof typeof wordBankModeLists] = [...sourceItems];
      } else {
        newLists[sourceList as keyof typeof wordBankModeLists] = [...sourceItems];
        newLists[destList as keyof typeof wordBankModeLists] = [...destItems];
      }

      setWordBankModeLists(newLists);
    }
  }, [mode, lists, noReorderLists, wordBankModeLists, permanentShadows]);

  const resetLists = () => {
    if (mode === 'reorder') {
      setLists({
        list1: [
          { id: '1', text: 'The', color: 'hsl(200, 70%, 50%)' },
          { id: '2', text: 'A', color: 'hsl(200, 70%, 55%)' },
          { id: '3', text: 'An', color: 'hsl(200, 70%, 60%)' },
          { id: '4', text: 'My', color: 'hsl(200, 70%, 65%)' },
          { id: '5', text: 'Your', color: 'hsl(200, 70%, 70%)' },
          { id: '6', text: 'His', color: 'hsl(200, 70%, 75%)' },
          { id: '7', text: 'Her', color: 'hsl(200, 70%, 80%)' },
          { id: '8', text: 'Our', color: 'hsl(200, 70%, 85%)' },
          { id: '9', text: 'Their', color: 'hsl(200, 70%, 90%)' },
          { id: '10', text: 'This', color: 'hsl(200, 70%, 95%)' },
          { id: '11', text: 'That', color: 'hsl(210, 70%, 50%)' },
          { id: '12', text: 'These', color: 'hsl(210, 70%, 55%)' },
          { id: '13', text: 'Those', color: 'hsl(210, 70%, 60%)' },
          { id: '14', text: 'Some', color: 'hsl(210, 70%, 65%)' },
          { id: '15', text: 'Any', color: 'hsl(210, 70%, 70%)' },
          { id: '16', text: 'Many', color: 'hsl(210, 70%, 75%)' },
          { id: '17', text: 'Few', color: 'hsl(210, 70%, 80%)' },
          { id: '18', text: 'Several', color: 'hsl(210, 70%, 85%)' },
          { id: '19', text: 'All', color: 'hsl(210, 70%, 90%)' },
          { id: '20', text: 'Every', color: 'hsl(210, 70%, 95%)' },
          { id: '21', text: 'Each', color: 'hsl(220, 70%, 50%)' },
          { id: '22', text: 'Both', color: 'hsl(220, 70%, 55%)' },
          { id: '23', text: 'Either', color: 'hsl(220, 70%, 60%)' },
          { id: '24', text: 'Neither', color: 'hsl(220, 70%, 65%)' },
          { id: '25', text: 'No', color: 'hsl(220, 70%, 70%)' },
          { id: '26', text: 'Such', color: 'hsl(220, 70%, 75%)' },
          { id: '27', text: 'What', color: 'hsl(220, 70%, 80%)' },
          { id: '28', text: 'Which', color: 'hsl(220, 70%, 85%)' },
          { id: '29', text: 'Whose', color: 'hsl(220, 70%, 90%)' },
          { id: '30', text: 'Whatever', color: 'hsl(220, 70%, 95%)' },
        ],
        list2: [
          { id: '31', text: 'cat', color: 'hsl(120, 70%, 50%)' },
          { id: '32', text: 'dog', color: 'hsl(120, 70%, 55%)' },
          { id: '33', text: 'bird', color: 'hsl(120, 70%, 60%)' },
          { id: '34', text: 'fish', color: 'hsl(120, 70%, 65%)' },
          { id: '35', text: 'horse', color: 'hsl(120, 70%, 70%)' },
          { id: '36', text: 'cow', color: 'hsl(120, 70%, 75%)' },
          { id: '37', text: 'pig', color: 'hsl(120, 70%, 80%)' },
          { id: '38', text: 'sheep', color: 'hsl(120, 70%, 85%)' },
          { id: '39', text: 'goat', color: 'hsl(120, 70%, 90%)' },
          { id: '40', text: 'rabbit', color: 'hsl(120, 70%, 95%)' },
          { id: '41', text: 'mouse', color: 'hsl(130, 70%, 50%)' },
          { id: '42', text: 'rat', color: 'hsl(130, 70%, 55%)' },
          { id: '43', text: 'hamster', color: 'hsl(130, 70%, 60%)' },
          { id: '44', text: 'guinea pig', color: 'hsl(130, 70%, 65%)' },
          { id: '45', text: 'ferret', color: 'hsl(130, 70%, 70%)' },
          { id: '46', text: 'snake', color: 'hsl(130, 70%, 75%)' },
          { id: '47', text: 'lizard', color: 'hsl(130, 70%, 80%)' },
          { id: '48', text: 'turtle', color: 'hsl(130, 70%, 85%)' },
          { id: '49', text: 'frog', color: 'hsl(130, 70%, 90%)' },
          { id: '50', text: 'toad', color: 'hsl(130, 70%, 95%)' },
          { id: '51', text: 'elephant', color: 'hsl(140, 70%, 50%)' },
          { id: '52', text: 'giraffe', color: 'hsl(140, 70%, 55%)' },
          { id: '53', text: 'zebra', color: 'hsl(140, 70%, 60%)' },
          { id: '54', text: 'lion', color: 'hsl(140, 70%, 65%)' },
          { id: '55', text: 'tiger', color: 'hsl(140, 70%, 70%)' },
          { id: '56', text: 'bear', color: 'hsl(140, 70%, 75%)' },
          { id: '57', text: 'wolf', color: 'hsl(140, 70%, 80%)' },
          { id: '58', text: 'fox', color: 'hsl(140, 70%, 85%)' },
          { id: '59', text: 'deer', color: 'hsl(140, 70%, 90%)' },
          { id: '60', text: 'moose', color: 'hsl(140, 70%, 95%)' },
          { id: '61', text: 'dolphin', color: 'hsl(150, 70%, 50%)' },
          { id: '62', text: 'whale', color: 'hsl(150, 70%, 55%)' },
          { id: '63', text: 'shark', color: 'hsl(150, 70%, 60%)' },
          { id: '64', text: 'octopus', color: 'hsl(150, 70%, 65%)' },
          { id: '65', text: 'squid', color: 'hsl(150, 70%, 70%)' },
          { id: '66', text: 'crab', color: 'hsl(150, 70%, 75%)' },
          { id: '67', text: 'lobster', color: 'hsl(150, 70%, 80%)' },
          { id: '68', text: 'shrimp', color: 'hsl(150, 70%, 85%)' },
          { id: '69', text: 'clam', color: 'hsl(150, 70%, 90%)' },
          { id: '70', text: 'oyster', color: 'hsl(150, 70%, 95%)' },
        ],
        list3: [
          { id: '71', text: 'runs', color: 'hsl(40, 70%, 50%)' },
          { id: '72', text: 'jumps', color: 'hsl(40, 70%, 55%)' },
          { id: '73', text: 'sleeps', color: 'hsl(40, 70%, 60%)' },
          { id: '74', text: 'eats', color: 'hsl(40, 70%, 65%)' },
          { id: '75', text: 'drinks', color: 'hsl(40, 70%, 70%)' },
          { id: '76', text: 'walks', color: 'hsl(40, 70%, 75%)' },
          { id: '77', text: 'swims', color: 'hsl(40, 70%, 80%)' },
          { id: '78', text: 'flies', color: 'hsl(40, 70%, 85%)' },
          { id: '79', text: 'crawls', color: 'hsl(40, 70%, 90%)' },
          { id: '80', text: 'climbs', color: 'hsl(40, 70%, 95%)' },
          { id: '81', text: 'plays', color: 'hsl(50, 70%, 50%)' },
          { id: '82', text: 'works', color: 'hsl(50, 70%, 55%)' },
          { id: '83', text: 'studies', color: 'hsl(50, 70%, 60%)' },
          { id: '84', text: 'reads', color: 'hsl(50, 70%, 65%)' },
          { id: '85', text: 'writes', color: 'hsl(50, 70%, 70%)' },
          { id: '86', text: 'speaks', color: 'hsl(50, 70%, 75%)' },
          { id: '87', text: 'listens', color: 'hsl(50, 70%, 80%)' },
          { id: '88', text: 'watches', color: 'hsl(50, 70%, 85%)' },
          { id: '89', text: 'sees', color: 'hsl(50, 70%, 90%)' },
          { id: '90', text: 'hears', color: 'hsl(50, 70%, 95%)' },
          { id: '91', text: 'smells', color: 'hsl(60, 70%, 50%)' },
          { id: '92', text: 'tastes', color: 'hsl(60, 70%, 55%)' },
          { id: '93', text: 'touches', color: 'hsl(60, 70%, 60%)' },
          { id: '94', text: 'feels', color: 'hsl(60, 70%, 65%)' },
          { id: '95', text: 'thinks', color: 'hsl(60, 70%, 70%)' },
          { id: '96', text: 'knows', color: 'hsl(60, 70%, 75%)' },
          { id: '97', text: 'understands', color: 'hsl(60, 70%, 80%)' },
          { id: '98', text: 'remembers', color: 'hsl(60, 70%, 85%)' },
          { id: '99', text: 'forgets', color: 'hsl(60, 70%, 90%)' },
          { id: '100', text: 'learns', color: 'hsl(60, 70%, 95%)' },
          { id: '101', text: 'teaches', color: 'hsl(70, 70%, 50%)' },
          { id: '102', text: 'helps', color: 'hsl(70, 70%, 55%)' },
          { id: '103', text: 'saves', color: 'hsl(70, 70%, 60%)' },
          { id: '104', text: 'protects', color: 'hsl(70, 70%, 65%)' },
          { id: '105', text: 'guards', color: 'hsl(70, 70%, 70%)' },
          { id: '106', text: 'follows', color: 'hsl(70, 70%, 75%)' },
          { id: '107', text: 'leads', color: 'hsl(70, 70%, 80%)' },
          { id: '108', text: 'chases', color: 'hsl(70, 70%, 85%)' },
          { id: '109', text: 'catches', color: 'hsl(70, 70%, 90%)' },
          { id: '110', text: 'hunts', color: 'hsl(70, 70%, 95%)' },
          { id: '111', text: 'fishes', color: 'hsl(80, 70%, 50%)' },
          { id: '112', text: 'gathers', color: 'hsl(80, 70%, 55%)' },
          { id: '113', text: 'collects', color: 'hsl(80, 70%, 60%)' },
          { id: '114', text: 'builds', color: 'hsl(80, 70%, 65%)' },
          { id: '115', text: 'creates', color: 'hsl(80, 70%, 70%)' },
          { id: '116', text: 'makes', color: 'hsl(80, 70%, 75%)' },
          { id: '117', text: 'fixes', color: 'hsl(80, 70%, 80%)' },
          { id: '118', text: 'repairs', color: 'hsl(80, 70%, 85%)' },
          { id: '119', text: 'cleans', color: 'hsl(80, 70%, 90%)' },
          { id: '120', text: 'washes', color: 'hsl(80, 70%, 95%)' },
        ]
      });
    } else if (mode === 'noreorder') {
      setNoReorderLists({
        sentence: [],
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
      setWordBankModeLists({
        sentence: [],
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

  return (
    <div className="App">
      <div className="header">
        <h1>Drag & Drop Demo</h1>
        <p>
          {mode === 'reorder' 
            ? 'Build sentences by dragging words between the lists below. Create sentences like "The cat runs quickly" or "My dog sleeps quietly".'
            : mode === 'noreorder'
            ? 'Drag words from the word bank to build your sentence. Words can only be moved from the word bank to the sentence area.'
            : 'Word Bank Mode: Drag words from the word bank to build your sentence. Words remember their original positions with permanent shadows.'
          }
        </p>
        
        <div className="mode-selector">
          <button 
            className={mode === 'wordbank' ? 'active' : ''} 
            onClick={() => setMode('wordbank')}
          >
            Word Bank Mode
          </button>
          <button 
            className={mode === 'reorder' ? 'active' : ''} 
            onClick={() => setMode('reorder')}
          >
            Reorder Mode
          </button>
          <button 
            className={mode === 'noreorder' ? 'active' : ''} 
            onClick={() => setMode('noreorder')}
          >
            No Reorder Mode
          </button>
          <button className="reset-button" onClick={resetLists}>
            Reset Lists
          </button>
        </div>
      </div>

      <CustomDragDrop 
        lists={currentLists}
        onDragEnd={handleDragEnd}
        mode={mode}
        permanentShadows={permanentShadows}
        setPermanentShadows={setPermanentShadows}
      />

      <div className="instructions">
        <h3>How to Use</h3>
        {mode === 'reorder' ? (
          <>
            <p>• Click and drag any colored item to move it</p>
            <p>• Drop items in the same list to reorder them</p>
            <p>• Drop items in different lists to move them between lists</p>
            <p>• Use the "Reset Lists" button to restore the original order</p>
          </>
        ) : mode === 'noreorder' ? (
          <>
            <p>• Drag words from the Word Bank to the Sentence area</p>
            <p>• Words can only be moved from the word bank to the sentence</p>
            <p>• The source list becomes dimmed when dragging</p>
            <p>• Blue drop zones indicate valid drop areas</p>
          </>
        ) : (
          <>
            <p>• Drag words from the Word Bank to build your sentence</p>
            <p>• Words remember their original positions with permanent shadows</p>
            <p>• You can drag words back to replace their shadows</p>
            <p>• The sentence area allows reordering of words</p>
          </>
        )}
        <p><strong>Note:</strong> This page now uses the CustomDragDrop component from the react-dnd library. When you update the library, this page automatically gets the updates!</p>
      </div>
    </div>
  );
}

export default App; 