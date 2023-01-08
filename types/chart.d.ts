import { Omit } from 'react-native';
import { DaysOfWeek } from './date';

export type SubPlan = {
  id: number;
  PlanId: number;
  name: string;
  createdAt: string;
  updatedAt: null;
};

export type Plan = {
  id: number;
  PlanChartId: number;
  name: string;
  createdAt: string;
  updatedAt: null;
  subPlans: SubPlan[];
  notification: PlanNotification;
  startTime: Date;
  endTime: Date;
};

export type PlanNotification = 0 | 1 | 5 | 10 | 15 | 30 | 60;

export type PlanChart = {
  id: number;
  UserId: number;
  name: string;
  createdAt: string;
  updatedAt: null;
  plans: Plan[];
  repeats: Repeats;
  repeatDays: number[];
};

export type Repeats = (DaysOfWeek | 'off' | 'days' | number)[];

export type AddPlanChart = Omit<PlanChart, 'UserId' | 'createdAt' | 'id' | 'updatedAt' | 'plans'> & {
  plans: AddPlan[];
};

export type AddPlan = Omit<Plan, 'PlanChartId' | 'createdAt' | 'id' | 'updatedAt'>;
