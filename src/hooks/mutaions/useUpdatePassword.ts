import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse } from '../../../types/axios';
import { AxiosError } from 'axios';
import { UpdatePasswordBody, UpdatePasswordResponse, updatePasswordApi } from '../../api/users/updatePasswordApi';

export const useUpdatePassword = ({
  onSuccess,
  onError,
}: UseMutationOptions<ApiResponse<UpdatePasswordResponse>, AxiosError, UpdatePasswordBody>) => {
  return useMutation<ApiResponse<UpdatePasswordResponse>, AxiosError, UpdatePasswordBody>(
    'updateNickname',
    (body) => updatePasswordApi(body),
    {
      onSuccess,
      onError,
    }
  );
};
