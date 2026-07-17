// src/api/businessApi.js
import axiosClient from './axiosClient';

export const businessApi = {
  list: (params) => axiosClient.get('/businesses', { params }),
  getById: (id) => axiosClient.get(`/businesses/${id}`),
  create: (payload) => axiosClient.post('/businesses', payload),
  update: (id, payload) => axiosClient.patch(`/businesses/${id}`, payload),
  remove: (id) => axiosClient.delete(`/businesses/${id}`),
  follow: (id) => axiosClient.post(`/businesses/${id}/follow`),
  unfollow: (id) => axiosClient.delete(`/businesses/${id}/follow`),
  addReview: (id, payload) => axiosClient.post(`/businesses/${id}/reviews`, payload),
  
  // 🚀 Added: Revenue entry injection method
  addRevenue: (id, amount) => axiosClient.post(`/businesses/${id}/revenue`, { amount }),

  leaderboard: (params) => axiosClient.get('/businesses/leaderboard', { params }),
  mine: () => axiosClient.get('/businesses/me/mine'),
};