import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse } from 'types/axios';
import { AxiosError } from 'axios';
import { LogoutBody, logoutApi } from 'api/auth/logoutApi';

export const useLogout = (options: UseMutationOptions<ApiResponse, AxiosError, LogoutBody>) => {
  return useMutation<ApiResponse, AxiosError, LogoutBody>('logout', (body) => logoutApi(body), options);
};
