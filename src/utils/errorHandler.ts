import { Alert } from 'react-native';

export const errorHandler = (error: any) => {
  if (error.response?.data?.data) {
    Alert.alert(error.response.data.data);
    console.warn(error.response.data.data);
  } else {
    Alert.alert('알 수 없는 에러가 발생했습니다.');
    console.warn(error.response);
  }
};
