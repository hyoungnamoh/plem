import apiRequest from 'api';
import { InquiryType } from 'pages/DirectInquiryPage';
import { ApiResponse } from 'types/axios';

export type AddInquiryBody = {
  type: InquiryType;
  email: string;
  title: string;
  content: string;
};

export type AddInquiryResponse = {
  id: number;
  type: InquiryType;
  UserId: number;
  email: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  removedAt: string | null;
};

export const addInqeiryApi = async (inquiry: AddInquiryBody) => {
  const response = await apiRequest.post<ApiResponse<AddInquiryResponse>>('/inquiries', inquiry);
  return response.data;
};
