import apiRequest from '..';
import { ApiResponse } from '../../../types/axios';

export type UpdateNicknameBody = {
  nickname: string;
};

export type UpdateNicknameResponse = {
  refreshToken: string; // 닉네임 변경으로 인한 accesstoken 재설정을 위함
  accessToken: string;
  id: number;
  nickname: string;
};

export const updateNicknameApi = async (body: UpdateNicknameBody) => {
  const response = await apiRequest.put<ApiResponse<UpdateNicknameResponse>>('/users/nickname', body);
  return response.data;
};
