import apiRequest from '..';
import { ApiResponse } from '../../../types/axios';
import { PlanChart } from '../../../types/chart';

export const getPlanChartApi = async ({ id }: { id: string | number }) => {
  const response = await apiRequest.get<ApiResponse<PlanChart>>(`/plan-charts/${id}`);

  return response.data;
};
