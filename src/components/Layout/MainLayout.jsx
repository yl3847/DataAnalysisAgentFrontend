import React from 'react';
import Header from './Header';
import './Layout.css';

const MainLayout = ({ children, onUserMenuClick, onHelpClick }) => {
  return (
    <div className="main-layout min-h-screen flex flex-col">
      <Header onUserMenuClick={onUserMenuClick} onHelpClick={onHelpClick} />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      <footer className="bg-gray-800 text-white text-center py-1 text-xs">
        © 2025 DSAgent. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout;