// import { useState, useCallback, useRef } from 'react';
// import { useApi } from './useApi';

// export const useAnalysis = ({
//   messages,
//   setMessages,
//   analysisHistory,
//   setAnalysisHistory,
//   analysisRefs,
//   messageRefs,
//   activeView,
//   setActiveView,
//   selectedModel
// }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [highlightedAnalysis, setHighlightedAnalysis] = useState(null);
//   const [highlightedMessage, setHighlightedMessage] = useState(null);
//   const [hassentFirstMessage, setHasSentFirstMessage] = useState(false);
//   const [chatHistoryForAPI, setChatHistoryForAPI] = useState([]);
  
//   // Use ref to avoid dependency issues
//   const refs = useRef({ analysisRefs, messageRefs });
//   refs.current = { analysisRefs, messageRefs };
  
//   const { sendQuery } = useApi();

//   // Calculate next analysis number
//   const getNextAnalysisNumber = useCallback(() => {
//     if (analysisHistory.length === 0) return 1;
//     const maxNumber = Math.max(...analysisHistory.map(a => a.analysisNumber || 0));
//     return maxNumber + 1;
//   }, [analysisHistory]);

//   // Scroll to analysis from chat message - ALWAYS switch to analysis view
//   const scrollToAnalysis = useCallback((messageId) => {
//     // Always switch to analysis view first, regardless of current view
//     if (activeView !== 'analysis') {
//       setActiveView('analysis');
//     }
    
//     // Small delay to ensure view switch completes
//     setTimeout(() => {
//       let targetAnalysis = null;
      
//       const userMessage = messages.find(m => m.id === messageId && m.type === 'user');
//       if (userMessage) {
//         targetAnalysis = analysisHistory.find(a => a.messageId === messageId);
//       }
      
//       const assistantMessage = messages.find(m => m.id === messageId && m.type === 'assistant');
//       if (assistantMessage && assistantMessage.analysisId) {
//         targetAnalysis = analysisHistory.find(a => a.messageId === assistantMessage.analysisId);
//       }
      
//       if (!targetAnalysis) return;
      
//       const element = refs.current.analysisRefs.current[targetAnalysis.messageId];
//       if (element) {
//         element.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         setHighlightedAnalysis(targetAnalysis.messageId);
//         setTimeout(() => setHighlightedAnalysis(null), 3000);
//       }
//     }, 100);
//   }, [messages, analysisHistory, setActiveView, activeView]);

//   // Scroll to message from analysis
//   const scrollToMessage = useCallback((messageId) => {
//     const element = refs.current.messageRefs.current[messageId];
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       setHighlightedMessage(messageId);
//       setTimeout(() => setHighlightedMessage(null), 3000);
//     }
//   }, []);

//   // Delete message and corresponding analysis
//   const deleteMessage = useCallback((messageId) => {
//     const messageToDelete = messages.find(m => m.id === messageId);
    
//     if (messageToDelete?.type === 'user') {
//       setMessages(prev => prev.filter(m => 
//         m.id !== messageId && m.analysisId !== messageId
//       ));
//       setAnalysisHistory(prev => prev.filter(a => a.messageId !== messageId));
//     } else if (messageToDelete?.type === 'assistant') {
//       const analysisId = messageToDelete.analysisId;
//       setMessages(prev => prev.filter(m => 
//         m.id !== messageId && m.id !== analysisId
//       ));
//       setAnalysisHistory(prev => prev.filter(a => a.messageId !== analysisId));
//     }
//   }, [messages, setMessages, setAnalysisHistory]);

//   // Delete analysis and corresponding messages
//   const deleteAnalysis = useCallback((analysisId) => {
//     setAnalysisHistory(prev => prev.filter(a => a.messageId !== analysisId));
//     setMessages(prev => prev.filter(m => 
//       m.id !== analysisId && m.analysisId !== analysisId
//     ));
//   }, [setAnalysisHistory, setMessages]);

//   // Convert graph URL to markdown format
//   const generateVisualizationMarkdown = (graphUrl, message) => {
//     if (!graphUrl) {
//       return `## Analysis Results\n\n${message}`;
//     }
    
//     return `## Analysis Results\n\n${message}\n\n![Analysis Chart](${graphUrl})`;
//   };

//   // Handle sending message
//   const handleSendMessage = useCallback(async (message) => {
//     const analysisNumber = getNextAnalysisNumber();
    
//     const userMessage = {
//       id: Date.now(),
//       type: 'user',
//       content: message,
//       model: selectedModel,
//       analysisNumber,
//       timestamp: new Date().toISOString()
//     };
    
//     setMessages(prev => [...prev, userMessage]);
//     setIsLoading(true);
    
//     if (!hassentFirstMessage) {
//       setHasSentFirstMessage(true);
//     }
    
//     setActiveView('analysis');

//     try {
//       console.log('Sending query to API...');
//       // Call the real API
//       const apiResponse = await sendQuery(message, chatHistoryForAPI);
      
//       console.log('API Response received:', apiResponse);
      
//       if (!apiResponse.success) {
//         throw new Error(apiResponse.error || 'API request failed');
//       }

//       // Update chat history for next API call
//       setChatHistoryForAPI(prev => [
//         ...prev,
//         { role: 'user', content: message },
//         { role: 'assistant', content: apiResponse.message }
//       ]);

