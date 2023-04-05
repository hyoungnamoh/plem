import dayjs from 'dayjs';
import { atom } from 'recoil';
import { AddPlan } from '../../types/chart';

export const addPlanDefault: AddPlan = {
  name: '',
  subPlans: [],
  notification: null,
  startHour: 0,
  startMin: 0,
  endHour: 1,
  endMin: 0,
  // startTime: { hour: 0, minute: 0 },
  // endTime: { hour: 1, minute: 0 },
};

export const addPlanState = atom<AddPlan>({
  key: 'addPlan',
  default: addPlanDefault,
});
