import apiRequest from '..';
import { ApiResponse } from '../../../types/axios';
import { Schedule } from '../../../types/calendar';

export type CalendarSchedule = {
  noRepeatSchedules: {
    [year: number]: {
      [month: number]: {
        [date: number]: Schedule[];
      };
    };
  };
  repeatSchedules: {
    monthlyRepeatScheduleMap: {
      [date: number]: Schedule[];
    };
    twoWeeklyRepeatSchedules: Schedule[];
    weeklyRepeatSchedules: Schedule[];
    dailyRepeatSchedules: Schedule[];
  };
};

export const getScheduleListApi = async () => {
  const response = await apiRequest.get<ApiResponse<CalendarSchedule>>('/schedules');

  return response.data;
};
