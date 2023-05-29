import apiRequest from '..';
import { ApiResponse } from '../../../types/axios';

export type CloneChartBody = { id: number };

export const cloneChartApi = async (body: CloneChartBody) => {
  const response = await apiRequest.post<ApiResponse>('/plan-charts/clone', body);
  return response.data;
};
