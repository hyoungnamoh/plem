import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountSettingPage from 'pages/AccountSettingPage';
import CustommerSupportPage from 'pages/CustommerSupportPage';
import DirectInquiryPage from 'pages/DirectInquiryPage';
import ModifyEmailPage from 'pages/ModifyEmailPage';
import ModifyNickNamePage from 'pages/ModifyNickNamePage';
import ModifyPasswordPage from 'pages/ModifyPasswordPage';
import NoticeListPage from 'pages/NoticeListPage';
import NotificationSettingPage from 'pages/NotificationSettingPage';
import SettingPage from 'pages/SettingPage';
import { UseMutationResult } from 'react-query';
import { PostVerificationEmailParams, PostVerificationEmailResponse } from 'api/auth/postVerificationEmailApi';
import { ApiResponse } from 'types/axios';
import { AxiosError } from 'axios';
import NotReceivedMailPage from 'pages/NotReceivedMailPage';
import WithdrawalPage from 'pages/WithdrawalPage';
import PrivacyPolicyPage from 'pages/PrivacyPolicyPage';
import TermsOfServicePage from 'pages/TermsOfServicePage';

export type SettingTabStackParamList = {
  SettingPage: undefined;
  AccountSettingPage: undefined;
  NotificationSettingPage: undefined;
  NoticeListPage: undefined;
  CustommerSupportPage: undefined;
  ModifyNickNamePage: undefined;
  ModifyEmailPage: undefined;
  ModifyPasswordPage: undefined;
  VersionInfoPage: undefined;
  DirectInquiryPage: undefined;
  TutorialReplayPage: undefined;
  TermsOfServicePage: undefined;
  PrivacyPolicyPage: undefined;
  NotReceivedMailPage: {
    usePostVerificationEmail: UseMutationResult<
      ApiResponse<PostVerificationEmailResponse>,
      AxiosError<unknown, any>,
      PostVerificationEmailParams,
      unknown
    >;
    email: string;
  };
  WithdrawalPage: undefined;
};

const Stack = createNativeStackNavigator<SettingTabStackParamList>();

const SettingTab = () => {
  return (
    <Stack.Navigator
      initialRouteName="SettingPage"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SettingPage" component={SettingPage} />
      <Stack.Screen name="AccountSettingPage" component={AccountSettingPage} />
      <Stack.Screen name="NotificationSettingPage" component={NotificationSettingPage} />
      <Stack.Screen name="NoticeListPage" component={NoticeListPage} />
      <Stack.Screen name="CustommerSupportPage" component={CustommerSupportPage} />
      <Stack.Screen name="ModifyNickNamePage" component={ModifyNickNamePage} />
      <Stack.Screen name="ModifyEmailPage" component={ModifyEmailPage} />
      <Stack.Screen name="ModifyPasswordPage" component={ModifyPasswordPage} />
      <Stack.Screen name="DirectInquiryPage" component={DirectInquiryPage} />
      <Stack.Screen name="NotReceivedMailPage" component={NotReceivedMailPage} />
      <Stack.Screen name="WithdrawalPage" component={WithdrawalPage} />
      <Stack.Screen name="TermsOfServicePage" component={TermsOfServicePage} />
      <Stack.Screen name="PrivacyPolicyPage" component={PrivacyPolicyPage} />
    </Stack.Navigator>
  );
};

export default SettingTab;
