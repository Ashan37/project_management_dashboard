// src/api/taskApi.js
import axios from "./axiosConfig"; // uses your axiosConfig that attaches token

export const getTasksByProject = (projectId) =>
  axios.get(`/tasks/project/${projectId}`);

export const createTask = (data) =>
  axios.post("/tasks", data);

export const updateTask = (id, data) =>
  axios.put(`/tasks/${id}`, data);

export const updateTaskStatus = (id, status) =>
  axios.put(`/tasks/${id}/status`, { status });

export const addSubtask = (id, subtask) =>
  axios.post(`/tasks/${id}/subtask`, subtask);

export const toggleSubtask = (id, subtaskId) =>
  axios.put(`/tasks/${id}/subtask/${subtaskId}/toggle`);

export const addComment = (id, message) =>
  axios.post(`/tasks/${id}/comment`, { message });

// example attachment upload: assumes backend /upload endpoint or use existing endpoint
export const uploadAttachment = (formData) =>
  axios.post(`/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
