import axiosClient from './axiosClient';

export const projectShowcaseApi = {
  listByBusiness: (businessId) => axiosClient.get(`/project-showcase/business/${businessId}`),
  create: (payload) => axiosClient.post('/project-showcase', payload),
  remove: (projectId) => axiosClient.delete(`/project-showcase/${projectId}`),
  toggleLike: (projectId) => axiosClient.post(`/project-showcase/${projectId}/like`),
};