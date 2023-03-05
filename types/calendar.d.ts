import { DaysOfWeekNum } from './date';

export type Schedule = {
  id: number;
  name: string;
  category: string;
  createdAt: string;
  updatedAt: null;
  startTime: Date;
  endTime: Date;
  notification: ScheduleNotification;
  repeat: Repeat;
  repeatDays: number[];
  customRepeat: { unit: RepeatUnit; value: number[] } | RepeatSpecificCondition;
};

export type RepeatSpecificCondition = { week: number; day: DaysOfWeekNum };

export type ScheduleNotification = 0 | 1 | 5 | 10 | 15 | 30 | 60;

export type AddSchedule = Omit<Schedule, 'createdAt' | 'id' | 'updatedAt'>;

export type Category = 'daily' | 'birth' | 'promise' | 'banking';
export type CategoryKor = '일상' | '생일' | '약속' | '금융';

export type Repeat = null | 'every' | 'week' | '2weeks' | 'month' | 'year' | 'custom';
export type RepeatUnitKor = '일' | '주' | '개월' | '년';
export type RepeatUnit = 'day' | 'week' | 'month' | 'year';
