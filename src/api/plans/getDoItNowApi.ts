import apiRequest from 'api';
import { ApiResponse } from 'types/axios';
import { Plan, SubPlan } from 'types/chart';

type DoItNowSubPlan = SubPlan & { isCompleted: boolean };

export type DoItNow = {
  nowPlan: (Plan & { subPlans: DoItNowSubPlan[] }) | null;
  nowPlanIndex: number;
};

export const getDoItNowApi = async () => {
  const response = await apiRequest.get<ApiResponse<DoItNow>>('/plans/doItNow');

  return response.data;
};
