import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Dimensions, Image, ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import { useRecoilState } from 'recoil';
import { AddPlanChart } from '../../../types/chart';
import PlemText from '../../components/Atoms/PlemText';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import { addPlanChartState } from '../../states/addPlanChartState';
import { MainTabStackParamList } from '../../tabs/MainTab';

const calendarStickerImage = require('../../assets/images/calendar_sticker.png');

type SelectRepeatDatePageProps = NativeStackScreenProps<MainTabStackParamList, 'SelectRepeatDatePage'>;

const SelectRepeatDatePage = ({ navigation }: SelectRepeatDatePageProps) => {
  const [chart, setChart] = useRecoilState(addPlanChartState);

  const renderDaysOfMonth = () => {
    const days = [];
    const repeatDays = [...chart.repeatDays];

    for (let i = 1; i < 32; i++) {
      const isSelected = repeatDays.includes(i);
      days.push(
        <Pressable key={`day_${i}`} style={styles.dayButton} onPress={() => onPressDay(i)}>
          {isSelected ? (
            <ImageBackground source={calendarStickerImage} style={styles.dayBackgroundImage}>
              <PlemText style={styles.selectedDayText}>{i}</PlemText>
            </ImageBackground>
          ) : (
            <PlemText>{i}</PlemText>
          )}
        </Pressable>
      );
    }

    return days;
  };

  const onPressDay = (day: number) => {
    const repeatDays = [...chart.repeatDays];

    if (repeatDays.includes(day)) {
      const index = repeatDays.findIndex((e) => e === day);
      repeatDays.splice(index, 1);
    } else {
      repeatDays.push(day);
    }

    const sortedRepeatDays = repeatDays.sort((a, b) => a - b);
    setChart({ ...chart, repeatDays: sortedRepeatDays });
    setChartStorage({ ...chart, repeatDays: sortedRepeatDays });
  };

  const setChartStorage = async (chartData: AddPlanChart) => {
    await AsyncStorage.setItem('chart_data', JSON.stringify(chartData));
  };

  return (
    <View style={styles.page}>
      <Header title="날짜 지정" />
      <View style={styles.daysOfMonthWrap}>{renderDaysOfMonth()}</View>
      <View style={styles.infoMessageWrap}>
        {chart.repeatDays.length > 0 && (
          <PlemText style={styles.infoMessage}>매월 {chart.repeatDays.join('일, ')}일 마다 반복됩니다</PlemText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#F4F1E8',
    flex: 1,
  },
  daysOfMonthWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  infoMessageWrap: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  infoMessage: {
    color: '#888888',
  },
  dayButton: {
    width: Math.floor(Dimensions.get('screen').width / 7),
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
  },
  dayBackgroundImage: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayText: {
    color: '#fff',
  },
});

export default SelectRepeatDatePage;
