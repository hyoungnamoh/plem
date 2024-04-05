import { NativeStackScreenProps } from '@react-navigation/native-stack';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { CalendarTabStackParamList } from 'tabs/CalendarTab';
import { useGetScheduleList } from 'hooks/queries/useGetScheduleList';
import { categoryListState } from 'states/categoryListState';
import { useFocusEffect } from '@react-navigation/native';
import Carousel from 'components/Carousel/Carousel';
import Calendar from './Calendar';
import { AddScheduleModal } from './AddScheduleModal';
import { selectedCalendarDateState } from 'states/selectedCalendarDateState';
import { openScheduleModalState } from 'states/openScheduleModalState';
import { SCREEN_WIDTH } from 'constants/etc';

type CalendarPageProps = NativeStackScreenProps<CalendarTabStackParamList, 'CalendarPage'>;

const NUM_OF_YEAR_RANGE = 100;
const NUM_OF_MONTHS = 12;

const CalendarPage = ({ navigation, route }: CalendarPageProps) => {
  const categoryList = useRecoilValue(categoryListState);
  const [selectedDate, setSelectedDate] = useRecoilState(selectedCalendarDateState);
  const [openScheduleModal, setOpenScheduleModal] = useRecoilState(openScheduleModalState);

  const { data: calendarSchedule } = useGetScheduleList();
  const [currentDate, setCurrentDate] = useState(dayjs());

  useEffect(() => {
    if (route.params?.selectedDate) {
      setSelectedDate(dayjs.unix(route.params.selectedDate));
      setOpenScheduleModal(true);
    }
  }, [route.params?.selectedDate]);

  useFocusEffect(() => {
    if (currentDate.get('date') !== dayjs().get('date')) {
      setCurrentDate(dayjs());
    }
  });

  // useEffect(() => {
  //   // TODO: 공식문서(6 버전)에서도 쓰는데 addListener의 tabPress가 없다고 함
  //   const unsubscribe = navigation.getParent()?.addListener('tabPress' as any, (e) => {
  //     // navigation.replace('CalendarPage');
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  const onPressScheduleModalClose = useCallback(() => {
    setOpenScheduleModal(false);
    setSelectedDate(null);
  }, []);

  const onPressAddSchedule = useCallback((date: Dayjs) => {
    navigation.navigate('AddSchedulePage', { date: date.startOf('date').toISOString() });
  }, []);

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
              year={currentDate.year() + year}
              onPressAddSchedule={onPressAddSchedule}
              onPressScheduleModalClose={onPressScheduleModalClose}
            />
          );
        });
      })
      .flatMap((item) => item);
  }, [
    categoryList,
    currentDate.year(),
    currentDate.month(),
    currentDate.date(),
    calendarSchedule?.data,
    onPressAddSchedule,
    onPressScheduleModalClose,
  ]);

  return (
    <>
      <Carousel
        pageWidth={SCREEN_WIDTH}
        pages={makeCalendar}
        defaultPage={makeCalendar.length / 2 + currentDate.month()}
      />
      <AddScheduleModal
        open={openScheduleModal}
        targetDate={selectedDate || currentDate}
        close={onPressScheduleModalClose}
        onPressAddSchedule={() => selectedDate && onPressAddSchedule(selectedDate)}
      />
    </>
  );
};

export default CalendarPage;
