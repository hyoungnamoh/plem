import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, StyleSheet, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { MainTabStackParamList } from 'tabs/MainTab';
import { MAIN_COLOR } from 'constants/colors';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import NotificationActiveSvg from 'assets/images/notification_active_32x32.svg';
import NotificationInactiveSvg from 'assets/images/notification_inactive_32x32.svg';
import MainLogoSvg from 'assets/images/mainpage_logo_134x40.svg';
import PlusSvg from 'assets/images/plus_40x40.svg';
import UncheckboxSvg from 'assets/images/uncheckedbox_24x24.svg';
import CheckboxSvg from 'assets/images/checkedbox_24x24.svg';
import MainChartTable from 'components/MainChartTable';
import { useQueryClient } from 'react-query';
import { TODAY_PLAN_CHART_QUERY_KEY, useGetTodayPlanChart } from 'hooks/queries/useGetTodayPlanChart';
import CustomScrollView from 'components/CustomScrollView/CustomScrollView';
import UnderlineSvg from 'assets/images/underline.svg';
import PlemButton from 'components/Atoms/PlemButton';
import MaximumChartAlert from 'components/MaximumChartAlert';
import { useGetChartListCount } from 'hooks/queries/useGetChartListCount';
import { NUM_OF_MAXIMUM_CHART } from 'constants/numOfMaximumChart';
import { LoggedInTabParamList } from 'types/appInner';
import TodayScheduleBox from 'components/TodayScheduleBox';
import { TODAY_SCHEDULE_LIST, useGetTodayScheduleList } from 'hooks/queries/useGetTodayScheduleList';
import { useScheduleConfirmDate } from 'hooks/useScheduleConfirmDate';
import { Plan } from 'types/chart';

type MainPageProps = NativeStackScreenProps<MainTabStackParamList, 'MainPage'>;

const yellowLineImage = require('assets/images/yellow_line.png');

