import { Dayjs } from 'dayjs';
import { atom } from 'recoil';

export const selectedCalendarDateState = atom<Dayjs | null>({
  key: 'selectedCalendarDate',
  default: null,
});
