import apiRequest from 'api';
import { ApiResponse } from 'types/axios';

export type DeleteUserBody = {
  password: string;
};

export type DeleteUserResponse = {
  id: number;
};

export const deleteUserApi = async (body: DeleteUserBody) => {
  const response = await apiRequest.delete<ApiResponse<DeleteUserResponse>>('/users', { data: body });
  return response.data;
};
