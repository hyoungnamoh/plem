import apiRequest from 'api';
import { ApiResponse } from 'types/axios';

export type LogoutResponse = { data: boolean };
export type LogoutBody = { phoneToken: string };

export const logoutApi = async (body: LogoutBody) => {
  const response = await apiRequest.post<ApiResponse<LogoutResponse>>('/users/logout', body);
  return response.data;
};
