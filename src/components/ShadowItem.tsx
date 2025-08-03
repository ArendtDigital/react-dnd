import React from 'react';
import { ShadowItemProps } from '../types/dragDrop';

const ShadowItem: React.FC<ShadowItemProps> = ({ text, isDraggingBackToShadow }) => {
  return (
    <div
      className="drag-drop-shadow"
      style={{
        backgroundColor: isDraggingBackToShadow ? '#e3f2fd' : 'hsl(0, 0%, 10%)',
        border: isDraggingBackToShadow ? '2px dashed #2196f3' : 'none',
        borderRadius: '6px',
        padding: '0.25rem 0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        color: isDraggingBackToShadow ? '#1976d2' : 'hsl(0, 0%, 10%)',
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

export default React.memo(ShadowItem); 