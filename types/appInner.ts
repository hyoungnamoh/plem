import { UseMutationResult } from 'react-query';
import { PlanChart } from './chart';
import { ApiResponse } from './axios';
import { PostVerificationEmailParams, PostVerificationEmailResponse } from '../src/api/auth/postVerificationEmailApi';
import { AxiosError } from 'axios';

export type LoggedInTabParamList = {
  MainTab: { chart: PlanChart };
  CalendarTab: undefined;
  PlanChartListTab: undefined;
  SettingTab: undefined;
};

export type LoggedOutStackParamList = {
  LoginPage: { from?: string } | undefined;
  PasswordSettingPage: { email: string; isFindingPassword?: boolean };
  IntroPage: undefined;
  NicknameSettingPage: { email: string; password: string };
  EmailVerifyIntroPage: { email: string; password: string; nickname: string };
  EmailVerifyPage: undefined;
  NotReceivedMailPage: {
    usePostVerificationEmail: UseMutationResult<
      ApiResponse<PostVerificationEmailResponse>,
      AxiosError<unknown, any>,
      PostVerificationEmailParams,
      unknown
    >;
    email: string;
  };
  SignUpSuccessPage: {
    nickname: string;
  };
  FindPasswordPage: undefined;
  GuidePage: undefined;
};
