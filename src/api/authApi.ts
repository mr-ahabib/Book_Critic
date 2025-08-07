// src/api/authApi.ts
import API from './axiosInstance';

export const login = (data: { email: string; password: string }) =>
  API.post('/login', data);

export const signup = (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) => API.post('/signup', data);
