import { StyleSheet, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import { Dispatch, memo, useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { CalendarSchedule, ScheduleMap } from 'api/schedules/getScheduleListApi';
import dayjs from 'dayjs';
import { selectedCalendarDateState } from 'states/selectedCalendarDateState';
import { openScheduleModalState } from 'states/openScheduleModalState';
import Sticker from './Sticker';
import { SCREEN_WIDTH } from 'constants/etc';
import ScheduleList from './ScheduleList';
import PlemButton from 'components/Atoms/PlemButton';

const Day = ({
  isToday,
  firstDateIndex,
  noRepeatScheduleMap,
  yearlyRepeatScheduleMap,
  monthlyRepeatScheduleMap,
  twoWeeklyRepeatScheduleMap,
  weeklyRepeatScheduleMap,
  dailyRepeatScheduleMap,
  date,
  year,
  month,
  isSelected,
  setLocalSelectedDate,
}: {
  isToday: boolean;
  firstDateIndex: number;
  noRepeatScheduleMap?: CalendarSchedule['noRepeatSchedules'];
  yearlyRepeatScheduleMap?: ScheduleMap;
  monthlyRepeatScheduleMap?: ScheduleMap;
  twoWeeklyRepeatScheduleMap?: ScheduleMap;
  weeklyRepeatScheduleMap?: ScheduleMap;
  dailyRepeatScheduleMap?: ScheduleMap;
  date: number;
  year: number;
  month: number;
  isSelected: boolean;
  setLocalSelectedDate: Dispatch<React.SetStateAction<number>>;
}) => {
  const setSelectedDate = useSetRecoilState(selectedCalendarDateState);
  const setOpenScheduleModal = useSetRecoilState(openScheduleModalState);

  const getDateColor = useCallback(() => {
    if (isToday) {
      return '#fff';
    }
    if ((date + firstDateIndex) % 7 === 1) {
      return '#E40C0C';
    }

    return '#000';
  }, [isToday, date, firstDateIndex]);

  const onPressDate = () => {
    const selectedDate = dayjs().set('year', year).set('month', month).set('date', date).startOf('date');

    if (isSelected) {
      setOpenScheduleModal(false);
      setSelectedDate(null);
      setLocalSelectedDate(0);
    } else {
      setOpenScheduleModal(true);
      setSelectedDate(selectedDate);
      setLocalSelectedDate(date);
    }
  };

  return (
    <PlemButton key={date} onPress={onPressDate} style={styles.dateCell}>
      <View style={styles.currentDateBackground}>
        <Sticker isToday={isToday} year={year} date={date} month={month} isSelected={isSelected} />
        <PlemText
          style={{
            color: getDateColor(),
            fontSize: 14,
          }}>
          {date}
        </PlemText>
      </View>
      <ScheduleList
        noRepeatScheduleMap={noRepeatScheduleMap}
        yearlyRepeatScheduleMap={yearlyRepeatScheduleMap}
        monthlyRepeatScheduleMap={monthlyRepeatScheduleMap}
        twoWeeklyRepeatScheduleMap={twoWeeklyRepeatScheduleMap}
        weeklyRepeatScheduleMap={weeklyRepeatScheduleMap}
        dailyRepeatScheduleMap={dailyRepeatScheduleMap}
        year={year}
        month={month}
        date={date}
      />
    </PlemButton>
  );
};

const styles = StyleSheet.create({
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
  svg: {
    position: 'absolute',
  },
});

export default memo(Day);
