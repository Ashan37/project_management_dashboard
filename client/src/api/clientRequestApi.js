import instance from './axiosConfig';

export const createClientRequest = (data) => instance.post('/client-requests', data);
export const getMyClientRequests = () => instance.get('/client-requests/my-requests');
export const getAllClientRequests = () => instance.get('/client-requests');
export const getClientRequestsByProject = (projectId) => instance.get(`/client-requests/project/${projectId}`);
export const updateClientRequestStatus = (id, data) => instance.put(`/client-requests/${id}`, data);
export const deleteClientRequest = (id) => instance.delete(`/client-requests/${id}`);
