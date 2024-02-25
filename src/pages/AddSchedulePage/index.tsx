import { NativeStackScreenProps } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Alert } from 'react-native';
import { useRecoilState, useRecoilValue } from 'recoil';
import PlemText from 'components/Atoms/PlemText';
import BottomButton from 'components/BottomButton';
import Header from 'components/Header';
import LabelInput from 'components/LabelInput';
import OptionsInputRow from 'components/OptionsInputRow';
import PaletteInputRow from 'components/PaletteInputRow';
import SwitchInputRow from 'components/SwitchInputRow';
import { MAIN_COLOR } from 'constants/colors';
import { addScheduleDefault, addScheduleState } from 'states/addScheduleState';
import { CalendarTabStackParamList } from 'tabs/CalendarTab';
import { notiOptiosList } from 'pages/ScheduleNotiSettingPage';
import { repeatOptionList } from 'pages/ScheduleRepeatSettingPage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { timePadStart } from 'helper/timePadStart';
import { useAddSchedule } from 'hooks/mutations/useAddSchedule';
import { categoryListState } from 'states/categoryListState';
import { useQueryClient } from 'react-query';
import { useUpdateSchedule } from 'hooks/mutations/useUpdateSchedule';
import { useDeleteSchedule } from 'hooks/mutations/useDeleteSchedule';
import ArrowDownSvg from 'assets/images/arrow_down_32x32.svg';
import CustomScrollView from 'components/CustomScrollView/CustomScrollView';
import UnderlineSvg from 'assets/images/underline.svg';
import PlemButton from 'components/Atoms/PlemButton';

type CalendarPageProps = NativeStackScreenProps<CalendarTabStackParamList, 'AddSchedulePage'>;

