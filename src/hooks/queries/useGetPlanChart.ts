import { useQuery } from 'react-query';
import { getPlanChartApi } from '../../api/charts/getPlanChartApi';

export const PLAN_CHART_QUERY_KEY = 'getPlanChart';
export const useGetPlanChart = ({ id }: { id: number }) => {
  return useQuery([PLAN_CHART_QUERY_KEY, id], () => getPlanChartApi({ id }));
};
