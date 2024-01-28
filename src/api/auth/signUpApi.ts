import apiRequest from 'api';
import { ApiResponse } from 'types/axios';

export type SignUpResponse = { data: boolean };

export type SignUpParams = {
  email: string;
  password: string;
  nickname: string;
};

export const signUpApi = async ({ email, password, nickname }: SignUpParams) => {
  const response = await apiRequest.post<ApiResponse<SignUpResponse>>('/users', {
    email,
    password,
    nickname,
  });
  return response.data;
};
