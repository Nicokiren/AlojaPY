import React from 'react';
import api from '../services/api';
import './AlojamentoCard.css';

function AlojamentoCard({ alojamento, onActionSuccess }) {

    const handleCheckout = async (estadiaId) => {
        if (window.confirm('Tem certeza que deseja registrar a saída desta pessoa?')) {
            try {
                await api.put(`/api/estadias/${estadiaId}/checkout`);
                alert('Saída registrada com sucesso!');
                onActionSuccess(); // Atualiza a lista no dashboard
            } catch (error) {
                alert('Erro ao registrar a saída.');
                console.error(error);
            }
        }
    };

    const estadiasAtivas = alojamento.estadias.filter(e => e.dataSaida === null);
    const vagas = alojamento.capacidade - estadiasAtivas.length;

    return (
        <div className="card">
            <div className="card-header">
                <h3>{alojamento.nome}</h3>
                <div className={`status ${vagas > 0 ? 'vagas-disponiveis' : 'lotado'}`}>
                    {vagas > 0 ? `${vagas} Vagas Livres` : 'Lotado'}
                </div>
            </div>
            <div className="card-body">
                <p>Capacidade Total: {alojamento.capacidade}</p>
                <h4>Hóspedes Atuais:</h4>
                {estadiasAtivas.length > 0 ? (
                    <ul className="hospedes-list">
                        {estadiasAtivas.map(estadia => (
                            <li key={estadia.id} className="hospede-item">
                                <span>{estadia.pessoa?.nome || 'Nome não encontrado'}</span>
                                <button 
                                    className="checkout-btn"
                                    onClick={() => handleCheckout(estadia.id)}>
                                    Registrar Saída
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="sem-hospedes">Nenhum hóspede no momento.</p>
                )}
            </div>
        </div>
    );
}

export default AlojamentoCard;