import { atom } from 'recoil';
import type { PaletteMap } from '../pages/CalendarPage/Days/Day/ScheduleList';
// const paletteFF6550: number = require('../assets/images/palette_ff6550.png');
// const paletteFFC700: number = require('../assets/images/palette_ffc700.png');
// const palette22DA81: number = require('../assets/images/palette_22da81.png');
// const palette4569FF: number = require('../assets/images/palette_4659ff.png');

export type Category = { label: string; image: keyof typeof PaletteMap; value: number };

export const DEFAULT_CATEGORY_LIST: Category[] = [
  {
    label: '일상',
    image: 'palette_ff6550_8x8',
    value: 0,
  },
  {
    label: '생일',
    image: 'palette_ffc700_8x8',
    value: 1,
  },
  {
    label: '약속',
    image: 'palette_22da81_8x8',
    value: 2,
  },
  {
    label: '금융',
    image: 'palette_4569ff_8x8',
    value: 3,
  },
];

export const categoryListState = atom<Category[]>({
  key: 'categoryListState',
  default: DEFAULT_CATEGORY_LIST,
});
