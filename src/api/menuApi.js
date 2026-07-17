import axiosClient from './axiosClient';

export const menuApi = {
  listByBusiness: (businessId) => axiosClient.get(`/menu/business/${businessId}`),
  create: (payload) => axiosClient.post('/menu', payload),
  update: (itemId, payload) => axiosClient.patch(`/menu/${itemId}`, payload),
  remove: (itemId) => axiosClient.delete(`/menu/${itemId}`),
};