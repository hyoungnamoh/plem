import { getPlanChartApi } from 'api/charts/getPlanChartApi';
import { useQuery } from 'react-query';

export const PLAN_CHART_QUERY_KEY = 'getPlanChart';
export const useGetPlanChart = ({ id }: { id: number }) => {
  return useQuery([PLAN_CHART_QUERY_KEY, id], () => getPlanChartApi({ id }));
};
