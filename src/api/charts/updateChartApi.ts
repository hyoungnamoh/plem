import apiRequest from '..';
import { ApiResponse, ErrorResponse, SuccessResponse } from '../../../types/axios';
import { AddPlanChart, PlanChart } from '../../../types/chart';

export const updateChartApi = async (chart: AddPlanChart) => {
  const response = await apiRequest.put<ApiResponse>(`/plan-charts/${chart.id}`, chart);
  return response.data;
};
