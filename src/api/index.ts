import axios, { AxiosRequestHeaders } from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';

const apiRequest = axios.create({
  baseURL: 'http://192.168.219.100:3030',
  validateStatus: (status) => status < 500,
});

apiRequest.defaults.timeout = 100000;

apiRequest.interceptors.request.use(
  async (config) => {
    const token = await EncryptedStorage.getItem('accessToken');
    if (config.headers && token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.info(error);
    return Promise.reject(error);
  }
);

apiRequest.interceptors.response.use(
  async (response) => {
    if (response.data.newAccessToken) {
      await EncryptedStorage.setItem('accessToken', response.data.newAccessToken);
    }
    return response;
  },
  (error) => {
    console.info(error);
    return Promise.reject(error);
  }
);

export default apiRequest;
