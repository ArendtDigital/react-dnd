import React, { useState } from 'react';
import { BasicSortableList } from './basic-sortable-list';
import { WordBankExample } from './word-bank-example';
import { KanbanBoardExample } from './kanban-board-example';
import { UseDragDropHookExample } from './useDragDrop-hook-example';
import { examples } from './index';

type ExampleKey = keyof typeof examples;

const DemoApp: React.FC = () => {
  const [currentExample, setCurrentExample] = useState<ExampleKey>('basicSortableList');

  const getExampleComponent = (key: ExampleKey) => {
    switch (key) {
      case 'basicSortableList':
        return <BasicSortableList />;
      case 'wordBank':
        return <WordBankExample />;
      case 'kanbanBoard':
        return <KanbanBoardExample />;
      case 'useDragDropHook':
        return <UseDragDropHookExample />;
      default:
        return <BasicSortableList />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4caf50';
      case 'intermediate': return '#ff9800';
      case 'advanced': return '#f44336';
      default: return '#666';
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#2196f3',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px' }}>
          React-DND Examples
        </h1>
        <p style={{ margin: '0', opacity: 0.9, fontSize: '16px' }}>
          Interactive examples demonstrating drag and drop functionality
        </p>
      </header>

      {/* Navigation */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        padding: '16px 20px',
        overflowX: 'auto'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {Object.entries(examples).map(([key, example]) => (
            <button
              key={key}
              onClick={() => setCurrentExample(key as ExampleKey)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '20px',
                backgroundColor: currentExample === key ? '#2196f3' : '#f5f5f5',
                color: currentExample === key ? 'white' : '#333',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{example.title}</span>
              <span style={{
                padding: '2px 6px',
                backgroundColor: getDifficultyColor(example.difficulty),
                color: 'white',
                borderRadius: '10px',
                fontSize: '10px',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {example.difficulty}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Example Info */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        padding: '16px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ margin: '0 0 8px 0', color: '#333' }}>
            {examples[currentExample].title}
          </h2>
          <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '16px' }}>
            {examples[currentExample].description}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {examples[currentExample].features.map(feature => (
              <span key={feature} style={{
                padding: '4px 8px',
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Example Content */}
      <main style={{ padding: '0', maxWidth: '1200px', margin: '0 auto' }}>
        {getExampleComponent(currentExample)}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#333',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <p style={{ margin: '0', opacity: 0.8 }}>
          React-DND Library Examples • Built with TypeScript and React
        </p>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: 0.6 }}>
          <a 
            href="https://github.com/ArendtDigital/react-dnd" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#64b5f6', textDecoration: 'none' }}
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
};

export default DemoApp; 