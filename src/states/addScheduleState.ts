import dayjs from 'dayjs';
import { atom } from 'recoil';
import { AddSchedule } from 'types/calendar';

export const addScheduleDefault: AddSchedule = {
  name: '',
  category: 0,
  repeats: null,
  notification: null,
  startDate: dayjs().set('hour', 0).set('minute', 0).set('millisecond', 0).toISOString(),
  endDate: dayjs().set('hour', 1).set('minute', 0).set('millisecond', 0).toISOString(),
  repeatEndDate: null,
  // repeatDates: [],
  // customRepeat: { week: number; day: DaysOfWeekNum },
};

export const addScheduleState = atom<AddSchedule>({
  key: 'addSchedule',
  default: addScheduleDefault,
});
