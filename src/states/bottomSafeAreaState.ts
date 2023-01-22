import { ColorValue } from 'react-native';
import { atom } from 'recoil';
import { MAIN_COLOR } from '../constants/color';

export const bottomSafeAreaState = atom<ColorValue>({
  key: 'bottomSafeArea',
  default: MAIN_COLOR,
});