//       // Create assistant message - just display the raw response for now
//       const assistantMessage = {
//         id: Date.now() + 1,
//         type: 'assistant',
//         content: `**Analysis #${analysisNumber}**\n\n${apiResponse.message}`,
//         timestamp: new Date().toISOString(),
//         analysisId: userMessage.id,
//         analysisNumber,
//         rawApiResponse: apiResponse.rawResponse // Store raw response for debugging
//       };
      
//       setMessages(prev => [...prev, assistantMessage]);
      
//       // Create analysis result
//       const analysisResult = {
//         id: userMessage.id,
//         messageId: userMessage.id,
//         assistantMessageId: assistantMessage.id,
//         query: message,
//         markdown: generateVisualizationMarkdown(apiResponse.graphUrl, apiResponse.message),
//         description: apiResponse.message.substring(0, 150) + '...',
//         model: selectedModel,
//         analysisNumber,
//         timestamp: new Date().toISOString(),
//         graphUrl: apiResponse.graphUrl,
//         apiResponse: apiResponse.rawResponse
//       };
      
//       setAnalysisHistory(prev => [...prev, analysisResult]);
      
//       // Auto-scroll to new analysis
//       setTimeout(() => {
//         const element = refs.current.analysisRefs.current[userMessage.id];
//         if (element) {
//           element.scrollIntoView({ behavior: 'smooth', block: 'start' });
//           setHighlightedAnalysis(userMessage.id);
//           setTimeout(() => setHighlightedAnalysis(null), 3000);
//         }
//       }, 200);
      
//     } catch (error) {
//       console.error('Error in handleSendMessage:', error);
//       const errorMessage = {
//         id: Date.now() + 1,
//         type: 'error',
//         content: `Failed to process request: ${error.message}`,
//         timestamp: new Date().toISOString()
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [
//     selectedModel, 
//     hassentFirstMessage, 
//     getNextAnalysisNumber, 
//     setMessages, 
//     setAnalysisHistory, 
//     setActiveView,
//     sendQuery,
//     chatHistoryForAPI
//   ]);

//   // Clear all
//   const handleClearAll = useCallback(() => {
//     setMessages([]);
//     setAnalysisHistory([]);
//     setHasSentFirstMessage(false);
//     setActiveView('data');
//     setChatHistoryForAPI([]);
//   }, [setMessages, setAnalysisHistory, setActiveView]);

//   return {
//     isLoading,
//     highlightedAnalysis,
//     highlightedMessage,
//     handleSendMessage,
//     scrollToAnalysis,
//     scrollToMessage,
//     deleteMessage,
//     deleteAnalysis,
//     handleClearAll,
//     getNextAnalysisNumber
//   };
// };
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
  
  // Use ref to avoid dependency issues
  const refs = useRef({ analysisRefs, messageRefs });
  refs.current = { analysisRefs, messageRefs };
  
  const { sendQuery } = useApi();

  // Calculate next analysis number
  const getNextAnalysisNumber = useCallback(() => {
    if (analysisHistory.length === 0) return 1;
    const maxNumber = Math.max(...analysisHistory.map(a => a.analysisNumber || 0));
    return maxNumber + 1;
  }, [analysisHistory]);

  // Scroll to analysis from chat message - ALWAYS switch to analysis view
  const scrollToAnalysis = useCallback((messageId) => {
    // Always switch to analysis view first, regardless of current view
    if (activeView !== 'analysis') {
      setActiveView('analysis');
    }
    
    // Small delay to ensure view switch completes
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

  // Convert graph URL to markdown format
  const generateVisualizationMarkdown = (graphUrl, message) => {
    if (!graphUrl) {
      return `## Analysis Results\n\n${message}`;
    }
    
    return `## Analysis Results\n\n${message}\n\n![Analysis Chart](${graphUrl})`;
  };

  // Handle sending message
  const handleSendMessage = useCallback(async (message) => {
    // Track user engagement
    trackEngagement('Send Query', message.substring(0, 50)); // Track first 50 chars
    
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
      // Call the real API
      const apiResponse = await sendQuery(message, chatHistoryForAPI);
      
      console.log('API Response received:', apiResponse);
      
      if (!apiResponse.success) {
        trackApiCall(message.substring(0, 50), false);
        throw new Error(apiResponse.error || 'API request failed');
      }

      // Track successful API call
      trackApiCall(message.substring(0, 50), true);

      // Update chat history for next API call
      setChatHistoryForAPI(prev => [
        ...prev,
        { role: 'user', content: message },
        { role: 'assistant', content: apiResponse.message }
      ]);

      // Create assistant message - just display the raw response for now
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `**Analysis #${analysisNumber}**\n\n${apiResponse.message}`,
        timestamp: new Date().toISOString(),
        analysisId: userMessage.id,
        analysisNumber,
        rawApiResponse: apiResponse.rawResponse // Store raw response for debugging
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Create analysis result
      const analysisResult = {
        id: userMessage.id,
        messageId: userMessage.id,
        assistantMessageId: assistantMessage.id,
        query: message,
        markdown: generateVisualizationMarkdown(apiResponse.graphUrl, apiResponse.message),
        description: apiResponse.message.substring(0, 150) + '...',
        model: selectedModel,
        analysisNumber,
        timestamp: new Date().toISOString(),
        graphUrl: apiResponse.graphUrl,
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
    chatHistoryForAPI
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