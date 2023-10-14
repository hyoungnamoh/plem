import apiRequest from '..';
import { ApiResponse } from '../../../types/axios';
import { Schedule } from '../../../types/calendar';

export type UpdateScheduleBody = Omit<Schedule, 'createdAt' | 'updatedAt' | 'removedAt'>;

export const updateScheduleApi = async (schedule: UpdateScheduleBody) => {
  const response = await apiRequest.put<ApiResponse>('/schedules', schedule);
  return response.data;
};
