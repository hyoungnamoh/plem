import { ReactNode } from 'react';
import { atom } from 'recoil';

export const globalToastState = atom({
  key: 'globalToast',
  default: null as {
    text: ReactNode;
    duration?: number;
    callback?: () => void;
  } | null,
});
