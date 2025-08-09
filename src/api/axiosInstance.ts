import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'http://192.168.0.109:8080',
  timeout: 15000,
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token && config.headers) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  if (config.data instanceof FormData && config.headers) {
    config.headers.set('Accept', 'application/json');
    config.headers.set('Content-Type', 'multipart/form-data');
  }

  return config;
});


export default API;