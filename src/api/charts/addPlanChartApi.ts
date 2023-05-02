import apiRequest from '..';
import { ApiResponse, ErrorResponse, SuccessResponse } from '../../../types/axios';
import { AddPlanChart } from '../../../types/chart';

export const addPlanChartApi = async (chart: AddPlanChart) => {
  const response = await apiRequest.post<ApiResponse>('/plan-charts', chart);
  return response.data;
};
