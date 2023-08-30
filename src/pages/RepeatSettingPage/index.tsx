import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useRecoilState } from 'recoil';
import { AddPlanChart, Repeats } from '../../../types/chart';
import { DaysOfWeek, DaysOfWeekKor } from '../../../types/date';
import PlemText from '../../components/Atoms/PlemText';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import { MAIN_COLOR } from '../../constants/colors';
import { addPlanChartState } from '../../states/addPlanChartState';
import { repeatDaysDefault, repeatDaysState } from '../../states/repeatDaysState';
import { MainTabStackParamList } from '../../tabs/MainTab';

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
};

export const repeatOptionList: RepeatOptionItem[] = [
  { value: null, label: '안 함' },
  { value: 0, label: '일요일마다', day: '일' },
  { value: 1, label: '월요일마다', day: '월' },
  { value: 2, label: '화요일마다', day: '화' },
  { value: 3, label: '수요일마다', day: '수' },
  { value: 4, label: '목요일마다', day: '목' },
  { value: 5, label: '금요일마다', day: '금' },
  { value: 6, label: '토요일마다', day: '토' },
  { value: 7, label: '날짜 지정' },
];

type RepeatSettingPageProps = NativeStackScreenProps<MainTabStackParamList, 'RepeatSettingPage'>;

const checkImage = require('../../assets/images/check.png');

const RepeatSettingPage = ({ navigation }: RepeatSettingPageProps) => {
  const [chart, setChart] = useRecoilState(addPlanChartState);
  const [repeatOptions, setRepeatOptions] = useState<Repeats>(chart.repeats);
  // const [repeatDays, setSelectedDays] = useState<number[]>(chart.repeatDays ? [...chart.repeatDays] : []);
  const [repeatDays, setRepeatDays] = useRecoilState(repeatDaysState);

  useEffect(() => {
    setRepeatDays(chart.repeatDays ? [...chart.repeatDays] : []);
    return () => setRepeatDays(repeatDaysDefault);
  }, []);

  const onPressRepeatOption = (option: RepeatOptionItemValue) => {
    if (option === null) {
      setRepeatOptions([null]);
      return;
    }
    if (option === 7) {
      setRepeatOptions([7]);
      navigation.navigate('SelectRepeatDatePage');
      return;
    }
    if (repeatOptions.includes(option)) {
      const copiedOptions = [...repeatOptions];
      const index = copiedOptions.findIndex((e) => e === option);
      copiedOptions.splice(index, 1);
      setRepeatOptions(copiedOptions);
      return;
    }
    setRepeatOptions(repeatOptions.concat([option]).filter((e) => !(e === 7 || e === null)));
  };

  const setStorageChartData = async (chartData: AddPlanChart) => {
    await AsyncStorage.setItem('chart_data', JSON.stringify(chartData));
  };

  const onPressBottomButton = () => {
    const copiedChart = { ...chart };
    copiedChart.repeats = repeatOptions;
    if (!repeatOptions.includes(7)) {
      copiedChart.repeatDays = [];
    } else {
      copiedChart.repeatDays = repeatDays;
    }
    setChart(copiedChart);
    setStorageChartData(copiedChart);

    navigation.goBack();
  };

  return (
    <View style={styles.page}>
      <Header title="반복" />
      <View style={styles.listWrap}>
        {repeatOptionList.map((repeat) => {
          return (
            <Pressable key={repeat.value} style={styles.listItem} onPress={() => onPressRepeatOption(repeat.value)}>
              <PlemText>{repeat.label}</PlemText>
              {repeatOptions.includes(repeat.value) && <Image source={checkImage} />}
            </Pressable>
          );
        })}
        <View style={styles.infoMessageWrap}>
          {repeatOptions.includes(7) && repeatDays && repeatDays.length > 0 && (
            <PlemText style={styles.infoMessage}>매월 {repeatDays.join('일, ')}일 마다 반복됩니다</PlemText>
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
