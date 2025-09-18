import React from 'react';
import Sidebar from './components/Sidebar.jsx';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="content-container">
        {children}
      </main>
    </div>
  );
};

export default Layout;