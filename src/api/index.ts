import axios from 'axios';
import Config from 'react-native-config';

const apiRequest = axios.create({
  baseURL: Config.API_URL,
  validateStatus: (status) => status < 500,
});

apiRequest.defaults.timeout = 5000;

apiRequest.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.info(error);
    return Promise.reject(error);
  }
);

apiRequest.interceptors.response.use(
  (response) => {
    const res = response.data;
    return res;
  },
  (error) => {
    console.info(error);
    return Promise.reject(error);
  }
);

export default apiRequest;
