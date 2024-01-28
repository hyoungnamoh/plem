import { ApiResponse } from 'types/axios';
import apiRequest from 'api';

export type DeleteChartBody = { id: number };

export const deleteChartApi = async (body: DeleteChartBody) => {
  const response = await apiRequest.delete<ApiResponse>(`/plan-charts/${body.id}`);
  return response.data;
};
