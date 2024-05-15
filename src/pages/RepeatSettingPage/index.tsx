import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRecoilState } from 'recoil';
import { Repeats } from 'types/chart';
import { DaysOfWeekKor } from 'types/date';
import PlemText from 'components/Atoms/PlemText';
import BottomButton from 'components/BottomButton';
import Header from 'components/Header';
import { MAIN_COLOR } from 'constants/colors';
import { addPlanChartState } from 'states/addPlanChartState';
import { repeatDaysDefault, repeatDatesState } from 'states/repeatDatesState';
import { MainTabStackParamList } from 'tabs/MainTab';
import CheckSvg from 'assets/images/check_32x32.svg';
import PlemButton from 'components/Atoms/PlemButton';
import { logEvent } from 'helper/analytics';

import { NUMBER_TO_DAY_KOR } from 'constants/dates';

type RepeatOptionKor =
  | '안 함'
  | '월요일마다'
  | '화요일마다'
  | '수요일마다'
  | '목요일마다'
  | '금요일마다'
  | '토요일마다'
  | '일요일마다'
  | '날짜 지정';

type RepeatOptionItemValue = null | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type RepeatOptionItem = {
  value: RepeatOptionItemValue;
  label: RepeatOptionKor;
  day?: DaysOfWeekKor;
  order?: number;
};

export const repeatOptionList: RepeatOptionItem[] = [
  { value: null, label: '안 함' },
  { value: 1, label: '월요일마다', day: '월', order: 1 },
  { value: 2, label: '화요일마다', day: '화', order: 2 },
  { value: 3, label: '수요일마다', day: '수', order: 3 },
  { value: 4, label: '목요일마다', day: '목', order: 4 },
  { value: 5, label: '금요일마다', day: '금', order: 5 },
  { value: 6, label: '토요일마다', day: '토', order: 6 },
  { value: 0, label: '일요일마다', day: '일', order: 7 },
  { value: 7, label: '날짜 지정' },
];

type RepeatSettingPageProps = NativeStackScreenProps<MainTabStackParamList, 'RepeatSettingPage'>;

const RepeatSettingPage = ({ navigation }: RepeatSettingPageProps) => {
  const [chart, setChart] = useRecoilState(addPlanChartState);
  const [repeatOptions, setRepeatOptions] = useState<Repeats>(chart.repeats);
  const [repeatDates, setRepeatDays] = useRecoilState(repeatDatesState);

  useEffect(() => {
    setRepeatDays(chart.repeatDates ? [...chart.repeatDates] : []);
    return () => setRepeatDays(repeatDaysDefault);
  }, []);

  const onPressRepeatOption = (option: RepeatOptionItemValue) => {
    if (option === null) {
      logEvent('RepeatSettingPage_onPressRepeatOption', { option: '안 함 선택' });
      setRepeatOptions([null]);
      return;
    }
    if (option === 7) {
      setRepeatOptions([7]);
      navigation.navigate('SelectRepeatDatePage');
      logEvent('RepeatSettingPage_onPressRepeatOption', { option: '날짜 지정 선택' });
      return;
    }
    if (repeatOptions.includes(option)) {
      const copiedOptions = [...repeatOptions];
      const index = copiedOptions.findIndex((e) => e === option);
      copiedOptions.splice(index, 1);
      logEvent('RepeatSettingPage_onPressRepeatOption', {
        option: `${NUMBER_TO_DAY_KOR[option]} 선택 해제`,
      });
      if (copiedOptions.length === 0) {
        setRepeatOptions([null]);
        return;
      }
      setRepeatOptions(copiedOptions);
      return;
    }
    setRepeatOptions(repeatOptions.concat([option]).filter((e) => !(e === 7 || e === null)));
    logEvent('RepeatSettingPage_onPressRepeatOption', {
      option: `${NUMBER_TO_DAY_KOR[option]} 선택`,
    });
  };

  const onPressBottomButton = () => {
    const copiedChart = { ...chart };
    copiedChart.repeats = repeatOptions;
    if (!repeatOptions.includes(7)) {
      copiedChart.repeatDates = [];
    } else {
      copiedChart.repeatDates = repeatDates;
    }
    setChart(copiedChart);

    navigation.goBack();
  };

  return (
    <View style={styles.page}>
      <Header title="반복" />
      <View style={styles.listWrap}>
        {repeatOptionList.map((repeat) => {
          return (
            <PlemButton key={repeat.value} style={styles.listItem} onPress={() => onPressRepeatOption(repeat.value)}>
              <PlemText>{repeat.label}</PlemText>
              {repeatOptions.includes(repeat.value) && <CheckSvg />}
            </PlemButton>
          );
        })}
        <View style={styles.infoMessageWrap}>
          {repeatOptions.includes(7) && repeatDates && repeatDates.length > 0 && (
            <PlemText style={styles.infoMessage}>매월 {repeatDates.join('일, ')}일 마다 반복됩니다</PlemText>
          )}
        </View>
      </View>
      <BottomButton title={'완료'} onPress={onPressBottomButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: MAIN_COLOR,
    flex: 1,
  },
  listWrap: {
    paddingHorizontal: 15,
  },
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
});

export default RepeatSettingPage;
