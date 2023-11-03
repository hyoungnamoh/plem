import apiRequest from '..';
import { ApiResponse } from '../../../types/axios';
import { PlanChart } from '../../../types/chart';

export const getTodayPlanChartApi = async () => {
  const response = await apiRequest.get<ApiResponse<PlanChart>>('/plan-charts/today');

  return response.data;
};
