// src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Header.css';

function Header() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="app-header">
            <Link to="/" className="logo">Sistema de Alojamentos</Link>
            <nav>
                {token && (
                    <>
                        <Link to="/">Painel Principal</Link>
                        <Link to="/gerenciar-pessoas">Gerenciar Pessoas</Link>
                        <button onClick={handleLogout} className="logout-button">Sair</button>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;