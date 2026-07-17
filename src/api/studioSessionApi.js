import axiosClient from './axiosClient';

export const studioSessionApi = {
  listByBusiness: (businessId) => axiosClient.get(`/studio-sessions/business/${businessId}`),
  listMine: () => axiosClient.get('/studio-sessions/mine'),
  request: (payload) => axiosClient.post('/studio-sessions', payload),
  respond: (sessionId, response) => axiosClient.patch(`/studio-sessions/${sessionId}/respond`, { response }),
  cancel: (sessionId) => axiosClient.delete(`/studio-sessions/${sessionId}`),
};