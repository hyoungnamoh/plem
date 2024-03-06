import apiRequest from 'api';
import { ApiResponse } from 'types/axios';
import { Schedule } from 'types/calendar';

export type ScheduleMap = {
  [year: number]: {
    [month: number]: {
      [date: number]: Schedule[];
    };
  };
};

export type CalendarSchedule = {
  noRepeatSchedules: Schedule[];
  repeatSchedules: {
    yearlyRepeatSchedules: Schedule[];
    monthlyRepeatSchedules: Schedule[];
    twoWeeklyRepeatSchedules: Schedule[];
    weeklyRepeatSchedules: Schedule[];
    dailyRepeatSchedules: Schedule[];
  };
};

export const getScheduleListApi = async () => {
  const response = await apiRequest.get<ApiResponse<CalendarSchedule>>('/schedules');

  return response.data;
};
