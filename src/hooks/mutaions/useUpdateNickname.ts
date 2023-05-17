import { UseMutationOptions, useMutation, useQueryClient } from 'react-query';
import { ApiResponse } from '../../../types/axios';
import { AxiosError } from 'axios';
import { AddPlanChart, UpdateChartOrdersBody } from '../../../types/chart';
import { updateChartsOrderApi } from '../../api/charts/updateChartsOrderApi';
import { Alert } from 'react-native';
import { UpdateNicknameBody, UpdateNicknameResponse, updateNicknameApi } from '../../api/charts/updateNickname';

export const useUpdateNickname = ({
  onSuccess,
  onError,
}: Omit<UseMutationOptions<ApiResponse<UpdateNicknameResponse>, AxiosError, UpdateNicknameBody>, 'updateNickname'>) => {
  return useMutation<ApiResponse<UpdateNicknameResponse>, AxiosError, UpdateNicknameBody>(
    'updateNickname',
    (body) => updateNicknameApi(body),
    {
      onSuccess,
      onError,
    }
  );
};
