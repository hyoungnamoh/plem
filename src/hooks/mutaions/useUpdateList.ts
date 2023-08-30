import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse } from '../../../types/axios';
import { AxiosError } from 'axios';
import { UpdateChartOrdersBody } from '../../../types/chart';
import { updateChartsOrderApi } from '../../api/charts/updateChartsOrderApi';

export const useUpdateChartsOrder = (options: UseMutationOptions<ApiResponse, AxiosError, UpdateChartOrdersBody>) => {
  return useMutation<ApiResponse, AxiosError, UpdateChartOrdersBody>(
    'updateChartsOrder',
    updateChartsOrderApi,
    options
  );
};
