import apiRequest from '..';
import { ApiResponse } from '../../../types/axios';
import { UpdateChartOrdersBody } from '../../../types/chart';

export const updateChartsOrderApi = async (body: UpdateChartOrdersBody) => {
  const response = await apiRequest.put<ApiResponse>(`/plan-charts/order/list`, body);
  return response.data;
};
