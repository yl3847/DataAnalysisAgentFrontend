import React from 'react';

const Header = () => {
  const [connectionStatus, setConnectionStatus] = React.useState('connected');

  React.useEffect(() => {
    // Check backend connection status
    const checkConnection = async () => {
      try {
        const lambdaUrl = process.env.REACT_APP_LAMBDA_URL;
        if (lambdaUrl && !process.env.REACT_APP_USE_MOCK_DATA === 'true') {
          // Simple health check
          const response = await fetch(`${lambdaUrl}/health`, { 
            method: 'GET',
            mode: 'cors'
          }).catch(() => null);
          
          setConnectionStatus(response?.ok ? 'connected' : 'disconnected');
        } else {
          setConnectionStatus('mock');
        }
      } catch (error) {
        setConnectionStatus('disconnected');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-500';
      case 'mock':
        return 'bg-yellow-500';
      case 'disconnected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected to AWS';
      case 'mock':
        return 'Using Mock Data';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <svg
                className="h-8 w-8 text-blue-600 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h1 className="text-xl font-bold text-gray-900">
                Data Analytics Chatbot
              </h1>
            </div>
            <span className="text-sm text-gray-500 hidden sm:inline">
              Powered by AWS MCP Server
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${getStatusColor()} animate-pulse`}></div>
              <span className="text-sm text-gray-600">{getStatusText()}</span>
            </div>
            
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => window.location.reload()}
              title="Refresh"
            >
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;