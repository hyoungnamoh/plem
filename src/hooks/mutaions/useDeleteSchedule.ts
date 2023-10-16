import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse } from '../../../types/axios';
import { AxiosError } from 'axios';
import { DeleteScheduleBody, deleteScheduleApi } from '../../api/schedules/deleteScheduleApi';

export const useDeleteSchedule = (options: UseMutationOptions<ApiResponse, AxiosError, DeleteScheduleBody>) => {
  return useMutation<ApiResponse, AxiosError, DeleteScheduleBody>(
    'deleteSchedule',
    (body) => deleteScheduleApi(body),
    options
  );
};
