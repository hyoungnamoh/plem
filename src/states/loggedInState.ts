import { atom } from 'recoil';

export const loggedInState = atom<boolean>({
  key: 'loggedIn',
  default: false,
});
