import { atom } from 'recoil';

export const lastAccessDateState = atom<null | string>({
  key: 'lastAccessDate',
  default: null,
});
