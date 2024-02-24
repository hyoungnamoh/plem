import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { useRecoilState } from 'recoil';
import { scheduleConfirmDateState } from 'states/scheduleConfirmDateState';

export const useScheduleConfirmDate = () => {
  const [scheduleConfirmDate, setScheduleConfirmDate] = useRecoilState(scheduleConfirmDateState);

  const getStorageScheduleConfirmDate = async () => {
    const storageScheduleConfirmDate = await AsyncStorage.getItem('scheduleConfirmDate');
    return storageScheduleConfirmDate;
  };

  const isConfirmedStorageSchedule = async () => {
    const storageScheduleConfirmDate = await getStorageScheduleConfirmDate();
    return storageScheduleConfirmDate === dayjs().format('YYYY-MM-DD');
  };

  const isConfirmedSchedule = () => {
    return scheduleConfirmDate === dayjs().format('YYYY-MM-DD');
  };

  const setStorageScheduleConfirmDate = async (date: string) => {
    await AsyncStorage.setItem('scheduleConfirmDate', date);
  };

  const updateScheduleConfirmDate = async (date: string) => {
    await setStorageScheduleConfirmDate(date);
    setScheduleConfirmDate(date);
  };

  const initSchedulConfirmDate = async () => {
    const storageScheduleConfirmDate = await getStorageScheduleConfirmDate();
    if (storageScheduleConfirmDate) {
      setScheduleConfirmDate(storageScheduleConfirmDate);
    }
  };

  return {
    setScheduleConfirmDate,
    getStorageScheduleConfirmDate,
    isConfirmedStorageSchedule,
    setStorageScheduleConfirmDate,
    updateScheduleConfirmDate,
    isConfirmedSchedule,
    initSchedulConfirmDate,
  };
};
