import { DAY_TO_MS } from 'constants/times';
import dayjs from 'dayjs';
import { atom } from 'recoil';

export const currentTimeDegreeState = atom<number>({
  key: 'currentTimeDegree',
  default: (dayjs().diff(dayjs().startOf('date')) / DAY_TO_MS) * 360,
});
