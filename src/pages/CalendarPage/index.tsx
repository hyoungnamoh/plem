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
import { useRecoilState, useRecoilValue } from 'recoil';
import PlemText from '../../components/Atoms/PlemText';
import { MAIN_COLOR } from '../../constants/colors';
import { DAYS_OF_WEEK } from '../../constants/dates';
import { CalendarTabStackParamList } from '../../tabs/CalendarTab';
import { AddScheduleModal } from './AddScheduleModal';
import { useGetScheduleList } from '../../hooks/queries/useGetScheduleList';
import { categoryListState } from '../../states/categoryListState';
import { bottomSafeAreaState } from '../../states/bottomSafeAreaState';
import { useFocusEffect } from '@react-navigation/native';
import PlusSvg from '../../assets/images/plus_40x40.svg';

const daysLineImage = require('../../assets/images/calendar_days_line.png');
const currentDateStickerImage = require('../../assets/images/current_day_sticker.png');
const circleStrokeImage = require('../../assets/images/circle_stroke.png');

type CalendarPageProps = NativeStackScreenProps<CalendarTabStackParamList, 'CalendarPage'>;

const CalendarPage = ({ navigation }: CalendarPageProps) => {
  const categoryList = useRecoilValue(categoryListState);
  const [bottomSafeArea, setBottomSafeArea] = useRecoilState(bottomSafeAreaState);

  const [selectedDate, setSelectedDate] = useState<null | Dayjs>(null);
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const currentDate = dayjs().startOf('date');

  const { data: scheduleList } = useGetScheduleList({ date: dayjs().toISOString() });

  useFocusEffect(() => {
    if (bottomSafeArea === MAIN_COLOR) {
      return;
    }
    setBottomSafeArea(MAIN_COLOR);
  });

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
    if (date === selectedDate?.date()) {
      setOpenScheduleModal(false);
      setSelectedDate(null);
    } else {
      setOpenScheduleModal(true);
      setSelectedDate(currentDate.set('date', date));
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

    const getDateColor = ({ isCurrentDate, date }: { isCurrentDate: boolean; date: number }) => {
      if (isCurrentDate) {
        return '#fff';
      }
      if ((date + firstDateIndex) % 7 === 1) {
        return '#E40C0C';
      }

      return '#000';
    };

    const dateComponents = datesOfMonth.map((date) => {
      const isCurrentDate = currentDate.date() === date;
      const isSelectedDate = selectedDate?.date() === date;
      return (
        <Pressable key={date} onPress={() => onPressDate(date)} style={styles.dateCell}>
          <ImageBackground
            source={isCurrentDate ? currentDateStickerImage : circleStrokeImage}
            resizeMode="cover"
            style={styles.currentDateBackground}
            imageStyle={{ display: isCurrentDate || isSelectedDate ? 'flex' : 'none' }}>
            <PlemText
              style={{
                color: getDateColor({ isCurrentDate, date }),
                fontSize: 14,
              }}>
              {date}
            </PlemText>
          </ImageBackground>
          <View style={{ marginTop: 2 }}>
            {scheduleList?.data[date].map((reservedSchedule) => {
              return (
                <View key={reservedSchedule.id} style={styles.scheduleRow}>
                  <Image
                    source={
                      categoryList.find((category) => category.value === reservedSchedule.category)?.image ||
                      categoryList[0].image
                    }
                    style={styles.scheduleSticker}
                  />
                  <PlemText style={styles.scheduleName}>{reservedSchedule.name}</PlemText>
                </View>
              );
            })}
          </View>
        </Pressable>
      );
    });

    return emptyDateComponents.concat(dateComponents);
  };

  const onPressScheduleModalClose = () => {
    setOpenScheduleModal(false);
    setSelectedDate(null);
  };

  const onPressAddSchedule = (date: Dayjs) => {
    navigation.navigate('AddSchedulePage', { date: date.toISOString() });
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={onPressScheduleModalClose}>
        <View style={styles.page}>
          <View style={styles.pageHeader}>
            <PlemText style={styles.pageHeaderDate}>{`${currentDate.year()}년 ${currentDate.month() + 1}월`}</PlemText>
            <Pressable onPress={() => onPressAddSchedule(currentDate)}>
              <PlusSvg />
            </Pressable>
          </View>
          <View style={styles.daysOfWeekWrap}>{renderDaysOfWeek()}</View>
          <Image source={daysLineImage} style={styles.daysLineImage} />
          <View style={styles.daysWrap}>{renderDays()}</View>
        </View>
      </TouchableWithoutFeedback>
      <AddScheduleModal
        open={openScheduleModal}
        date={selectedDate || currentDate}
        day={(selectedDate || currentDate).date()}
        close={onPressScheduleModalClose}
        onPressAddSchedule={() => selectedDate && onPressAddSchedule(selectedDate)}
        schedules={scheduleList?.data[(selectedDate || currentDate).date()] || []}
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
  currentDateBackground: {
    width: 24,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateCell: {
    width: Math.floor(Dimensions.get('screen').width / 7),
    alignItems: 'center',
    minHeight: 64,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 2,
  },
  scheduleSticker: {
    width: 6,
    height: 6,
  },
  scheduleName: {
    fontSize: 10,
    marginLeft: 2,
  },
});

export default CalendarPage;
