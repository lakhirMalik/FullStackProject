import api from './axiosInstance';

export const registerUser = async (name, email, password) => {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });

  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
  }

  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await api.post('/auth/forget-password', { email });
  return res.data;
};

export const resetPassword = async (token, newPassword) => {
  const res = await api.post(`/auth/reset-password/${token}`, { newPassword });
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Protected call — token attached automatically by the request interceptor
export const getProfile = async () => {
  const res = await api.get('/auth/profile');
  return res.data;
};
