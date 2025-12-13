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
        const user = localStorage.getItem('user');
        if (user) {
            // Add any auth headers if needed in future
            config.headers['X-User'] = user;
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
            toast.error(message);

            // Handle unauthorized
            if (error.response.status === 401) {
                localStorage.removeItem('user');
                window.location.href = '/login';
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
