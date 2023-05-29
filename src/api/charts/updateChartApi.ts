import apiRequest from '..';
import { ApiResponse, ErrorResponse, SuccessResponse } from '../../../types/axios';
import { AddPlanChart } from '../../../types/chart';

type UpdateChartBody = AddPlanChart & { id: number };

export const updateChartApi = async (body: UpdateChartBody) => {
  const response = await apiRequest.put<ApiResponse>(`/plan-charts/${body.id}`, body);
  return response.data;
};
