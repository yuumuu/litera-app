import { writable } from 'svelte/store';
import api from './api';

export interface User {
    id: number;
    name: string;
    email?: string;
    role: 'admin' | 'teacher' | 'student' | 'guest';
    xp?: number;
    level?: number;
}

function createAuthStore() {
    const { subscribe, set, update } = writable<{
        user: User | null;
        isAuthenticated: boolean;
        loading: boolean;
    }>({
        user: null,
        isAuthenticated: false,
        loading: true
    });

    return {
        subscribe,
        init: async () => {
            try {
                const response = await api.get('/user');
                set({ user: response.data, isAuthenticated: true, loading: false });
            } catch (error) {
                set({ user: null, isAuthenticated: false, loading: false });
            }
        },
        login: async (credentials: any) => {
            await api.get('/csrf-cookie');
            const response = await api.post('/login', credentials);
            set({ user: response.data.user, isAuthenticated: true, loading: false });
            return response.data;
        },
        logout: async () => {
            await api.post('/logout');
            set({ user: null, isAuthenticated: false, loading: false });
        },
        guestLogin: async (code: string, name: string) => {
            const response = await api.post('/access/validate', { code, name });
            // The backend returns a guest session/token
            set({
                user: { id: 0, name, role: 'guest' },
                isAuthenticated: true,
                loading: false
            });
            return response.data;
        }
    };
}

export const auth = createAuthStore();
