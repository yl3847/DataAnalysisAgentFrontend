import { useState, useCallback } from 'react';
import { sendToLambda } from '../services/lambdaClient';
import { getMockResponse } from '../services/mockData';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const useMockData = process.env.REACT_APP_USE_MOCK_DATA === 'true';

  const sendQuery = useCallback(async (query, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (useMockData) {
        // Use mock data for local testing
        console.log('Using mock data for query:', query);
        response = await getMockResponse(query);
      } else {
        // Send to Lambda
        console.log('Sending to Lambda:', query);
        response = await sendToLambda({
          query,
          ...options
        });
      }
      
      setLoading(false);
      return response;
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'An error occurred');
      setLoading(false);
      
      // Return a fallback response
      return {
        success: false,
        message: err.message || 'Failed to process query',
        data: null,
        charts: null
      };
    }
  }, [useMockData]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    sendQuery,
    loading,
    error,
    reset
  };
};