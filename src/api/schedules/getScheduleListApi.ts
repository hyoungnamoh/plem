import apiRequest from '..';
import { ApiResponse } from '../../../types/axios';
import { Schedule } from '../../../types/calendar';

export const getScheduleListApi = async ({ date }: { date: string }) => {
  const response = await apiRequest.get<ApiResponse<{ [date: number]: Schedule[] }>>('/schedules', {
    params: { date },
  });

  return response.data;
};
