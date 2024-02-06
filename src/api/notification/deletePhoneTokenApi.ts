import apiRequest from 'api';
import { ApiResponse } from 'types/axios';

export type DeletePhoneTokenBody = { phoneToken: string };

export const deletePhoneToken = async (body: DeletePhoneTokenBody) => {
  const response = await apiRequest.delete<ApiResponse<DeletePhoneTokenBody>>('/push-notifications', { data: body });

  return response.data;
};
