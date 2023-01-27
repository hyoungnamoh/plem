import { NativeStackScreenProps } from '@react-navigation/native-stack';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  Pressable,
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import PlemText from '../../components/Atoms/PlemText';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import UnderlineTextInput from '../../components/UnderlineTextInput';
import { MAIN_COLOR } from '../../constants/color';
import { DAYS_OF_WEEK } from '../../constants/date';
import { CalendarTabStackParamList } from '../../tabs/CalendarTab';

const arrowRightImage = require('../../assets/images/arrow_right.png');
const underlineImage = require('../../assets/images/underline.png');
const arrowDownImage = require('../../assets/images/arrow_down.png');
const plusImage = require('../../assets/images/plus.png');
const daysLineImage = require('../../assets/images/calendar_days_line.png');
const currentDayStickerImage = require('../../assets/images/current_day_sticker.png');
const circleStrokeImage = require('../../assets/images/circle_stroke.png');
// const addScheduleModal = require('../../assets/images/add_schedule_modal.png');

type CalendarPagePageProps = NativeStackScreenProps<CalendarTabStackParamList, 'AddCalendarPage'>;

const AddCalendarPage = ({ navigation, route }: CalendarPagePageProps) => {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState<Dayjs>(dayjs('2023-01-08 00:00'));
  const [endTime, setEndTime] = useState<Dayjs>(dayjs('2023-01-08 00:10'));

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

  return (
    <View style={styles.page}>
      <Header
        title="계획 추가"
        buttonName={'삭제'}
        buttonProps={{ onPress: onPressDelete }}
        buttonNameProps={{ style: { color: '#E40C0C' } }}
      />
      <View style={styles.content}>
        <View>
          <LabelInput label={'일정명'} value={name} />
          {/* <PlemText style={styles.label}>계획명</PlemText>
          <UnderlineTextInput
            value={name}
            onChangeText={setName}
            style={{ marginTop: 12 }}
            maxLength={14}
            placeholder={'최대 14글자'}
          /> */}
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
            <Pressable style={styles.underlineButton} onPress={() => null}>
              <PlemText>하이</PlemText>
              <Image source={arrowRightImage} style={styles.arrowRightImage} />
            </Pressable>
          </View>
          <Image source={underlineImage} style={styles.underlineImage} />
        </View>
      </View>
      <BottomButton title={'등록'} disabled={false} onPress={onPressAddSchedule} />
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

export default AddCalendarPage;
