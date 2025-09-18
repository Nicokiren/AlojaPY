// src/pages/GerenciarPessoasPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './GerenciarPessoasPage.css';

function GerenciarPessoasPage() {
    const [pessoas, setPessoas] = useState([]);
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [error, setError] = useState('');

    const fetchPessoas = async () => {
        const response = await api.get('/api/pessoas');
        setPessoas(response.data);
    };

    useEffect(() => {
        fetchPessoas();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/pessoas', { nome, cpf });
            alert('Pessoa adicionada com sucesso!');
            setNome('');
            setCpf('');
            fetchPessoas(); // Recarrega a lista
        } catch (err) {
            setError(err.response?.data?.detail || 'Erro ao adicionar pessoa.');
        }
    };

    return (
        <div className="gerenciar-container">
            <div className="form-section">
                <h2>Adicionar Nova Pessoa</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome completo" required />
                    <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} placeholder="CPF" required />
                    <button type="submit">Adicionar</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
            <div className="list-section">
                <h2>Pessoas Cadastradas</h2>
                <ul>
                    {pessoas.map(p => <li key={p.id}>{p.nome} ({p.cpf})</li>)}
                </ul>
            </div>
        </div>
    );
}

export default GerenciarPessoasPage;