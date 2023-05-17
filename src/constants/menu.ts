import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TextProps } from 'react-native';
import { SettingTabStackParamList } from '../tabs/SettingTab';

export type MenuItem = {
  title: string;
  value?: keyof SettingTabStackParamList;
  label?: string;
  labelProps?: TextProps;
  arrow?: boolean;
};

export const SETTING_PAGE_MENUS: MenuItem[] = [
  { title: '계정 설정', value: 'AccountSettingPage' },
  { title: '알림', value: 'NotificationSettingPage' },
  { title: '공지사항', value: 'NoticeListPage' },
  { title: '고객 지원', value: 'CustommerSupportPage' },
];

export const ACCOUNT_SETTING_PAGE_MENUES: MenuItem[] = [
  { title: '닉네임', value: 'ModifyNickNamePage' },
  { title: '이메일 변경', value: 'ModifyEmailPage' },
  { title: '비밀번호 변경', value: 'ModifyPasswordPage' },
];

export const CUSTOMMER_SUPPORT_PAGE_MENUES: MenuItem[] = [
  { title: '버전정보', value: 'VersionInfoPage' },
  { title: '1:1 문의', value: 'DirectInquiryPage' },
  { title: '튜토리얼 다시 보기', value: 'TutorialReplayPage' },
  { title: '서비스 이용약관', value: 'UsingServiceTermPage' },
  { title: '개인 정보 처리 방침', value: 'PrivateInfoTermPage' },
];
