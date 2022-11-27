import { ColorValue } from 'react-native';
import { atom } from 'recoil';

export const bottomSafeAreaState = atom<ColorValue>({
  key: 'bottomSafeArea',
  default: '#F4F1E8',
});
