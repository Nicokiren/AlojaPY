import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './PessoasPage.css';

function PessoasPage() {
    const [pessoas, setPessoas] = useState([]);
    const [formData, setFormData] = useState({ id: null, nome: '', cpf: '', lotacao: '', telefone: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    const fetchPessoas = async () => {
        try {
            const response = await api.get('/api/pessoas');
            setPessoas(response.data);
        } catch (err) {
            console.error("Erro ao buscar pessoas", err);
        }
    };

    useEffect(() => {
        fetchPessoas();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const method = isEditing ? 'put' : 'post';
        const url = isEditing ? `/api/pessoas/${formData.id}` : '/api/pessoas/';

        try {
            await api[method](url, formData);
            alert(`Pessoa ${isEditing ? 'atualizada' : 'adicionada'} com sucesso!`);
            resetForm();
            fetchPessoas();
        } catch (err) {
            setError(err.response?.data?.detail || `Erro ao ${isEditing ? 'atualizar' : 'adicionar'} pessoa.`);
        }
    };

    const handleEdit = (pessoa) => {
        setIsEditing(true);
        setFormData(pessoa);
    };

    const resetForm = () => {
        setIsEditing(false);
        setFormData({ id: null, nome: '', cpf: '', lotacao: '', telefone: '' });
    };

    return (
        <div className="pessoas-container">
            <h1>Gerenciar Pessoas</h1>
            <div className="pessoas-content">
                <div className="form-section">
                    <h2>{isEditing ? 'Editar Pessoa' : 'Adicionar Nova Pessoa'}</h2>
                    <form onSubmit={handleSubmit} className="pessoa-form">
                        <input name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Nome completo" required />
                        <input name="cpf" value={formData.cpf} onChange={handleInputChange} placeholder="CPF" required />
                        <input name="lotacao" value={formData.lotacao} onChange={handleInputChange} placeholder="Lotação (Cargo)" />
                        <input name="telefone" value={formData.telefone} onChange={handleInputChange} placeholder="Telefone" />
                        <div className="form-actions">
                            <button type="submit">{isEditing ? 'Salvar Alterações' : 'Adicionar Pessoa'}</button>
                            {isEditing && <button type="button" className="cancel-btn" onClick={resetForm}>Cancelar Edição</button>}
                        </div>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>
                <div className="list-section">
                    <h2>Pessoas Cadastradas</h2>
                    <ul className="pessoas-list">
                        <li className="list-header">
                            <span>Nome</span>
                            <span>CPF</span>
                            <span>Lotação</span>
                            <span>Ação</span>
                        </li>
                        {pessoas.map(p => (
                            <li key={p.id}>
                                <span>{p.nome}</span>
                                <span>{p.cpf}</span>
                                <span>{p.lotacao || 'N/A'}</span>
                                <span>
                                    <button className="edit-btn" onClick={() => handleEdit(p)}>Editar</button>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default PessoasPage;