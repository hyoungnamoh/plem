import apiRequest from 'api';
import { ApiResponse } from 'types/axios';

export type DeleteUserBody = {
  type: string;
  reason: string;
};

export type WithdrawalReason = 'remove_data' | 'experience' | 'another_app' | 'frequency' | 'etc';

export type DeleteUserResponse = {
  id: number;
};

export const deleteUserApi = async (body: DeleteUserBody) => {
  const response = await apiRequest.delete<ApiResponse<DeleteUserResponse>>('/users', { data: body });
  return response.data;
};
