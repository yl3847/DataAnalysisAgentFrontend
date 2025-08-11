import React, { useState } from 'react';

const ChatMessage = ({ message, onClick, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  
  const isUser = message.type === 'user';
  const isError = message.type === 'error';
  const isAssistant = message.type === 'assistant';
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div 
      className={`chat-message-wrapper ${isUser ? 'flex-row-reverse' : ''} flex items-start space-x-2 group`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 ${isUser ? 'ml-2' : 'mr-2'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 
          isError ? 'bg-red-500' : 
          'bg-gradient-to-br from-gray-500 to-gray-600'
        }`}>
          {isUser ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          ) : isError ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${isUser ? 'flex justify-end' : ''}`}>
        <div className={`max-w-xs ${isUser ? 'ml-auto' : ''} relative`}>
          {/* Analysis Number Badge */}
          {message.analysisNumber && (
            <div className={`absolute -top-2 ${isUser ? 'right-0' : 'left-0'} px-2 py-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full font-medium shadow-sm`}>
              Analysis #{message.analysisNumber}
            </div>
          )}
          
          <div 
            className={`rounded-lg px-3 py-2 mt-2 ${
              isUser 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 shadow-sm' 
                : isError 
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-gray-100 text-gray-800'
            } transition-all`}
            onClick={isUser ? onClick : undefined}
          >
            {/* Message Header */}
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-medium ${
                isUser ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {isUser ? 'You' : isError ? 'Error' : 'Assistant'}
              </span>
              <span className={`text-xs ${
                isUser ? 'text-blue-100' : 'text-gray-400'
              }`}>
                {formatTime(message.timestamp)}
              </span>
            </div>

            {/* Message Text */}
            <div className="text-sm whitespace-pre-wrap">
              {message.content}
            </div>

            {/* Click hint for user messages */}
            {isUser && (
              <div className="text-xs mt-2 opacity-80 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Click to view analysis
              </div>
            )}
          </div>

          {/* Delete button */}
          {showDelete && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className={`absolute ${isUser ? '-left-8' : '-right-8'} top-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-sm`}
              title="Delete message"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Copy button for assistant messages */}
          {isAssistant && (
            <div className="flex items-center space-x-2 mt-1">
              <button
                onClick={copyToClipboard}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1 transition-colors"
              >
                {copied ? (
                  <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;