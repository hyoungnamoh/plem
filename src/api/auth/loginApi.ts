import apiRequest from 'api';
import { ErrorResponse, SuccessResponse } from 'types/axios';

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export const loginApi = async ({ email, password }: { email: string; password: string }) => {
  const response = await apiRequest.post<SuccessResponse<LoginResponse> & ErrorResponse>('/users/login', {
    email,
    password,
  });
  return response.data;
};
