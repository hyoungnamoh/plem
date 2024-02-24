import { GetTodayScheduleListParmas, getTodayScheduleListApi } from 'api/schedules/getTodayScheduleListApi';
import { useQuery } from 'react-query';

export const TODAY_SCHEDULE_LIST = 'todayScheduleList';

export const useGetTodayScheduleList = (params: GetTodayScheduleListParmas) => {
  return useQuery([TODAY_SCHEDULE_LIST], () => getTodayScheduleListApi(params));
};
