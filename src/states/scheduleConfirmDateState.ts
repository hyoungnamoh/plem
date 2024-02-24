import { atom } from 'recoil';

export const scheduleConfirmDateState = atom<null | string>({
  key: 'scheduleConfirmDate',
  default: null,
});
