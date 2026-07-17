import axiosClient from './axiosClient';

export const postApi = {
  create: (formData) => axiosClient.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getFeed: (params) => axiosClient.get('/posts/feed', { params }),
  getUserPosts: (userId) => axiosClient.get(`/posts/user/${userId}`),
  getBusinessPosts: (businessId) => axiosClient.get(`/posts/business/${businessId}`), // NAYA
  toggleLike: (postId) => axiosClient.post(`/posts/${postId}/like`),
  addComment: (postId, content) => axiosClient.post(`/posts/${postId}/comments`, { content }),
  getComments: (postId) => axiosClient.get(`/posts/${postId}/comments`),
  remove: (postId) => axiosClient.delete(`/posts/${postId}`),
};