import React from 'react';

const ChartRenderer = ({ config }) => {
  if (!config) return null;

  const { type, data } = config;

  // Simple chart visualization (placeholder)
  // In production, integrate with actual charting library like AntV
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <div className="space-y-2">
            {data.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <span className="text-xs w-24 text-gray-600">{item.category}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div 
                    className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(item.value / 100) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{item.value}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'pie':
        return (
          <div className="flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-2xl font-bold">{data.length}</div>
                <div className="text-xs">Categories</div>
              </div>
            </div>
          </div>
        );

      case 'line':
        return (
          <div className="h-32 flex items-end space-x-2">
            {data.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                  style={{ height: `${(item.passRate || item.value || 50) / 100 * 128}px` }}
                />
                <span className="text-xs mt-1 text-gray-600">{item.month || item.x}</span>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-500 py-8">
            <p>Chart type: {type}</p>
            <p className="text-xs">{data.length} data points</p>
          </div>
        );
    }
  };

  return (
    <div className="chart-render-container my-4 p-4 bg-white border rounded-lg">
      {renderChart()}
    </div>
  );
};

export default ChartRenderer;