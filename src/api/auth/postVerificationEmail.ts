import apiRequest from '..';
import { ErrorResponse, SuccessResponse } from '../../../types/axios';

export type PostVerificationEmailResponse = {
  verificationCode: string;
};

export type PostVerificationEmailParams = {
  email: string;
};

export const postVerificationEmail = async ({ email }: PostVerificationEmailParams) => {
  const response = await apiRequest.post<SuccessResponse<PostVerificationEmailResponse> & ErrorResponse>(
    '/users/verification-code',
    {
      email,
    }
  );
  return response.data;
};
