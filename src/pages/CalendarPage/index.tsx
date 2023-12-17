import { NativeStackScreenProps } from '@react-navigation/native-stack';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useState } from 'react';
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

type CalendarPageProps = NativeStackScreenProps<CalendarTabStackParamList, 'CalendarPage'>;

const NUM_OF_YEAR_RANGE = 20;
const NUM_OF_MONTHS = 12;

const CalendarPage = ({ navigation }: CalendarPageProps) => {
  const categoryList = useRecoilValue(categoryListState);
  const [bottomSafeArea, setBottomSafeArea] = useRecoilState(bottomSafeAreaState);
  const [selectedDate, setSelectedDate] = useRecoilState(selectedCalendarDateState);
  const [openScheduleModal, setOpenScheduleModal] = useRecoilState(openScheduleModalState);

  const [currentCalendar, setCurrentCalendar] = useState(dayjs());

  const { data: calendarSchedule } = useGetScheduleList({ date: dayjs().toISOString() });

  useFocusEffect(() => {
    if (bottomSafeArea === MAIN_COLOR) {
      return;
    }
    setBottomSafeArea(MAIN_COLOR);
  });

  const onPressScheduleModalClose = useCallback(() => {
    setOpenScheduleModal(false);
    setSelectedDate(null);
  }, []);

  const onPressAddSchedule = useCallback((date: Dayjs) => {
    navigation.navigate('AddSchedulePage', { date: date.toISOString() });
  }, []);

  const makeCalendar = useCallback(() => {
    return Array.from({ length: NUM_OF_YEAR_RANGE }, (_, year) => year)
      .map((year) => {
        return Array.from({ length: NUM_OF_MONTHS }, (_, month) => month).map((month) => {
          return (
            <Calendar
              categoryList={categoryList}
              month={month}
              year={currentCalendar.year()}
              calendarSchedule={calendarSchedule?.data}
              onPressAddSchedule={onPressAddSchedule}
              onPressScheduleModalClose={onPressScheduleModalClose}
            />
          );
        });
      })
      .flatMap((item) => item);
  }, [categoryList, currentCalendar.year(), calendarSchedule?.data, onPressAddSchedule, onPressScheduleModalClose]);

  return (
    <>
      <Carousel pageWidth={SCREEN_WIDTH} pages={makeCalendar()} />
      <AddScheduleModal
        open={openScheduleModal}
        date={selectedDate || currentCalendar}
        day={(selectedDate || currentCalendar).date()}
        close={onPressScheduleModalClose}
        onPressAddSchedule={() => selectedDate && onPressAddSchedule(selectedDate)}
        calendarSchedule={calendarSchedule?.data}
      />
    </>
  );
};

export default CalendarPage;
