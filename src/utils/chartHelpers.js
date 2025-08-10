// Chart helper functions
export const processChartData = (data, type) => {
  if (!data || !Array.isArray(data)) return [];
  
  switch (type) {
    case 'line':
    case 'area':
      return data.map((item, index) => ({
        x: item.x || item.date || item.time || index,
        y: item.y || item.value || item.count || 0,
        ...item
      }));
    
    case 'bar':
    case 'column':
      return data.map(item => ({
        category: item.category || item.name || item.label,
        value: item.value || item.count || 0,
        ...item
      }));
    
    case 'pie':
      return data.map(item => ({
        type: item.type || item.category || item.name,
        value: item.value || item.count || 0,
        ...item
      }));
    
    default:
      return data;
  }
};

export const getChartConfig = (type, data) => {
  const baseConfig = {
    data,
    animation: true,
    padding: 'auto',
  };
  
  switch (type) {
    case 'line':
      return {
        ...baseConfig,
        xField: 'x',
        yField: 'y',
        smooth: true,
      };
    
    case 'bar':
      return {
        ...baseConfig,
        xField: 'value',
        yField: 'category',
      };
    
    case 'pie':
      return {
        ...baseConfig,
        angleField: 'value',
        colorField: 'type',
      };
    
    default:
      return baseConfig;
  }
};