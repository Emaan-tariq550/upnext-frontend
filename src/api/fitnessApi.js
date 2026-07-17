import axiosClient from './axiosClient';

export const fitnessApi = {
  listByBusiness: (businessId) => axiosClient.get(`/fitness-classes/business/${businessId}`),
  getById: (classId) => axiosClient.get(`/fitness-classes/${classId}`),
  create: (payload) => axiosClient.post('/fitness-classes', payload),
  update: (classId, payload) => axiosClient.patch(`/fitness-classes/${classId}`, payload),
  cancel: (classId) => axiosClient.delete(`/fitness-classes/${classId}`),
  book: (classId) => axiosClient.post(`/fitness-classes/${classId}/book`),
  cancelBooking: (classId) => axiosClient.post(`/fitness-classes/${classId}/cancel-booking`),
  checkIn: (classId, userId) => axiosClient.post(`/fitness-classes/${classId}/check-in`, { userId }),
  listMyBookings: () => axiosClient.get('/fitness-classes/mine/bookings'),
};