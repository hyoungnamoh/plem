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
import PaletteInputRow, { DEFAULT_CATEGORY_LIST, PaletteListItemType } from '../../components/PaletteInputRow';
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

const underlineImage = require('../../assets/images/underline.png');
const arrowDownImage = require('../../assets/images/arrow_down.png');

type CalendarPageProps = NativeStackScreenProps<CalendarTabStackParamList, 'AddSchedulePage'>;

const AddSchedulePage = ({ navigation, route }: CalendarPageProps) => {
  const propSchedule = route.params?.schedule;

  const [schedule, setSchedule] = useRecoilState(addScheduleState);

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState<Dayjs>(
    propSchedule ? dayjs(propSchedule.startDate) : dayjs().set('second', 0)
  );
  const [endDate, setEndDate] = useState<Dayjs>(
    propSchedule ? dayjs(propSchedule.startDate) : dayjs().set('second', 0)
  );
  const [openPalette, setOpenPalette] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const [categoryList, setCategoryList] = useState<PaletteListItemType[]>(DEFAULT_CATEGORY_LIST);
  const [openStartTimePicker, setOpenStartTimePicker] = useState(false);
  const [openEndTimePicker, setOpenEndTimePicker] = useState(false);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [startHour, setStartHour] = useState(0);
  const [startMin, setStartMin] = useState(0);
  const [endHour, setEndHour] = useState(1);
  const [endMin, setEndMin] = useState(0);

  useEffect(() => {
    getCategoryList();

    if (propSchedule) {
      setSchedule({
        name: propSchedule.name,
        category: propSchedule.category,
        startDate: propSchedule.startDate,
        endDate: propSchedule.endDate,
        notification: propSchedule.notification,
        repeats: propSchedule.repeats,
      });
    }
    return () => setSchedule(addScheduleDefault);
  }, []);

  const { isLoading: addScheduleLoading, mutate: addSchedule } = useAddSchedule({
    onSuccess: async (responseData) => {
      if (responseData.status === 200) {
        navigation.pop();
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

  const onPressDelete = () => {
    navigation.goBack();
  };

  const onPressAddSchedule = () => {
    if (addScheduleLoading) {
      return;
    }

    if (isInvalidDate()) {
      return Alert.alert('종료시간이 시작시간 보다 빠를 수 없습니다.');
    }
    addSchedule({
      ...schedule,
      name,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  const isInvalidDate = () => {
    const start = dayjs(startDate)
      .set('hour', startHour)
      .set('minute', startMin)
      .set('second', 0)
      .set('millisecond', 0);
    const end = dayjs(endDate).set('hour', endHour).set('minute', endMin).set('second', 0).set('millisecond', 0);

    return start.isAfter(end) || start.isSame(end);
  };

  const onPressPalette = () => {
    setOpenPalette(!openPalette);
  };

  const onPressSetNotification = () => {
    navigation.navigate('ScheduleNotiSettingPage');
  };

  const onPressRepeatSetting = () => {
    navigation.navigate('ScheduleRepeatSettingPage');
  };

  const getCategoryList = async () => {
    const categoriyList = await AsyncStorage.getItem('categoryList');
    if (!categoriyList) {
      return;
    }
    setCategoryList(JSON.parse(categoriyList));
  };

  const handleCatecoryClick = (category: number) => {
    const newSchedule = { ...schedule };
    newSchedule.category = category;
    setSchedule(newSchedule);
  };

  const handlePaletteClose = () => {
    setOpenPalette(false);
  };

  const onPressStartTimeConfirm = (date: Date) => {
    const newStart = dayjs().set('hour', date.getHours()).set('minute', date.getMinutes());
    setStartHour(newStart.get('hour'));
    setStartMin(newStart.get('minute'));

    setOpenStartTimePicker(false);
  };

  const onPressStartTimeCancel = () => {
    setOpenStartTimePicker(false);
  };

  const onPressEndTimeCancel = () => {
    setOpenEndTimePicker(false);
  };

  const onPressSetStartTime = () => {
    setOpenStartTimePicker(true);
  };

  const onPressSetEndTime = () => {
    setOpenEndTimePicker(true);
  };

  const getTimePickerValue = ({ hour, min }: { hour: number; min: number }) => {
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(min);
    return date;
  };

  const onPressEndTimeConfirm = (date: Date) => {
    setEndHour(date.getHours());
    setEndMin(date.getMinutes());
    setOpenEndTimePicker(false);
  };

  const onPressStartDateConfirm = (date: Date) => {
    setStartDate(dayjs(date));
    setOpenStartDatePicker(false);
  };

  const onPressStartDateCancel = () => {
    setOpenStartDatePicker(false);
  };

  const onPressEndDateConfirm = (date: Date) => {
    setEndDate(dayjs(date));
    setOpenEndDatePicker(false);
  };

  const onPressEndDateCancel = () => {
    setOpenEndDatePicker(false);
  };

  const onPressSetStartDate = () => {
    setOpenStartDatePicker(true);
  };

  const onPressSetEndDate = () => {
    setOpenEndDatePicker(true);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePaletteClose}>
      <View style={styles.page}>
        <Header
          title="일정 추가"
          buttonName={propSchedule ? '삭제' : ''}
          buttonProps={propSchedule ? { onPress: onPressDelete } : null}
          buttonNameProps={propSchedule ? { style: { color: '#E40C0C' } } : null}
        />
        <View style={styles.content}>
          <LabelInput label={'일정명'} value={name} onChangeText={setName} maxLength={14} placeholder={'최대 14글자'} />
          <View style={{ marginTop: 32, zIndex: 1000 }}>
            <PaletteInputRow
              label="카테고리"
              onPress={onPressPalette}
              open={openPalette}
              palettePosition={{ x: -10, y: 8 }}
              list={categoryList}
              selectedItem={categoryList.find((item) => item.value === schedule.category) || categoryList[0]}
              onSelect={handleCatecoryClick}
              onClose={handlePaletteClose}
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
                      <Pressable style={styles.setDateButton} onPress={onPressSetStartDate}>
                        <PlemText>{startDate.format('YY.MM.DD')}</PlemText>
                        <Image source={arrowDownImage} style={styles.arrowDownImage} />
                      </Pressable>
                    </View>
                    <Image source={underlineImage} style={styles.underlineImage} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <View style={styles.dateInputWrap}>
                      <PlemText>날짜</PlemText>
                      <Pressable style={styles.setDateButton} onPress={onPressSetEndDate}>
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
                      <Pressable style={styles.setDateButton} onPress={onPressSetStartDate}>
                        <PlemText>{startDate.format('YY.MM.DD')}</PlemText>
                        <Image source={arrowDownImage} style={styles.arrowDownImage} />
                      </Pressable>
                    </View>
                    <Image source={underlineImage} style={styles.underlineImage} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <View style={styles.dateInputWrap}>
                      <PlemText>시간</PlemText>
                      <Pressable style={styles.setDateButton} onPress={onPressSetStartTime}>
                        <PlemText>{`${timePadStart(startHour)}:${timePadStart(startMin)}`}</PlemText>
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
                      <Pressable style={styles.setDateButton} onPress={onPressSetEndDate}>
                        <PlemText>{endDate.format('YY.MM.DD')}</PlemText>
                        <Image source={arrowDownImage} style={styles.arrowDownImage} />
                      </Pressable>
                    </View>
                    <Image source={underlineImage} style={styles.underlineImage} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <View style={styles.dateInputWrap}>
                      <PlemText>시간</PlemText>
                      <Pressable style={styles.setDateButton} onPress={onPressSetEndTime}>
                        <PlemText>{`${timePadStart(endHour)}:${timePadStart(endMin)}`}</PlemText>
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
                onPress={onPressSetNotification}
              />
            </View>
            <View style={{ marginTop: 32 }}>
              <OptionsInputRow
                label={'반복'}
                value={repeatOptionList.find((option) => option.value === schedule.repeats)?.label || '안 함'}
                onPress={onPressRepeatSetting}
              />
            </View>
          </View>
        </View>
        <BottomButton title={'등록'} disabled={false} onPress={onPressAddSchedule} />
        <DateTimePickerModal
          isVisible={openStartTimePicker}
          mode="time"
          onConfirm={onPressStartTimeConfirm}
          onCancel={onPressStartTimeCancel}
          locale="en_GB"
          is24Hour
          minuteInterval={10}
          date={getTimePickerValue({ hour: startHour, min: startMin })}
        />
        <DateTimePickerModal
          isVisible={openEndTimePicker}
          mode="time"
          onConfirm={onPressEndTimeConfirm}
          onCancel={onPressEndTimeCancel}
          locale="en_GB"
          is24Hour
          minuteInterval={10}
          date={getTimePickerValue({ hour: endHour, min: endMin })}
        />
        <DateTimePickerModal
          isVisible={openStartDatePicker}
          mode="date"
          onConfirm={onPressStartDateConfirm}
          onCancel={onPressStartDateCancel}
          date={startDate.toDate()}
        />
        <DateTimePickerModal
          isVisible={openEndDatePicker}
          mode="date"
          onConfirm={onPressEndDateConfirm}
          onCancel={onPressEndDateCancel}
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
