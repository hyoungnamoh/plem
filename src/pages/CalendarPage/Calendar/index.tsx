import { memo, useMemo } from 'react';
import { Dimensions, Pressable, TouchableWithoutFeedback, View } from 'react-native';
import PlemText from '../../../components/Atoms/PlemText';
import uuid from 'react-uuid';
import PlusSvg from '../../../assets/images/plus_40x40.svg';
import CalendarHeaderLineSvg from '../../../assets/images/calendar-header-line-gray.svg';
import dayjs, { Dayjs } from 'dayjs';
import { MAIN_COLOR } from '../../../constants/colors';
import { StyleSheet } from 'react-native';
import { DAYS_OF_WEEK } from '../../../constants/dates';
import Days from '../Days';
import { CalendarSchedule } from '../../../api/schedules/getScheduleListApi';

const Calendar = ({
  year,
  month,
  calendarSchedule,
  onPressAddSchedule,
  onPressScheduleModalClose,
}: {
  year: number;
  month: number;
  calendarSchedule?: CalendarSchedule;
  categoryList: {
    label: string;
    image: number;
    value: number;
  }[];
  onPressAddSchedule: (date: Dayjs) => void;
  onPressScheduleModalClose: () => void;
}) => {
  const currentCalendar = useMemo(() => dayjs().set('year', year).set('month', month), [year, month]);

  const renderDaysOfWeek = useMemo(
    () =>
      DAYS_OF_WEEK.map((day) => {
        return (
          <View
            key={uuid()}
            style={{ width: Dimensions.get('screen').width / 7, justifyContent: 'center', alignItems: 'center' }}>
            <PlemText style={{ color: day.key === 'sun' ? '#E40C0C' : '#000' }}>{day.value}</PlemText>
          </View>
        );
      }),
    []
  );

  return (
    <TouchableWithoutFeedback onPress={onPressScheduleModalClose}>
      <View key={uuid()} style={styles.page}>
        <View style={styles.pageHeader}>
          <PlemText style={styles.pageHeaderDate}>{`${year}년 ${month + 1}월`}</PlemText>
          <Pressable onPress={() => onPressAddSchedule(currentCalendar)}>
            <PlusSvg />
          </Pressable>
        </View>
        <View style={styles.daysOfWeekWrap}>{renderDaysOfWeek}</View>
        <CalendarHeaderLineSvg width={'100%'} viewBox={`0 0 ${Dimensions.get('screen').width} 4`} />
        <View style={styles.daysWrap}>
          <Days month={month} year={year} calendarSchedule={calendarSchedule} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: MAIN_COLOR,
    width: Dimensions.get('screen').width,
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
    width: '100%',
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

export default memo(Calendar);
