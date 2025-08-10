import React, { useState } from 'react';

const ModelSelector = ({ selectedModel, onModelChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const models = [
    { id: 'claude-3-opus', name: 'Claude 3 Opus', badge: 'Most Capable' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', badge: 'Balanced' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', badge: 'Latest' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', badge: 'Fast' },
  ];

  const currentModel = models.find(m => m.id === selectedModel) || models[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
      >
        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
        <span className="font-medium">{currentModel.name}</span>
        {currentModel.badge && (
          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
            {currentModel.badge}
          </span>
        )}
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {models.map(model => (
            <button
              key={model.id}
              onClick={() => {
                onModelChange(model.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors ${
                model.id === selectedModel ? 'bg-blue-50' : ''
              }`}
            >
              <span className="text-sm font-medium">{model.name}</span>
              {model.badge && (
                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                  {model.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;