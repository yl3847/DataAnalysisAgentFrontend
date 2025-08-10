import React, { useRef, useEffect } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import ModelSelector from './ModelSelector';
import './ChatBox.css';

const ChatBox = ({ 
  messages, 
  onSendMessage, 
  isLoading, 
  onMessageClick, 
  onDeleteMessage,
  selectedModel,
  onModelChange 
}) => {
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const samplePrompts = [
    {
      category: "Analysis",
      icon: "📊",
      prompts: [
        "Analyze the correlation between training level and pass rates",
        "Show me performance trends over the last 6 months",
        "Compare qualification rates across different age groups"
      ]
    },
    {
      category: "Insights",
      icon: "💡",
      prompts: [
        "What factors most influence test success?",
        "Identify the top performance indicators",
        "Find patterns in failed applications"
      ]
    },
    {
      category: "Predictions",
      icon: "🔮",
      prompts: [
        "Predict pass rates for next quarter",
        "Forecast training effectiveness",
        "Estimate improvement with advanced training"
      ]
    }
  ];

  return (
    <div className="chat-box flex flex-col h-full">
      {/* Model Selector */}
      <div className="px-4 py-2 border-b bg-gray-50">
        <ModelSelector 
          selectedModel={selectedModel}
          onModelChange={onModelChange}
        />
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 chat-messages-area p-4 space-y-3"
        style={{ 
          overflowY: 'auto',
          height: 'calc(100% - 140px)'
        }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Start Your Analysis
              </h3>
              <p className="text-sm text-gray-500">
                Choose a prompt below or type your own query
              </p>
            </div>

            {/* Sample Prompts */}
            <div className="space-y-4">
              {samplePrompts.map((category, idx) => (
                <div key={idx} className="px-2">
                  <div className="flex items-center mb-2">
                    <span className="text-lg mr-2">{category.icon}</span>
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {category.category}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {category.prompts.map((prompt, pidx) => (
                      <button
                        key={pidx}
                        onClick={() => onSendMessage(prompt)}
                        className="w-full text-left px-3 py-2 text-xs bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all duration-200 text-gray-700 hover:text-gray-900 hover:shadow-sm"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message}
                onClick={() => {
                  if (message.type === 'user' && onMessageClick) {
                    onMessageClick(message.id);
                  }
                }}
                onDelete={() => onDeleteMessage(message.id)}
              />
            ))}
            
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs">Analyzing with {selectedModel}...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-gray-50 flex-shrink-0" style={{ height: '60px' }}>
        <ChatInput 
          onSendMessage={onSendMessage} 
          disabled={isLoading}
          compact={true}
        />
      </div>
    </div>
  );
};

export default ChatBox;