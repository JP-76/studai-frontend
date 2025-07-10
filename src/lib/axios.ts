import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})


api.interceptors.request.use(config => {
    const token = Cookies.get('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api

export async function isAuthenticated() {
    const token = Cookies.get('auth_token');
    if (!token) return false;
    try {
        const response = await api.get('/v1/me/auth');
        return response.status === 200;
    } catch (error) {
        return false;
    }
}
