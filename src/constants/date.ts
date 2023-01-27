import { DaysOfWeek, DaysOfWeekKor, DaysOfWeekKorFull, DaysOfWeekNum } from '../../types/date';

export const DAYS_OF_WEEK: { key: DaysOfWeek; value: DaysOfWeekKor }[] = [
  { key: 'sun', value: '일' },
  { key: 'mon', value: '월' },
  { key: 'tue', value: '화' },
  { key: 'wed', value: '수' },
  { key: 'thu', value: '목' },
  { key: 'fri', value: '금' },
  { key: 'sat', value: '토' },
];

export const NUMBER_TO_DAY_KOR: Record<DaysOfWeekNum, DaysOfWeekKorFull> = {
  0: '일요일',
  1: '월요일',
  2: '화요일',
  3: '수요일',
  4: '목요일',
  5: '금요일',
  6: '토요일',
};
