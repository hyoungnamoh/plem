import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRecoilState } from 'recoil';
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

const yellowLineImage = require('../../assets/images/yellow_line.png');

type AddChartPageProps = NativeStackScreenProps<MainTabStackParamList, 'AddChartPage'>;

const AddChartPage = ({ navigation, route }: AddChartPageProps) => {
  const queryClient = useQueryClient();
  const [chart, setChart] = useRecoilState<AddPlanChart>(addPlanChartState);
  const isEdit = !!route.params?.chart;

  const { isLoading: addChartLoading, mutate: addChart } = useAddChart({
    onSuccess: async (responseData) => {
      if (responseData.status === 200) {
        queryClient.invalidateQueries('chartList');
        queryClient.invalidateQueries(TODAY_PLAN_CHART_QUERY_KEY);
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
        queryClient.invalidateQueries('chartList');
        queryClient.invalidateQueries(TODAY_PLAN_CHART_QUERY_KEY);
        navigation.goBack();
      }
    },
  });

  useEffect(() => {
    initChartData();

    return () => setChart(addPlanChartDefault);
  }, []);

  const setStorageChartData = async (chartData: AddPlanChart) => {
    await AsyncStorage.setItem('chart_data', JSON.stringify(chartData));
  };

  const initChartData = async () => {
    const item = await AsyncStorage.getItem('chart_data');
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
          await AsyncStorage.removeItem('chart_data');
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
    if (chart.name) {
      Alert.alert('계획표명을 입력해주세요.');
      return;
    }
    if (chart.plans.length === 0) {
      Alert.alert('계획을 추가해주세요.');
      return;
    }
    addChart(chart);
  };

  const onPressUpdate = () => {
    if (updateChartLoading || !route.params?.chart.id) {
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
    return repeatOptionList
      .filter((option) => chart.repeats.includes(option.value))
      .sort((a, b) => a.value! - b.value!)
      .map((option) => option.day)
      .join(', ');
  };

  const onPressAddPlan = () => {
    navigation.navigate('AddPlanPage');
  };

  const deleteSubPlan = ({ planIndex, subPlanIndex }: { planIndex: number; subPlanIndex: number }) => {
    const copiedChart = cloneDeep(chart);
    copiedChart.plans[planIndex].subPlans.splice(subPlanIndex, 1);
    setChart(copiedChart);
    setStorageChartData(copiedChart);
  };

  const saveSubPlan = ({ planIndex, subPlanName }: { planIndex: number; subPlanName: string }) => {
    const copiedChart = cloneDeep(chart);
    copiedChart.plans[planIndex].subPlans = [...copiedChart.plans[planIndex].subPlans, { name: subPlanName }];
    setChart(copiedChart);
    setStorageChartData(copiedChart);
  };

  const onPressModifyPlan = ({ planIndex }: { planIndex: number }) => {
    navigation.navigate('AddPlanPage', { planIndex: planIndex });
  };

  return (
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
              <Pressable style={styles.underlineButton} onPress={onPressRepeatSetting}>
                <PlemText numberOfLines={1} style={{ flex: 1, textAlign: 'right' }}>
                  {getRepeatOptions()}
                </PlemText>
                <ArrowRightSvg style={styles.arrowImage} />
              </Pressable>
            </View>
            <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#000'} style={styles.underline} />
          </View>
          <View style={styles.optionRow}>
            <View style={styles.underlineButtonWrap}>
              <PlemText>계획</PlemText>
              <Pressable style={styles.underlineButton} onPress={onPressAddPlan}>
                <ArrowRightSvg style={styles.arrowImage} />
              </Pressable>
            </View>
            <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#000'} style={styles.underline} />
          </View>
          <View style={styles.planContainer}>
            {chart.plans.map((plan, planIndex) => {
              const { startHour, startMin, endHour, endMin } = plan;
              return (
                <View key={`plan_${planIndex}}`}>
                  <View style={styles.planWrap}>
                    <Pressable style={styles.yellowLineText} onPress={() => onPressModifyPlan({ planIndex })}>
                      <PlemText>{plan.name}</PlemText>
                      <Image source={yellowLineImage} style={styles.yellowLine} />
                    </Pressable>
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
                          <Pressable onPress={() => deleteSubPlan({ planIndex, subPlanIndex })}>
                            <DeleteRedSvg style={{ marginLeft: 4 }} />
                          </Pressable>
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
    </KeyboardAvoidingView>
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
