// import axios from 'axios';

// const LAMBDA_URL = process.env.REACT_APP_LAMBDA_URL;
// const AWS_REGION = process.env.REACT_APP_AWS_REGION || 'us-east-1';

// // Lambda function invocation
// export const sendToLambda = async (payload) => {
//   if (!LAMBDA_URL) {
//     throw new Error('Lambda URL is not configured');
//   }

//   try {
//     const response = await axios.post(LAMBDA_URL, payload, {
//       headers: {
//         'Content-Type': 'application/json',
//         // Add CORS headers if needed
//         'Access-Control-Allow-Origin': '*',
//       },
//       timeout: 25000, // 25 seconds (Lambda timeout is usually 30s)
//     });

//     // Parse Lambda response
//     if (response.data) {
//       // Handle Lambda proxy integration response
//       if (response.data.statusCode && response.data.body) {
//         const body = typeof response.data.body === 'string' 
//           ? JSON.parse(response.data.body) 
//           : response.data.body;
        
//         if (response.data.statusCode !== 200) {
//           throw new Error(body.error || 'Lambda function error');
//         }
        
//         return body;
//       }
      
//       // Direct Lambda response
//       return response.data;
//     }

//     throw new Error('Invalid Lambda response');
//   } catch (error) {
//     console.error('Lambda invocation error:', error);
    
//     // Format error message
//     if (error.response) {
//       throw new Error(error.response.data?.error || 'Lambda function error');
//     } else if (error.request) {
//       throw new Error('Network error: Unable to reach Lambda function');
//     } else {
//       throw new Error(error.message || 'Unknown error occurred');
//     }
//   }
// };

// // Lambda function for specific operations
// export const lambdaOperations = {
//   // Query database
//   async queryDatabase(sqlQuery) {
//     return sendToLambda({
//       operation: 'query',
//       query: sqlQuery,
//     });
//   },

//   // Generate chart
//   async generateChart(data, chartType, config) {
//     return sendToLambda({
//       operation: 'generateChart',
//       data,
//       chartType,
//       config,
//     });
//   },

//   // Process natural language query
//   async processNLQuery(query) {
//     return sendToLambda({
//       operation: 'nlQuery',
//       query,
//     });
//   },

//   // Get schema information
//   async getSchema() {
//     return sendToLambda({
//       operation: 'getSchema',
//     });
//   },

//   // Analyze data
//   async analyzeData(data, analysisType) {
//     return sendToLambda({
//       operation: 'analyze',
//       data,
//       analysisType,
//     });
//   },
// };

// export default {
//   sendToLambda,
//   ...lambdaOperations,
// };
// src/services/lambdaClient.js
import axios from 'axios';

// --- Hardcoded backend for initial local integration ---
const LAMBDA_URL = 'https://e75ohlwotf.execute-api.us-east-1.amazonaws.com/prod/agent';
const API_KEY = 'R79YXWKV5m1DUjqLDDmSQ7VPwYUBwC631j52Qp3J';

// Helper to shape payload into the Lambda contract
// Lambda expects: { user_input: string, chat_history: Array }
const buildPayload = (payload) => {
  if (!payload) return { user_input: '', chat_history: [] };

  // If caller already provides the Lambda shape, use as-is
  if ('user_input' in payload) {
    return {
      user_input: payload.user_input ?? '',
      chat_history: Array.isArray(payload.chat_history) ? payload.chat_history : [],
      ...payload.extra, // allow extra fields if any
    };
  }

  // Otherwise map from our internal shape (query, chat_history)
  const {
    query = '',
    chat_history = [],
    ...rest
  } = payload;

  return {
    user_input: query,
    chat_history: Array.isArray(chat_history) ? chat_history : [],
    ...rest,
  };
};

// Lambda function invocation
export const sendToLambda = async (payload) => {
  try {
    const response = await axios.post(LAMBDA_URL, buildPayload(payload), {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      // NOTE: do not set Access-Control-Allow-* headers on the client; that’s a server concern
      timeout: 25000, // 25s
    });

    // If API Gateway proxy style: { statusCode, body }
    if (response?.data && typeof response.data === 'object') {
      const { statusCode, body } = response.data;

      if (typeof statusCode === 'number') {
        const parsedBody = typeof body === 'string' ? safeJsonParse(body) : body;
        if (statusCode !== 200) {
          const msg = parsedBody?.error || parsedBody?.message || 'Lambda function error';
          throw new Error(msg);
        }
        return parsedBody;
      }

      // Direct JSON response
      return response.data;
    }

    throw new Error('Invalid Lambda response');
  } catch (error) {
    console.error('Lambda invocation error:', error);
    if (error.response) {
      throw new Error(error.response.data?.error || error.response.data?.message || 'Lambda function error');
    } else if (error.request) {
      throw new Error('Network error: Unable to reach Lambda function');
    }
    throw new Error(error.message || 'Unknown error occurred');
  }
};

function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return { message: String(str) };
  }
}

// Optional higher-level helpers if you want to keep them
export const lambdaOperations = {
  async processNLQuery(query, chat_history = []) {
    return sendToLambda({ query, chat_history });
  },
};

export default {
  sendToLambda,
  ...lambdaOperations,
};
