import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse } from '../../../types/axios';
import { AxiosError } from 'axios';
import { UpdateNicknameBody, UpdateNicknameResponse, updateNicknameApi } from '../../api/charts/updateNicknameApi';

export const useUpdateNickname = (
  options: UseMutationOptions<ApiResponse<UpdateNicknameResponse>, AxiosError, UpdateNicknameBody>
) => {
  return useMutation<ApiResponse<UpdateNicknameResponse>, AxiosError, UpdateNicknameBody>(
    'updateNickname',
    (body) => updateNicknameApi(body),
    options
  );
};
