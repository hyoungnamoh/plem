import apiRequest from 'api';
import { ApiResponse } from 'types/axios';
import { SubPlanHistory } from 'types/subPlanHistory';

export const checkSubPlanApi = async (subPlanHistory: SubPlanHistory) => {
  const response = await apiRequest.post<ApiResponse<SubPlanHistory>>('/sub-plan-histories', subPlanHistory);
  return response.data;
};
