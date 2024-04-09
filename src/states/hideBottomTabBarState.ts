import { atom } from 'recoil';

export const hideBottomTabBarState = atom<boolean>({
  key: 'hideBottomTabBar',
  default: false,
});
