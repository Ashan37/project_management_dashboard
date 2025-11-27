import instance from './axiosConfig';

export const loginUser = async (data) => instance.post('/users/login', data);
export const registerUser = async (data) => instance.post('/users/register', data);