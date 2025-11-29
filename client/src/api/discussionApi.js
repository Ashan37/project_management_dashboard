import instance from './axiosConfig';

export const createDiscussion = (data) => instance.post('/discussions', data);
export const getDiscussionsByProject = (projectId, taskId) => 
  instance.get(`/discussions/project/${projectId}${taskId ? `?taskId=${taskId}` : ''}`);
export const getDiscussionsByTask = (taskId) => instance.get(`/discussions/task/${taskId}`);
export const updateDiscussion = (id, data) => instance.put(`/discussions/${id}`, data);
export const deleteDiscussion = (id) => instance.delete(`/discussions/${id}`);
export const addReaction = (id, emoji) => instance.post(`/discussions/${id}/reaction`, { emoji });
