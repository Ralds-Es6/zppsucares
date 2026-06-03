import axios from 'axios';

// Create an Axios instance with base configuration
const api = axios.create({
    // the base URL will automatically be prefixed to your requests
    // it uses the proxy configured in vite.config.ts during development
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// You can add interceptors here later (e.g., for JWT tokens)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
