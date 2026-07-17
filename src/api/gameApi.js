// src/api/gameApi.js — achievements, leaderboards, trending, history, search
import axiosClient from './axiosClient';

export const achievementApi = {
  getMine: () => axiosClient.get('/achievements/me'),
  getAll: () => axiosClient.get('/achievements'),
};

export const leaderboardApi = {
  getFame: (params) => axiosClient.get('/leaderboards/fame', { params }),
  getFollowers: (params) => axiosClient.get('/leaderboards/followers', { params }),
  getLevel: (params) => axiosClient.get('/leaderboards/level', { params }),
  getMyRank: (params) => axiosClient.get('/leaderboards/me/rank', { params }),
};

export const trendingApi = {
  getUsers: (params) => axiosClient.get('/trending/users', { params }),
  getBusinesses: (params) => axiosClient.get('/trending/businesses', { params }),
  getEvents: (params) => axiosClient.get('/trending/events', { params }),
};

export const historyApi = {
  getHallOfFame: (params) => axiosClient.get('/history/hall-of-fame', { params }),
  getTimeline: (params) => axiosClient.get('/history/timeline', { params }),
  getUserActivity: (userId, params) => axiosClient.get(`/history/activity/${userId}`, { params }),
};

export const searchApi = {
  search: (q, limit) => axiosClient.get('/search', { params: { q, limit } }),
  autocomplete: (q) => axiosClient.get('/search/autocomplete', { params: { q } }),
};