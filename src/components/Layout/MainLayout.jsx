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
    </div>
  );
};

export default MainLayout;