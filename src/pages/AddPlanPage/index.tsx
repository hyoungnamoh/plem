import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import PlemText from '../../components/Atoms/PlemText';
import Header from '../../components/Header';
import UnderlineTextInput from '../../components/UnderlineTextInput';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabStackParamList } from '../../tabs/MainTab';
import { useRecoilState } from 'recoil';
import { addPlanDefault, addPlanState } from '../../states/addPlanState';
import { notiOptiosList } from '../SetPlanNotificationPage';
import { addPlanChartState } from '../../states/addPlanChartState';
import { AddPlanChart } from '../../../types/chart';
import AsyncStorage from '@react-native-async-storage/async-storage';

const arrowRightImage = require('../../assets/images/arrow_right.png');
const underlineImage = require('../../assets/images/underline.png');
const arrowDownImage = require('../../assets/images/arrow_down.png');

type AddPlanPageProps = NativeStackScreenProps<MainTabStackParamList, 'AddPlanPage'>;

const AddPlanPage = ({ navigation }: AddPlanPageProps) => {
  const [chart, setChart] = useRecoilState(addPlanChartState);
  const [plan, setPlan] = useRecoilState(addPlanState);
  const [openStartTimePicker, setOpenStartTimePicker] = useState(false);
  const [openEndTimePicker, setOpenEndTimePicker] = useState(false);
  const [startTime, setStartTime] = useState<Dayjs>(dayjs('2023-01-08 00:00'));
  const [endTime, setEndTime] = useState<Dayjs>(dayjs('2023-01-08 00:10'));

  useEffect(() => {
    setPlan(addPlanDefault);
  }, []);

  const setStorageChartData = async (chartData: AddPlanChart) => {
    await AsyncStorage.setItem('chart_data', JSON.stringify(chartData));
  };

  const onPressAddPlan = () => {
    setChart({ ...chart, plans: [...chart.plans, plan] });
    setStorageChartData({ ...chart, plans: [...chart.plans, plan] });
    navigation.goBack();
  };

  const onPressSetNotification = () => {
    navigation.navigate('SetPlanNotificationPage');
  };

  const onPressStartTimeConfirm = (date: Date) => {
    setStartTime(dayjs(date));
    setOpenStartTimePicker(false);
  };

  const onPressEndTimeConfirm = (date: Date) => {
    setEndTime(dayjs(date));
    setOpenEndTimePicker(false);
  };

  const onPressStartTimeCancel = () => {
    setOpenStartTimePicker(false);
  };

  const onPressEndTimeCancel = () => {
    setOpenEndTimePicker(false);
  };

  const onPressSetStart = () => {
    setOpenStartTimePicker(true);
  };

  const onPressSetEnd = () => {
    setOpenEndTimePicker(true);
  };

  const onChangeName = (value: string) => {
    setPlan({ ...plan, name: value });
  };

  const getMaxStartTime = () => {
    if (!endTime) {
      return;
    }
    return endTime.subtract(10, 'minute').toDate();
  };

  const getMinEndTime = () => {
    if (!startTime) {
      return;
    }
    return startTime.add(10, 'minute').toDate();
  };

  return (
    <View style={styles.page}>
      <Header
        title="계획 추가"
        buttonName={'등록'}
        buttonProps={{ onPress: onPressAddPlan, disabled: !plan.name || !startTime || !endTime }}
      />
      <View style={styles.content}>
        <View>
          <PlemText style={styles.label}>계획명</PlemText>
          <UnderlineTextInput
            value={plan.name}
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
      <DateTimePickerModal
        isVisible={openStartTimePicker}
        mode="time"
        onConfirm={onPressStartTimeConfirm}
        onCancel={onPressStartTimeCancel}
        date={startTime?.toDate() || undefined}
        locale="en_GB"
        is24Hour={true}
        minuteInterval={5}
        maximumDate={getMaxStartTime()}
      />
      <DateTimePickerModal
        isVisible={openEndTimePicker}
        mode="time"
        onConfirm={onPressEndTimeConfirm}
        onCancel={onPressEndTimeCancel}
        date={endTime?.toDate() || undefined}
        locale="en_GB"
        is24Hour={true}
        minuteInterval={5}
        minimumDate={getMinEndTime()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#F4F1E8',
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
