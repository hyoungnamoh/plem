import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingTabStackParamList } from '../tabs/SettingTab';

export type MenuItem = {
  title: string;
  value: keyof SettingTabStackParamList;
  label?: string;
};

export const SETTING_PAGE_MENUS: MenuItem[] = [
  { title: '계정 설정', value: 'AccountSettingPage' },
  { title: '알림', value: 'NotificationSettingPage' },
  { title: '공지사항', value: 'NoticeListPage' },
  { title: '고객지원', value: 'CustommerSupportPage' },
];

export const ACCOUNT_SETTING_PAGE_MENUES: MenuItem[] = [
  { title: '닉네임', value: 'ModifyNickNamePage' },
  { title: '이메일 변경', value: 'ModifyEmailPage' },
  { title: '비밀번호 변경', value: 'ModifyPasswordPage' },
];
