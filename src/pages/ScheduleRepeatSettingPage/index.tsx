import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRecoilState } from 'recoil';
import { Repeat } from 'types/calendar';
import PlemText from 'components/Atoms/PlemText';
import BottomButton from 'components/BottomButton';
import Header from 'components/Header';
import { MAIN_COLOR } from 'constants/colors';
import { addScheduleState } from 'states/addScheduleState';
import { CalendarTabStackParamList } from 'tabs/CalendarTab';
import CheckSvg from 'assets/images/check_32x32.svg';
import PlemButton from 'components/Atoms/PlemButton';
import { DropdownWithLabel } from 'components/DropdownWithLabel';
import { DropdownItem } from 'components/Dropdown';
import ArrowDownSvg from 'assets/images/arrow_down_32x32.svg';
import dayjs, { Dayjs } from 'dayjs';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import UnderlineSvg from 'assets/images/underline.svg';

type RepeatOptionKor = '안 함' | '매일' | '화요일마다' | '매주' | '2주마다' | '매월' | '매년' | '사용자화';

export const repeatOptionList: readonly { value: Repeat; label: RepeatOptionKor }[] = [
  { value: null, label: '안 함' },
  { value: 'every', label: '매일' },
  { value: 'week', label: '매주' },
  { value: 'twoWeeks', label: '2주마다' },
  { value: 'month', label: '매월' },
  { value: 'year', label: '매년' },
  // { value: 'custom', label: '사용자화' },
] as const;

const repeatEndDateList: DropdownItem<string | null>[] = [
  { value: null, label: '안 함' },
  { value: 'date', label: '날짜' },
] as const;

type RepeatSettingPageProps = NativeStackScreenProps<CalendarTabStackParamList, 'ScheduleRepeatSettingPage'>;

const ScheduleRepeatSettingPage = ({ navigation }: RepeatSettingPageProps) => {
  const [schedule, setSchedule] = useRecoilState(addScheduleState);
  const [repeatOption, setRepeatOption] = useState<Repeat>(schedule.repeats);
  const [repeatEndDateType, setRepeatEndDateType] = useState<DropdownItem<string | null>>(
    schedule.repeatEndDate ? repeatEndDateList[1] : repeatEndDateList[0]
  );

  const [openHandleRepeatEndDateList, setOpenHandleRepeatEndDateList] = useState(false);
  const [repeatEndDate, setRepeatEndDate] = useState<Dayjs | null>(
    schedule.repeatEndDate ? dayjs(schedule.repeatEndDate) : null
  );
  // const repeatEndDate = schedule.repeatEndDate ? dayjs(schedule.repeatEndDate) : null;
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);

  const onPressRepeatOption = (option: Repeat) => {
    setRepeatOption(option);
    if (!option) {
      setRepeatEndDateType(repeatEndDateList[0]);
      setRepeatEndDate(null);
    }
    // TODO: 사용자화 반복 설정 보류
    // if (option === 'custom') {
    //   navigation.navigate('RepeatCustomSettingPage');
    // }
  };

  const onPressBottomButton = () => {
    const copiedSchedule = { ...schedule };
    copiedSchedule.repeats = repeatOption;
    copiedSchedule.repeatEndDate =
      repeatEndDateType.value === 'date' && repeatEndDate ? repeatEndDate.toISOString() : null;
    setSchedule(copiedSchedule);
    // setSchedule({ ...schedule, repeatEndDate: dayjs(date).startOf('day').toISOString() });

    navigation.goBack();
  };

  const handleRepeatEndDateList = (item: DropdownItem<string | null>) => {
    setRepeatEndDateType(item);
    setRepeatEndDate(item.value === 'date' ? dayjs(schedule.startDate) : null);
    setOpenHandleRepeatEndDateList(false);
  };

  const handleRepeatEndDateListPress = () => {
    setOpenHandleRepeatEndDateList(!openHandleRepeatEndDateList);
  };

  const handleEndDateConfirm = (date: Date) => {
    setRepeatEndDate(dayjs(date));
    setOpenEndDatePicker(false);
  };

  return (
    <>
      <Header title="반복 설정" />
      <View style={styles.page}>
        <View style={styles.listWrap}>
          {repeatOptionList.map((repeat) => {
            return (
              <PlemButton key={repeat.value} style={styles.listItem} onPress={() => onPressRepeatOption(repeat.value)}>
                <PlemText>{repeat.label}</PlemText>
                {repeatOption === repeat.value && <CheckSvg />}
              </PlemButton>
            );
          })}
        </View>
        {repeatOption && (
          <View style={{ marginTop: 32 }}>
            <DropdownWithLabel<string | null>
              label="반복 종료"
              list={repeatEndDateList}
              onChange={handleRepeatEndDateList}
              onPressRow={handleRepeatEndDateListPress}
              open={openHandleRepeatEndDateList}
              value={repeatEndDateType}
              size="small"
            />
            {repeatEndDate && (
              <View style={styles.dateInputWrap}>
                <PlemText style={{ fontSize: 14 }}>반복 종료일</PlemText>
                <PlemButton style={styles.dateInput} onPress={() => setOpenEndDatePicker(true)}>
                  <PlemText>{repeatEndDate.format('YY.MM.DD')}</PlemText>
                  <ArrowDownSvg style={styles.arrowDownImage} />
                </PlemButton>
                <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#000'} style={styles.underline} />
              </View>
            )}
          </View>
        )}
      </View>
      {repeatEndDate && (
        <DateTimePickerModal
          isVisible={openEndDatePicker}
          mode="date"
          onConfirm={handleEndDateConfirm}
          onCancel={() => setOpenEndDatePicker(false)}
          date={repeatEndDate.toDate()}
          locale="ko-KR"
          minimumDate={dayjs(schedule.startDate).toDate()}
        />
      )}
      <BottomButton title={'완료'} onPress={onPressBottomButton} />
    </>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: MAIN_COLOR,
    flex: 1,
    paddingHorizontal: 16,
  },
  listWrap: {},
  listItem: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoMessageWrap: {
    marginTop: 4,
  },
  infoMessage: {
    color: '#888888',
  },
  arrowDownImage: {
    marginLeft: 8,
  },
  dateInputWrap: {
    marginTop: 32,
  },
  dateInput: {
    height: 44,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  underline: {},
});

export default ScheduleRepeatSettingPage;
