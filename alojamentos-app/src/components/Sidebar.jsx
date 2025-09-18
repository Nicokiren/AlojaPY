import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import './Sidebar.css';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Sistema de Alojamentos</h3>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end>Alojamentos</NavLink>
        <NavLink to="/pessoas">Pessoas</NavLink>
        <NavLink to="/relatorios">Relatórios</NavLink>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;