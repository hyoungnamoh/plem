import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useRecoilState } from 'recoil';
import PlemText from '../../components/Atoms/PlemText';
import BottomButton from '../../components/BottomButton';
import { DropdownItem } from '../../components/Dropdown';
import { DropdownWithLabel } from '../../components/DropdownWithLabel';
import Header from '../../components/Header';
import { MAIN_COLOR } from '../../constants/colors';
import { DAYS_OF_WEEK, NUMBER_TO_DAY_KOR } from '../../constants/dates';
import { addScheduleState } from '../../states/addScheduleState';
import { CalendarTabStackParamList } from '../../tabs/CalendarTab';
import { DaysOfWeekNum } from '../../../types/date';
import MonthlyRepetition, { WEEK_LIST } from './MonthlyRepetition';
import WeeklyRepetition from './WeeklyRepetition';
import YearlyRepetition from './YearlyRepetition';
import { RepeatSpecificCondition, RepeatUnit, RepeatUnitKor } from '../../../types/calendar';

type RepeatSettingPageProps = NativeStackScreenProps<CalendarTabStackParamList, 'RepeatCustomSettingPage'>;

const REPAET_CYCLE_LIST: { label: string; value: RepeatUnit }[] = [
  { label: '일', value: 'day' },
  { label: '주', value: 'week' },
  { label: '월', value: 'month' },
  { label: '년', value: 'year' },
];

const RepeatCustomSettingPage = ({ navigation }: RepeatSettingPageProps) => {
  const [schedule, setSchedule] = useRecoilState(addScheduleState);

  const [repeatCycle, setRepeatCycle] = useState<DropdownItem>(REPAET_CYCLE_LIST[0]);
  const [cycle, setCycle] = useState<DropdownItem>({ label: '1일', value: 1 });
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [repeatCondition, setRepeatCondition] = useState<null | RepeatSpecificCondition>(null);

  const [openCycleList, setOpenCycleList] = useState(false);
  const [openCycle, setOpenCycle] = useState(false);
  const [repeatUnit, setRepeatUnit] = useState<RepeatUnitKor>('일');

  useEffect(() => {
    if (repeatCycle.value !== 'week') {
      setSelectedDates([]);
    }
    setCycle({ label: `1${repeatUnit}`, value: 1 });
  }, [repeatCycle, repeatUnit]);

  useEffect(() => {
    switch (repeatCycle.value) {
      case 'day':
        setRepeatUnit('일');
        break;
      case 'week':
        setRepeatUnit('주');
        break;
      case 'month':
        setRepeatUnit('개월');
        break;
      case 'year':
        setRepeatUnit('년');
        break;
      default:
        break;
    }
  }, [repeatCycle]);

  const onPressBottomButton = () => {
    const copiedSchedule = { ...schedule };
    if (repeatCondition) {
      copiedSchedule.customRepeat = repeatCondition;
      return;
    }
    copiedSchedule.customRepeat = { unit: repeatCycle.value as RepeatUnit, value: selectedDates };
    setSchedule(copiedSchedule);

    navigation.goBack();
  };

  const onPressCycleList = () => {
    setOpenCycleList(!openCycleList);
    setOpenCycle(false);
  };

  const onPressCycle = () => {
    setOpenCycle(!openCycle);
    setOpenCycleList(false);
  };

  const onChangeRepeatCycle = (item: DropdownItem) => {
    setRepeatCycle(item);
    setOpenCycleList(false);
  };

  const onChangeCycle = (item: DropdownItem) => {
    setCycle(item);
    setOpenCycle(false);
  };

  const getCycleList = () => {
    return Array.from(new Array(999).fill(0), (_, index) => {
      return {
        label: `${index + 1}${repeatUnit}`,
        value: index + 1,
      };
    });
  };

  const closeAllDropdown = () => {
    setOpenCycleList(false);
    setOpenCycle(false);
  };

  const getDescription = () => {
    if (repeatCycle.value === 'day') {
      return `이벤트가 ${cycle.label}마다 반복돼요!`;
    }
    if (repeatCycle.value === 'week') {
      const isWeekend = selectedDates.toString() === [0, 6].toString();
      return `이벤트가 ${cycle.label}${
        isWeekend ? '주말' : selectedDates.map((date) => ` ${DAYS_OF_WEEK[date].value}`)
      }요일마다 반복돼요!`;
    }
    if (repeatCycle.value === 'month' && repeatCondition) {
      return `이벤트가 ${cycle.label}마다 ${WEEK_LIST.find((week) => week.value === repeatCondition.week)?.label}주 ${
        NUMBER_TO_DAY_KOR[repeatCondition.day]
      }에 반복돼요!`;
    }
    if (repeatCycle.value === 'month' && selectedDates.length > 0) {
      return `이벤트가 ${cycle.label}마다 ${selectedDates.map((date) => `${date}월`)}에 반복돼요!`;
    }
    if (repeatCycle.value === 'year' && selectedDates.length > 0) {
      return `이벤트가 ${cycle.label}마다 ${selectedDates.map((date) => `${date}월`)}에 반복돼요!`;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={closeAllDropdown}>
      <View style={styles.page}>
        <Header title="사용자화" />
        <View style={styles.content}>
          <View style={{ marginTop: 20, zIndex: 200 }}>
            <DropdownWithLabel
              label="반복주기"
              open={openCycleList}
              list={REPAET_CYCLE_LIST}
              onPressRow={onPressCycleList}
              onChange={onChangeRepeatCycle}
              value={repeatCycle}
            />
          </View>
          <View style={{ marginTop: 32, zIndex: 100 }}>
            <DropdownWithLabel
              label={repeatCycle.label}
              open={openCycle}
              list={getCycleList()}
              scrollViewProps={{ style: { height: 184 } }}
              onPressRow={onPressCycle}
              onChange={onChangeCycle}
              value={cycle}
            />
          </View>
          <PlemText
            style={{
              fontSize: 14,
              color: '#888888',
              marginTop: 1,
            }}>
            {getDescription()}
          </PlemText>
          {repeatCycle.value === 'week' && (
            <WeeklyRepetition selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
          )}
          {repeatCycle.value === 'month' && (
            <MonthlyRepetition
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              setRepeatCondition={setRepeatCondition}
            />
          )}
          {repeatCycle.value === 'year' && (
            <YearlyRepetition selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
          )}
        </View>
        <BottomButton title={'완료'} onPress={onPressBottomButton} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: MAIN_COLOR,
  },
  content: {
    paddingHorizontal: 15,
  },
});

export default RepeatCustomSettingPage;
