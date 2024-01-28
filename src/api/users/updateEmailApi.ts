import apiRequest from 'api';
import { ApiResponse } from 'types/axios';

export type UpdateEmailBody = {
  newEmail: string;
};

export type UpdateEmailResponse = {
  refreshToken: string; // 이메일 변경으로 인한 accesstoken 재설정을 위함
  accessToken: string;
  id: number;
};

export const updateEmailApi = async (body: UpdateEmailBody) => {
  const response = await apiRequest.put<ApiResponse<UpdateEmailResponse>>('/users/email', body);
  return response.data;
};
