import { atom } from 'recoil';

export const repeatDaysDefault: number[] = [];

export const repeatDaysState = atom<number[]>({
  key: 'repeatDays',
  default: repeatDaysDefault,
});
