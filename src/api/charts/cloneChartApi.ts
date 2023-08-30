import apiRequest from '..';
import { ApiResponse } from '../../../types/axios';
import { PlanChart } from '../../../types/chart';

export type CloneChartBody = { id: number };

export const cloneChartApi = async (body: CloneChartBody) => {
  const response = await apiRequest.post<ApiResponse<PlanChart>>('/plan-charts/clone', body);
  return response.data;
};
