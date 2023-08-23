import apiRequest from '..';
import { ErrorResponse, SuccessResponse } from '../../../types/axios';

export type PostVerificationEmailResponse = {
  verificationCode: string;
};

export type PostVerificationEmailParams = {
  email: string;
  isReset?: boolean;
};

export const postVerificationEmailApi = async ({ email, isReset }: PostVerificationEmailParams) => {
  const response = await apiRequest.post<SuccessResponse<PostVerificationEmailResponse> & ErrorResponse>(
    '/users/verification-code',
    {
      email,
      isReset,
    }
  );
  return response.data;
};
