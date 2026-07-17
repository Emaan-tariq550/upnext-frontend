import axiosClient from './axiosClient';

export const servicePackageApi = {
  listByBusiness: (businessId) => axiosClient.get(`/service-packages/business/${businessId}`),
  create: (payload) => axiosClient.post('/service-packages', payload),
  update: (packageId, payload) => axiosClient.patch(`/service-packages/${packageId}`, payload),
  remove: (packageId) => axiosClient.delete(`/service-packages/${packageId}`),
};