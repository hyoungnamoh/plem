import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRecoilState } from 'recoil';
import { AddPlanChart, PlanNotification, PlanNotiOptionItem } from 'types/chart';
import PlemText from 'components/Atoms/PlemText';
import BottomButton from 'components/BottomButton';
import Header from 'components/Header';
import { MAIN_COLOR } from 'constants/colors';
import { addPlanState } from 'states/addPlanState';
import { MainTabStackParamList } from 'tabs/MainTab';
import CheckSvg from 'assets/images/check_32x32.svg';
import PlemButton from 'components/Atoms/PlemButton';

export const notiOptiosList: PlanNotiOptionItem[] = [
  { key: null, label: '없음' },
  { key: '0', label: '이벤트 당시' },
  { key: '5', label: '5분 전' },
  { key: '10', label: '10분 전' },
  { key: '15', label: '15분 전' },
  { key: '30', label: '30분 전' },
  { key: '60', label: '1시간 전' },
];

type SetPlanNotificationPageProps = NativeStackScreenProps<MainTabStackParamList, 'PlanNotiSettingPage'>;

const PlanNotiSettingPage = ({ navigation }: SetPlanNotificationPageProps) => {
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
            <PlemButton key={option.key} style={styles.listItem} onPress={() => onPressRepeatOption(option.key)}>
              <PlemText>{option.label}</PlemText>
              {notification === option.key && <CheckSvg />}
            </PlemButton>
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

export default PlanNotiSettingPage;
