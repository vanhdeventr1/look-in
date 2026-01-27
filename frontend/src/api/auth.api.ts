import api from './axios';

export const login = (payload: {
    username: string;
    password: string;
}) => {
    return api.post('/auth/login', payload);
};

export const getProfile = () => {
    return api.get('/auth/profile');
};


export const register = (payload: {
    username: string;
    password: string;
    name: string;
    email: string;
}) => {
    return api.post('/auth/register', payload);
};