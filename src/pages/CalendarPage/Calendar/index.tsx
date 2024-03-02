import { memo, useMemo } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import uuid from 'react-uuid';
import PlusSvg from 'assets/images/plus_40x40.svg';
import CalendarHeaderLineSvg from 'assets/images/calendar-header-line-gray.svg';
import dayjs, { Dayjs } from 'dayjs';
import { MAIN_COLOR } from 'constants/colors';
import { StyleSheet } from 'react-native';
import { DAYS_OF_WEEK } from 'constants/dates';
import Days from 'pages/CalendarPage/Days';
import { CalendarSchedule, ScheduleMap } from 'api/schedules/getScheduleListApi';
import { SCREEN_WIDTH } from 'constants/etc';
import { Category } from 'states/categoryListState';
import PlemButton from 'components/Atoms/PlemButton';

const Calendar = ({
  year,
  month,
  noRepeatScheduleMap,
  yearlyRepeatScheduleMap,
  monthlyRepeatScheduleMap,
  twoWeeklyRepeatScheduleMap,
  weeklyRepeatScheduleMap,
  dailyRepeatScheduleMap,
  onPressAddSchedule,
  onPressScheduleModalClose,
}: {
  year: number;
  month: number;
  noRepeatScheduleMap?: CalendarSchedule['noRepeatSchedules'];
  yearlyRepeatScheduleMap?: ScheduleMap;
  monthlyRepeatScheduleMap?: ScheduleMap;
  twoWeeklyRepeatScheduleMap?: ScheduleMap;
  weeklyRepeatScheduleMap?: ScheduleMap;
  dailyRepeatScheduleMap?: ScheduleMap;
  categoryList: Category[];
  onPressAddSchedule: (date: Dayjs) => void;
  onPressScheduleModalClose: () => void;
}) => {
  const currentCalendar = useMemo(() => dayjs().set('year', year).set('month', month), [year, month]);

  const renderDaysOfWeek = useMemo(
    () =>
      DAYS_OF_WEEK.map((day) => {
        return (
          <View key={uuid()} style={{ width: SCREEN_WIDTH / 7, justifyContent: 'center', alignItems: 'center' }}>
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
          <PlemButton onPress={() => onPressAddSchedule(currentCalendar)}>
            <PlusSvg />
          </PlemButton>
        </View>
        <View style={styles.daysOfWeekWrap}>{renderDaysOfWeek}</View>
        <CalendarHeaderLineSvg width={'100%'} viewBox={`0 0 ${SCREEN_WIDTH} 4`} />
        <View style={styles.daysWrap}>
          <Days
            month={month}
            year={year}
            noRepeatScheduleMap={noRepeatScheduleMap}
            yearlyRepeatScheduleMap={yearlyRepeatScheduleMap}
            monthlyRepeatScheduleMap={monthlyRepeatScheduleMap}
            twoWeeklyRepeatScheduleMap={twoWeeklyRepeatScheduleMap}
            weeklyRepeatScheduleMap={weeklyRepeatScheduleMap}
            dailyRepeatScheduleMap={dailyRepeatScheduleMap}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: MAIN_COLOR,
    width: SCREEN_WIDTH,
  },
  pageHeader: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
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
    width: Math.floor(SCREEN_WIDTH / 7),
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
