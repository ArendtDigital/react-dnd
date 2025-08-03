import React from 'react';
import { PlaceholderProps } from '../types/dragDrop';

const Placeholder: React.FC<PlaceholderProps> = ({ text, isShadowMode }) => {
  return (
    <div
      className="drag-drop-placeholder"
      style={{
        backgroundColor: isShadowMode ? '#e3f2fd' : '#d0d0d0',
        border: isShadowMode ? '2px dashed #2196f3' : '2px dashed #888',
        borderRadius: '6px',
        margin: '0 0.25rem',
        padding: '0.25rem 0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        color: isShadowMode ? '#1976d2' : '#666',
        pointerEvents: 'none',
        minWidth: 'fit-content',
        height: '40px',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

export default React.memo(Placeholder); 