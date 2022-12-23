import { atom } from 'recoil';

export const isVerifiedEmailState = atom<boolean>({
  key: 'isVerifiedEmail',
  default: false,
});
