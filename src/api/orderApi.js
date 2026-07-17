import axiosClient from './axiosClient';

export const orderApi = {
  place: (payload) => axiosClient.post('/orders', payload),
  updateStatus: (orderId, status) => axiosClient.patch(`/orders/${orderId}/status`, { status }),
  listByBusiness: (businessId, status) => axiosClient.get(`/orders/business/${businessId}`, { params: { status } }),
  listMine: () => axiosClient.get('/orders/mine'),
};