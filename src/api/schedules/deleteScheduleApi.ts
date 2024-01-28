import apiRequest from 'api';
import { ApiResponse } from 'types/axios';

export type DeleteScheduleBody = { id: number };

export const deleteScheduleApi = async ({ id }: DeleteScheduleBody) => {
  const response = await apiRequest.delete<ApiResponse>(`/schedules/${id}`);
  return response.data;
};
