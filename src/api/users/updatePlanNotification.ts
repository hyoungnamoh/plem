import apiRequest from 'api';
import { ApiResponse } from 'types/axios';

export type UpdatePlanNotificationBody = { planNotification: boolean };
export type UpdatePlanNotificationResponse = { id: number };

export const updatePlanNotification = async (body: UpdatePlanNotificationBody) => {
  const response = await apiRequest.put<ApiResponse<UpdatePlanNotificationResponse>>('/users/notification/plan', body);

  return response.data;
};
