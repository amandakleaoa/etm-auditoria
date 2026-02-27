import { create } from 'zustand';
import { api } from '../api/axiosInstance';

interface AuthState {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (loginStr: string, passwordStr: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated:!!localStorage.getItem('jwt_token'), // true se já tiver token
    loading: false,
    error: null,

    login: async (loginStr, passwordStr) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('/auth/login', { 
                login: loginStr, 
                password: passwordStr 
            });
            
            // Pega o token retornado (verifique se a sua record no Java chama "token" ou "jwt")
            const token = response.data.token; 
            
            localStorage.setItem('jwt_token', token);
            set({ isAuthenticated: true, loading: false });
            
            // Recarrega a página para o React Router jogar para a Home
            window.location.href = '/'; 
        } catch (error) {
            set({ error: 'Usuário ou senha incorretos!', loading: false, isAuthenticated: false });
        }
    },

    logout: () => {
        localStorage.removeItem('jwt_token');
        set({ isAuthenticated: false });
        window.location.href = '/login';
    }
}));