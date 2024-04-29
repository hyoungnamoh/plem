import apiRequest from 'api';
import { ApiResponse } from 'types/axios';

export type UpdateNoticeNotificationBody = { noticeNotification: boolean };
export type UpdateNoticeNotificationResponse = { id: number };

export const updateNoticeNotification = async (body: UpdateNoticeNotificationBody) => {
  const response = await apiRequest.put<ApiResponse<UpdateNoticeNotificationResponse>>(
    '/users/notification/notice',
    body
  );

  return response.data;
};
