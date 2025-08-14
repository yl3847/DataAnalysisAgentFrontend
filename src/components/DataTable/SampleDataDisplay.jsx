import React from 'react';
import DataTable from './DataTable';

const SampleDataDisplay = () => {
  const sampleData = [
    { applicant_id: 'AID0001', gender: 'Male', age_group: 'Young Adult', race: 'Other', training: 'None', signals: 38.48, yield: 30.29, speed_control: 37.03, night_drive: 33.53, road_signs: 39.61, steer_control: 58.16, mirror_usage: 53.42, confidence: 35.32, parking: 38.19, theory_test: 70.68, reactions: 'Average', qualified: 'No' },
    { applicant_id: 'AID0002', gender: 'Female', age_group: 'Young Adult', race: 'Black', training: 'None', signals: 51.76, yield: 19.13, speed_control: 63.05, night_drive: 34.87, road_signs: 19.56, steer_control: 16.48, mirror_usage: 27.97, confidence: 22.91, parking: 24.23, theory_test: 78.18, reactions: 'Average', qualified: 'No' },
    { applicant_id: 'AID0003', gender: 'Male', age_group: 'Middle Age', race: 'Black', training: 'None', signals: 30.21, yield: 48.13, speed_control: 43.13, night_drive: 42.43, road_signs: 60.93, steer_control: 20.74, mirror_usage: 28.86, confidence: 32.32, parking: 44.11, theory_test: 79.6, reactions: 'Fast', qualified: 'Yes' },
    { applicant_id: 'AID0004', gender: 'Male', age_group: 'Young Adult', race: 'Other', training: 'None', signals: 34.75, yield: 47.28, speed_control: 50.49, night_drive: 42.10, road_signs: 22.52, steer_control: 33.87, mirror_usage: 48.52, confidence: 24.90, parking: 37.56, theory_test: 57.34, reactions: 'Average', qualified: 'No' },
    { applicant_id: 'AID0005', gender: 'Male', age_group: 'Teenager', race: 'Other', training: 'Advanced', signals: 78.52, yield: 83.93, speed_control: 59.79, night_drive: 52.68, road_signs: 67.47, steer_control: 89.24, mirror_usage: 30.31, confidence: 43.85, parking: 55.91, theory_test: 78.44, reactions: 'Average', qualified: 'Yes' },
    { applicant_id: 'AID0006', gender: 'Female', age_group: 'Young Adult', race: 'Other', training: 'Basic', signals: 56.09, yield: 59.31, speed_control: 64.18, night_drive: 55.77, road_signs: 60.92, steer_control: 61.85, mirror_usage: 60.88, confidence: 60.91, parking: 42.64, theory_test: 49.40, reactions: 'Average', qualified: 'Yes' },
    { applicant_id: 'AID0007', gender: 'Male', age_group: 'Middle Age', race: 'Black', training: 'Basic', signals: 62.63, yield: 45.75, speed_control: 53.01, night_drive: 31.71, road_signs: 62.35, steer_control: 41.26, mirror_usage: 44.44, confidence: 47.03, parking: 51.41, theory_test: 78.36, reactions: 'Average', qualified: 'Yes' },
    { applicant_id: 'AID0008', gender: 'Male', age_group: 'Young Adult', race: 'Other', training: 'Basic', signals: 28.47, yield: 31.45, speed_control: 58.16, night_drive: 61.68, road_signs: 46.11, steer_control: 50.70, mirror_usage: 42.56, confidence: 38.97, parking: 31.64, theory_test: 92.37, reactions: 'Average', qualified: 'Yes' },
    { applicant_id: 'AID0009', gender: 'Male', age_group: 'Young Adult', race: 'Other', training: 'None', signals: 35.59, yield: 41.80, speed_control: 45.71, night_drive: 32.72, road_signs: 10.09, steer_control: 34.31, mirror_usage: 27.35, confidence: 36.64, parking: 31.94, theory_test: 64.57, reactions: 'Slow', qualified: 'No' },
  ];

  const getStatistics = () => {
    const stats = {
      totalRecords: sampleData.length,
      avgTheoryTest: Math.round(sampleData.reduce((sum, r) => sum + r.theory_test, 0) / sampleData.length),
      qualifiedCount: sampleData.filter(r => r.qualified === 'Yes').length,
      notQualifiedCount: sampleData.filter(r => r.qualified === 'No').length,
      trainingTypes: {
        none: sampleData.filter(r => r.training === 'None').length,
        basic: sampleData.filter(r => r.training === 'Basic').length,
        advanced: sampleData.filter(r => r.training === 'Advanced').length,
      }
    };
    return stats;
  };

  const stats = getStatistics();

  return (
    <div className="sample-data-display h-full flex flex-col">
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Driver License Application Dataset
        </h2>
      </div>

      {/* Data Preview */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Data Preview</h3>
        <DataTable data={sampleData.slice(0, 5)} maxRows={5} />
      </div>

      {/* Statistics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Statistics</h3>
        
        {/* Qualification Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Qualification Status</h4>
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-600 font-medium">Qualified</span>
                <span className="text-gray-600">{stats.qualifiedCount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.qualifiedCount / stats.totalRecords) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-red-600 font-medium">Not Qualified</span>
                <span className="text-gray-600">{stats.notQualifiedCount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.notQualifiedCount / stats.totalRecords) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Training Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Training Distribution</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600">No Training</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{stats.trainingTypes.none}</span>
                <span className="text-xs text-gray-500">({Math.round((stats.trainingTypes.none / stats.totalRecords) * 100)}%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Basic Training</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{stats.trainingTypes.basic}</span>
                <span className="text-xs text-gray-500">({Math.round((stats.trainingTypes.basic / stats.totalRecords) * 100)}%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Advanced Training</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{stats.trainingTypes.advanced}</span>
                <span className="text-xs text-gray-500">({Math.round((stats.trainingTypes.advanced / stats.totalRecords) * 100)}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Average Theory Test Score */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-lg">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{stats.avgTheoryTest}%</div>
            <div className="text-emerald-100 text-sm">Average Theory Test Score</div>
            <div className="mt-3">
              <div className="w-full bg-emerald-400 bg-opacity-30 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.avgTheoryTest}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleDataDisplay;