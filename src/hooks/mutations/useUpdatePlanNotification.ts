import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse } from 'types/axios';
import { AxiosError } from 'axios';
import {
  UpdatePlanNotificationBody,
  UpdatePlanNotificationResponse,
  updatePlanNotification,
} from 'api/users/updatePlanNotification';

export const useUpdatePlanNotification = (
  options: UseMutationOptions<ApiResponse<UpdatePlanNotificationResponse>, AxiosError, UpdatePlanNotificationBody>
) => {
  return useMutation<ApiResponse<UpdatePlanNotificationResponse>, AxiosError, UpdatePlanNotificationBody>(
    'updatePlanNotification',
    (body) => updatePlanNotification(body),
    options
  );
};
