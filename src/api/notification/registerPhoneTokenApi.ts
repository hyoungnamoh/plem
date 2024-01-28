import apiRequest from 'api';
import { ApiResponse } from 'types/axios';

export type RegisterPhoneTokenBody = { phoneToken: string };

export const registerPhoneToken = async (body: RegisterPhoneTokenBody) => {
  const response = await apiRequest.post<ApiResponse<RegisterPhoneTokenBody>>('/push-notifications', body);

  return response.data;
};
