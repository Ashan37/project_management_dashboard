// src/api/taskApi.js
import instance from "./axiosConfig"; // uses your axiosConfig that attaches token

export const getTasksByProject = (projectId) =>
  instance.get(`/tasks/project/${projectId}`);

export const createTask = (data) =>
  instance.post("/tasks", data);

export const updateTask = (id, data) =>
  instance.put(`/tasks/${id}`, data);

export const updateTaskStatus = (id, status) =>
  instance.put(`/tasks/${id}/status`, { status });

export const addSubtask = (id, subtask) =>
  instance.post(`/tasks/${id}/subtask`, subtask);

export const toggleSubtask = (id, subtaskId) =>
  instance.put(`/tasks/${id}/subtask/${subtaskId}/toggle`);

export const addComment = (id, message) =>
  instance.post(`/tasks/${id}/comment`, { message });

export const deleteTask = (id) =>
  instance.delete(`/tasks/${id}`);

// Get all tasks for the current user
export const getMyTasks = () =>
  instance.get("/tasks/my-tasks");

// File upload
export const uploadAttachment = (formData) =>
  instance.post(`/uploads`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
