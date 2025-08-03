import React from 'react';
import { ShadowItemProps } from '../types/dragDrop';

const ShadowItem: React.FC<ShadowItemProps> = ({ text, isDraggingBackToShadow }) => {
  return (
    <div
      className={`drag-drop-shadow ${isDraggingBackToShadow ? 'wordbank-mode' : 'permanent-shadow'}`}
    >
      {text}
    </div>
  );
};

export default React.memo(ShadowItem); 