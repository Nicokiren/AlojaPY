// src/App.js
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; // Nova página principal
import GerenciarPessoasPage from './pages/GerenciarPessoasPage';
import Header from './components/Header'; // Novo componente de cabeçalho
import { useAuth } from './hooks/useAuth';

function PrivateRoute({ children }) {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route 
                    path="/" 
                    element={<PrivateRoute><DashboardPage /></PrivateRoute>} 
                />
                <Route 
                    path="/gerenciar-pessoas" 
                    element={<PrivateRoute><GerenciarPessoasPage /></PrivateRoute>} 
                />
                {/* Adicione outras rotas se necessário */}
            </Routes>
        </Router>
    );
}

export default App;