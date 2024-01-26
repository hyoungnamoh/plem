import { NativeStackScreenProps } from '@react-navigation/native-stack';
import dayjs, { Dayjs, ManipulateType } from 'dayjs';
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
import { cloneDeep } from 'lodash';

type CalendarPageProps = NativeStackScreenProps<CalendarTabStackParamList, 'CalendarPage'>;

const NUM_OF_YEAR_RANGE = 100;
const NUM_OF_MONTHS = 12;

const makeRepeatScheduleMap = ({
  firstScheduleDate,
  lastScheduleDate,
  dateList,
  schedule,
  scheduleMap,
}: {
  firstScheduleDate: Dayjs;
  lastScheduleDate: Dayjs;
  dateList: Dayjs[];
  schedule: Schedule;
  scheduleMap: {
    [year: number]: {
      [month: number]: {
        [date: number]: Schedule[];
      };
    };
  };
}) => {
  const newScheduleMap = cloneDeep(scheduleMap);
  for (let year = firstScheduleDate.get('year'); year <= lastScheduleDate.get('year'); year++) {
    if (!newScheduleMap[year]) {
      newScheduleMap[year] = {};
    }
    for (let month = 0; month <= 11; month++) {
      const yearMonth = dayjs().set('year', year).set('month', month);
      if (!newScheduleMap[year][month]) {
        newScheduleMap[year][month] = {};
      }
      for (let date = 1; date <= yearMonth.daysInMonth(); date++) {
        if (!newScheduleMap[year][month][date]) {
          newScheduleMap[year][month][date] = [];
        }
      }
    }
  }

  dateList.map((dateItem) => {
    newScheduleMap[dateItem.get('year')][dateItem.get('month')][dateItem.get('date')].push(schedule);
  });

  return newScheduleMap;
};

const getRepeatScheduleMap = ({
  repeatSchedules,
  repeat,
  repeatUnit,
}: {
  repeatSchedules: Schedule[];
  repeat: number;
  repeatUnit: ManipulateType;
}) => {
  let newScheduleMap = {};

  repeatSchedules.map((schedule) => {
    const repeatDateList: Dayjs[] = [];
    const startDate = dayjs(schedule.startDate);
    const endDate = dayjs(schedule.endDate);
    let repeatDate = startDate;

    while (!repeatDate.isAfter(endDate)) {
      repeatDateList.push(repeatDate);
      repeatDate = repeatDate.add(repeat, repeatUnit);
    }
    newScheduleMap = makeRepeatScheduleMap({
      firstScheduleDate: startDate,
      lastScheduleDate: repeatDate,
      dateList: repeatDateList,
      schedule,
      scheduleMap: newScheduleMap,
    });
  });

  return newScheduleMap;
};

const CalendarPage = ({ navigation }: CalendarPageProps) => {
  const categoryList = useRecoilValue(categoryListState);
  const [bottomSafeArea, setBottomSafeArea] = useRecoilState(bottomSafeAreaState);
  const [selectedDate, setSelectedDate] = useRecoilState(selectedCalendarDateState);
  const [openScheduleModal, setOpenScheduleModal] = useRecoilState(openScheduleModalState);

  const [currentCalendar, setCurrentCalendar] = useState(dayjs());
  const { data: calendarSchedule } = useGetScheduleList();
  const yearlyRepeatScheduleMap = useMemo(
    () =>
      getRepeatScheduleMap({
        repeatSchedules: calendarSchedule?.data.repeatSchedules?.yearlyRepeatSchedules || [],
        repeat: 1,
        repeatUnit: 'year',
      }),
    [calendarSchedule?.data.repeatSchedules?.yearlyRepeatSchedules]
  );
  const monthlyRepeatScheduleMap = useMemo(
    () =>
      getRepeatScheduleMap({
        repeatSchedules: calendarSchedule?.data.repeatSchedules?.monthlyRepeatSchedules || [],
        repeat: 1,
        repeatUnit: 'month',
      }),
    [calendarSchedule?.data.repeatSchedules?.monthlyRepeatSchedules]
  );
  const twoWeeklyRepeatScheduleMap = useMemo(
    () =>
      getRepeatScheduleMap({
        repeatSchedules: calendarSchedule?.data.repeatSchedules?.twoWeeklyRepeatSchedules || [],
        repeat: 14,
        repeatUnit: 'day',
      }),
    [calendarSchedule?.data.repeatSchedules?.twoWeeklyRepeatSchedules]
  );
  const weeklyRepeatScheduleMap = useMemo(
    () =>
      getRepeatScheduleMap({
        repeatSchedules: calendarSchedule?.data.repeatSchedules?.weeklyRepeatSchedules || [],
        repeat: 7,
        repeatUnit: 'day',
      }),
    [calendarSchedule?.data.repeatSchedules?.weeklyRepeatSchedules]
  );

  const dailyRepeatScheduleMap = useMemo(
    () =>
      getRepeatScheduleMap({
        repeatSchedules: calendarSchedule?.data.repeatSchedules?.dailyRepeatSchedules || [],
        repeat: 1,
        repeatUnit: 'day',
      }),
    [calendarSchedule?.data.repeatSchedules?.dailyRepeatSchedules]
  );

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
              monthlyRepeatScheduleMap={monthlyRepeatScheduleMap}
              twoWeeklyRepeatScheduleMap={twoWeeklyRepeatScheduleMap}
              weeklyRepeatScheduleMap={weeklyRepeatScheduleMap}
              dailyRepeatScheduleMap={dailyRepeatScheduleMap}
              yearlyRepeatScheduleMap={yearlyRepeatScheduleMap}
            />
          );
        });
      })
      .flatMap((item) => item);
  }, [
    categoryList,
    currentCalendar.year(),
    currentCalendar.date(),
    calendarSchedule?.data,
    onPressAddSchedule,
    onPressScheduleModalClose,
  ]);

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
        monthlyRepeatScheduleMap={monthlyRepeatScheduleMap}
        twoWeeklyRepeatScheduleMap={twoWeeklyRepeatScheduleMap}
        weeklyRepeatScheduleMap={weeklyRepeatScheduleMap}
        dailyRepeatScheduleMap={dailyRepeatScheduleMap}
        yearlyRepeatScheduleMap={yearlyRepeatScheduleMap}
      />
    </>
  );
};

export default CalendarPage;
