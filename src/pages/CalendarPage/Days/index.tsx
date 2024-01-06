import dayjs from 'dayjs';
import Day from './Day';
import uuid from 'react-uuid';
import { Fragment, memo, useMemo, useState } from 'react';
import EmptyDates from './EmptyDates';
import { CalendarSchedule, ScheduleMap } from '../../../api/schedules/getScheduleListApi';

const Days = ({
  noRepeatScheduleMap,
  monthlyRepeatScheduleList,
  twoWeeklyRepeatScheduleMap,
  weeklyRepeatScheduleMap,
  dailyRepeatScheduleList,
  year,
  month,
}: {
  noRepeatScheduleMap?: CalendarSchedule['noRepeatSchedules'];
  monthlyRepeatScheduleList?: CalendarSchedule['repeatSchedules']['monthlyRepeatScheduleMap'];
  twoWeeklyRepeatScheduleMap?: ScheduleMap;
  weeklyRepeatScheduleMap?: ScheduleMap;
  dailyRepeatScheduleList?: CalendarSchedule['repeatSchedules']['dailyRepeatSchedules'];
  year: number;
  month: number;
}) => {
  const [localSelectedDate, setLocalSelectedDate] = useState<number>(0);

  const today = useMemo(() => dayjs().startOf('date'), []); // 현재일의 시작 시간 00:00
  const targetDate = useMemo(() => dayjs().set('year', year).set('month', month), [year, month]);
  const datesOfMonth = useMemo(
    () => Array.from(new Array(targetDate.daysInMonth()).fill(0), (_, index) => index + 1),
    [targetDate.daysInMonth(), year, month]
  );
  const firstDateIndex = useMemo(
    () => targetDate.startOf('month').day(),
    [targetDate.startOf('month').day(), year, month]
  );

  return (
    <>
      <EmptyDates firstDateIndex={firstDateIndex} />
      {datesOfMonth.map((date) => {
        const isToday = today.date() === date && today.year() === year && today.month() === month;
        return (
          <Day
            key={uuid()}
            isToday={isToday}
            firstDateIndex={firstDateIndex}
            noRepeatScheduleMap={noRepeatScheduleMap}
            monthlyRepeatScheduleList={monthlyRepeatScheduleList}
            twoWeeklyRepeatScheduleMap={twoWeeklyRepeatScheduleMap}
            weeklyRepeatScheduleMap={weeklyRepeatScheduleMap}
            dailyRepeatScheduleList={dailyRepeatScheduleList}
            date={date}
            year={year}
            month={month}
            isSelected={localSelectedDate === date}
            setLocalSelectedDate={setLocalSelectedDate}
          />
        );
      })}
    </>
  );
};

export default memo(Days);
