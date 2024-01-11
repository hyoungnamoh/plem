import { UseMutationOptions, useMutation } from 'react-query';
import { UpdateScheduleBody, updateScheduleApi } from '../../api/schedules/updateScheduleApi';
import { ApiResponse } from '../../../types/axios';
import { AxiosError } from 'axios';

export const useUpdateSchedule = (options: UseMutationOptions<ApiResponse, AxiosError, UpdateScheduleBody>) => {
  return useMutation<ApiResponse, AxiosError, UpdateScheduleBody>((body) => updateScheduleApi(body), options);
};
