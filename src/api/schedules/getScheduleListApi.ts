import apiRequest from '..';
import { ApiResponse } from '../../../types/axios';
import { Schedule } from '../../../types/calendar';

export type CalendarSchedule = {
  [year: number]: {
    [month: number]: {
      [date: number]: Schedule[];
    };
  };
};

export const getScheduleListApi = async ({ date }: { date: string }) => {
  const response = await apiRequest.get<ApiResponse<CalendarSchedule>>('/schedules', {
    params: { date },
  });

  return response.data;
};
