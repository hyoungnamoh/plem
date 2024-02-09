import { Alert } from 'react-native';

export const errorHandler = (error: any) => {
  console.info('errorHandler', error);
  if (error.response?.data?.data) {
    Alert.alert(error.response.data.data);
    console.info(error.response.data);
  } else {
    Alert.alert('알 수 없는 에러가 발생했습니다.');
    console.info(error.response);
  }
};
