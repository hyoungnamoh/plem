import apiRequest from '..';
import { ApiResponse } from '../../../types/axios';
import { AddSchedule } from '../../../types/calendar';

export const addScheduleApi = async (schedule: AddSchedule) => {
  const response = await apiRequest.post<ApiResponse<AddSchedule>>('/schedules', schedule);
  return response.data;
};
