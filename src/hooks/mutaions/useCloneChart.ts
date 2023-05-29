import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse } from '../../../types/axios';
import { AxiosError } from 'axios';
import { CloneChartBody, cloneChartApi } from '../../api/charts/cloneChartApi';

export const useCloneChart = ({ onSuccess, onError }: UseMutationOptions<ApiResponse, AxiosError, CloneChartBody>) => {
  return useMutation<ApiResponse, AxiosError, CloneChartBody>('cloneChart', (body) => cloneChartApi(body), {
    onSuccess,
    onError,
  });
};
