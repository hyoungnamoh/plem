import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

const MAX_REQUESTS_COUNT = 10;
const INTERVAL_MS = 500;
let pendingRequest = 0;

const apiRequest = axios.create({
  baseURL: 'http://192.168.35.243:3030',
  validateStatus: (status) => status < 500,
});

apiRequest.defaults.timeout = 10000;

apiRequest.interceptors.request.use(
  async (config) => {
    console.info(config.url);
    const token = await EncryptedStorage.getItem('accessToken');
    if (config.headers && token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
    // return new Promise((resolve, reject) => {
    //   let interval = setInterval(() => {
    //     if (pendingRequest < MAX_REQUESTS_COUNT) {
    //       pendingRequest++;
    //       clearInterval(interval);
    //       resolve(config);
    //     }
    //   }, INTERVAL_MS);
    // });
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
        await EncryptedStorage.removeItem('accessToken');
        await EncryptedStorage.removeItem('refreshToken');
        return response;
      }
      try {
        const accessTokenResponse = await axios.get('http://192.168.35.243:3030/users/access-token', {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
        if (accessTokenResponse.status === 200 && accessTokenResponse.data?.data) {
          const newAccessToken = accessTokenResponse.data.data;
          await EncryptedStorage.setItem('accessToken', newAccessToken);
          if (!originalRequest.headers) {
            await EncryptedStorage.removeItem('accessToken');
            await EncryptedStorage.removeItem('refreshToken');
            return response;
          }
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
      } catch (error) {
        console.info('accessTokenResponse Error', error);
      }
    }

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
