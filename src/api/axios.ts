import axios from 'axios';
import { auth } from '../lib/firebase';

// Determine API base URL based on environment
const getApiBaseUrl = (): string => {
    const configuredBase = import.meta.env.VITE_API_BASE_URL;

    if (configuredBase && configuredBase !== 'undefined') {
        return configuredBase;
    }

    if (import.meta.env.PROD) {
        return '/api';
    }

    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        return '/api';
    }

    return 'http://localhost:5000/api';
};

const api = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add Firebase ID token
api.interceptors.request.use(
    async (config) => {
        try {
            if (auth.currentUser) {
                const token = await auth.currentUser.getIdToken();
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting ID token:', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log meaningful error messages
        if (error.response) {
            console.error('API Error:', {
                status: error.response.status,
                message: error.response.data?.message || error.message,
                url: error.config?.url,
            });
        } else if (error.request) {
            console.error('No response from API:', {
                url: error.config?.url,
                message: 'Network error - no response from server',
            });
        } else {
            console.error('Request setup error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
