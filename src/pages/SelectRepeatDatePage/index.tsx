import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Dimensions, ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import { useRecoilState } from 'recoil';
import PlemText from '../../components/Atoms/PlemText';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import { MAIN_COLOR } from '../../constants/colors';
import { repeatDatesState } from '../../states/repeatDatesState';
import { MainTabStackParamList } from '../../tabs/MainTab';

const calendarStickerImage = require('../../assets/images/calendar_sticker.png');

type SelectRepeatDatePageProps = NativeStackScreenProps<MainTabStackParamList, 'SelectRepeatDatePage'>;

const SelectRepeatDatePage = ({ navigation }: SelectRepeatDatePageProps) => {
  const [repeatDates, setRepeatDays] = useRecoilState(repeatDatesState);
  const [selectedDays, setSelectedDays] = useState(repeatDates ? [...repeatDates] : []);

  const renderDaysOfMonth = () => {
    const days = [];

    for (let i = 1; i < 32; i++) {
      const isSelected = selectedDays.includes(i);
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
    if (selectedDays.includes(day)) {
      const index = selectedDays.findIndex((e) => e === day);
      selectedDays.splice(index, 1);
    } else {
      selectedDays.push(day);
    }

    const sortedRepeatDays = selectedDays.sort((a, b) => a - b);
    setRepeatDays([...sortedRepeatDays]);
  };

  const onPressComplete = () => {
    setSelectedDays(selectedDays);
    navigation.goBack();
  };

  return (
    <View style={styles.page}>
      <Header title="날짜 지정" />
      <PlemText style={styles.notice}>
        {'계획표가 중복되는 경우, 날짜 지정 반복으로\n설정된 계획표가 우선으로 노출됩니다.'}
      </PlemText>
      <View style={styles.daysOfMonthWrap}>{renderDaysOfMonth()}</View>
      <View style={styles.infoMessageWrap}>
        {selectedDays.length > 0 ? (
          <PlemText style={styles.infoMessage}>매월 {selectedDays.join('일, ')}일 마다 반복됩니다</PlemText>
        ) : null}
      </View>
      <BottomButton title={'완료'} disabled={selectedDays.length === 0} onPress={onPressComplete} />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: MAIN_COLOR,
    flex: 1,
  },
  daysOfMonthWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
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
  notice: {
    lineHeight: 22,
    marginLeft: 20,
    marginTop: 12,
    color: '#444444',
  },
});

export default SelectRepeatDatePage;
