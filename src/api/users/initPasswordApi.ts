import apiRequest from 'api';
import { ApiResponse } from 'types/axios';

export type InitPasswordBody = {
  email: string;
  password: string;
};

export type InitPasswordResponse = {
  id: number;
};

export const initPasswordApi = async (body: InitPasswordBody) => {
  const response = await apiRequest.put<ApiResponse<InitPasswordResponse>>('/users/password/init', body);
  return response.data;
};
