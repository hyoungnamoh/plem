import apiRequest from '..';
import { ErrorResponse, SuccessResponse } from '../../../types/axios';

export type LoginApiResponse = {
  accessToken: string;
};

export const loginApi = async ({ email, password }: { email: string; password: string }) => {
  const response = await apiRequest.post<SuccessResponse<LoginApiResponse> & ErrorResponse>('/users/login', {
    email,
    password,
  });
  return response.data;
};
