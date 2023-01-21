import { atom, useRecoilState } from 'recoil';

type TimePickerState = {
  visible: boolean;
  onPress?: () => void;
};

export const timePickerDefault = { visible: false };

export const timePickerState = atom<TimePickerState>({
  key: 'timePicker',
  default: timePickerDefault,
});
