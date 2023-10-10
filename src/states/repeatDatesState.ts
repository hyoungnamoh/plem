import { atom } from 'recoil';

export const repeatDaysDefault: number[] = [];

export const repeatDatesState = atom<number[]>({
  key: 'repeatDates',
  default: repeatDaysDefault,
});
