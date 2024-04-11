import dayjs, { Dayjs } from 'dayjs';
import { atom } from 'recoil';

export const globalCurrentDateState = atom<Dayjs>({
  key: 'globalCurrentDate',
  default: dayjs(),
});
