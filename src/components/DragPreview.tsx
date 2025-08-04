import React from 'react';
import { DragPreviewProps } from '../types/dragDrop';

const DragPreview: React.FC<DragPreviewProps> = ({ preview }) => {
  // Check if this is a word bank item being dragged
  const isWordBankItem = preview.sourceList === 'wordBank';
  
  return (
    <div
      className="drag-drop-preview"
             style={{
         position: 'fixed',
         left: preview.x - 30, // Center horizontally (assuming ~60px width)
         top: preview.y - 20, // Center vertically (assuming ~40px height)
         backgroundColor: preview.color, // Always use original color
         color: 'white',
         padding: '0.25rem 0.75rem',
         borderRadius: '6px',
         fontSize: '14px',
         fontWeight: '600',
         pointerEvents: 'none',
         zIndex: 1000,
         boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
         transform: 'rotate(5deg)',
         // Ensure same size as original items
         minWidth: 'fit-content',
         height: '40px',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         // Prevent text selection during drag
         userSelect: 'none',
         WebkitUserSelect: 'none',
         MozUserSelect: 'none',
         msUserSelect: 'none',
       }}
    >
      {preview.text}
    </div>
  );
};

export default React.memo(DragPreview); 