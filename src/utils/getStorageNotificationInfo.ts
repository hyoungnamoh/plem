import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationInfo } from 'states/notificationInfoState';

export const getStorageNotificationInfo = async () => {
  const asyncStorageItem = await AsyncStorage.getItem('notificationInfo');
  return asyncStorageItem ? (JSON.parse(asyncStorageItem) as NotificationInfo) : null;
};
