import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse } from 'types/axios';
import { AxiosError } from 'axios';
import { AddSchedule } from 'types/calendar';
import { addScheduleApi } from 'api/schedules/addScheduleApi';

export const useAddSchedule = (options: UseMutationOptions<ApiResponse, AxiosError, AddSchedule>) => {
  return useMutation<ApiResponse, AxiosError, AddSchedule>('addChart', (body) => addScheduleApi(body), options);
};
