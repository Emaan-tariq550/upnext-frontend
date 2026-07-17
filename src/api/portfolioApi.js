import axiosClient from './axiosClient';

export const portfolioApi = {
  listByBusiness: (businessId, category) => axiosClient.get(`/portfolio/business/${businessId}`, { params: { category } }),
  add: (formData) => axiosClient.post('/portfolio', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (itemId) => axiosClient.delete(`/portfolio/${itemId}`),
  toggleLike: (itemId) => axiosClient.post(`/portfolio/${itemId}/like`),
};