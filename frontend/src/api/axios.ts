import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    timeout: 10000,
});

// REQUEST → attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
