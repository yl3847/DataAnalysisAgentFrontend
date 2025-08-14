import React from 'react';

const ResizeHandle = ({ isDragging, onMouseDown }) => {
  return (
    <div
      className="resize-handle-container"
      onMouseDown={onMouseDown}
    >
      <div className={`resize-handle ${isDragging ? 'active' : ''}`}>
        <div className="resize-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default ResizeHandle;