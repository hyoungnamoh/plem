import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse } from 'types/axios';
import { AxiosError } from 'axios';
import { InitPasswordBody, InitPasswordResponse, initPasswordApi } from 'api/users/initPasswordApi';

export const useInitPassword = (
  options: UseMutationOptions<ApiResponse<InitPasswordResponse>, AxiosError, InitPasswordBody>
) => {
  return useMutation<ApiResponse<InitPasswordResponse>, AxiosError, InitPasswordBody>(
    'updateNickname',
    (body) => initPasswordApi(body),
    options
  );
};
