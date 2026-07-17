import axiosClient from './axiosClient';

export const newsApi = {
  getFeed: (params) => axiosClient.get('/news/feed', { params }),
  listByBusiness: (businessId, category) => axiosClient.get(`/news/business/${businessId}`, { params: { category } }),
  getById: (articleId) => axiosClient.get(`/news/${articleId}`),
  create: (payload) => axiosClient.post('/news', payload),
  update: (articleId, payload) => axiosClient.patch(`/news/${articleId}`, payload),
  remove: (articleId) => axiosClient.delete(`/news/${articleId}`),
  toggleLike: (articleId) => axiosClient.post(`/news/${articleId}/like`),
  addComment: (articleId, content) => axiosClient.post(`/news/${articleId}/comments`, { content }),
  getComments: (articleId) => axiosClient.get(`/news/${articleId}/comments`),
};