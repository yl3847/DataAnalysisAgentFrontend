import { useState, useCallback, useRef } from 'react';
import { useApi } from './useApi';
import { trackEngagement, trackApiCall } from '../utils/analytics';

export const useAnalysis = ({
  messages,
  setMessages,
  analysisHistory,
  setAnalysisHistory,
  analysisRefs,
  messageRefs,
  activeView,
  setActiveView,
  selectedModel
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedAnalysis, setHighlightedAnalysis] = useState(null);
  const [highlightedMessage, setHighlightedMessage] = useState(null);
  const [hassentFirstMessage, setHasSentFirstMessage] = useState(false);
  const [chatHistoryForAPI, setChatHistoryForAPI] = useState([]);
  const [sessionId] = useState(`session-${Date.now()}`);
  
  const refs = useRef({ analysisRefs, messageRefs });
  refs.current = { analysisRefs, messageRefs };
  
  const { sendQuery } = useApi();

  // Calculate next analysis number
  const getNextAnalysisNumber = useCallback(() => {
    if (analysisHistory.length === 0) return 1;
    const maxNumber = Math.max(...analysisHistory.map(a => a.analysisNumber || 0));
    return maxNumber + 1;
  }, [analysisHistory]);

  // Scroll to analysis from chat message
  const scrollToAnalysis = useCallback((messageId) => {
    if (activeView !== 'analysis') {
      setActiveView('analysis');
    }
    
    setTimeout(() => {
      let targetAnalysis = null;
      
      const userMessage = messages.find(m => m.id === messageId && m.type === 'user');
      if (userMessage) {
        targetAnalysis = analysisHistory.find(a => a.messageId === messageId);
      }
      
      const assistantMessage = messages.find(m => m.id === messageId && m.type === 'assistant');
      if (assistantMessage && assistantMessage.analysisId) {
        targetAnalysis = analysisHistory.find(a => a.messageId === assistantMessage.analysisId);
      }
      
      if (!targetAnalysis) return;
      
      const element = refs.current.analysisRefs.current[targetAnalysis.messageId];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedAnalysis(targetAnalysis.messageId);
        setTimeout(() => setHighlightedAnalysis(null), 3000);
      }
    }, 100);
  }, [messages, analysisHistory, setActiveView, activeView]);

  // Scroll to message from analysis
  const scrollToMessage = useCallback((messageId) => {
    const element = refs.current.messageRefs.current[messageId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedMessage(messageId);
      setTimeout(() => setHighlightedMessage(null), 3000);
    }
  }, []);

  // Delete message and corresponding analysis
  const deleteMessage = useCallback((messageId) => {
    const messageToDelete = messages.find(m => m.id === messageId);
    
    if (messageToDelete?.type === 'user') {
      setMessages(prev => prev.filter(m => 
        m.id !== messageId && m.analysisId !== messageId
      ));
      setAnalysisHistory(prev => prev.filter(a => a.messageId !== messageId));
    } else if (messageToDelete?.type === 'assistant') {
      const analysisId = messageToDelete.analysisId;
      setMessages(prev => prev.filter(m => 
        m.id !== messageId && m.id !== analysisId
      ));
      setAnalysisHistory(prev => prev.filter(a => a.messageId !== analysisId));
    }
  }, [messages, setMessages, setAnalysisHistory]);

  // Delete analysis and corresponding messages
  const deleteAnalysis = useCallback((analysisId) => {
    setAnalysisHistory(prev => prev.filter(a => a.messageId !== analysisId));
    setMessages(prev => prev.filter(m => 
      m.id !== analysisId && m.analysisId !== analysisId
    ));
  }, [setAnalysisHistory, setMessages]);

  // Generate visualization markdown from response
  const generateVisualizationMarkdown = (apiResponse) => {
    let markdown = '## Analysis Results\n\n';
    
    // Add summary
    if (apiResponse.insight?.summary) {
      markdown += `### Summary\n${apiResponse.insight.summary}\n\n`;
    }
    
    // Add charts
    if (apiResponse.charts && apiResponse.charts.length > 0) {
      markdown += '### Visualizations\n\n';
      apiResponse.charts.forEach(chart => {
        markdown += `#### ${chart.chartName.replace(/_/g, ' ')}\n`;
        markdown += `![${chart.chartName}](${chart.chartUrl})\n\n`;
      });
    }
    
    // Add key findings
    if (apiResponse.insight?.keyFindings && apiResponse.insight.keyFindings.length > 0) {
      markdown += '### Key Findings\n';
      apiResponse.insight.keyFindings.forEach(finding => {
        markdown += `- ${finding}\n`;
      });
      markdown += '\n';
    }
    
    // Add recommendations
    if (apiResponse.insight?.recommendations && apiResponse.insight.recommendations.length > 0) {
      markdown += '### Recommendations\n';
      apiResponse.insight.recommendations.forEach(rec => {
        markdown += `- ${rec}\n`;
      });
      markdown += '\n';
    }
    
    // Add row count if available
    if (apiResponse.rowCount > 0) {
      markdown += `\n*Total rows analyzed: ${apiResponse.rowCount}*\n`;
    }
    
    return markdown;
  };

  // Handle sending message
  const handleSendMessage = useCallback(async (message) => {
    trackEngagement('Send Query', message.substring(0, 50));
    
    const analysisNumber = getNextAnalysisNumber();
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      model: selectedModel,
      analysisNumber,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    if (!hassentFirstMessage) {
      setHasSentFirstMessage(true);
      trackEngagement('First Message', selectedModel);
    }
    
    setActiveView('analysis');

    try {
      console.log('Sending query to API...');
      
      // Call the API with new format
      const apiResponse = await sendQuery(
        message, 
        chatHistoryForAPI,
        'user-001', // You can make this dynamic later
        sessionId
      );
      
      console.log('API Response received:', apiResponse);
      
      if (!apiResponse.success) {
        trackApiCall(message.substring(0, 50), false);
        throw new Error(apiResponse.errorMessage || 'API request failed');
      }
      
      trackApiCall(message.substring(0, 50), true);
      
      // Update chat history for next API call
      setChatHistoryForAPI(prev => [
        ...prev,
        { 
          role: 'user', 
          content: message,
          timestamp: userMessage.timestamp
        },
        { 
          role: 'assistant', 
          content: apiResponse.insight?.summary || 'Analysis completed',
          timestamp: new Date().toISOString()
        }
      ]);

      // Create assistant message - only show the user's query
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `**Analysis #${analysisNumber}**\n\nYour query: "${message}"\n\nThe detailed results are displayed in the Analysis Results panel.`,
        timestamp: new Date().toISOString(),
        analysisId: userMessage.id,
        analysisNumber
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Create analysis result with full response data
      const analysisResult = {
        id: userMessage.id,
        messageId: userMessage.id,
        assistantMessageId: assistantMessage.id,
        query: message,
        markdown: generateVisualizationMarkdown(apiResponse),
        description: apiResponse.insight?.summary || 'Analysis completed',
        model: selectedModel,
        analysisNumber,
        timestamp: new Date().toISOString(),
        charts: apiResponse.charts,
        insight: apiResponse.insight,
        rowCount: apiResponse.rowCount,
        apiResponse: apiResponse.rawResponse
      };
      
      setAnalysisHistory(prev => [...prev, analysisResult]);
      
      // Auto-scroll to new analysis
      setTimeout(() => {
        const element = refs.current.analysisRefs.current[userMessage.id];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setHighlightedAnalysis(userMessage.id);
          setTimeout(() => setHighlightedAnalysis(null), 3000);
        }
      }, 200);
      
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      trackApiCall(message.substring(0, 50), false);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: `Failed to process request: ${error.message}`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedModel, 
    hassentFirstMessage, 
    getNextAnalysisNumber, 
    setMessages, 
    setAnalysisHistory, 
    setActiveView,
    sendQuery,
    chatHistoryForAPI,
    sessionId
  ]);

  // Clear all
  const handleClearAll = useCallback(() => {
    setMessages([]);
    setAnalysisHistory([]);
    setHasSentFirstMessage(false);
    setActiveView('data');
    setChatHistoryForAPI([]);
  }, [setMessages, setAnalysisHistory, setActiveView]);

  return {
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
  };
};