import React, { useState, useCallback, useRef, useEffect } from 'react';
import './App.css';
import MainLayout from './components/Layout/MainLayout';
import DataPanel from './components/DataPanel/DataPanel';
import ChatPanel from './components/ChatPanel/ChatPanel';
import UserMenu from './components/UserMenu/UserMenu';
import ResizeHandle from './components/ResizeHandle/ResizeHandle';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAnalysis } from './hooks/useAnalysis';
import { usePanelResize } from './hooks/usePanelResize';
import { initGA, trackPageView, trackUserOrigin, trackEvent } from './utils/analytics';

function App() {
  const [messages, setMessages] = useLocalStorage('chat-messages', []);
  const [analysisHistory, setAnalysisHistory] = useLocalStorage('analysis-history', []);
  const [activeView, setActiveView] = useState('data');
  const [selectedModel, setSelectedModel] = useState('claude-3-opus');
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const analysisRefs = useRef({});
  const messageRefs = useRef({});
  const containerRef = useRef(null);
  
  // Initialize Google Analytics on app load
  useEffect(() => {
    // Initialize GA
    initGA();
    
    // Track the initial page view and user origin
    trackPageView(window.location.pathname);
    trackUserOrigin();
    
    // Track return visitors
    const isReturningVisitor = localStorage.getItem('returning_visitor');
    if (!isReturningVisitor) {
      localStorage.setItem('returning_visitor', 'true');
      trackEvent('User Type', 'New Visitor');
    } else {
      trackEvent('User Type', 'Returning Visitor');
    }
  }, []);
  
  // Track view changes
  useEffect(() => {
    if (activeView) {
      trackEvent('Navigation', 'View Change', activeView);
    }
  }, [activeView]);
  
  // Use custom hooks
  const { 
    leftPanelWidth, 
    isDragging, 
    handleMouseDown 
  } = usePanelResize(containerRef);
  
  const {
    isLoading,
    highlightedAnalysis,
    highlightedMessage,
    handleSendMessage,
    scrollToAnalysis,
    scrollToMessage,
    deleteMessage,
    deleteAnalysis,
    handleClearAll,
    getNextAnalysisNumber
  } = useAnalysis({
    messages,
    setMessages,
    analysisHistory,
    setAnalysisHistory,
    analysisRefs,
    messageRefs,
    activeView,
    setActiveView,
    selectedModel
  });

  return (
    <div className="App min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <MainLayout onUserMenuClick={() => setShowUserMenu(true)}>
        <div className="container mx-auto px-4 py-4 h-full">
          <div 
            ref={containerRef}
            className="flex gap-2 h-full" 
            style={{ height: 'calc(100vh - 140px)' }}
          >
            
            {/* Left Panel - Data/Analysis View */}
            <DataPanel
              width={leftPanelWidth}
              activeView={activeView}
              setActiveView={setActiveView}
              analysisHistory={analysisHistory}
              analysisRefs={analysisRefs}
              highlightedAnalysis={highlightedAnalysis}
              onAnalysisClick={scrollToMessage}
              onDeleteAnalysis={deleteAnalysis}
            />

            {/* Resize Handle */}
            <ResizeHandle 
              isDragging={isDragging}
              onMouseDown={handleMouseDown}
            />
            
            {/* Right Panel - Chat */}
            <ChatPanel
              width={100 - leftPanelWidth}
              messages={messages}
              messageRefs={messageRefs}
              highlightedMessage={highlightedMessage}
              isLoading={isLoading}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              onSendMessage={handleSendMessage}
              onMessageClick={scrollToAnalysis}
              onDeleteMessage={deleteMessage}
              onClearAll={handleClearAll}
            />
            
          </div>
        </div>
      </MainLayout>
      
      {showUserMenu && (
        <UserMenu onClose={() => setShowUserMenu(false)} />
      )}
    </div>
  );
}

export default App;