import axiosClient from './axiosClient';

export const trackApi = {
  listByBusiness: (businessId) => axiosClient.get(`/tracks/business/${businessId}`),
  upload: (formData) => axiosClient.post('/tracks', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (trackId) => axiosClient.delete(`/tracks/${trackId}`),
  play: (trackId) => axiosClient.post(`/tracks/${trackId}/play`),
  toggleLike: (trackId) => axiosClient.post(`/tracks/${trackId}/like`),
};