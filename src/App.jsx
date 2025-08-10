import React, { useState, useCallback, useEffect, useRef } from 'react';
import './App.css';
import MainLayout from './components/Layout/MainLayout';
import ChatBox from './components/ChatBox/ChatBox';
import SampleDataDisplay from './components/DataTable/SampleDataDisplay';
import ResponseDisplay from './components/ResponseDisplay/ResponseDisplay';
import UserMenu from './components/UserMenu/UserMenu';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useApi } from './hooks/useApi';

function App() {
  const [messages, setMessages] = useLocalStorage('chat-messages', []);
  const [analysisHistory, setAnalysisHistory] = useLocalStorage('analysis-history', []);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState('data');
  const [hassentFirstMessage, setHasSentFirstMessage] = useState(false);
  const [highlightedAnalysis, setHighlightedAnalysis] = useState(null);
  const [selectedModel, setSelectedModel] = useState('claude-3-opus');
  const [leftPanelWidth, setLeftPanelWidth] = useState(66.666); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const analysisRefs = useRef({});
  const containerRef = useRef(null);
  const { sendQuery } = useApi();

  // Handle panel resize
  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !containerRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Limit between 40% and 80%
    if (newWidth >= 40 && newWidth <= 80) {
      setLeftPanelWidth(newWidth);
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Scroll to specific analysis when message is clicked
  const scrollToAnalysis = (messageId) => {
    const element = analysisRefs.current[messageId];
    if (element) {
      setActiveView('analysis'); // Switch to analysis view
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setHighlightedAnalysis(messageId);
        setTimeout(() => setHighlightedAnalysis(null), 2000);
      }, 100);
    }
  };

  // Delete specific message and its analysis
  const deleteMessage = useCallback((messageId) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    setAnalysisHistory(prev => prev.filter(a => a.messageId !== messageId));
  }, [setMessages, setAnalysisHistory]);

  // Convert graph URL to markdown format
  const convertGraphToMarkdown = (graphUrl) => {
    // This would parse the graph URL and convert to markdown
    // For now, returning sample markdown
    // In production, you'd fetch the graph data from the URL and convert it
    
    // Example: If graphUrl contains chart configuration
    // const chartData = await fetch(graphUrl).then(r => r.json());
    // return generateMarkdownFromChartData(chartData);
    
    return generateSampleMarkdown();
  };

  // Sample markdown generator
  const generateSampleMarkdown = () => {
    const randomData = {
      signals: (Math.random() * 30 + 40).toFixed(1),
      speedControl: (Math.random() * 30 + 45).toFixed(1),
      nightDrive: (Math.random() * 25 + 35).toFixed(1),
      roadSigns: (Math.random() * 35 + 40).toFixed(1),
      parking: (Math.random() * 25 + 30).toFixed(1),
    };

    return `
## Performance Analysis Results

### Driving Skills Assessment

\`\`\`chart
{
  "type": "bar",
  "data": [
    {"category": "Signals", "value": ${randomData.signals}},
    {"category": "Speed Control", "value": ${randomData.speedControl}},
    {"category": "Night Drive", "value": ${randomData.nightDrive}},
    {"category": "Road Signs", "value": ${randomData.roadSigns}},
    {"category": "Parking", "value": ${randomData.parking}}
  ]
}
\`\`\`

### Qualification Trends

\`\`\`chart
{
  "type": "line",
  "data": [
    {"month": "Jan", "rate": 45},
    {"month": "Feb", "rate": 48},
    {"month": "Mar", "rate": 52},
    {"month": "Apr", "rate": 51},
    {"month": "May", "rate": 55},
    {"month": "Jun", "rate": 58}
  ]
}
\`\`\`
`;
  };

  const generateSampleDescription = () => {
    const descriptions = [
      "Analysis reveals key performance indicators across multiple driving competencies, with notable variations in skill proficiency.",
      "The data shows significant correlation between training levels and qualification success rates.",
      "Performance metrics indicate areas of strength and opportunities for improvement in the current testing framework."
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const handleSendMessage = useCallback(async (message) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      model: selectedModel,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    if (!hassentFirstMessage) {
      setHasSentFirstMessage(true);
      setActiveView('analysis');
    }

    try {
      // Simulate backend delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // ============================================
      // BACKEND INTEGRATION POINT: Graph URL Processing
      // In production:
      // const response = await sendQuery(message, selectedModel);
      // const markdown = await convertGraphToMarkdown(response.graphUrl);
      // ============================================
      
      const mockMarkdown = generateSampleMarkdown();
      const mockDescription = generateSampleDescription();
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `Analysis completed using ${selectedModel}. Results are displayed in the Analysis panel.`,
        timestamp: new Date().toISOString(),
        analysisId: userMessage.id
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      const analysisResult = {
        id: userMessage.id,
        messageId: userMessage.id,
        query: message,
        markdown: mockMarkdown,
        description: mockDescription,
        model: selectedModel,
        timestamp: new Date().toISOString()
      };
      
      setAnalysisHistory(prev => [...prev, analysisResult]);
      
      setTimeout(() => {
        scrollToAnalysis(userMessage.id);
      }, 100);
      
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: 'Failed to process request. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedModel, hassentFirstMessage, setMessages, setAnalysisHistory]);

  const handleClearAll = useCallback(() => {
    setMessages([]);
    setAnalysisHistory([]);
    setHasSentFirstMessage(false);
    setActiveView('data');
  }, [setMessages, setAnalysisHistory]);

  return (
    <div className="App min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <MainLayout onUserMenuClick={() => setShowUserMenu(true)}>
        <div className="container mx-auto px-4 py-4 h-full">
          <div 
            ref={containerRef}
            className="flex gap-4 h-full" 
            style={{ height: 'calc(100vh - 100px)' }}
          >
            
            {/* Left Panel - Data/Analysis View */}
            <div 
              className="h-full overflow-hidden"
              style={{ width: `${leftPanelWidth}%` }}
            >
              <div className="bg-white rounded-2xl shadow-lg h-full flex flex-col">
                {/* Tab Navigation */}
                <div className="border-b px-6 py-3 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setActiveView('data')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          activeView === 'data'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        Sample Data Overview
                      </button>
                      <button
                        onClick={() => setActiveView('analysis')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          activeView === 'analysis'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        Analysis Results
                        {analysisHistory.length > 0 && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                            {analysisHistory.length}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 analysis-scroll-area">
                  {activeView === 'data' ? (
                    <SampleDataDisplay />
                  ) : (
                    <>
                      {analysisHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <p className="text-lg font-medium">No analysis results yet</p>
                          <p className="text-sm mt-2">Send a query to see analysis results here</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {analysisHistory.map((analysis, index) => (
                            <div 
                              key={analysis.id}
                              ref={el => analysisRefs.current[analysis.messageId] = el}
                              className={`border rounded-lg p-6 transition-all duration-500 ${
                                highlightedAnalysis === analysis.messageId 
                                  ? 'bg-blue-50 border-blue-400 shadow-lg' 
                                  : 'bg-gray-50'
                              }`}
                            >
                              <div className="mb-4 flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-800">
                                    Analysis #{index + 1}
                                  </h3>
                                  <p className="text-sm text-gray-600 italic mt-1">
                                    Query: "{analysis.query}"
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Model: {analysis.model} • {new Date(analysis.timestamp).toLocaleString()}
                                  </p>
                                </div>
                                <button
                                  onClick={() => deleteMessage(analysis.messageId)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                  title="Delete this analysis"
                                >
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                              
                              <ResponseDisplay 
                                response={{
                                  content: analysis.markdown,
                                  description: analysis.description
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Resize Handle */}
            <div
              className={`resize-handle ${isDragging ? 'active' : ''}`}
              onMouseDown={handleMouseDown}
            >
              <div className="resize-handle-bar" />
            </div>
            
            {/* Right Panel - Chat */}
            <div 
              className="h-full overflow-hidden flex-1"
              style={{ width: `${100 - leftPanelWidth}%` }}
            >
              <div className="bg-white rounded-2xl shadow-lg h-full flex flex-col">
                <div className="border-b px-4 py-3 flex justify-between items-center flex-shrink-0">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Analytics Chat
                  </h2>
                  <button
                    onClick={handleClearAll}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <ChatBox
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  onMessageClick={scrollToAnalysis}
                  onDeleteMessage={deleteMessage}
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                />
              </div>
            </div>
            
          </div>
        </div>
      </MainLayout>
      
      {/* User Menu Modal */}
      {showUserMenu && (
        <UserMenu onClose={() => setShowUserMenu(false)} />
      )}
    </div>
  );
}

export default App;