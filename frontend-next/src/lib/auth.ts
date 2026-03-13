import api from './api';
import { AuthResponse } from '../types/fraud';

export const authService = {
    async register(username: string, password: string, bank_id?: string) {
        const response = await api.post<AuthResponse>('/auth/register', {
            username,
            password,
            bank_id,
        });
        this.setSession(response.data);
        return response.data;
    },

    async login(username: string, password: string) {
        // FastAPI normally uses x-www-form-urlencoded for OAuth2 password flow
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        const response = await api.post<AuthResponse>('/auth/login', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        this.setSession(response.data);
        return response.data;
    },

    logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    setSession(data: AuthResponse) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
    },

    getToken() {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    },

    getUser() {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) return JSON.parse(userStr);
        }
        return null;
    },

    isAuthenticated() {
        return !!this.getToken();
    },
};
