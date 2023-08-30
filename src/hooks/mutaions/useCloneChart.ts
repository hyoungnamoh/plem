import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse, SuccessResponse } from '../../../types/axios';
import { AxiosError } from 'axios';
import { CloneChartBody, cloneChartApi } from '../../api/charts/cloneChartApi';
import { Plan, PlanChart } from '../../../types/chart';

export const useCloneChart = ({
  onSuccess,
  onError,
}: UseMutationOptions<SuccessResponse<PlanChart>, AxiosError, CloneChartBody>) => {
  return useMutation<SuccessResponse<PlanChart>, AxiosError, CloneChartBody>(
    'cloneChart',
    (body) => cloneChartApi(body),
    {
      onSuccess,
      onError,
    }
  );
};
