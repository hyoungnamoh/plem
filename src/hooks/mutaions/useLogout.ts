import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse } from '../../../types/axios';
import { AxiosError } from 'axios';
import { logoutApi } from '../../api/auth/logoutApi';

export const useLogout = ({ onSuccess, onError }: UseMutationOptions<ApiResponse, AxiosError>) => {
  return useMutation<ApiResponse, AxiosError>('logout', logoutApi, {
    onSuccess,
    onError,
  });
};
