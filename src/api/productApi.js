import axiosClient from './axiosClient';

export const productApi = {
  listByBusiness: (businessId, category) => axiosClient.get(`/products/business/${businessId}`, { params: { category } }),
  create: (formData) => axiosClient.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (productId, payload) => axiosClient.patch(`/products/${productId}`, payload),
  remove: (productId) => axiosClient.delete(`/products/${productId}`),
  toggleWishlist: (productId) => axiosClient.post(`/products/${productId}/wishlist`),
  getMyWishlist: () => axiosClient.get('/products/wishlist/mine'),
};