import apiRequest from '..';
import { ApiResponse } from '../../../types/axios';
import { PlanChart } from '../../../types/chart';

export const getPlanChartList = async () => {
  const response = await apiRequest.get<ApiResponse<PlanChart[]>>('/plan-charts');

  return response.data;
};
