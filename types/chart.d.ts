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

export type Repeats = (null | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7)[];

export type AddPlanChart = Omit<PlanChart, 'UserId' | 'createdAt' | 'id' | 'updatedAt' | 'plans'> & {
  plans: AddPlan[];
};

export type AddPlan = Omit<Plan, 'PlanChartId' | 'createdAt' | 'id' | 'updatedAt' | 'subPlans'> & {
  subPlans: AddSubPlan[];
};

export type AddSubPlan = Omit<SubPlan, 'PlanId' | 'createdAt' | 'id' | 'updatedAt'>;

export type PlanNotiOptionKor = '없음' | '이벤트 당시' | '5분 전' | '10분 전' | '15분 전' | '30분 전' | '1시간 전';

export type PlanNotiOptionItem = {
  key: PlanNotification;
  label: PlanNotiOptionKor;
};
