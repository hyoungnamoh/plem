import { atom } from 'recoil';

export const bottomNochHeightState = atom<number>({
  key: 'bottomNochHeight',
  default: 0,
});
