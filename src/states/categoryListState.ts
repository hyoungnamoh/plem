import { atom } from 'recoil';

const paletteFF6550: number = require('../assets/images/palette_ff6550.png');
const palette22DA81: number = require('../assets/images/palette_22da81.png');
const palette4569FF: number = require('../assets/images/palette_4659ff.png');
const paletteFFC700: number = require('../assets/images/palette_ffc700.png');

export const DEFAULT_CATEGORY_LIST = [
  {
    label: '일상',
    image: paletteFF6550,
    value: 0,
  },
  {
    label: '생일',
    image: paletteFFC700,
    value: 1,
  },
  {
    label: '약속',
    image: palette22DA81,
    value: 2,
  },
  {
    label: '금융',
    image: palette4569FF,
    value: 3,
  },
];

export const categoryListState = atom<
  {
    label: string;
    image: number;
    value: number;
  }[]
>({
  key: 'categoryListState',
  default: DEFAULT_CATEGORY_LIST,
});
