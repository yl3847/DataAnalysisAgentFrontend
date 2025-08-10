import React, { useState } from 'react';
import './UserMenu.css';

const UserMenu = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');
  
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Data Analyst',
    joinDate: 'January 2024'
  };

  return (
    <div className="user-menu-overlay" onClick={onClose}>
      <div className="user-menu-modal" onClick={e => e.stopPropagation()}>
        <div className="user-menu-header">
          <h2 className="text-xl font-semibold">User Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="user-menu-tabs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`tab ${activeTab === 'api' ? 'active' : ''}`}
          >
            API Settings
          </button>
        </div>

        <div className="user-menu-content">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500">{user.role} • Joined {user.joinDate}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Account Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Usage This Month</span>
                    <span className="text-sm font-medium">2,450 queries</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Storage Used</span>
                    <span className="text-sm font-medium">1.2 GB / 5 GB</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">API Calls</span>
                    <span className="text-sm font-medium">15,234</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <div>
                <label className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Dark Mode</span>
                  <input type="checkbox" className="toggle" />
                </label>
              </div>
              <div>
                <label className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Auto-save Analysis</span>
                  <input type="checkbox" className="toggle" defaultChecked />
                </label>
              </div>
              <div>
                <label className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Show Tooltips</span>
                  <input type="checkbox" className="toggle" defaultChecked />
                </label>
              </div>
              <div>
                <label className="block mb-2">
                  <span className="text-sm font-medium">Default Model</span>
                  <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Claude 3 Opus</option>
                    <option>Claude 3 Sonnet</option>
                    <option>GPT-4 Turbo</option>
                    <option>GPT-3.5 Turbo</option>
                  </select>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <div>
                <label className="block mb-2">
                  <span className="text-sm font-medium">API Endpoint</span>
                  <input 
                    type="text" 
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                    defaultValue={process.env.REACT_APP_LAMBDA_URL || ''}
                    placeholder="https://your-lambda-url.amazonaws.com"
                  />
                </label>
              </div>
              <div>
                <label className="block mb-2">
                  <span className="text-sm font-medium">API Key</span>
                  <input 
                    type="password" 
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="••••••••••••••••"
                  />
                </label>
              </div>
              <div>
                <label className="block mb-2">
                  <span className="text-sm font-medium">Region</span>
                  <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>us-east-1</option>
                    <option>us-west-2</option>
                    <option>eu-west-1</option>
                    <option>ap-southeast-1</option>
                  </select>
                </label>
              </div>
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Test Connection
              </button>
            </div>
          )}
        </div>

        <div className="user-menu-footer">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;