import axios from 'axios';

// Base axios instance — all API calls in the app should use this,
// not the raw `axios` import, so interceptors apply everywhere.
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // required so the browser sends/receives httpOnly cookies
});

// ─────────────────────────────────────────────
// REQUEST INTERCEPTOR
// Nothing to attach manually — cookies are sent automatically.
// ─────────────────────────────────────────────
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────
// RESPONSE INTERCEPTOR
// Token refresh now happens automatically inside the backend's
// verifyToken middleware — if we still get a 401 here, it means
// BOTH the access token and refresh token are invalid/expired,
// so there's nothing left to do except log the user out.
// ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (!error.response) {
      console.error('Network error — is the backend server running?');
      return Promise.reject(error);
    }

    if (status === 401) {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;