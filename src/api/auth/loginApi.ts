import apiRequest from '..';
import { ErrorResponse, SuccessResponse } from '../../../types/axios';

export type LoginResponse = {
  accessToken: string;
};

export const loginApi = async ({ email, password }: { email: string; password: string }) => {
  const response = await apiRequest.post<SuccessResponse<LoginResponse> & ErrorResponse>('/users/login', {
    email,
    password,
  });
  return response.data;
};
