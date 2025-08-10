import React, { useState, useCallback, useEffect, useRef } from 'react';
import './App.css';
import MainLayout from './components/Layout/MainLayout';
import ChatBox from './components/ChatBox/ChatBox';
import SampleDataDisplay from './components/DataTable/SampleDataDisplay';
import ResponseDisplay from './components/ResponseDisplay/ResponseDisplay';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useApi } from './hooks/useApi';

function App() {
  const [messages, setMessages] = useLocalStorage('chat-messages', []);
  const [analysisHistory, setAnalysisHistory] = useLocalStorage('analysis-history', []);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState('data');
  const [hassentFirstMessage, setHasSentFirstMessage] = useState(false);
  const [highlightedAnalysis, setHighlightedAnalysis] = useState(null);
  const analysisRefs = useRef({});
  const { sendQuery } = useApi();

  // Scroll to specific analysis when message is clicked
  const scrollToAnalysis = (messageId) => {
    const element = analysisRefs.current[messageId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setHighlightedAnalysis(messageId);
      setTimeout(() => setHighlightedAnalysis(null), 2000);
    }
  };

  // Sample markdown generator with actual chart syntax
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

The analysis shows the performance distribution across key driving competencies:

\`\`\`chart
{
  "type": "bar",
  "data": [
    {"category": "Signals", "value": ${randomData.signals}, "unit": "%"},
    {"category": "Speed Control", "value": ${randomData.speedControl}, "unit": "%"},
    {"category": "Night Drive", "value": ${randomData.nightDrive}, "unit": "%"},
    {"category": "Road Signs", "value": ${randomData.roadSigns}, "unit": "%"},
    {"category": "Parking", "value": ${randomData.parking}, "unit": "%"}
  ],
  "config": {
    "xField": "value",
    "yField": "category",
    "color": "#3b82f6"
  }
}
\`\`\`

### Qualification Distribution by Age Group

\`\`\`chart
{
  "type": "pie",
  "data": [
    {"type": "Teenager (Qualified)", "value": ${Math.floor(Math.random() * 5 + 10)}},
    {"type": "Teenager (Not Qualified)", "value": ${Math.floor(Math.random() * 5 + 5)}},
    {"type": "Young Adult (Qualified)", "value": ${Math.floor(Math.random() * 15 + 30)}},
    {"type": "Young Adult (Not Qualified)", "value": ${Math.floor(Math.random() * 10 + 15)}},
    {"type": "Middle Age (Qualified)", "value": ${Math.floor(Math.random() * 10 + 25)}},
    {"type": "Middle Age (Not Qualified)", "value": ${Math.floor(Math.random() * 5 + 10)}}
  ]
}
\`\`\`

### Training Impact Analysis

| Training Level | Pass Rate | Avg Score | Sample Size |
|---------------|-----------|-----------|-------------|
| None          | 28.6%     | 42.3      | 7           |
| Basic         | 72.7%     | 58.9      | 11          |
| Advanced      | 92.3%     | 74.2      | 13          |
`;
  };

  const generateSampleDescription = () => {
    const descriptions = [
      "Based on the analysis of driving test performance metrics, the data reveals significant variations in skill proficiency across different categories. Speed control and road sign recognition show the strongest performance indicators, while parking and night driving present areas requiring additional focus.",
      "The comprehensive assessment indicates a clear relationship between formal training participation and test success rates. Applicants with advanced training demonstrate a 92.3% pass rate, compared to only 28.6% for those without formal preparation.",
      "Analysis of the current dataset highlights critical performance gaps in specific driving competencies. Signal usage and steering control show the highest variance among applicants, suggesting these areas require targeted intervention."
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const handleSendMessage = useCallback(async (message) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // After first message, switch to analysis view
    if (!hassentFirstMessage) {
      setHasSentFirstMessage(true);
      setActiveView('analysis');
    }

    try {
      // Simulate backend delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockMarkdown = generateSampleMarkdown();
      const mockDescription = generateSampleDescription();
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `I've analyzed the data based on your query: "${message}". The results have been generated and displayed in the Analysis Results panel.`,
        timestamp: new Date().toISOString(),
        analysisId: userMessage.id // Link to analysis
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      const analysisResult = {
        id: userMessage.id, // Use same ID for linking
        messageId: userMessage.id,
        query: message,
        markdown: mockMarkdown,
        description: mockDescription,
        timestamp: new Date().toISOString()
      };
      
      setAnalysisHistory(prev => [...prev, analysisResult]);
      
      // Auto-scroll to new analysis after adding
      setTimeout(() => {
        scrollToAnalysis(userMessage.id);
      }, 100);
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: 'Failed to get response. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [hassentFirstMessage, setMessages, setAnalysisHistory]);

  const handleClearChat = useCallback(() => {
    setMessages([]);
    setAnalysisHistory([]);
    setHasSentFirstMessage(false);
    setActiveView('data');
  }, [setMessages, setAnalysisHistory]);

  const handleClearAnalysis = useCallback(() => {
    setAnalysisHistory([]);
  }, [setAnalysisHistory]);

  return (
    <div className="App min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <MainLayout>
        <div className="container mx-auto px-4 py-4 h-full">
          <div className="grid grid-cols-3 gap-4 h-full" style={{ height: 'calc(100vh - 100px)' }}>
            
            {/* Left Side - 2/3 of page - Data/Analysis View */}
            <div className="col-span-2 h-full overflow-hidden">
              <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
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
                    {activeView === 'analysis' && analysisHistory.length > 0 && (
                      <button
                        onClick={handleClearAnalysis}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Clear History
                      </button>
                    )}
                  </div>
                </div>

                {/* Content Area with Scroll */}
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
                              data-message-id={analysis.messageId}
                            >
                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-lg font-semibold text-gray-800">
                                    Analysis #{index + 1}
                                  </h3>
                                  <span className="text-xs text-gray-500">
                                    {new Date(analysis.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 italic">
                                  Query: "{analysis.query}"
                                </p>
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
            
            {/* Right Side - 1/3 of page - Chat */}
            <div className="col-span-1 h-full overflow-hidden">
              <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
                <div className="border-b px-4 py-3 flex justify-between items-center flex-shrink-0">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Analytics Chat
                  </h2>
                  <button
                    onClick={handleClearChat}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <ChatBox
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  onMessageClick={scrollToAnalysis}
                />
              </div>
            </div>
            
          </div>
        </div>
      </MainLayout>
    </div>
  );
}

export default App;