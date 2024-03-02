import { Alert } from 'react-native';

export const errorHandler = (error: any) => {
  console.info('errorHandler', error);
  if (error.response?.data?.data) {
    Alert.alert(error.response.data.data);
    console.info(error.response.data);
  } else {
    Alert.alert('서버에 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.');
    console.info(error.response);
  }
};
