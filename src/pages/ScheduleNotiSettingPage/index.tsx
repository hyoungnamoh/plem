import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRecoilState } from 'recoil';
import { PlanNotification, PlanNotiOptionItem } from 'types/chart';
import PlemText from 'components/Atoms/PlemText';
import BottomButton from 'components/BottomButton';
import Header from 'components/Header';
import { MAIN_COLOR } from 'constants/colors';
import { addScheduleState } from 'states/addScheduleState';
import { CalendarTabStackParamList } from 'tabs/CalendarTab';
import CheckSvg from 'assets/images/check_32x32.svg';

export const notiOptiosList: PlanNotiOptionItem[] = [
  { key: null, label: '없음' },
  { key: '0', label: '이벤트 당시' },
  { key: '5', label: '5분 전' },
  { key: '10', label: '10분 전' },
  { key: '15', label: '15분 전' },
  { key: '30', label: '30분 전' },
  { key: '60', label: '1시간 전' },
];

type SetScheduleNotificationPageProps = NativeStackScreenProps<CalendarTabStackParamList, 'ScheduleNotiSettingPage'>;

const ScheduleNotiSettingPage = ({ navigation }: SetScheduleNotificationPageProps) => {
  const [schedule, setSchedule] = useRecoilState(addScheduleState);
  // const [schedule, setSchedule] = useRecoilState(addPlanState);
  const [notification, setNotification] = useState<PlanNotification>(schedule.notification);

  const onPressRepeatOption = (option: PlanNotification) => {
    setNotification(option);
  };

  const onPressBottomButton = () => {
    setSchedule({ ...schedule, notification });
    navigation.goBack();
  };

  return (
    <View style={styles.page}>
      <Header title="알림" />
      <View style={styles.listWrap}>
        {notiOptiosList.map((option) => {
          return (
            <Pressable key={option.key} style={styles.listItem} onPress={() => onPressRepeatOption(option.key)}>
              <PlemText>{option.label}</PlemText>
              {notification === option.key && <CheckSvg />}
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

export default ScheduleNotiSettingPage;
