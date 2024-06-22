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
import { SubPlan } from 'types/chart';
import { logEvent } from 'helper/analytics';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentTimeDegreeState } from 'states/currentTimeDegreeState';
import SharedDefaults from 'widgets/SharedDefaults';
import { useCheckSubPlan } from 'hooks/mutations/useCheckSubPlan';
import { disableLoadingState } from 'states/disableLoadingState';
import { GET_DO_IT_NOW_QUERY_KEY, useGetDoItNow } from 'hooks/queries/useGetDoItNow';

type MainPageProps = NativeStackScreenProps<MainTabStackParamList, 'MainPage'>;

const yellowLineImage = require('assets/images/yellow_line.png');

const MainPage = ({ navigation }: MainPageProps) => {
  const tabNaviation = useNavigation<NavigationProp<LoggedInTabParamList>>();
  const currentTimeDegree = useRecoilValue(currentTimeDegreeState);
  const setDisableLoading = useSetRecoilState(disableLoadingState);
  const { isConfirmedSchedule } = useScheduleConfirmDate();
  const queryClient = useQueryClient();
  const { data: todayPlanChart } = useGetTodayPlanChart();
  const { data: chartListCount } = useGetChartListCount();
  const { data: todayScheduleList } = useGetTodayScheduleList({ date: dayjs().format('YYYY-MM-DD') });
  const { data: doItNowData } = useGetDoItNow();
  const [openMaximumAlert, setOpenMaximumAlert] = useState(false);
  const [currentDate, setCurrentDate] = useState(dayjs().get('date'));
  const doItNow = doItNowData?.data?.nowPlan ?? null;
  const doItNowIndex = doItNowData?.data?.nowPlanIndex ?? -1;
  const isMaximumChartList = !!(chartListCount && chartListCount.data.count >= NUM_OF_MAXIMUM_CHART);

  useEffect(() => {
    updateChart();
  }, [currentTimeDegree]);

  useFocusEffect(() => {
    updateChart();
  });

  const { mutate: checkSubPlan } = useCheckSubPlan({
    onSuccess: async () => {
      queryClient.invalidateQueries(GET_DO_IT_NOW_QUERY_KEY);
    },
    onMutate: () => {
      // FIXME: disabledLoading 처리 시점 수정
      // 현재는 체크 후 getDoItNow 하기 때문에 getDoItNow 요청 끝나면 false 처리 하고있음
      setDisableLoading(true);
    },
  });

  const updateChart = () => {
    SharedDefaults.updateDoItNowBridge();
    if (currentDate !== dayjs().get('date')) {
      updateTodayChart();
    }
  };

  const updateTodayChart = () => {
    queryClient.invalidateQueries(TODAY_PLAN_CHART_QUERY_KEY);
    queryClient.invalidateQueries(TODAY_SCHEDULE_LIST);
    setCurrentDate(dayjs().get('date'));
  };

  const handleSubPlanPress = async ({ name }: SubPlan) => {
    checkSubPlan({ subPlanName: name, date: new Date() });
    SharedDefaults.updateDoItNowBridge();
  };

  const handleAddChartPress = async () => {
    if (isMaximumChartList) {
      logEvent('MainPage_maximumChartAlertOpen');
      setOpenMaximumAlert(true);
      return;
    }
    navigation.navigate('AddChartPage');
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
    logEvent('MainPage_addSubPlan');
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
              {doItNow
                ? `${dayjs().set('hour', doItNow.startHour).set('minute', doItNow.startMin).format('HH:mm')} - ${dayjs()
                    .set('hour', doItNow.endHour)
                    .set('minute', doItNow.endMin)
                    .format('HH:mm')}`
                : null}
            </PlemText>
          </View>
          <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#000'} style={styles.doItNowUnderline} />
          <CustomScrollView style={{ height: '20%' }} contentContainerStyle={styles.doItNowContent}>
            {doItNow ? (
              <View>
                <View style={styles.planWrap}>
                  <PlemButton style={styles.yellowLineText} onPress={() => handlePlanPress(doItNowIndex)}>
                    <PlemText style={{ fontSize: 22.5 }}>{doItNow.name}</PlemText>
                    <Image source={yellowLineImage} style={styles.yellowLine} />
                  </PlemButton>
                  <PlemButton>
                    {doItNow.notification ? <NotificationActiveSvg /> : <NotificationInactiveSvg />}
                  </PlemButton>
                </View>
                {/* FIXME: 첫번째 인자의 요소를 사용하면 타입이 DoItNowSubPlan으로 안잡힙 */}
                {doItNow.subPlans.map((_, index) => {
                  const sub = doItNow.subPlans[index];
                  return (
                    <PlemButton key={`subPlan${sub.id}`} style={styles.subPlan} onPress={() => handleSubPlanPress(sub)}>
                      {sub.isCompleted ? <CheckboxSvg /> : <UncheckboxSvg />}
                      <PlemText
                        style={{
                          marginLeft: 4,
                          textDecorationLine: sub.isCompleted ? 'line-through' : 'none',
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
