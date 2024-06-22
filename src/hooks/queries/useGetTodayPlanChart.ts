import { useQuery, useQueryClient } from 'react-query';
import { getTodayPlanChartApi } from 'api/charts/getTodayPlanChartApi';
import { GET_DO_IT_NOW_QUERY_KEY } from './useGetDoItNow';

export const TODAY_PLAN_CHART_QUERY_KEY = 'getTodayPlanChart';
export const useGetTodayPlanChart = () => {
  const queryClient = useQueryClient();
  return useQuery([TODAY_PLAN_CHART_QUERY_KEY], () => getTodayPlanChartApi(), {
    onSuccess: () => {
      queryClient.invalidateQueries(GET_DO_IT_NOW_QUERY_KEY);
    },
  });
};
