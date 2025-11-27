import instance from "./axiosConfig";

export const getProjects = () => instance.get("/projects");
export const createProject = (data) => instance.post("/projects", data);
export const getProjectById = (id) => instance.get(`/projects/${id}`);
export const updateProject = (id, data) => instance.put(`/projects/${id}`, data);
export const deleteProject = (id) => instance.delete(`/projects/${id}`);
export const assignTeam = (id, team) =>
  instance.put(`/projects/${id}/assign-team`, { team });
export const getMyProjects = () => instance.get("/projects/my-projects");
