import { useQuery } from 'react-query';
import { getTodayPlanChartApi } from 'api/charts/getTodayPlanChartApi';

export const TODAY_PLAN_CHART_QUERY_KEY = 'getTodayPlanChart';
export const useGetTodayPlanChart = () => {
  return useQuery([TODAY_PLAN_CHART_QUERY_KEY], () => getTodayPlanChartApi());
};
