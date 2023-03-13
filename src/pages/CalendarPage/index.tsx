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
import { useRecoilState } from 'recoil';
import PlemText from '../../components/Atoms/PlemText';
import { MAIN_COLOR } from '../../constants/color';
import { DAYS_OF_WEEK } from '../../constants/date';
import { addScheduleState } from '../../states/addScheduleState';
import { CalendarTabStackParamList } from '../../tabs/CalendarTab';
import { AddScheduleModal } from './AddScheduleModal';

const plusImage = require('../../assets/images/plus.png');
const daysLineImage = require('../../assets/images/calendar_days_line.png');
const currentDayStickerImage = require('../../assets/images/current_day_sticker.png');
const circleStrokeImage = require('../../assets/images/circle_stroke.png');

type CalendarPageProps = NativeStackScreenProps<CalendarTabStackParamList, 'CalendarPage'>;

const CalendarPage = ({ navigation }: CalendarPageProps) => {
  const [schedule, setSchedule] = useRecoilState(addScheduleState);

  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [selectedDate, setSelectedDate] = useState<null | number>(null);
  const [openScheduleModal, setOpenScheduleModal] = useState(false);

  const renderDaysOfWeek = () => {
    return DAYS_OF_WEEK.map((day) => {
      return (
        <View
          key={day.key}
          style={{ width: Dimensions.get('screen').width / 7, justifyContent: 'center', alignItems: 'center' }}>
          <PlemText style={{ color: day.key === 'sun' ? '#E40C0C' : '#000' }}>{day.value}</PlemText>
        </View>
      );
    });
  };

  const onPressDate = (date: number) => {
    if (date === selectedDate) {
      setOpenScheduleModal(false);
      setSelectedDate(null);
    } else {
      setOpenScheduleModal(true);
      setSelectedDate(date);
    }
  };

  const renderDays = () => {
    const datesOfMonth = Array.from(new Array(dayjs().daysInMonth()).fill(0), (_, index) => index + 1);
    const firstDateIndex = dayjs(currentDate).set('date', 1).day();

    const emptyDateComponents = new Array(firstDateIndex).fill(1).map((_, index) => {
      return (
        <View
          key={`empty_${index}`}
          style={{
            width: Math.floor(Dimensions.get('screen').width / 7),
            alignItems: 'center',
            height: 64,
          }}
        />
      );
    });

    const dateComponents = datesOfMonth.map((date) => {
      const isCurrentDate = currentDate.date() === date;
      const isSelectedDate = selectedDate === date;
      return (
        <Pressable
          key={date}
          onPress={() => onPressDate(date)}
          style={{
            width: Math.floor(Dimensions.get('screen').width / 7),
            alignItems: 'center',
            height: 64,
          }}>
          <ImageBackground
            source={isCurrentDate ? currentDayStickerImage : circleStrokeImage}
            resizeMode="cover"
            style={{ width: 24, height: 22, justifyContent: 'center', alignItems: 'center' }}
            imageStyle={{ display: isCurrentDate || isSelectedDate ? 'flex' : 'none' }}>
            <PlemText
              style={{
                color: isCurrentDate ? '#fff' : (date + firstDateIndex) % 7 === 1 ? '#E40C0C' : '#000',
                fontSize: 14,
              }}>
              {date}
            </PlemText>
          </ImageBackground>
        </Pressable>
      );
    });

    return emptyDateComponents.concat(dateComponents);
  };

  const onPressScheduleModalClose = () => {
    setOpenScheduleModal(false);
    setSelectedDate(null);
  };

  const onPressAddSchedule = () => {
    navigation.navigate('AddSchedulePage');
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={onPressScheduleModalClose}>
        <View style={styles.page}>
          <View style={styles.pageHeader}>
            <PlemText style={styles.pageHeaderDate}>{`${currentDate.year()}년 ${currentDate.month() + 1}월`}</PlemText>
            <Image source={plusImage} />
          </View>
          <View style={styles.daysOfWeekWrap}>{renderDaysOfWeek()}</View>
          <Image source={daysLineImage} style={styles.daysLineImage} />
          <View style={styles.daysWrap}>{renderDays()}</View>
        </View>
      </TouchableWithoutFeedback>
      <AddScheduleModal
        open={openScheduleModal}
        date={selectedDate ? dayjs(currentDate.set('date', selectedDate)) : currentDate}
        day={selectedDate}
        close={onPressScheduleModalClose}
        onPressAddSchedule={onPressAddSchedule}
      />
    </>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: MAIN_COLOR,
  },
  pageHeader: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  pageHeaderDate: {
    fontSize: 24,
  },
  daysOfWeekWrap: {
    marginTop: 12,
    flexDirection: 'row',
    height: 48,
  },
  daysLineImage: {
    width: Dimensions.get('screen').width,
  },
  daysWrap: {
    marginTop: 12,
    height: 48,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default CalendarPage;
