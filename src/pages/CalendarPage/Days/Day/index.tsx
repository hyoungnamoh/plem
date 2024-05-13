import { StyleSheet, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import { memo, useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import dayjs from 'dayjs';
import { selectedCalendarDateState } from 'states/selectedCalendarDateState';
import { openScheduleModalState } from 'states/openScheduleModalState';
import Sticker from './Sticker';
import { SCREEN_WIDTH } from 'constants/etc';
import ScheduleList from './ScheduleList';
import PlemButton from 'components/Atoms/PlemButton';
import { useScheduleList } from 'hooks/useScheduleList';

const Day = ({
  isToday,
  firstDateIndex,
  date,
  year,
  month,
  isSelected,
}: {
  isToday: boolean;
  firstDateIndex: number;
  date: number;
  year: number;
  month: number;
  isSelected: boolean;
}) => {
  const setSelectedDate = useSetRecoilState(selectedCalendarDateState);
  const setOpenScheduleModal = useSetRecoilState(openScheduleModalState);
  const { allScheduleList } = useScheduleList({ year, month, date, test: 3 });

  const getDateColor = useCallback(() => {
    const isHoliday = allScheduleList.find((schedule) => schedule.type === 'holiday');

    if (isHoliday) {
      return '#E40C0C';
    }
    if (isToday) {
      return '#fff';
    }
    if ((date + firstDateIndex) % 7 === 1) {
      return '#E40C0C';
    }

    return '#000';
  }, [isToday, date, firstDateIndex, allScheduleList.length]);

  const onPressDate = useCallback(() => {
    const selectedDate = dayjs().set('year', year).set('month', month).set('date', date).startOf('date');

    if (isSelected) {
      setOpenScheduleModal(false);
      setSelectedDate(null);
    } else {
      setOpenScheduleModal(true);
      setSelectedDate(selectedDate);
    }
  }, [year, month, date, isSelected]);

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
      <ScheduleList allScheduleList={allScheduleList} />
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
