import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useRecoilState } from 'recoil';
import { AddPlanChart, PlanChart, PlanNotification, Repeats } from '../../../types/chart';
import PlemText from '../../components/Atoms/PlemText';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import { addPlanState } from '../../states/addPlanState';
import { MainTabStackParamList } from '../../tabs/MainTab';

type PlanNotiOptionKor = '없음' | '이벤트 당시' | '5분 전' | '10분 전' | '15분 전' | '30분 전' | '1시간 전';

export type PlanNotiOptionItem = {
  key: PlanNotification;
  label: PlanNotiOptionKor;
};

export const notiOptiosList: PlanNotiOptionItem[] = [
  { key: 0, label: '없음' },
  { key: 1, label: '이벤트 당시' },
  { key: 5, label: '5분 전' },
  { key: 10, label: '10분 전' },
  { key: 15, label: '15분 전' },
  { key: 30, label: '30분 전' },
  { key: 60, label: '1시간 전' },
];

type SetPlanNotificationPageProps = NativeStackScreenProps<MainTabStackParamList, 'SetPlanNotificationPage'>;

const checkImage = require('../../assets/images/check.png');

const SetPlanNotificationPage = ({ navigation }: SetPlanNotificationPageProps) => {
  const [plan, setPlan] = useRecoilState(addPlanState);
  const [notification, setNotification] = useState<PlanNotification>(plan.notification);

  const onPressRepeatOption = (option: PlanNotification) => {
    setNotification(option);
  };

  const setStorageChartData = async (chartData: AddPlanChart) => {
    await AsyncStorage.setItem('chart_data', JSON.stringify(chartData));
  };

  const onPressBottomButton = () => {
    setPlan({ ...plan, notification });
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
              {notification === option.key && <Image source={checkImage} />}
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
    backgroundColor: '#F4F1E8',
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

export default SetPlanNotificationPage;
