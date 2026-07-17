import axiosClient from './axiosClient';

export const jobApi = {
  listByBusiness: (businessId) => axiosClient.get(`/jobs/business/${businessId}`),
  getById: (jobId) => axiosClient.get(`/jobs/${jobId}`),
  create: (payload) => axiosClient.post('/jobs', payload),
  update: (jobId, payload) => axiosClient.patch(`/jobs/${jobId}`, payload),
  remove: (jobId) => axiosClient.delete(`/jobs/${jobId}`),
  apply: (jobId, payload) => axiosClient.post(`/jobs/${jobId}/apply`, payload),
  updateApplicationStatus: (jobId, userId, status) => axiosClient.patch(`/jobs/${jobId}/applications`, { userId, status }),
  listMyApplications: () => axiosClient.get('/jobs/mine/applications'),
};