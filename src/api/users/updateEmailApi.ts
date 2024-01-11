import apiRequest from '..';
import { ApiResponse } from '../../../types/axios';

export type UpdateEmailBody = {
  newEmail: string;
};

export type UpdateEmailResponse = {
  id: number;
};

export const updateEmailApi = async (body: UpdateEmailBody) => {
  const response = await apiRequest.put<ApiResponse<UpdateEmailResponse>>('/users/email', body);
  return response.data;
};
