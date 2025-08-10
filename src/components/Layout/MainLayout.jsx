import React from 'react';
import Header from './Header';
import './Layout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;