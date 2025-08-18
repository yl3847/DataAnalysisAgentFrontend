import React, { useState, useCallback, useRef, useEffect } from 'react';
import './App.css';
import MainLayout from './components/Layout/MainLayout';
import DataPanel from './components/DataPanel/DataPanel';
import ChatPanel from './components/ChatPanel/ChatPanel';
import UserMenu from './components/UserMenu/UserMenu';
import HelpModal from './components/HelpModal/HelpModal';
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
  const [showHelpModal, setShowHelpModal] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState('chat'); // 'chat' or 'data'
  
  const analysisRefs = useRef({});
  const messageRefs = useRef({});
  const containerRef = useRef(null);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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

  // Mobile layout
  if (isMobile) {
    return (
      <div className="App min-h-screen bg-white overflow-hidden">
        <MainLayout 
          onUserMenuClick={() => setShowUserMenu(true)}
          onHelpClick={() => setShowHelpModal(true)}
        >
          <div className="px-2 py-2 h-full">
            {/* Mobile Navigation Tabs */}
            <div className="flex bg-white rounded-lg shadow-sm mb-2">
              <button
                onClick={() => setMobileView('chat')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-l-lg transition-all ${
                  mobileView === 'chat'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 bg-gray-100'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setMobileView('data')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-r-lg transition-all ${
                  mobileView === 'data'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 bg-gray-100'
                }`}
              >
                Data
              </button>
            </div>
            
            {/* Mobile Content */}
            <div className="h-full" style={{ height: 'calc(100vh - 140px)' }}>
              {mobileView === 'chat' ? (
                <ChatPanel
                  width={100}
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
              ) : (
                <DataPanel
                  width={100}
                  activeView={activeView}
                  setActiveView={setActiveView}
                  analysisHistory={analysisHistory}
                  analysisRefs={analysisRefs}
                  highlightedAnalysis={highlightedAnalysis}
                  onAnalysisClick={scrollToMessage}
                  onDeleteAnalysis={deleteAnalysis}
                />
              )}
            </div>
          </div>
        </MainLayout>
        
        {showUserMenu && (
          <UserMenu onClose={() => setShowUserMenu(false)} />
        )}
        
        {showHelpModal && (
          <HelpModal onClose={() => setShowHelpModal(false)} />
        )}
      </div>
    );
  }

  // Desktop layout (original)
  return (
    <div className="App min-h-screen bg-white overflow-hidden">
      <MainLayout 
        onUserMenuClick={() => setShowUserMenu(true)}
        onHelpClick={() => setShowHelpModal(true)}
      >
        <div className="px-[2%] py-2 h-full">
          <div 
            ref={containerRef}
            className="flex gap-2 h-full" 
            style={{ height: 'calc(100vh - 90px)' }}
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
      
      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}
    </div>
  );
}

export default App;