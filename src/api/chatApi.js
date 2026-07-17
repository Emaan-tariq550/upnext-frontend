import axiosClient from './axiosClient';

export const chatApi = {
  getConversations: (params) => axiosClient.get('/chat/conversations', { params }),
  startPrivate: (targetUserId) => axiosClient.post('/chat/conversations/private', { targetUserId }),
  createGroup: (payload) => axiosClient.post('/chat/conversations/group', payload),
  getMessages: (conversationId, params) => axiosClient.get(`/chat/conversations/${conversationId}/messages`, { params }),
  editMessage: (messageId, content) => axiosClient.patch(`/chat/messages/${messageId}`, { content }),
  deleteMessage: (messageId, forEveryone) => axiosClient.delete(`/chat/messages/${messageId}?forEveryone=${forEveryone}`),
  sendMedia: (conversationId, formData) =>
    axiosClient.post(`/chat/conversations/${conversationId}/messages/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};