import axiosClient from './axiosClient';

export const collectionApi = {
  listByBusiness: (businessId) => axiosClient.get(`/collections/business/${businessId}`),
  create: (payload) => axiosClient.post('/collections', payload),
  remove: (collectionId) => axiosClient.delete(`/collections/${collectionId}`),
};