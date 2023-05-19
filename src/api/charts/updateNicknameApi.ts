import apiRequest from '..';
import { ApiResponse } from '../../../types/axios';

export type UpdateNicknameBody = {
  nickname: string;
};

export type UpdateNicknameResponse = {
  refreshToken: string;
  accessToken: string;
};

export const updateNicknameApi = async (body: UpdateNicknameBody) => {
  const response = await apiRequest.put<ApiResponse<UpdateNicknameResponse>>('/users/nickname', body);
  return response.data;
};
