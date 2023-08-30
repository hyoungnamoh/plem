import { ColorValue } from 'react-native';
import { atom } from 'recoil';
import { MAIN_COLOR } from '../constants/colors';

export const bottomSafeAreaState = atom<ColorValue>({
  key: 'bottomSafeArea',
  default: MAIN_COLOR,
});
