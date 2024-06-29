import { useQueryClient } from 'react-query';
import { GET_DO_IT_NOW_QUERY_KEY as DO_IT_NOW_QUERY_KEY } from './queries/useGetDoItNow';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from 'states/loggedInUserState';
import SharedDefaults from 'widgets/SharedDefaults';

export const useDoItNowUpdate = () => {
  const queryClient = useQueryClient();
  const loggedInUser = useRecoilValue(loggedInUserState);

  const doItNowUpdate = () => {
    SharedDefaults.updateDoItNowBridge();
    if (loggedInUser) {
      queryClient.invalidateQueries(DO_IT_NOW_QUERY_KEY);
    }
  };

  return { update: doItNowUpdate };
};
