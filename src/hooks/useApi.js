// import { useState, useCallback } from 'react';
// import { sendToLambda } from '../services/lambdaClient';
// import { getMockResponse } from '../services/mockData';

// export const useApi = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
  
//   const useMockData = process.env.REACT_APP_USE_MOCK_DATA === 'true';

//   const sendQuery = useCallback(async (query, options = {}) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       let response;
      
//       if (useMockData) {
//         // Use mock data for local testing
//         console.log('Using mock data for query:', query);
//         response = await getMockResponse(query);
//       } else {
//         // Send to Lambda
//         console.log('Sending to Lambda:', query);
//         response = await sendToLambda({
//           query,
//           ...options
//         });
//       }
      
//       setLoading(false);
//       return response;
//     } catch (err) {
//       console.error('API Error:', err);
//       setError(err.message || 'An error occurred');
//       setLoading(false);
      
//       // Return a fallback response
//       return {
//         success: false,
//         message: err.message || 'Failed to process query',
//         data: null,
//         charts: null
//       };
//     }
//   }, [useMockData]);

//   const reset = useCallback(() => {
//     setLoading(false);
//     setError(null);
//   }, []);

//   return {
//     sendQuery,
//     loading,
//     error,
//     reset
//   };
// };
const API_ENDPOINT = 'https://xc6ic2ij7l.execute-api.us-east-1.amazonaws.com/prod/agent';
const API_KEY = 'gRpxDGL8To3sFrP2CMMuTaOB376rHz1C6ozOZFAd';

export const useApi = () => {
  const sendQuery = async (userInput, chatHistory = []) => {
    console.log('=== API Request Debug ===');
    console.log('Endpoint:', API_ENDPOINT);
    console.log('User Input:', userInput);
    console.log('Chat History:', chatHistory);
    
    const requestBody = {
      user_input: userInput,
      chat_history: chatHistory
    };
    
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));
    
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response Status:', response.status);
      console.log('Response Headers:', response.headers);
      
      // Get the raw text first
      const rawText = await response.text();
      console.log('Raw Response Text:', rawText);
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(rawText);
        console.log('Parsed Response Data:', data);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        // Return the raw text if it's not JSON
        return {
          success: true,
          message: rawText,
          graphUrl: null,
          rawResponse: { text: rawText }
        };
      }

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} - ${rawText}`);
      }

      // Parse the nested body structure from Lambda response
      let parsedData = data;
      if (data.body && typeof data.body === 'string') {
        try {
          parsedData = JSON.parse(data.body);
          console.log('Parsed body data:', parsedData);
        } catch (bodyParseError) {
          console.error('Failed to parse body as JSON:', bodyParseError);
          parsedData = data;
        }
      }

      // Extract the actual response data
      const returnValue = parsedData.returnValue || parsedData;
      const charts = parsedData.charts || [];
      const insight = parsedData.insight || {};

      return {
        success: true,
        message: insight.summary || 'Analysis completed',
        graphUrl: null,
        rawResponse: data,
        // Extract the actual data for analysis
        returnValue: returnValue,
        charts: charts,
        insight: insight,
        rowCount: returnValue.rowCount || 0,
        data: returnValue.data || []
      };
    } catch (error) {
      console.error('=== API Error Details ===');
      console.error('Error Type:', error.name);
      console.error('Error Message:', error.message);
      console.error('Full Error:', error);
      
      // Check if it's a CORS error
      if (error.message.includes('Failed to fetch')) {
        console.error('This might be a CORS issue. The API might not allow requests from your domain.');
      }
      
      return {
        success: false,
        message: `Failed to process request: ${error.message}`,
        error: error.message
      };
    }
  };

  return { sendQuery };
};