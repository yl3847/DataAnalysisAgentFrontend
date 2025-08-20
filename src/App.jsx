import React, { useState, useCallback, useRef, useEffect } from 'react';
import './App.css';
import MainLayout from './components/Layout/MainLayout';
import DataPanel from './components/DataPanel/DataPanel';
import ChatPanel from './components/ChatPanel/ChatPanel';
import UserMenu from './components/UserMenu/UserMenu';
import HelpModal from './components/HelpModal/HelpModal';
import ResizeHandle from './components/ResizeHandle/ResizeHandle';
import Auth from './components/Auth/Auth';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAnalysis } from './hooks/useAnalysis';
import { usePanelResize } from './hooks/usePanelResize';
import { initGA, trackPageView, trackUserOrigin, trackEvent } from './utils/analytics';
import authService from './services/auth';

function App() {
  const [messages, setMessages] = useLocalStorage('chat-messages', []);
  const [analysisHistory, setAnalysisHistory] = useLocalStorage('analysis-history', []);
  const [activeView, setActiveView] = useState('data');
  const [selectedModel, setSelectedModel] = useState('claude-3-opus');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState('overview'); // 'overview', 'chat', or 'analysis'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  
  const analysisRefs = useRef({});
  const messageRefs = useRef({});
  const containerRef = useRef(null);
  
  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const isAuth = authService.isAuthenticated();
        setIsAuthenticated(isAuth);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAuthStatus();
  }, []);

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

  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleAuthRequest = () => {
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      setIsAuthenticated(false);
    }
  };

  // Show loading screen while checking authentication
  if (isLoadingAuth) {
    return (
      <div className="App min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // No overlay needed - authentication will be handled in the chat area

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
            <div className="flex bg-white rounded-lg shadow-sm mb-2 overflow-hidden">
              <button
                onClick={() => setMobileView('overview')}
                className={`flex-1 py-2 px-2 text-xs font-medium rounded-l-lg transition-all ${
                  mobileView === 'overview'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm'
                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-center space-x-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Overview</span>
                </div>
              </button>
              <button
                onClick={() => setMobileView('chat')}
                className={`flex-1 py-2 px-2 text-xs font-medium transition-all ${
                  mobileView === 'chat'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm'
                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-center space-x-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.934 8.934 0 01-4.284-1.09l-4.493 1.34a1 1 0 01-1.273-1.273l1.34-4.493A8.934 8.934 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                  </svg>
                  <span>Chat</span>
                </div>
              </button>
              <button
                onClick={() => setMobileView('analysis')}
                className={`flex-1 py-2 px-2 text-xs font-medium rounded-r-lg transition-all ${
                  mobileView === 'analysis'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm'
                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-center space-x-1 relative">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Analysis</span>
                  {analysisHistory.length > 0 && (
                    <span className="absolute -top-1 -right-1 px-1 py-0.5 text-xs bg-red-500 text-white rounded-full min-w-[16px] text-center">
                      {analysisHistory.length > 9 ? '9+' : analysisHistory.length}
                    </span>
                  )}
                </div>
              </button>
            </div>
            
            {/* Mobile Content */}
            <div className="h-full" style={{ height: 'calc(100vh - 140px)' }}>
              {mobileView === 'overview' && (
                <DataPanel
                  width={100}
                  activeView="data"
                  setActiveView={() => {}} // Disable tab switching in mobile overview
                  analysisHistory={analysisHistory}
                  analysisRefs={analysisRefs}
                  highlightedAnalysis={highlightedAnalysis}
                  onAnalysisClick={(analysisId) => {
                    // Switch to analysis tab when clicking on an analysis
                    setMobileView('analysis');
                    scrollToMessage(analysisId);
                  }}
                  onDeleteAnalysis={deleteAnalysis}
                  hideNavigation={true} // We'll add this prop to hide the internal navigation
                />
              )}
              
              {mobileView === 'chat' && (
                <ChatPanel
                  width={100}
                  messages={messages}
                  messageRefs={messageRefs}
                  highlightedMessage={highlightedMessage}
                  isLoading={isLoading}
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  onSendMessage={handleSendMessage}
                  onMessageClick={(messageId) => {
                    // Switch to analysis tab when clicking on a message
                    setMobileView('analysis');
                    scrollToAnalysis(messageId);
                  }}
                  onDeleteMessage={deleteMessage}
                  onClearAll={handleClearAll}
                  isAuthenticated={isAuthenticated}
                  onAuthRequest={handleAuthRequest}
                />
              )}
              
              {mobileView === 'analysis' && (
                <DataPanel
                  width={100}
                  activeView="analysis"
                  setActiveView={() => {}} // Disable tab switching in mobile analysis
                  analysisHistory={analysisHistory}
                  analysisRefs={analysisRefs}
                  highlightedAnalysis={highlightedAnalysis}
                  onAnalysisClick={(analysisId) => {
                    // Switch to chat tab when clicking on an analysis to see the related message
                    setMobileView('chat');
                    scrollToMessage(analysisId);
                  }}
                  onDeleteAnalysis={deleteAnalysis}
                  hideNavigation={true} // We'll add this prop to hide the internal navigation
                />
              )}
            </div>
          </div>
        </MainLayout>
        
        {showUserMenu && (
          <UserMenu 
            onClose={() => setShowUserMenu(false)} 
            onLogout={handleLogout}
            isAuthenticated={isAuthenticated}
            onAuthRequest={handleAuthRequest}
          />
        )}
        
        {showHelpModal && (
          <HelpModal onClose={() => setShowHelpModal(false)} />
        )}
        
        {showAuthModal && (
          <div className="help-modal-overlay" onClick={() => setShowAuthModal(false)}>
            <div className="help-modal" onClick={e => e.stopPropagation()}>
              <div className="help-modal-header">
                <h2 className="text-xl font-semibold">Welcome</h2>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="help-modal-content">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Data Analysis Assistant
                  </h3>
                  <p className="text-sm text-gray-500">
                    Sign in to start analyzing your data with AI
                  </p>
                </div>
                <Auth onAuthSuccess={handleAuthSuccess} isModal={true} />
              </div>
            </div>
          </div>
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
              isAuthenticated={isAuthenticated}
              onAuthRequest={handleAuthRequest}
            />
            
          </div>
        </div>
      </MainLayout>
      
      {showUserMenu && (
        <UserMenu 
          onClose={() => setShowUserMenu(false)} 
          onLogout={handleLogout}
          isAuthenticated={isAuthenticated}
          onAuthRequest={handleAuthRequest}
        />
      )}
      
      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}
      
      {showAuthModal && (
        <div className="help-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="help-modal" onClick={e => e.stopPropagation()}>
            <div className="help-modal-header">
              <h2 className="text-xl font-semibold">Welcome</h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="help-modal-content">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Data Analysis Assistant
                </h3>
                <p className="text-sm text-gray-500">
                  Sign in to start analyzing your data with AI
                </p>
              </div>
              <Auth onAuthSuccess={handleAuthSuccess} isModal={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;