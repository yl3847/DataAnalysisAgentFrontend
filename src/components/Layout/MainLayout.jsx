import React from 'react';
import Header from './Header';
import './Layout.css';

const MainLayout = ({ children, onUserMenuClick }) => {
  return (
    <div className="main-layout min-h-screen flex flex-col">
      <Header onUserMenuClick={onUserMenuClick} />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      <footer className="bg-gray-800 text-white text-center py-2 text-sm">
        © 2025 DSAgent. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout;