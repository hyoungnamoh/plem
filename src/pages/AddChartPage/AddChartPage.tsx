import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { AddPlanChart } from 'types/chart';
import PlemText from 'components/Atoms/PlemText';
import Header from 'components/Header';
import { addPlanChartDefault, addPlanChartState } from 'states/addPlanChartState';
import { repeatOptionList } from 'pages/RepeatSettingPage';
import cloneDeep from 'lodash/cloneDeep';
import SubPlanInput from 'components/SubPlanInput';
import { MAIN_COLOR } from 'constants/colors';
import { timePadStart } from 'helper/timePadStart';
import { useQueryClient } from 'react-query';
import { StackActions, TabActions } from '@react-navigation/native';
import { MainTabStackParamList } from 'tabs/MainTab';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NotificationActiveSvg from 'assets/images/notification_active_32x32.svg';
import NotificationInactiveSvg from 'assets/images/notification_inactive_32x32.svg';
import ArrowRightSvg from 'assets/images/arrow_right_32x32.svg';
import UncheckedSvg from 'assets/images/uncheckedbox_24x24.svg';
import DeleteRedSvg from 'assets/images/delete_red_24x24.svg';
import AddChartTable from 'components/AddChartTable';
import { useAddChart } from 'hooks/mutations/useAddChart';
import { TODAY_PLAN_CHART_QUERY_KEY } from 'hooks/queries/useGetTodayPlanChart';
import { useUpdateChart } from 'hooks/mutations/useUpdateChart';
import UnderlineSvg from 'assets/images/underline.svg';
import PlemButton from 'components/Atoms/PlemButton';
import { globalToastState } from 'states/globalToastState';
import { DAY_TO_MIN, HOUR_TO_MIN } from 'constants/times';
import { EmptyPlanAlert } from './components/EmptyPlanAlert/EmptyPlanAlert';
import {
  HandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
} from 'react-native-gesture-handler';
import { PopInEditingAlert } from './components/PopInEditingAlert.tsx/PopInEditingAlert';
import { CHART_LIST_QUERY_KEY } from 'hooks/queries/useGetChartList';
import { CHART_LIST_COUNT_QUERY_KEY } from 'hooks/queries/useGetChartListCount';

const yellowLineImage = require('../../assets/images/yellow_line.png');

type AddChartPageProps = NativeStackScreenProps<MainTabStackParamList, 'AddChartPage'>;

const AddChartPage = ({ navigation, route }: AddChartPageProps) => {
  const queryClient = useQueryClient();
  const [chart, setChart] = useRecoilState<AddPlanChart>(addPlanChartState);
  const setGlobalToast = useSetRecoilState(globalToastState);
  const isEdit = !!route.params?.chart;
  const [openEmptyPlanAlert, setOpenEmptyPlanAlert] = useState(false);
  const [openPopInEditingAlert, setPopInEditingAlert] = useState(false);
  const swipeStartX = useRef<number | null>();
  const unsubscribe = useRef<() => void>();

  const { isLoading: addChartLoading, mutate: addChart } = useAddChart({
    onSuccess: async (responseData) => {
      if (responseData.status === 200) {
        unsubscribe.current && unsubscribe.current();
        await AsyncStorage.removeItem('chartData');
        queryClient.invalidateQueries(CHART_LIST_QUERY_KEY);
        queryClient.invalidateQueries(TODAY_PLAN_CHART_QUERY_KEY);
        queryClient.invalidateQueries(CHART_LIST_COUNT_QUERY_KEY);
        navigation.dispatch(TabActions.jumpTo('PlanChartListTab'));
        navigation.dispatch(StackActions.popToTop());
      } else {
        Alert.alert('알 수 없는 오류가 발생했어요 ;ㅂ;');
        console.info('useAddChart Error: ', responseData);
      }
    },
  });

  const { isLoading: updateChartLoading, mutate: updateChart } = useUpdateChart({
    onSuccess: async (responseData) => {
      if (responseData.status === 200) {
        unsubscribe.current && unsubscribe.current();
        queryClient.invalidateQueries(CHART_LIST_QUERY_KEY);
        queryClient.invalidateQueries(TODAY_PLAN_CHART_QUERY_KEY);
        queryClient.invalidateQueries(CHART_LIST_COUNT_QUERY_KEY);
        navigation.goBack();
      }
    },
  });

  const showDraftsToast = async () => {
    const hasDraft = await checkDrafts();
    if (hasDraft) {
      setGlobalToast({ text: '작성 중인 계획표가 임시 저장되었어요.', duration: 2000 });
    }
  };

  useEffect(() => {
    initChartData();

    return () => {
      setChart(addPlanChartDefault);
    };
  }, []);

  useEffect(() => {
    unsubscribe.current = navigation.addListener('beforeRemove', (e) => {
      if (isEdit && checkChangesEdit()) {
        e.preventDefault();
        setPopInEditingAlert(true);
      }
      if (!isEdit && checkChangesAdd()) {
        setStorageChartData();
        showDraftsToast();
      }
    });
    return () => {
      if (unsubscribe.current) {
        unsubscribe.current();
      }
    };
  }, [navigation, chart, route.params?.chart, isEdit]);

  const checkDrafts = async () => {
    const hasDraft = await AsyncStorage.getItem('chartData');
    return !!hasDraft;
  };

  const setStorageChartData = async () => {
    await AsyncStorage.setItem('chartData', JSON.stringify(chart));
  };

  const initChartData = async () => {
    const item = await AsyncStorage.getItem('chartData');
    const chartData = item ? (JSON.parse(item) as AddPlanChart) : null;

    // test
    // setChart(chart);

    // 수정
    if (route.params?.chart) {
      setChart(route.params.chart);
      return;
    }

    if (!chartData) {
      return;
    }

    Alert.alert('작성하던 계획표가 있어요. 이어서 작성할까요?', '', [
      {
        text: '아니요',
        onPress: async () => {
          await AsyncStorage.removeItem('chartData');
        },
        style: 'cancel',
      },
      {
        text: '네',
        onPress: () => {
          setChart(chartData);
        },
      },
    ]);
    // setChart(chartData);
  };

  const onPressAddChart = () => {
    if (addChartLoading) {
      return;
    }
    if (!chart.name) {
      Alert.alert('계획표명을 입력해주세요.');
      return;
    }
    if (chart.plans.length === 0) {
      Alert.alert('계획을 추가해주세요.');
      return;
    }
    if (!checkEmptyPlan()) {
      showEmptyPlanAlert();
      return;
    }
    addChart(chart);
  };

  const onPressUpdate = () => {
    if (updateChartLoading || !route.params?.chart?.id) {
      return;
    }
    if (!checkEmptyPlan()) {
      showEmptyPlanAlert();
      return;
    }
    const newChart = { ...chart, id: route.params?.chart.id };
    updateChart(newChart);
  };

  const onPressRepeatSetting = () => {
    navigation.navigate('RepeatSettingPage');
  };

  const getRepeatOptions = () => {
    if (chart.repeats.includes(null)) {
      return '안 함';
    }
    if (chart.repeats.includes(7) && chart.repeatDates) {
      return chart.repeatDates.map((date) => `${date}일`).join(', ');
    }

    const sortedRepeatList = repeatOptionList
      .filter((option) => chart.repeats.includes(option.value))
      .sort((a, b) => a.order! - b.order!);

    const isWeekend =
      sortedRepeatList.length === 2 && sortedRepeatList.every((option) => option.value === 0 || option.value === 6);
    const isWeekdays =
      sortedRepeatList.length === 5 && sortedRepeatList.every((option) => option.value !== 0 && option.value !== 6);

    if (isWeekend) {
      return '주말';
    }

    if (isWeekdays) {
      return '주중';
    }

    if (sortedRepeatList.length === 7) {
      return '매일';
    }

    return sortedRepeatList.map((option) => option.day).join(', ');
  };

  const checkEmptyPlan = () => {
    let totalPlanMin = 0;
    chart.plans.map((plan) => {
      totalPlanMin += plan.endHour * HOUR_TO_MIN + plan.endMin - (plan.startHour * HOUR_TO_MIN + plan.startMin);
    });

    return totalPlanMin === DAY_TO_MIN;
  };

  const showEmptyPlanAlert = () => {
    setOpenEmptyPlanAlert(true);
  };

  const onPressAddPlan = () => {
    navigation.navigate('AddPlanPage');
  };

  const deleteSubPlan = ({ planIndex, subPlanIndex }: { planIndex: number; subPlanIndex: number }) => {
    const copiedChart = cloneDeep(chart);
    copiedChart.plans[planIndex].subPlans.splice(subPlanIndex, 1);
    setChart(copiedChart);
  };

  const saveSubPlan = ({ planIndex, subPlanName }: { planIndex: number; subPlanName: string }) => {
    const copiedChart = cloneDeep(chart);
    copiedChart.plans[planIndex].subPlans = [...copiedChart.plans[planIndex].subPlans, { name: subPlanName }];
    setChart(copiedChart);
  };

  const onPressModifyPlan = ({ planIndex }: { planIndex: number }) => {
    navigation.navigate('AddPlanPage', { planIndex: planIndex });
  };

  const handleEmptyPlanAlertCancel = () => {
    setOpenEmptyPlanAlert(false);
  };

  const handleEmptyPlanAlertConfirm = () => {
    setOpenEmptyPlanAlert(false);

    if (isEdit) {
      if (route.params?.chart.id) {
        const newChart = { ...chart, id: route.params.chart.id };
        updateChart(newChart);
      }
    } else {
      addChart(chart);
    }
  };

  const handleGesture = (event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      if (event.nativeEvent.x > 80 || swipeStartX.current) {
        return;
      }
      swipeStartX.current = event.nativeEvent.x;
    } else if (event.nativeEvent.state === State.END) {
      // 스와이프 완료 시 동작 처리
      if (!swipeStartX.current) {
        return;
      }
      if (event.nativeEvent.x - swipeStartX.current > 50 && isEdit && checkChangesEdit()) {
        setPopInEditingAlert(true);
      } else {
        navigation.goBack();
      }
      swipeStartX.current = null;
    }
  };

  const checkChangesEdit = () => {
    return JSON.stringify(route.params?.chart) !== JSON.stringify(chart);
  };

  const checkChangesAdd = () => {
    return JSON.stringify(addPlanChartDefault) !== JSON.stringify(chart);
  };

  const handlePopInEditingAlertCancel = () => {
    unsubscribe.current && unsubscribe.current();
    setPopInEditingAlert(false);
    navigation.goBack();
  };

  const handlePopInEditingAlertConfirm = () => {
    setPopInEditingAlert(false);
  };

  return (
    <PanGestureHandler onHandlerStateChange={handleGesture}>
      <KeyboardAvoidingView style={styles.page} behavior={Platform.select({ ios: 'padding', android: undefined })}>
        <Header
          title={isEdit ? '계획표 수정' : '계획표 추가'}
          buttonName={isEdit ? '완료' : '등록'}
          buttonProps={{ onPress: isEdit ? onPressUpdate : onPressAddChart }}
        />
        <ScrollView style={styles.page} keyboardDismissMode={'on-drag'} contentContainerStyle={{ paddingBottom: 300 }}>
          <View style={{ paddingHorizontal: 15 }}>
            <AddChartTable />
            <View style={styles.optionRow}>
              <View style={styles.underlineButtonWrap}>
                <PlemText>반복</PlemText>
                <PlemButton style={styles.underlineButton} onPress={onPressRepeatSetting}>
                  <PlemText numberOfLines={1} style={{ flex: 1, textAlign: 'right' }}>
                    {getRepeatOptions()}
                  </PlemText>
                  <ArrowRightSvg style={styles.arrowImage} />
                </PlemButton>
              </View>
              <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#000'} style={styles.underline} />
            </View>
            <View style={styles.optionRow}>
              <View style={styles.underlineButtonWrap}>
                <PlemText>계획</PlemText>
                <PlemButton style={styles.underlineButton} onPress={onPressAddPlan}>
                  <ArrowRightSvg style={styles.arrowImage} />
                </PlemButton>
              </View>
              <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#000'} style={styles.underline} />
            </View>
            <View style={styles.planContainer}>
              {chart.plans.map((plan, planIndex) => {
                const { startHour, startMin, endHour, endMin } = plan;
                return (
                  <View key={`plan_${planIndex}}`}>
                    <View style={styles.planWrap}>
                      <PlemButton style={styles.yellowLineText} onPress={() => onPressModifyPlan({ planIndex })}>
                        <PlemText>{plan.name}</PlemText>
                        <Image source={yellowLineImage} style={styles.yellowLine} />
                      </PlemButton>
                      <View style={styles.notificationContainer}>
                        <PlemText>
                          {`${timePadStart(startHour)}:${timePadStart(startMin)}`} -{' '}
                          {`${timePadStart(endHour)}:${timePadStart(endMin)}`}
                        </PlemText>
                        {plan.notification === null ? (
                          <NotificationInactiveSvg style={{ marginLeft: 4 }} />
                        ) : (
                          <NotificationActiveSvg style={{ marginLeft: 4 }} />
                        )}
                      </View>
                    </View>
                    <View>
                      {plan.subPlans.map((subPlan, subPlanIndex) => {
                        return (
                          <View key={`subPlan_${subPlanIndex}`} style={styles.subPlan}>
                            <View style={styles.subPlanNameWrap}>
                              <UncheckedSvg />
                              <PlemText style={{ marginLeft: 4 }}>{subPlan.name}</PlemText>
                            </View>
                            <PlemButton onPress={() => deleteSubPlan({ planIndex, subPlanIndex })}>
                              <DeleteRedSvg style={{ marginLeft: 4 }} />
                            </PlemButton>
                          </View>
                        );
                      })}
                    </View>
                    <SubPlanInput planIndex={planIndex} saveSubPlan={saveSubPlan} />
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
        <EmptyPlanAlert
          open={openEmptyPlanAlert}
          size="small"
          onCancel={handleEmptyPlanAlertCancel}
          onConfirm={handleEmptyPlanAlertConfirm}
          cancelText="계속 작성할게요"
        />
        <PopInEditingAlert
          open={openPopInEditingAlert}
          size="small"
          onCancel={handlePopInEditingAlertCancel}
          onConfirm={handlePopInEditingAlertConfirm}
          cancelText="나갈게요"
          confirmText="계속 할게요"
        />
      </KeyboardAvoidingView>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: MAIN_COLOR,
    height: '100%',
  },
  underlineButtonWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  underlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    flex: 1,
    justifyContent: 'flex-end',
  },
  underline: {
    marginTop: 4,
  },
  arrowImage: {
    marginLeft: 8,
  },
  optionRow: {
    marginTop: 32,
  },
  planContainer: {
    marginTop: 16,
  },
  planWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
  planEmptyComponent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planEmptyText: {
    color: '#aaa',
  },
  planTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subPlanNameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default AddChartPage;
