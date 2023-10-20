import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useRecoilState, useSetRecoilState } from 'recoil';
import PlemText from '../components/Atoms/PlemText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { MainTabStackParamList } from '../tabs/MainTab';
import { MAIN_COLOR } from '../constants/colors';
import MainSVGFrame from '../components/MainSVGFrame';
import { useFocusEffect } from '@react-navigation/native';
import { bottomSafeAreaState } from '../states/bottomSafeAreaState';
import { useGetPlanChart } from '../hooks/queries/useGetPlanChart';
import dayjs from 'dayjs';
import NotificationActiveSvg from '../assets/images/notification_active_32x32.svg';
import NotificationInactiveSvg from '../assets/images/notification_inactive_32x32.svg';
import MainLogoSvg from '../assets/images/mainpage_logo_134x40.svg';
import PlusSvg from '../assets/images/plus_40x40.svg';
import UncheckboxSvg from '../assets/images/uncheckedbox_24x24.svg';
import CheckboxSvg from '../assets/images/checkedbox_24x24.svg';
import { addPlanChartState } from '../states/addPlanChartState';

type MainPageProps = NativeStackScreenProps<MainTabStackParamList, 'MainPage'>;

const underlineImage = require('../assets/images/underline.png');
const yellowLineImage = require('../assets/images/yellow_line.png');

const MainPage = ({ navigation }: MainPageProps) => {
  const [bottomSafeArea, setBottomSafeArea] = useRecoilState(bottomSafeAreaState);
  const setChart = useSetRecoilState(addPlanChartState);
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const { data: planChartData } = useGetPlanChart({ id: 209 });

  useEffect(() => {
    setAsyncStorageData();
  }, []);

  useFocusEffect(() => {
    if (bottomSafeArea === MAIN_COLOR) {
      return;
    }
    setBottomSafeArea(MAIN_COLOR);
  });

  const setAsyncStorageData = async () => {
    const item = await AsyncStorage.getItem('plan_checked_list');
    const planCheckList = item ? JSON.parse(item) : [];
    setCheckedList(planCheckList);
  };

  const handleSubPlanPress = async (id: number) => {
    const asyncStorageItem = await AsyncStorage.getItem('plan_checked_list');
    const planCheckList: number[] = asyncStorageItem ? JSON.parse(asyncStorageItem) : [];
    const idIndex = planCheckList.findIndex((e) => e === id);

    if (idIndex < 0) {
      planCheckList.push(id);
    } else {
      planCheckList.splice(idIndex, 1);
    }

    setCheckedList(planCheckList);
    await AsyncStorage.setItem('plan_checked_list', JSON.stringify(planCheckList));
  };

  const handleAddChartPress = () => {
    navigation.navigate('AddChartPage');
  };

  const getDoItNowPlan = () => {
    if (!planChartData) {
      return { doItNowPlan: null, doItNowPlanIndex: -1 };
    }
    const doItNowPlanIndex = planChartData.data.plans.findIndex((plan) => {
      const now = dayjs();
      const startTime = dayjs().set('hour', plan.startHour).set('minute', plan.startMin).startOf('minute');
      const endTime = dayjs().set('hour', plan.endHour).set('minute', plan.endMin).startOf('minute');
      return (startTime.isSame(now) || startTime.isBefore(now)) && endTime.isAfter(now);
    });

    const doItNowPlan = doItNowPlanIndex > -1 ? planChartData.data.plans[doItNowPlanIndex] : null;

    return { doItNowPlan, doItNowPlanIndex };
  };

  const handleAddPlanPress = () => {
    if (!planChartData) {
      return;
    }
    navigation.navigate('AddChartPage', { chart: planChartData.data });
    navigation.navigate('AddPlanPage');
  };

  const handleAddSubPlanPress = () => {
    if (!planChartData) {
      return;
    }
    navigation.navigate('AddChartPage', { chart: planChartData.data });
  };

  const handlePlanPress = (planIndex: number) => {
    if (!planChartData || planIndex < 0) {
      return;
    }
    setChart(planChartData.data);
    navigation.navigate('AddChartPage', { chart: planChartData.data });
    navigation.navigate('AddPlanPage', { planIndex });
  };

  const { doItNowPlan, doItNowPlanIndex } = getDoItNowPlan();

  return (
    <View style={styles.page}>
      <View style={styles.mainHeader}>
        <Pressable>
          <MainLogoSvg />
        </Pressable>
        <Pressable onPress={handleAddChartPress}>
          <PlusSvg />
        </Pressable>
      </View>
      <MainSVGFrame chart={planChartData?.data || null} />
      <View>
        <View style={styles.doItNowHeader}>
          <PlemText style={{ fontSize: 20 }}>Do it now</PlemText>
          <PlemText style={styles.currentTimesText}>
            {doItNowPlan
              ? `${dayjs()
                  .set('hour', doItNowPlan.startHour)
                  .set('minute', doItNowPlan.startMin)
                  .format('HH:mm')} - ${dayjs()
                  .set('hour', doItNowPlan.endHour)
                  .set('minute', doItNowPlan.endMin)
                  .format('HH:mm')}`
              : null}
          </PlemText>
        </View>
        <Image source={underlineImage} style={styles.doItNowUnderline} />
        <KeyboardAwareScrollView style={{ height: '20%' }} contentContainerStyle={styles.doItNowContent}>
          {doItNowPlan ? (
            <View>
              <View style={styles.planWrap}>
                <Pressable style={styles.yellowLineText} onPress={() => handlePlanPress(doItNowPlanIndex)}>
                  <PlemText style={{ fontSize: 22.5 }}>{doItNowPlan.name}</PlemText>
                  <Image source={yellowLineImage} style={styles.yellowLine} />
                </Pressable>
                <Pressable>
                  {doItNowPlan.notification ? <NotificationActiveSvg /> : <NotificationInactiveSvg />}
                </Pressable>
              </View>
              {doItNowPlan.subPlans.map((sub) => {
                const isChecked = checkedList.includes(sub.id);
                return (
                  <Pressable key={`subPlan${sub.id}`} style={styles.subPlan} onPress={() => handleSubPlanPress(sub.id)}>
                    {isChecked ? <CheckboxSvg /> : <UncheckboxSvg />}
                    <PlemText style={{ marginLeft: 4 }}>{sub.name}</PlemText>
                  </Pressable>
                );
              })}
              <Pressable style={[styles.subPlan, { opacity: 0.3 }]} onPress={handleAddSubPlanPress}>
                <UncheckboxSvg />
                <PlemText style={{ marginLeft: 4 }}>할 일 추가하기</PlemText>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.emptyPlanNowButton} onPress={handleAddPlanPress}>
              <UncheckboxSvg />
              <PlemText style={styles.emptyPlanNowText}>계획을 등록해 주세요.</PlemText>
            </Pressable>
          )}
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: MAIN_COLOR,
    paddingHorizontal: 15,
  },
  chartWrap: {
    position: 'relative',
    alignItems: 'center',
  },
  doItNowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  doItNowUnderline: { width: '100%', marginTop: 8 },
  currentTimesText: {
    fontSize: 16,
  },
  doItNowContent: {},
  planWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    alignItems: 'center',
  },
  yellowLineText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yellowLine: {
    width: '100%',
    position: 'absolute',
    zIndex: -1,
  },
  subPlan: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  mainHeader: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyPlanNowButton: {
    opacity: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  emptyPlanNowText: {
    fontSize: 16,
    marginLeft: 4,
  },
  addSubPlanButton: {
    opacity: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
});

export default MainPage;
