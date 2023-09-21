import dayjs from 'dayjs';
import { atom } from 'recoil';
import { AddSchedule } from '../../types/calendar';

export const addScheduleDefault: AddSchedule = {
  name: '',
  category: 'daily',
  repeat: null,
  repeatDays: [],
  notification: 0,
  startTime: dayjs('2023-01-08 00:00'),
  endTime: dayjs('2023-01-08 00:10'), // FIXME
  // customRepeat: { week: number; day: DaysOfWeekNum },
};

export const addScheduleState = atom<AddSchedule>({
  key: 'addSchedule',
  default: addScheduleDefault,
});
