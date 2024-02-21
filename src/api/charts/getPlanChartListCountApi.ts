import { ApiResponse } from 'types/axios';
import apiRequest from 'api';

export type GetPlanChartListCountResponse = {
  count: number;
};

export const getPlanChartListCountApi = async () => {
  const response = await apiRequest.get<ApiResponse<GetPlanChartListCountResponse>>('/plan-charts/count');

  return response.data;
};
