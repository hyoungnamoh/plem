import { WithdrawalReason } from 'api/users/deleteUserApi';
import { DropdownItem } from 'components/Dropdown';

export const WITHDRAWAL_REASON_LIST: DropdownItem<WithdrawalReason | ''>[] = [
  { label: '탈퇴 사유를 선택해 주세요.', value: '' },
  { label: '기록을 삭제하고 싶어요.', value: 'remove_data' },
  { label: '이용이 불편해요.', value: 'experience' },
  { label: '다른 앱을 사용하고 있어요.', value: 'another_app' },
  { label: '사용 빈도가 낮아요.', value: 'frequency' },
  { label: '기타 (직접 입력)', value: 'etc' },
];
