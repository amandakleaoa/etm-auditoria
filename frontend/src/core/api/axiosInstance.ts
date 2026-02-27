import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';

export const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});

// INTERCEPTOR DE REQUISIÇÃO: Anexa o Token JWT se ele existir no localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// INTERCEPTOR DE RESPOSTA: Trata os erros que voltam do Back-end
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            const detail = error.response.data?.detail || "Ocorreu um erro na requisição.";
            
            // Se o token estiver faltando ou expirado, limpa o localstorage e joga pro login
            if (status === 401 || status === 403) {
                localStorage.removeItem('jwt_token');
                window.location.href = '/login'; 
            }
            else if (status === 400) toast.error(detail);
            else if (status === 404) toast.error("Recurso não encontrado.");
            else if (status >= 500) toast.error("Erro interno do servidor.");
        } else {
            toast.error("Servidor indisponível. Verifique sua conexão com o Back-end.");
        }
        return Promise.reject(error);
    }
);