import { UseMutationResult } from 'react-query';
import { ApiResponse } from './axios';
import { PostVerificationEmailParams, PostVerificationEmailResponse } from 'api/auth/postVerificationEmailApi';
import { AxiosError } from 'axios';
import { NavigatorScreenParams } from '@react-navigation/native';
import { MainTabStackParamList } from 'tabs/MainTab';
import { PlanChartListTabStackParamList } from 'tabs/PlanChartListTab';
import { CalendarTabStackParamList } from 'tabs/CalendarTab';
import { SettingTabStackParamList } from 'tabs/SettingTab';

export type LoggedInTabParamList = {
  MainTab: NavigatorScreenParams<MainTabStackParamList>;
  CalendarTab: NavigatorScreenParams<CalendarTabStackParamList>;
  PlanChartListTab: NavigatorScreenParams<PlanChartListTabStackParamList>;
  SettingTab: NavigatorScreenParams<SettingTabStackParamList>;
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
