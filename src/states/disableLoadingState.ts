import { atom } from 'recoil';

export const disableLoadingState = atom({
  key: 'disableLoading',
  default: false,
});
