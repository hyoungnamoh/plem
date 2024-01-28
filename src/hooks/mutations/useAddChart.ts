import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse } from 'types/axios';
import { AxiosError } from 'axios';
import { addPlanChartApi } from 'api/charts/addPlanChartApi';
import { AddPlanChart } from 'types/chart';

export const useAddChart = (options: UseMutationOptions<ApiResponse, AxiosError, AddPlanChart>) => {
  return useMutation<ApiResponse, AxiosError, AddPlanChart>('addChart', (body) => addPlanChartApi(body), options);
};
