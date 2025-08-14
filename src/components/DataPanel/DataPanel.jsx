import React from 'react';
import SampleDataDisplay from '../DataTable/SampleDataDisplay';
import ResponseDisplay from '../ResponseDisplay/ResponseDisplay';

const DataPanel = ({
  width,
  activeView,
  setActiveView,
  analysisHistory,
  analysisRefs,
  highlightedAnalysis,
  onAnalysisClick,
  onDeleteAnalysis
}) => {
  return (
    <div 
      className="h-full overflow-hidden"
      style={{ width: `${width}%` }}
    >
      <div className="bg-white rounded-lg shadow-lg h-full flex flex-col overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b px-6 py-3 flex-shrink-0" style={{ height: '60px' }}>
          <div className="flex items-center justify-between h-full">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveView('data')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeView === 'data'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Sample Data Overview
              </button>
              <button
                onClick={() => setActiveView('analysis')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeView === 'analysis'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Analysis Results
                {analysisHistory.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-white bg-opacity-20 rounded-full">
                    {analysisHistory.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 analysis-scroll-area">
          {activeView === 'data' ? (
            <SampleDataDisplay />
          ) : (
            <>
              {analysisHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-lg font-medium">No analysis results yet</p>
                  <p className="text-sm mt-2">Send a query to see analysis results here</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {analysisHistory.map((analysis) => (
                    <div 
                      key={analysis.id}
                      ref={el => analysisRefs.current[analysis.messageId] = el}
                      className={`border rounded-lg p-6 transition-all duration-500 ${
                        highlightedAnalysis === analysis.messageId 
                          ? 'bg-blue-50 border-blue-400 shadow-lg ring-2 ring-blue-400 ring-opacity-50' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="mb-4 flex justify-between items-start">
                        <div 
                          className="cursor-pointer hover:opacity-70 transition-opacity flex-1"
                          onClick={() => onAnalysisClick(analysis.assistantMessageId)}
                        >
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            Analysis #{analysis.analysisNumber}
                            <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </h3>
                          <p className="text-sm text-gray-600 italic mt-1">
                            Query: "{analysis.query}"
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Model: {analysis.model} • {new Date(analysis.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => onDeleteAnalysis(analysis.messageId)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors ml-4"
                          title="Delete this analysis"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      <ResponseDisplay 
                        response={{
                          content: analysis.markdown,
                          description: analysis.description
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataPanel;