import { NativeStackScreenProps } from '@react-navigation/native-stack';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { Pressable, View, Image, StyleSheet, TouchableWithoutFeedback, Alert } from 'react-native';
import { useRecoilState } from 'recoil';
import PlemText from '../../components/Atoms/PlemText';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import OptionsInputRow from '../../components/OptionsInputRow';
import PaletteInputRow from '../../components/PaletteInputRow';
import SwitchInputRow from '../../components/SwitchInputRow';
import { MAIN_COLOR } from '../../constants/colors';
import { addScheduleDefault, addScheduleState } from '../../states/addScheduleState';
import { CalendarTabStackParamList } from '../../tabs/CalendarTab';
import { notiOptiosList } from '../ScheduleNotiSettingPage';
import { repeatOptionList } from '../ScheduleRepeatSettingPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { timePadStart } from '../../helper/timePadStart';
import { useAddSchedule } from '../../hooks/mutaions/useAddSchedule';
import { categoryListState } from '../../states/categoryListState';
import { useQueryClient } from 'react-query';
import { useUpdateSchedule } from '../../hooks/mutaions/useUpdateSchedule';

const underlineImage = require('../../assets/images/underline.png');
const arrowDownImage = require('../../assets/images/arrow_down.png');

type CalendarPageProps = NativeStackScreenProps<CalendarTabStackParamList, 'AddSchedulePage'>;

const AddSchedulePage = ({ navigation, route }: CalendarPageProps) => {
  const queryClient = useQueryClient();
  const propSchedule = route.params.schedule;

  const [schedule, setSchedule] = useRecoilState(addScheduleState);
  const startDate = dayjs(schedule.startDate);
  const endDate = dayjs(schedule.endDate);
  const [categoryList, setCategoryList] = useRecoilState(categoryListState);

  const [openPalette, setOpenPalette] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const [openStartTimePicker, setOpenStartTimePicker] = useState(false);
  const [openEndTimePicker, setOpenEndTimePicker] = useState(false);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);

  useEffect(() => {
    const defaultStartDate = propSchedule ? propSchedule.startDate : route.params.date;
    const defaultEndDate = propSchedule ? propSchedule.endDate : dayjs(route.params.date).set('hour', 1).toISOString();
    getCategoryList();

    if (propSchedule) {
      setSchedule({
        name: propSchedule.name,
        category: propSchedule.category,
        startDate: defaultStartDate,
        endDate: defaultEndDate,
        notification: propSchedule.notification,
        repeats: propSchedule.repeats,
      });
    } else {
      setSchedule({ ...schedule, startDate: defaultStartDate, endDate: defaultEndDate });
    }

    return () => setSchedule(addScheduleDefault);
  }, []);

  const { isLoading: addScheduleLoading, mutate: addSchedule } = useAddSchedule({
    onSuccess: async (responseData) => {
      if (responseData.status === 200) {
        navigation.pop();
        queryClient.invalidateQueries('getScheduleList');
      } else {
        Alert.alert('알 수 없는 오류가 발생했어요 ;ㅂ;');
        console.info('useAddSchedule Error: ', responseData);
      }
    },
    onError: (e) => {
      Alert.alert('알 수 없는 에러가 발생햇습니다 ;ㅂ;');
      console.info('useAddSchedule Error: ', e);
    },
  });

  const { isLoading: updateScheduleLoading, mutate: updateSchedule } = useUpdateSchedule({
    onSuccess: async (responseData) => {
      if (responseData.status === 200) {
        navigation.pop();
        queryClient.invalidateQueries('getScheduleList');
      } else {
        Alert.alert('알 수 없는 오류가 발생했어요 ;ㅂ;');
        console.info('useAddSchedule Error: ', responseData);
      }
    },
    onError: (e) => {
      Alert.alert('알 수 없는 에러가 발생햇습니다 ;ㅂ;');
      console.info('useAddSchedule Error: ', e);
    },
  });

  const handleDelete = () => {
    navigation.goBack();
  };

  const handleScheduleSubmit = () => {
    if (addScheduleLoading) {
      return;
    }

    if (isInvalidDate()) {
      return Alert.alert('종료시간이 시작시간 보다 빠를 수 없습니다.');
    }

    addSchedule({ ...schedule });
  };

  const handleScheduleUpdate = () => {
    if (updateScheduleLoading || !propSchedule) {
      return;
    }

    if (isInvalidDate()) {
      return Alert.alert('종료시간이 시작시간 보다 빠를 수 없습니다.');
    }

    updateSchedule({ ...schedule, id: propSchedule.id });
  };

  const isInvalidDate = () => {
    const start = dayjs(startDate).set('second', 0).set('millisecond', 0);
    const end = dayjs(endDate).set('second', 0).set('millisecond', 0);

    return start.isAfter(end) || start.isSame(end);
  };

  const getCategoryList = async () => {
    const categoriyList = await AsyncStorage.getItem('categoryList');
    if (!categoriyList) {
      return;
    }
    setCategoryList(JSON.parse(categoriyList));
  };

  const handleCatecorySelect = (category: number) => {
    const newSchedule = { ...schedule };
    newSchedule.category = category;
    setSchedule(newSchedule);
  };

  const handleStartTimeConfirm = (date: Date) => {
    setSchedule({
      ...schedule,
      startDate: startDate.set('hour', date.getHours()).set('minute', date.getMinutes()).toISOString(),
    });
    setOpenStartTimePicker(false);
  };

  const handleEndTimeConfirm = (date: Date) => {
    setSchedule({
      ...schedule,
      endDate: endDate.set('hour', date.getHours()).set('minute', date.getMinutes()).toISOString(),
    });
    setOpenEndTimePicker(false);
  };

  const getTimePickerValue = ({ hour, min }: { hour: number; min: number }) => {
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(min);
    return date;
  };

  const handleStartDateConfirm = (date: Date) => {
    const newYear = date.getFullYear();
    const newMonth = date.getMonth();
    const newDate = date.getDate();
    setSchedule({
      ...schedule,
      startDate: startDate.set('year', newYear).set('month', newMonth).set('date', newDate).toISOString(),
    });
    setOpenStartDatePicker(false);
  };

  const handleEndDateConfirm = (date: Date) => {
    const newYear = date.getFullYear();
    const newMonth = date.getMonth();
    const newDate = date.getDate();
    setSchedule({
      ...schedule,
      endDate: endDate.set('year', newYear).set('month', newMonth).set('date', newDate).toISOString(),
    });
    setOpenEndDatePicker(false);
  };

  const handleNameChange = (value: string) => {
    setSchedule({ ...schedule, name: value });
  };

  return (
    <TouchableWithoutFeedback onPress={() => setOpenPalette(false)}>
      <View style={styles.page}>
        <Header
          title="일정 추가"
          buttonName={propSchedule ? '삭제' : ''}
          buttonProps={propSchedule ? { onPress: handleDelete } : null}
          buttonNameProps={propSchedule ? { style: { color: '#E40C0C' } } : null}
        />
        <View style={styles.content}>
          <LabelInput
            label={'일정명'}
            value={schedule.name}
            onChangeText={handleNameChange}
            maxLength={14}
            placeholder={'최대 14글자'}
          />
          <View style={{ marginTop: 32, zIndex: 1000 }}>
            <PaletteInputRow
              label="카테고리"
              onPress={() => setOpenPalette(!openPalette)}
              open={openPalette}
              palettePosition={{ x: -10, y: 8 }}
              list={categoryList}
              selectedItem={categoryList.find((item) => item.value === schedule.category) || categoryList[0]}
              onSelect={handleCatecorySelect}
              onClose={() => setOpenPalette(false)}
            />
          </View>
          <View style={{ marginTop: 32 }}>
            <SwitchInputRow label={'하루 종일'} value={isAllDay} onPress={() => setIsAllDay(!isAllDay)} />
          </View>
          <View>
            {isAllDay ? (
              <>
                <PlemText style={[styles.label, { marginTop: 32 }]}>날짜</PlemText>
                <View style={styles.dateInputContainer}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.dateInputWrap}>
                      <PlemText>시작</PlemText>
                      <Pressable style={styles.setDateButton} onPress={() => setOpenStartDatePicker(true)}>
                        <PlemText>{startDate.format('YY.MM.DD')}</PlemText>
                        <Image source={arrowDownImage} style={styles.arrowDownImage} />
                      </Pressable>
                    </View>
                    <Image source={underlineImage} style={styles.underlineImage} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <View style={styles.dateInputWrap}>
                      <PlemText>날짜</PlemText>
                      <Pressable style={styles.setDateButton} onPress={() => setOpenEndDatePicker(true)}>
                        <PlemText>{endDate.format('YY.MM.DD')}</PlemText>
                        <Image source={arrowDownImage} style={styles.arrowDownImage} />
                      </Pressable>
                    </View>
                    <Image source={underlineImage} style={styles.underlineImage} />
                  </View>
                </View>
              </>
            ) : (
              <>
                <PlemText style={[styles.label, { marginTop: 32 }]}>시작</PlemText>
                <View style={styles.dateInputContainer}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.dateInputWrap}>
                      <PlemText>날짜</PlemText>
                      <Pressable style={styles.setDateButton} onPress={() => setOpenStartDatePicker(true)}>
                        <PlemText>{startDate.format('YY.MM.DD')}</PlemText>
                        <Image source={arrowDownImage} style={styles.arrowDownImage} />
                      </Pressable>
                    </View>
                    <Image source={underlineImage} style={styles.underlineImage} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <View style={styles.dateInputWrap}>
                      <PlemText>시간</PlemText>
                      <Pressable style={styles.setDateButton} onPress={() => setOpenStartTimePicker(true)}>
                        <PlemText>
                          {`${timePadStart(startDate.get('hour'))}:${timePadStart(startDate.get('minute'))}`}
                        </PlemText>
                        <Image source={arrowDownImage} style={styles.arrowDownImage} />
                      </Pressable>
                    </View>
                    <Image source={underlineImage} style={styles.underlineImage} />
                  </View>
                </View>
                <PlemText style={[styles.label, { marginTop: 32 }]}>종료</PlemText>
                <View style={styles.dateInputContainer}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.dateInputWrap}>
                      <PlemText>날짜</PlemText>
                      <Pressable style={styles.setDateButton} onPress={() => setOpenEndDatePicker(true)}>
                        <PlemText>{endDate.format('YY.MM.DD')}</PlemText>
                        <Image source={arrowDownImage} style={styles.arrowDownImage} />
                      </Pressable>
                    </View>
                    <Image source={underlineImage} style={styles.underlineImage} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <View style={styles.dateInputWrap}>
                      <PlemText>시간</PlemText>
                      <Pressable style={styles.setDateButton} onPress={() => setOpenEndTimePicker(true)}>
                        <PlemText>
                          {`${timePadStart(endDate.get('hour'))}:${timePadStart(endDate.get('minute'))}`}
                        </PlemText>
                        <Image source={arrowDownImage} style={styles.arrowDownImage} />
                      </Pressable>
                    </View>
                    <Image source={underlineImage} style={styles.underlineImage} />
                  </View>
                </View>
              </>
            )}
            <View style={{ marginTop: 32 }}>
              <OptionsInputRow
                label={'알림'}
                value={notiOptiosList.find((e) => e.key === schedule.notification)?.label}
                onPress={() => navigation.navigate('ScheduleNotiSettingPage')}
              />
            </View>
            <View style={{ marginTop: 32 }}>
              <OptionsInputRow
                label={'반복'}
                value={repeatOptionList.find((option) => option.value === schedule.repeats)?.label || '안 함'}
                onPress={() => navigation.navigate('ScheduleRepeatSettingPage')}
              />
            </View>
          </View>
        </View>
        <BottomButton
          title={propSchedule ? '편집' : '등록'}
          disabled={false}
          onPress={propSchedule ? handleScheduleUpdate : handleScheduleSubmit}
        />
        <DateTimePickerModal
          isVisible={openStartTimePicker}
          mode="time"
          onConfirm={handleStartTimeConfirm}
          onCancel={() => setOpenStartTimePicker(false)}
          locale="en_GB"
          is24Hour
          minuteInterval={10}
          date={getTimePickerValue({ hour: startDate.get('hour'), min: startDate.get('minute') })}
        />
        <DateTimePickerModal
          isVisible={openEndTimePicker}
          mode="time"
          onConfirm={handleEndTimeConfirm}
          onCancel={() => setOpenEndTimePicker(false)}
          locale="en_GB"
          is24Hour
          minuteInterval={10}
          date={getTimePickerValue({ hour: endDate.get('hour'), min: endDate.get('minute') })}
        />
        <DateTimePickerModal
          isVisible={openStartDatePicker}
          mode="date"
          onConfirm={handleStartDateConfirm}
          onCancel={() => setOpenStartDatePicker(false)}
          date={startDate.toDate()}
        />
        <DateTimePickerModal
          isVisible={openEndDatePicker}
          mode="date"
          onConfirm={handleEndDateConfirm}
          onCancel={() => setOpenEndDatePicker(false)}
          date={endDate.toDate()}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: MAIN_COLOR,
    flex: 1,
    position: 'relative',
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
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  setDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowDownImage: {
    marginLeft: 8,
  },
});

export default AddSchedulePage;
