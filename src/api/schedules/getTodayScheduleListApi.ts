import { ApiResponse } from 'types/axios';
import apiRequest from 'api';
import { Schedule } from 'types/calendar';

export type GetTodayScheduleListParmas = {
  date: string;
};

export const getTodayScheduleListApi = async (params: GetTodayScheduleListParmas) => {
  const response = await apiRequest.get<ApiResponse<Schedule[]>>('/schedules/today', { params });

  return response.data;
};
