import apiRequest from '..';
import { ErrorResponse, SuccessResponse } from '../../../types/axios';

export type LoginApiResponseData = {
  accessToken: string;
};

export const loginApi = async ({ email, password }: { email: string; password: string }) => {
  const response = await apiRequest.post<SuccessResponse<LoginApiResponseData> & ErrorResponse>('/users/login', {
    email,
    password,
  });
  return response.data;
};
