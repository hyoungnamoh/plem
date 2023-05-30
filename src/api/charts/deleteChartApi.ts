import apiRequest from '..';
import { ApiResponse } from '../../../types/axios';

export type DeleteChartBody = { id: number };

export const deleteChartApi = async (body: DeleteChartBody) => {
  const response = await apiRequest.delete<ApiResponse>(`/plan-charts/${body.id}`);
  return response.data;
};
