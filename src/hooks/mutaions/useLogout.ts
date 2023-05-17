import { UseMutationOptions, useMutation, useQueryClient } from 'react-query';
import { ApiResponse } from '../../../types/axios';
import { AxiosError } from 'axios';
import { updateChartsOrderApi } from '../../api/charts/updateChartsOrderApi';
import { Alert } from 'react-native';
import { logoutApi } from '../../api/auth/logoutApi';

export const useLogout = ({ onSuccess, onError }: Omit<UseMutationOptions<ApiResponse, AxiosError>, 'logout'>) => {
  return useMutation<ApiResponse, AxiosError>('logout', logoutApi, {
    onSuccess,
    onError,
  });
};
