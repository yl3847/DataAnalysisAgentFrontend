import React, { useRef, useEffect } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import './ChatBox.css';

const ChatBox = ({ messages, onSendMessage, isLoading, onMessageClick }) => {
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-box flex flex-col h-full">
      {/* Messages Area with proper scrolling */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 chat-messages-area p-4 space-y-3"
        style={{ 
          overflowY: 'auto',
          height: 'calc(100% - 80px)'
        }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg
              className="w-12 h-12 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z"
              />
            </svg>
            <p className="text-sm font-medium">Start a conversation</p>
            <p className="text-xs mt-1 text-center px-4">
              Ask about the data or request analysis
            </p>
            
            {/* Sample Queries */}
            <div className="mt-4 space-y-1 w-full">
              <p className="text-xs text-gray-500 uppercase tracking-wide text-center mb-2">
                Try asking:
              </p>
              {[
                "Show qualification rates",
                "Analyze performance",
                "Compare age groups",
                "What's the pass rate?"
              ].map((query, index) => (
                <button
                  key={index}
                  onClick={() => onSendMessage(query)}
                  className="w-full text-left px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                >
                  "{query}"
                </button>
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
              />
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs">Analyzing...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-gray-50 flex-shrink-0" style={{ height: '80px' }}>
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