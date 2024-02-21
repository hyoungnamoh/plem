import { useQuery } from 'react-query';
import { getPlanChartListCountApi } from 'api/charts/getPlanChartListCountApi';

export const CHART_LIST_COUNT_QUERY_KEY = 'chartListCountQueryKey';

export const useGetChartListCount = () => {
  return useQuery([CHART_LIST_COUNT_QUERY_KEY], getPlanChartListCountApi);
};
