import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse } from 'types/axios';
import { AxiosError } from 'axios';
import { SubPlanHistory } from 'types/subPlanHistory';
import { checkSubPlanApi } from 'api/subPlanHistories/checkSubPlanApi';

export const useCheckSubPlan = (options: UseMutationOptions<ApiResponse, AxiosError, SubPlanHistory>) => {
  return useMutation('checkSubPlan', (body) => checkSubPlanApi(body), options);
};
