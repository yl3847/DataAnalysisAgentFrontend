import React, { useState } from 'react';
import './ModelSelector.css';

const ModelSelector = ({ selectedModel, onModelChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const models = [
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      badge: 'Most Capable',
      description: 'Best for complex analysis',
      icon: '🚀'
    },
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      badge: 'Balanced',
      description: 'Good balance of speed and quality',
      icon: '⚡'
    },
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      badge: 'Latest',
      description: 'OpenAI\'s newest model',
      icon: '✨'
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      badge: 'Fast',
      description: 'Quick responses',
      icon: '💨'
    },
  ];

  const currentModel = models.find(m => m.id === selectedModel) || models[0];
  
  // Get short name for display
  const getShortName = (name) => {
    if (name.includes('Claude')) return 'Claude';
    if (name.includes('GPT')) return 'GPT';
    return name;
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:border-blue-400 hover:bg-gray-50 transition-all text-sm group focus:outline-none focus:ring-2 focus:ring-blue-200 w-full"
        style={{ height: '40px' }} // Match input height
      >
        <span className="text-sm flex-shrink-0">{currentModel.icon}</span>
        <span className="font-medium text-gray-700 truncate flex-1">{getShortName(currentModel.name)}</span>
        <svg className={`w-3 h-3 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
             fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden min-w-64 model-dropdown">
            <div className="py-1">
              {models.map(model => (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 transition-all duration-150 ${
                    model.id === selectedModel ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                  }`}
                >
                  <span className="text-sm flex-shrink-0">{model.icon}</span>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium text-gray-800 text-sm">{model.name}</div>
                    <div className="text-xs text-gray-500">{model.description}</div>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium flex-shrink-0 ${
                    model.id === selectedModel
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {model.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ModelSelector;