const MainPage = ({ navigation }: MainPageProps) => {
  const tabNaviation = useNavigation<NavigationProp<LoggedInTabParamList>>();
  const queryClient = useQueryClient();
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const [currentDate, setCurrentDate] = useState(dayjs().get('date'));
  const [openMaximumAlert, setOpenMaximumAlert] = useState(false);
  const { data: todayPlanChart } = useGetTodayPlanChart();
  const { data: chartListCount } = useGetChartListCount();
  const { data: todayScheduleList } = useGetTodayScheduleList({ date: dayjs().format('YYYY-MM-DD') });
  const { isConfirmedSchedule } = useScheduleConfirmDate();
  const [doItNowPlanIndex, setDoItNowPlanIndex] = useState(-1);
  const [doItNowPlan, setDoItNowPlan] = useState<Plan | null>(null);
  const isMaximumChartList = !!(chartListCount && chartListCount.data.count >= NUM_OF_MAXIMUM_CHART);

  useEffect(() => {
    setCheckedListToStorageData();
  }, []);

  useFocusEffect(() => {
    if (currentDate !== dayjs().get('date')) {
      queryClient.invalidateQueries(TODAY_PLAN_CHART_QUERY_KEY);
      queryClient.invalidateQueries(TODAY_SCHEDULE_LIST);
      setCurrentDate(dayjs().get('date'));
    }
    const { nowPlan, nowPlanIndex } = getDoItNowPlan();
    setDoItNowPlanIndex(nowPlanIndex);
    setDoItNowPlan(nowPlan);
  });

  const setCheckedListToStorageData = async () => {
    const item = await AsyncStorage.getItem('planCheckedList');
    const planCheckList = item ? JSON.parse(item) : [];
    setCheckedList(planCheckList);
  };

  const handleSubPlanPress = async (id: number) => {
    const asyncStorageItem = await AsyncStorage.getItem('planCheckedList');
    const planCheckList: number[] = asyncStorageItem ? JSON.parse(asyncStorageItem) : [];
    const idIndex = planCheckList.findIndex((e) => e === id);

    if (idIndex < 0) {
      planCheckList.push(id);
    } else {
      planCheckList.splice(idIndex, 1);
    }

    setCheckedList(planCheckList);
    await AsyncStorage.setItem('planCheckedList', JSON.stringify(planCheckList));
  };

  const handleAddChartPress = () => {
    if (isMaximumChartList) {
      setOpenMaximumAlert(true);
      return;
    }
    navigation.navigate('AddChartPage');
  };

  const getDoItNowPlan = () => {
    if (!todayPlanChart?.data || !todayPlanChart.success) {
      return { nowPlan: null, nowPlanIndex: -1 };
    }
    const nowPlanIndex = todayPlanChart.data.plans.findIndex((plan) => {
      const current = dayjs();
      const startTime = dayjs().set('hour', plan.startHour).set('minute', plan.startMin).startOf('minute');
      const endTime = dayjs().set('hour', plan.endHour).set('minute', plan.endMin).startOf('minute');
      const midnight = dayjs().startOf('date');
      // 자정을 포함한 경우의 조건, 자정 기준으로 앞 뒤 시간 비교 필요
      const hasMidnight = endTime.isBefore(startTime);
      const beforeMidnightCondition =
        (current.isBefore(midnight) && current.isSame(startTime)) || current.isAfter(startTime);
      const afterMidnightCondition =
        (current.isSame(midnight) || current.isAfter(midnight)) && current.isBefore(endTime);
      // 자정을 포함하지 않은 경우의 조건
      const generalCondition = (current.isSame(startTime) || current.isAfter(startTime)) && current.isBefore(endTime);
      return hasMidnight ? hasMidnight && (beforeMidnightCondition || afterMidnightCondition) : generalCondition;
    });

    const nowPlan = nowPlanIndex > -1 ? todayPlanChart.data.plans[nowPlanIndex] : null;

    return { nowPlan, nowPlanIndex };
  };

  const handleEmptyPlanPress = () => {
    if (!todayPlanChart?.data) {
      if (isMaximumChartList) {
        setOpenMaximumAlert(true);
        return;
      }
      navigation.navigate('AddChartPage');
      return;
    }
    navigation.navigate('AddChartPage', { chart: todayPlanChart?.data || null });
    navigation.navigate('AddPlanPage');
  };

  const handleEmptySubPlanPress = () => {
    navigation.navigate('AddChartPage', { chart: todayPlanChart?.data || null });
  };

  const handlePlanPress = (planIndex: number) => {
    if (planIndex < 0) {
      return;
    }
    navigation.navigate('AddChartPage', { chart: todayPlanChart?.data || null });
    navigation.navigate('AddPlanPage', { planIndex });
  };

  const handleMoveChartList = () => {
    // FIXME: 타입 수정
    tabNaviation.navigate('PlanChartListTab', { screen: 'PlanChartListPage' });
    setOpenMaximumAlert(false);
  };

  return (
    <>
      <View style={styles.page}>
        <View style={styles.mainHeader}>
          <PlemButton>
            <MainLogoSvg />
          </PlemButton>
          <PlemButton onPress={handleAddChartPress}>
            <PlusSvg />
          </PlemButton>
        </View>
        <MainChartTable
          chart={todayPlanChart?.data || null}
          navigation={navigation}
          isMaximumChartList={isMaximumChartList}
          setOpenMaximumAlert={setOpenMaximumAlert}
        />
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
          <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#000'} style={styles.doItNowUnderline} />
          <CustomScrollView style={{ height: '20%' }} contentContainerStyle={styles.doItNowContent}>
            {doItNowPlan ? (
              <View>
                <View style={styles.planWrap}>
                  <PlemButton style={styles.yellowLineText} onPress={() => handlePlanPress(doItNowPlanIndex)}>
                    <PlemText style={{ fontSize: 22.5, paddingTop: 3 }}>{doItNowPlan.name}</PlemText>
                    <Image source={yellowLineImage} style={styles.yellowLine} />
                  </PlemButton>
                  <PlemButton>
                    {doItNowPlan.notification ? <NotificationActiveSvg /> : <NotificationInactiveSvg />}
                  </PlemButton>
                </View>
                {doItNowPlan.subPlans.map((sub) => {
                  const isChecked = checkedList.includes(sub.id);
                  return (
                    <PlemButton
                      key={`subPlan${sub.id}`}
                      style={styles.subPlan}
                      onPress={() => handleSubPlanPress(sub.id)}>
                      {isChecked ? <CheckboxSvg /> : <UncheckboxSvg />}
                      <PlemText
                        style={{
                          marginLeft: 4,
                          textDecorationLine: isChecked ? 'line-through' : 'none',
                          paddingTop: 3,
                        }}>
                        {sub.name}
                      </PlemText>
                    </PlemButton>
                  );
                })}
                <PlemButton style={[styles.subPlan, { opacity: 0.3 }]} onPress={handleEmptySubPlanPress}>
                  <UncheckboxSvg />
                  <PlemText style={{ marginLeft: 4 }}>할 일 추가하기</PlemText>
                </PlemButton>
              </View>
            ) : (
              <PlemButton style={styles.emptyPlanNowButton} onPress={handleEmptyPlanPress}>
                <UncheckboxSvg />
                <PlemText style={styles.emptyPlanNowText}>계획을 등록해 주세요.</PlemText>
              </PlemButton>
            )}
          </CustomScrollView>
        </View>
      </View>
      {todayScheduleList && todayScheduleList.data.length > 0 && !isConfirmedSchedule() && (
        <TodayScheduleBox todayScheduleCount={todayScheduleList.data.length} />
      )}
      <MaximumChartAlert
        open={openMaximumAlert}
        onCancel={() => setOpenMaximumAlert(false)}
        onConfirm={handleMoveChartList}
        cancelText="나중에 할게요"
        confirmText="정리하러 갈래요"
      />
    </>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: MAIN_COLOR,
    paddingHorizontal: 16,
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
  doItNowUnderline: { marginTop: 8 },
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
