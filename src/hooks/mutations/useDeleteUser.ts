import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse } from 'types/axios';
import { AxiosError } from 'axios';
import { DeleteUserBody, deleteUserApi } from 'api/users/deleteUserApi';

export const useDeleteUser = (options: UseMutationOptions<ApiResponse, AxiosError, DeleteUserBody>) => {
  return useMutation<ApiResponse, AxiosError, DeleteUserBody>('deleteUser', (body) => deleteUserApi(body), options);
};
