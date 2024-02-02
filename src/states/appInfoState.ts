import { atom } from 'recoil';

type AppInfo = {
  currentVersion: string;
  latestVersion: string;
};

export const appInfoState = atom<AppInfo>({
  key: 'appInfo',
  default: {
    currentVersion: '1.0.0',
    latestVersion: '1.0.0',
  },
});
