import { atom } from 'recoil';
import { PaletteMap } from 'components/PaletteSvg/PaletteSvg';

export type Category = { label: string; color: keyof PaletteMap; value: number };

export const DEFAULT_CATEGORY_LIST: Category[] = [
  {
    label: '일상',
    color: 'red',
    value: 0,
  },
  {
    label: '생일',
    color: 'yellow',
    value: 1,
  },
  {
    label: '약속',
    color: 'green',
    value: 2,
  },
  {
    label: '금융',
    color: 'blue',
    value: 3,
  },
];

export const categoryListState = atom<Category[]>({
  key: 'categoryListState',
  default: DEFAULT_CATEGORY_LIST,
});
