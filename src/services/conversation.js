import { privateRequest } from '../axios';

export const createConversation = async (userId, members, isGroup) =>
  await privateRequest.post(
    `conversations/${userId}/create`, { theme: 'default', members },
    { params: { group: isGroup } },
  );

export const getConversation = async (userId, isGroup) =>
  await privateRequest.get(`conversations/${userId}/get`, null, {
    params: {
      isGroup,
    },
  });

export const addNewMember = async (conversationId, newMember) =>
  await privateRequest.put(`conversations/${conversationId}/add-member`, null, {
    newMember,
  });

export const deleteConversation = async (conversationId) =>
  await privateRequest.delete(`conversations/${conversationId}/delete`);
