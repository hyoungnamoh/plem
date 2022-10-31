import axios, { AxiosRequestHeaders } from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';

const apiRequest = axios.create({
  baseURL: Config.API_URL,
  validateStatus: (status) => status < 500,
});

apiRequest.defaults.timeout = 5000;

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
  (response) => {
    return response;
  },
  (error) => {
    console.info(error);
    return Promise.reject(error);
  }
);

export default apiRequest;
