import React from 'react';
import ChatBox from '../ChatBox/ChatBox';

const ChatPanel = ({
  width,
  messages,
  messageRefs,
  highlightedMessage,
  isLoading,
  selectedModel,
  onModelChange,
  onSendMessage,
  onMessageClick,
  onDeleteMessage,
  onClearAll
}) => {
  return (
    <div 
      className="h-full overflow-hidden flex-1"
      style={{ width: `${width}%` }}
    >
      <ChatBox
        messages={messages}
        messageRefs={messageRefs}
        highlightedMessage={highlightedMessage}
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        onMessageClick={onMessageClick}
        onDeleteMessage={onDeleteMessage}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
        onClearAll={onClearAll}
      />
    </div>
  );
};

export default ChatPanel;