import { NativeStackScreenProps } from '@react-navigation/native-stack';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { Pressable, View, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
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

const arrowRightImage = require('../../assets/images/arrow_right.png');
const underlineImage = require('../../assets/images/underline.png');
const arrowDownImage = require('../../assets/images/arrow_down.png');
const plusImage = require('../../assets/images/plus.png');
const daysLineImage = require('../../assets/images/calendar_days_line.png');
const currentDateStickerImage = require('../../assets/images/current_day_sticker.png');
const circleStrokeImage = require('../../assets/images/circle_stroke.png');

type CalendarPageProps = NativeStackScreenProps<CalendarTabStackParamList, 'AddSchedulePage'>;

const AddSchedulePage = ({ navigation, route }: CalendarPageProps) => {
  const [schedule, setSchedule] = useRecoilState(addScheduleState);
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState<Dayjs>(dayjs('2023-01-08 00:00'));
  const [endTime, setEndTime] = useState<Dayjs>(dayjs('2023-01-08 00:10'));
  const [openPalette, setOpenPalette] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const isEdit = !!route.params?.schedule;

  useEffect(() => {
    return () => setSchedule(addScheduleDefault);
  }, []);

  const onPressDelete = () => {
    navigation.goBack();
  };

  const onPressSetStart = () => {
    // setOpenStartTimePicker(true);
  };

  const onPressSetEnd = () => {
    // setOpenEndTimePicker(true);
  };

  const onPressAddSchedule = () => {};

  const onClickPalette = () => {
    setOpenPalette(!openPalette);
  };

  const onPressSetNotification = () => {
    navigation.navigate('ScheduleNotiSettingPage');
  };

  const onPressRepeatSetting = () => {
    navigation.navigate('ScheduleRepeatSettingPage');
  };

  return (
    <TouchableWithoutFeedback onPress={() => setOpenPalette(false)}>
      <View style={styles.page}>
        <Header
          title="일정 추가"
          buttonName={isEdit ? '삭제' : ''}
          buttonProps={isEdit ? { onPress: onPressDelete } : null}
          buttonNameProps={isEdit ? { style: { color: '#E40C0C' } } : null}
        />
        <View style={styles.content}>
          <LabelInput label={'일정명'} value={name} onChangeText={setName} maxLength={14} placeholder={'최대 14글자'} />
          <View style={{ marginTop: 32, zIndex: 1000 }}>
            <PaletteInputRow
              label="카테고리"
              value={'daily'}
              onPress={onClickPalette}
              open={openPalette}
              palettePosition={{ x: -10, y: 8 }}
            />
          </View>
          <View style={{ marginTop: 32 }}>
            <SwitchInputRow label={'하루 종일'} value={isAllDay} onPress={() => setIsAllDay(!isAllDay)} />
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
                value={repeatOptionList.find((option) => option.value === schedule.repeat)?.label || '안 함'}
                onPress={onPressRepeatSetting}
              />
            </View>
          </View>
        </View>
        <BottomButton title={'등록'} disabled={false} onPress={onPressAddSchedule} />
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

export default AddSchedulePage;
