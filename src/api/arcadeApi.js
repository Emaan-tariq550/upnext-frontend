import axiosClient from './axiosClient';

export const arcadeApi = {
  listByBusiness: (businessId) => axiosClient.get(`/arcade-games/business/${businessId}`),
  getChampions: (businessId) => axiosClient.get(`/arcade-games/business/${businessId}/champions`),
  getById: (gameId) => axiosClient.get(`/arcade-games/${gameId}`),
  create: (payload) => axiosClient.post('/arcade-games', payload),
  update: (gameId, payload) => axiosClient.patch(`/arcade-games/${gameId}`, payload),
  remove: (gameId) => axiosClient.delete(`/arcade-games/${gameId}`),
  submitScore: (gameId, score) => axiosClient.post(`/arcade-games/${gameId}/score`, { score }),
};