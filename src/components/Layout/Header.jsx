import React from 'react';

const Header = ({ onUserMenuClick, onHelpClick }) => {
  const [connectionStatus, setConnectionStatus] = React.useState('connected');

  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        const lambdaUrl = process.env.REACT_APP_LAMBDA_URL;
        if (lambdaUrl && process.env.REACT_APP_USE_MOCK_DATA !== 'true') {
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
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);



  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="px-[2%]">
        <div className="flex items-center justify-between h-12">
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
          </div>
          
          <div className="flex items-center space-x-4 relative">
            <button
              onClick={onUserMenuClick}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="User Settings"
            >
              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <button
              onClick={onHelpClick}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Help"
            >
              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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