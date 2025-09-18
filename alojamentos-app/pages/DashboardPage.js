import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AlojamentoCard from '../components/AlojamentoCard';
import CheckinModal from '../components/CheckinModal';
import './DashboardPage.css';

function DashboardPage() {
    const [alojamentos, setAlojamentos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const response = await api.get('/api/alojamentos');
            setAlojamentos(response.data);
        } catch (err) {
            setError('Falha ao carregar os dados. Tente recarregar a página.');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSuccess = () => {
        fetchData(); // Recarrega os dados após uma ação bem-sucedida
        setIsModalOpen(false);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Painel de Controle de Alojamentos</h1>
                <button className="checkin-button" onClick={() => setIsModalOpen(true)}>
                    + Fazer Check-in
                </button>
            </div>
            
            {error && <p className="error-message">{error}</p>}

            <div className="alojamentos-grid">
                {alojamentos.map(alojamento => (
                    <AlojamentoCard 
                        key={alojamento.id} 
                        alojamento={alojamento} 
                        onActionSuccess={fetchData} // Passa a função para recarregar
                    />
                ))}
            </div>

            {isModalOpen && (
                <CheckinModal 
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={handleSuccess}
                    alojamentos={alojamentos}
                />
            )}
        </div>
    );
}

export default DashboardPage;