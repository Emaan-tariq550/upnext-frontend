import axiosClient from './axiosClient';

export const photoBookingApi = {
  listByBusiness: (businessId) => axiosClient.get(`/photo-bookings/business/${businessId}`),
  listMine: () => axiosClient.get('/photo-bookings/mine'),
  request: (payload) => axiosClient.post('/photo-bookings', payload),
  respond: (bookingId, response) => axiosClient.patch(`/photo-bookings/${bookingId}/respond`, { response }),
  cancel: (bookingId) => axiosClient.delete(`/photo-bookings/${bookingId}`),
};