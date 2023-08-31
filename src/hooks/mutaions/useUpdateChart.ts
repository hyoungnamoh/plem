import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse } from '../../../types/axios';
import { AxiosError } from 'axios';
import { UpdateChartBody, updateChartApi } from '../../api/charts/updateChartApi';

export const useUpdateChart = (options: UseMutationOptions<ApiResponse, AxiosError, UpdateChartBody>) => {
  return useMutation<ApiResponse, AxiosError, UpdateChartBody>('updateChart', (body) => updateChartApi(body), options);
};
