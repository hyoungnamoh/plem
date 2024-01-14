import { UseMutationOptions, useMutation } from 'react-query';
import { ApiResponse } from '../../../types/axios';
import { AxiosError } from 'axios';
import { RegisterPhoneTokenBody, registerPhoneToken } from '../../api/notification/registerPhoneTokenApi';

export const useRegisterPhoneToken = (options: UseMutationOptions<ApiResponse, AxiosError, RegisterPhoneTokenBody>) => {
  return useMutation<ApiResponse, AxiosError, RegisterPhoneTokenBody>(
    'registerPhoneToken',
    (body) => registerPhoneToken(body),
    options
  );
};
