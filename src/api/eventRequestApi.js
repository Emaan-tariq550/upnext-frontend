import axiosClient from './axiosClient';

export const eventRequestApi = {
  listByBusiness: (businessId) => axiosClient.get(`/event-requests/business/${businessId}`),
  listMine: () => axiosClient.get('/event-requests/mine'),
  create: (payload) => axiosClient.post('/event-requests', payload),
  sendQuote: (requestId, payload) => axiosClient.patch(`/event-requests/${requestId}/quote`, payload),
  respondToQuote: (requestId, response) => axiosClient.patch(`/event-requests/${requestId}/respond`, { response }),
  confirm: (requestId) => axiosClient.post(`/event-requests/${requestId}/confirm`),
  cancel: (requestId) => axiosClient.delete(`/event-requests/${requestId}`),
};