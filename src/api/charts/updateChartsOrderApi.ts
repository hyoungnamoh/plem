import { UpdateChartOrdersBody } from 'types/chart';
import apiRequest from 'api';
import { ApiResponse } from 'types/axios';

export const updateChartsOrderApi = async (body: UpdateChartOrdersBody) => {
  const response = await apiRequest.put<ApiResponse>('/plan-charts/order/list', body);
  return response.data;
};
