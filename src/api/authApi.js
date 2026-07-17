import axiosClient from './axiosClient';

export const authApi = {
  register: (payload) => axiosClient.post('/auth/register', payload),
  verifyEmail: (payload) => axiosClient.post('/auth/verify-email', payload),
  resendOtp: (payload) => axiosClient.post('/auth/resend-otp', payload),
  login: (payload) => axiosClient.post('/auth/login', payload),
  logout: () => axiosClient.post('/auth/logout'),
  logoutAll: () => axiosClient.post('/auth/logout-all'),
  getMe: () => axiosClient.get('/auth/me'),
  forgotPassword: (payload) => axiosClient.post('/auth/forgot-password', payload),
  resetPassword: (payload) => axiosClient.post('/auth/reset-password', payload),
  changePassword: (payload) => axiosClient.post('/auth/change-password', payload),
  listSessions: () => axiosClient.get('/auth/sessions'),
  revokeSession: (sessionId) => axiosClient.delete(`/auth/sessions/${sessionId}`),
};