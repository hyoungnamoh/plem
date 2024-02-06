import { atom } from 'recoil';

export type NotificationInfo = {
  plan: boolean;
  notice: boolean;
};

export const notificationInfoState = atom<NotificationInfo>({
  key: 'notificationInfo',
  default: {
    plan: false,
    notice: false,
  },
});
