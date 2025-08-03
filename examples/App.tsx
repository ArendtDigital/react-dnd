import React from 'react';
import SentenceBuilderDemo from './demos/SentenceBuilderDemo';
import BasicSortableDemo from './demos/BasicSortableDemo';

const App: React.FC = () => {
  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '32px', color: '#333' }}>
        React DND Examples
      </h1>
      
      <div className="example-section">
        <h2 className="example-title">Sentence Builder Demo</h2>
        <p className="example-description">
          A Duolingo-style sentence building game. Drag words from the word bank to build sentences.
          Words can be reordered within the sentence area and dragged back to the word bank.
        </p>
        <SentenceBuilderDemo />
      </div>

      <div className="example-section">
        <h2 className="example-title">Basic Sortable List</h2>
        <p className="example-description">
          A simple sortable list demonstrating basic drag and drop reordering functionality.
        </p>
        <BasicSortableDemo />
      </div>
    </div>
  );
};

export default App; 