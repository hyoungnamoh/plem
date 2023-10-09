import { DaysOfWeekNum } from './date';

export type Schedule = {
  id: number;
  name: string;
  category: number;
  startDate: string;
  endDate: string;
  notification: ScheduleNotification;
  repeats: Repeat;
  createdAt: Date;
  updatedAt: Date | null;
  removedAt: Date | null;
  // customRepeat: { unit: RepeatUnit; value: number[] } | RepeatSpecificCondition;
};

export type RepeatSpecificCondition = { week: number; day: DaysOfWeekNum };

export type ScheduleNotification = null | '0' | '5' | '10' | '15' | '30' | '60'; // asyncstorage에 저장하면서 number -> string으로 변경

export type AddSchedule = Omit<Schedule, 'createdAt' | 'id' | 'updatedAt' | 'removedAt'>;

export type CategoryId = number;

export type Repeat = null | 'every' | 'week' | '2weeks' | 'month' | 'year' | 'custom';
export type RepeatUnitKor = '일' | '주' | '개월' | '년';
export type RepeatUnit = 'day' | 'week' | 'month' | 'year';
