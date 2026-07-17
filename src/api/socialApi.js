// src/api/socialApi.js
import axiosClient from './axiosClient';

export const followApi = {
  follow: (userId) => axiosClient.post(`/follow/${userId}`),
  unfollow: (userId) => axiosClient.delete(`/follow/${userId}`),
  getFollowers: (userId, params) => axiosClient.get(`/follow/${userId}/followers`, { params }),
  getFollowing: (userId, params) => axiosClient.get(`/follow/${userId}/following`, { params }),
  getSuggestions: () => axiosClient.get('/follow/suggestions'),
  checkStatus: (userId) => axiosClient.get(`/follow/${userId}/status`),
};

export const friendApi = {
  sendRequest: (userId) => axiosClient.post(`/friends/${userId}/request`),
  respond: (requestId, action) => axiosClient.patch(`/friends/requests/${requestId}`, { action }),
  cancel: (requestId) => axiosClient.delete(`/friends/requests/${requestId}`),
  unfriend: (userId) => axiosClient.delete(`/friends/${userId}`),
  getList: (userId, params) => axiosClient.get(`/friends/${userId}/list`, { params }),
  getPending: () => axiosClient.get('/friends/pending'),
  getOnline: () => axiosClient.get('/friends/online'),
};