const AddSchedulePage = ({ navigation, route }: CalendarPageProps) => {
  const queryClient = useQueryClient();
  const propSchedule = route.params.schedule;

  const categoryList = useRecoilValue(categoryListState);
  const [schedule, setSchedule] = useRecoilState(addScheduleState);
  const startDate = dayjs(schedule.startDate);
  const endDate = dayjs(schedule.endDate);

  const [openPalette, setOpenPalette] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const [openStartTimePicker, setOpenStartTimePicker] = useState(false);
  const [openEndTimePicker, setOpenEndTimePicker] = useState(false);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);

  useEffect(() => {
    const defaultStartDate = propSchedule ? propSchedule.startDate : route.params.date;
    const defaultEndDate = propSchedule ? propSchedule.endDate : dayjs(route.params.date).set('hour', 1).toISOString();
    // getCategoryList();

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
  });

  const { isLoading: deleteScheduleLoading, mutate: deleteSchedule } = useDeleteSchedule({
    onSuccess: async (responseData) => {
      if (responseData.status === 200) {
        navigation.pop();
        queryClient.invalidateQueries('getScheduleList');
      } else {
        Alert.alert('알 수 없는 오류가 발생했어요 ;ㅂ;');
        console.info('useDeleteSchedule Error: ', responseData);
      }
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
  });

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

  const handleScheduleDelete = () => {
    if (deleteScheduleLoading || !propSchedule) {
      return;
    }
    deleteSchedule({ id: propSchedule.id });
  };

  const isInvalidDate = () => {
    const start = dayjs(startDate).startOf('minute');
    const end = dayjs(endDate).startOf('minute');

    return start.isAfter(end);
  };

  const handleCatecorySelect = (category: number) => {
    const newSchedule = { ...schedule };
    newSchedule.category = category;
    setSchedule(newSchedule);
  };

  const handleStartDateConfirm = (date: Date) => {
    const newYear = date.getFullYear();
    const newMonth = date.getMonth();
    const newDate = date.getDate();

    setSchedule({
      ...schedule,
      startDate: startDate.set('year', newYear).set('month', newMonth).set('date', newDate).toISOString(),
      endDate: dayjs(date).isAfter(schedule.endDate) ? dayjs(date).add(1, 'hour').toISOString() : schedule.endDate,
    });
    setOpenStartDatePicker(false);
  };

  const handleEndDateConfirm = (date: Date) => {
    const newYear = date.getFullYear();
    const newMonth = date.getMonth();
    const newDate = date.getDate();

    setSchedule({
      ...schedule,
      startDate: dayjs(date).isBefore(schedule.startDate)
        ? dayjs(date).subtract(1, 'hour').toISOString()
        : schedule.startDate,
      endDate: endDate.set('year', newYear).set('month', newMonth).set('date', newDate).toISOString(),
    });
    setOpenEndDatePicker(false);
  };

  const handleStartTimeConfirm = (date: Date) => {
    setSchedule({
      ...schedule,
      startDate: startDate.set('hour', date.getHours()).set('minute', date.getMinutes()).toISOString(),
      endDate: dayjs(date).isAfter(schedule.endDate) ? dayjs(date).add(1, 'hour').toISOString() : schedule.endDate,
    });
    setOpenStartTimePicker(false);
  };

  const handleEndTimeConfirm = (date: Date) => {
    setSchedule({
      ...schedule,
      startDate: dayjs(date).isBefore(schedule.startDate)
        ? dayjs(date).subtract(1, 'hour').toISOString()
        : schedule.startDate,
      endDate: endDate.set('hour', date.getHours()).set('minute', date.getMinutes()).toISOString(),
    });
    setOpenEndTimePicker(false);
  };

  const handleNameChange = (value: string) => {
    setSchedule({ ...schedule, name: value });
  };

  return (
    <>
      <CustomScrollView contentContainerStyle={styles.scroll}>
        <TouchableWithoutFeedback onPress={() => setOpenPalette(false)}>
          <View style={styles.page}>
            <Header
              title="일정 추가"
              buttonName={propSchedule ? '삭제' : ''}
              buttonProps={propSchedule ? { onPress: handleScheduleDelete } : null}
              buttonNameProps={propSchedule ? { style: { color: '#E40C0C' } } : null}
            />
            <View style={styles.content}>
              <LabelInput
                label={'일정명'}
                value={schedule.name}
                onChangeText={handleNameChange}
                maxLength={14}
                placeholder={'최대 14자리'}
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
                          <PlemButton style={styles.setDateButton} onPress={() => setOpenStartDatePicker(true)}>
                            <PlemText>{startDate.format('YY.MM.DD')}</PlemText>
                            <ArrowDownSvg style={styles.arrowDownImage} />
                          </PlemButton>
                        </View>
                        <UnderlineSvg
                          preserveAspectRatio="none"
                          width={'100%'}
                          stroke={'#000'}
                          style={styles.underline}
                        />
                      </View>
                      <View style={{ flex: 1, marginLeft: 15 }}>
                        <View style={styles.dateInputWrap}>
                          <PlemText>날짜</PlemText>
                          <PlemButton style={styles.setDateButton} onPress={() => setOpenEndDatePicker(true)}>
                            <PlemText>{endDate.format('YY.MM.DD')}</PlemText>
                            <ArrowDownSvg style={styles.arrowDownImage} />
                          </PlemButton>
                        </View>
                        <UnderlineSvg
                          preserveAspectRatio="none"
                          width={'100%'}
                          stroke={'#000'}
                          style={styles.underline}
                        />
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
                          <PlemButton style={styles.setDateButton} onPress={() => setOpenStartDatePicker(true)}>
                            <PlemText>{startDate.format('YY.MM.DD')}</PlemText>
                            <ArrowDownSvg style={styles.arrowDownImage} />
                          </PlemButton>
                        </View>
                        <UnderlineSvg
                          preserveAspectRatio="none"
                          width={'100%'}
                          stroke={'#000'}
                          style={styles.underline}
                        />
                      </View>
                      <View style={{ flex: 1, marginLeft: 15 }}>
                        <View style={styles.dateInputWrap}>
                          <PlemText>시간</PlemText>
                          <PlemButton style={styles.setDateButton} onPress={() => setOpenStartTimePicker(true)}>
                            <PlemText>
                              {`${timePadStart(startDate.get('hour'))}:${timePadStart(startDate.get('minute'))}`}
                            </PlemText>
                            <ArrowDownSvg style={styles.arrowDownImage} />
                          </PlemButton>
                        </View>
                        <UnderlineSvg
                          preserveAspectRatio="none"
                          width={'100%'}
                          stroke={'#000'}
                          style={styles.underline}
                        />
                      </View>
                    </View>
                    <PlemText style={[styles.label, { marginTop: 32 }]}>종료</PlemText>
                    <View style={styles.dateInputContainer}>
                      <View style={{ flex: 1 }}>
                        <View style={styles.dateInputWrap}>
                          <PlemText>날짜</PlemText>
                          <PlemButton style={styles.setDateButton} onPress={() => setOpenEndDatePicker(true)}>
                            <PlemText>{endDate.format('YY.MM.DD')}</PlemText>
                            <ArrowDownSvg style={styles.arrowDownImage} />
                          </PlemButton>
                        </View>
                        <UnderlineSvg
                          preserveAspectRatio="none"
                          width={'100%'}
                          stroke={'#000'}
                          style={styles.underline}
                        />
                      </View>
                      <View style={{ flex: 1, marginLeft: 15 }}>
                        <View style={styles.dateInputWrap}>
                          <PlemText>시간</PlemText>
                          <PlemButton style={styles.setDateButton} onPress={() => setOpenEndTimePicker(true)}>
                            <PlemText>
                              {`${timePadStart(endDate.get('hour'))}:${timePadStart(endDate.get('minute'))}`}
                            </PlemText>
                            <ArrowDownSvg style={styles.arrowDownImage} />
                          </PlemButton>
                        </View>
                        <UnderlineSvg
                          preserveAspectRatio="none"
                          width={'100%'}
                          stroke={'#000'}
                          style={styles.underline}
                        />
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
            <DateTimePickerModal
              isVisible={openStartTimePicker}
              mode="time"
              onConfirm={handleStartTimeConfirm}
              onCancel={() => setOpenStartTimePicker(false)}
              locale="en_GB"
              is24Hour={true}
              minuteInterval={5}
              date={startDate.toDate()}
            />
            <DateTimePickerModal
              isVisible={openEndTimePicker}
              mode="time"
              onConfirm={handleEndTimeConfirm}
              onCancel={() => setOpenEndTimePicker(false)}
              locale="en_GB"
              is24Hour={true}
              minuteInterval={5}
              date={endDate.toDate()}
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
      </CustomScrollView>
      <BottomButton
        title={propSchedule ? '편집' : '등록'}
        disabled={!schedule.name}
        onPress={propSchedule ? handleScheduleUpdate : handleScheduleSubmit}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 100,
  },
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
  underline: {
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
