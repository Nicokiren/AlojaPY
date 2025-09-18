import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './LoginPage.css';

function LoginPage() {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('senha123');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Usuário ou senha inválidos.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <h2>Sistema de Alojamentos</h2>
                <p>Por favor, faça login para continuar</p>
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Usuário"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha"
                        required
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">Entrar</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;