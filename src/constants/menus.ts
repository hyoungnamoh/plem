import { TextProps } from 'react-native';

export type MenuItem = {
  title: string;
  value:
    | typeof SETTING_PAGE_MENUS[number]['value']
    | typeof ACCOUNT_SETTING_PAGE_MENUES[number]['value']
    | typeof CUSTOMMER_SUPPORT_PAGE_MENUES[number]['value'];
  label?: string;
  labelProps?: TextProps;
  arrow?: boolean;
};

export const SETTING_PAGE_MENUS = [
  { title: '계정 설정', value: 'AccountSettingPage' } as const,
  { title: '알림', value: 'NotificationSettingPage' } as const,
  { title: '공지사항', value: 'NoticeListPage' } as const,
  { title: '고객 지원', value: 'CustommerSupportPage' } as const,
] as const;

export const ACCOUNT_SETTING_PAGE_MENUES = [
  { title: '닉네임', value: 'ModifyNickNamePage' } as const,
  { title: '이메일 변경', value: 'ModifyEmailPage' } as const,
  { title: '비밀번호 변경', value: 'ModifyPasswordPage' } as const,
] as const;

export const CUSTOMMER_SUPPORT_PAGE_MENUES = [
  { title: '버전정보', value: 'VersionInfoPage' as const, label: '', labelProps: {}, arrow: false },
  { title: '1:1 문의', value: 'DirectInquiryPage' } as const,
  { title: '튜토리얼 다시 보기', value: 'TutorialReplayPage' } as const,
  { title: '서비스 이용약관', value: 'TermsOfServicePage' } as const,
  { title: '개인 정보 처리 방침', value: 'PrivacyPolicyPage' } as const,
];
