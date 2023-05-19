import apiRequest from '..';
import { ApiResponse } from '../../../types/axios';

export type SignUpResponse = { data: boolean };

export const logoutApi = async () => {
  const response = await apiRequest.post<ApiResponse<SignUpResponse>>('/users/logout');
  return response.data;
};
