import apiRequest from '..';
import { ApiResponse, ErrorResponse, SuccessResponse } from '../../../types/axios';

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
};

export type PlanChart = {
  id: number;
  UserId: number;
  name: string;
  createdAt: string;
  updatedAt: null;
  plans: Plan[];
};

export const getPlanChart = async ({ id }: { id: string | number }) => {
  const response = await apiRequest.get<ApiResponse<PlanChart>>(`/plan-charts/${id}`);

  return response.data;
};
