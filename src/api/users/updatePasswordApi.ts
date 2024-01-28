import apiRequest from 'api';
import { ApiResponse } from 'types/axios';

export type UpdatePasswordBody = {
  email: string;
  currentPassword: string;
  newPassword: string;
};

export type UpdatePasswordResponse = {
  id: number;
};

export const updatePasswordApi = async (body: UpdatePasswordBody) => {
  const response = await apiRequest.put<ApiResponse<UpdatePasswordResponse>>('/users/password', body);
  return response.data;
};
