// Mock data service for local testing
export const getMockResponse = async (query) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const lowerQuery = query.toLowerCase();

  // Mock responses based on query patterns
  if (lowerQuery.includes('teenage') || lowerQuery.includes('male')) {
    return {
      success: true,
      message: `Found 3 teenage male applicants in the database.`,
      data: {
        rows: [
          { id: 1, name: 'John Smith', age: 17, gender: 'Male', state: 'California' },
          { id: 3, name: 'Michael Brown', age: 19, gender: 'Male', state: 'Texas' },
          { id: 7, name: 'Robert Garcia', age: 16, gender: 'Male', state: 'Arizona' },
        ],
        rowCount: 3,
      },
      charts: null,
    };
  }

  if (lowerQuery.includes('chart') || lowerQuery.includes('distribution')) {
    return {
      success: true,
      message: `Generated age distribution chart for all applicants.`,
      data: {
        rows: generateAgeDistribution(),
        rowCount: 10,
      },
      charts: [{
        type: 'bar',
        title: 'Age Distribution',
        data: [
          { age: '16-18', count: 3 },
          { age: '19-21', count: 4 },
          { age: '22-24', count: 2 },
          { age: '25+', count: 1 },
        ],
        config: {
          xField: 'count',
          yField: 'age',
        },
        description: 'Distribution of applicants by age group',
      }],
    };
  }

  if (lowerQuery.includes('average') || lowerQuery.includes('gender')) {
    return {
      success: true,
      message: `Calculated average age by gender.`,
      data: {
        rows: [
          { gender: 'Male', average_age: 20.2, count: 5 },
          { gender: 'Female', average_age: 22.4, count: 5 },
        ],
        rowCount: 2,
      },
      charts: [{
        type: 'pie',
        title: 'Gender Distribution',
        data: [
          { type: 'Male', value: 5 },
          { type: 'Female', value: 5 },
        ],
        config: {
          angleField: 'value',
          colorField: 'type',
        },
      }],
    };
  }

  if (lowerQuery.includes('california')) {
    return {
      success: true,
      message: `Found 4 applicants from California.`,
      data: {
        rows: [
          { id: 1, name: 'John Smith', age: 17, gender: 'Male', state: 'California' },
          { id: 4, name: 'Sarah Davis', age: 22, gender: 'Female', state: 'California' },
          { id: 6, name: 'Linda Martinez', age: 30, gender: 'Female', state: 'California' },
          { id: 10, name: 'Maria Hernandez', age: 19, gender: 'Female', state: 'California' },
        ],
        rowCount: 4,
      },
      charts: null,
    };
  }

  // Default response
  return {
    success: true,
    message: `I've processed your query: "${query}". Here's what I found in the sample data.`,
    data: {
      rows: generateSampleData(),
      rowCount: 10,
    },
    charts: null,
  };
};

// Helper function to generate sample data
const generateSampleData = () => {
  return [
    { id: 1, name: 'John Smith', age: 17, gender: 'Male', state: 'California', status: 'Pending' },
    { id: 2, name: 'Emily Johnson', age: 25, gender: 'Female', state: 'New York', status: 'Approved' },
    { id: 3, name: 'Michael Brown', age: 19, gender: 'Male', state: 'Texas', status: 'Pending' },
    { id: 4, name: 'Sarah Davis', age: 22, gender: 'Female', state: 'California', status: 'Approved' },
    { id: 5, name: 'James Wilson', age: 18, gender: 'Male', state: 'Florida', status: 'Rejected' },
    { id: 6, name: 'Linda Martinez', age: 30, gender: 'Female', state: 'California', status: 'Approved' },
    { id: 7, name: 'Robert Garcia', age: 16, gender: 'Male', state: 'Arizona', status: 'Pending' },
    { id: 8, name: 'Patricia Rodriguez', age: 24, gender: 'Female', state: 'Illinois', status: 'Approved' },
    { id: 9, name: 'Christopher Lee', age: 21, gender: 'Male', state: 'Washington', status: 'Pending' },
    { id: 10, name: 'Maria Hernandez', age: 19, gender: 'Female', state: 'California', status: 'Approved' },
  ];
};

const generateAgeDistribution = () => {
  return generateSampleData().map(person => ({
    name: person.name,
    age: person.age,
    age_group: 
      person.age <= 18 ? '16-18' :
      person.age <= 21 ? '19-21' :
      person.age <= 24 ? '22-24' : '25+',
  }));
};

// Mock chart configurations
export const mockChartConfigs = {
  line: {
    type: 'line',
    data: Array.from({ length: 10 }, (_, i) => ({
      x: `Day ${i + 1}`,
      y: Math.floor(Math.random() * 100),
    })),
    config: {
      xField: 'x',
      yField: 'y',
    },
  },
  bar: {
    type: 'bar',
    data: [
      { category: 'Category A', value: 30 },
      { category: 'Category B', value: 45 },
      { category: 'Category C', value: 28 },
      { category: 'Category D', value: 50 },
    ],
    config: {
      xField: 'value',
      yField: 'category',
    },
  },
};

export default {
  getMockResponse,
  mockChartConfigs,
};