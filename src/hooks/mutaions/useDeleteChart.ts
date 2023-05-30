import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse } from '../../../types/axios';
import { AxiosError } from 'axios';
import { DeleteChartBody, deleteChartApi } from '../../api/charts/deleteChartApi';

export const useDeleteChart = ({
  onSuccess,
  onError,
}: UseMutationOptions<ApiResponse, AxiosError, DeleteChartBody>) => {
  return useMutation<ApiResponse, AxiosError, DeleteChartBody>('cloneChart', (body) => deleteChartApi(body), {
    onSuccess,
    onError,
  });
};
