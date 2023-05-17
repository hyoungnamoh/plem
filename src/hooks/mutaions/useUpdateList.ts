import { UseMutationOptions, useMutation, useQueryClient } from 'react-query';
import { ApiResponse } from '../../../types/axios';
import { AxiosError } from 'axios';
import { AddPlanChart, UpdateChartOrdersBody } from '../../../types/chart';
import { updateChartsOrderApi } from '../../api/charts/updateChartsOrderApi';
import { Alert } from 'react-native';

export const useUpdateChartsOrder = ({
  onSuccess,
  onError,
}: Omit<UseMutationOptions<ApiResponse, AxiosError, UpdateChartOrdersBody>, 'updateChartsOrder'>) => {
  return useMutation<ApiResponse, AxiosError, UpdateChartOrdersBody>('updateChartsOrder', updateChartsOrderApi, {
    onSuccess,
    onError,
  });
};
