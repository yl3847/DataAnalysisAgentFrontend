import axios from 'axios';

const LAMBDA_URL = process.env.REACT_APP_LAMBDA_URL;
const AWS_REGION = process.env.REACT_APP_AWS_REGION || 'us-east-1';

// Lambda function invocation
export const sendToLambda = async (payload) => {
  if (!LAMBDA_URL) {
    throw new Error('Lambda URL is not configured');
  }

  try {
    const response = await axios.post(LAMBDA_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        // Add CORS headers if needed
        'Access-Control-Allow-Origin': '*',
      },
      timeout: 25000, // 25 seconds (Lambda timeout is usually 30s)
    });

    // Parse Lambda response
    if (response.data) {
      // Handle Lambda proxy integration response
      if (response.data.statusCode && response.data.body) {
        const body = typeof response.data.body === 'string' 
          ? JSON.parse(response.data.body) 
          : response.data.body;
        
        if (response.data.statusCode !== 200) {
          throw new Error(body.error || 'Lambda function error');
        }
        
        return body;
      }
      
      // Direct Lambda response
      return response.data;
    }

    throw new Error('Invalid Lambda response');
  } catch (error) {
    console.error('Lambda invocation error:', error);
    
    // Format error message
    if (error.response) {
      throw new Error(error.response.data?.error || 'Lambda function error');
    } else if (error.request) {
      throw new Error('Network error: Unable to reach Lambda function');
    } else {
      throw new Error(error.message || 'Unknown error occurred');
    }
  }
};

// Lambda function for specific operations
export const lambdaOperations = {
  // Query database
  async queryDatabase(sqlQuery) {
    return sendToLambda({
      operation: 'query',
      query: sqlQuery,
    });
  },

  // Generate chart
  async generateChart(data, chartType, config) {
    return sendToLambda({
      operation: 'generateChart',
      data,
      chartType,
      config,
    });
  },

  // Process natural language query
  async processNLQuery(query) {
    return sendToLambda({
      operation: 'nlQuery',
      query,
    });
  },

  // Get schema information
  async getSchema() {
    return sendToLambda({
      operation: 'getSchema',
    });
  },

  // Analyze data
  async analyzeData(data, analysisType) {
    return sendToLambda({
      operation: 'analyze',
      data,
      analysisType,
    });
  },
};

export default {
  sendToLambda,
  ...lambdaOperations,
};