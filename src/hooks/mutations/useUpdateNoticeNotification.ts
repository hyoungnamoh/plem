import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse } from 'types/axios';
import { AxiosError } from 'axios';
import {
  UpdateNoticeNotificationBody,
  UpdateNoticeNotificationResponse,
  updateNoticeNotification,
} from 'api/users/updateNoticeNotification';

export const useUpdateNoticeNotification = (
  options: UseMutationOptions<ApiResponse<UpdateNoticeNotificationResponse>, AxiosError, UpdateNoticeNotificationBody>
) => {
  return useMutation<ApiResponse<UpdateNoticeNotificationResponse>, AxiosError, UpdateNoticeNotificationBody>(
    'updateNoticeNotification',
    (body) => updateNoticeNotification(body),
    options
  );
};
