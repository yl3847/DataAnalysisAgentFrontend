import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import './ResponseDisplay.css';

const ResponseDisplay = ({ response }) => {
  if (!response) {
    return null;
  }

  const { content, description } = response;

  return (
    <div className="response-display">
      {/* Markdown Content with Charts */}
      {content && (
        <div className="markdown-wrapper mb-6">
          <MarkdownRenderer content={content} />
        </div>
      )}
      
      {/* Description */}
      {description && (
        <div className="description-wrapper p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Analysis Summary</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      )}
    </div>
  );
};

export default ResponseDisplay;