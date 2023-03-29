import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { useRecoilState } from 'recoil';
import { AddPlanChart } from '../../../types/chart';
import PlemText from '../../components/Atoms/PlemText';
import Header from '../../components/Header';
import { addPlanChartDefault, addPlanChartState } from '../../states/addPlanChartState';
import { MainTabStackParamList } from '../../tabs/MainTab';
import { repeatOptionList } from '../RepeatSettingPage';
import cloneDeep from 'lodash/cloneDeep';
import SubPlanInput from '../../components/SubPlanInput';
import { MAIN_COLOR } from '../../constants/color';
import { timePadStart } from '../../helper/timePadStart';

const arrowImage = require('../../assets/images/arrow_right.png');
const underlineImage = require('../../assets/images/underline.png');
const uncheckedImage = require('../../assets/images/unchecked_black.png');
const notificationOnImage = require('../../assets/images/notification_on.png');
const notificationOffImage = require('../../assets/images/notification_off.png');
const yellowLineImage = require('../../assets/images/yellow_line.png');
const subPlanDeleteImage = require('../../assets/images/sub_plan_delete.png');

type AddChartPageProps = NativeStackScreenProps<MainTabStackParamList, 'AddChartPage'>;

const AddChartPage = ({ navigation }: AddChartPageProps) => {
  const [chart, setChart] = useRecoilState(addPlanChartState);
  const [checkedList, setCheckedList] = useState<number[]>([]);

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
  };

  const onPressAddChart = () => {
    Alert.alert('등록~');
    console.log(JSON.stringify(chart));
    // 계획표 초기화
    //
  };

  const onPressRepeatSetting = () => {
    navigation.navigate('RepeatSettingPage');
  };

  const getRepeatOptions = () => {
    if (chart.repeats.includes(null)) {
      return '안 함';
    }
    if (chart.repeats.includes(7) && chart.repeatDays) {
      return chart.repeatDays.map((date) => `${date}일`).join(', ');
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

  const getPlanEmptyComponent = () => {
    return (
      <View style={styles.planEmptyComponent}>
        <PlemText style={styles.planEmptyText}>계획을 추가해 주세요.</PlemText>
        <View style={styles.planTimeContainer}>
          <PlemText style={styles.planEmptyText}>00:00 - 00:00</PlemText>
          <Image source={notificationOffImage} style={{ marginLeft: 4 }} />
        </View>
      </View>
    );
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
    <View style={styles.page}>
      <Header title={'계획표 추가'} buttonName={'등록'} buttonProps={{ onPress: onPressAddChart }} />
      <View style={{ paddingHorizontal: 15 }}>
        <View style={styles.optionRow}>
          <View style={styles.underlineButtonWrap}>
            <PlemText>반복</PlemText>
            <Pressable style={styles.underlineButton} onPress={onPressRepeatSetting}>
              <PlemText numberOfLines={1} style={{ flex: 1, textAlign: 'right' }}>
                {getRepeatOptions()}
              </PlemText>
              <Image source={arrowImage} style={styles.arrowImage} />
            </Pressable>
          </View>
          <Image source={underlineImage} style={styles.underlineImage} />
        </View>
        <View style={styles.optionRow}>
          <View style={styles.underlineButtonWrap}>
            <PlemText>계획</PlemText>
            <Pressable style={styles.underlineButton} onPress={onPressAddPlan}>
              <Image source={arrowImage} style={styles.arrowImage} />
            </Pressable>
          </View>
          <Image source={underlineImage} style={styles.underlineImage} />
        </View>
        <FlatList
          style={styles.planContainer}
          contentInset={{ bottom: 80 }}
          data={chart.plans}
          extraData={chart.plans}
          renderItem={({ item: plan, index: planIndex }) => {
            const { hour: startHour, minute: startMinute } = plan.startTime;
            const { hour: endHour, minute: endMinute } = plan.endTime;
            return (
              <View key={`plan_${planIndex}}`}>
                <View style={styles.planWrap}>
                  <Pressable style={styles.yellowLineText} onPress={() => onPressModifyPlan({ planIndex })}>
                    <PlemText>{plan.name}</PlemText>
                    <Image source={yellowLineImage} style={styles.yellowLine} />
                  </Pressable>
                  <View style={styles.notificationContainer}>
                    <PlemText>
                      {`${timePadStart(startHour)}:${timePadStart(startMinute)}`} -{' '}
                      {`${timePadStart(endHour)}:${timePadStart(endMinute)}`}
                    </PlemText>
                    <Image
                      source={plan.notification ? notificationOnImage : notificationOffImage}
                      style={{ marginLeft: 4 }}
                    />
                  </View>
                </View>
                <FlatList
                  data={plan.subPlans}
                  extraData={plan.subPlans}
                  renderItem={({ item: subPlan, index: subPlanIndex }) => {
                    return (
                      <View key={`subPlan_${subPlanIndex}`} style={styles.subPlan}>
                        <View style={styles.subPlanNameWrap}>
                          <Image source={uncheckedImage} />
                          <PlemText style={{ marginLeft: 4 }}>{subPlan.name}</PlemText>
                        </View>
                        <Pressable onPress={() => deleteSubPlan({ planIndex, subPlanIndex })}>
                          <Image source={subPlanDeleteImage} style={{ marginLeft: 4 }} />
                        </Pressable>
                      </View>
                    );
                  }}
                />
                <SubPlanInput planIndex={planIndex} saveSubPlan={saveSubPlan} />
              </View>
            );
          }}
          ListEmptyComponent={getPlanEmptyComponent()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: MAIN_COLOR,
    flex: 1,
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
  underlineImage: {
    width: '100%',
    marginTop: 4,
  },
  arrowImage: {
    marginLeft: 8,
  },
  optionRow: {
    marginTop: 32,
  },
  planContainer: {
    height: 300,
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
