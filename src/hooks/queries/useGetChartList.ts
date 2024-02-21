import { useQuery } from 'react-query';
import { getPlanChartListApi } from 'api/charts/getPlanChartListApi';

export const CHART_LIST_QUERY_KEY = 'chartListQueryKey';

export const useGetChartList = () => {
  return useQuery([CHART_LIST_QUERY_KEY], getPlanChartListApi, { cacheTime: Infinity, staleTime: Infinity });
};
