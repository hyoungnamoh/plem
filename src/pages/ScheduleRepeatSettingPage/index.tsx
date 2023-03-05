import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useRecoilState } from 'recoil';
import { AddSchedule, Repeat } from '../../../types/calendar';
import PlemText from '../../components/Atoms/PlemText';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import { MAIN_COLOR } from '../../constants/color';
import { addScheduleState } from '../../states/addScheduleState';
import { CalendarTabStackParamList } from '../../tabs/CalendarTab';

type RepeatOptionKor = '안 함' | '매일' | '화요일마다' | '매주' | '2주마다' | '매월' | '매년' | '사용자화';

export const repeatOptionList: readonly { value: Repeat; label: RepeatOptionKor }[] = [
  { value: null, label: '안 함' },
  { value: 'every', label: '매일' },
  { value: 'week', label: '매주' },
  { value: '2weeks', label: '2주마다' },
  { value: 'month', label: '매월' },
  { value: 'year', label: '매년' },
  { value: 'custom', label: '사용자화' },
] as const;

type RepeatSettingPageProps = NativeStackScreenProps<CalendarTabStackParamList, 'ScheduleRepeatSettingPage'>;

const checkImage = require('../../assets/images/check.png');

const ScheduleRepeatSettingPage = ({ navigation }: RepeatSettingPageProps) => {
  const [schedule, setSchedule] = useRecoilState(addScheduleState);
  const [repeatOption, setRepeatOption] = useState<Repeat>(schedule.repeat);

  useEffect(() => {}, []);

  const onPressRepeatOption = (option: Repeat) => {
    setRepeatOption(option);
    if (option === 'custom') {
      navigation.navigate('RepeatCustomSettingPage');
    }
  };

  const onPressBottomButton = () => {
    const copiedSchedule = { ...schedule };
    copiedSchedule.repeat = repeatOption;
    setSchedule(copiedSchedule);

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
              {repeatOption === repeat.value && <Image source={checkImage} />}
            </Pressable>
          );
        })}
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

export default ScheduleRepeatSettingPage;
