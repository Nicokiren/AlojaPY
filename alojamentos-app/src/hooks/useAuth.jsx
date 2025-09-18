import { createContext, useContext, useState } from 'react';
import api from '../services/api.jsx';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(sessionStorage.getItem('token'));

    const login = async (username, password) => {
        const response = await api.post('/api/auth/login', { username, password });
        const newToken = response.data.token;
        sessionStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};