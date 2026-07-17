import axiosClient from './axiosClient';

export const userApi = {
  getProfile: (userId) => axiosClient.get(`/users/${userId}`),
  updateProfile: (payload) => axiosClient.patch('/users/me', payload),
  
  uploadAvatar: (formData) =>
    axiosClient.post('/uploads/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  uploadCover: (formData) =>
    axiosClient.post('/uploads/cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};