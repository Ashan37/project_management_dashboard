import instance from "./axiosConfig";

export const getClients = () => instance.get("/clients");
export const getClientById = (id) => instance.get(`/clients/${id}`);
export const createClient = (data) => instance.post("/clients", data);
export const updateClient = (id, data) => instance.put(`/clients/${id}`, data);
export const deleteClient = (id) => instance.delete(`/clients/${id}`);
