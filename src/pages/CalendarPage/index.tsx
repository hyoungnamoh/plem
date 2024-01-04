import { NativeStackScreenProps } from '@react-navigation/native-stack';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { MAIN_COLOR } from '../../constants/colors';
import { CalendarTabStackParamList } from '../../tabs/CalendarTab';
import { useGetScheduleList } from '../../hooks/queries/useGetScheduleList';
import { categoryListState } from '../../states/categoryListState';
import { bottomSafeAreaState } from '../../states/bottomSafeAreaState';
import { useFocusEffect } from '@react-navigation/native';
import Carousel from '../../components/Carousel/Carousel';
import Calendar from './Calendar';
import { AddScheduleModal } from './AddScheduleModal';
import { selectedCalendarDateState } from '../../states/selectedCalendarDateState';
import { openScheduleModalState } from '../../states/openScheduleModalState';
import { SCREEN_WIDTH } from '../../constants/etc';
import { Schedule } from '../../../types/calendar';

type CalendarPageProps = NativeStackScreenProps<CalendarTabStackParamList, 'CalendarPage'>;

const NUM_OF_YEAR_RANGE = 6;
const NUM_OF_MONTHS = 12;

const CalendarPage = ({ navigation }: CalendarPageProps) => {
  const categoryList = useRecoilValue(categoryListState);
  const [bottomSafeArea, setBottomSafeArea] = useRecoilState(bottomSafeAreaState);
  const [selectedDate, setSelectedDate] = useRecoilState(selectedCalendarDateState);
  const [openScheduleModal, setOpenScheduleModal] = useRecoilState(openScheduleModalState);

  const [currentCalendar, setCurrentCalendar] = useState(dayjs());

  const { data: calendarSchedule } = useGetScheduleList();

  useFocusEffect(() => {
    if (bottomSafeArea !== MAIN_COLOR) {
      setBottomSafeArea(MAIN_COLOR);
    }
  });

  useFocusEffect(
    useCallback(() => {
      setCurrentCalendar(dayjs());
    }, [])
  );

  const onPressScheduleModalClose = useCallback(() => {
    setOpenScheduleModal(false);
    setSelectedDate(null);
  }, []);

  const onPressAddSchedule = useCallback((date: Dayjs) => {
    navigation.navigate('AddSchedulePage', { date: date.toISOString() });
  }, []);

  const getTwoWeeklyRepeatScheduleList = useCallback(() => {
    const twoWeeksRepeatScheduleList: Schedule[] = [];
    calendarSchedule?.data.repeatSchedules?.twoWeeklyRepeatSchedules.map((schedule) => {
      const list = [];
      const startDate = dayjs(schedule.startDate);
      const endDate = dayjs(schedule.endDate);
      let repeatDate = startDate;
      while (repeatDate.isBefore(endDate)) {
        list.push(schedule);
        repeatDate = repeatDate.add(14, 'day');
      }
      twoWeeksRepeatScheduleList.concat(list);
    });
    return twoWeeksRepeatScheduleList;
  }, [calendarSchedule?.data.repeatSchedules?.twoWeeklyRepeatSchedules]);

  const makeCalendar = useMemo(() => {
    // 연도
    return Array.from({ length: NUM_OF_YEAR_RANGE }, (_, index) => index - NUM_OF_YEAR_RANGE / 2)
      .map((year) => {
        // 월
        return Array.from({ length: NUM_OF_MONTHS }, (_, month) => month).map((month) => {
          return (
            <Calendar
              categoryList={categoryList}
              month={month}
              year={currentCalendar.year() + year}
              noRepeatScheduleMap={calendarSchedule?.data.noRepeatSchedules}
              onPressAddSchedule={onPressAddSchedule}
              onPressScheduleModalClose={onPressScheduleModalClose}
              monthlyRepeatScheduleList={calendarSchedule?.data.repeatSchedules?.monthlyRepeatScheduleMap}
              twoWeeklyRepeatScheduleList={getTwoWeeklyRepeatScheduleList()}
              weeklyRepeatScheduleList={calendarSchedule?.data.repeatSchedules?.weeklyRepeatSchedules}
              dailyRepeatScheduleList={calendarSchedule?.data.repeatSchedules?.dailyRepeatSchedules}
            />
          );
        });
      })
      .flatMap((item) => item);
  }, [categoryList, currentCalendar.year(), calendarSchedule?.data, onPressAddSchedule, onPressScheduleModalClose]);

  return (
    <>
      <Carousel
        pageWidth={SCREEN_WIDTH}
        pages={makeCalendar}
        defaultPage={makeCalendar.length / 2 + currentCalendar.month()}
      />
      <AddScheduleModal
        open={openScheduleModal}
        targetDate={selectedDate || currentCalendar}
        close={onPressScheduleModalClose}
        onPressAddSchedule={() => selectedDate && onPressAddSchedule(selectedDate)}
        scheduleList={calendarSchedule?.data}
      />
    </>
  );
};

export default CalendarPage;
