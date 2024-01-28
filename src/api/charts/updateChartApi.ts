import { ApiResponse } from 'types/axios';
import apiRequest from 'api';
import { AddPlanChart } from 'types/chart';

export type UpdateChartBody = AddPlanChart & { id: number };

export const updateChartApi = async (body: UpdateChartBody) => {
  const response = await apiRequest.put<ApiResponse<UpdateChartBody>>(`/plan-charts/${body.id}`, body);
  return response.data;
};
