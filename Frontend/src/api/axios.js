import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:7000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Get JWT token from localStorage
        const token = localStorage.getItem('authToken');

        if (token) {
            // Add Authorization header with Bearer token
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const message = error.response.data?.error || error.response.data?.message || 'An error occurred';

            // Don't show toast for login errors (handled in Login component)
            if (!error.config.url?.includes('/auth/login')) {
                toast.error(message);
            }

            // Handle unauthorized or token expiration
            if (error.response.status === 401 || error.response.status === 403) {
                // Clear auth data
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');

                // Redirect to login if not already there
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        } else if (error.request) {
            toast.error('No response from server. Please check your connection.');
        } else {
            toast.error('Request failed. Please try again.');
        }
        return Promise.reject(error);
    }
);

export default api;
