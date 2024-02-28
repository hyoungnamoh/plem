import { atom } from 'recoil';

export const keyboardHeightState = atom<number>({
  key: 'keyboardHeight',
  default: 0,
});
