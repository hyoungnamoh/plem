import { atom } from 'recoil';
import { AddPlanChart } from '../../types/chart';

export const addPlanChartDefault: AddPlanChart = {
  name: '',
  plans: [],
  repeats: [null],
  repeatDays: [],
};

export const addPlanChartState = atom<AddPlanChart>({
  key: 'addPlanChart',
  default: addPlanChartDefault,
});
