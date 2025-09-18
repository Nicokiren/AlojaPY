import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AlojamentosPage from './pages/AlojamentosPage.jsx';
import PessoasPage from './pages/PessoasPage.jsx';
import RelatoriosPage from './pages/RelatoriosPage.jsx';
import { useAuth } from './hooks/useAuth.jsx';

function PrivateRoute({ children }) {
    const { token } = useAuth();
    return token ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<PrivateRoute><AlojamentosPage /></PrivateRoute>} />
                <Route path="/pessoas" element={<PrivateRoute><PessoasPage /></PrivateRoute>} />
                <Route path="/relatorios" element={<PrivateRoute><RelatoriosPage /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}
export default App;