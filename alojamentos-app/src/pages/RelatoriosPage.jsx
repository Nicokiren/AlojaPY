import React, { useState } from 'react';
import api from '../services/api';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './RelatoriosPage.css';

const RelatoriosPage = () => {
    const [dataInicio, setDataInicio] = useState(null);
    const [dataFim, setDataFim] = useState(null);
    const [estadias, setEstadias] = useState([]);
    const [loading, setLoading] = useState(false);

    const buscarRelatorio = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (dataInicio) params.append("data_inicio", dataInicio.toISOString());
        if (dataFim) params.append("data_fim", dataFim.toISOString());
        
        try {
            const response = await api.get(`/api/relatorios/ocupacao?${params.toString()}`);
            setEstadias(response.data);
        } catch(err) {
            alert("Erro ao buscar relatório.");
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        const reportData = estadias.map(e => ({
            'Alojamento': e.alojamento.nome,
            'Hóspede': e.pessoa.nome,
            'Lotação': e.pessoa.lotacao,
            'Entrada': new Date(e.data_entrada).toLocaleDateString('pt-BR'),
            'Saída': e.data_saida ? new Date(e.data_saida).toLocaleDateString('pt-BR') : "Presente"
        }));

        const ws = XLSX.utils.json_to_sheet(reportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "RelatorioOcupacao");
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: "application/octet-stream"});
        saveAs(data, "relatorio_ocupacao.xlsx");
    };
    
    const estadiasAgrupadas = estadias.reduce((acc, e) => {
        const nomeAlojamento = e.alojamento.nome;
        if (!acc[nomeAlojamento]) {
            acc[nomeAlojamento] = [];
        }
        acc[nomeAlojamento].push(e);
        return acc;
    }, {});

    return (
        <div className="relatorios-container">
            <h1>Relatórios de Ocupação</h1>
            <div className="filtros-container">
                <DatePicker 
                    selected={dataInicio} 
                    onChange={date => setDataInicio(date)} 
                    placeholderText="Data de Início" 
                    className="date-picker-input"
                    dateFormat="dd/MM/yyyy"
                />
                <DatePicker 
                    selected={dataFim} 
                    onChange={date => setDataFim(date)} 
                    placeholderText="Data de Fim" 
                    className="date-picker-input"
                    dateFormat="dd/MM/yyyy"
                />
                <button onClick={buscarRelatorio} disabled={loading}>
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
                <button onClick={exportToExcel} disabled={!estadias.length}>
                    Exportar para Excel
                </button>
            </div>

            <div className="resultado-relatorio">
                {Object.keys(estadiasAgrupadas).map(nomeAlojamento => (
                    <div key={nomeAlojamento} className="relatorio-grupo">
                        <h3>{nomeAlojamento}</h3>
                        <table className="relatorio-tabela">
                            <thead>
                                <tr>
                                    <th>Hóspede</th>
                                    <th>Lotação</th>
                                    <th>Entrada</th>
                                    <th>Saída</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estadiasAgrupadas[nomeAlojamento].map(e => (
                                    <tr key={e.id}>
                                        <td>{e.pessoa.nome}</td>
                                        <td>{e.pessoa.lotacao}</td>
                                        <td>{new Date(e.data_entrada).toLocaleDateString('pt-BR')}</td>
                                        <td>{e.data_saida ? new Date(e.data_saida).toLocaleDateString('pt-BR') : "Presente"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
                {!loading && estadias.length === 0 && <p>Nenhum resultado encontrado para os filtros selecionados.</p>}
            </div>
        </div>
    );
};
export default RelatoriosPage;