// Authentication Configuration
// This file contains the Cognito configuration values
// Update these values when deploying to different environments

export const authConfig = {
  // AWS Cognito Configuration
  userPoolId: 'us-east-1_qm1MC05BI',
  userPoolClientId: '12oef1q2s23thpat9fho9ghj67',
  identityPoolId: 'us-east-1:3a8182e2-1618-428c-9eb1-f2df95334032',
  region: 'us-east-1',
  
  // API Configuration
  apiUrl: 'https://xc6ic2ij7l.execute-api.us-east-1.amazonaws.com/prod/',
  
  // Environment
  environment: 'production', // or 'development'
  
  // Callback URLs for OAuth (if needed)
  callbackUrls: [
    'http://localhost:3000/callback',
    'https://your-github-pages-domain.github.io/callback', // Update with your actual domain
  ],
  
  logoutUrls: [
    'http://localhost:3000/logout',
    'https://your-github-pages-domain.github.io/logout', // Update with your actual domain
  ]
};

// Helper function to get config based on environment
export const getAuthConfig = () => {
  // You can add environment-specific logic here
  return authConfig;
};
