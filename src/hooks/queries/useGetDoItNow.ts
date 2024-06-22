import { useQuery } from 'react-query';
import { getDoItNowApi } from 'api/plans/getDoItNowApi';
import { useSetRecoilState } from 'recoil';
import { disableLoadingState } from 'states/disableLoadingState';

export const GET_DO_IT_NOW_QUERY_KEY = 'getDoItNowQueryKey';

export const useGetDoItNow = () => {
  const setDisableLoading = useSetRecoilState(disableLoadingState);
  return useQuery(
    [GET_DO_IT_NOW_QUERY_KEY],
    () => {
      setDisableLoading(true);
      return getDoItNowApi();
    },
    {
      onSettled: () => {
        setDisableLoading(false);
      },
    }
  );
};
