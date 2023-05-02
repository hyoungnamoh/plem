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
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
};

// export type PlanTime = { hour: number; minute: number };

export type PlanNotification = null | 0 | 5 | 10 | 15 | 30 | 60; // 안함 | 당시 | 5분전 | 10분전 | 15분전 | 30분전 | 1시간전

export type PlanChart = {
  id: number;
  UserId: number;
  name: string;
  createdAt: string;
  updatedAt: null;
  removedAt: null;
  plans: Plan[];
  repeats: Repeats;
  repeatDays?: number[];
  orderNum: number;
};

export type Repeats = (null | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7)[]; // 안함 | 일 | 월 | 화 | 수 | 목 | 금 | 토 | 날짜 지정

// export type AddPlanChart = Omit<PlanChart, 'UserId' | 'createdAt' | 'id' | 'updatedAt' | 'orderNum'> & {
//   plans: AddPlan[];
// };
export type AddPlanChart = Pick<PlanChart, 'name' | 'repeats' | 'repeatDays'> &
  Partial<PlanChart> & { plans: AddPlan[] };

export type AddPlan = Omit<Plan, 'PlanChartId' | 'createdAt' | 'id' | 'updatedAt'> & {
  subPlans: AddSubPlan[];
};

export type AddSubPlan = Omit<SubPlan, 'PlanId' | 'createdAt' | 'id' | 'updatedAt'>;

export type PlanNotiOptionKor = '없음' | '이벤트 당시' | '5분 전' | '10분 전' | '15분 전' | '30분 전' | '1시간 전';

export type PlanNotiOptionItem = {
  key: PlanNotification;
  label: PlanNotiOptionKor;
};
