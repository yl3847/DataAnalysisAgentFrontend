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
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 w-full px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl hover:from-gray-100 hover:to-gray-150 transition-all text-sm group"
      >
        <div className="flex items-center flex-1">
          <span className="text-lg mr-2">{currentModel.icon}</span>
          <div className="flex flex-col items-start">
            <span className="font-medium text-gray-800">{currentModel.name}</span>
            <span className="text-xs text-gray-500">{currentModel.description}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full font-medium">
            {currentModel.badge}
          </span>
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
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
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-all ${
                    model.id === selectedModel ? 'bg-gradient-to-r from-blue-50 to-blue-100' : ''
                  }`}
                >
                  <span className="text-lg">{model.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-800">{model.name}</div>
                    <div className="text-xs text-gray-500">{model.description}</div>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
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