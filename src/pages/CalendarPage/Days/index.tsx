import dayjs from 'dayjs';
import Day from './Day';
import { memo, useMemo } from 'react';
import EmptyDates from './EmptyDates';
import { useRecoilValue } from 'recoil';
import { globalCurrentDateState } from 'states/globalCurrentDateState';
import { selectedCalendarDateState } from 'states/selectedCalendarDateState';

const Days = ({ year, month }: { year: number; month: number }) => {
  const globalCurrentDate = useRecoilValue(globalCurrentDateState);
  const selectedDate = useRecoilValue(selectedCalendarDateState);

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
        const isToday =
          globalCurrentDate.date() === date && globalCurrentDate.year() === year && globalCurrentDate.month() === month;
        const isSelectedDate =
          selectedDate?.date() === date && selectedDate?.year() === year && selectedDate?.month() === month;
        return (
          <Day
            key={`day-${year}-${month}-${date}`}
            isToday={isToday}
            firstDateIndex={firstDateIndex}
            date={date}
            year={year}
            month={month}
            isSelected={isSelectedDate}
          />
        );
      })}
    </>
  );
};

export default memo(Days);
