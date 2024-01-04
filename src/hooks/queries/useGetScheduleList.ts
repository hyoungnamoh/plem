import { useQuery } from 'react-query';
import { getScheduleListApi } from '../../api/schedules/getScheduleListApi';

export const SCHEDULE_LIST_QUERY_KEY = 'getScheduleList';

export const useGetScheduleList = () => {
  return useQuery([SCHEDULE_LIST_QUERY_KEY], () => getScheduleListApi());
};
