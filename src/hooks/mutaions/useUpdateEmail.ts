import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse } from '../../../types/axios';
import { AxiosError } from 'axios';
import { UpdateEmailBody, UpdateEmailResponse, updateEmailApi } from '../../api/users/updateEmailApi';

export const useUpdateEmail = (
  options: UseMutationOptions<ApiResponse<UpdateEmailResponse>, AxiosError, UpdateEmailBody>
) => {
  return useMutation<ApiResponse<UpdateEmailResponse>, AxiosError, UpdateEmailBody>(
    'updateNickname',
    (body) => updateEmailApi(body),
    options
  );
};
