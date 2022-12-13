import apiRequest from '..';
import { ErrorResponse, SuccessResponse } from '../../../types/axios';

export const checkDuplicateEmailApi = async ({ email }: { email: string }) => {
  const response = await apiRequest.get<SuccessResponse<boolean> & ErrorResponse>('/users/check-duplicate-email', {
    params: { email },
  });
  return response.data;
};
