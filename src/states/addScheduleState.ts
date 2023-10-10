import dayjs from 'dayjs';
import { atom } from 'recoil';
import { AddSchedule } from '../../types/calendar';

export const addScheduleDefault: AddSchedule = {
  name: '',
  category: 0,
  repeats: null,
  notification: null,
  startDate: dayjs().toISOString(),
  endDate: dayjs().toISOString(),
  // repeatDates: [],
  // customRepeat: { week: number; day: DaysOfWeekNum },
};

export const addScheduleState = atom<AddSchedule>({
  key: 'addSchedule',
  default: addScheduleDefault,
});
