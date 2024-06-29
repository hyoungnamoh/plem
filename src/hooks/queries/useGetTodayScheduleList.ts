import { GetTodayScheduleListParmas, getTodayScheduleListApi } from 'api/schedules/getTodayScheduleListApi';
import { useQuery } from 'react-query';

export const TODAY_SCHEDULE_LIST_QUERY_KEY = 'todayScheduleList';

export const useGetTodayScheduleList = (params: GetTodayScheduleListParmas) => {
  return useQuery([TODAY_SCHEDULE_LIST_QUERY_KEY], () => getTodayScheduleListApi(params));
};
