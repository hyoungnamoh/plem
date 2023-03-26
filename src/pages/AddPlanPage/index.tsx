import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import PlemText from '../../components/Atoms/PlemText';
import Header from '../../components/Header';
import UnderlineTextInput from '../../components/UnderlineTextInput';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabStackParamList } from '../../tabs/MainTab';
import { useRecoilState } from 'recoil';
import { addPlanDefault, addPlanState } from '../../states/addPlanState';
import { addPlanChartState } from '../../states/addPlanChartState';
import { AddPlanChart } from '../../../types/chart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomButton from '../../components/BottomButton';
import { cloneDeep } from 'lodash';
import { PickerIOS } from '@react-native-picker/picker';
import { timePickerState } from '../../states/timePickerState';
import { MAIN_COLOR } from '../../constants/color';
import { notiOptiosList } from '../PlanNotiSettingPage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const arrowRightImage = require('../../assets/images/arrow_right.png');
const underlineImage = require('../../assets/images/underline.png');
const arrowDownImage = require('../../assets/images/arrow_down.png');

type AddPlanPageProps = NativeStackScreenProps<MainTabStackParamList, 'AddPlanPage'>;

const AddPlanPage = ({ navigation, route }: AddPlanPageProps) => {
  const isModify = route.params?.planIndex !== undefined;
  const [chart, setChart] = useRecoilState(addPlanChartState);
  const [plan, setPlan] = useRecoilState(addPlanState);

  const [openStartPicker, setOpenStartTimePicker] = useState(false);
  const [openEndPicker, setOpenEndTimePicker] = useState(false);
  const [startTime, setStartTime] = useState<Dayjs>(dayjs('2023-01-08 00:00'));
  const [endTime, setEndTime] = useState<Dayjs>(dayjs('2023-01-08 01:00'));
  const [name, setName] = useState('');

  useEffect(() => {
    if (isModify) {
      setPlan(chart.plans[route.params.planIndex]);
    }

    return () => setPlan(addPlanDefault);
  }, []);

  const setStorageChartData = async (chartData: AddPlanChart) => {
    await AsyncStorage.setItem('chart_data', JSON.stringify(chartData));
  };

  const onPressAddPlan = () => {
    const copiedChart = cloneDeep(chart);
    if (isModify) {
      copiedChart.plans[route.params?.planIndex] = plan;
      setChart(copiedChart);
      setStorageChartData(copiedChart);
    } else {
      const startHour = startTime.get('hour');
      const startMin = startTime.get('minute');
      const endHour = endTime.get('hour');
      const endMin = endTime.get('minute');

      const newPlan = {
        ...plan,
        name,
        startTime: { hour: startHour, minute: startMin },
        endTime: { hour: endHour, minute: endMin },
      };

      setPlan(newPlan);
      setChart({ ...copiedChart, plans: [...copiedChart.plans, newPlan] });
      setStorageChartData({ ...copiedChart, plans: [...copiedChart.plans, newPlan] });
    }
    navigation.goBack();
  };

  const onPressSetNotification = () => {
    navigation.navigate('PlanNotiSettingPage');
  };

  const onPressStartConfirm = (date: Date) => {
    const newStartTime = dayjs(date);
    if (endTime.diff(newStartTime) < 600000) {
      setEndTime(newStartTime.add(10, 'minute'));
    }
    setStartTime(newStartTime);
    setOpenStartTimePicker(false);
  };

  const onPressEndConfirm = (date: Date) => {
    setEndTime(dayjs(date));
    setOpenEndTimePicker(false);
  };

  const onPressStartCancel = () => {
    setOpenStartTimePicker(false);
  };

  const onPressEndCancel = () => {
    setOpenEndTimePicker(false);
  };

  const onPressSetStart = () => {
    setOpenStartTimePicker(true);
  };

  const onPressSetEnd = () => {
    setOpenEndTimePicker(true);
  };

  const onChangeName = (value: string) => {
    setName(value);
  };

  const getMinEndTime = () => {
    return startTime.add(10, 'minute').toDate();
  };

  const onPressDelete = () => {
    if (!isModify) {
      return;
    }
    const copiedChart = cloneDeep(chart);
    copiedChart.plans.splice(route.params?.planIndex, 1);
    setChart(copiedChart);
    setStorageChartData(copiedChart);

    navigation.goBack();
  };

  return (
    <View style={styles.page}>
      <Header
        title="계획 추가"
        buttonName={'삭제'}
        buttonProps={{ onPress: onPressDelete, style: { display: isModify ? 'flex' : 'none' } }}
        buttonNameProps={{ style: { color: '#E40C0C' } }}
      />
      <View style={styles.content}>
        <View>
          <PlemText style={styles.label}>계획명</PlemText>
          <UnderlineTextInput
            value={name}
            onChangeText={onChangeName}
            style={{ marginTop: 12 }}
            maxLength={14}
            placeholder={'최대 14글자'}
          />
        </View>
        <View>
          <PlemText style={[styles.label, { marginTop: 32 }]}>시간</PlemText>
          <View style={styles.timeInputContainer}>
            <View style={{ flex: 1 }}>
              <View style={styles.timeInputWrap}>
                <PlemText>시작 시간</PlemText>
                <Pressable style={styles.setTimeButton} onPress={onPressSetStart}>
                  <PlemText style={{ color: startTime ? '#000000' : '#AAAAAA' }}>
                    {startTime ? startTime.format('HH:mm') : '00:00'}
                  </PlemText>
                  <Image source={arrowDownImage} style={styles.arrowDownImage} />
                </Pressable>
              </View>
              <Image source={underlineImage} style={styles.underlineImage} />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <View style={styles.timeInputWrap}>
                <PlemText>종료 시간</PlemText>
                <Pressable style={styles.setTimeButton} onPress={onPressSetEnd}>
                  <PlemText style={{ color: endTime ? '#000000' : '#AAAAAA' }}>
                    {endTime ? endTime.format('HH:mm') : '00:00'}
                  </PlemText>
                  <Image source={arrowDownImage} style={styles.arrowDownImage} />
                </Pressable>
              </View>
              <Image source={underlineImage} style={styles.underlineImage} />
            </View>
          </View>
          <View style={styles.underlineButtonWrap}>
            <PlemText>알림</PlemText>
            <Pressable style={styles.underlineButton} onPress={onPressSetNotification}>
              <PlemText>{notiOptiosList.find((e) => e.key === plan.notification)?.label}</PlemText>
              <Image source={arrowRightImage} style={styles.arrowRightImage} />
            </Pressable>
          </View>
          <Image source={underlineImage} style={styles.underlineImage} />
        </View>
      </View>
      <BottomButton title={'등록'} disabled={!name || !startTime || !endTime} onPress={onPressAddPlan} />
      <DateTimePickerModal
        isVisible={openStartPicker}
        mode="time"
        onConfirm={onPressStartConfirm}
        onCancel={onPressStartCancel}
        locale="en_GB"
        is24Hour
        minuteInterval={10}
        date={startTime.toDate()}
      />
      <DateTimePickerModal
        isVisible={openEndPicker}
        mode="time"
        onConfirm={onPressEndConfirm}
        onCancel={onPressEndCancel}
        locale="en_GB"
        is24Hour
        minuteInterval={10}
        date={endTime.toDate()}
      />
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
    marginTop: 32,
  },
  underlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  underlineImage: {
    width: '100%',
    marginTop: 4,
  },
  arrowRightImage: {
    marginLeft: 8,
  },
  content: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  label: {
    fontSize: 14,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  setTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowDownImage: {
    marginLeft: 8,
  },
});

export default AddPlanPage;
