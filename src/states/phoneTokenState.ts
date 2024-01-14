import { atom } from 'recoil';

export const phoneTokenState = atom<string>({
  key: 'phoneToken',
  default: '',
});
