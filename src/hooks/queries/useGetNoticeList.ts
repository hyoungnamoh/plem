import { useQuery } from 'react-query';
import { getNoticeListApi } from '../../api/notices/getNoticeListApi';

export const NOTICE_LIST_QUERY_KEY = 'getNoticeList';

export const useGetNoticeList = () => {
  return useQuery([NOTICE_LIST_QUERY_KEY], () => getNoticeListApi());
};
