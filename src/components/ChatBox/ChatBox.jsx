import React, { useRef, useEffect } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import ModelSelector from './ModelSelector';
import './ChatBox.css';

const ChatBox = ({ 
  messages, 
  messageRefs,
  highlightedMessage,
  onSendMessage, 
  isLoading, 
  onMessageClick, 
  onDeleteMessage,
  selectedModel,
  onModelChange,
  onClearAll
}) => {
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const samplePrompts = [
    {
      category: "Data Analysis",
      icon: "📊",
      prompts: [
        "Count the rows in the driver license table",
        "Show the distribution of qualified vs not qualified applicants",
        "Calculate the average theory test score"
      ]
    },
    {
      category: "Insights",
      icon: "💡",
      prompts: [
        "What is the pass rate for applicants with advanced training?",
        "Compare performance across different age groups",
        "Show correlation between training level and qualification"
      ]
    },
    {
      category: "Visualizations",
      icon: "📈",
      prompts: [
        "Create a bar chart of pass rates by training type",
        "Plot the distribution of theory test scores",
        "Show age group breakdown of applicants"
      ]
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg h-full flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="border-b px-6 py-3 flex justify-between items-center flex-shrink-0" style={{ height: '60px' }}>
        <h2 className="text-lg font-semibold text-gray-800">
          Analytics Chat
        </h2>
        <button
          onClick={onClearAll}
          className="text-sm px-3 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Model Selector - Matching narrower data tabs with padding */}
      <div className="border-b bg-gray-50 flex-shrink-0 px-4 flex items-center" style={{ height: '56px' }}>
        <ModelSelector 
          selectedModel={selectedModel}
          onModelChange={onModelChange}
        />
      </div>

      {/* Messages Area - Properly calculated to prevent overlapping */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 chat-messages-area"
        style={{ 
          maxHeight: 'calc(100% - 172px)', // 60px header + 56px model selector + 56px input
          minHeight: 0 
        }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col justify-center h-full py-8">
            <div className="max-w-full">
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
              <div className="space-y-4 max-w-full px-2">
                {samplePrompts.map((category, idx) => (
                  <div key={idx}>
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
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div 
                key={message.id}
                ref={el => {
                  if (messageRefs) {
                    messageRefs.current[message.id] = el;
                  }
                }}
                className={highlightedMessage === message.id ? 'highlight-message' : ''}
              >
                <ChatMessage 
                  message={message}
                  onClick={() => {
                    if (onMessageClick) {
                      onMessageClick(message.id);
                    }
                  }}
                  onDelete={() => onDeleteMessage(message.id)}
                />
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs">Processing your request...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="border-t bg-gray-50 flex-shrink-0" style={{ height: '56px' }}>
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