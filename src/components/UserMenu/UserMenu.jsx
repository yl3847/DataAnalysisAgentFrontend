import React, { useState } from 'react';
import authService from '../../services/auth';
import './UserMenu.css';

const UserMenu = ({ onClose, onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  
  const userEmail = authService.getUserEmail();
  const user = {
    name: userEmail ? userEmail.split('@')[0] : 'User',
    email: userEmail || 'user@example.com',
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
                <h4 className="font-medium mb-3">Token Usage</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Remaining Tokens</span>
                      <span className="font-medium">8,450 / 10,000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" style={{ width: '84.5%' }}></div>
                    </div>
                  </div>
                  <button className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium">
                    Add Tokens
                  </button>
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


        </div>

        <div className="user-menu-footer">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          <button 
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;