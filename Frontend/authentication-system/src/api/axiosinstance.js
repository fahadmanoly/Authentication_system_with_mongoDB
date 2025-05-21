import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api'; 

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


let currentAccessToken = null;


export const setAuthToken = (token) => {
    currentAccessToken = token;
    console.log('Axios Instance: Auth token SET to:', token ? token.substring(0, 30) + '...' : 'null');
};


axiosInstance.interceptors.request.use(
    (config) => {
        console.log('--- Axios Interceptor Check ---');
        console.log('Current accessToken in axiosInstance:', currentAccessToken ? 'Present' : 'Not Found');
        console.log('Request URL:', config.url);

        if (currentAccessToken) {
            config.headers.Authorization = `Bearer ${currentAccessToken}`;
            console.log('Authorization header set to:', config.headers.Authorization.substring(0, 30) + '...');
        } else {
            console.log('Authorization header NOT set (accessToken missing).');
        }
        console.log('-----------------------------');
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
