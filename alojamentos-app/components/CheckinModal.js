import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './CheckinModal.css';

function CheckinModal({ onClose, onSuccess, alojamentos }) {
    const [pessoas, setPessoas] = useState([]);
    const [pessoaId, setPessoaId] = useState('');
    const [alojamentoId, setAlojamentoId] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Carrega a lista de todas as pessoas cadastradas
        const fetchPessoas = async () => {
            try {
                const response = await api.get('/api/pessoas');
                setPessoas(response.data);
            } catch (err) {
                setError('Não foi possível carregar a lista de pessoas.');
            }
        };
        fetchPessoas();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pessoaId || !alojamentoId) {
            setError('Por favor, selecione uma pessoa e um alojamento.');
            return;
        }

        try {
            await api.post('/api/estadias/checkin', {
                pessoaId: parseInt(pessoaId),
                alojamentoId: parseInt(alojamentoId),
            });
            alert('Check-in realizado com sucesso!');
            onSuccess();
        } catch (err) {
            setError(err.response?.data || 'Ocorreu um erro ao fazer o check-in.');
        }
    };
    
    // Filtra para mostrar apenas alojamentos com vagas
    const alojamentosDisponiveis = alojamentos.filter(
        a => a.capacidade > a.estadias.filter(e => e.dataSaida === null).length
    );

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Registrar Novo Check-in</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Selecione a Pessoa:</label>
                        <select value={pessoaId} onChange={(e) => setPessoaId(e.target.value)} required>
                            <option value="">-- Escolha uma pessoa --</option>
                            {pessoas.map(p => (
                                <option key={p.id} value={p.id}>{p.nome} - {p.cpf}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Selecione o Alojamento (apenas com vagas):</label>
                        <select value={alojamentoId} onChange={(e) => setAlojamentoId(e.target.value)} required>
                            <option value="">-- Escolha um alojamento --</option>
                            {alojamentosDisponiveis.map(a => (
                                <option key={a.id} value={a.id}>{a.nome}</option>
                            ))}
                        </select>
                    </div>

                    {error && <p className="error-message-modal">{error}</p>}
                    
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-confirm">Confirmar Check-in</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CheckinModal;