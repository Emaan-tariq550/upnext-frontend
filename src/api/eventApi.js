// src/api/eventApi.js
import axiosClient from './axiosClient';

export const eventApi = {
  list: (params) => axiosClient.get('/events', { params }),
  getById: (id) => axiosClient.get(`/events/${id}`),
  create: (payload) => axiosClient.post('/events', payload),
  
  // 🚀 Added: Update Event Route
  update: (id, payload) => axiosClient.patch(`/events/${id}`, payload),

  checkIn: (id) => axiosClient.post(`/events/${id}/check-in`),
  rate: (id, payload) => axiosClient.post(`/events/${id}/rate`, payload),
  respond: (id, response) => axiosClient.post(`/events/${id}/respond`, { response }),
  mine: () => axiosClient.get('/events/me/mine'),
  leaderboard: (params) => axiosClient.get('/events/leaderboard', { params }),
};