import { UseMutationOptions, useMutation } from 'react-query';
import { SuccessResponse } from 'types/axios';
import { AxiosError } from 'axios';
import { CloneChartBody, cloneChartApi } from 'api/charts/cloneChartApi';
import { PlanChart } from 'types/chart';

export const useCloneChart = (options: UseMutationOptions<SuccessResponse<PlanChart>, AxiosError, CloneChartBody>) => {
  return useMutation<SuccessResponse<PlanChart>, AxiosError, CloneChartBody>(
    'cloneChart',
    (body) => cloneChartApi(body),
    options
  );
};
