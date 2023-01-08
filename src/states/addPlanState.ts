import dayjs from 'dayjs';
import { atom } from 'recoil';
import { AddPlan } from '../../types/chart';

export const addPlanDefault: AddPlan = {
  name: '',
  subPlans: [],
  notification: 0,
  startTime: dayjs('2023-01-08 00:00').toDate(),
  endTime: dayjs('2023-01-08 00:10').toDate(),
};

export const addPlanState = atom<AddPlan>({
  key: 'addPlan',
  default: addPlanDefault,
});
