import axiosClient from './axiosClient';

export const caseStudyApi = {
  listByBusiness: (businessId) => axiosClient.get(`/case-studies/business/${businessId}`),
  create: (payload) => axiosClient.post('/case-studies', payload),
  remove: (caseStudyId) => axiosClient.delete(`/case-studies/${caseStudyId}`),
  toggleLike: (caseStudyId) => axiosClient.post(`/case-studies/${caseStudyId}/like`),
};