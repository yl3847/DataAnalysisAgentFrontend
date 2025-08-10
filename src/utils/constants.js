// Application constants
export const APP_NAME = 'Data Analytics Chatbot';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_TIMEOUT = 30000; // 30 seconds
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000; // 1 second

// Query limits
export const MAX_QUERY_LENGTH = 1000;
export const MAX_RESULTS_PER_PAGE = 100;
export const DEFAULT_PAGE_SIZE = 20;

// Chart types
export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  AREA: 'area',
  SCATTER: 'scatter',
  COLUMN: 'column',
  DUAL_AXES: 'dual-axes',
};

// Data types
export const DATA_TYPES = {
  STRING: 'string',
  NUMBER: 'number',
  DATE: 'date',
  BOOLEAN: 'boolean',
  ARRAY: 'array',
  OBJECT: 'object',
};

// Status types
export const STATUS_TYPES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  IN_PROGRESS: 'in_progress',
};

// Export formats
export const EXPORT_FORMATS = {
  CSV: 'csv',
  JSON: 'json',
  EXCEL: 'excel',
  PDF: 'pdf',
};

// Color palette for charts
export const CHART_COLORS = [
  '#5B8FF9',
  '#5AD8A6',
  '#5D7092',
  '#F6BD16',
  '#E8684A',
  '#6DC8EC',
  '#9270CA',
  '#FF9D4D',
  '#269A99',
  '#FF99C3',
];

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  INVALID_QUERY: 'Invalid query. Please check your input.',
  NO_DATA: 'No data found for your query.',
  AUTHENTICATION_ERROR: 'Authentication failed. Please log in again.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  QUERY_SUCCESS: 'Query executed successfully.',
  EXPORT_SUCCESS: 'Data exported successfully.',
  COPY_SUCCESS: 'Copied to clipboard.',
};

// Regex patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  SQL_INJECTION: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE)\b)/gi,
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_PREFERENCES: 'userPreferences',
  RECENT_QUERIES: 'recentQueries',
  CHAT_HISTORY: 'chatHistory',
};

export default {
  APP_NAME,
  APP_VERSION,
  CHART_TYPES,
  DATA_TYPES,
  STATUS_TYPES,
  EXPORT_FORMATS,
  CHART_COLORS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PATTERNS,
  STORAGE_KEYS,
};