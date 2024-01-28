import apiRequest from 'api';
import { ErrorResponse, SuccessResponse } from 'types/axios';

export type LoginUser = {
  email: string;
  enabled: 0 | 1;
  exp: number;
  iat: number;
  id: number;
  isCertified: 0 | 1;
  nickname: string;
};
export const getLoginUserApi = async () => {
  const response = await apiRequest.get<SuccessResponse<LoginUser> & ErrorResponse>('/users');
  return response.data;
};
