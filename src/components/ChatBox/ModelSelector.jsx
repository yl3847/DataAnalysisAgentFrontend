import React, { useState } from 'react';

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

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 w-full px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg hover:from-gray-100 hover:to-gray-150 transition-all text-sm group"
        style={{ height: '55px' }} // Fixed height smaller than tabs
      >
        <div className="flex items-center flex-1 min-w-0">
          <span className="text-base mr-2 flex-shrink-0">{currentModel.icon}</span>
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <span className="font-medium text-gray-800 truncate text-left">{currentModel.name}</span>
            <span className="text-xs text-gray-500 truncate text-left">{currentModel.description}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full font-medium whitespace-nowrap">
            {currentModel.badge}
          </span>
          <svg className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="p-2">
              {models.map(model => (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-all ${
                    model.id === selectedModel ? 'bg-gradient-to-r from-blue-50 to-blue-100' : ''
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{model.icon}</span>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium text-gray-800">{model.name}</div>
                    <div className="text-xs text-gray-500">{model.description}</div>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium flex-shrink-0 ${
                    model.id === selectedModel
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
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