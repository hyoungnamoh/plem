import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse } from 'types/axios';
import { AxiosError } from 'axios';
import { AddInquiryBody, AddInquiryResponse, addInqeiryApi } from 'api/inquiries/addInquiryApi';

export const useAddInquiry = (
  options: UseMutationOptions<ApiResponse<AddInquiryResponse>, AxiosError, AddInquiryBody>
) => {
  return useMutation('addInquiry', (body) => addInqeiryApi(body), options);
};
