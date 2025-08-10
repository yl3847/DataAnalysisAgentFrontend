import { useState, useCallback, useRef, useEffect } from 'react';

export const useChat = (initialMessages = []) => {
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = useCallback((message) => {
    const newMessage = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...message
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const updateMessage = useCallback((id, updates) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, ...updates } : msg
      )
    );
  }, []);

  const deleteMessage = useCallback((id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const getMessageById = useCallback((id) => {
    return messages.find(msg => msg.id === id);
  }, [messages]);

  const getLastMessage = useCallback(() => {
    return messages[messages.length - 1] || null;
  }, [messages]);

  const setTypingIndicator = useCallback((typing) => {
    setIsTyping(typing);
  }, []);

  return {
    messages,
    isTyping,
    messagesEndRef,
    addMessage,
    updateMessage,
    deleteMessage,
    clearMessages,
    getMessageById,
    getLastMessage,
    setTypingIndicator,
    scrollToBottom
  };
};