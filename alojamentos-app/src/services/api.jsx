import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000', // O endereço da sua API Python
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;