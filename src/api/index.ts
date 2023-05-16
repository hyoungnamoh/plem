import axios, { AxiosRequestHeaders } from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';

const MAX_REQUESTS_COUNT = 20;
const INTERVAL_MS = 500;
let pendingRequest = 0;

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

    return new Promise((resolve, reject) => {
      let interval = setInterval(() => {
        if (pendingRequest < MAX_REQUESTS_COUNT) {
          pendingRequest++;
          clearInterval(interval);
          resolve(config);
        }
      }, INTERVAL_MS);
    });
  },
  (error) => {
    console.info(error);
    return Promise.reject(error);
  }
);

apiRequest.interceptors.response.use(
  async (response) => {
    const originalRequest = response.config;
    if (response.status === 410) {
      const refreshToken = await EncryptedStorage.getItem('refreshToken');
      if (!refreshToken) {
        return response;
      }
      try {
        const accessTokenResponse = await axios.get('http://192.168.219.100:3030/users/access-token', {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
        if (accessTokenResponse.status === 200 && accessTokenResponse.data?.data) {
          const newAccessToken = accessTokenResponse.data.data;
          await EncryptedStorage.setItem('accessToken', newAccessToken);
          if (!originalRequest.headers) {
            return response;
          }
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
      } catch (error) {
        console.log('accessTokenResponse Error', error);
      }
    }
    //TODO: api 호출하는 쪽에서 할지?
    if (response.status === 411 || response.status === 420) {
      await EncryptedStorage.removeItem('accessToken');
      await EncryptedStorage.removeItem('refreshToken');
      return response;
    }
    return response;
  },
  (error) => {
    console.info(error);
    return Promise.reject(error);
  }
);

export default apiRequest;
