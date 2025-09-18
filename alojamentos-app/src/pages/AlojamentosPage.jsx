import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './AlojamentosPage.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// --- Componente Detalhe (Painel Lateral) ---
const AlojamentoDetail = ({ alojamento, pessoas, onActionSuccess, onClose }) => {
    const [pessoaId, setPessoaId] = useState('');
    const [dataSaida, setDataSaida] = useState(null);

    const handleCheckin = async (e) => {
        e.preventDefault();
        if (!pessoaId) return alert("Selecione uma pessoa.");
        
        try {
            await api.post('/api/estadias/checkin', {
                pessoaId: parseInt(pessoaId),
                alojamentoId: alojamento.id,
                data_saida: dataSaida,
            });
            onActionSuccess();
            setPessoaId('');
            setDataSaida(null);
        } catch (err) {
            alert(err.response?.data?.detail || "Erro ao fazer check-in");
        }
    };
    
    const handleUpdateDates = async (estadiaId, entrada, saida) => {
        try {
            await api.put(`/api/estadias/${estadiaId}/datas`, {
                data_entrada: entrada,
                data_saida: saida
            });
            onActionSuccess();
        } catch(err) {
            alert("Erro ao atualizar datas.");
        }
    };

    const pessoasDisponiveis = pessoas.filter(p => 
        !p.estadias.some(e => e.data_saida === null || new Date(e.data_saida) > new Date())
    );

    const estadiasAtivas = alojamento.estadias.filter(e => e.data_saida === null || new Date(e.data_saida) > new Date());
    const vagas = alojamento.capacidade - estadiasAtivas.length;

    return (
        <div className="detail-view">
            <div className="detail-header">
                <h2>{alojamento.nome}</h2>
                <button className="close-btn" onClick={onClose}>X</button>
            </div>
            
            <div className="detail-section">
                <h4>Hóspedes Atuais ({estadiasAtivas.length}/{alojamento.capacidade})</h4>
                <ul className="hospedes-detail-list">
                    {estadiasAtivas.map(e => (
                        <li key={e.id}>
                            <span className="hospede-nome">{e.pessoa.nome}</span>
                            <div className="datas-container">
                                <DatePicker 
                                    selected={new Date(e.data_entrada)}
                                    onChange={(date) => handleUpdateDates(e.id, date, e.data_saida ? new Date(e.data_saida) : null)}
                                    dateFormat="dd/MM/yyyy"
                                />
                                <DatePicker 
                                    selected={e.data_saida ? new Date(e.data_saida) : null}
                                    onChange={(date) => handleUpdateDates(e.id, new Date(e.data_entrada), date)}
                                    placeholderText="Saída"
                                    isClearable
                                    dateFormat="dd/MM/yyyy"
                                />
                            </div>
                        </li>
                    ))}
                     {estadiasAtivas.length === 0 && <p className="sem-hospedes">Nenhum hóspede neste quarto.</p>}
                </ul>
            </div>

            {vagas > 0 && (
                <div className="detail-section">
                    <h4>Adicionar Pessoa</h4>
                    <form onSubmit={handleCheckin} className="checkin-form-detail">
                        <select value={pessoaId} onChange={(e) => setPessoaId(e.target.value)} required>
                            <option value="">Selecione uma pessoa</option>
                            {pessoasDisponiveis.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                        </select>
                        <DatePicker 
                            selected={dataSaida} 
                            onChange={(date) => setDataSaida(date)} 
                            placeholderText="Data de Saída (opcional)"
                            className="date-picker-input"
                            dateFormat="dd/MM/yyyy"
                        />
                        <button type="submit">Adicionar</button>
                    </form>
                </div>
            )}
        </div>
    );
};

// --- Componente Principal da Página ---
const AlojamentosPage = () => {
    const [alojamentos, setAlojamentos] = useState([]);
    const [pessoas, setPessoas] = useState([]);
    const [selectedAlojamento, setSelectedAlojamento] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [alojRes, pessRes] = await Promise.all([
                api.get('/api/alojamentos'),
                api.get('/api/pessoas')
            ]);
            setAlojamentos(alojRes.data);
            setPessoas(pessRes.data);
            
            if (selectedAlojamento) {
                const updatedAloj = alojRes.data.find(a => a.id === selectedAlojamento.id);
                setSelectedAlojamento(updatedAloj);
            }
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="loading-container">Carregando Alojamentos...</div>;

    const femininos = alojamentos.filter(a => a.nome.startsWith('AS'));
    const masculinos = alojamentos.filter(a => a.nome.startsWith('B'));

    const getOcupacao = (aloj) => aloj.estadias.filter(e => e.data_saida === null || new Date(e.data_saida) > new Date()).length;

    const renderCard = (a) => {
        const ocupacao = getOcupacao(a);
        return (
            <div className={`card ${selectedAlojamento?.id === a.id ? 'active' : ''}`} key={a.id} onClick={() => setSelectedAlojamento(a)}>
                <div className="card-header-flex">
                    <span className="card-nome">{a.nome}</span>
                    {a.tem_ar_condicionado && <span className="snowflake-icon">❄️</span>}
                </div>
                <span className={`card-ocupacao ${ocupacao === a.capacidade ? 'lotado' : ''}`}>
                    ({ocupacao}/{a.capacidade})
                </span>
            </div>
        );
    };

    return (
        <div className="alojamentos-page-container">
            <div className="grid-view">
                <h1>Alojamentos</h1>
                <div className="section-container">
                    <h3>Femininos</h3>
                    <div className="card-grid">
                        {femininos.map(renderCard)}
                    </div>
                </div>
                <div className="section-container">
                    <h3>Masculinos</h3>
                    <div className="card-grid">
                        {masculinos.map(renderCard)}
                    </div>
                </div>
            </div>
            {selectedAlojamento ? 
                <AlojamentoDetail alojamento={selectedAlojamento} pessoas={pessoas} onActionSuccess={fetchData} onClose={() => setSelectedAlojamento(null)} />
                : <div className="placeholder-detail">Selecione um alojamento para ver os detalhes.</div>
            }
        </div>
    );
};

export default AlojamentosPage;