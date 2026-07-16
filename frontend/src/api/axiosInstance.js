import axios from 'axios';

// Base axios instance — all API calls in the app should use this,
// not the raw `axios` import, so interceptors apply everywhere.
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─────────────────────────────────────────────
// REQUEST INTERCEPTOR — runs before every request is sent.
// Automatically attaches the JWT token, if one exists.
// ─────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────
// RESPONSE INTERCEPTOR — runs on every response before
// it reaches your .then()/.catch() or try/catch block.
// ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token missing, invalid, or expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    if (!error.response) {
      console.error('Network error — is the backend server running?');
    }

    return Promise.reject(error);
  }
);

export default api;
