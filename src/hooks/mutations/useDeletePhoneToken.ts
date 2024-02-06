import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse } from 'types/axios';
import { AxiosError } from 'axios';
import { DeletePhoneTokenBody, deletePhoneToken } from 'api/notification/deletePhoneTokenApi';

export const useDeletePhoneToken = (options: UseMutationOptions<ApiResponse, AxiosError, DeletePhoneTokenBody>) => {
  return useMutation<ApiResponse, AxiosError, DeletePhoneTokenBody>(
    'deletePhoneToken',
    (body) => deletePhoneToken(body),
    options
  );
};
