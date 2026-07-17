import axiosClient from './axiosClient';

export const tournamentApi = {
  create: (payload) => axiosClient.post('/tournaments', payload),
  getById: (tournamentId) => axiosClient.get(`/tournaments/${tournamentId}`),
  listByBusiness: (businessId) => axiosClient.get(`/tournaments/business/${businessId}`),
  join: (tournamentId) => axiosClient.post(`/tournaments/${tournamentId}/join`),
  leave: (tournamentId) => axiosClient.post(`/tournaments/${tournamentId}/leave`),
  start: (tournamentId) => axiosClient.post(`/tournaments/${tournamentId}/start`),
  submitScore: (tournamentId, userId, score) =>
    axiosClient.post(`/tournaments/${tournamentId}/score`, { userId, score }),
  complete: (tournamentId) => axiosClient.post(`/tournaments/${tournamentId}/complete`),
  getLeaderboard: (tournamentId) => axiosClient.get(`/tournaments/${tournamentId}/leaderboard`),
};