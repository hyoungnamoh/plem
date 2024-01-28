import apiRequest from 'api';
import { ApiResponse } from 'types/axios';

export const getNoticeListApi = async () => {
  const response = await apiRequest.get<ApiResponse>('/notices');

  return response.data;
};
